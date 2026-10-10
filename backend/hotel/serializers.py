from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.db import transaction
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import Amenity, Booking, BookingGuest, GuestProfile, Hotel, HotelImage, LoyaltyMembership, ManagerProfile, Report, Review, Room, Transaction, Wallet

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    date_of_birth = serializers.DateField(source='guest_profile.date_of_birth', required=False)
    identity_number = serializers.CharField(source='guest_profile.identity_number', required=False)
    gender = serializers.CharField(source='guest_profile.gender', required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'phone_number', 'role', 'date_of_birth', 'identity_number', 'gender')
        read_only_fields = ('id', 'role', 'identity_number')

    def update(self, instance, validated_data):
        guest_data = validated_data.pop('guest_profile', {})
        instance = super().update(instance, validated_data)
        if guest_data and hasattr(instance, 'guest_profile'):
            for key, value in guest_data.items():
                setattr(instance.guest_profile, key, value)
            instance.guest_profile.save()
        return instance


class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)

    def validate_new_password(self, value):
        validate_password(value, self.context['request'].user)
        return value


class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    date_of_birth = serializers.DateField(required=False, write_only=True)
    identity_number = serializers.CharField(required=False, write_only=True)

    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'phone_number', 'password', 'role', 'date_of_birth', 'identity_number')

    def validate(self, attrs):
        if attrs['role'] == User.Role.ADMIN:
            raise serializers.ValidationError({'role': 'Admin accounts cannot be created here.'})
        if attrs['role'] == User.Role.GUEST and (not attrs.get('date_of_birth') or not attrs.get('identity_number')):
            raise serializers.ValidationError('Guests must provide a date of birth and identity number.')
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        date_of_birth = validated_data.pop('date_of_birth', None)
        identity_number = validated_data.pop('identity_number', None)
        email = validated_data['email'].lower()
        user = User.objects.create_user(username=email, email=email, **{k: v for k, v in validated_data.items() if k != 'email'})
        if user.role == User.Role.GUEST:
            GuestProfile.objects.create(user=user, date_of_birth=date_of_birth, identity_number=identity_number)
            Wallet.objects.create(user=user)
            LoyaltyMembership.objects.create(user=user)
        else:
            ManagerProfile.objects.create(user=user)
        return user


class LoginSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = UserSerializer(self.user).data
        return data


class PasswordResetConfirmSerializer(serializers.Serializer):
    token = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate_password(self, value):
        validate_password(value)
        return value


class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenity
        fields = ('id', 'name', 'description')
        extra_kwargs = {'name': {'validators': []}}

    def create(self, validated_data):
        amenity, _ = Amenity.objects.get_or_create(name=validated_data['name'], defaults={'description': validated_data.get('description', '')})
        return amenity


class HotelImageSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = HotelImage
        fields = ('id', 'hotel', 'image', 'image_url', 'url', 'uploaded_at')
        read_only_fields = ('hotel',)

    def get_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        return obj.image_url


class RoomSerializer(serializers.ModelSerializer):
    amenities = AmenitySerializer(many=True, read_only=True)
    amenity_ids = serializers.PrimaryKeyRelatedField(source='amenities', queryset=Amenity.objects.all(), many=True, write_only=True, required=False)

    class Meta:
        model = Room
        fields = ('id', 'hotel', 'name', 'room_type', 'capacity', 'quantity', 'price', 'amenities', 'amenity_ids')
        read_only_fields = ('hotel',)


class HotelSerializer(serializers.ModelSerializer):
    rating = serializers.FloatField(read_only=True)
    images = HotelImageSerializer(many=True, read_only=True)
    amenities = AmenitySerializer(many=True, read_only=True)
    amenity_ids = serializers.PrimaryKeyRelatedField(source='amenities', queryset=Amenity.objects.all(), many=True, write_only=True, required=False)
    rooms = RoomSerializer(many=True, read_only=True)
    manager_name = serializers.CharField(source='manager.get_full_name', read_only=True)

    class Meta:
        model = Hotel
        fields = ('id', 'manager', 'manager_name', 'name', 'city', 'country', 'address', 'email', 'phone_number', 'description', 'status', 'rating', 'images', 'amenities', 'amenity_ids', 'rooms')
        read_only_fields = ('manager',)


class BookingGuestSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookingGuest
        fields = ('id', 'name', 'age')


class BookingSerializer(serializers.ModelSerializer):
    guests = BookingGuestSerializer(many=True, required=False)
    hotel = HotelSerializer(source='room.hotel', read_only=True)
    room_name = serializers.CharField(source='room.name', read_only=True)

    class Meta:
        model = Booking
        fields = ('id', 'guest', 'room', 'room_name', 'hotel', 'check_in', 'check_out', 'status', 'amount_due', 'guests', 'created_at')
        read_only_fields = ('guest', 'status', 'amount_due', 'created_at')

    def validate(self, attrs):
        check_in = attrs.get('check_in', getattr(self.instance, 'check_in', None))
        check_out = attrs.get('check_out', getattr(self.instance, 'check_out', None))
        room = attrs.get('room', getattr(self.instance, 'room', None))
        if check_in >= check_out:
            raise serializers.ValidationError('Check-out must be after check-in.')
        clashes = Booking.objects.filter(room=room, status__in=[Booking.Status.PENDING, Booking.Status.CONFIRMED], check_in__lt=check_out, check_out__gt=check_in)
        if self.instance:
            clashes = clashes.exclude(pk=self.instance.pk)
        clashes = clashes.count()
        if clashes >= room.quantity:
            raise serializers.ValidationError('No rooms are available for those dates.')
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        guests = validated_data.pop('guests', [])
        nights = (validated_data['check_out'] - validated_data['check_in']).days
        booking = Booking.objects.create(guest=self.context['request'].user, amount_due=validated_data['room'].price * nights, **validated_data)
        BookingGuest.objects.bulk_create([BookingGuest(booking=booking, **guest) for guest in guests])
        return booking


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ('id', 'booking', 'amount', 'transaction_type', 'method', 'status', 'points_used', 'points_earned', 'created_at')


class WalletSerializer(serializers.ModelSerializer):
    transactions = TransactionSerializer(many=True, read_only=True)

    class Meta:
        model = Wallet
        fields = ('balance', 'updated_at', 'transactions')


class LoyaltySerializer(serializers.ModelSerializer):
    class Meta:
        model = LoyaltyMembership
        fields = ('level', 'points', 'joined_at', 'conversion_rate')


class ReviewSerializer(serializers.ModelSerializer):
    guest_name = serializers.CharField(source='guest.get_full_name', read_only=True)
    hotel_name = serializers.CharField(source='hotel.name', read_only=True)

    class Meta:
        model = Review
        fields = ('id', 'booking', 'hotel', 'hotel_name', 'guest', 'guest_name', 'text', 'rating', 'response', 'created_at', 'updated_at')
        read_only_fields = ('hotel', 'guest', 'response')

    def create(self, validated_data):
        booking = validated_data['booking']
        if booking.guest != self.context['request'].user:
            raise serializers.ValidationError('You can only review your own booking.')
        if booking.status != Booking.Status.CONFIRMED:
            raise serializers.ValidationError('Only confirmed bookings can be reviewed.')
        return Review.objects.create(guest=self.context['request'].user, hotel=booking.room.hotel, **validated_data)


class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = ('id', 'title', 'content', 'generated_at')
