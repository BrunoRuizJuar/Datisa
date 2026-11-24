# DATISA

**Demostrando la importancia de la Ciencia de Datos.** Unidad universitaria sobre clasificación de documentos para una clase de 90 a 120 minutos y para consulta posterior.

## Vista local

Desde esta carpeta, ejecuta el servidor estático:

```powershell
python -m http.server 8767 --bind 127.0.0.1
```

Abre [la portada](http://127.0.0.1:8767/#portada), [Naïve Bayes](http://127.0.0.1:8767/#4-2-1-naive-bayes) o [el laboratorio vectorial](http://127.0.0.1:8767/#4-3-1-vecinos-cercanos). El sitio usa HTML, CSS y módulos JavaScript, sin un paso de compilación. KaTeX se sirve localmente. Las fuentes Fraunces, DM Sans e IBM Plex Mono se cargan desde Google Fonts.

## Estado del proyecto

- **Fase 1.** Portada, plantilla académica, índice adaptable, navegación por hash y preferencias en `localStorage`.
- **Fase 2.** Capítulos 4.1 y 4.2, fórmulas con KaTeX y laboratorio de detección de spam.
- **Fase 3.** Bag of Words, TF-IDF, similitud coseno, k-NN y SVM. Laboratorio vectorial con documento móvil, votación y frontera lineal.
- **Fase 4.** Beholder del Sobreajuste, entrada animada, pantalla para abrir Kahoot, continuación manual y derrota. El [banco de Kahoot 1](src/encounters/kahoot-beholder.md) contiene diez preguntas con respuestas.
- **Fase 5.** [Misión 𝕏-smoso](http://127.0.0.1:8767/#4-4-x-smoso) de 20 minutos. Analiza reseñas empresariales mediante filtrado Naïve Bayes, Bag of Words, TF-IDF, agrupación con k-means, clasificación por k-NN y una simulación de RAG que cita fragmentos de un corpus local. El laboratorio se ejecuta en el navegador y no requiere servidor de aplicación, API ni modelo generativo.
- **Fase 6.** Encuentro de Pal-Integer, desafío final y escena amistosa de victoria. El [banco de Kahoot 2](src/encounters/kahoot-pal-integer.md) contiene 20 preguntas con respuestas.
- **DATISA 2.0.** Las lecciones incluyen experimentos de generalización, suavizado de Laplace, TF-IDF, k-NN, SVM y matriz de confusión. Las actividades de comprobación permiten revelar la explicación después de formular una hipótesis.

## Pendientes

- [ ] **Publicación.** Activar GitHub Pages en el repositorio de GitHub. Tras la publicación, comprobar la portada, las rutas directas, los recursos estáticos y los laboratorios bajo el prefijo público.
- [ ] Cargar ambos cuestionarios en Kahoot y pegar sus URL HTTPS en `src/config/kahoot.js` cuando estén disponibles. Verificar desde el sitio la apertura en otra pestaña y ensayar el regreso manual. Ambos bancos ya están escritos.
- [ ] Ensayar el recorrido completo en clase y confirmar su duración. La auditoría registra las comprobaciones pendientes de accesibilidad y enlaces externos.

## Validación local

Con Node.js 22 o posterior, ejecuta `node --test tests/math.test.mjs` para verificar los cálculos. En Windows con Microsoft Edge, `node tests/browser.mjs` ejecuta la prueba en navegador y actualiza las capturas. Si Edge está en otra ubicación, define `DATISA_BROWSER` con la ruta de su ejecutable.

Consulta el diagnóstico, los resultados y las capturas en la [auditoría de DATISA 2.0](docs/AUDITORIA_DATISA_2.md).

## GitHub Pages

Los archivos del sitio, incluido `.nojekyll`, se publican desde la raíz de la rama `main`. En **Settings → Pages**, elige **Deploy from a branch → main → /(root)** y guarda. La URL de una lección tendrá un formato como `https://usuario.github.io/DATISA/#4-1-introduccion`. [Documentación de la fuente de publicación](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

## Organización

- `index.html` y `styles/` contienen la estructura y los estilos.
- `src/navigation.js` gestiona rutas, índice y preferencias. `src/components/` contiene la plantilla, el renderizado matemático y las ilustraciones.
- `src/content/` contiene el índice, las lecciones, las explicaciones formales y los datos de las escenas.
- `src/labs/` contiene los cálculos y las interfaces de los laboratorios.
- `src/encounters/` contiene las escenas del Beholder y Pal-Integer y ambos bancos de preguntas.
- `assets/katex/` contiene el motor KaTeX 0.16.47 y los estilos y fuentes obtenidos de la instalación de Visual Studio Code, junto con el aviso de licencia.
