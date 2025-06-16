from drf_spectacular.utils import extend_schema_view, extend_schema
from rest_framework.viewsets import ModelViewSet

from apps.negocio.sgac.models import IndicadorEvaluacion
from apps.negocio.sgac.models.disciplina import Disciplina
from apps.negocio.sgac.views.serializers.disciplina import DisciplinaSerializer
from apps.negocio.sgac.views.serializers.indicador_evaluacion import (
    IndicadorEvaluacionSerializer,
)


@extend_schema_view(
    list=extend_schema(
        tags=["Gestión de Indicadores de Evaluación"],
        summary="Lista los indicadores de evaluación.",
    ),
    retrieve=extend_schema(
        tags=["Gestión de Indicadores de Evaluación"],
        summary="Obtiene un indicador de evaluación.",
    ),
    create=extend_schema(
        tags=["Gestión de Indicadores de Evaluación"],
        summary="Registra un indicador de evaluación.",
    ),
    update=extend_schema(
        tags=["Gestión de Indicadores de Evaluación"],
        summary="Modifica los datos de un indicador de evaluación.",
    ),
    partial_update=extend_schema(
        tags=["Gestión de Indicadores de Evaluación"],
        summary="Modifica parcialmente los datos de un indicador de evaluación.",
    ),
    destroy=extend_schema(
        tags=["Gestión de Indicadores de Evaluación"],
        summary="Elimina un indicador de evaluación.",
    ),
)
class IndicadorEvaluacionViewSet(ModelViewSet):
    serializer_class = IndicadorEvaluacionSerializer
    queryset = IndicadorEvaluacion.objects.all()
    lookup_url_kwarg = "id_indicador"
    lookup_field = "pk"
