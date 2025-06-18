from rest_framework import serializers

from apps.negocio.sgac.models.profesor import Profesor

class CorreoSerializer(serializers.Serializer):
    etiqueta = serializers.CharField()
    correo = serializers.EmailField()

class TelefonoSerializer(serializers.Serializer):
    etiqueta = serializers.CharField()
    numero = serializers.CharField()

class ProfesorSerializer(serializers.ModelSerializer):

    telefonos = TelefonoSerializer(many=True)
    correos = CorreoSerializer(many=True)

    class Meta:
        model = Profesor
        fields = [
            "id",
            "nombre",
            "primer_apellido",
            "segundo_apellido",
            "annos_experiencia_carrera",
            "annos_experiencia_mes",
            "categoria_docente",
            "grado_cientifico",
            "dr_especialidad_afin",
            "correos",
            "telefonos",
        ]
