from drf_spectacular.utils import extend_schema_view, extend_schema
from rest_framework import viewsets

from apps.negocio.sgac.models.evento import Evento
from apps.negocio.sgac.views.serializers.evento import EventoSerializer


@extend_schema_view(
    list=extend_schema(
        tags=["Gestión de Eventos"],
        summary="Lista los eventos.",
    ),
    retrieve=extend_schema(
        tags=["Gestión de Eventos"],
        summary="Obtiene un evento.",
    ),
    create=extend_schema(
        tags=["Gestión de Eventos"],
        summary="Registra un evento.",
    ),
    update=extend_schema(
        tags=["Gestión de Eventos"],
        summary="Modifica los datos de un evento.",
    ),
    partial_update=extend_schema(
        tags=["Gestión de Eventos"],
        summary="Modifica parcialmente los datos de un evento.",
    ),
    destroy=extend_schema(
        tags=["Gestión de Eventos"],
        summary="Elimina un evento.",
    ),
)
class EventoViewSet(viewsets.ModelViewSet):
    queryset = Evento.objects.prefetch_related('profesorevento_set__profesor').all()
    serializer_class = EventoSerializer
    lookup_url_kwarg = "id_evento"
    lookup_field = "pk"
