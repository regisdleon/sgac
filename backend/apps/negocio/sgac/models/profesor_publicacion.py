from django.contrib import admin
from django.db import models
from django.utils.translation import gettext_lazy as _


class ProfesorPublicacion(models.Model):

    class Participacion(models.TextChoices):
        AUTOR_PRINCIPAL = "AUTOR_PRINCIPAL", _("Autor principal")
        CO_AUTOR = "COAUTOR", _("Coautor")

    profesor = models.ForeignKey("Profesor", models.CASCADE, db_column="id_profesor")
    publicacion = models.ForeignKey(
        "Publicacion", models.CASCADE, db_column="id_publicacion"
    )
    participacion = models.CharField(
        choices=Participacion.choices, max_length=255, db_column="participacion"
    )

    def __str__(self):
        return f"{self.profesor} ({self.publicacion})"

    class Meta:
        db_table = "sgac_profesores_publicaciones"
        managed = True
        verbose_name = "Profesor Publicacion"
        verbose_name_plural = "Profesores Publicaciones"

    class Admin(admin.ModelAdmin):
        pass


__all__ = ["ProfesorPublicacion"]
