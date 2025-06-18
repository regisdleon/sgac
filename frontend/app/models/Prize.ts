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
  id: string;
  profesor: string;
  anno: string;
  descripcion: string;
  clasificacion: string;
}

export const mockPrizes: Prize[] = [
  {
    id: "1",
    profesor: "1",
    anno: "2023",
    descripcion: "Premio Nacional de Investigación Científica",
    clasificacion: "Científico"
  },
  {
    id: "2",
    profesor: "2",
    anno: "2022",
    descripcion: "Galardón Internacional a la Innovación Tecnológica",
    clasificacion: "Tecnológico"
  },
  {
    id: "3",
    profesor: "3",
    anno: "2023",
    descripcion: "Distinción Académica a la Excelencia Docente",
    clasificacion: "Académico"
  }
];