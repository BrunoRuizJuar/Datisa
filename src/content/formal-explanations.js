export const formalExplanations = {
  '4-1-introduccion': {
    heading: 'La tarea en símbolos',
    paragraphs: [
      'Primero se fija el conjunto de categorías posibles. En el ejemplo de la tienda, puede ser Entrega, Facturación y Atención. Si cada correo debe llegar a un solo equipo, la salida es una etiqueta de ese conjunto. Si se permite enviar el mismo correo a varios equipos, la salida es un conjunto de etiquetas y cambia la tarea.',
      'La representación asigna coordenadas con significado fijo. Si el vocabulario es [envío, factura, cobro], las tres posiciones corresponden a esas palabras para todos los correos. Un clasificador ajustado con esa representación debe recibir los mensajes nuevos en el mismo orden de coordenadas.',
      'Ajustar el modelo y aplicarlo son operaciones diferentes. Durante el ajuste se usan documentos con etiquetas conocidas. Durante la aplicación se toma un texto nuevo, se calcula su representación y se obtiene una predicción que se puede contrastar después con una revisión humana.'
    ]
  },
  '4-1-1-aprendizaje-automatico': {
    heading: 'Explicación formal',
    paragraphs: [
      'Cada noticia se convierte en un vector de rasgos. Un modelo con parámetros ajustables asigna puntuaciones a las categorías a partir de ese vector. La función de pérdida cuantifica qué tan lejos queda la salida del modelo de la etiqueta conocida. Algunas pérdidas usan las puntuaciones completas, incluso cuando la categoría con mayor puntuación ya es correcta.',
      'El riesgo empírico R̂(θ) es el promedio de las pérdidas bajo los parámetros θ. Por ejemplo, con pérdida 0–1 cada error vale uno y cada acierto vale cero. Minimizar esa pérdida puede ser difícil porque cambia a saltos con θ. Un método entrenable por gradientes puede minimizar una pérdida sustituta, como la entropía cruzada de las puntuaciones probabilísticas.',
      'Un error de entrenamiento bajo puede aparecer incluso si el modelo memorizó titulares. Para estimar la generalización, se eligen los ajustes con validación y se mide el desempeño final con un conjunto de prueba reservado. Las copias y versiones casi idénticas de una misma noticia deben permanecer juntas al separar esos conjuntos.'
    ]
  },
  '4-1-2-aprendizaje-supervisado': {
    heading: 'Explicación formal',
    paragraphs: [
      'En la pareja (xᵢ, yᵢ), xᵢ recoge los rasgos que están disponibles al recibir el documento. Por ejemplo, puede incluir los conteos de «cobro» y «envío». La etiqueta yᵢ es el equipo que, según el criterio de anotación, debía recibir la solicitud.',
      'Cada documento usa el mismo vocabulario y el mismo orden de coordenadas. Si alguien revisa una solicitud y agrega después la frase «derivada a Facturación», esa frase se debe excluir de los rasgos si no estará disponible al llegar una solicitud nueva. Incluirla daría al modelo acceso indirecto a la respuesta.',
      'El modelo se ajusta con parejas etiquetadas y recibe solo x al clasificar un documento nuevo. En prueba, y se conserva para comparar con la categoría predicha. Una etiqueta incorrecta o ambigua puede afectar tanto el ajuste como la evaluación.'
    ]
  },
  '4-1-3-clasificacion-automatica': {
    heading: 'Explicación formal',
    paragraphs: [
      'Una puntuación ordena los documentos según la evidencia a favor de spam. El umbral convierte ese orden en una decisión. Con los mismos correos y puntuaciones, subir el umbral solo puede mantener o reducir el conjunto de mensajes enviados a spam.',
      'Un falso positivo es un correo legítimo enviado a spam. Un falso negativo es un correo spam que queda en la bandeja de entrada. Subir el umbral puede reducir los falsos positivos a costa de dejar pasar más spam. La magnitud del cambio depende de cuántos correos tienen una puntuación entre el umbral anterior y el nuevo.',
      'Con mensajes de validación etiquetados podemos contar ambos errores para varios umbrales y elegir el que mejor refleja sus costos. El conjunto de prueba permite estimar el resultado de esa regla ya fijada. La puntuación solo admite una lectura probabilística cuando el modelo y su calibración justifican esa interpretación.'
    ]
  },
  '4-2-clasificacion-probabilistica': {
    heading: 'De la evidencia a la decisión',
    paragraphs: [
      'La previa se estima antes de mirar el contenido del mensaje. La verosimilitud se estima dentro de cada clase. Dos bandejas pueden tener la misma frecuencia de «oferta» entre sus correos spam y, aun así, llegar a probabilidades posteriores diferentes si reciben distintas proporciones de spam.',
      'Para comparar las clases, se multiplica la previa de cada una por la probabilidad de observar el texto dentro de esa clase. Al dividir cada producto entre la suma de ambos, se obtienen probabilidades posteriores que suman uno, siempre que la evidencia tenga probabilidad total positiva.'
    ]
  },
  '4-2-1-naive-bayes': {
    heading: 'Explicación formal',
    paragraphs: [
      'Sea S la clase spam, L la clase legítima y O el evento «el mensaje contiene oferta». La previa P(S) se calcula sobre todos los mensajes. La verosimilitud P(O | S) se calcula solo entre los mensajes spam. La posterior P(S | O) se calcula entre los mensajes donde se observó «oferta». Cambiar la condición cambia el conjunto de referencia.',
      'La probabilidad conjunta de spam y «oferta» se puede escribir como P(O | S) × P(S). Como S y L son clases excluyentes y cubren todos los mensajes del ejemplo, P(O) suma las contribuciones de las dos clases. Ese total normaliza el peso de spam para que la posterior quede entre cero y uno.',
      'Cuando se comparan varias clases para el mismo mensaje, el denominador es común y basta comparar los productos de previa y verosimilitud. Si queremos mostrar probabilidades posteriores, sí necesitamos normalizarlos. Cuando P(O) es cero en el modelo, la posterior condicionada a esa evidencia queda indefinida.',
      'Con un documento completo, la evidencia incluye muchos términos. El modelo multinomial estima una distribución sobre el vocabulario para cada clase. El conteo de cada término determina cuántas veces contribuye su probabilidad al cálculo. La independencia de las posiciones se supone dentro de una clase dada. Tomar logaritmos conserva el orden de las puntuaciones positivas. La regla multinomial pasa así a sumar el logaritmo de la previa y, para cada término, su conteo multiplicado por el logaritmo de su probabilidad condicional. Esto evita el subdesbordamiento del producto y permite recorrer solo los términos presentes.'
    ]
  },
  '4-3-espacios-vectoriales': {
    heading: 'Ponderar con TF-IDF',
    paragraphs: [
      'Bag of Words fija un vocabulario a partir del corpus de entrenamiento. Para un documento, TF se puede calcular con el conteo de apariciones de cada término. En cambio, la frecuencia documental aporta como máximo una unidad por documento, incluso si la palabra se repite allí muchas veces.',
      'En la variante mostrada, un término presente en todos los documentos tiene IDF cero. Cuanto menor sea su frecuencia documental, mayor es IDF. El peso final depende a la vez de cuántas veces aparece la palabra en el texto y de cuán extendida está en el corpus.',
      'Al transformar un documento nuevo se reutilizan el vocabulario y los valores de IDF aprendidos durante el entrenamiento. Luego podemos comparar esos vectores o pasarlos a un clasificador. Si después normalizamos la longitud del vector, estamos modificando la escala de los rasgos para la comparación.'
    ]
  },
  '4-3-1-vecinos-cercanos': {
    heading: 'Explicación formal',
    paragraphs: [
      'Guardamos los vectores etiquetados del entrenamiento y representamos el documento nuevo con las mismas coordenadas. Calculamos su distancia a cada vector y elegimos los k menores valores. Si usamos similitud coseno, elegimos los k mayores valores en su lugar. La regla de medida y el preprocesamiento se fijan antes de evaluar. Si u y v tienen norma euclídea uno, al desarrollar el cuadrado se obtiene ‖u − v‖² = 2 − 2u·v. Por eso, en vectores normalizados, minimizar distancia euclídea equivale a maximizar el coseno.',
      'Cada vecino elegido emite un voto por su etiqueta. Seleccionamos la clase con más votos y definimos de antemano qué hacer si dos clases empatan. La regla para empates de distancia también importa cuando varios documentos están igual de cerca y el corte de los k vecinos pasa entre ellos.',
      'k modifica qué tan local es la decisión. Con k = 1 decide un solo ejemplo. Con k mayor participan documentos más alejados y la clase predominante en esa zona puede cambiar. Validamos k con documentos que no participen como vecinos y reservamos la prueba para la evaluación final.'
    ]
  },
  '4-3-2-maquinas-vectores-soporte': {
    heading: 'Explicación formal',
    paragraphs: [
      'Cada texto se representa como un vector x. Para entrenar una SVM binaria codificamos las clases como +1 y −1. El modelo aprende un peso por rasgo y un sesgo. La puntuación suma los pesos multiplicados por los valores del texto y agrega el sesgo. El signo indica de qué lado de la frontera queda el documento.',
      'En la versión de margen duro, cada ejemplo debe quedar del lado correcto y alcanzar al menos una unidad de puntuación con el signo de su clase. Los puntos que alcanzan exactamente ese límite tocan uno de los dos bordes del corredor. En la demostración, son E1 y F1.',
      'La distancia perpendicular a la frontera se obtiene al dividir el valor absoluto de la puntuación entre la norma de los pesos. Al fijar los bordes en +1 y −1, el ancho total del margen es 2 dividido por esa norma. Buscar el margen más ancho equivale a minimizar la norma bajo las restricciones de separación.',
      'Cuando los textos se solapan, el margen suave permite puntos dentro del corredor e incluso clasificaciones incorrectas durante el ajuste. El parámetro C pondera la suma de las holguras no negativas que relajan las restricciones. Para unos pesos y un sesgo fijos, la holgura mínima de un ejemplo es el máximo entre cero y uno menos su margen funcional. Esa expresión es la pérdida bisagra. En un documento nuevo, la puntuación sigue siendo una decisión por lado de la frontera y no se interpreta automáticamente como una probabilidad.'
    ]
  }
};