from datetime import date, timedelta
from decimal import Decimal

from django.urls import reverse
from rest_framework.test import APITestCase

from .models import Amenity, Booking, GuestProfile, Hotel, LoyaltyMembership, ManagerProfile, NewsletterSubscription, Report, Review, Room, Transaction, User, Wallet


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

    def test_public_can_subscribe_once(self):
        first = self.client.post('/api/v1/newsletter/subscribe/', {'email': 'traveler@example.com'})
        second = self.client.post('/api/v1/newsletter/subscribe/', {'email': 'traveler@example.com'})
        self.assertEqual(first.status_code, 201)
        self.assertEqual(second.status_code, 201)
        self.assertEqual(NewsletterSubscription.objects.filter(email='traveler@example.com').count(), 1)

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
        booking.refresh_from_db()
        self.guest.wallet.refresh_from_db()
        self.guest.loyalty.refresh_from_db()
        transaction = Transaction.objects.get(booking=booking)
        self.assertEqual(booking.status, Booking.Status.CONFIRMED)
        self.assertEqual(self.guest.wallet.balance, Decimal('800.00'))
        self.assertEqual(self.guest.loyalty.points, 20)
        self.assertEqual(transaction.amount, Decimal('-200.00'))
        self.assertEqual(transaction.transaction_type, Transaction.Type.BOOKING)
        self.assertEqual(transaction.points_earned, 20)

    def test_booking_rejects_unavailable_dates(self):
        check_in = date.today() + timedelta(days=7)
        Booking.objects.create(guest=self.guest, room=self.room, check_in=check_in, check_out=check_in + timedelta(days=2), status='confirmed', amount_due=Decimal('200.00'))
        self.authenticate('guest@test.local', 'Guest123!')
        response = self.client.post('/api/v1/bookings/', {'room': self.room.id, 'check_in': check_in, 'check_out': check_in + timedelta(days=1)}, format='json')
        self.assertEqual(response.status_code, 400)

    def test_guest_can_top_up_and_redeem_loyalty_points(self):
        LoyaltyMembership.objects.create(user=self.guest, points=500, conversion_rate=Decimal('0.10'))
        self.authenticate('guest@test.local', 'Guest123!')
        top_up = self.client.post('/api/v1/wallet/top-up/', {'amount': '50.00'})
        self.assertEqual(top_up.status_code, 200)
        redeemed = self.client.post('/api/v1/loyalty/redeem/', {'points': 100})
        self.assertEqual(redeemed.status_code, 200)
        self.assertEqual(redeemed.data['points'], 400)
        self.guest.wallet.refresh_from_db()
        membership = LoyaltyMembership.objects.get(user=self.guest)
        self.assertEqual(self.guest.wallet.balance, Decimal('1060.00'))
        self.assertEqual(membership.points, 400)
        self.assertTrue(Transaction.objects.filter(wallet=self.guest.wallet, transaction_type=Transaction.Type.TOP_UP, amount=Decimal('50.00')).exists())
        self.assertTrue(Transaction.objects.filter(wallet=self.guest.wallet, transaction_type=Transaction.Type.REDEEM, amount=Decimal('10.00'), points_used=100).exists())

    def test_manager_can_reply_to_own_hotel_review(self):
        booking = Booking.objects.create(guest=self.guest, room=self.room, check_in=date.today(), check_out=date.today() + timedelta(days=1), status='confirmed', amount_due=Decimal('100.00'))
        review = Review.objects.create(booking=booking, hotel=self.hotel, guest=self.guest, text='Great stay', rating=9)
        self.authenticate('manager@test.local', 'Manager123!')
        response = self.client.patch(f'/api/v1/reviews/{review.id}/', {'response': 'Thank you'}, format='json')
        self.assertEqual(response.status_code, 200)
        review.refresh_from_db()
        self.assertEqual(review.response, 'Thank you')

    def test_guest_registration_creates_related_database_records(self):
        response = self.client.post('/api/v1/auth/register/', {
            'email': 'newguest@test.local',
            'first_name': 'New',
            'last_name': 'Guest',
            'phone_number': '9111111111',
            'password': 'NewGuest123!',
            'role': 'guest',
            'date_of_birth': '1998-04-12',
            'identity_number': '98765432101',
        }, format='json')
        self.assertEqual(response.status_code, 201)
        user = User.objects.get(email='newguest@test.local')
        self.assertTrue(user.check_password('NewGuest123!'))
        self.assertEqual(user.role, User.Role.GUEST)
        self.assertEqual(GuestProfile.objects.get(user=user).identity_number, '98765432101')
        self.assertEqual(Wallet.objects.get(user=user).balance, Decimal('0.00'))
        self.assertEqual(LoyaltyMembership.objects.get(user=user).points, 0)

    def test_manager_registration_creates_manager_profile(self):
        response = self.client.post('/api/v1/auth/register/', {
            'email': 'newmanager@test.local',
            'first_name': 'New',
            'last_name': 'Manager',
            'phone_number': '9222222222',
            'password': 'NewManager123!',
            'role': 'manager',
        }, format='json')
        self.assertEqual(response.status_code, 201)
        user = User.objects.get(email='newmanager@test.local')
        self.assertEqual(user.role, User.Role.MANAGER)
        self.assertTrue(ManagerProfile.objects.filter(user=user).exists())

    def test_guest_profile_changes_persist(self):
        GuestProfile.objects.create(user=self.guest, date_of_birth='1995-04-12', identity_number='12345678901')
        self.authenticate('guest@test.local', 'Guest123!')
        response = self.client.patch('/api/v1/profile/', {
            'first_name': 'Updated',
            'last_name': 'Traveler',
            'phone_number': '9333333333',
            'date_of_birth': '1996-05-13',
            'gender': 'Female',
        }, format='json')
        self.assertEqual(response.status_code, 200)
        self.guest.refresh_from_db()
        self.guest.guest_profile.refresh_from_db()
        self.assertEqual(self.guest.first_name, 'Updated')
        self.assertEqual(self.guest.last_name, 'Traveler')
        self.assertEqual(self.guest.phone_number, '9333333333')
        self.assertEqual(str(self.guest.guest_profile.date_of_birth), '1996-05-13')
        self.assertEqual(self.guest.guest_profile.gender, 'Female')

    def test_cancelled_booking_status_persists(self):
        booking = Booking.objects.create(
            guest=self.guest,
            room=self.room,
            check_in=date.today() + timedelta(days=10),
            check_out=date.today() + timedelta(days=12),
            amount_due=Decimal('200.00'),
        )
        self.authenticate('guest@test.local', 'Guest123!')
        response = self.client.post(f'/api/v1/bookings/{booking.id}/cancel/')
        self.assertEqual(response.status_code, 200)
        booking.refresh_from_db()
        self.assertEqual(booking.status, Booking.Status.CANCELLED)

    def test_manager_hotel_amenity_and_room_changes_persist(self):
        self.authenticate('manager@test.local', 'Manager123!')
        amenity_response = self.client.post('/api/v1/amenities/', {'name': 'Test Spa', 'description': 'Quiet spa'}, format='json')
        self.assertEqual(amenity_response.status_code, 201)
        amenity = Amenity.objects.get(pk=amenity_response.data['id'])

        hotel_response = self.client.patch(f'/api/v1/hotels/{self.hotel.id}/', {
            'description': 'Updated database description',
            'status': Hotel.Status.MAINTENANCE,
            'amenity_ids': [amenity.id],
        }, format='json')
        self.assertEqual(hotel_response.status_code, 200)
        self.hotel.refresh_from_db()
        self.assertEqual(self.hotel.description, 'Updated database description')
        self.assertEqual(self.hotel.status, Hotel.Status.MAINTENANCE)
        self.assertEqual(list(self.hotel.amenities.values_list('id', flat=True)), [amenity.id])

        create_response = self.client.post('/api/v1/rooms/', {
            'name': 'Database Suite',
            'room_type': 'Suite',
            'capacity': 3,
            'quantity': 2,
            'price': '250.00',
            'amenity_ids': [amenity.id],
        }, format='json')
        self.assertEqual(create_response.status_code, 201)
        room = Room.objects.get(pk=create_response.data['id'])
        self.assertEqual(room.hotel, self.hotel)
        self.assertEqual(list(room.amenities.values_list('id', flat=True)), [amenity.id])

        update_response = self.client.patch(f'/api/v1/rooms/{room.id}/', {'price': '275.00', 'quantity': 4}, format='json')
        self.assertEqual(update_response.status_code, 200)
        room.refresh_from_db()
        self.assertEqual(room.price, Decimal('275.00'))
        self.assertEqual(room.quantity, 4)

        delete_response = self.client.delete(f'/api/v1/rooms/{room.id}/')
        self.assertEqual(delete_response.status_code, 204)
        self.assertFalse(Room.objects.filter(pk=room.id).exists())

    def test_guest_review_create_and_update_persist(self):
        booking = Booking.objects.create(
            guest=self.guest,
            room=self.room,
            check_in=date.today() - timedelta(days=2),
            check_out=date.today() - timedelta(days=1),
            status=Booking.Status.CONFIRMED,
            amount_due=Decimal('100.00'),
        )
        self.authenticate('guest@test.local', 'Guest123!')
        create_response = self.client.post('/api/v1/reviews/', {'booking': booking.id, 'text': 'A persisted review', 'rating': 8}, format='json')
        self.assertEqual(create_response.status_code, 201)
        review = Review.objects.get(pk=create_response.data['id'])
        self.assertEqual(review.hotel, self.hotel)
        self.assertEqual(review.guest, self.guest)

        update_response = self.client.patch(f'/api/v1/reviews/{review.id}/', {'text': 'An updated persisted review', 'rating': 9}, format='json')
        self.assertEqual(update_response.status_code, 200)
        review.refresh_from_db()
        self.assertEqual(review.text, 'An updated persisted review')
        self.assertEqual(review.rating, 9)

    def test_admin_report_creation_persists(self):
        admin = User.objects.create_user(username='admin@test.local', email='admin@test.local', password='Admin123!', role='admin')
        self.authenticate('admin@test.local', 'Admin123!')
        response = self.client.post('/api/v1/reports/', {'title': 'Persistence report'}, format='json')
        self.assertEqual(response.status_code, 201)
        report = Report.objects.get(pk=response.data['id'])
        self.assertEqual(report.generated_by, admin)
        self.assertEqual(report.title, 'Persistence report')
        self.assertIn('users', report.content)
        self.assertIn('bookings', report.content)
        self.assertIn('revenue', report.content)
