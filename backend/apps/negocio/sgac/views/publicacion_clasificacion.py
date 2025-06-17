from drf_spectacular.utils import extend_schema_view, extend_schema
from rest_framework import viewsets

from apps.negocio.sgac.models.publicacion import PublicacionClasificacion
from apps.negocio.sgac.views.serializers.publicacion import PublicacionClasificacionSerializer


@extend_schema_view(
    list=extend_schema(
        tags=["Gestión de Publicaciones"],
        summary="Lista las clasificaciones de publicaciones.",
    ),
    retrieve=extend_schema(
        tags=["Gestión de Publicaciones"],
        summary="Obtiene una clasificación de publicación.",
    ),
)
class PublicacionClasificacionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PublicacionClasificacion.objects.all()
    serializer_class = PublicacionClasificacionSerializer
    lookup_url_kwarg = "id_clasificacion"
    lookup_field = "pk" 