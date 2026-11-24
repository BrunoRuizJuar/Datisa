export const number = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 3 }).format;
export const percent = value => value == null ? 'Indefinido' : number(100 * value) + ' %';
export const escape = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);

export function explanation(question, answer) {
  return `<div class="experiment-explanation"><p>${question}</p><details><summary>Revelar explicación</summary><p>${answer}</p></details></div>`;
}

export function table(headers, rows, caption) {
  return `<div class="experiment-scroll" tabindex="0" role="region" aria-label="${caption}"><table class="experiment-table"><caption>${caption}</caption><thead><tr>${headers.map(h => `<th scope="col">${h}</th>`).join('')}</tr></thead>
    <tbody>${rows.map(([head, ...cells]) => `<tr><th scope="row">${head}</th>${cells.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}

export function numeric(name, label, value, min, max, type = 'number') {
  return `<label>${label}<input type="${type}" name="${name}" value="${value}" min="${min}" max="${max}" required></label>`;
}

export function experiment(root, title, intro, controls, question, answer, update, prepare) {
  root.innerHTML = `<h2>${title}</h2><p>${intro}</p>
    <form><div class="experiment-controls">${controls}</div><button type="reset">Restablecer</button></form>
    <div data-output></div>${explanation(question, answer)}`;
  const form = root.querySelector('form');
  const render = event => {
    prepare?.(form.elements);
    if (form.matches(':invalid')) return;
    update(form.elements, root.querySelector('[data-output]'), event);
  };
  form.addEventListener('submit', event => event.preventDefault());
  form.addEventListener('input', render);
  form.addEventListener('reset', () => queueMicrotask(() => {
    root.querySelector('details').open = false;
    render();
  }));
  render();
}
