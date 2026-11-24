# DATISA 2.0 · Auditoría

## Diagnóstico inicial

Hallazgos de inspección estática del repositorio local.

| Categoría | Hallazgo y evidencia |
| --- | --- |
| Errores funcionales | La ruta `#recursos` existe en `sections.js` y cae en el mensaje genérico de contenido pendiente de `pages.js`. |
| Problemas académicos | El capítulo usa IDF = ln(N/df), mientras X-smoso usa IDF suavizado más uno. Conviene explicitar ambas convenciones. `vector-model.js` evalúa una recta fija, apropiada para el conjunto inicial, sin reentrenarla. |
| Estética | `pages.js` alterna diagramas de problema, pregunta y lección. La acumulación de ilustraciones compite con las fórmulas y los controles. |
| Accesibilidad | El índice móvil inhabilita el cuerpo principal al abrirse, pero no dirige el foco al índice. El gráfico vectorial está oculto para tecnologías de asistencia y sus deslizadores ofrecen acceso a la consulta. |
| Funciones incompletas | Los bancos Kahoot existen. La configuración de sus enlaces y Recursos son independientes de los bancos. X-smoso recupera extractos y ofrece principalmente entradas predefinidas para clasificación. |
| Mejoras didácticas | Hacen falta una partición de evaluación visible, controles sobre los datos de entrenamiento, exploración de errores y comprobaciones con explicación desplegable. |

## Plan

1. Simplificar las páginas académicas y preservar la navegación, tipografía y escenas.
2. Integrar experimentos numéricos y geométricos en las lecciones existentes.
3. Ampliar las cinco etapas de X-smoso sobre el corpus local.
4. Incorporar actividades con hipótesis y explicaciones desplegables, y completar Recursos.
5. Ejecutar pruebas de cálculo y revisar el recorrido en navegador. Registrar los resultados y las capturas disponibles.

## Cambios implementados

| Área | Resultado |
| --- | --- |
| Interfaz editorial | Fondo blanco, texto #202124, fuentes y navegación del repositorio. Menos ilustraciones decorativas y divisiones más simples en las leyendas matemáticas. Las escenas conservan sus pantallas oscuras. |
| Generalización | Regresión por medias en intervalos sobre observaciones sintéticas deterministas. Calcula el ECM de entrenamiento y prueba y dibuja los datos y el ajuste. La banda adecuada se define dentro de un 15 % del mínimo de prueba de esta corrida didáctica. Tiene un enlace de ida y vuelta con el Beholder. |
| Naïve Bayes | Ejemplo binario previo y experimento multinomial con tamaño del corpus, conteos, vocabulario, previa manual o empírica y suavizado. Una clase comienza con cero ocurrencias. |
| TF-IDF | Editor de tres documentos y selección de términos. Usa conteos y ln(N/df). X-smoso documenta por separado su convención suavizada. |
| k-NN y SVM | Se reutilizan los puntos originales. Los puntos nuevos y existentes se pueden mover y etiquetar con puntero o teclado. k-NN compara dos distancias. SVM obtiene el máximo margen duro por geometría bidimensional y explica qué ocurre si falla la separación estricta. |
| Clasificación automática | Matriz de confusión editable, cuatro métricas y reto sobre costos. |
| X-smoso | Texto libre para clasificar y representar, coordenadas de los centroides y asignaciones, vecinos votantes y recuperación local con similitud coseno. El resumen usa una plantilla extractiva con citas. |
| Contenido | Comprobaciones desplegables en cada lección y en el proyecto integrador, práctica de etiquetado supervisado y Recursos con glosario, bibliografía y bancos. |

## Validación ejecutada

- `node --test tests/math.test.mjs` pasó siete pruebas en Node 24.20. Incluyen evidencia nula, empates, denominadores nulos, términos repetidos, clases solapadas y consultas fuera del vocabulario.
- `node tests/browser.mjs` pasó en Microsoft Edge sin interfaz. Recorrió 18 rutas, revisó los enlaces por hash, comprobó el retorno a portada desde un hash desconocido y verificó el acceso local a los bancos. Las 14 fórmulas produjeron MathML sin errores de KaTeX. Durante la corrida no hubo excepciones de JavaScript ni respuestas locales de error.
- El navegador accionó Laplace, editó TF-IDF, arrastró y añadió puntos, provocó una separación imposible para SVM y ejercitó las cinco etapas de X-smoso. También comprobó el error de entrenamiento al seleccionar 16 intervalos y la exactitud inicial de la matriz de confusión.
- Las ocho vistas solicitadas se comprobaron a 390 × 844. El índice móvil abrió con Enter, trasladó el foco y lo devolvió al cerrar con Escape. Se verificó una razón mínima de 4,5:1 para tres muestras de texto sobre blanco y que la animación del encuentro se desactiva al emular movimiento reducido.
- Quedan pendientes una revisión con lector de pantalla, pruebas en dispositivos físicos y otros navegadores, una revisión visual individual de todas las fórmulas y un inventario completo de contraste. Las cuatro referencias de Stanford agotaron el tiempo de respuesta. Ambos campos Kahoot conservan su valor original `null`, por lo que la apertura de cuestionarios queda pendiente.

## Capturas de escritorio

1. [Portada](capturas/01-portada.png)
2. [Naïve Bayes](capturas/02-naive-bayes.png)
3. [TF-IDF](capturas/03-tf-idf.png)
4. [k-NN](capturas/04-k-nn.png)
5. [SVM](capturas/05-svm.png)
6. [X-smoso](capturas/06-x-smoso.png)
7. [Beholder](capturas/07-beholder.png)
8. [Pal-Integer](capturas/08-pal-integer.png)
