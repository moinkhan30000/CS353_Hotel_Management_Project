from decimal import Decimal

from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.conf import settings
from django.core.mail import send_mail
from django.db import transaction
from django.db.models import Count, Sum
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from rest_framework import generics, permissions, status, viewsets
from rest_framework.decorators import action, api_view, permission_classes, throttle_classes
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken, TokenError

from .models import Amenity, Booking, Hotel, HotelImage, LoyaltyMembership, Report, Review, Room, Transaction, Wallet
from .permissions import IsAdminRole, IsGuestRole, IsManagerRole
from .serializers import AmenitySerializer, BookingSerializer, HotelImageSerializer, HotelSerializer, LoginSerializer, NewsletterSubscriptionSerializer, PasswordChangeSerializer, PasswordResetConfirmSerializer, RegistrationSerializer, ReportSerializer, ReviewSerializer, RoomSerializer, UserSerializer, WalletSerializer
from .throttles import AuthenticationThrottle, FinancialActionThrottle, PasswordResetThrottle, PublicWriteThrottle

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    serializer_class = RegistrationSerializer
    permission_classes = [permissions.AllowAny]
    throttle_classes = [AuthenticationThrottle]


class LoginView(TokenObtainPairView):
    serializer_class = LoginSerializer
    permission_classes = [permissions.AllowAny]
    throttle_classes = [AuthenticationThrottle]


class RefreshView(TokenRefreshView):
    permission_classes = [permissions.AllowAny]
    throttle_classes = [AuthenticationThrottle]


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class HotelViewSet(viewsets.ModelViewSet):
    serializer_class = HotelSerializer
    queryset = Hotel.objects.select_related('manager').prefetch_related('images', 'amenities', 'rooms__amenities')
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = super().get_queryset()
        query = self.request.query_params.get('search')
        if query:
            queryset = queryset.filter(city__icontains=query) | queryset.filter(country__icontains=query) | queryset.filter(name__icontains=query)
        return queryset.distinct()

    def perform_create(self, serializer):
        if self.request.user.role != User.Role.MANAGER:
            self.permission_denied(self.request)
        serializer.save(manager=self.request.user)

    def perform_update(self, serializer):
        if serializer.instance.manager != self.request.user and self.request.user.role != User.Role.ADMIN:
            self.permission_denied(self.request)
        serializer.save()

    def perform_destroy(self, instance):
        if instance.manager != self.request.user and self.request.user.role != User.Role.ADMIN:
            self.permission_denied(self.request)
        instance.delete()

    @action(detail=False, methods=['get'], permission_classes=[IsManagerRole])
    def mine(self, request):
        hotel = Hotel.objects.filter(manager=request.user).first()
        return Response(HotelSerializer(hotel, context={'request': request}).data if hotel else None)

    @action(detail=True, methods=['post'], permission_classes=[IsManagerRole])
    def images(self, request, pk=None):
        hotel = self.get_object()
        if hotel.manager != request.user:
            self.permission_denied(request)
        serializer = HotelImageSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save(hotel=hotel)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class AmenityViewSet(viewsets.ModelViewSet):
    queryset = Amenity.objects.all().order_by('name')
    serializer_class = AmenitySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_permissions(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            return [(IsManagerRole | IsAdminRole)()]
        return super().get_permissions()

    def perform_create(self, serializer):
        if self.request.user.role not in (User.Role.MANAGER, User.Role.ADMIN):
            self.permission_denied(self.request)
        serializer.save()

    def perform_update(self, serializer):
        if self.request.user.role not in (User.Role.MANAGER, User.Role.ADMIN):
            self.permission_denied(self.request)
        serializer.save()


class RoomViewSet(viewsets.ModelViewSet):
    serializer_class = RoomSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_permissions(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            return [IsManagerRole()]
        return super().get_permissions()

    def get_queryset(self):
        queryset = Room.objects.prefetch_related('amenities')
        if self.action in ('list', 'create', 'update', 'partial_update', 'destroy') and self.request.user.is_authenticated and self.request.user.role == User.Role.MANAGER:
            return queryset.filter(hotel__manager=self.request.user)
        return queryset

    def perform_create(self, serializer):
        if self.request.user.role != User.Role.MANAGER:
            self.permission_denied(self.request)
        serializer.save(hotel=self.request.user.hotel)


class HotelImageViewSet(viewsets.ModelViewSet):
    serializer_class = HotelImageSerializer
    permission_classes = [IsManagerRole]

    def get_queryset(self):
        return HotelImage.objects.filter(hotel__manager=self.request.user)

    def perform_create(self, serializer):
        serializer.save(hotel=self.request.user.hotel)


class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer

    def get_permissions(self):
        if self.action in ('create', 'pay'):
            return [IsGuestRole()]
        if self.action in ('update', 'partial_update', 'destroy'):
            return [IsAdminRole()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        queryset = Booking.objects.select_related('guest', 'room', 'room__hotel').prefetch_related('guests')
        if self.request.user.role == User.Role.GUEST:
            return queryset.filter(guest=self.request.user)
        if self.request.user.role == User.Role.MANAGER:
            return queryset.filter(room__hotel__manager=self.request.user)
        return queryset

    def perform_create(self, serializer):
        if self.request.user.role != User.Role.GUEST:
            self.permission_denied(self.request)
        serializer.save()

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        booking = self.get_object()
        if booking.status == Booking.Status.CANCELLED:
            return Response({'detail': 'Booking is already cancelled.'}, status=400)
        booking.status = Booking.Status.CANCELLED
        booking.save(update_fields=['status'])
        return Response(self.get_serializer(booking).data)

    @action(detail=True, methods=['post'], permission_classes=[IsGuestRole], throttle_classes=[FinancialActionThrottle])
    @transaction.atomic
    def pay(self, request, pk=None):
        booking = self.get_queryset().select_for_update().get(pk=pk)
        if booking.status != Booking.Status.PENDING:
            return Response({'detail': 'Only pending bookings can be paid.'}, status=400)
        wallet = Wallet.objects.select_for_update().get(user=request.user)
        if wallet.balance < booking.amount_due:
            return Response({'detail': 'Insufficient wallet balance.'}, status=400)
        wallet.balance -= booking.amount_due
        wallet.save()
        points = int(booking.amount_due // 10)
        Transaction.objects.create(wallet=wallet, booking=booking, amount=-booking.amount_due, transaction_type=Transaction.Type.BOOKING, points_earned=points)
        loyalty, _ = LoyaltyMembership.objects.select_for_update().get_or_create(user=request.user)
        loyalty.points += points
        loyalty.save()
        booking.status = Booking.Status.CONFIRMED
        booking.save(update_fields=['status'])
        return Response(self.get_serializer(booking).data)


class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_permissions(self):
        if self.action == 'create':
            return [IsGuestRole()]
        if self.action in ('update', 'partial_update', 'destroy'):
            return [permissions.IsAuthenticated()]
        return super().get_permissions()

    def get_queryset(self):
        queryset = Review.objects.select_related('guest', 'hotel', 'booking')
        hotel = self.request.query_params.get('hotel')
        if self.request.user.is_authenticated and self.request.user.role == User.Role.MANAGER:
            return queryset.filter(hotel__manager=self.request.user)
        if self.request.user.is_authenticated and self.request.user.role == User.Role.GUEST and not hotel:
            return queryset.filter(guest=self.request.user)
        return queryset.filter(hotel_id=hotel) if hotel else queryset

    def perform_update(self, serializer):
        review = serializer.instance
        if self.request.user.role == User.Role.MANAGER:
            serializer.validated_data.clear()
            serializer.save(response=self.request.data.get('response', review.response))
        elif review.guest == self.request.user:
            serializer.validated_data.pop('booking', None)
            serializer.save()
        else:
            self.permission_denied(self.request)

    def perform_destroy(self, instance):
        if instance.guest != self.request.user and self.request.user.role != User.Role.ADMIN:
            self.permission_denied(self.request)
        instance.delete()


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def health(request):
    return Response({'status': 'ok'})


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
@throttle_classes([PublicWriteThrottle])
def subscribe(request):
    serializer = NewsletterSubscriptionSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response({'detail': 'You are subscribed to HorizonStay updates.'}, status=201)


@api_view(['GET'])
@permission_classes([IsGuestRole])
def wallet(request):
    value, _ = Wallet.objects.get_or_create(user=request.user)
    return Response(WalletSerializer(value).data)


@api_view(['GET'])
@permission_classes([IsGuestRole])
def loyalty(request):
    value, _ = LoyaltyMembership.objects.get_or_create(user=request.user)
    return Response({'level': value.level, 'points': value.points, 'conversion_rate': value.conversion_rate})


@api_view(['POST'])
def change_password(request):
    serializer = PasswordChangeSerializer(data=request.data, context={'request': request})
    serializer.is_valid(raise_exception=True)
    if not request.user.check_password(serializer.validated_data['old_password']):
        return Response({'detail': 'Current password is incorrect.'}, status=400)
    request.user.set_password(serializer.validated_data['new_password'])
    request.user.save(update_fields=['password'])
    return Response({'detail': 'Password updated successfully.'})


@api_view(['POST'])
@permission_classes([IsGuestRole])
@throttle_classes([FinancialActionThrottle])
@transaction.atomic
def top_up(request):
    try:
        amount = Decimal(str(request.data.get('amount')))
    except Exception:
        return Response({'detail': 'Enter a valid amount.'}, status=400)
    if not amount.is_finite() or amount <= 0:
        return Response({'detail': 'Amount must be positive.'}, status=400)
    if amount.as_tuple().exponent < -2 or amount > Decimal('100000.00'):
        return Response({'detail': 'Amount must have at most two decimal places and cannot exceed 100000.00.'}, status=400)
    value, _ = Wallet.objects.select_for_update().get_or_create(user=request.user)
    value.balance += amount
    value.save()
    Transaction.objects.create(wallet=value, amount=amount, transaction_type=Transaction.Type.TOP_UP, method='card')
    return Response(WalletSerializer(value).data)


@api_view(['POST'])
@permission_classes([IsGuestRole])
@throttle_classes([FinancialActionThrottle])
@transaction.atomic
def redeem_points(request):
    try:
        points = int(request.data.get('points', 0))
    except (TypeError, ValueError):
        return Response({'detail': 'Enter a valid number of points.'}, status=400)
    membership, _ = LoyaltyMembership.objects.select_for_update().get_or_create(user=request.user)
    if points <= 0 or points > membership.points:
        return Response({'detail': 'Not enough loyalty points.'}, status=400)
    wallet, _ = Wallet.objects.select_for_update().get_or_create(user=request.user)
    amount = Decimal(points) * membership.conversion_rate
    membership.points -= points
    membership.save()
    wallet.balance += amount
    wallet.save()
    transaction_value = Transaction.objects.create(wallet=wallet, amount=amount, transaction_type=Transaction.Type.REDEEM, points_used=points)
    return Response({'points': membership.points, 'balance': wallet.balance, 'transaction_id': transaction_value.id, 'amount': amount})


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
@throttle_classes([PasswordResetThrottle])
def request_password_reset(request):
    user = User.objects.filter(email__iexact=request.data.get('email', '')).first()
    if user:
        value = f"{urlsafe_base64_encode(force_bytes(user.pk))}-{default_token_generator.make_token(user)}"
        url = f"{settings.FRONTEND_URL.rstrip('/')}/reset-password/{value}"
        send_mail('Reset your HorizonStay password', f'Open this link to reset your password: {url}', None, [user.email])
    return Response({'detail': 'If that email exists, a reset link has been sent.'})


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
@throttle_classes([PasswordResetThrottle])
def confirm_password_reset(request):
    serializer = PasswordResetConfirmSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    try:
        uid, token = serializer.validated_data['token'].split('-', 1)
        user = User.objects.get(pk=force_str(urlsafe_base64_decode(uid)))
    except (ValueError, TypeError, User.DoesNotExist):
        return Response({'detail': 'The reset link is invalid.'}, status=400)
    if not default_token_generator.check_token(user, token):
        return Response({'detail': 'The reset link is invalid or expired.'}, status=400)
    user.set_password(serializer.validated_data['password'])
    user.save(update_fields=['password'])
    return Response({'detail': 'Password updated successfully.'})


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
@throttle_classes([AuthenticationThrottle])
def logout_view(request):
    token = request.data.get('refresh')
    if not token:
        return Response({'detail': 'Refresh token is required.'}, status=400)
    try:
        RefreshToken(token).blacklist()
    except TokenError:
        return Response({'detail': 'Refresh token is invalid or expired.'}, status=400)
    return Response(status=204)


@api_view(['GET', 'POST'])
@permission_classes([IsAdminRole])
def reports(request):
    if request.method == 'POST':
        users = list(User.objects.values('role').annotate(total=Count('id')).order_by('role'))
        bookings = list(Booking.objects.values('status').annotate(total=Count('id')).order_by('status'))
        revenue = Booking.objects.filter(status=Booking.Status.CONFIRMED).aggregate(total=Sum('amount_due'))['total'] or 0
        report = Report.objects.create(generated_by=request.user, title=request.data.get('title', 'Platform report'), content={'users': users, 'hotels': Hotel.objects.count(), 'bookings': bookings, 'revenue': str(revenue)})
        return Response(ReportSerializer(report).data, status=201)
    return Response(ReportSerializer(Report.objects.all().order_by('-generated_at'), many=True).data)
