import { documents, groups, vote } from './vector-model.js';
import { hardMargin } from './experiment-model.js';
import { explanation, number, numeric } from './experiment-ui.js';

const px = x => 40 + 24 * x;
const py = y => 270 - 24 * y;
const line = (a, b, color, dash = '') => `<line x1="${px(a.x)}" y1="${py(a.y)}" x2="${px(b.x)}" y2="${py(b.y)}" stroke="${color}" stroke-width="2" stroke-dasharray="${dash}"/>`;
const grid = Array.from({ length: 11 }, (_, i) => line({ x: i, y: 0 }, { x: i, y: 10 }, '#e7e7e7') +
  line({ x: 0, y: i }, { x: 10, y: i }, '#e7e7e7')).join('');

function boundary(model, level) {
  const { x, y, bias } = model;
  const candidates = [];
  for (const limit of [0, 10]) {
    if (Math.abs(y) > 1e-8) candidates.push({ x: limit, y: (level - bias - x * limit) / y });
    if (Math.abs(x) > 1e-8) candidates.push({ x: (level - bias - y * limit) / x, y: limit });
  }
  const inside = candidates.filter(p => p.x >= -1e-7 && p.y >= -1e-7 && p.x <= 10.0000001 && p.y <= 10.0000001);
  const a = inside[0];
  const b = a && inside.find(p => Math.hypot(p.x - a.x, p.y - a.y) > 1e-7);
  return b ? line(a, b, '#704995', level ? '5 4' : '') : '';
}

export function mountGeometry(root, svm = false) {
  const resetPoints = () => documents.map(point => ({ ...point }));
  let points = resetPoints();
  let query = { id: 'Consulta', x: 5, y: 4 };
  let dragged;
  root.innerHTML = `<h2>Laboratorio · ${svm ? 'SVM lineal de margen duro' : 'Clasifica con vecinos cercanos'}</h2>
    <p>Cada punto sintetiza dos rasgos: intensidad de Entrega (x) y de Facturación (y). Arrastra un punto o selecciónalo y edita sus coordenadas.</p>
    <form><div class="experiment-controls">
      <label>Punto<select name="point"></select></label>
      ${numeric('x', 'Coordenada x', 5, 0, 10).replace('required', 'step="0.1" required')}
      ${numeric('y', 'Coordenada y', 4, 0, 10).replace('required', 'step="0.1" required')}
      <label>Etiqueta<select name="group"><option value="" disabled>Sin etiqueta</option><option value="E">Entrega</option><option value="F">Facturación</option></select></label>
      ${svm ? '' : '<label>Vecinos (k)<select name="k"></select></label><label>Distancia<select name="metric"><option value="euclidean">Euclídea</option><option value="manhattan">Manhattan</option></select></label><label>Comparar con SVM lineal<input type="checkbox" name="compare"></label>'}
    </div><button type="button" data-add>Agregar punto</button>
    <button type="reset">Restablecer</button></form>
    <svg class="experiment-plot" data-draggable viewBox="0 0 310 308" role="img" aria-label="Plano de los documentos. Los puntos también se editan con el formulario.">
      ${grid}<text x="40" y="289">0</text><text x="268" y="289">10</text><text x="13" y="35">10</text>
      <text x="104" y="304">Entrega (x)</text><text transform="translate(15 216) rotate(-90)">Facturación (y)</text><g data-scene></g>
    </svg><p>● Entrega · ■ Facturación · + Consulta · Anillo: punto seleccionado o soporte con borde morado.</p>
    <div role="status" data-result></div>
    ${explanation(svm ? 'Predice qué pasará si sitúas un punto de Entrega sobre un punto de Facturación.' : 'Cambia la etiqueta del vecino más próximo. ¿Qué cambia al aumentar k?',
      svm ? 'Las dos etiquetas en el mismo lugar hacen imposible una separación estricta. El ejercicio busca el margen máximo mediante candidatos geométricos verificables. En texto real cada término puede aportar una dimensión y suelen usarse márgenes suaves.' :
        'Con k = 1, la etiqueta del primer vecino decide por sí sola. Con más vecinos, un solo voto puede perder peso, aunque una clase frecuente puede dominar.')}`;
  const form = root.querySelector('form');
  const f = form.elements;
  const svg = root.querySelector('svg');
  const scene = svg.querySelector('[data-scene]');
  const selected = () => points.find(point => point.id === f.point.value) ?? query;
  const refreshOptions = id => {
    f.point.replaceChildren(...[query, ...points].map(p => new Option(p.group ? p.id + ' · ' + groups[p.group] : p.id, p.id)));
    f.point.value = id;
    if (f.k) {
      const k = f.k.value || '1';
      f.k.replaceChildren(...points.map((_, i) => new Option(i + 1, i + 1)));
      f.k.value = k;
    }
    root.querySelector('[data-add]').disabled = points.length >= 25;
  };

  function updateFields() {
    const point = selected();
    f.x.value = point.x;
    f.y.value = point.y;
    f.group.disabled = !point.group;
    f.group.value = point.group ?? '';
  }

  function render() {
    const model = svm || f.compare.checked ? hardMargin(points) : undefined;
    const local = svm ? null : vote(query, Number(f.k.value), points, f.metric.value);
    scene.innerHTML = (model ? [-1, 0, 1].map(level => boundary(model, level)).join('') : '') +
      (local?.neighbors.map(point => line(query, point, '#70757a', '2 3')).join('') ?? '') +
      [...points, query].map(p => `<g data-point="${p.id}" transform="translate(${px(p.x)} ${py(p.y)})"><title>${p.id}, ${p.x}, ${p.y}</title>
        ${model?.support.includes(p) ? '<circle r="11" fill="none" stroke="#704995" stroke-width="2"/>' : ''}
        ${p === selected() ? '<circle r="8" fill="none" stroke="#202124"/>' : ''}
        ${p.group === 'E' ? '<circle r="5" fill="#397CB5"/>' : p.group === 'F' ? '<rect x="-5" y="-5" width="10" height="10" fill="#D18A36"/>' : '<path d="M-6 0h12m-6-6v12" stroke="#202124" stroke-width="3"/>'}
        <text x="8" y="-7">${p === query ? 'Q' : p.id}</text></g>`).join('');
    const score = model?.score(query);
    root.querySelector('[data-result]').innerHTML = (local ? `<p><strong>k-NN · ${local.classification ?? 'Empate'}</strong> · ${local.delivery} Entrega y ${local.billing} Facturación. Cada vecino emite un voto. Las distancias iguales se ordenan por identificador.</p>
      <ol>${local.neighbors.map(p => `<li>${p.id} · ${groups[p.group]} · distancia ${number(p.distance)}</li>`).join('')}</ol>` : '') +
      (model ? `<p><strong>SVM · ${Math.abs(score) < 1e-8 ? 'En la frontera' : groups[score > 0 ? 'E' : 'F']}</strong> · Puntuación ${number(score)} · ancho del margen ${number(model.margin)} · soportes ${model.support.map(p => p.id).join(', ')}. Recta continua: puntuación 0. Discontinuas: ±1.</p>`
        : model === null ? '<p>El conjunto no admite un margen duro. Se necesitan ambas clases y una separación estricta.</p>' : '');
  }

  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('input', event => {
    const point = selected();
    if (event.target === f.point) updateFields();
    if ((event.target === f.x || event.target === f.y) && event.target.validity.valid) {
      point[event.target.name] = event.target.valueAsNumber;
    }
    if (event.target === f.group) {
      point.group = f.group.value;
      refreshOptions(point.id);
    }
    render();
  });
  root.querySelector('[data-add]').addEventListener('click', () => {
    const point = { id: 'P' + (points.length + 1), x: query.x, y: query.y, group: 'F' };
    points.push(point);
    refreshOptions(point.id);
    updateFields();
    render();
    f.point.focus();
  });
  form.addEventListener('reset', () => queueMicrotask(() => {
    points = resetPoints();
    query = { id: 'Consulta', x: 5, y: 4 };
    if (f.k) f.k.value = '1';
    refreshOptions(query.id);
    updateFields();
    render();
    root.querySelector('details').open = false;
  }));
  function move(event) {
    const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(svg.getScreenCTM().inverse());
    const clamp = value => Math.round(Math.min(10, Math.max(0, value)) * 10) / 10;
    dragged.x = clamp((p.x - 40) / 24);
    dragged.y = clamp((270 - p.y) / 24);
    updateFields();
    render();
  }
  svg.addEventListener('pointerdown', event => {
    if (event.button !== 0 || dragged) return;
    const id = event.target.closest('[data-point]')?.dataset.point;
    dragged = points.find(point => point.id === id) ?? query;
    f.point.value = dragged.id;
    svg.setPointerCapture(event.pointerId);
    move(event);
  });
  svg.addEventListener('pointermove', event => {
    if (dragged && svg.hasPointerCapture(event.pointerId)) move(event);
  });
  svg.addEventListener('lostpointercapture', () => { dragged = null; });
  refreshOptions(query.id);
  updateFields();
  render();
}
