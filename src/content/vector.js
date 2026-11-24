const reference = 'Manning, Raghavan y Schütze · Introduction to Information Retrieval';

export const vector = {
  '4-3-espacios-vectoriales': {
    lead: 'Con un vocabulario común, cada documento ocupa un punto. Podemos clasificarlo por los ejemplos etiquetados que tiene cerca o por el lado de una frontera en el que cae.',
    blocks: [
      ['Un eje por término', 'Si el vocabulario es [envío, factura, cobro], «envío envío factura» se representa como (2, 1, 0) con Bag of Words. Cada coordenada cuenta un término. Cambiar el orden de las palabras conserva ese vector.'],
      ['Pregunta para la clase', 'Si «pedido» aparece en casi todas las solicitudes, ¿debería influir tanto como «factura» al identificar un problema de cobro?'],
      ['Ponderar con TF-IDF', 'La frecuencia del término (TF) cuenta sus apariciones en el documento. La frecuencia documental (df) cuenta en cuántos documentos aparece al menos una vez. IDF reduce el peso de los términos presentes en muchos documentos. Estimamos IDF en el corpus de entrenamiento y usamos los mismos pesos al representar documentos nuevos.', {
        tex: String.raw`\textcolor{#217453}{\operatorname{tfidf}(t,d)}=\textcolor{#285f91}{\operatorname{tf}(t,d)}\;\textcolor{#8a561c}{\log\!\left(\frac{\textcolor{#704995}{N}}{\operatorname{df}(t)}\right)}`,
        plain: 'TF-IDF = frecuencia del término × log(N / df(t)).',
        terms: [['result','TF-IDF(t,d)','Peso final del término t en el vector del documento d.'],['prior','TF(t,d)','Cuenta cuántas veces aparece t en d. Aumenta el peso con las repeticiones locales.'],['parameter','N','Tamaño del corpus de entrenamiento. Fija la referencia para calcular la rareza.'],['evidence','df(t), log','df(t) cuenta documentos que contienen t. El logaritmo del cociente atenúa los términos extendidos en el corpus.']]
      }],
      ['Ejemplo didáctico', 'En un corpus inventado de cuatro solicitudes, «pedido» aparece en las cuatro y «factura» en una. Con logaritmo natural, «pedido» recibe IDF = ln(4/4) = 0 y «factura» recibe IDF = ln(4/1) ≈ 1,39. Si el documento contiene «factura» dos veces, su coordenada es aproximadamente 2,77.'],
      ['Dos formas de usar los vectores', 'TF-IDF produce los rasgos que reciben los clasificadores. k-NN consulta los documentos etiquetados más cercanos. Una SVM lineal aprende pesos que sirven para clasificar mediante un producto punto.']
    ],
    source: 'https://nlp.stanford.edu/IR-book/html/htmledition/tf-idf-weighting-1.html',
    sourceLabel: reference + ', cap. 6'
  },
  '4-3-1-vecinos-cercanos': {
    lead: 'Para clasificar una solicitud por sus vecinos, buscamos los documentos etiquetados con rasgos más parecidos y contamos sus votos.',
    lab: 'vector',
    blocks: [
      ['Problema real', 'Un equipo quiere dirigir tickets a Entrega o Facturación usando solicitudes etiquetadas que ya resolvió. Algunas son mensajes de una línea y otras incluyen varios párrafos.'],
      ['Pregunta detonadora', 'Si un mensaje repite el mismo texto dos veces, ¿debería ser menos parecido a su versión original?'],
      ['¿Cómo podríamos resolverlo?', 'Calculamos una representación común y ordenamos los ejemplos por distancia euclídea ascendente o por similitud coseno descendente. Elegimos el criterio al evaluar el clasificador.'],
      ['Idea intuitiva', 'La distancia euclídea mide cuán separados están los puntos. El coseno compara su dirección y es insensible a multiplicar un vector por una constante positiva.'],
      ['Explicación formal', 'Elegimos k documentos etiquetados y cada uno emite un voto. El laboratorio compara la distancia euclídea con Manhattan, que suma las diferencias absolutas por eje. Desempata distancias por identificador y señala los empates de votos. Elegimos k con validación y evaluamos al final con datos reservados.'],
      ['Medir la cercanía', 'La norma es la longitud de un vector. Al dividir el producto punto por ambas longitudes obtenemos la similitud coseno para dos vectores no nulos. En vectores de norma uno, ordenar por coseno equivale a ordenar por distancia euclídea ascendente.', {
        tex: String.raw`\textcolor{#217453}{\cos(\theta)}=\frac{\textcolor{#285f91}{\mathbf A}\cdot\textcolor{#8a561c}{\mathbf B}}{\textcolor{#704995}{\|\mathbf A\|\|\mathbf B\|}}`,
        plain: 'cos(θ) = (A · B) / (‖A‖ × ‖B‖).',
        terms: [['prior','A','Vector de la consulta. Sus coordenadas se multiplican con las correspondientes de B.'],['evidence','B','Vector de referencia en el mismo espacio. El producto punto suma los productos de las coordenadas.'],['parameter','‖A‖ ‖B‖','Producto de las normas euclídeas. Elimina el efecto de la magnitud cuando ambos vectores son no nulos.'],['result','cos(θ)','Similitud angular. Es 1 si los dos vectores tienen la misma dirección.']]
      }],
      ['Ejemplo ilustrado', 'Los vectores (1, 2) y (2, 4) tienen distancia euclídea √5 y coseno 1. En el laboratorio, el documento inicial recibe un voto de Entrega con k = 1. Cambia a k = 5 y revisa los identificadores y los votos.'],
      ['Aplicaciones adicionales', 'Los vecinos votantes permiten recuperar ejemplos etiquetados parecidos y explicar qué casos previos influyeron en la decisión.'],
      ['Limitaciones', 'Un k pequeño es sensible a etiquetas ruidosas. Uno grande puede favorecer a la clase más frecuente. Comparar un documento con todo el conjunto puede ser costoso, y el coseno queda indefinido si el documento produce un vector nulo.'],
      ['Conexión', 'La siguiente lección usa los mismos documentos para comparar la votación local con una frontera lineal.']
    ],
    source: 'https://nlp.stanford.edu/IR-book/html/htmledition/k-nearest-neighbor-1.html',
    sourceLabel: reference + ', cap. 14'
  },
  '4-3-2-maquinas-vectores-soporte': {
    lead: 'Una SVM lineal aprende una frontera a partir de textos etiquetados. Para clasificar un documento nuevo, evalúa de qué lado de la frontera cae su vector.',
    lab: 'vector',
    blocks: [
      ['Problema real', 'Un centro de soporte quiere clasificar solicitudes con miles de rasgos de vocabulario sin comparar cada solicitud nueva con todo el historial.'],
      ['Pregunta detonadora', 'Si varias líneas separan perfectamente los documentos de entrenamiento, ¿cómo elegir una?'],
      ['¿Cómo podríamos resolverlo?', 'Entrenamos una SVM lineal con vectores, por ejemplo de TF-IDF, y las etiquetas de Entrega y Facturación. Después evaluamos el modelo con solicitudes que quedaron fuera del entrenamiento.'],
      ['Idea intuitiva', 'En datos separables, la SVM de margen duro busca la frontera con el corredor más ancho entre las clases. Los documentos que tocan los bordes del corredor son vectores soporte en esta demostración.'],
      ['Explicación formal', 'La frontera es un hiperplano: en dos dimensiones se dibuja como una recta. El vector de pesos w es perpendicular a ella. El sesgo b la desplaza y el signo de la puntuación indica un lado u otro. Con la escala canónica los bordes del margen tienen puntuaciones +1 y −1.'],
      ['Fórmula de decisión', 'El hiperplano cumple s(x) = 0. La distancia entre los dos bordes es 2/‖w‖, por lo que un margen más amplio corresponde a una norma menor en esa escala.', {
        tex: String.raw`\textcolor{#217453}{s(\mathbf x)}=\textcolor{#704995}{\mathbf w}^{\mathsf T}\textcolor{#285f91}{\mathbf x}+\textcolor{#704995}{b}`,
        plain: 's(x) = wᵀx + b.',
        terms: [['prior','x','Vector del documento. Cada rasgo contribuye en proporción a su valor y al peso correspondiente.'],['parameter','wᵀ','Vector de pesos transpuesto para formar el producto punto. w es normal al hiperplano.'],['parameter','b','Sesgo que desplaza la frontera con respecto al origen.'],['result','s(x)','Puntuación de decisión. Su signo determina el lado y el valor cero sitúa el punto en la frontera.']]
      }],
      ['Ejemplo ilustrado', 'En los datos iniciales, la frontera es x = y y la puntuación canónica es (x − y)/2. E1 y F1 son los soportes: sus coordenadas (6,4) y (4,6) dan puntuaciones +1 y −1. Para (7,3), la puntuación es +2 y la clase es Entrega. Al editar los datos el laboratorio recalcula la frontera.'],
      ['Aplicaciones adicionales', 'Un modelo lineal permite inspeccionar qué términos tienen pesos positivos o negativos. La contribución de un término a un documento se obtiene multiplicando su peso por su valor en ese documento.'],
      ['Limitaciones', 'En textos reales las clases pueden solaparse. Una SVM de margen suave permite violaciones del margen. El parámetro C controla cuánto se penalizan, por lo que se elige con validación. Los pesos muestran asociaciones aprendidas en el conjunto de entrenamiento.'],
      ['Conexión', 'En 𝕏-smoso usaremos k-NN para enrutar reseñas etiquetadas. Una SVM también puede aprender a clasificar tipos de queja.']
    ],
    source: 'https://nlp.stanford.edu/IR-book/html/htmledition/support-vector-machines-the-linearly-separable-case-1.html',
    sourceLabel: reference + ', cap. 15'
  }
};
