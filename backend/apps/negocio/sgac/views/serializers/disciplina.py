from rest_framework import serializers

from apps.negocio.sgac.models.disciplina import Disciplina
from apps.negocio.sgac.views.serializers.carrera import CarreraSerializer


class DisciplinaSerializer(serializers.ModelSerializer):

    carrera = CarreraSerializer(read_only=True)

    class Meta:
        model = Disciplina
        fields = [
            "id",
            "codigo",
            "nombre",
            "carrera",
        ]
