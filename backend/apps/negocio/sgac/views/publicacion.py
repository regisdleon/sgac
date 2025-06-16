from drf_spectacular.utils import extend_schema_view, extend_schema
from rest_framework import viewsets

from apps.negocio.sgac.models.publicacion import Publicacion
from apps.negocio.sgac.views.serializers.publicacion import PublicacionSerializer


@extend_schema_view(
    list=extend_schema(
        tags=["Gestión de Publicaciones"],
        summary="Lista las publicaciones.",
    ),
    retrieve=extend_schema(
        tags=["Gestión de Publicaciones"],
        summary="Obtiene una publicación.",
    ),
    create=extend_schema(
        tags=["Gestión de Publicaciones"],
        summary="Registra una publicación.",
    ),
    update=extend_schema(
        tags=["Gestión de Publicaciones"],
        summary="Modifica los datos de una publicación.",
    ),
    partial_update=extend_schema(
        tags=["Gestión de Publicaciones"],
        summary="Modifica parcialmente los datos de una publicación.",
    ),
    destroy=extend_schema(
        tags=["Gestión de Publicaciones"],
        summary="Elimina una publicación.",
    ),
)
class PublicacionViewSet(viewsets.ModelViewSet):
    serializer_class = PublicacionSerializer
    queryset = Publicacion.objects.all()
    lookup_url_kwarg = "id_publicacion"
    lookup_field = "pk"
