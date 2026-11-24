export const foundations = {
  '4-1-1-aprendizaje-automatico': {
    lead: 'Aprender de los datos significa ajustar un modelo a partir de ejemplos y comprobar si funciona con documentos nuevos.',
    blocks: [
      ['Problema real', 'Un portal quiere asignar temas a noticias que incorporan continuamente vocabulario nuevo. Una lista de palabras escrita a mano exige actualizaciones frecuentes.'],
      ['Pregunta detonadora', 'Si una regla busca «banco», ¿cómo distinguiría una noticia sobre tasas de interés de otra sobre un parque?'],
      ['¿Cómo podríamos resolverlo?', 'Usamos rasgos del texto y ejemplos de noticias para que el modelo aprenda qué combinaciones de palabras orientan la decisión.'],
      ['Idea intuitiva', '«Banco» es ambiguo por sí solo. Términos que lo acompañan, como «interés» o «árbol», pueden aportar contexto.'],
      ['Explicación formal', 'En un clasificador entrenado por minimización de pérdida, se buscan parámetros que reduzcan los errores medidos sobre el conjunto de entrenamiento. La evaluación se hace con documentos reservados.'],
      ['Fórmula', 'Cada pérdida ℓ compara la predicción del ejemplo i con su etiqueta y. El promedio resume el desempeño de entrenamiento.', { tex: String.raw`\textcolor{#704995}{\frac{1}{n}\sum_{i=1}^{n}}\textcolor{#8a561c}{\ell}(\textcolor{#217453}{\hat y_i},\textcolor{#285f91}{y_i})`, plain: 'Pérdida media = suma de ℓ(ŷᵢ, yᵢ) dividida por n', terms: [['parameter','(1/n) Σᵢ','Suma las pérdidas de los n documentos y divide por n. El índice i recorre los ejemplos.'],['evidence','ℓ','Función que penaliza la discrepancia entre la predicción y la etiqueta.'],['result','ŷᵢ','Clase predicha por el modelo para el documento i.'],['prior','yᵢ','Etiqueta observada que se usa como referencia.']] }],
      ['Ejemplo ilustrado', '«El banco elevó la tasa» → rasgos: banco, elevó, tasa → posible categoría: Economía. Ejemplo didáctico, sin un modelo entrenado.'],
      ['Aplicaciones adicionales', 'El mismo enfoque permite organizar bibliotecas digitales o dirigir mensajes a un equipo de soporte.'],
      ['Limitaciones', 'Si se repiten documentos casi idénticos entre entrenamiento y prueba, la evaluación puede sobreestimar la capacidad para clasificar textos nuevos.'],
      ['Conexión', 'Veamos de dónde vienen las etiquetas que orientan el entrenamiento supervisado.']
    ]
  },
  '4-1-2-aprendizaje-supervisado': {
    lead: 'El aprendizaje supervisado utiliza documentos con etiquetas conocidas para aprender a predecir la categoría de textos nuevos.',
    blocks: [
      ['Problema real', 'Un equipo de soporte tiene un historial de solicitudes atendidas y necesita canalizar las que llegan hoy.'],
      ['Pregunta detonadora', '¿Qué información del historial le diría al modelo cuál era el equipo correcto para cada solicitud?'],
      ['¿Cómo podríamos resolverlo?', 'Usamos las categorías revisadas por el equipo como etiquetas y reservamos parte de los ejemplos para evaluar el modelo.'],
      ['Idea intuitiva', 'Cada ejemplo es una pareja: el texto aporta pistas y la etiqueta indica la respuesta esperada.'],
      ['Explicación formal', 'La representación convierte cada documento dᵢ en un vector de rasgos xᵢ. La etiqueta yᵢ pertenece al conjunto de categorías definidas para la tarea.'],
      ['Fórmula', 'El conjunto de entrenamiento reúne n parejas de vectores y etiquetas.', {tex: String.raw`\textcolor{#217453}{\mathcal D}=\{(\textcolor{#8a561c}{\mathbf{x}_i},\textcolor{#285f91}{y_i})\}_{\textcolor{#704995}{i=1}}^{\textcolor{#704995}{n}}`, plain: 'D = colección de parejas (xᵢ, yᵢ), desde i = 1 hasta n', terms: [['result','𝒟','Colección de ejemplos disponibles para entrenar el modelo.'],['evidence','xᵢ','Vector que codifica los rasgos de entrada del documento i.'],['prior','yᵢ','Etiqueta conocida que supervisa la predicción para ese vector.'],['parameter','i, n','i identifica cada ejemplo y n fija cuántas parejas contiene la colección.']]}],
      ['Ejemplo ilustrado', '«Me cobraron dos veces» → texto de entrada. Facturación → etiqueta revisada. Una solicitud futura aporta únicamente su texto a la predicción.'],
      ['Aplicaciones adicionales', 'Las etiquetas pueden representar temas, tipos de contrato o prioridades de atención.'],
      ['Limitaciones', 'Categorías ambiguas o etiquetadas con criterios inconsistentes dificultan el aprendizaje y la evaluación. Conviene acordar cómo etiquetar mensajes que describen varios problemas.'],
      ['Conexión', 'Con el modelo ajustado y las etiquetas definidas, podemos automatizar la decisión para cada documento nuevo.']
    ]
  },
  '4-1-3-clasificacion-automatica': {
    lead: 'Clasificar automáticamente consiste en aplicar un criterio repetible a cada documento nuevo y convertir su salida en una decisión.',
    blocks: [
      ['Problema real', 'Un filtro de correo debe decidir qué mensajes enviar a la carpeta de spam.'],
      ['Pregunta detonadora', '¿Qué error sería más costoso: dejar pasar un anuncio o enviar una confirmación de compra a spam?'],
      ['¿Cómo podríamos resolverlo?', 'Representamos el correo, calculamos una puntuación para spam y la comparamos con un umbral.'],
      ['Idea intuitiva', 'Un umbral más alto exige una puntuación mayor antes de mover un correo a spam. En datos etiquetados podemos observar qué errores cambian al moverlo.'],
      ['Explicación formal', 'En una decisión binaria, s(d) es la puntuación asignada a spam para el documento d. El umbral τ determina cuándo se elige esa clase.'],
      ['Fórmula', 'La clase es spam cuando la puntuación alcanza o supera el umbral.', {tex: String.raw`\textcolor{#217453}{\hat y}=\mathrm{spam}\quad\text{si}\quad \textcolor{#8a561c}{s}(\textcolor{#285f91}{d})\geq\textcolor{#704995}{\tau}`, plain: 'ŷ = spam si s(d) ≥ τ', terms: [['prior','d','Correo cuya clase se quiere determinar.'],['evidence','s','Función que asigna al correo una puntuación a favor de spam.'],['parameter','τ','Umbral que fija la puntuación mínima para clasificar como spam. La igualdad también activa esa clase.'],['result','ŷ','Etiqueta predicha. Si la condición falla, en este ejemplo se elige correo legítimo.']]}],
      ['Ejemplo ilustrado', 'En un ejemplo didáctico, una puntuación de 0,72 se clasifica como spam con un umbral de 0,60 y como correo legítimo con un umbral de 0,80.'],
      ['Aplicaciones adicionales', 'Una decisión similar puede marcar solicitudes que requieren revisión antes de asignarles una categoría definitiva.'],
      ['Limitaciones', 'Una puntuación arbitraria no representa necesariamente una probabilidad. El umbral se debe evaluar con datos reservados y con los costos de cada error.'],
      ['Conexión', 'Naïve Bayes ofrece una manera de calcular puntuaciones a partir de probabilidades previas y de la evidencia textual.']
    ]
  }
};