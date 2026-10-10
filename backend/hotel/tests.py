from datetime import date, timedelta
from decimal import Decimal

from django.urls import reverse
from rest_framework.test import APITestCase

from .models import Booking, Hotel, ManagerProfile, Room, User, Wallet


class HotelApiTests(APITestCase):
    def setUp(self):
        self.manager = User.objects.create_user(username='manager@test.local', email='manager@test.local', password='Manager123!', role='manager')
        ManagerProfile.objects.create(user=self.manager)
        self.hotel = Hotel.objects.create(manager=self.manager, name='Test Hotel', city='Goa', country='India', address='Test Road', email='hotel@test.local', phone_number='9000000000')
        self.room = Room.objects.create(hotel=self.hotel, name='Deluxe', room_type='Deluxe', capacity=2, quantity=1, price=Decimal('100.00'))
        self.guest = User.objects.create_user(username='guest@test.local', email='guest@test.local', password='Guest123!', role='guest')
        Wallet.objects.create(user=self.guest, balance=Decimal('1000.00'))

    def authenticate(self, email, password):
        response = self.client.post('/api/v1/auth/login/', {'email': email, 'password': password})
        self.assertEqual(response.status_code, 200)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {response.data['access']}")

    def test_public_can_list_hotels(self):
        response = self.client.get('/api/v1/hotels/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]['name'], 'Test Hotel')

    def test_guest_can_create_and_pay_for_booking(self):
        self.authenticate('guest@test.local', 'Guest123!')
        check_in = date.today() + timedelta(days=7)
        response = self.client.post('/api/v1/bookings/', {'room': self.room.id, 'check_in': check_in, 'check_out': check_in + timedelta(days=2), 'guests': [{'name': 'Test Guest', 'age': 30}]}, format='json')
        self.assertEqual(response.status_code, 201)
        booking = Booking.objects.get(pk=response.data['id'])
        self.assertEqual(booking.amount_due, Decimal('200.00'))
        paid = self.client.post(f'/api/v1/bookings/{booking.id}/pay/')
        self.assertEqual(paid.status_code, 200)
        self.assertEqual(paid.data['status'], 'confirmed')
        self.guest.wallet.refresh_from_db()
        self.assertEqual(self.guest.wallet.balance, Decimal('800.00'))

    def test_booking_rejects_unavailable_dates(self):
        check_in = date.today() + timedelta(days=7)
        Booking.objects.create(guest=self.guest, room=self.room, check_in=check_in, check_out=check_in + timedelta(days=2), status='confirmed', amount_due=Decimal('200.00'))
        self.authenticate('guest@test.local', 'Guest123!')
        response = self.client.post('/api/v1/bookings/', {'room': self.room.id, 'check_in': check_in, 'check_out': check_in + timedelta(days=1)}, format='json')
        self.assertEqual(response.status_code, 400)
