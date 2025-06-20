import type { Professors } from './Professors';

export interface Event {
  id: string | number;
  anno: number;
  titulo: string;
  titulo_corto: string;
  clasificacion: 'INTERNACIONAL' | 'NACIONAL' | 'PROVINCIAL' | 'MUNICIPAL' | 'DE_BASE';
  profesor_id?: string | number;
  profesor_nombre?: string;
}

export const mockEvents: Event[] = [
  {
    id: '1',
    anno: 2023,
    titulo: 'Conferencia Internacional de Inteligencia Artificial',
    titulo_corto: 'CIIA 2023',
    clasificacion: 'INTERNACIONAL',
    profesor_id: '1',
    profesor_nombre: 'Juan Pérez Gómez'
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