from rest_framework import serializers

from apps.negocio.sgac.models.publicacion import Publicacion


class PublicacionSerializer(serializers.ModelSerializer):
    anno = serializers.IntegerField(required=False, allow_null=True)
    nivel = serializers.IntegerField(required=False, allow_null=True)

    class Meta:
        model = Publicacion
        fields = [
            "id",
            "anno",
            "titulo",
            "revista_editorial",
            "tipo_publicacion",
            "isbn_issn",
            "verificacion_libro",
            "base_datos_revista",
            "verificacion_referencia",
            "nivel",
        ]