from drf_spectacular.utils import extend_schema_view, extend_schema
from rest_framework import viewsets
from rest_framework.generics import get_object_or_404

from apps.negocio.sgac.models import Asignatura, Carrera, Disciplina
from apps.negocio.sgac.views.serializers.asignatura import AsignaturaSerializer
from general.mixins import ObtenerPorMultiplesCamposMixin


@extend_schema_view(
    list=extend_schema(
        tags=["Gestión de Carreras"],
        summary="Lista las asignaturas de la disciplina.",
    ),
    retrieve=extend_schema(
        tags=["Gestión de Carreras"],
        summary="Obtiene una asignatura de la disciplina.",
    ),
    create=extend_schema(
        tags=["Gestión de Carreras"],
        summary="Registra una asignatura de la disciplina.",
    ),
    update=extend_schema(
        tags=["Gestión de Carreras"],
        summary="Modifica los datos de una asignatura de la disciplina.",
    ),
    partial_update=extend_schema(
        tags=["Gestión de Carreras"],
        summary="Modifica parcialmente los datos de una asignatura de la disciplina.",
    ),
    destroy=extend_schema(
        tags=["Gestión de Carreras"],
        summary="Elimina una asignatura de la disciplina.",
    ),
)
class AsignaturaViewSet(
    ObtenerPorMultiplesCamposMixin,
    viewsets.ModelViewSet,
):
    queryset = Asignatura.objects.all()
    serializer_class = AsignaturaSerializer
    multiple_lookup_fields = {
        "id_carrera": "carrera_id",
        "id_disciplina": "disciplina_id",
        "id_asignatura": "pk",
    }

    def get_queryset(self):
        return self.queryset.filter(disciplina=self.obtener_disciplina())

    def obtener_carrera(self):
        return get_object_or_404(Carrera.objects.all(), pk=self.kwargs["id_carrera"])

    def obtener_disciplina(self):
        return get_object_or_404(
            Disciplina.objects.all(),
            carrera=self.obtener_carrera(),
            pk=self.kwargs["id_disciplina"],
        )

    def perform_create(self, serializer):
        serializer.save(disciplina=self.obtener_disciplina())
