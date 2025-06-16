from django.urls import path

from apps.negocio.sgac.models import ProfesorPublicacion
from apps.negocio.sgac.views.asignatura import AsignaturaViewSet
from apps.negocio.sgac.views.carrera import CarreraViewSet
from apps.negocio.sgac.views.disciplina import DisciplinaViewSet
from apps.negocio.sgac.views.evento import EventoViewSet
from apps.negocio.sgac.views.indicador_evaluacion import IndicadorEvaluacionViewSet
from apps.negocio.sgac.views.premio import PremioViewSet
from apps.negocio.sgac.views.profesor import ProfesorViewSet
from apps.negocio.sgac.views.profesor_evaluacion import ProfesorEvaluacionViewSet
from apps.negocio.sgac.views.profesor_publicacion import ProfesorPublicacionViewSet
from apps.negocio.sgac.views.publicacion import PublicacionViewSet

acciones_listar = {"get": "list", "post": "create"}
acciones_detalles = {
    "get": "retrieve",
    "put": "update",
    "delete": "destroy",
    "patch": "partial_update",
}

listar_carreras = CarreraViewSet.as_view(acciones_listar)
detalle_carreras = CarreraViewSet.as_view(acciones_detalles)

listar_disciplinas = DisciplinaViewSet.as_view(acciones_listar)
detalle_disciplinas = DisciplinaViewSet.as_view(acciones_detalles)

listar_profesores = ProfesorViewSet.as_view(acciones_listar)
detalle_profesores = ProfesorViewSet.as_view(acciones_detalles)

listar_indicador_evaluacion = IndicadorEvaluacionViewSet.as_view(acciones_listar)
detalle_indicador_evaluacion = IndicadorEvaluacionViewSet.as_view(acciones_detalles)

listar_publicacion = PublicacionViewSet.as_view(acciones_listar)
detalle_publicacion = PublicacionViewSet.as_view(acciones_detalles)

listar_publicacion_autor = ProfesorPublicacionViewSet.as_view(acciones_listar)
detalle_publicacion_autor = ProfesorPublicacionViewSet.as_view(acciones_detalles)

listar_premio = PremioViewSet.as_view(acciones_listar)
detalle_premio = PremioViewSet.as_view(acciones_detalles)

listar_evento = EventoViewSet.as_view(acciones_listar)
detalle_evento = EventoViewSet.as_view(acciones_detalles)

listar_asignatura = AsignaturaViewSet.as_view(acciones_listar)
detalle_asignatura = AsignaturaViewSet.as_view(acciones_detalles)

listar_profesores_evaluacion = ProfesorEvaluacionViewSet.as_view(acciones_listar)
detalle_profesores_evaluacion = ProfesorEvaluacionViewSet.as_view(acciones_detalles)

# fmt: off
urlpatterns = [
    path("eventos", listar_evento, name="evento-list"),
    path("eventos/<int:id_evento>", detalle_evento, name="evento-detail"),
    path("premios", listar_premio, name="premio-list"),
    path("premios/<int:id_premio>", detalle_premio, name="premio-detail"),
    path("publicaciones/", listar_publicacion, name="publicacion-list"),
    path("publicaciones/<int:id_publicacion>",detalle_publicacion,name="publicacion-detail"),
    path("publicaciones/<int:id_publicacion>/autores", listar_publicacion_autor, name="profesorpublicacion-list"),
    path("publicaciones/<int:id_publicacion>/autores/<int:id_profesor>", detalle_publicacion_autor, name="profesorpublicacion-detail"),
    path("indicadores-evaluacion", listar_indicador_evaluacion, name="indicadorevaluacion-list"),
    path("indicadores-evaluacion/<int:id_indicador>", detalle_indicador_evaluacion, name="indicadorvaluacion-detail"),
    path("profesores", listar_profesores, name="profesor-list"),
    path("profesores/<int:id_profesor>", detalle_profesores, name="profesor-detail"),
    path("profesores/<int:id_profesor>/evaluaciones", listar_profesores_evaluacion, name="profesorevaluacion-list"),
    path("profesores/<int:id_profesor>/evaluaciones/<int:id_indicador>", detalle_profesores_evaluacion, name="profesorevaluacion-detail"),
    path("carreras", listar_carreras, name="carrera-list"),
    path("carreras/<int:id_carrera>", detalle_carreras, name="carrera-detail"),
    path("carreras/<int:id_carrera>/disciplinas",listar_disciplinas, name="disciplina-list"),
    path("carreras/<int:id_carrera>/disciplinas/<int:id_disciplina>",detalle_disciplinas, name="disciplina-detail"),
    path("carreras/<int:id_carrera>/disciplinas/<int:id_disciplina>/asignaturas",listar_asignatura, name="asignatura-list"),
    path("carreras/<int:id_carrera>/disciplinas/<int:id_disciplina>/asignaturas/<int:id_asignatura>",detalle_asignatura, name="asignatura-detail"),
]

# fmt: on
