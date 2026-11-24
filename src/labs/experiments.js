import { wordPosterior, tokenize, termWeights, confusion, generalization } from './experiment-model.js';
import { number, percent, escape, table, numeric, experiment } from './experiment-ui.js';

export function mountWordBayes(root) {
  experiment(root, 'Laboratorio · Una palabra nunca vista', 'Corpus sintético con diez tokens por documento. Ajusta la previa manualmente o estímala con la proporción de documentos. Buscamos la clase de un documento formado por el token «oferta».',
    numeric('prior', 'Previa manual de spam (%)', 20, 0, 100) +
    '<label>Usar proporción de documentos<input type="checkbox" name="empirical" checked></label>' +
    numeric('spam', 'Documentos spam', 2, 1, 100) + numeric('legit', 'Documentos legítimos', 8, 1, 100) +
    numeric('countSpam', 'Ocurrencias de «oferta» en spam', 12, 0, 20) +
    numeric('countLegit', 'Ocurrencias de «oferta» en legítimos', 0, 0, 80) +
    numeric('vocabulary', 'Tamaño del vocabulario', 5, 2, 50) +
    '<label>Activar Laplace (α = 1)<input type="checkbox" name="laplace"></label>',
    'Predice qué ocurrirá con la posterior legítima al activar Laplace.',
    'Sin Laplace, cero ocurrencias producen verosimilitud cero. Al sumar un pseudoconteo a cada término, ambas clases pueden aportar evidencia.',
    (fields, output) => {
      const n = key => fields[key].valueAsNumber;
      const docs = [n('spam'), n('legit')];
      const counts = [n('countSpam'), n('countLegit')];
      const prior = fields.empirical.checked ? docs[0] / (docs[0] + docs[1]) : n('prior') / 100;
      const result = wordPosterior(docs, counts, 10, n('vocabulary'), Number(fields.laplace.checked), prior);
      output.innerHTML = table(['Clase', 'Previa', 'Verosimilitud', 'Posterior'], ['Spam', 'Legítimo'].map((name, i) =>
        [name, percent(result.priors[i]), percent(result.likelihoods[i]), percent(result.posterior?.[i]) +
          (result.posterior ? ` <meter aria-label="Posterior ${name}" max="1" value="${result.posterior[i]}"></meter>` : '')]), 'Comparación de clases');
    }, fields => {
      fields.prior.disabled = fields.empirical.checked;
      for (const [count, docs] of [[fields.countSpam, fields.spam], [fields.countLegit, fields.legit]]) {
        if (!docs.validity.valid) continue;
        count.max = docs.valueAsNumber * 10;
        if (count.valueAsNumber > Number(count.max)) count.value = count.max;
      }
    });
}

export function mountTfidf(root) {
  const initial = ['pedido factura factura', 'pedido envío', 'pedido entrega'];
  experiment(root, 'Laboratorio · Edita el corpus TF-IDF',
    'Separamos secuencias de letras o números y pasamos a minúsculas. TF es el conteo, df cuenta documentos y el peso es TF × ln(3/df). Conservamos los acentos.',
    initial.map((text, i) => `<label>Documento ${i + 1}<textarea maxlength="240" name="d${i}">${text}</textarea></label>`).join('') +
    '<label>Término del vocabulario<select name="term"></select></label>',
    'Añade «factura» a los otros dos documentos. ¿Qué pasará con su peso en el primero?',
    'La frecuencia de «factura» en el primer documento sigue igual. Su frecuencia documental sube a tres y ln(3/3) vale cero.',
    (fields, output, event) => {
      const docs = initial.map((_, i) => tokenize(fields['d' + i].value));
      const words = [...new Set(docs.flat())].sort((a, b) => a.localeCompare(b, 'es'));
      if (event?.target !== fields.term) {
        const previous = event ? fields.term.value : 'factura';
        fields.term.replaceChildren(...words.map(word => new Option(word, word)));
        if (words.includes(previous)) fields.term.value = previous;
      }
      const term = fields.term.value;
      const { tf, df, idf, weights } = termWeights(docs, term);
      output.innerHTML = term ? `<p role="status"><strong>${escape(term)}</strong> · df = ${df} de 3 · IDF = ${number(idf)}. ${df === 3 ? 'El término no distingue documentos con esta ponderación.' : 'El término aporta peso donde aparece.'}</p>` +
        table(['Documento', 'Tokens', 'TF', 'TF-IDF'], docs.map((tokens, i) => [
          i + 1, `<span class="experiment-token">${tokens.map(token => token === term ? `<mark>${escape(token)}</mark>` : escape(token)).join(' · ') || 'Vacío'}</span>`,
          tf[i], number(weights[i]) + ` <meter max="${Math.max(1, ...weights)}" value="${weights[i]}" aria-label="Peso en documento ${i + 1}"></meter>`
        ]), 'Peso del término por documento') : '<p>Escribe un término en cualquier documento para probarlo.</p>';
    });
}

export function mountConfusion(root) {
  experiment(root, 'Laboratorio · Matriz de confusión', 'Filas: clase real. Columnas: predicción. La clase positiva representa spam.',
    [['tp', 'Verdaderos positivos', 8], ['fp', 'Falsos positivos', 2], ['fn', 'Falsos negativos', 3], ['tn', 'Verdaderos negativos', 17]]
      .map(([key, label, value]) => numeric(key, label, value, 0, 9999)).join(''),
    'Si perder un comprobante de compra cuesta más que revisar publicidad, ¿qué error reducirías primero?',
    'Un comprobante legítimo enviado a spam es un falso positivo. Reducir falsos positivos mejora la precisión al mantener fijos los demás conteos. Reducir falsos negativos mejora la exhaustividad.',
    (fields, output) => {
      const [tp, fp, fn, tn] = ['tp', 'fp', 'fn', 'tn'].map(key => fields[key].valueAsNumber);
      output.innerHTML = table(['Real / predicción', 'Spam', 'Legítimo'], [['Spam', tp, fn], ['Legítimo', fp, tn]], 'Conteos') +
        table(['Métrica', 'Valor'], confusion(tp, fp, fn, tn).map((value, i) => [['Accuracy · (VP + VN) / total', 'Precision · VP / (VP + FP)', 'Recall · VP / (VP + FN)', 'F1 · 2VP / (2VP + FP + FN)'][i],
          percent(value) + (value == null ? '' : ` <meter aria-label="Valor de la métrica" max="1" value="${value}"></meter>`)]), 'Métricas calculadas');
    });
}

export function mountLabels(root) {
  const examples = ['Mi pedido llegó tarde', 'Necesito una copia de la factura', 'Me cobraron y no llegó'];
  experiment(root, 'Laboratorio · Etiquetar para entrenar',
    'Asigna a cada ticket una etiqueta de entrenamiento. Un mismo texto puede cambiar de grupo según el criterio que acuerde el equipo.',
    examples.map((text, i) => `<label>«${text}»<select name="label${i}"><option value="">Pendiente</option><option>Entrega</option><option>Facturación</option></select></label>`).join(''),
    '¿Qué regla aplicarías al tercer ticket? Pídele a otra persona que lo etiquete y comparen.',
    'Un criterio compartido mejora la consistencia. Si ambas categorías importan, también es posible diseñar una tarea con varias etiquetas por ticket.',
    (fields, output) => {
      const labels = examples.map((_, i) => fields['label' + i].value);
      output.innerHTML = '<div role="status">' + ['Entrega', 'Facturación', 'Pendiente'].map((className, i) => {
        const matches = examples.filter((_, index) => (labels[index] || 'Pendiente') === className);
        return `<p><strong>${className}</strong> <meter max="3" value="${matches.length}" aria-label="Tickets en ${className}" style="accent-color:${['#397CB5', '#D18A36', '#946BC2'][i]}"></meter> ${matches.length} de 3 · ${matches.join(' / ') || 'Sin tickets'}</p>`;
      }).join('') + '</div>';
    });
}

export function mountGeneralization(root) {
  experiment(root, 'Laboratorio · Generalización y sobreajuste',
    'Ajusta una regresión por intervalos con 16 observaciones sintéticas. Cada intervalo predice la media de sus puntos de entrenamiento. Medimos el error cuadrático medio con esos datos y con 47 puntos de prueba separados.',
    numeric('bins', 'Intervalos del modelo', 4, 1, 16, 'range') + numeric('noise', 'Ruido añadido (0–100)', 55, 0, 100, 'range'),
    '¿Esperas que el modelo de 16 intervalos cometa menos errores en prueba que uno de cuatro?',
    'Más intervalos permiten seguir más variación del entrenamiento. Los intervalos estrechos también aprenden el ruido. En un problema real elegirías la complejidad con validación y reservarías la prueba para la evaluación final.',
    (fields, output) => {
      const bins = fields.bins.valueAsNumber;
      const noise = fields.noise.valueAsNumber;
      fields.bins.setAttribute('aria-valuetext', bins + ' intervalos');
      fields.noise.setAttribute('aria-valuetext', noise + ' de 100');
      const scores = Array.from({ length: 16 }, (_, i) => generalization(i + 1, noise / 100));
      const current = scores[bins - 1];
      const minTest = Math.min(...scores.map(score => score.testError));
      const adequate = scores.map(score => score.testError <= 1.15 * minTest);
      const first = adequate.indexOf(true);
      const last = adequate.lastIndexOf(true);
      const region = index => adequate[index] ? 'Generalización adecuada' : index < first ? 'Subajuste' : index > last ? 'Sobreajuste' : 'Fuera de la banda';
      const maxError = Math.max(...scores.flatMap(score => [score.trainError, score.testError]));
      const x = index => 38 + index * 25;
      const y = error => 175 - 150 * error / maxError;
      const showFit = output.querySelector('details')?.open;
      output.innerHTML = `<svg class="experiment-plot" viewBox="0 0 448 215" role="img" aria-label="Curvas medidas de error por número de intervalos">
        ${scores.map((_, i) => `<rect x="${x(i)-12}" y="20" width="25" height="155" fill="${adequate[i] ? '#29916C' : i < first ? '#397CB5' : i > last ? '#D18A36' : '#946BC2'}" opacity=".14"><title>${i + 1}: ${region(i)}</title></rect>`).join('')}
        <path d="M25 20V175H426" fill="none" stroke="#202124"/>
        ${[['trainError', '#397CB5', ''], ['testError', '#D18A36', '5 3']].map(([key, color, dash]) => `<polyline points="${scores.map((score, i) => x(i) + ',' + y(score[key])).join(' ')}" fill="none" stroke="${color}" stroke-width="3" stroke-dasharray="${dash}"/><circle cx="${x(bins - 1)}" cy="${y(current[key])}" r="5" fill="${color}" stroke="#202124"/>`).join('')}
        <text x="5" y="15">ECM</text><text x="28" y="35">${number(maxError)}</text><text x="8" y="177">0</text><text x="25" y="195">1</text><text x="399" y="195">16</text><text x="170" y="207">Intervalos</text></svg>
        <p role="status"><strong>${bins} intervalos · ${region(bins - 1)}</strong> · Entrenamiento (continua) ${number(current.trainError)} · Prueba (discontinua) ${number(current.testError)} · Brecha prueba − entrenamiento ${number(current.testError - current.trainError)}.</p>
        <p>Con ruido ${noise}/100, la banda adecuada incluye errores de prueba hasta 15 % por encima del mínimo observado. Antes de esa banda marcamos subajuste y después, sobreajuste como lectura didáctica de esta corrida.</p>
        <details ${showFit ? 'open' : ''}><summary>Ver el ajuste y los datos</summary>
          <svg class="experiment-plot" viewBox="0 0 448 215" role="img" aria-label="Observaciones de entrenamiento y prueba, y medias ajustadas por intervalo">
            <path d="M30 20V185H425" fill="none" stroke="#202124"/>
            ${current.test.map(p => `<circle cx="${30 + p.x * 390}" cy="${102 - p.y * 39}" r="2" fill="none" stroke="#8a561c"/>`).join('')}
            ${current.train.map(p => `<circle cx="${30 + p.x * 390}" cy="${102 - p.y * 39}" r="3" fill="#397CB5"/>`).join('')}
            ${current.means.map((mean, i) => `<line x1="${30 + i * 390 / bins}" x2="${30 + (i + 1) * 390 / bins}" y1="${102 - mean * 39}" y2="${102 - mean * 39}" stroke="#217453" stroke-width="2"/>`).join('')}
            <text x="30" y="205">x = 0</text><text x="385" y="205">x = 1</text>
          </svg>
          <p>● Entrenamiento · ○ Prueba · Segmentos verdes: medias aprendidas.</p>
        </details>`;
    });
}
