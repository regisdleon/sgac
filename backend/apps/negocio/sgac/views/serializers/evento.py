from rest_framework import serializers

from apps.negocio.sgac.models.evento import Evento
from apps.negocio.sgac.models.profesor_evento import ProfesorEvento
from apps.negocio.sgac.models.profesor import Profesor


class EventoSerializer(serializers.ModelSerializer):
    profesor_id = serializers.PrimaryKeyRelatedField(
        queryset=Profesor.objects.all(),
        required=True,
        write_only=True,
        source='profesor',
        label="Profesor"
    )
    profesor_nombre = serializers.SerializerMethodField()

    class Meta:
        model = Evento
        fields = [
            "id",
            "anno",
            "titulo",
            "titulo_corto",
            "clasificacion",
            "profesor_id",
            "profesor_nombre",
        ]

    def get_profesor_nombre(self, instance):
        profesor_evento = instance.profesorevento_set.first()
        if profesor_evento and profesor_evento.profesor:
            profesor = profesor_evento.profesor
            return f"{profesor.nombre} {profesor.primer_apellido} {profesor.segundo_apellido or ''}".strip()
        return "N/A"

    def create(self, validated_data):
        profesor = validated_data.pop('profesor')
        evento = Evento.objects.create(**validated_data)
        ProfesorEvento.objects.create(profesor=profesor, evento=evento)
        return evento

    def update(self, instance, validated_data):
        if 'profesor' in validated_data:
            profesor = validated_data.pop('profesor')
            profesor_evento = ProfesorEvento.objects.filter(evento=instance).first()
            if profesor_evento:
                profesor_evento.profesor = profesor
                profesor_evento.save()
            else:
                ProfesorEvento.objects.create(profesor=profesor, evento=instance)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        return instance
