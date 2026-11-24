# Kahoot 1 · Beholder del Sobreajuste

Banco de 10 preguntas para cargar en Kahoot. Los porcentajes y conteos son ejemplos didácticos. La última columna indica la respuesta correcta y su justificación.

| # | Dificultad | Pregunta | A | B | C | D | Respuesta |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Fácil | ¿Qué produce un clasificador de documentos? | Una categoría prevista | Una copia del documento | Un vocabulario de sinónimos | Un resumen de cada párrafo | A. La salida es la categoría prevista. |
| 2 | Fácil | ¿Qué dato hace supervisado el entrenamiento? | El orden de llegada | La etiqueta conocida de cada ejemplo | El tamaño del archivo | La fecha en que se escribió | B. Las etiquetas proporcionan las respuestas esperadas. |
| 3 | Fácil | ¿Para qué sirve reservar documentos de prueba? | Para definir las etiquetas | Para equilibrar el entrenamiento automáticamente | Para medir el desempeño con textos que el modelo no usó al ajustarse | Para aumentar el tamaño del vocabulario | C. La prueba estima la generalización. |
| 4 | Fácil | Antes de leer un correo, ¿qué expresa P(spam)? | Cuántas veces aparece «oferta» en spam | La probabilidad de spam dado «oferta» | La proporción de la palabra «oferta» | La probabilidad previa de que el correo sea spam | D. La previa describe la clase antes de observar evidencia. |
| 5 | Fácil | ¿Qué expresa P(«oferta» presente dado spam)? | La fracción del spam que contiene «oferta» | La fracción de correos con «oferta» que son spam | La fracción total de spam | La fracción de correos legítimos | A. Se restringe el cálculo a los correos spam. |
| 6 | Intermedia | De 20 correos que contienen «oferta», 12 son spam. ¿Cuál es P(spam dado «oferta»)? | 12 % | 40 % | 60 % | 80 % | C. Se divide 12 entre 20. |
| 7 | Intermedia | Si la evidencia es igual de probable en ambas clases y puede ocurrir, ¿qué pasa con la posterior? | Siempre es 50 % | Coincide con la previa | Se duplica | Se vuelve imposible de calcular | B. La evidencia multiplica ambos pesos por el mismo factor. |
| 8 | Intermedia | ¿Qué simplificación usa el Naïve Bayes multinomial al modelar el texto? | Las clases son igual de frecuentes | Todas las palabras tienen el mismo peso | Cada documento pertenece a varias clases | Las posiciones de las palabras se modelan como independientes dada la clase | D. Se multiplican sus factores condicionados a la clase. |
| 9 | Fácil | ¿Qué problema evita el suavizado de Laplace? | Asignar cero a un término del vocabulario ausente en una clase | Tener que usar documentos etiquetados | Descartar automáticamente todas las palabras frecuentes | Calcular una probabilidad previa | A. Sumar uno al conteo da masa positiva al término ausente. |
| 10 | Intermedia | Hay 20 tokens en una clase y un vocabulario de 5 términos. ¿Qué probabilidad recibe un término ausente con Laplace? | 0 | 1/20 | 1/25 | 5/20 | C. El conteo pasa a 1 y el total a 25. |
