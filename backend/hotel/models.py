from decimal import Decimal

from django.contrib.auth.models import AbstractUser
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = 'admin', 'Admin'
        GUEST = 'guest', 'Guest'
        MANAGER = 'manager', 'Manager'

    email = models.EmailField(unique=True)
    role = models.CharField(max_length=10, choices=Role.choices)
    phone_number = models.CharField(max_length=20, unique=True, null=True, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'role']


class GuestProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='guest_profile')
    date_of_birth = models.DateField()
    identity_number = models.CharField(max_length=30, unique=True)
    gender = models.CharField(max_length=20, blank=True)


class ManagerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='manager_profile')


class Hotel(models.Model):
    class Status(models.TextChoices):
        OPEN = 'open', 'Open'
        CLOSED = 'closed', 'Closed'
        MAINTENANCE = 'under_maintenance', 'Under maintenance'

    manager = models.OneToOneField(User, on_delete=models.CASCADE, related_name='hotel')
    name = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    address = models.CharField(max_length=255)
    email = models.EmailField()
    phone_number = models.CharField(max_length=20)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=24, choices=Status.choices, default=Status.OPEN)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def rating(self):
        return self.reviews.aggregate(value=models.Avg('rating'))['value'] or 0


class HotelImage(models.Model):
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='hotels/', blank=True)
    image_url = models.URLField(blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)


class Amenity(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    hotels = models.ManyToManyField(Hotel, related_name='amenities', blank=True)


class Room(models.Model):
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE, related_name='rooms')
    name = models.CharField(max_length=100)
    room_type = models.CharField(max_length=100)
    capacity = models.PositiveIntegerField(default=1)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    amenities = models.ManyToManyField(Amenity, related_name='rooms', blank=True)


class Booking(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        CONFIRMED = 'confirmed', 'Confirmed'
        CANCELLED = 'cancelled', 'Cancelled'

    guest = models.ForeignKey(User, on_delete=models.PROTECT, related_name='bookings')
    room = models.ForeignKey(Room, on_delete=models.PROTECT, related_name='bookings')
    check_in = models.DateField()
    check_out = models.DateField()
    status = models.CharField(max_length=12, choices=Status.choices, default=Status.PENDING)
    amount_due = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)


class BookingGuest(models.Model):
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='guests')
    name = models.CharField(max_length=255)
    age = models.PositiveIntegerField()


class Wallet(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='wallet')
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))
    updated_at = models.DateTimeField(auto_now=True)


class Transaction(models.Model):
    class Type(models.TextChoices):
        TOP_UP = 'top_up', 'Top up'
        BOOKING = 'booking', 'Booking'
        REFUND = 'refund', 'Refund'
        REDEEM = 'redeem', 'Redeem'

    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE, related_name='transactions')
    booking = models.ForeignKey(Booking, on_delete=models.SET_NULL, related_name='transactions', null=True, blank=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    transaction_type = models.CharField(max_length=12, choices=Type.choices)
    method = models.CharField(max_length=50, default='wallet')
    status = models.CharField(max_length=20, default='completed')
    points_used = models.PositiveIntegerField(default=0)
    points_earned = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)


class LoyaltyMembership(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='loyalty')
    level = models.CharField(max_length=50, default='Bronze')
    points = models.PositiveIntegerField(default=0)
    joined_at = models.DateField(auto_now_add=True)
    conversion_rate = models.DecimalField(max_digits=8, decimal_places=4, default=Decimal('0.01'))


class Review(models.Model):
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, related_name='review')
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE, related_name='reviews')
    guest = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    text = models.TextField()
    rating = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(10)])
    response = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Report(models.Model):
    generated_by = models.ForeignKey(User, on_delete=models.PROTECT, related_name='reports')
    title = models.CharField(max_length=255)
    content = models.JSONField(default=dict)
    generated_at = models.DateTimeField(auto_now_add=True)
