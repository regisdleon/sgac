from drf_spectacular.utils import extend_schema_view, extend_schema
from rest_framework import viewsets

from apps.negocio.sgac.models.profesor import Profesor
from apps.negocio.sgac.views.serializers.profesor import ProfesorSerializer


@extend_schema_view(
    list=extend_schema(
        tags=["Gestión de Profesores"],
        summary="Lista los profesores.",
    ),
    retrieve=extend_schema(
        tags=["Gestión de Profesores"],
        summary="Obtiene un profesor.",
    ),
    create=extend_schema(
        tags=["Gestión de Profesores"],
        summary="Registra un profesor.",
    ),
    update=extend_schema(
        tags=["Gestión de Profesores"],
        summary="Modifica los datos de un profesor.",
    ),
    partial_update=extend_schema(
        tags=["Gestión de Profesores"],
        summary="Modifica parcialmente los datos de un profesor.",
    ),
    destroy=extend_schema(
        tags=["Gestión de Profesores"],
        summary="Elimina un profesor.",
    ),
)
class ProfesorViewSet(viewsets.ModelViewSet):
    serializer_class = ProfesorSerializer
    queryset = Profesor.objects.all()
    lookup_url_kwarg = "id_profesor"
    lookup_field = "pk"
