# Kahoot 2 · Desafío de Pal-Integer

Banco para el docente. Cada pregunta tiene una sola respuesta correcta.

## 1. ¿Qué convierte una clasificación de reseñas en una tarea supervisada?

- A. Contar cuántos términos hay en el corpus
- B. Entrenar con reseñas que ya tienen etiquetas
- C. Crear grupos por distancia entre vectores
- D. Recuperar reseñas con una pregunta

**Respuesta correcta:** B. Entrenar con reseñas que ya tienen etiquetas

## 2. ¿Cuál es la función de un conjunto de prueba separado?

- A. Aprender el vocabulario del conjunto de entrenamiento
- B. Seleccionar ejemplos para ajustar el modelo
- C. Estimar su desempeño con ejemplos que no vio
- D. Aumentar el número de etiquetas

**Respuesta correcta:** C. Estimar su desempeño con ejemplos que no vio

## 3. ¿Qué aporta la probabilidad previa en Naïve Bayes?

- A. La frecuencia inicial de cada clase
- B. La distancia entre dos documentos
- C. El peso de la palabra más rara
- D. El umbral para enviar una reseña a revisión

**Respuesta correcta:** A. La frecuencia inicial de cada clase

## 4. ¿Qué supuesto hace Naïve Bayes sobre las palabras?

- A. Todas las clases tienen la misma frecuencia
- B. Todas las palabras tienen la misma probabilidad
- C. Las palabras conservan el orden original
- D. Las características son independientes dada la clase

**Respuesta correcta:** D. Las características son independientes dada la clase

## 5. ¿Para qué sirve sumar uno a los conteos en Naïve Bayes?

- A. Para ignorar las palabras que aparecen una vez
- B. Para evitar probabilidades cero en términos del vocabulario
- C. Para hacer iguales todas las probabilidades previas
- D. Para convertir los conteos en distancias

**Respuesta correcta:** B. Para evitar probabilidades cero en términos del vocabulario

## 6. Si subes el umbral de revisión de 50 % a 90 %, ¿qué pasa con una reseña puntuada en 70 %?

- A. Deja de enviarse a revisión por ese filtro
- B. Empieza a enviarse a revisión
- C. Su puntuación sube a 90 %
- D. Su categoría temática cambia

**Respuesta correcta:** A. Deja de enviarse a revisión por ese filtro

## 7. ¿Qué limita a Bag of Words en «entrega rápida» y «rápida entrega»?

- A. El conteo disminuye al invertir las palabras
- B. La segunda frase se considera desconocida
- C. La representación por conteos es igual
- D. La primera frase recibe mayor IDF

**Respuesta correcta:** C. La representación por conteos es igual

## 8. Si «batería» aparece dos veces en una reseña, ¿cuál es su conteo en Bag of Words?

- A. 0
- B. 1
- C. Depende del número de reseñas
- D. 2

**Respuesta correcta:** D. 2

## 9. Si dos términos aparecen igual de seguido en una reseña, ¿cuál recibe mayor TF-IDF?

- A. El que aparece en más documentos del corpus
- B. El que aparece en menos documentos del corpus
- C. El que tiene más letras
- D. El que aparece primero en el texto

**Respuesta correcta:** B. El que aparece en menos documentos del corpus

## 10. ¿Qué significa una similitud coseno de 1 para dos vectores no nulos?

- A. Apuntan en la misma dirección
- B. Tienen exactamente el mismo número de palabras
- C. Pertenecen a clases distintas
- D. No comparten ningún término

**Respuesta correcta:** A. Apuntan en la misma dirección

## 11. ¿Qué parámetro fija k en k-means?

- A. El tamaño máximo del vocabulario
- B. La similitud mínima para citar
- C. El número de grupos
- D. El número de vecinos que votan

**Respuesta correcta:** C. El número de grupos

## 12. ¿Cómo se recalcula un centro en k-means?

- A. Se usa el documento con más palabras
- B. Se usa el punto más lejano del grupo
- C. Se toma la etiqueta más común
- D. Se promedian los vectores de sus miembros

**Respuesta correcta:** D. Se promedian los vectores de sus miembros

## 13. ¿Qué distingue a k-means de k-NN en la lección?

- A. k-means requiere etiquetas de tema y k-NN las ignora
- B. k-means busca grupos y k-NN usa etiquetas para clasificar
- C. Ambos grupos se construyen por votación de etiquetas
- D. Ambos ajustan una frontera de margen máximo

**Respuesta correcta:** B. k-means busca grupos y k-NN usa etiquetas para clasificar

## 14. Tres vecinos votan Entrega, Producto y Entrega. ¿Qué predice k-NN?

- A. Entrega
- B. Producto
- C. Atención
- D. Empate

**Respuesta correcta:** A. Entrega

## 15. ¿Qué maximiza una SVM lineal de margen duro con clases separables?

- A. El número de palabras compartidas
- B. La similitud media entre documentos
- C. El margen entre la frontera y los puntos más cercanos
- D. El número de centros del corpus

**Respuesta correcta:** C. El margen entre la frontera y los puntos más cercanos

## 16. ¿Para qué usa 𝕏-smoso el agrupamiento de reseñas?

- A. Para obtener etiquetas verificadas de fraude
- B. Para modificar los textos antes de publicarlos
- C. Para sustituir la revisión de los casos dudosos
- D. Para descubrir temas recurrentes en el corpus

**Respuesta correcta:** D. Para descubrir temas recurrentes en el corpus

## 17. ¿Qué conviene hacer con una reseña marcada como sospechosa?

- A. Eliminarla sin examinarla
- B. Priorizar una revisión humana
- C. Etiquetarla como Entrega
- D. Usarla como prueba de fraude confirmado

**Respuesta correcta:** B. Priorizar una revisión humana

## 18. ¿Qué hace primero la simulación RAG al recibir una pregunta?

- A. Busca reseñas relevantes en el corpus
- B. Cambia las etiquetas del conjunto de entrenamiento
- C. Ajusta el umbral de Naïve Bayes
- D. Reagrupa las reseñas por fecha

**Respuesta correcta:** A. Busca reseñas relevantes en el corpus

## 19. ¿Por qué la respuesta muestra un identificador como [R2]?

- A. Porque indica dos votos para Producto
- B. Porque codifica la puntuación como porcentaje
- C. Porque permite comprobar la fuente del fragmento
- D. Porque selecciona el número de grupos

**Respuesta correcta:** C. Porque permite comprobar la fuente del fragmento

## 20. ¿Qué debería hacer el sistema si ninguna reseña supera el umbral de evidencia?

- A. Tomar el fragmento con la fecha más reciente
- B. Responder con la etiqueta más frecuente
- C. Bajar el umbral en secreto
- D. Indicar que la evidencia es insuficiente

**Respuesta correcta:** D. Indicar que la evidencia es insuficiente
