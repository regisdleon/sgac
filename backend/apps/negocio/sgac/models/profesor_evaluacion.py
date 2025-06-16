from django.contrib import admin
from django.db import models
from django.utils.translation import gettext_lazy as _


class ProfesorEvaluacion(models.Model):

    class ValorEvaluacion(models.TextChoices):
        EXCELENTE = "EXCELENTE", _("Excelente")
        BIEN = "BIEN", _("Bien")
        REGULAR = "REGULAR", _("Regular")
        MAL = "MAL", _("Mal")

    profesor = models.ForeignKey(
        "Profesor", on_delete=models.CASCADE, db_column="id_profesor"
    )
    indicador = models.ForeignKey(
        "IndicadorEvaluacion", on_delete=models.CASCADE, db_column="id_indicador"
    )
    evaluacion = models.CharField(
        choices=ValorEvaluacion.choices, db_column="evaluacion"
    )
    fecha = models.DateField(db_column="fecha")

    def __str__(self):
        return f"En {self.fecha} {self.profesor} en {self.indicador} obtuvo {self.evaluacion}"

    class Meta:
        db_table = "sgac_profesores_indicadorevaluacion"
        managed = True
        verbose_name = "Profesor Evaluacion"
        verbose_name_plural = "Profesores Evaluaciones"

    class Admin(admin.ModelAdmin):
        pass


__all__ = ["ProfesorEvaluacion"]
