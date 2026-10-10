from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import Amenity, Booking, BookingGuest, GuestProfile, Hotel, HotelImage, LoyaltyMembership, ManagerProfile, Report, Review, Room, Transaction, User, Wallet

admin.site.register(User, UserAdmin)
admin.site.register([GuestProfile, ManagerProfile, Hotel, HotelImage, Amenity, Room, Booking, BookingGuest, Wallet, Transaction, LoyaltyMembership, Review, Report])
