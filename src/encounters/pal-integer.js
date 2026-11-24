import { kahoot } from '../config/kahoot.js';
import { kahootLink } from './kahoot-link.js';

export const palIntegerRoutes = {
  entrance: 'pal-integer',
  challenge: 'pal-integer-kahoot',
  victory: 'pal-integer-victoria'
};

function portrait(friendly) {
  return `<div class="pal-portrait" aria-hidden="true">
    <span class="pal-symbol">±</span>
    <span class="pal-eyes"><i></i><i></i></span>
    <span class="pal-mouth${friendly ? ' pal-smile' : ''}"></span>
  </div>`;
}

export function renderPalInteger(route) {
  const { entrance, challenge, victory } = palIntegerRoutes;
  if (route === challenge) return `<article class="encounter encounter-challenge pal-encounter">
    <h1>Desafío de Pal-Integer</h1>
    <p>La clase responderá ${kahoot.palInteger.questions} preguntas sobre clasificación, espacios vectoriales y la aplicación de 𝕏-smoso. Al terminar en Kahoot, vuelvan a DATISA. El docente pulsa Continuar para cerrar la historia.</p>
    ${kahootLink(kahoot.palInteger.url)}
    <div class="encounter-links"><a href="#${entrance}">← Volver al encuentro</a><a href="#${victory}">Continuar <span aria-hidden="true">→</span></a></div>
  </article>`;
  if (route === entrance) return `<article class="encounter encounter-entrance pal-encounter">
    ${portrait(false)}
    <h1>Pal-Integer</h1>
    <p>El tablero de 𝕏-smoso está listo para recibir reseñas. Pal-Integer, quien lo supervisa, se detiene antes de darlo por aprobado: «Antes de tomar decisiones con estos números, ¿pueden explicarme de dónde salen y cuándo conviene revisar el resultado?»</p>
    <a class="encounter-action" href="#${challenge}">Abrir desafío final <span aria-hidden="true">→</span></a>
    <p class="encounter-back"><a href="#4-4-x-smoso">← Volver a 𝕏-smoso</a></p>
  </article>`;
  return `<article class="encounter encounter-defeated pal-encounter">
    ${portrait(true)}
    <h1>¡Pal-Integer se une a la clase!</h1>
    <p>«Ahora sé por qué cada reseña tiene un lugar y por qué a veces hace falta pedir más evidencia. ¿Me dejan ayudar en la próxima revisión?»</p>
    <a class="encounter-action" href="#recursos">Ir a recursos y bibliografía <span aria-hidden="true">→</span></a>
    <p class="encounter-back"><a href="#4-4-x-smoso">← Volver a 𝕏-smoso</a></p>
  </article>`;
}
