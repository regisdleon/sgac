from rest_framework import serializers

from apps.negocio.sgac.models.carrera import Carrera
from apps.negocio.sgac.models.disciplina import Disciplina


class CarreraSerializer(serializers.ModelSerializer):
    class Meta:
        model = Carrera
        fields = [
            "id",
            "nombre",
            "modalidad",
            "sede",
            "anno_eval_ext",
            "curso_evaluado",
            "numero_eval_ext",
        ]
