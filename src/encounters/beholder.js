import { kahoot } from '../config/kahoot.js';

export const beholderRoutes = {
  entrance: 'beholder-del-sobreajuste',
  challenge: 'beholder-kahoot',
  defeated: 'beholder-derrotado'
};

const previous = '#4-2-1-naive-bayes';
const next = '#4-3-espacios-vectoriales';

function creature(defeated) {
  return `<svg class="beholder-art" viewBox="0 0 420 340" aria-hidden="true">
    <g class="beholder-float">
      <path class="beholder-stalk" d="M145 123Q133 77 96 64M180 100Q178 62 164 34M241 100Q242 63 266 37M277 126Q300 91 331 76"/>
      <g class="beholder-small-eyes">
        <circle cx="94" cy="60" r="18"/><circle cx="163" cy="33" r="16"/>
        <circle cx="267" cy="35" r="16"/><circle cx="333" cy="73" r="18"/>
      </g>
      <path class="beholder-pupils" d="M98 61h.1M167 37h.1M264 39h.1M329 77h.1"/>
      <path class="beholder-body" d="M210 86c57 0 105 42 105 103 0 59-37 100-105 100s-105-41-105-100c0-61 48-103 105-103Z"/>
      <path class="beholder-body-detail" d="M122 220q14 34 41 44m134-44q-14 34-41 44"/>
      ${defeated ? `<path class="beholder-closed" d="M155 176q55 35 110 0m-83 71q28 13 56 0"/>
        <path class="beholder-sparks" d="M109 114v-18m-9 9h18m180 36v-14m-7 7h14"/>` :
        `<path class="beholder-eye" d="M151 176q52-51 119 0-12 48-60 48-46 0-59-48Z"/>
        <circle class="beholder-iris" cx="210" cy="183" r="21"/><circle class="beholder-highlight" cx="215" cy="177" r="5"/>
        <path class="beholder-brow" d="M150 148l56 21 62-21M186 251q24-19 48 0"/>`}
    </g>
  </svg>`;
}

function kahootLink() {
  const value = kahoot.beholder.url;
  if (value) {
    try {
      const url = new URL(value);
      if (url.protocol === 'https:' && (url.hostname === 'kahoot.com' || url.hostname.endsWith('.kahoot.com') ||
          url.hostname === 'kahoot.it' || url.hostname.endsWith('.kahoot.it'))) {
        const href = url.href.replaceAll('&', '&amp;').replaceAll('"', '&quot;');
        return `<a class="encounter-action" href="${href}" target="_blank" rel="noopener noreferrer">Abrir Kahoot (otra pestaña) <span aria-hidden="true">↗</span></a>`;
      }
    } catch { /* La configuración todavía no contiene un enlace válido. */ }
  }
  return '<p class="encounter-status">El enlace de Kahoot está pendiente de configurar.</p>';
}

export function renderBeholder(route) {
  const { entrance, challenge } = beholderRoutes;
  if (route === challenge) return `<article class="encounter encounter-challenge">
    <h1>Desafío del Beholder</h1>
    <p>Responde ${kahoot.beholder.questions} preguntas sobre clasificación de documentos, aprendizaje supervisado y Naïve Bayes. Al terminar en Kahoot, vuelve a DATISA y pulsa Continuar.</p>
    ${kahootLink()}
    <div class="encounter-links"><a href="#${entrance}">← Volver al encuentro</a><a href="#${beholderRoutes.defeated}">Continuar <span aria-hidden="true">→</span></a></div>
  </article>`;
  if (route === entrance) return `<article class="encounter encounter-entrance">
    ${creature(false)}
    <h1>¡EL BEHOLDER DEL SOBREAJUSTE!</h1>
    <p>Memoricé cada correo de entrenamiento. ¿Pueden explicar qué pasará con uno que jamás he visto?</p>
    <a class="encounter-action" href="#${challenge}">Enfrentar desafío <span aria-hidden="true">→</span></a>
    <p class="encounter-back"><a href="${previous}">← Volver a Naïve Bayes</a></p>
  </article>`;
  return `<article class="encounter encounter-defeated">
    ${creature(true)}
    <h1>¡MINI JEFE DERROTADO!</h1>
    <p>El siguiente paso es representar documentos en un espacio donde podamos comparar sus rasgos.</p>
    <a class="encounter-action" href="${next}">Continuar a clasificación en espacios vectoriales <span aria-hidden="true">→</span></a>
  </article>`;
}