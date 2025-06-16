from drf_spectacular.utils import extend_schema_view, extend_schema
from rest_framework import viewsets
from rest_framework.generics import get_object_or_404

from apps.negocio.sgac.models import Asignatura, Carrera, Disciplina
from apps.negocio.sgac.views.serializers.asignatura import AsignaturaSerializer


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
    viewsets.ModelViewSet,
):
    queryset = Asignatura.objects.all()
    serializer_class = AsignaturaSerializer

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

    def get_object(self):
        disciplina_obj = self.obtener_disciplina()
        carrera_obj = self.obtener_carrera()

        obj = get_object_or_404(
            self.queryset,
            pk=self.kwargs["id_asignatura"],
            disciplina=disciplina_obj,
        )
        self.check_object_permissions(self.request, obj)
        return obj

    def perform_create(self, serializer):
        print(f"Validated data before save: {serializer.validated_data}")
        serializer.save(disciplina=self.obtener_disciplina())
