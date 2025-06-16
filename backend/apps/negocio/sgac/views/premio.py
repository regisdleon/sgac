from drf_spectacular.utils import extend_schema_view, extend_schema
from rest_framework import viewsets

from apps.negocio.sgac.models.premio import Premio
from apps.negocio.sgac.views.serializers.premio import PremioSerializer


@extend_schema_view(
    list=extend_schema(
        tags=["Gestión de Premios"],
        summary="Lista los premios",
    ),
    retrieve=extend_schema(
        tags=["Gestión de Premios"],
        summary="Obtiene un premio.",
    ),
    create=extend_schema(
        tags=["Gestión de Premios"],
        summary="Registra un premio.",
    ),
    update=extend_schema(
        tags=["Gestión de Premios"],
        summary="Modifica los datos de un premio.",
    ),
    partial_update=extend_schema(
        tags=["Gestión de Premios"],
        summary="Modifica parcialmente los datos de un premio.",
    ),
    destroy=extend_schema(
        tags=["Gestión de Premios"],
        summary="Elimina un premio.",
    ),
)
class PremioViewSet(viewsets.ModelViewSet):
    queryset = Premio.objects.all()
    serializer_class = PremioSerializer
    lookup_url_kwarg = "id_premio"
    lookup_field = "pk"
