from datetime import date, timedelta
from decimal import Decimal

from django.core.management.base import BaseCommand
from django.db import transaction

from hotel.models import Amenity, Booking, BookingGuest, GuestProfile, Hotel, HotelImage, LoyaltyMembership, ManagerProfile, Review, Room, Transaction, User, Wallet


class Command(BaseCommand):
    help = 'Create repeatable demo data for local development'

    @transaction.atomic
    def handle(self, *args, **options):
        admin = self.user('admin@hotel.test', 'Admin123!', User.Role.ADMIN, 'Platform', 'Admin')
        admin.is_staff = True
        admin.is_superuser = True
        admin.save()

        manager = self.user('manager@hotel.test', 'Manager123!', User.Role.MANAGER, 'Maya', 'Patel', '9876543210')
        ManagerProfile.objects.get_or_create(user=manager)
        guest = self.user('guest@hotel.test', 'Guest123!', User.Role.GUEST, 'Daniel', 'Reed', '9876543211')
        GuestProfile.objects.get_or_create(user=guest, defaults={'date_of_birth': date(1995, 4, 12), 'identity_number': '12345678901'})
        wallet, _ = Wallet.objects.get_or_create(user=guest, defaults={'balance': Decimal('5000.00')})
        LoyaltyMembership.objects.get_or_create(user=guest, defaults={'points': 980})

        hotel, _ = Hotel.objects.update_or_create(manager=manager, defaults={
            'name': 'Oasis Grand Hotel', 'city': 'Goa', 'country': 'India',
            'address': '18 Seaside Road', 'email': 'stay@oasisgrand.test',
            'phone_number': '9876500000', 'description': 'A relaxed coastal hotel with modern rooms and easy beach access.',
            'status': Hotel.Status.OPEN,
        })
        HotelImage.objects.get_or_create(hotel=hotel, image_url='https://images.unsplash.com/photo-1566073771259-6a8506099945')
        wifi, _ = Amenity.objects.get_or_create(name='Free Wi-Fi')
        pool, _ = Amenity.objects.get_or_create(name='Swimming Pool')
        breakfast, _ = Amenity.objects.get_or_create(name='Breakfast')
        hotel.amenities.set([wifi, pool, breakfast])
        room, _ = Room.objects.update_or_create(hotel=hotel, name='Deluxe Ocean Room', defaults={'room_type': 'Deluxe', 'capacity': 2, 'quantity': 8, 'price': Decimal('1800.00')})
        room.amenities.set([wifi, breakfast])

        check_in = date.today() + timedelta(days=14)
        booking, _ = Booking.objects.get_or_create(guest=guest, room=room, check_in=check_in, defaults={'check_out': check_in + timedelta(days=3), 'status': Booking.Status.CONFIRMED, 'amount_due': Decimal('5400.00')})
        BookingGuest.objects.get_or_create(booking=booking, name=guest.get_full_name(), defaults={'age': 31})
        Review.objects.get_or_create(booking=booking, defaults={'hotel': hotel, 'guest': guest, 'text': 'Comfortable rooms and very helpful staff.', 'rating': 9})
        Transaction.objects.get_or_create(wallet=wallet, booking=booking, transaction_type=Transaction.Type.BOOKING, defaults={'amount': Decimal('-5400.00'), 'points_earned': 540})
        self.stdout.write(self.style.SUCCESS('Demo data is ready.'))

    def user(self, email, password, role, first_name, last_name, phone_number=None):
        user, created = User.objects.get_or_create(email=email, defaults={'username': email, 'role': role, 'first_name': first_name, 'last_name': last_name, 'phone_number': phone_number})
        if created or not user.check_password(password):
            user.set_password(password)
            user.save()
        return user
