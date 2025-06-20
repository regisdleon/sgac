from drf_spectacular.utils import extend_schema_view, extend_schema
from rest_framework import viewsets, status
from rest_framework.response import Response

from apps.negocio.sgac.models.evento import Evento
from apps.negocio.sgac.views.serializers.evento import EventoSerializer


@extend_schema_view(
    list=extend_schema(
        tags=["Gestión de Eventos"],
        summary="Lista todos los eventos.",
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
    serializer_class = EventoSerializer
    queryset = Evento.objects.all()
    lookup_url_kwarg = "id_evento"
    lookup_field = "pk"
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
