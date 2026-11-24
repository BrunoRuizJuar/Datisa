import { beholderRoutes, renderBeholder } from './encounters/beholder.js';
import { palIntegerRoutes, renderPalInteger } from './encounters/pal-integer.js';
import { renderMath } from './components/math.js';
import { mountBayes } from './labs/bayes.js';
import { mountGeometry } from './labs/geometry.js';
import { mountWordBayes, mountTfidf, mountConfusion, mountGeneralization, mountLabels } from './labs/experiments.js';
import { mountXsmoso } from './labs/x-smoso.js';
import { sections, sequence, sectionTitle } from './content/sections.js';
import { renderPage, routeLink } from './components/pages.js';

const content = document.querySelector('#contenido');
const sidebar = document.querySelector('#sidebar');
const menu = document.querySelector('#menu');
const backdrop = document.querySelector('#backdrop');
const shell = document.querySelector('#shell');
const index = document.querySelector('#index');
const locationLabel = document.querySelector('#location');
const mobile = matchMedia('(max-width: 800px)');
const byId = new Map(sequence.map(section => [section.id, section]));

function read(key) {
  try { return localStorage.getItem('datisa.' + key); }
  catch { return null; }
}

function save(key, value) {
  try { localStorage.setItem('datisa.' + key, value); }
  catch { /* La navegación también funciona con almacenamiento deshabilitado. */ }
}

const indexLink = section => `<a href="${routeLink(section)}">${section.number ? `<span class="index-number">${section.number}</span>` : ''}<span>${section.title}</span></a>`;
index.innerHTML = `<p class="index-label">Índice de la unidad</p><ul>
  ${sections.map(section => `<li>${section.children ? `<div class="index-parent">
    ${indexLink(section)}
    <button type="button" class="toggle-chapter" aria-expanded="false" aria-controls="group-${section.id}" aria-label="Subsecciones de ${section.title}"><span aria-hidden="true">⌄</span></button>
    </div><ul id="group-${section.id}" hidden>${section.children.map(child => `<li>${indexLink(child)}</li>`).join('')}</ul>` : indexLink(section)}</li>`).join('')}
</ul>`;

let desktopOpen = read('sidebar') !== 'closed';
let mobileOpen = false;
let rendered;

function updateSidebar() {
  const open = mobile.matches ? mobileOpen : desktopOpen;
  sidebar.hidden = !open;
  backdrop.hidden = !mobile.matches || !open;
  content.inert = mobile.matches && open;
  document.querySelector('.footer').inert = content.inert;
  shell.classList.toggle('sidebar-open', open);
  document.body.classList.toggle('drawer-open', mobile.matches && open);
  menu.setAttribute('aria-expanded', open);
  menu.setAttribute('aria-label', open ? 'Cerrar índice' : 'Abrir índice');
}

function closeMobile(restoreFocus = false) {
  mobileOpen = false;
  updateSidebar();
  if (restoreFocus) menu.focus();
}

menu.addEventListener('click', () => {
  if (mobile.matches) mobileOpen = !mobileOpen;
  else {
    desktopOpen = !desktopOpen;
    save('sidebar', desktopOpen ? 'open' : 'closed');
  }
  updateSidebar();
  if (mobileOpen) (index.querySelector('[aria-current="page"]') ?? index.querySelector('a')).focus();
});
backdrop.addEventListener('click', () => closeMobile(true));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && mobileOpen) closeMobile(true);
});
mobile.addEventListener('change', () => closeMobile());

function setGroup(button, open) {
  button.setAttribute('aria-expanded', open);
  document.getElementById(button.getAttribute('aria-controls')).hidden = !open;
}

index.addEventListener('click', event => {
  const toggle = event.target.closest('.toggle-chapter');
  if (toggle) setGroup(toggle, toggle.getAttribute('aria-expanded') === 'false');
});

function showRoute(focus = false) {
  const hash = window.location.hash.slice(1);
  if (hash === 'contenido') {
    if (!rendered) display(byId.get(read('section')) ?? sections[0]);
    content.focus();
    return;
  }
  const encounter = Object.values(beholderRoutes).includes(hash) ? renderBeholder
    : Object.values(palIntegerRoutes).includes(hash) ? renderPalInteger : null;
  if (encounter) {
    if (mobileOpen) closeMobile();
    shell.classList.add('encounter-shell');
    rendered = hash;
    content.innerHTML = encounter(hash);
    document.title = content.querySelector('h1').textContent + ' · DATISA';
    window.scrollTo(0, 0);
    if (focus) content.focus({ preventScroll: true });
    return;
  }
  const section = byId.get(hash) ?? (hash ? sections[0] : byId.get(read('section')) ?? sections[0]);
  if (hash !== section.id) history.replaceState(null, '', routeLink(section));
  display(section);
  if (mobileOpen) closeMobile();
  window.scrollTo(0, 0);
  if (focus) content.focus({ preventScroll: true });
}

function display(section) {
  shell.classList.remove('encounter-shell');
  rendered = section;
  content.innerHTML = renderPage(section);
  renderMath(content);
  const bayesLab = content.querySelector('[data-lab="bayes"]');
  if (bayesLab) mountBayes(bayesLab);
  const vectorLab = content.querySelector('[data-lab="vector"]');
  if (vectorLab) mountGeometry(vectorLab, section.id === '4-3-2-maquinas-vectores-soporte');
  const experiments = { 'word-bayes': mountWordBayes, tfidf: mountTfidf, confusion: mountConfusion, generalization: mountGeneralization, labels: mountLabels };
  for (const element of content.querySelectorAll('[data-lab]')) experiments[element.dataset.lab]?.(element);
  const xsmosoLab = content.querySelector('[data-lab="x-smoso"]');
  if (xsmosoLab) mountXsmoso(xsmosoLab);
  save('section', section.id);
  document.title = section.id === 'portada' ? 'DATISA · Clasificación de documentos' : sectionTitle(section) + ' · DATISA';
  locationLabel.textContent = section.number ? sectionTitle(section) : section.title;
  for (const link of index.querySelectorAll('a')) {
    if (link.hash === routeLink(section)) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  }
  const parent = sections.find(item => item === section || item.children?.includes(section));
  if (parent?.children) setGroup(document.querySelector(`[aria-controls="group-${parent.id}"]`), true);
}

document.addEventListener('click', event => {
  const link = event.target.closest('a');
  if (mobileOpen && link?.getAttribute('href') === window.location.hash) {
    closeMobile();
    content.focus();
  }
});
window.addEventListener('hashchange', () => showRoute(true));
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
updateSidebar();
showRoute();
