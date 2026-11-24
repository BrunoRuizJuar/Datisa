import { documents, groups, vote, svm } from './vector-model.js';

const format = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 2 });
const plot = { left: 48, bottom: 314, size: 288 };
const xAt = x => plot.left + x * plot.size / 10;
const yAt = y => plot.bottom - y * plot.size / 10;
const segment = (x1, y1, x2, y2, css) => `<line class="${css}" x1="${xAt(x1)}" y1="${yAt(y1)}" x2="${xAt(x2)}" y2="${yAt(y2)}"/>`;
const ticks = [0, 2, 4, 6, 8, 10];

function plotMarkup() {
  return `<svg class="vector-plot" viewBox="0 0 364 360" aria-hidden="true">
    ${ticks.map(value => segment(value, 0, value, 10, 'vector-grid') + segment(0, value, 10, value, 'vector-grid')).join('')}
    ${segment(0, 0, 10, 0, 'vector-axis')}${segment(0, 0, 0, 10, 'vector-axis')}
    ${ticks.map(value => `<text x="${xAt(value)}" y="331" text-anchor="middle">${value}</text>
      <text x="38" y="${yAt(value) + 4}" text-anchor="end">${value}</text>`).join('')}
    <text x="193" y="351" text-anchor="middle">Rasgos de entrega (x)</text>
    <text transform="translate(15 170) rotate(-90)" text-anchor="middle">Rasgos de facturación (y)</text>
    <g class="vector-svm">${segment(0, 2, 8, 10, 'vector-margin')}
       ${segment(2, 0, 10, 8, 'vector-margin')}${segment(0, 0, 10, 10, 'vector-boundary')}</g>
    <g class="vector-links"></g>
    ${documents.map(({ id, x, y, group, support }) => `<g transform="translate(${xAt(x)} ${yAt(y)})">
      ${support ? '<circle class="vector-support" r="10"/>' : ''}
      ${group === 'E' ? '<circle class="vector-delivery" r="5"/>' : '<rect class="vector-billing" x="-5" y="-5" width="10" height="10"/>'}
      <text x="9" y="-7">${id}</text>
    </g>`).join('')}
    <g class="vector-query"><circle r="8"/><path d="M-3 0h6M0-3v6"/></g>
  </svg>`;
}

export function mountVector(root, showSvm = false) {
  root.innerHTML = `<h2>Laboratorio · Dos maneras de clasificar</h2>
    <p>Los nueve documentos etiquetados son puntos sintéticos. Elige k y mueve el documento nuevo en el gráfico o con los deslizadores. Activa la SVM para comparar las decisiones.</p>
    <div class="vector-lab">
      <figure>
        ${plotMarkup()}
        <figcaption class="vector-legend">
          <span><i class="vector-delivery"></i> Entrega</span>
          <span><i class="vector-billing"></i> Facturación</span>
          <span><i class="vector-query-key"></i> Documento nuevo</span>
          <span class="vector-svm-key"><i></i> Frontera continua · márgenes discontinuos · soportes con anillo</span>
        </figcaption>
      </figure>
      <form class="vector-controls">
        <div class="vector-k"><label for="vector-k">Vecinos (k)</label>
          <select id="vector-k" name="k">${documents.map((_, index) => `<option>${index + 1}</option>`).join('')}</select></div>
        ${[['x', 'Rasgos de entrega', 5], ['y', 'Rasgos de facturación', 4]].map(([axis, label, value]) => `<div class="bayes-control">
          <label for="vector-${axis}">${label} <code>${axis}</code></label>
          <div><input type="range" id="vector-${axis}" name="${axis}" min="0" max="10" step=".1" value="${value}">
          <output for="vector-${axis}" aria-hidden="true"></output></div>
        </div>`).join('')}
        <label class="vector-checkbox"><input type="checkbox" name="svm" ${showSvm ? 'checked' : ''}> Mostrar frontera y margen de SVM</label>
        <button type="reset">Restablecer ejemplo</button>
      </form>
    </div>
    <div class="vector-results" role="status"></div>`;

  const form = root.querySelector('form');
  const svg = root.querySelector('svg');
  const links = svg.querySelector('.vector-links');
  const marker = svg.querySelector('.vector-query');
  const boundary = svg.querySelector('.vector-svm');
  const svmKey = root.querySelector('.vector-svm-key');
  const results = root.querySelector('.vector-results');
  const [x, y, k, show] = ['x', 'y', 'k', 'svm'].map(name => form.elements.namedItem(name));

  function update() {
    const query = { x: x.valueAsNumber, y: y.valueAsNumber };
    for (const axis of [x, y]) {
      const label = format.format(axis.valueAsNumber);
      axis.setAttribute('aria-valuetext', label);
      form.querySelector(`output[for="${axis.id}"]`).textContent = label;
    }
    const local = vote(query, Number(k.value));
    const linear = svm(query);
    marker.setAttribute('transform', `translate(${xAt(query.x)} ${yAt(query.y)})`);
    links.innerHTML = local.neighbors.map(doc => segment(query.x, query.y, doc.x, doc.y, 'vector-neighbor')).join('');
    boundary.toggleAttribute('hidden', !show.checked);
    svmKey.hidden = !show.checked;
    for (const support of svg.querySelectorAll('.vector-support')) support.toggleAttribute('hidden', !show.checked);
    results.innerHTML = `<p><strong>k-NN · ${local.classification ?? 'Empate'}</strong><br>
      ${local.delivery} Entrega · ${local.billing} Facturación</p>
      <p>Vecinos por distancia: ${local.neighbors.map(doc =>
        `<span class="vector-neighbor-label">${doc.id} (${groups[doc.group]}, ${format.format(Math.sqrt(doc.distanceSquared) / 10)})</span>`).join(' · ')}</p>
      ${show.checked ? `<p><strong>SVM · ${linear.classification}</strong><br>Puntuación: ${format.format(linear.score)}</p>` : ''}`;
  }

  function move(event) {
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(svg.getScreenCTM().inverse());
    const scale = 10 / plot.size;
    x.value = Math.round(Math.max(0, Math.min(10, (point.x - plot.left) * scale)) * 10) / 10;
    y.value = Math.round(Math.max(0, Math.min(10, (plot.bottom - point.y) * scale)) * 10) / 10;
    update();
  }

  svg.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    svg.setPointerCapture(event.pointerId);
    move(event);
  });
  svg.addEventListener('pointermove', event => {
    if (svg.hasPointerCapture(event.pointerId)) move(event);
  });
  form.addEventListener('input', update);
  form.addEventListener('reset', () => queueMicrotask(update));
  update();
}