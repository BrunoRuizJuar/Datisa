import { archive, spamModel, textIndex } from './x-smoso-model.js';

const reviews = archive.filter(review => review.category !== 'Falsa');
const classify = spamModel(archive);
const format = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 2 });
const examples = [
  'La batería dura dos horas y el cargador se calienta.',
  'Mi envío llegó tarde y el seguimiento decía entregado.',
  'Soporte confirmó el reembolso por chat.',
  'Excelente excelente producto perfecto, cinco estrellas garantizadas.'
];

function menu(id, label, values, selected = 0) {
  return `<label for="${id}">${label}</label><select id="${id}">${values.map((value, i) =>
    `<option value="${i}"${i === selected ? ' selected' : ''}>${value}</option>`).join('')}</select>`;
}

function stage(id, title, prompt, steps, controls) {
  return `<section aria-labelledby="${id}"><h2 id="${id}">${title}</h2><p>${prompt}</p>
    <figure class="xsmoso-figure" aria-label="${steps.join(', ')}">${steps.map(step => `<span>${step}</span>`).join('<b aria-hidden="true">→</b>')}</figure>
    ${controls}<div data-result="${id}" aria-live="polite"></div></section>`;
}

export function mountXsmoso(root) {
  root.classList.add('xsmoso-lab');
  const sizes = [3, 6, 9];
  const thresholds = [10, 30, 50, 70, 90, 99];
  const groups = [2, 3];
  const neighbors = [1, 3, 5, 7, 9];
  const evidence = [10, 25, 40, 60];

  root.innerHTML = `
    ${menu('xs-size', 'Tamaño del corpus de análisis', sizes, 2)}
    <details><summary>Ver reseñas ficticias de entrenamiento</summary>
    <ol>${archive.map(({ id, category, text }) => `<li><strong>${id} · ${category}</strong> ${text}</li>`).join('')}</ol></details>
    ${stage('xs-bayes', '1. Detectar reseñas sospechosas · 4 min',
      'Clase, ¿qué reseña enviarían a revisión? Naïve Bayes aprende de 12 ejemplos etiquetados. Cambien el umbral y observen cuándo cambia la decisión. La puntuación sirve para priorizar revisión humana.',
      ['★ Reseña', 'P(falsa)', '✓ Revisión'],
      menu('xs-filter', 'Reseña de prueba', examples, 3) + menu('xs-threshold', 'Umbral de revisión (%)', thresholds, 2))}
    ${stage('xs-vector', '2. Representar reseñas · 3 min',
      'Bag of Words cuenta apariciones. TF-IDF da mayor peso a términos que aparecen en menos reseñas. Cambien de representación y amplíen el corpus. ¿Qué palabras cambian de peso?',
      ['❝ Texto', '▥ Conteos', '▥ Pesos'],
      menu('xs-vector-review', 'Reseña de prueba', examples) + menu('xs-weight', 'Representación', ['Bag of Words', 'TF-IDF'], 1))}
    ${stage('xs-cluster', '3. Descubrir temas con k-means · 4 min',
      'K-means asigna los vectores TF-IDF normalizados al centro más cercano y recalcula los centros. Cambien el número de grupos. Clase, ¿cómo llamarían a cada grupo?',
      ['● ◆ ● ◆', '● ●　/　◆ ◆'],
      menu('xs-groups', 'Número de grupos', groups, 1))}
    ${stage('xs-knn', '4. Enrutar reseñas con k-NN · 3 min',
      'Los vecinos con similitud positiva votan por Entrega, Producto o Atención. Cambien el número máximo de vecinos. ¿Cuándo le mandarían el caso a una persona?',
      ['★ Reseña nueva', '● ● ◆ Votos', '✓ Área responsable'],
      menu('xs-route', 'Reseña de prueba', examples) + menu('xs-neighbors', 'Máximo de vecinos', neighbors, 1))}
    ${stage('xs-rag', '5. Responder con evidencia · 4 min',
      'Prueben «¿Cuánto dura la batería?» y «¿Cuál es el precio?». Ajusten la similitud mínima. Esta simulación de RAG cita reseñas recuperadas con TF-IDF y similitud coseno. Las respuestas son extractos del corpus local.',
      ['? Pregunta', '▤ Recuperar', '❝ Citar'],
      `<form data-question><label for="xs-query">Pregunta sobre las reseñas</label>
      <input id="xs-query" maxlength="180" required value="¿Cuánto dura la batería?">
      ${menu('xs-evidence', 'Similitud mínima (%)', evidence, 1)}
      <button type="submit">Buscar evidencia</button></form>`)}
  `;

  const field = id => root.querySelector('#' + id);
  const value = (id, options) => options[Number(field(id).value)];
  const render = (id, html) => { root.querySelector(`[data-result="${id}"]`).innerHTML = html; };
  let index;

  function filter() {
    const probability = classify(value('xs-filter', examples)).find(item => item.label === 'Falsa').probability * 100;
    const action = probability >= value('xs-threshold', thresholds) ? 'Enviar a revisión humana' : 'Dejar pasar';
    render('xs-bayes', `<p><strong>${action}</strong> · Probabilidad estimada de reseña falsa: ${format.format(probability)} %</p>`);
  }

  function vector() {
    const metric = field('xs-weight').value === '0' ? 'count' : 'weight';
    const terms = index.terms(value('xs-vector-review', examples)).sort((a, b) => b[metric] - a[metric]);
    const max = Math.max(1, ...terms.map(term => term[metric]));
    render('xs-vector', terms.length ? `<ul class="xsmoso-bars">${terms.map(term =>
      `<li><span>${term.word}</span><meter aria-label="${term.word}" max="${max}" value="${term[metric]}"></meter>${format.format(term[metric])}</li>`).join('')}</ul>`
      : '<p>No hay términos compartidos con el corpus.</p>');
  }

  function cluster() {
    render('xs-cluster', `<ol class="xsmoso-groups">${index.cluster(value('xs-groups', groups)).map(group =>
      `<li><strong>${group.keywords.join(' · ')}</strong><ul>${group.members.map(({ id, text }) =>
        `<li>${id} · ${text}</li>`).join('')}</ul></li>`).join('')}</ol>`);
  }

  function route() {
    const nearest = index.rank(value('xs-route', examples)).slice(0, value('xs-neighbors', neighbors));
    const votes = new Map();
    for (const { category } of nearest) votes.set(category, (votes.get(category) ?? 0) + 1);
    const ranking = [...votes].sort((a, b) => b[1] - a[1]);
    const [first, second] = ranking;
    let decision = 'Sin vecinos con similitud positiva';
    if (first) decision = first[1] === second?.[1] ? 'Empate · revisión manual' : first[0];
    render('xs-knn', `<p><strong>${decision}</strong> · ${ranking.map(([category, count]) => `${category}: ${count}`).join(' · ')}</p>
      <ol>${nearest.map(({ id, category, score }) => `<li>${id} · ${category} · similitud ${format.format(score)}</li>`).join('')}</ol>`);
  }

  function retrieve() {
    const matches = index.rank(field('xs-query').value)
      .filter(review => review.score >= value('xs-evidence', evidence) / 100).slice(0, 2);
    render('xs-rag', matches.length ? matches.map(({ id, text, score }) =>
      `<blockquote>${text}<footer>Fuente [${id}] · similitud ${format.format(score)}</footer></blockquote>`).join('')
      : '<p>El corpus no aporta evidencia suficiente con este umbral.</p>');
  }

  function rebuild() {
    index = textIndex(reviews.slice(0, value('xs-size', sizes)));
    vector();
    cluster();
    route();
    retrieve();
  }

  for (const [id, update] of [
    ['xs-size', rebuild], ['xs-filter', filter], ['xs-threshold', filter], ['xs-vector-review', vector],
    ['xs-weight', vector], ['xs-groups', cluster], ['xs-route', route], ['xs-neighbors', route], ['xs-evidence', retrieve]
  ]) field(id).addEventListener('change', update);

  root.querySelector('[data-question]').addEventListener('submit', event => {
    event.preventDefault();
    retrieve();
  });
  filter();
  rebuild();
}
