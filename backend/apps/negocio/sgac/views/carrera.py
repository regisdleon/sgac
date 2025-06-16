from drf_spectacular.utils import extend_schema_view, extend_schema
from rest_framework import viewsets

from apps.negocio.sgac.models.carrera import Carrera
from apps.negocio.sgac.views.serializers.carrera import CarreraSerializer


@extend_schema_view(
    list=extend_schema(
        tags=["Gestión de Carreras"],
        summary="Lista las carreras.",
    ),
    retrieve=extend_schema(
        tags=["Gestión de Carreras"],
        summary="Obtiene una carrera.",
    ),
    create=extend_schema(
        tags=["Gestión de Carreras"],
        summary="Registra una carrera.",
    ),
    update=extend_schema(
        tags=["Gestión de Carreras"],
        summary="Modifica los datos de una carrera.",
    ),
    partial_update=extend_schema(
        tags=["Gestión de Carreras"],
        summary="Modifica parcialmente los datos de una carrera.",
    ),
    destroy=extend_schema(
        tags=["Gestión de Carreras"],
        summary="Elimina una carrera.",
    ),
)
class CarreraViewSet(viewsets.ModelViewSet):
    queryset = Carrera.objects.all()
    serializer_class = CarreraSerializer
    lookup_url_kwarg = "id_carrera"
    lookup_field = "pk"
