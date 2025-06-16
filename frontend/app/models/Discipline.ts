import type { Career } from "~/models/Career";

export interface Discipline {
  id: number;
  carrera: Career; // Cambiado a objeto Career
  codigo: string;
  nombre: string;
}

export const mockDisciplines: Discipline[] = [
  {
    id: 1,
    carrera: { id: "1", nombre: "Estomatologia", modalidad: "CURSO_DIURNO", sede: "Sur", anno_eval_ext: "2025", curso_evaluado: "2026", numero_eval_ext: 5 },
    codigo: 'INF101',
    nombre: 'Programación I'
  },
  {
    id: 2,
    carrera: { id: "1", nombre: "Psicologia", modalidad: "CURSO_POR_ENCUENTRO", sede: "Norte", anno_eval_ext: "2025", curso_evaluado: "2026", numero_eval_ext: 5 },
    codigo: 'INF102',
    nombre: 'Programación II'
  }
];