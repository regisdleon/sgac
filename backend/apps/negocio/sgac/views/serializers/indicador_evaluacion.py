from rest_framework import serializers

from apps.negocio.sgac.models import IndicadorEvaluacion


class IndicadorEvaluacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = IndicadorEvaluacion
        fields = [
            "id",
            "nombre"
        ]