from rest_framework import serializers

from apps.negocio.sgac.models.premio import Premio


class PremioSerializer(serializers.ModelSerializer):

    class Meta:
        model = Premio
        fields = [
            "id",
            "profesor",
            "anno",
            "descripcion",
            "clasificacion",
        ]