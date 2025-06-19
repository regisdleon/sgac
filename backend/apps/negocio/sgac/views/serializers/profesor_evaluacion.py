from rest_framework import serializers

from apps.negocio.sgac.models import ProfesorEvaluacion, Profesor, IndicadorEvaluacion
from apps.negocio.sgac.views.serializers.indicador_evaluacion import (
    IndicadorEvaluacionSerializer,
)
from apps.negocio.sgac.views.serializers.profesor import ProfesorSerializer


class ProfesorEvaluacionSerializer(serializers.ModelSerializer):
    profesor = ProfesorSerializer(read_only=True)
    profesor_id = serializers.PrimaryKeyRelatedField(
        queryset=Profesor.objects.all(), source='profesor', write_only=True
    )
    indicador = IndicadorEvaluacionSerializer(read_only=True)
    indicador_id = serializers.PrimaryKeyRelatedField(
        queryset=IndicadorEvaluacion.objects.all(), source='indicador', write_only=True
    )

    class Meta:
        model = ProfesorEvaluacion
        fields = [
            "id",
            "profesor",
            "profesor_id",
            "indicador",
            "indicador_id",
            "evaluacion",
            "fecha",
        ]
