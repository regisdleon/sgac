import type { Professors } from './Professors';

export interface Event {
  id: string | number;
  anno: number;
  titulo: string;
  titulo_corto: string;
  clasificacion: 'INTERNACIONAL' | 'NACIONAL' | 'PROVINCIAL' | 'MUNICIPAL' | 'DE_BASE';
  profesor_id?: string | number;
  profesor?: Professors;
}

export const mockEvents: Event[] = [
  {
    id: '1',
    anno: 2023,
    titulo: 'Conferencia Internacional de Inteligencia Artificial',
    titulo_corto: 'CIIA 2023',
    clasificacion: 'INTERNACIONAL',
    profesor_id: '1',
    profesor: {
      id: '1',
      nombre: 'Juan',
      primerApellido: 'Pérez',
      segundoApellido: 'Gómez',
      annosExperienciaCarrera: 10,
      annosExperienciaMes: 5,
      categoriaDocente: 'TITULAR',
      gradoCientifico: 'DOCTOR_EN_CIENCIA',
      correos: [{ etiqueta: 'personal', correo: 'juan.perez@example.com' }],
      telefonos: [{ etiqueta: 'personal', numero: '555-1234' }],
      drEspecialidadAfin: 'SI'
    }
  },
  {
    id: '2',
    anno: 2023,
    titulo: 'Taller Nacional de Desarrollo de Software',
    titulo_corto: 'TNDS 2023',
    clasificacion: 'NACIONAL',
    profesor_id: '2'
  }
];