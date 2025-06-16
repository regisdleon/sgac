from django.contrib.admin import ModelAdmin
from django.db import models
from django.utils.translation import gettext_lazy as _


class Profesor(models.Model):
    class CategoriaDocente(models.TextChoices):
        INSTRUCTOR = "INSTRUCTOR", _("Instructor")
        ASISTENTE = "ASISTENTE", _("Asistente")
        AUXILIAR = "AUXILIAR", _("Auxiliar")
        TITULAR = "TITULAR", _("Titular")
        AD = "AD", _("Adiestrado")
        ATD = "ATD", _("ATD")

    class GradoCientifico(models.TextChoices):
        DOCTOR = "DOCTOR", _("Doctor")
        MASTER = "MASTER", _("Máster")
        NINGUNO = "NINGUNO", _("Ninguno")

    nombre = models.CharField(max_length=255, db_column="nombre")
    primer_apellido = models.CharField(max_length=255, db_column="primer_apellido")
    segundo_apellido = models.CharField(max_length=255, db_column="segundo_apellido")
    annos_experiencia_carrera = models.IntegerField(
        default=0, db_column="annos_experiencia_carrera"
    )
    annos_experiencia_mes = models.IntegerField(
        default=0, db_column="annos_experiencia_mes"
    )
    categoria_docente = models.CharField(
        max_length=255, choices=CategoriaDocente.choices, db_column="categoria_docente"
    )
    grado_cientifico = models.CharField(
        max_length=255, choices=GradoCientifico.choices, db_column="grado_cientifico"
    )
    correos = models.JSONField(default=dict, db_column="correos")
    telefonos = models.JSONField(default=dict, db_column="telefonos")
    asignaturas = models.ManyToManyField("Asignatura", through="ProfesorAsignatura")
    eventos = models.ManyToManyField("Evento", through="ProfesorEvento")

    def __str__(self):
        return self.nombre + " " + self.primer_apellido + " " + self.segundo_apellido

    class Meta:
        db_table = "sgac_profesores"
        managed = True
        verbose_name = "Profesor"
        verbose_name_plural = "Profesores"

    class Admin(ModelAdmin):
        pass


__all__ = ["Profesor"]
