export interface Publication {
  id: string;
  anno: number;
  titulo: string;
  revistaEditorial: string;
  tipoPublicacion: 'articulo' | 'libro' | 'libro_digital' | 'capitulo_libro' | 'texto_carrera' | 'material_docente' | 'patente';
  isbnIssn: string;
  verificacionLibro: string;
  baseDatosRevista: string;
  verificacionReferencia: string;
  nivel: number;
  clasificacion: string;
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
    revistaEditorial: "Springer Nature",
    tipoPublicacion: "libro",
    isbnIssn: "978-3-030-12345-6",
    verificacionLibro: "DOI:10.1007/12345",
    baseDatosRevista: "Scopus",
    verificacionReferencia: "DOI:10.1007/12345",
    nivel: 1,
    clasificacion: ""
  },
  {
    id: "2",
    anno: 2022,
    titulo: "Machine Learning para diagnóstico médico temprano",
    revistaEditorial: "IEEE",
    tipoPublicacion: "articulo",
    isbnIssn: "1234-5678",
    verificacionLibro: "DOI:10.1109/TMI.2022.123456",
    baseDatosRevista: "Web of Science",
    verificacionReferencia: "DOI:10.1109/TMI.2022.123456",
    nivel: 2,
    clasificacion: ""
  },
  {
    id: "3",
    anno: 2021,
    titulo: "Blockchain en sistemas de salud: una revisión sistemática",
    revistaEditorial: "Elsevier",
    tipoPublicacion: "capitulo_libro",
    isbnIssn: "978-1-4503-9999-1",
    verificacionLibro: "ISBN:978-1-4503-9999-1",
    baseDatosRevista: "SciELO",
    verificacionReferencia: "ISBN:978-1-4503-9999-1",
    nivel: 3,
    clasificacion: ""
  },
  {
    id: "4",
    anno: 2020,
    titulo: "Desarrollo de software ágil en entornos educativos",
    revistaEditorial: "ACM",
    tipoPublicacion: "libro_digital",
    isbnIssn: "978-1-4503-8888-8",
    verificacionLibro: "DOI:10.1145/123456.789101",
    baseDatosRevista: "IEEE Xplore",
    verificacionReferencia: "DOI:10.1145/123456.789101",
    nivel: 1,
    clasificacion: ""
  }
];