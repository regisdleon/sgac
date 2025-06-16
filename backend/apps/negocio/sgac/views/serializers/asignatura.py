from rest_framework import serializers

from apps.negocio.sgac.models import Asignatura
from apps.negocio.sgac.views.serializers.disciplina import DisciplinaSerializer


class AsignaturaSerializer(serializers.ModelSerializer):

    disciplina = DisciplinaSerializer(read_only=True)

    class Meta:
        model = Asignatura
        fields = [
            "id",
            "disciplina",
            "nombre",
            "codigo",
            "anno",
            "semestre",
            "modalidad",
            "curriculo",
            "profesores",
        ]
