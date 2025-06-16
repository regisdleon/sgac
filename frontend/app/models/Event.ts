export interface Event {
  id: string;
  anno: number;
  titulo: string;
  titulo_corto: string;
  clasificacion: 'INTERNACIONAL' | 'NACIONAL' | 'PROVINCIAL' | 'MUNICIPAL' | 'DE_BASE';
}

export const mockEvents: Event[] = [
  {
    id: '1',
    anno: 2023,
    titulo: 'Conferencia Internacional de Inteligencia Artificial',
    titulo_corto: 'CIIA 2023',
    clasificacion: 'INTERNACIONAL'
  },
  {
    id: '2',
    anno: 2023,
    titulo: 'Taller Nacional de Desarrollo de Software',
    titulo_corto: 'TNDS 2023',
    clasificacion: 'NACIONAL'
  }
];