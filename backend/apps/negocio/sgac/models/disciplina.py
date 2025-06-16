from django.contrib.admin import ModelAdmin
from django.db import models

from apps.negocio.sgac.models.carrera import Carrera


class Disciplina(models.Model):
    carrera = models.ForeignKey(
        Carrera, models.CASCADE, related_name="disciplinas", db_column="id_carrera"
    )
    codigo = models.CharField(max_length=255, db_column="codigo")
    nombre = models.CharField(max_length=255, db_column="nombre")

    def __str__(self):
        return f"{self.codigo} - {self.nombre} de {self.carrera}"

    class Meta:
        db_table = "sgac_disciplinas"
        managed = True
        verbose_name = "Disciplina"
        verbose_name_plural = "Disciplinas"

    class Admin(ModelAdmin):
        pass


__all__ = ["Disciplina"]
