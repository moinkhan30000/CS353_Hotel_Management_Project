from rest_framework.throttling import AnonRateThrottle, UserRateThrottle


class AuthenticationThrottle(AnonRateThrottle):
    rate = '10/minute'


class PasswordResetThrottle(AnonRateThrottle):
    rate = '5/hour'


class PublicWriteThrottle(AnonRateThrottle):
    rate = '20/hour'


class FinancialActionThrottle(UserRateThrottle):
    rate = '30/minute'
