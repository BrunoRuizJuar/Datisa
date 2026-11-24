export const activities = {
  '4-1-introduccion': ['Un archivo municipal recibe «solicito una copia del acta». ¿Qué cambiaría entre predecir su tema y predecir su prioridad?', 'El texto de entrada podría ser el mismo. Cambian las etiquetas, los ejemplos necesarios y el significado de un error.'],
  '4-1-1-aprendizaje-automatico': ['Si el error cae solo en entrenamiento, ¿qué dato usarías para saber si el cambio te ayuda con solicitudes nuevas?', 'Compara modelos con una partición de validación y guarda otra de prueba para estimar el rendimiento del modelo elegido.'],
  '4-1-2-aprendizaje-supervisado': ['Un ticket dice «no llegó y ya me cobraron». Dos personas lo etiquetan de manera distinta. ¿Cómo prepararías el entrenamiento?', 'Fija un criterio de prioridad o admite varias etiquetas. Aplica el criterio tanto al entrenamiento como a la evaluación.'],
  '4-1-3-clasificacion-automatica': ['¿Puede subir accuracy aunque el filtro deje pasar todo el spam?', 'Sí. Si casi todo el correo es legítimo, predecir siempre legítimo puede acertar mucho y dar recall cero para spam.'],
  '4-2-clasificacion-probabilistica': ['En dos bandejas «oferta» es tres veces más probable en spam. ¿Qué otra cantidad necesitas para comparar sus posteriores?', 'La previa de cada clase. La misma evidencia puede cambiar una decisión en una bandeja y mantenerla en la otra.'],
  '4-2-1-naive-bayes': ['Si una palabra aparece en las dos clases con idéntica verosimilitud positiva, ¿qué decide la clasificación cuando es la única evidencia?', 'Las posteriores coinciden con las previas porque ambas contribuciones se multiplican por el mismo factor.'],
  '4-3-espacios-vectoriales': ['En un corpus de tickets, «pedido» aparece en todos. ¿Qué peso recibe con la convención de esta lección?', 'La coordenada de «pedido» vale cero en cada documento porque su frecuencia documental es igual al tamaño del corpus.'],
  '4-3-1-vecinos-cercanos': ['Si duplicas cada término de una consulta, ¿qué criterio conservaría el orden de los vecinos?', 'El coseno de vectores no nulos conserva la dirección al multiplicar la consulta por dos. La distancia euclídea sí puede cambiar el orden.'],
  '4-3-2-maquinas-vectores-soporte': ['¿Mover un punto lejos del margen siempre modifica la frontera de margen duro?', 'Si al moverlo conserva su clase y queda estrictamente fuera del margen, la frontera original sigue siendo óptima cuando se mantienen los soportes que la determinan.'],
  '4-4-x-smoso': ['Una reseña habla de dos problemas y los vecinos se reparten entre áreas. ¿Qué mostrarías al equipo?', 'La distribución de votos y los textos de los vecinos permiten revisar el caso antes de dirigirlo a una sola área.']
};

export const resources = {
  lead: 'Material para repasar conceptos, consultar las convenciones matemáticas y preparar los encuentros.',
  blocks: [
    ['Glosario breve', '<strong>Rasgo:</strong> coordenada numérica. <strong>Previa:</strong> probabilidad de clase antes de observar el texto. <strong>Margen:</strong> separación entre los bordes canónicos de la SVM. <strong>Evidencia:</strong> fragmento recuperado que se puede inspeccionar.'],
    ['Bibliografía', 'Manning, Raghavan y Schütze, <cite>Introduction to Information Retrieval</cite>. <a href="https://nlp.stanford.edu/IR-book/html/htmledition/tf-idf-weighting-1.html">TF-IDF</a> · <a href="https://nlp.stanford.edu/IR-book/pdf/irbookonlinereading.pdf">Naïve Bayes (cap. 13)</a> · <a href="https://nlp.stanford.edu/IR-book/html/htmledition/k-nearest-neighbor-1.html">k-NN</a> · <a href="https://nlp.stanford.edu/IR-book/html/htmledition/support-vector-machines-the-linearly-separable-case-1.html">SVM lineal</a>.'],
    ['Material docente', '<a href="./src/encounters/kahoot-beholder.md">Banco del Beholder</a> · <a href="./src/encounters/kahoot-pal-integer.md">Banco de Pal-Integer</a>.']
  ]
};
