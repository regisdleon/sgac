from rest_framework import serializers

from apps.negocio.sgac.models.evento import Evento
from apps.negocio.sgac.models.profesor_evento import ProfesorEvento
from apps.negocio.sgac.models.profesor import Profesor
from apps.negocio.sgac.views.serializers.profesor import ProfesorSerializer


class EventoSerializer(serializers.ModelSerializer):
    profesor_id = serializers.PrimaryKeyRelatedField(
        queryset=Profesor.objects.all(),
        required=True,
        write_only=True,
        source='profesor'
    )
    profesor = ProfesorSerializer(read_only=True)

    class Meta:
        model = Evento
        fields = [
            "id",
            "anno",
            "titulo",
            "titulo_corto",
            "clasificacion",
            "profesor_id",
            "profesor",
        ]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        profesor_evento = instance.profesorevento_set.first()
        if profesor_evento:
            representation['profesor'] = ProfesorSerializer(profesor_evento.profesor).data
        return representation

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
