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
- Las nueve lecciones actuales incluyen ilustraciones pastel y explicaciones formales ampliadas. Las 14 ecuaciones llevan una leyenda que explica la función de sus términos por color.

## Pendientes

- [ ] **Próxima sesión.** Crear o seleccionar el repositorio remoto en GitHub, conectar este repositorio local y activar GitHub Pages. Tras la publicación, comprobar la portada, las rutas directas, los recursos estáticos y los laboratorios bajo el prefijo público.
- [ ] **Fase 5.** Construir la misión X-smoso de unos 20 minutos. Ilustrar el pipeline de Naïve Bayes, Bag of Words y TF-IDF, agrupación temática con k-means, clasificación supervisada con SVM o k-NN y una respuesta RAG respaldada por evidencia.
- [ ] **Fase 6.** Crear la introducción narrativa y el encuentro de Pal-Integer, preparar el segundo banco de 20 preguntas y hacer la transición manual a la escena amistosa de victoria.
- [ ] Cargar ambos cuestionarios en Kahoot y pegar sus URL HTTPS en `src/config/kahoot.js` cuando estén disponibles. Verificar desde el sitio la apertura en otra pestaña y ensayar el regreso manual. El primer banco ya está escrito.
- [ ] **Fase 7.** Completar el glosario, la bibliografía y los recursos académicos. Hacer la revisión final de enlaces, navegación, accesibilidad, pantallas pequeñas y proyección. Ensayar el recorrido completo y confirmar su duración.

## GitHub Pages

Sube los archivos del sitio, incluido `.nojekyll`, a la raíz de la rama `main` del repositorio remoto. En **Settings → Pages**, elige **Deploy from a branch → main → /(root)** y guarda. La URL de una lección tendrá un formato como `https://usuario.github.io/DATISA/#4-1-introduccion`. [Documentación de la fuente de publicación](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

## Organización

- `index.html` y `styles/` contienen la estructura y los estilos.
- `src/navigation.js` gestiona rutas, índice y preferencias. `src/components/` contiene la plantilla, el renderizado matemático y las ilustraciones.
- `src/content/` contiene el índice, las lecciones, las explicaciones formales y los datos de las escenas.
- `src/labs/` contiene los cálculos y las interfaces de los laboratorios.
- `src/encounters/` contiene las escenas del Beholder y el primer banco de preguntas.
- `assets/katex/` contiene el motor KaTeX 0.16.47 y los estilos y fuentes obtenidos de la instalación de Visual Studio Code, junto con el aviso de licencia.
