from drf_spectacular.utils import extend_schema_view, extend_schema
from rest_framework import viewsets
from rest_framework.generics import get_object_or_404

from apps.negocio.sgac.models import (
    ProfesorPublicacion,
    Publicacion,
    ProfesorEvaluacion,
    Profesor,
)
from apps.negocio.sgac.views.serializers.profesor_evaluacion import (
    ProfesorEvaluacionSerializer,
)
from general.mixins import ObtenerPorMultiplesCamposMixin


@extend_schema_view(
    list=extend_schema(
        tags=["Gestión de Profesores"],
        summary="Lista las evaluaciones de los profesores",
    ),
    retrieve=extend_schema(
        tags=["Gestión de Profesores"],
        summary="Obtiene una evaluación de un profesor",
    ),
    create=extend_schema(
        tags=["Gestión de Profesores"],
        summary="Registra una evaluación de un profesor",
    ),
    update=extend_schema(
        tags=["Gestión de Profesores"],
        summary="Modifica los datos de una evaluación de un profesor",
    ),
    partial_update=extend_schema(
        tags=["Gestión de Profesores"],
        summary="Modifica parcialmente los datos de una evaluación de un profesor",
    ),
    destroy=extend_schema(
        tags=["Gestión de Profesores"],
        summary="Elimina una evaluación de un profesor",
    ),
)
class ProfesorEvaluacionViewSet(
    ObtenerPorMultiplesCamposMixin,
    viewsets.ModelViewSet,
):
    queryset = ProfesorEvaluacion.objects.all()
    serializer_class = ProfesorEvaluacionSerializer
    multiple_lookup_fields = {
        "id_profesor": "profesor_id",
        "id_evaluacion": "indicador_id",
    }

    def get_queryset(self):
        return self.queryset.filter(profesor=self.obtener_profesor())

    def obtener_profesor(self):
        return get_object_or_404(
            Profesor.objects.all(),
            pk=self.kwargs["id_profesor"],
        )
