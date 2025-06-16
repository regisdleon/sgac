from django.contrib.admin import ModelAdmin
from django.db import models
from django.utils.translation import gettext_lazy as _


class Evento(models.Model):

    class Clasificacion(models.TextChoices):
        INTERNACIONAL = "INTERNACIONAL", _("Internacional")
        NACIONAL = "NACIONAL", _("Nacional")
        PROVINCIAL = "PROVINCIAL", _("Provincial")
        MUNICIPAL = "MUNICIPAL", _("Municipal")
        DE_BASE = "DE_BASE", _("De base")

    anno = models.IntegerField(db_column="anno")
    titulo = models.CharField(max_length=500, db_column="titulo")
    titulo_corto = models.CharField(max_length=255, db_column="titulo_corto")
    clasificacion = models.CharField(
        choices=Clasificacion.choices, max_length=255, db_column="clasificacion"
    )

    def __str__(self):
        return f"{self.anno}: {self.titulo}"

    class Meta:
        db_table = "sgac_eventos"
        managed = True
        verbose_name = "Evento"
        verbose_name_plural = "Eventos"

    class Admin(ModelAdmin):
        pass


__all__ = ["Evento"]
