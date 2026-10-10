from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .views import AmenityViewSet, BookingViewSet, HotelImageViewSet, HotelViewSet, LoginView, ProfileView, RegisterView, ReviewViewSet, RoomViewSet, change_password, confirm_password_reset, health, loyalty, redeem_points, reports, request_password_reset, top_up, wallet

router = DefaultRouter()
router.register('hotels', HotelViewSet)
router.register('amenities', AmenityViewSet)
router.register('rooms', RoomViewSet, basename='room')
router.register('hotel-images', HotelImageViewSet, basename='hotel-image')
router.register('bookings', BookingViewSet, basename='booking')
router.register('reviews', ReviewViewSet, basename='review')

urlpatterns = [
    path('health/', health),
    path('auth/register/', RegisterView.as_view()),
    path('auth/login/', LoginView.as_view()),
    path('auth/refresh/', TokenRefreshView.as_view()),
    path('auth/password-reset/', request_password_reset),
    path('auth/password-reset/confirm/', confirm_password_reset),
    path('profile/', ProfileView.as_view()),
    path('profile/password/', change_password),
    path('wallet/', wallet),
    path('loyalty/', loyalty),
    path('wallet/top-up/', top_up),
    path('loyalty/redeem/', redeem_points),
    path('reports/', reports),
    path('', include(router.urls)),
]
