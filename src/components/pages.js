import { formalEquations } from '../content/formal-equations.js';
import { formalExplanations } from '../content/formal-explanations.js';
import { lessonIllustrations } from '../content/lesson-illustrations.js';
import { questionIllustrations } from '../content/question-illustrations.js';
import { problemDiagrams } from '../content/problem-diagrams.js';
import { renderProblemDiagram } from './problem-diagrams.js';
import { beholderRoutes } from '../encounters/beholder.js';
import { palIntegerRoutes } from '../encounters/pal-integer.js';
import { sectionTitle, sections, sequence } from '../content/sections.js';
import { introduction } from '../content/introduction.js';

import { foundations } from '../content/foundations.js';
import { bayes } from '../content/bayes.js';
import { vector } from '../content/vector.js';
import { xsmoso } from '../content/x-smoso.js';
import { formula } from './math.js';

const lessons = { '4-1-introduccion': introduction, ...foundations, ...bayes, ...vector, '4-4-x-smoso': xsmoso };

export const routeLink = section => '#' + section.id;
const arrow = direction => direction === 'previous' ? '←' : '→';

function pageNavigation(section, position) {
  const index = sequence.indexOf(section);
  const links = [['previous', sequence[index - 1]], ['next', sequence[index + 1]]];
  return `<nav class="page-links" aria-label="Navegación ${position}">
    ${links.map(([direction, target]) => target ? `<a class="${direction}" href="${routeLink(target)}" rel="${direction === 'previous' ? 'prev' : 'next'}">
      ${direction === 'previous' ? `<span aria-hidden="true">${arrow(direction)}</span>` : ''}
      <span>${sectionTitle(target)}</span>
      ${direction === 'next' ? `<span aria-hidden="true">${arrow(direction)}</span>` : ''}
    </a>` : '').join('')}
  </nav>`;
}

function pipeline() {
  const steps = [
    ['Documento', 'Texto de entrada', 'M9 4h14l8 8v24H9z M23 4v9h8 M14 20h12M14 25h12M14 30h8'],
    ['Representación numérica', 'Rasgos del texto', 'M11 5H7v30h4m18-30h4v30h-4 M14 13h3m6 0h3m-12 7h3m6 0h3m-12 7h3m6 0h3'],
    ['Clasificación', 'Modelo de decisión', 'M6 31L33 9 M9 17h0m7-4h0m-3 10h0m12 3h0m6-5h0m-2 12h0'],
    ['Predicción', 'Categoría asignada', 'M5 10h16l14 10-14 10H5z M12 20h0m7 0 3 3 6-6']
  ];
  return `<figure class="pipeline">
    <figcaption>Del documento a una categoría</figcaption>
    <ol>${steps.map(([label, description, path], index) => `<li>
      <svg class="step-icon" viewBox="0 0 40 40" aria-hidden="true"><path d="${path}"/></svg>
      <strong>${label}</strong><small>${description}</small>
      ${index < steps.length - 1 ? '<span class="connector" aria-hidden="true">→</span>' : ''}
    </li>`).join('')}</ol>
  </figure>`;
}

function cover(section) {
  return `<div class="cover">
    <section class="hero" aria-labelledby="page-title">
      <p class="hero-brand"><span class="wordmark">DATISA</span><span>Demostrando la importancia de la Ciencia de Datos.</span></p>
      <h1 id="page-title">Clasificación<br>de documentos</h1>
      <p class="subtitle">Del texto a la predicción.</p>
      <p class="lead">En esta unidad exploraremos cómo las computadoras pueden representar documentos, encontrar patrones y asignar categorías mediante modelos probabilísticos y geométricos.</p>
      <a class="start" href="#4-1-introduccion">Comenzar la unidad <span aria-hidden="true">→</span></a>
    </section>
    ${pipeline()}
    <section class="contents" aria-labelledby="chapters-title">
      <h2 id="chapters-title">Capítulos de la unidad</h2>
      ${sections.filter(item => item.children).map(item => `<a class="chapter-row" href="${routeLink(item)}">
        <span class="chapter-number">${item.number}</span>
        <span><strong>${item.title}</strong><span class="chapter-description">${item.description}</span></span>
        <span class="row-arrow" aria-hidden="true">→</span>
      </a>`).join('')}
    </section>
    <section class="activities" aria-labelledby="activities-title">
      <h2 id="activities-title">Durante la clase</h2>
      <ul><li>Laboratorios interactivos</li><li><a href="#4-4-x-smoso">Ahora, ¿cómo se vería en el mundo real?</a></li><li>Desafíos Kahoot: <a href="#${beholderRoutes.entrance}">Beholder del Sobreajuste</a> y <a href="#${palIntegerRoutes.entrance}">Pal-Integer</a></li></ul>
    </section>
    ${pageNavigation(section, 'inferior')}
  </div>`;
}

function lessonBody(lesson, sectionId) {
  const openingIllustrations = [problemDiagrams[sectionId], questionIllustrations[sectionId]];
  const formal = formalExplanations[sectionId];
  return lesson.blocks.map(([heading, copy, math], index) => {
    const isFormal = formal?.heading === heading;
    const equation = math ?? (isFormal ? formalEquations[sectionId] : undefined);
    const illustration = !equation && !isFormal && (openingIllustrations[index] ?? lessonIllustrations[sectionId]?.[heading]);
    return `<section class="lesson-block${index === 1 ? ' prompt' : ''}">
      <h2>${heading}</h2>
      <p>${copy}</p>
      ${isFormal ? formal.paragraphs.map(paragraph => `<p>${paragraph}</p>`).join('') : ''}
      ${equation ? formula(equation) : ''}
    </section>${illustration ? renderProblemDiagram(illustration) : ''}`;
  }).join('') + (lesson.lab ? `<section class="lesson-lab" data-lab="${lesson.lab}"></section>` : '') +
    (lesson.source ? `<p class="reference"><a href="${lesson.source}">${lesson.sourceLabel ?? 'Manning, Raghavan y Schütze · Introduction to Information Retrieval, cap. 13'}</a></p>` : '');
}
function chapter(section) {
  const lesson = lessons[section.id];
  const lead = lesson?.lead ?? section.description;
  return `<div class="chapter">
    ${pageNavigation(section, 'superior')}
    <article>
      <div class="chapter-header">
        ${section.number ? `<p class="chapter-number">${section.number}</p>` : ''}
        <h1 id="page-title">${section.title}</h1>
        ${lead ? `<p class="lead">${lead}</p>` : ''}
      </div>
      ${lesson ? lessonBody(lesson, section.id) : '<p class="pending">El contenido de esta sección se incorporará en una fase posterior.</p>'}
      ${section.id === '4-2-1-naive-bayes' ? `<p class="encounter-invite"><a href="#${beholderRoutes.entrance}">Invocar mini jefe</a></p>` : ''}
      ${section.id === '4-4-x-smoso' ? `<p class="encounter-invite"><a href="#${palIntegerRoutes.entrance}">Conocer a Pal-Integer</a></p>` : ''}
      ${section.children ? `<ul class="child-links">${section.children.map(child => `<li><a href="${routeLink(child)}">${sectionTitle(child)}</a></li>`).join('')}</ul>` : ''}
    </article>
    ${pageNavigation(section, 'inferior')}
  </div>`;
}

export function renderPage(section) {
  return section.id === 'portada' ? cover(section) : chapter(section);
}
