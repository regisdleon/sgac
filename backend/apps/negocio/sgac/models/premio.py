from django.db import models
from django.contrib import admin


class Premio(models.Model):
    CLASIFICACION_CHOICES = [
        ("PREMIO_NACIONAL_ACC", "Premio nacional de la ACC"),
        ("PREMIO_PROVINCIAL_ACC", "Premio provincial de la ACC"),
        ("PREMIO_NACIONAL_CITMA", "Premio nacional del CITMA"),
        ("PREMIO_PROVINCIAL_CITMA", "Premio provincial del CITMA"),
        ("PREMIOS_EVENTOS_CIENTIFICOS", "Premios de eventos científicos"),
        ("PREMIOS_CIENTIFICOS_INTERNACIONALES", "Premios científicos internacionales"),
        ("DISTINCION_MINISTRO", "Distinción del ministro"),
        ("PREMIO_RECTOR", "Premio del rector"),
        ("PREMIO_DECANO", "Premio de decano"),
        ("CONDECORACIONES_NACIONALES", "Condecoraciones nacionales"),
        ("CONDECORACIONES_INTERNACIONALES", "Condecoraciones internacionales"),
        ("RECONOCIMIENTOS_ORG_ESTUDIANTILES", "Reconocimientos de las organizaciones estudiantiles"),
        ("OTROS_PREMIOS_CIENTIFICOS", "Otros premios científicos"),
        ("OTROS", "Otros"),
    ]

    profesor = models.ForeignKey(
        "Profesor", on_delete=models.CASCADE, db_column="id_profesor", related_name="premios"
    )
    anno = models.IntegerField(db_column="anno")
    descripcion = models.TextField(db_column="descripcion")
    clasificacion = models.CharField(
        max_length=50,
        choices=CLASIFICACION_CHOICES,
        db_column="clasificacion"
    )

    def __str__(self):
        return f"{self.descripcion} ({self.anno})"

    class Meta:
        db_table = "sgac_premios"
        managed = True
        verbose_name = "Premio"
        verbose_name_plural = "Premios"

    class Admin(admin.ModelAdmin):
        pass


__all__ = ["Premio"]
