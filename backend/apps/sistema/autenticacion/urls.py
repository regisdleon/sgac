from django.urls import path

from apps.sistema.autenticacion.views import LoginView, RefreshTokenView, TokenBlacklistView

# fmt: off

urlpatterns = [
    path("token", LoginView.as_view(), name="token_obtain_pair"),
    path("token/refresh", RefreshTokenView.as_view(), name="token_refresh"),
    path("token/blacklist", TokenBlacklistView.as_view(), name="token_blacklist"),
]

# fmt: on
