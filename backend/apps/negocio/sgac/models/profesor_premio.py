from django.contrib import admin
from django.db import models


class ProfesorPremio(models.Model):

    profesor = models.ForeignKey(
        "Profesor",
        on_delete=models.CASCADE,
        db_column="id_profesor",
    )

    premio = models.ForeignKey(
        "Premio",
        on_delete=models.CASCADE,
        db_column="id_premio",
    )

    def __str__(self):
        pass

    class Meta:
        db_table = "sgac_profesores_premios"
        managed = True
        verbose_name = "Profesor Premio"
        verbose_name_plural = "Profesores Premios"

    class Admin(admin.ModelAdmin):
        pass


__all__ = ["ProfesorPremio"]
