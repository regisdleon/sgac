from django.contrib.admin import ModelAdmin
from django.db import models


class IndicadorEvaluacion(models.Model):

    class NombreIndicador(models.TextChoices):
        TRABAJO_DOCENTE = "Trabajo docente-educativo en pregrado y posgrado", "Trabajo docente-educativo en pregrado y posgrado"
        TRABAJO_POLITICO = "Trabajo político-ideológico", "Trabajo político-ideológico"
        TRABAJO_METODOLOGICO = "Trabajo metodológico", "Trabajo metodológico"
        INVESTIGACION = "Trabajo de investigación e innovación", "Trabajo de investigación e innovación"
        SUPERACION = "Superación", "Superación"
        EXTENSION = "Extensión Universitaria", "Extensión Universitaria"
        FUNCIONES_ADMIN = "Funciones administrativas asignadas", "Funciones administrativas asignadas"
        GENERAL = "General", "General"
    nombre = models.CharField(max_length=255, db_column="nombre", choices=NombreIndicador.choices)

    def __str__(self):
        pass

    class Meta:
        db_table = 'sgac_indicadoresevaluacion'
        managed = True
        verbose_name = 'Indicador de Evaluacion'
        verbose_name_plural = 'Indicadores de Evaluacion'


    class Admin(ModelAdmin):
        pass

__all__ = ['IndicadorEvaluacion']
