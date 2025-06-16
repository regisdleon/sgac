from drf_spectacular.utils import extend_schema_view, extend_schema
from rest_framework import viewsets
from rest_framework.generics import get_object_or_404

from apps.negocio.sgac.models import ProfesorPublicacion, Publicacion
from general.mixins import ObtenerPorMultiplesCamposMixin


@extend_schema_view(
    list=extend_schema(
        tags=["Gestión de Publicaciones"],
        summary="Lista los autores de la publicacion",
    ),
    retrieve=extend_schema(
        tags=["Gestión de Publicaciones"],
        summary="Obtiene una autor de la publicacion.",
    ),
    create=extend_schema(
        tags=["Gestión de Publicaciones"],
        summary="Registra un autor de la publicacion",
    ),
    update=extend_schema(
        tags=["Gestión de Publicaciones"],
        summary="Modifica los datos de un autor de la publicacion",
    ),
    partial_update=extend_schema(
        tags=["Gestión de Publicaciones"],
        summary="Modifica parcialmente los datos de un autor de la publicacion.",
    ),
    destroy=extend_schema(
        tags=["Gestión de Publicaciones"],
        summary="Elimina un autor de la publicacion",
    ),
)
class ProfesorPublicacionViewSet(
    ObtenerPorMultiplesCamposMixin,
    viewsets.ModelViewSet,
):
    queryset = ProfesorPublicacion.objects.all()
    multiple_lookup_fields = {
        "id_publicacion": "publicacion_id",
        "id_profesor": "profesor_id",
    }

    def get_queryset(self):
        return self.queryset.filter(publicacion=self.obtener_publicacion())

    def obtener_publicacion(self):
        return get_object_or_404(
            Publicacion.objects.all(),
            pk=self.kwargs["id_publicacion"],
        )
