export enum PrizeType {
  PREMIO_NACIONAL_ACC = 'Premio Nacional de la ACC',
  PREMIO_PROVINCIAL_ACC = 'Premio Provincial de la ACC',
  PREMIO_NACIONAL_CITMA = 'Premio Nacional CITMA',
  PREMIO_PROVINCIAL_CITMA = 'Premio Provincial CITMA',
  PREMIO_EVENTOS_CIENTIFICOS = 'Premios de Eventos Científicos',
  PREMIO_CIENTIFICO_INTERNACIONAL = 'Premios Científicos Internacionales',
  DISTINCION_MINISTRO = 'Distinción del Ministro',
  PREMIO_RECTOR = 'Premio del Rector',
  PREMIO_DECANO = 'Premio del decano',
  CONDECORACION_NACIONAL = 'Condecoraciones Nacionales',
  CONDECORACION_INTERNACIONAL = 'Condecoraciones Internacionales',
  RECONOCIMIENTO_ESTUDIANTIL = 'Reconocimientos de las organizaciones estudiantiles',
  OTRO_PREMIO_CIENTIFICO = 'Otros premios científicos',
  OTRO = 'Otros'
}

export interface Professor {
  _id: string;
  nombre: string;
  apellidos: string;
}

export interface Prize {
  _id: string;
  nombre: string;
  createdAt: string;
  updatedAt: string;
}

export const mockPrizes: Prize[] = [
  {
    id: "1",
    nombre: "Premio Nacional de Investigación Científica",
  },
  {
    id: "2",
    nombre: "Galardón Internacional a la Innovación Tecnológica",
  },
  {
    id: "3",
    nombre: "Distinción Académica a la Excelencia Docente",
  }
];