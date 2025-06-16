export interface Career {
  id: string;
  nombre: string;
  modalidad: 'CURSO_DIURNO' | 'CURSO_A_DISTANCIA' | 'CURSO_POR_ENCUENTRO';
  sede: string;
  anno_eval_ext: string;
  curso_evaluado: string;
  numero_eval_ext: number;
}