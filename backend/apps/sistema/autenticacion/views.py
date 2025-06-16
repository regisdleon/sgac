from drf_spectacular.utils import extend_schema_view, extend_schema
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenBlacklistView


@extend_schema_view(
    post=extend_schema(
        tags=["Autenticación"],
        summary="Obtener un token de acceso y refresco a partir de credenciales válidas."
    )
)
class LoginView(TokenObtainPairView):
    pass


@extend_schema_view(
    post=extend_schema(
        tags=["Autenticación"],
        summary="Devuelve un token de acceso a partir de un refresh token.",
        description="Toma un token web JSON de tipo de actualización y devuelve un token web JSON de tipo de acceso si el token de actualización es válido.",
    )
)
class RefreshTokenView(TokenRefreshView):
    pass


@extend_schema_view(
    post=extend_schema(
        tags=["Autenticación"],
        summary="Coloca un token de refresco en lista negra.",
        description="Coloca un token de refresco en lista negra.",
    )
)
class TokenBlacklistView(TokenBlacklistView):
    pass