from django.contrib import admin
from django.db import models

from apps.negocio.sgac.models import Profesor, Evento
from apps.negocio.sgac.views.asignatura import AsignaturaViewSet


class ProfesorEvento(models.Model):

    profesor = models.ForeignKey(
        Profesor,
        on_delete=models.CASCADE,
        db_column="id_profesor",
    )

    evento = models.ForeignKey(
        Evento,
        on_delete=models.CASCADE,
        db_column="id_evento",
    )

    def __str__(self):
        pass

    class Meta:
        db_table = "sgac_profesores_eventos"
        managed = True
        verbose_name = "Profesor Evento"
        verbose_name_plural = "Profesor Eventos"

    class Admin(admin.ModelAdmin):
        pass


__all__ = ["ProfesorEvento"]
