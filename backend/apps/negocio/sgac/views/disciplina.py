from drf_spectacular.utils import extend_schema_view, extend_schema
from rest_framework.generics import get_object_or_404
from rest_framework.viewsets import ModelViewSet

from apps.negocio.sgac.models import Carrera
from apps.negocio.sgac.models.disciplina import Disciplina
from apps.negocio.sgac.views.serializers.disciplina import DisciplinaSerializer
from general.mixins import ObtenerPorMultiplesCamposMixin


@extend_schema_view(
    list=extend_schema(
        tags=["Gestión de Carreras"],
        summary="Lista las disciplinas.",
    ),
    retrieve=extend_schema(
        tags=["Gestión de Carreras"],
        summary="Obtiene una disciplina.",
    ),
    create=extend_schema(
        tags=["Gestión de Carreras"],
        summary="Registra una disciplina.",
    ),
    update=extend_schema(
        tags=["Gestión de Carreras"],
        summary="Modifica los datos de una disciplina.",
    ),
    partial_update=extend_schema(
        tags=["Gestión de Carreras"],
        summary="Modifica parcialmente los datos de una disciplina.",
    ),
    destroy=extend_schema(
        tags=["Gestión de Carreras"],
        summary="Elimina una disciplina.",
    ),
)
class DisciplinaViewSet(
    ObtenerPorMultiplesCamposMixin,
    ModelViewSet,
):
    serializer_class = DisciplinaSerializer
    queryset = Disciplina.objects.all()
    multiple_lookup_fields = {"id_carrera": "carrera_id", "id_disciplina": "id"}

    def get_queryset(self):
        return self.queryset.filter(carrera=self.obtener_carrera())

    def obtener_carrera(self):
        return get_object_or_404(Carrera.objects.all(), pk=self.kwargs["id_carrera"])

    def perform_create(self, serializer):
        serializer.save(carrera=self.obtener_carrera())
