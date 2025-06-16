from django.contrib import admin
from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.negocio.sgac.models.profesor import Profesor
from apps.negocio.sgac.models.disciplina import Disciplina
from apps.negocio.sgac.models.profesor_asignatura import ProfesorAsignatura


class Asignatura(models.Model):

    class AnnoAcademico(models.IntegerChoices):
        PRIMER = 1, _("Primer Año")
        SEGUNDO = 2, _("Segundo Año")
        TERCER = 3, _("Tercer Año")
        CUARTO = 4, _("Cuarto Año")
        QUINTO = 5, _("Quinto Año")
        SEXTO = 6, _("Sexto Año")

    class Semestre(models.IntegerChoices):
        PRIMER = 1, _("Primer Semestre")
        SEGUNDO = 2, _("Segundo Semestre")

    class Modalidad(models.TextChoices):
        DIURNO = "DIURNO", _("Curso Diurno")
        A_DISTANCIA = "A_DISTANCIA", _("Curso a Distancia")
        POR_ENCUENTRO = "POR_ENCUENTRO", _("Curso por Encuentro")

    class Curriculo(models.TextChoices):
        BASE = "BASE", _("Base")
        PROPIO = "PROPIO", _("Propio")
        OPTATIVA = "OPTATIVA", _("Optativa")
        ELECTIVA = "ELECTIVA", _("Electiva")

    disciplina = models.ForeignKey(
        Disciplina,
        on_delete=models.CASCADE,
        related_name="asignaturas",
        db_column="id_disciplina",
    )
    nombre = models.CharField(max_length=255, db_column="nombre")
    codigo = models.CharField(max_length=100, db_column="codigo")
    anno = models.IntegerField(choices=AnnoAcademico.choices, db_column="anno")
    semestre = models.IntegerField(choices=Semestre.choices, db_column="semestre")
    modalidad = models.CharField(max_length=255, db_column="modalidad")
    curriculo = models.CharField(
        choices=Curriculo.choices, max_length=255, db_column="curriculo"
    )
    profesores = models.ManyToManyField(Profesor, through=ProfesorAsignatura)

    def __str__(self):
        return self.nombre

    class Meta:
        db_table = "sgac_asignaturas"
        managed = True
        verbose_name = "Asignatura"
        verbose_name_plural = "Asignaturas"

    class Admin(admin.ModelAdmin):
        pass


__all__ = ["Asignatura"]
