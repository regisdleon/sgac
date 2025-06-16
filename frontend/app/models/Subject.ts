import type { Discipline } from "~/models/Discipline";
import type { Curriculum } from "~/models/Curriculum";

export interface Subject {
  id: string;
  disciplina: Discipline; // ID de la disciplina
  nombre: string;
  codigo: string;
  anno: 1 | 2 | 3 | 4 | 5 | 6;
  semestre: 1 | 2;
  modalidad: 'DIURNO' | 'A_DISTANCIA' | 'POR_ENCUENTRO';
  curriculo: 'BASE' | 'PROPIO' | 'OPTATIVA' | 'ELECTIVA';
}

export const mockSubjects: Subject[] = [
  {
    id: '1',
    disciplina: {
      id: 1, // o el ID real de una disciplina mock
      codigo: 'INF',
      nombre: 'Informática',
      carrera: {
        id: "1",
        nombre: "Ingeniería Informática",
        modalidad: "CURSO_DIURNO",
        sede: "Principal",
        anno_eval_ext: "2025",
        curso_evaluado: "2024-2025",
        numero_eval_ext: 1
      }
    },
    nombre: 'Programación I',
    codigo: 'INF101',
    anno: 1,
    semestre: 1,
    modalidad: 'DIURNO',
    curriculo: 'BASE'
  },
  {
    id: '2',
    disciplina: {
      id: 2, // o el ID real de otra disciplina mock
      codigo: 'MAT',
      nombre: 'Matemática',
      carrera: {
        id: "1",
        nombre: "Ingeniería Informática",
        modalidad: "CURSO_DIURNO",
        sede: "Principal",
        anno_eval_ext: "2025",
        curso_evaluado: "2024-2025",
        numero_eval_ext: 1
      }
    },
    nombre: 'Programación II',
    codigo: 'INF102',
    anno: 1,
    semestre: 2,
    modalidad: 'DIURNO',
    curriculo: 'BASE'
  }
];