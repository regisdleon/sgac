export interface Publication {
  id: string;
  anno: number;
  titulo: string;
  revista_editorial: string;
  tipo_publicacion: string;
  isbn_issn: string;
  verificacion_libro: string;
  base_datos_revista: string;
  verificacion_referencia: string;
  nivel: number;
  clasificacion: string; // ID de la clasificación
}

export interface PublicationClassification {
  id: string;
  nombre: string;
}

export const mockPublications: Publication[] = [
  {
    id: "1",
    anno: 2023,
    titulo: "Avances en Inteligencia Artificial aplicada a la Educación",
    revista_editorial: "Springer Nature",
    tipo_publicacion: "Libro",
    isbn_issn: "978-3-030-12345-6",
    verificacion_libro: "DOI:10.1007/12345",
    base_datos_revista: "Scopus",
    verificacion_referencia: "DOI:10.1007/12345",
    nivel: 1,
    clasificacion: "1"
  },
  {
    id: "2",
    anno: 2022,
    titulo: "Machine Learning para diagnóstico médico temprano",
    revista_editorial: "IEEE",
    tipo_publicacion: "Artículo de revista",
    isbn_issn: "1234-5678",
    verificacion_libro: "DOI:10.1109/TMI.2022.123456",
    base_datos_revista: "Web of Science",
    verificacion_referencia: "DOI:10.1109/TMI.2022.123456",
    nivel: 2,
    clasificacion: "2"
  },
  {
    id: "3",
    anno: 2021,
    titulo: "Blockchain en sistemas de salud: una revisión sistemática",
    revista_editorial: "Elsevier",
    tipo_publicacion: "Artículo de conferencia",
    isbn_issn: "978-1-4503-9999-1",
    verificacion_libro: "ISBN:978-1-4503-9999-1",
    base_datos_revista: "SciELO",
    verificacion_referencia: "ISBN:978-1-4503-9999-1",
    nivel: 3,
    clasificacion: "3"
  },
  {
    id: "4",
    anno: 2020,
    titulo: "Desarrollo de software ágil en entornos educativos",
    revista_editorial: "ACM",
    tipo_publicacion: "Capítulo de libro",
    isbn_issn: "978-1-4503-8888-8",
    verificacion_libro: "DOI:10.1145/123456.789101",
    base_datos_revista: "IEEE Xplore",
    verificacion_referencia: "DOI:10.1145/123456.789101",
    nivel: 1,
    clasificacion: "1"
  }
];