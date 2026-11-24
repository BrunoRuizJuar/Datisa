export const sections = [
  { id: 'portada', title: 'Portada' },
  {
    id: '4-1-introduccion', number: '4.1', title: 'Introducción a la clasificación de documentos',
    description: 'Identifica qué aprende un clasificador y cómo convierte una tarea de lectura en una predicción.',
    children: [
      { id: '4-1-1-aprendizaje-automatico', number: '4.1.1', title: 'Aprendizaje automático' },
      { id: '4-1-2-aprendizaje-supervisado', number: '4.1.2', title: 'Aprendizaje supervisado' },
      { id: '4-1-3-clasificacion-automatica', number: '4.1.3', title: 'Clasificación automática' }
    ]
  },
  {
    id: '4-2-clasificacion-probabilistica', number: '4.2', title: 'Clasificación probabilística',
    description: 'Combina probabilidades y evidencia del texto para estimar a qué categoría pertenece un documento.',
    children: [
      { id: '4-2-1-naive-bayes', number: '4.2.1', title: 'Clasificación con Naïve Bayes' }
    ]
  },
  {
    id: '4-3-espacios-vectoriales', number: '4.3', title: 'Clasificación en espacios vectoriales',
    description: 'Representa textos como vectores y estudia cómo los clasificamos por cercanía o mediante una frontera.',
    children: [
      { id: '4-3-1-vecinos-cercanos', number: '4.3.1', title: 'Clasificación basada en vecinos cercanos' },
      { id: '4-3-2-maquinas-vectores-soporte', number: '4.3.2', title: 'Clasificación basada en máquinas de vectores soporte' }
    ]
  },
  { id: '4-4-x-smoso', number: '4.4', title: 'Proyecto integrador: X-smoso' },
  { id: 'recursos', title: 'Recursos y bibliografía' }
];

export const sequence = sections.flatMap(section => [section, ...(section.children ?? [])]);
export const sectionTitle = section => [section.number, section.title].filter(Boolean).join(' ');
