export type EvaluacionValor = 'R' | 'B' | 'E' | 'NP';

export enum IndicadorEvaluacion {
  TRABAJO_DOCENTE = 'Trabajo docente-educativo en pregrado y posgrado',
  TRABAJO_POLITICO = 'Trabajo político-ideológico',
  TRABAJO_METODOLOGICO = 'Trabajo metodológico',
  INVESTIGACION = 'Trabajo de investigación e innovación',
  SUPERACION = 'Superación',
  EXTENSION = 'Extensión Universitaria',
  FUNCIONES_ADMIN = 'Funciones administrativas asignadas',
  GENERAL = 'General',
}

export interface Evaluation {
  id: string;
  profesor: string; // id o nombre del profesor
  indicador: IndicadorEvaluacion;
  fecha: string; // ISO date
  evaluacion: EvaluacionValor;
}


