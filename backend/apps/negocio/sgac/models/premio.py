from django.db import models
from django.contrib import admin


class Premio(models.Model):

    nombre = models.CharField(max_length=100, db_column="nombre")

    def __str__(self):
        return self.nombre

    class Meta:
        db_table = "sgac_premios"
        managed = True
        verbose_name = "Premio"
        verbose_name_plural = "Premios"

    class Admin(admin.ModelAdmin):
        pass


__all__ = ["Premio"]
