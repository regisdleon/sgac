from django.contrib import admin
from django.db import models


class ProfesorAsignatura(models.Model):

    profesor = models.ForeignKey(
        "Profesor",
        on_delete=models.CASCADE,
        db_column="id_profesor",
    )
    asignatura = models.ForeignKey(
        "Asignatura",
        on_delete=models.CASCADE,
        db_column="id_asignatura",
    )

    def __str__(self):
        return f"{self.profesor} ({self.asignatura})"

    class Meta:
        db_table = "sgac_profesores_asignaturas"
        managed = True
        verbose_name = "Profesor Asignatura"
        verbose_name_plural = "Profesor Asignaturas"

    class Admin(admin.ModelAdmin):
        pass


__all__ = ["ProfesorAsignatura"]
