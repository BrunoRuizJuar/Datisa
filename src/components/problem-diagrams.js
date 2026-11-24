import { lessonScenes } from './lesson-scenes.js';
import { questionScenes } from './question-scenes.js';

const paper = (x, y, color = 'blue', angle = 0) => `<g transform="translate(${x} ${y}) rotate(${angle} 48 56)">
  <rect class="art-${color}" width="96" height="112" rx="9"/>
  <path class="art-lines" d="M17 27h61M17 41h61M17 55h61M17 69h45M17 88h30"/>
</g>`;

const envelope = (x, y, color, angle = 0, scale = 1) => `<g class="art-${color}" transform="translate(${x} ${y}) rotate(${angle} 55 34) scale(${scale})">
  <rect width="110" height="68" rx="8"/><path d="m4 7 51 32 51-32" fill="none"/>
</g>`;

const tag = (x, y, color, label) => `<g class="art-${color}" transform="translate(${x} ${y})">
  <rect width="140" height="45" rx="22"/><text x="70" y="28" text-anchor="middle">${label}</text>
</g>`;

const question = (x, y) => `<g transform="translate(${x} ${y})"><circle class="art-purple" r="37"/>
  <path d="M-10-9a11 11 0 1 1 17 9Q0 4 0 12m0 10h.1" class="art-question"/></g>`;

const scenes = {
  ...lessonScenes({ paper, envelope, tag, question }),
  ...questionScenes({ paper, envelope, tag, question }),
  inbox: () => `
    <ellipse class="art-ground" cx="299" cy="251" rx="212" ry="20"/>
    ${envelope(135, 95, 'blue', -21)}${envelope(246, 81, 'purple', 9)}${envelope(355, 100, 'cream', 15)}
    <path class="art-blue" d="M127 169l30-42h285l30 42"/>
    <path class="art-green" d="M127 169h122l15 20h72l15-20h121v45a25 25 0 0 1-25 25H152a25 25 0 0 1-25-25Z"/>
    ${envelope(208, 53, 'gray', -12)}${envelope(321, 51, 'blue', 14)}`,
  news: () => `
    <ellipse class="art-ground" cx="300" cy="249" rx="194" ry="17"/>
    ${paper(135, 83, 'green', -15)}${paper(367, 81, 'cream', 14)}
    <rect class="art-blue" x="220" y="46" width="152" height="184" rx="10"/>
    <rect class="art-purple" x="239" y="69" width="114" height="28" rx="5"/>
    <path class="art-lines" d="M239 118h114m-114 16h114m-114 16h86m-86 22h114m-114 16h74"/>
    <circle class="art-cream art-glass" cx="360" cy="156" r="37"/><path class="art-handle" d="m386 182 33 31"/>`,
  archive: () => `
    <ellipse class="art-ground" cx="300" cy="246" rx="196" ry="17"/>
    <path class="art-purple" d="M138 102h105l23 24h198v106H138Z"/>
    ${paper(167, 68, 'blue', -11)}${paper(252, 41, 'gray', 6)}${paper(340, 61, 'green', 13)}
    <path class="art-blue" d="M119 151h362l-26 82H145Z"/>
    <path class="art-lines" d="M277 189h46"/>
    ${tag(362, 103, 'cream', 'Facturación')}`,
  filter: () => `
    <ellipse class="art-ground" cx="301" cy="247" rx="202" ry="18"/>
    <path class="art-green" d="M130 126h58l12 14h88v78H130Z"/>
    <path class="art-cream" d="M325 126h58l12 14h87v78H325Z"/>
    ${envelope(236, 62, 'blue', -9)}
    <path class="art-green" d="M119 164h176l-14 63H133Z"/>
    <path class="art-cream" d="M313 164h177l-14 63H327Z"/>
    <path class="art-lines" d="M180 190h55m137 0h55"/>
    ${question(303, 128)}`,
  offer: () => `
    <ellipse class="art-ground" cx="300" cy="246" rx="191" ry="17"/>
    ${envelope(124, 115, 'blue', -13)}${envelope(355, 118, 'cream', 15)}
    <rect class="art-purple" x="221" y="48" width="145" height="171" rx="11"/>
    <path class="art-lines" d="M242 122h102m-102 17h102m-102 17h78m-78 21h57"/>
    <text class="art-word" x="294" y="99" text-anchor="middle">«oferta»</text>
    ${question(377, 178)}`,
  bayes: () => `
    <ellipse class="art-ground" cx="300" cy="246" rx="206" ry="17"/>
    ${envelope(103, 101, 'cream', -16)}${envelope(119, 131, 'green', -6)}
    ${envelope(372, 102, 'purple', 15)}${envelope(366, 133, 'blue', 7)}
    ${paper(246, 53, 'gray', -4)}
    <text class="art-word art-offer-label" x="296" y="153" text-anchor="middle">«oferta»</text>
    ${question(343, 190)}`,
  vocabulary: () => `
    <ellipse class="art-ground" cx="300" cy="248" rx="186" ry="17"/>
    ${paper(139, 82, 'blue', -12)}${paper(202, 65, 'gray', 7)}
    <rect class="art-green" x="288" y="53" width="172" height="173" rx="12"/>
    <path class="art-lines" d="M312 82v112h123"/>
    <rect class="art-blue" x="327" y="103" width="21" height="90" rx="4"/>
    <rect class="art-purple" x="360" y="141" width="21" height="52" rx="4"/>
    <rect class="art-cream" x="394" y="173" width="21" height="20" rx="4"/>`,
  neighbors: () => `
    <ellipse class="art-ground" cx="300" cy="246" rx="218" ry="17"/>
    ${paper(124, 82, 'gray', -6)}
    ${question(298, 142)}
    ${tag(360, 80, 'green', 'Entrega')}
    ${tag(374, 156, 'cream', 'Facturación')}`,
  separator: () => `
    <ellipse class="art-ground" cx="300" cy="246" rx="197" ry="17"/>
    <rect class="art-gray" x="186" y="45" width="278" height="185" rx="12"/>
    <g class="art-blue"><circle cx="244" cy="116" r="10"/><circle cx="268" cy="84" r="8"/><circle cx="298" cy="107" r="9"/><circle cx="324" cy="71" r="7"/></g>
    <g class="art-cream"><circle cx="349" cy="178" r="10"/><circle cx="381" cy="197" r="8"/><circle cx="408" cy="161" r="9"/><circle cx="427" cy="190" r="7"/></g>
    ${paper(128, 105, 'gray', -10)}
    ${question(346, 128)}`
};

export function renderProblemDiagram({ scene, description, details = [] }) {
  return `<figure class="problem-illustration">
    <svg viewBox="50 20 500 256" role="img" aria-label="${description}">
      ${scenes[scene](...details)}
    </svg>
  </figure>`;
}