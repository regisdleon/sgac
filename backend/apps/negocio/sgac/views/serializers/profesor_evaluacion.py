from rest_framework import serializers

from apps.negocio.sgac.models import ProfesorEvaluacion
from apps.negocio.sgac.views.serializers.indicador_evaluacion import (
    IndicadorEvaluacionSerializer,
)
from apps.negocio.sgac.views.serializers.profesor import ProfesorSerializer


class ProfesorEvaluacionSerializer(serializers.ModelSerializer):

    profesor = ProfesorSerializer()
    indicador = IndicadorEvaluacionSerializer()

    class Meta:
        model = ProfesorEvaluacion
        fields = [
            "id",
            "profesor",
            "indicador",
            "evaluacion",
            "fecha",
        ]
