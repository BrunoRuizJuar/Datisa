const controls = [
  ['prior', 'Probabilidad previa de spam', 'P(S)', 20, 'math-prior'],
  ['spam', '«Oferta» en correos spam', 'P(O | S)', 60, 'math-evidence'],
  ['legitimate', '«Oferta» en correos legítimos', 'P(O | L)', 10, 'math-evidence']
];
const percent = new Intl.NumberFormat('es-MX', { style: 'percent', maximumFractionDigits: 2 });

export function posterior(prior, spam, legitimate) {
  const spamWeight = prior * spam;
  const legitimateWeight = (100 - prior) * legitimate;
  const total = spamWeight + legitimateWeight;
  return total ? {
    probability: spamWeight / total,
    decision: Math.sign(spamWeight - legitimateWeight)
  } : null;
}

export function mountBayes(root) {
  root.innerHTML = `<h2>Laboratorio · ¿Es spam?</h2>
    <p>Ejemplo didáctico con una sola evidencia: el correo contiene «oferta». Cambia las frecuencias y observa cómo se reparte la probabilidad entre las dos clases.</p>
    <form>
      <div class="bayes-controls">${controls.map(([id, label, symbol, value, color]) => `<div class="bayes-control">
        <label for="bayes-${id}">${label} <code class="${color}">${symbol}</code></label>
        <div><input type="range" id="bayes-${id}" name="${id}" min="0" max="100" value="${value}">
        <output for="bayes-${id}" aria-hidden="true">${value}%</output></div>
      </div>`).join('')}</div>
      <button type="reset">Restablecer ejemplo</button>
    </form>
    <div class="bayes-prediction">
      <div class="bayes-bar" aria-hidden="true"><span></span></div>
      <p class="bayes-result" role="status"></p>
    </div>
    <p class="bayes-question">Prueba con una previa de 5 % y conserva las otras frecuencias. ¿Qué clase resulta más probable?</p>`;
  const form = root.querySelector('form');
  const result = root.querySelector('.bayes-result');
  const bar = root.querySelector('.bayes-bar');

  function update() {
    const values = controls.map(([name]) => {
      const input = form.elements.namedItem(name);
      const label = percent.format(input.valueAsNumber / 100);
      input.setAttribute('aria-valuetext', label);
      form.querySelector(`output[for="${input.id}"]`).textContent = label;
      return input.valueAsNumber;
    });
    const estimate = posterior(...values);
    bar.hidden = !estimate;
    if (!estimate) {
      result.textContent = 'Posterior indefinida. Con estas frecuencias es imposible observar «oferta».';
      return;
    }
    const { probability, decision } = estimate;
    bar.firstElementChild.style.width = (probability * 100) + '%';
    const classification = decision > 0 ? 'Spam' : decision < 0 ? 'Correo legítimo' : 'Empate entre las dos clases';
    result.innerHTML = `<strong>${classification}</strong><span>Spam ${percent.format(probability)} · Legítimo ${percent.format(1 - probability)}</span>`;
  }

  form.addEventListener('input', update);
  form.addEventListener('reset', () => queueMicrotask(update));
  update();
}