from django.contrib import admin

from apps.negocio.sgac import models
from apps.negocio.sgac.models.profesor_evaluacion import ProfesorEvaluacion

# Register your models here.
admin.register(models.Asignatura)(models.Asignatura.Admin)
admin.register(models.Carrera)(models.Carrera.Admin)
admin.register(models.Disciplina)(models.Disciplina.Admin)
admin.register(models.Evento)(models.Evento.Admin)
admin.register(models.IndicadorEvaluacion)(models.IndicadorEvaluacion.Admin)
admin.register(models.Premio)(models.Premio.Admin)
admin.register(models.Profesor)(models.Profesor.Admin)
admin.register(models.Publicacion)(models.Publicacion.Admin)
admin.register(models.PublicacionClasificacion)(models.PublicacionClasificacion.Admin)
admin.register(models.ProfesorPublicacion)(models.ProfesorPublicacion.Admin)
admin.register(ProfesorEvaluacion)(ProfesorEvaluacion.Admin)
