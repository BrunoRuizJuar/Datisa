import katex from '../../assets/katex/katex.js';

const symbols = {
  prior: 'math-prior',
  evidence: 'math-evidence',
  result: 'math-result',
  parameter: 'math-parameter'
};

export function formula({ tex, plain, terms }) {
  return `<div class="formula" data-tex="${tex}">${plain}</div>
    <dl class="math-key" aria-label="Términos de la fórmula">
      ${terms.map(([role, symbol, meaning]) => `<div>
        <dt class="${symbols[role]}">${symbol}</dt><dd>${meaning}</dd>
      </div>`).join('')}
    </dl>`;
}

export function renderMath(root) {
  for (const element of root.querySelectorAll('[data-tex]')) {
    katex.render(element.dataset.tex, element, { displayMode: true, throwOnError: false });
  }
}