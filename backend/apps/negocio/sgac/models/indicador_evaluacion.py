from django.contrib.admin import ModelAdmin
from django.db import models


class IndicadorEvaluacion(models.Model):

    nombre = models.CharField(max_length=255, db_column="nombre")

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
