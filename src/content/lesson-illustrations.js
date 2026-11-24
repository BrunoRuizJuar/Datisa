const art = (scene, description, ...details) => ({ scene, description, details });

export const lessonIllustrations = {
  '4-1-introduccion': {
    "De un mensaje a una decisión": art('tagged', 'Un histórico con etiquetas permite orientar un mensaje nuevo.', 'Entrega', 'Facturación'),
    "Ejemplo didáctico": art('tagged', 'Una solicitud de copia de factura recibe la etiqueta Facturación.', 'copia · factura', 'Facturación'),
    "Aplicaciones y límites": art('choices', 'Un correo puede corresponder a entrega y a facturación.', 'Entrega', 'Facturación'),
    "Lo que sigue": art('archiveStack', 'Un grupo de noticias anotadas aporta ejemplos para aprender.', 'Noticias', 'Etiquetas')
  },
  '4-1-1-aprendizaje-automatico': {
    "¿Cómo podríamos resolverlo?": art('archiveStack', 'Los titulares etiquetados aportan ejemplos para aprender asociaciones.', 'Titulares', 'Temas'),
    "Idea intuitiva": art('wordCards', 'El contexto de la palabra banco cambia según los términos que la acompañan.', 'interés', 'banco', 'árbol'),
    "Ejemplo ilustrado": art('tagged', 'Banco, elevó y tasa aportan pistas sobre la categoría Economía.', 'banco · tasa', 'Economía'),
    "Aplicaciones adicionales": art('archiveStack', 'El mismo enfoque ayuda a organizar el catálogo y las solicitudes.', 'Biblioteca', 'Soporte'),
    "Limitaciones": art('duplicates', 'Una copia del mismo titular en prueba puede ocultar la memorización.', 'Entrenamiento', 'Prueba'),
    "Conexión": art('tagged', 'La siguiente lección explica cómo se asigna una etiqueta a cada ejemplo.', 'Ejemplo', 'Etiqueta')
  },
  '4-1-2-aprendizaje-supervisado': {
    "¿Cómo podríamos resolverlo?": art('split', 'El historial revisado se separa para practicar el ajuste y medir el desempeño.', 'Etiquetar', 'Ajustar', 'Evaluar'),
    "Idea intuitiva": art('tagged', 'El texto de un ticket se conserva junto con la etiqueta que lo describe.', 'Texto', 'Etiqueta'),
    "Ejemplo ilustrado": art('tagged', 'La etiqueta de una solicitud por doble cobro es Facturación.', 'doble cobro', 'Facturación'),
    "Aplicaciones adicionales": art('choices', 'Dos tareas de ejemplo asignan etiquetas de contrato o prioridad.', 'Contrato', 'Prioridad'),
    "Limitaciones": art('choices', 'Dos anotadores pueden proponer etiquetas distintas para el mismo ticket.', 'Entrega', 'Atención'),
    "Conexión": art('representation', 'En uso, los rasgos de un texto nuevo producen una decisión.', 'Texto nuevo', 'Rasgos', 'Predicción')
  },
  '4-1-3-clasificacion-automatica': {
    "¿Cómo podríamos resolverlo?": art('threshold', 'La puntuación se sitúa a un lado u otro del umbral.', 'Puntuación', 'Umbral'),
    "Idea intuitiva": art('threshold', 'Dos posiciones posibles del umbral cambian la decisión para un mismo correo.', 'Umbral bajo', 'Umbral alto'),
    "Ejemplo ilustrado": art('threshold', 'La puntuación 0,72 queda entre 0,60 y 0,80.', '0,60', '0,80', '0,72'),
    "Aplicaciones adicionales": art('tagged', 'Un documento marcado pasa a revisión humana.', 'Solicitud', 'Revisión'),
    "Limitaciones": art('comparison', 'Una salida de modelo y una probabilidad calibrada tienen interpretaciones diferentes.', 'Puntuación', 'Probabilidad', 'Calibración'),
    "Conexión": art('evidence', 'La previa y la evidencia textual intervienen en la predicción de spam.', 'Previa', 'Evidencia', 'Posterior')
  },
  '4-2-clasificacion-probabilistica': {
  },
  '4-2-1-naive-bayes': {
    "¿Cómo podríamos resolverlo?": art('evidence', 'Se combina la frecuencia previa con la frecuencia de oferta en cada tipo de correo.', 'Spam', 'Legítimo', '«oferta»'),
    "Idea intuitiva": art('comparison', 'Entre veinte correos con oferta, doce son spam y ocho son legítimos.', '12 spam', '8 legítimos', '20 con oferta'),
    "Ejemplo numérico": art('comparison', 'La parte spam de los correos con oferta es sesenta por ciento.', '12 spam', '8 legítimos', '60 % spam'),
    "Aplicaciones adicionales": art('choices', 'El mismo modelo se puede emplear en noticias y solicitudes de soporte.', 'Noticias', 'Soporte'),
    "Limitaciones": art('wordCards', 'La expresión sin costo contiene palabras que aportan evidencia relacionada.', 'sin', 'costo'),
    "Conexión": art('representation', 'Los conteos por término forman un vector que se puede comparar con otros.', 'Texto', 'Conteos', 'Vector')
  },
  '4-3-espacios-vectoriales': {
    "Ejemplo didáctico": art('comparison', 'Pedido figura en cuatro de cuatro documentos y factura en uno de cuatro.', 'pedido · 4/4', 'factura · 1/4', 'IDF'),
    "Dos formas de usar los vectores": art('choices', 'La misma representación se puede usar con vecinos cercanos o con SVM.', 'k-NN', 'SVM')
  },
  '4-3-1-vecinos-cercanos': {
    "¿Cómo podríamos resolverlo?": art('neighborhood', 'El ticket nuevo se compara con puntos etiquetados de las dos clases.', 'Doc. nuevo'),
    "Idea intuitiva": art('rays', 'Dos vectores con longitudes diferentes apuntan en la misma dirección.', 'A', 'B'),
    "Ejemplo ilustrado": art('rays', 'Los vectores de coordenadas uno, dos y dos, cuatro tienen la misma dirección.', '(1, 2)', '(2, 4)'),
    "Aplicaciones adicionales": art('archiveStack', 'Los vecinos etiquetados se recuperan como ejemplos parecidos.', 'Ticket nuevo', 'Casos previos'),
    "Limitaciones": art('neighborhood', 'Un punto de otra clase aislado puede dominar la decisión local.', 'Vecino atípico', true),
    "Conexión": art('margin', 'Una frontera separa los grupos sin votar por los vecinos.', 'Frontera')
  },
  '4-3-2-maquinas-vectores-soporte': {
    "¿Cómo podríamos resolverlo?": art('split', 'Los tickets etiquetados se reparten entre ajuste, validación y prueba.', 'Ajustar', 'Validar', 'Probar'),
    "Idea intuitiva": art('margin', 'La frontera de margen duro queda en el centro del corredor.', 'Margen'),
    "Ejemplo ilustrado": art('margin', 'El documento de coordenadas siete y tres queda del lado Entrega.', '(7, 3)', '', true),
    "Aplicaciones adicionales": art('wordCards', 'Los términos con peso alto ayudan a interpretar la decisión.', 'retraso', 'cargo'),
    "Limitaciones": art('margin', 'Un ejemplo puede caer dentro de un margen suave.', 'Margen suave', '', false, true),
    "Conexión": art('choices', 'Una reseña se puede clasificar en categorías de quejas.', 'Entrega', 'Calidad')
  }
};