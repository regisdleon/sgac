import type { Evaluation } from './Evaluation';

export interface Professors {
  id: string;
  nombre: string;
  primerApellido: string;
  segundoApellido?: string;
  annosExperienciaCarrera: number;
  annosExperienciaMes: number;
  categoriaDocente: string;
  gradoCientifico?: string;
  correos: { etiqueta: string; correo: string }[];
  telefonos: { etiqueta: string; numero: string }[];
  drEspecialidadAfin?: 'SI' | 'NO' | null;
  evaluations?: Evaluation[];
}

export const mockProfessors: Professors[] = [
  {
    id: "1",
    nombre: "Juan",
    primerApellido: "Pérez",
    segundoApellido: "Gómez",
    annosExperienciaCarrera: 10,
    annosExperienciaMes: 5,
    categoriaDocente: "TITULAR",
    gradoCientifico: "DOCTOR_EN_CIENCIA",
    correos: [
      { etiqueta: "Personal", correo: "juan.perez@example.com" },
      { etiqueta: "Trabajo", correo: "jperez@universidad.edu" },
    ],
    telefonos: [
      { etiqueta: "Móvil", numero: "555-1234" },
      { etiqueta: "Trabajo", numero: "555-5678" },
    ],
    drEspecialidadAfin: 'SI',
  },
  {
    id: "prof-002",
    nombre: "María",
    primerApellido: "Rodríguez",
    segundoApellido: "Fernández",
    annosExperienciaCarrera: 8,
    annosExperienciaMes: 3,
    categoriaDocente: "ASISTENTE",
    gradoCientifico: "DOCTOR_EN_CIENCIAS",
    correos: [{ etiqueta: "personal", correo: "m.rodriguez@universidad.edu" }],
    telefonos: [{ etiqueta: "personal", numero: "5357654321" }],
    drEspecialidadAfin: 'NO',
  },
  {
    id: "prof-003",
    nombre: "Luis",
    primerApellido: "Pérez",
    segundoApellido: "González",
    annosExperienciaCarrera: 15,
    annosExperienciaMes: 0,
    categoriaDocente: "TITULAR",
    gradoCientifico: "DOCTOR_EN_CIENCIA",
    correos: [{ etiqueta: "personal", correo: "l.perez@universidad.edu" }, { etiqueta: "secundario", correo: "luis.pg@outlook.com" }],
    telefonos: [{ etiqueta: "personal", numero: "5359876543" }, { etiqueta: "trabajo", numero: "786543219" }],
    drEspecialidadAfin: null,
  },
  {
    id: "prof-004",
    nombre: "Ana",
    primerApellido: "López",
    segundoApellido: "Díaz",
    annosExperienciaCarrera: 6,
    annosExperienciaMes: 0,
    categoriaDocente: "INSTRUCTOR",
    gradoCientifico: "DOCTOR_EN_CIENCIA",
    correos: [{ etiqueta: "personal", correo: "a.lopez@universidad.edu" }],
    telefonos: [{ etiqueta: "personal", numero: "5354567890" }],
    drEspecialidadAfin: 'SI',
  },
  {
    id: "prof-005",
    nombre: "Jorge",
    primerApellido: "Martín",
    segundoApellido: "Sánchez",
    annosExperienciaCarrera: 20,
    annosExperienciaMes: 0,
    categoriaDocente: "TITULAR",
    gradoCientifico: "DOCTOR_EN_CIENCIAS",
    correos: [{ etiqueta: "personal", correo: "j.martin@universidad.edu" }, { etiqueta: "secundario", correo: "jorgems@yahoo.com" }],
    telefonos: [{ etiqueta: "personal", numero: "5351112233" }, { etiqueta: "trabajo", numero: "785556667" }],
    drEspecialidadAfin: 'NO',
  },
  {
    id: "prof-006",
    nombre: "Laura",
    primerApellido: "García",
    segundoApellido: "Hernández",
    annosExperienciaCarrera: 9,
    annosExperienciaMes: 0,
    categoriaDocente: "AUXILIAR",
    gradoCientifico: "DOCTOR_EN_CIENCIA",
    correos: [{ etiqueta: "personal", correo: "l.garcia@universidad.edu" }],
    telefonos: [{ etiqueta: "personal", numero: "5359988776" }],
    drEspecialidadAfin: null,
  },
  {
    id: "prof-007",
    nombre: "Pedro",
    primerApellido: "Jiménez",
    segundoApellido: "Ruiz",
    annosExperienciaCarrera: 18,
    annosExperienciaMes: 0,
    categoriaDocente: "TITULAR",
    gradoCientifico: "DOCTOR_EN_CIENCIAS",
    correos: [{ etiqueta: "personal", correo: "p.jimenez@universidad.edu" }, { etiqueta: "secundario", correo: "pedro.jrz@hotmail.com" }],
    telefonos: [{ etiqueta: "personal", numero: "5353344556" }, { etiqueta: "trabajo", numero: "787778889" }],
    drEspecialidadAfin: 'SI',
  },
  {
    id: "prof-008",
    nombre: "Sofía",
    primerApellido: "Torres",
    segundoApellido: "Alvarez",
    annosExperienciaCarrera: 5,
    annosExperienciaMes: 0,
    categoriaDocente: "INSTRUCTOR",
    gradoCientifico: "DOCTOR_EN_CIENCIA",
    correos: [{ etiqueta: "personal", correo: "s.torres@universidad.edu" }],
    telefonos: [{ etiqueta: "personal", numero: "5356677889" }],
    drEspecialidadAfin: 'NO',
  },
  {
    id: "prof-009",
    nombre: "Ricardo",
    primerApellido: "Moreno",
    segundoApellido: "Vázquez",
    annosExperienciaCarrera: 14,
    annosExperienciaMes: 0,
    categoriaDocente: "TITULAR",
    gradoCientifico: "DOCTOR_EN_CIENCIAS",
    correos: [{ etiqueta: "personal", correo: "r.moreno@universidad.edu" }, { etiqueta: "secundario", correo: "ricardo.mv@protonmail.com" }],
    telefonos: [{ etiqueta: "personal", numero: "5351237890" }, { etiqueta: "trabajo", numero: "786543210" }],
    drEspecialidadAfin: null,
  },
  {
    id: "prof-010",
    nombre: "Elena",
    primerApellido: "Dominguez",
    segundoApellido: "Castro",
    annosExperienciaCarrera: 7,
    annosExperienciaMes: 0,
    categoriaDocente: "ASISTENTE",
    gradoCientifico: "DOCTOR_EN_CIENCIA",
    correos: [{ etiqueta: "personal", correo: "e.dominguez@universidad.edu" }],
    telefonos: [{ etiqueta: "personal", numero: "5354561237" }],
    drEspecialidadAfin: 'SI',
  }
];

export default mockProfessors;