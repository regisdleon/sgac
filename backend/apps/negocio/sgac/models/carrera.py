from django.contrib.admin import ModelAdmin
from django.db import models


class Carrera(models.Model):

    class Modalidad(models.TextChoices):
        CURSO_DIURNO = "CURSO_DIURNO"
        CURSO_A_DISTANCIA = "CURSO_A_DISTANCIA"
        CURSO_POR_ENCUENTRO = "CURSO_POR_ENCUENTRO"

    nombre = models.CharField(max_length=255, db_column="nombre")
    modalidad = models.CharField(max_length=255, db_column="modalidad")
    sede = models.CharField(max_length=255, db_column="sede")
    anno_eval_ext = models.CharField(max_length=255, db_column="anno_eval_ext")
    curso_evaluado = models.CharField(max_length=255, db_column="curso_evaluado")
    numero_eval_ext = models.IntegerField(db_column="numero_eval_ext")

    def __str__(self):
        return self.nombre

    class Meta:
        db_table = "sgac_carreras"
        managed = True
        verbose_name = "Carrera"
        verbose_name_plural = "Carreras"

    class Admin(ModelAdmin):
        pass


__all__ = ["Carrera"]
