import { kahoot } from '../config/kahoot.js';
import { kahootLink } from './kahoot-link.js';

export const palIntegerRoutes = {
  entrance: 'pal-integer',
  challenge: 'pal-integer-kahoot',
  victory: 'pal-integer-victoria'
};

function portrait(friendly) {
  // The same integral path anchors both poses, independently of glyph fonts.
  const integral = 'M259 49 C221 17 205 56 200 103 L187 211 C182 254 165 281 132 255';
  const arms = friendly
    ? 'M195 169 C164 182 141 159 126 141 M201 166 C234 180 258 159 275 137'
    : 'M196 162 C171 172 147 192 151 212 M200 164 C230 175 250 193 247 211';
  const face = friendly
    ? '<path class="pal-brows" d="M172 123q7-6 14-2m15 0q7-4 14 2"/><path class="pal-eyes" d="M174 139q6-9 12 0m15 0q6-9 12 0"/><path class="pal-mouth" d="M185 157q9 11 18 0"/>'
    : '<path class="pal-brows" d="m171 124 16 6m13 0 16-6"/><path class="pal-eyes" d="M180 141v3m27-3v3"/><path class="pal-mouth" d="M187 161q6-4 13-2"/>';
  return `<svg class="pal-art" viewBox="0 0 392 302" role="img" aria-label="${friendly ? 'Pal-Integer sonríe y abre los brazos. Su cuerpo tiene forma de integral.' : 'Pal-Integer, una integral violeta con cejas inclinadas, mira a la clase.'}">
    <ellipse class="pal-aura" cx="196" cy="152" rx="111" ry="125"/>
    <g class="pal-notation" aria-hidden="true">
      <text x="83" y="74">∑</text><text x="288" y="107">p(x)</text>
      <text x="271" y="245">wᵀx+b</text>
    </g>
    <g class="pal-pose">
      <path class="pal-arms" d="${arms}"/>
      <path class="pal-edge" d="${integral}"/>
      <path class="pal-integral" d="${integral}"/>
      <g class="pal-expression">${face}</g>
    </g>
  </svg>`;
}

export function renderPalInteger(route) {
  const { entrance, challenge, victory } = palIntegerRoutes;
  if (route === challenge) return `<article class="encounter encounter-challenge pal-encounter">
    <h1>Desafío de Pal-Integer</h1>
    <p>La clase responderá ${kahoot.palInteger.questions} preguntas sobre clasificación, espacios vectoriales y la aplicación de 𝕏-smoso. Al terminar en Kahoot, vuelvan a DATISA. El docente pulsa Continuar para cerrar la historia.</p>
    ${kahootLink(kahoot.palInteger.url)}
    <div class="encounter-links"><a href="#${entrance}">← Volver al encuentro</a><a href="#${victory}">Continuar <span aria-hidden="true">→</span></a></div>
  </article>`;
  if (route === entrance) return `<article class="encounter encounter-entrance pal-encounter pal-scene pal-scene--challenge">
    ${portrait(false)}
    <p class="pal-name">PAL-INTEGER</p>
    <h1>¡HE REGRESADOOO!</h1>
    <p>Pal-Integer detiene la aprobación de 𝕏-smoso. «Antes de confiar en esos resultados, explíquenme por qué funcionan.»</p>
    <a class="encounter-action" href="#${challenge}">Abrir desafío final <span aria-hidden="true">→</span></a>
    <p class="encounter-back"><a href="#4-4-x-smoso">← Volver a X-smoso</a></p>
  </article>`;
  return `<article class="encounter encounter-defeated pal-encounter pal-scene pal-scene--victory">
    ${portrait(true)}
    <p class="pal-name">PAL-INTEGER</p>
    <h1>¡DEMOSTRARON SU CONOCIMIENTO, DATISA!</h1>
    <p class="pal-affection">LOS TQM ❤️</p>
    <a class="encounter-action" href="#recursos">Ir a recursos y bibliografía <span aria-hidden="true">→</span></a>
    <p class="encounter-back"><a href="#4-4-x-smoso">← Volver a 𝕏-smoso</a></p>
  </article>`;
}
