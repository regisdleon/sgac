from django.contrib import admin
from django.contrib.admin import ModelAdmin
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class PublicacionClasificacion(models.Model):

    nombre = models.CharField(max_length=255, db_column="nombre")

    def __str__(self):
        return self.nombre

    class Meta:
        db_table = "sgac_clasificacionespublicacion"
        managed = True
        verbose_name = "Clasificacion Publicacion"
        verbose_name_plural = "Clasificaciones Publicacion"

    class Admin(admin.ModelAdmin):
        pass


class Publicacion(models.Model):
    TIPO_CHOICES = [
        ('articulo', 'Artículo'),
        ('libro', 'Libro'),
        ('libro_digital', 'Libro Digital'),
        ('capitulo_libro', 'Capítulo de Libro'),
        ('texto_carrera', 'Texto de la Carrera'),
        ('material_docente', 'Material Docente Interno'),
        ('patente', 'Patente'),
    ]

    anno = models.IntegerField(db_column="anno")
    titulo = models.CharField(db_column="titulo", max_length=500)
    revista_editorial = models.CharField(db_column="revista_editorial", max_length=500)
    tipo_publicacion = models.CharField(
        db_column="tipo_publicacion",
        max_length=500,
        choices=TIPO_CHOICES
    )
    isbn_issn = models.CharField(db_column="isbn_issn", max_length=500)
    verificacion_libro = models.CharField(db_column="verificacion_libro", max_length=500)
    base_datos_revista = models.CharField(
        db_column="base_datos_revista", max_length=500
    )
    verificacion_referencia = models.CharField(db_column="verificacion_referencia", max_length=500)
    nivel = models.IntegerField(
        db_column="nivel",
        validators=[
            MinValueValidator(1, message='El nivel mínimo es 1'),
            MaxValueValidator(4, message='El nivel máximo es 4')
        ]
    )

    def __str__(self):
        return self.titulo

    class Meta:
        db_table = "sgac_publicaciones"
        managed = True
        verbose_name = "Publicacion"
        verbose_name_plural = "Publicaciones"

    class Admin(ModelAdmin):
        pass


__all__ = ["Publicacion", "PublicacionClasificacion"]
