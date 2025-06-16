from rest_framework import serializers

from apps.negocio.sgac.models.evento import Evento


class EventoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evento
        fields = [
            "id",
            "anno",
            "titulo",
            "titulo_corto",
            "clasificacion",
        ]
