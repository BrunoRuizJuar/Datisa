export function questionScenes({ paper, envelope, tag, question }) {
  const ground = '<ellipse class="art-ground" cx="300" cy="245" rx="190" ry="16"/>';
  const box = '<path class="art-cream" d="M0 9 37 0l37 9v48L37 67 0 57Z"/><path class="art-lines" d="m0 9 37 10 37-10M37 19v48M21 4l37 10"/>';
  const receipt = '<path class="art-gray" d="M0 0h53v70l-9-5-9 5-9-5-9 5-9-5-8 5Z"/><path class="art-lines" d="M10 17h33M10 29h28M10 41h33"/>';
  return {
    mixedTicket: () => `${ground}${paper(247, 69, 'gray', -6)}
      <g transform="translate(142 109)">${box}</g>
      <g transform="translate(385 88) rotate(10)">${receipt}</g>
      <g transform="translate(404 118) rotate(10)">${receipt}</g>`,
    twoBanks: () => `${ground}
      <path class="art-purple" d="m101 116 98-57 98 57Z"/>
      <rect class="art-gray" x="111" y="116" width="176" height="88" rx="2"/>
      <path class="art-blue" d="M126 117h18v85h-18zm34 0h18v85h-18zm62 0h18v85h-18zm34 0h18v85h-18z"/>
      <rect class="art-purple" x="192" y="145" width="21" height="57" rx="2"/>
      <path class="art-blue" d="M104 202h190v13H104zM97 215h204v10H97z"/>
      <circle class="art-green" cx="458" cy="118" r="43"/>
      <path class="art-branch" d="M458 214v-97m0 31 18-18m-18 4-16-15"/>
      <path class="art-branch" d="M352 179v44m73-44v44"/>
      <rect class="art-cream" x="344" y="158" width="89" height="26" rx="5"/>
      <rect class="art-cream" x="337" y="193" width="103" height="11" rx="4"/>
      <path class="art-branch" d="M350 171h77"/>`,
    labeledTickets: () => `${ground}
      ${paper(156, 86, 'blue', -13)}${paper(254, 59, 'gray', 6)}${paper(360, 87, 'purple', 12)}
      ${tag(285, 148, 'cream', 'Facturación')}`,
    filterErrors: () => `${ground}
      <rect class="art-green" x="111" y="112" width="163" height="112" rx="10"/>
      <rect class="art-cream" x="326" y="112" width="163" height="112" rx="10"/>
      ${envelope(135, 69, 'cream', -9)}${envelope(356, 69, 'gray', 9)}
      <path class="art-lines" d="M164 190h58m157 0h58"/>
      <path class="art-question" d="M219 79v14m0 7h.1"/>
      <g transform="translate(430 73) scale(.51)">${box}</g>`,
    inboxes: () => `${ground}
      <rect class="art-blue" x="101" y="133" width="170" height="91" rx="10"/>
      <rect class="art-green" x="329" y="133" width="170" height="91" rx="10"/>
      ${envelope(124, 89, 'cream', -12)}${envelope(130, 112, 'cream', 8)}${envelope(136, 136, 'purple', -4)}
      ${envelope(353, 89, 'gray', 12)}${envelope(360, 112, 'gray', -8)}${envelope(355, 136, 'purple', 4)}`,
    twoSets: () => `${ground}
      <circle class="art-blue art-glass" cx="249" cy="138" r="87"/>
      <circle class="art-cream art-glass" cx="350" cy="138" r="87"/>
      ${envelope(186, 105, 'blue', -11, .51)}
      ${envelope(276, 128, 'purple', 0, .51)}
      ${envelope(354, 106, 'cream', 11, .51)}
      ${question(299, 195)}`,
    commonWords: () => `${ground}
      ${[128, 246, 364].map(x => `<g transform="translate(${x} 61)">
        <rect class="art-gray" width="108" height="144" rx="9"/>
        <text class="art-word art-small-word" x="54" y="52" text-anchor="middle">pedido</text>
        <path class="art-lines" d="M18 71h72M18 87h72M18 104h38"/>
      </g>`).join('')}
      <text class="art-word art-small-word" x="418" y="128" text-anchor="middle">factura</text>`,
    repeatedTicket: () => `${ground}
      <rect class="art-blue" x="154" y="74" width="115" height="151" rx="10"/>
      <rect class="art-purple" x="333" y="59" width="115" height="166" rx="10"/>
      <path class="art-lines" d="M174 104h75m-75 15h75m-75 15h47M353 89h75m-75 15h75m-75 15h47m-47 32h75m-75 15h75m-75 15h47"/>
      ${question(300, 172)}`,
    manyLines: () => `${ground}
      <rect class="art-gray" x="126" y="44" width="348" height="183" rx="11"/>
      <path class="art-candidate" d="m206 226 159-181m-136 181 159-181m-136 181 159-181"/>
      <g class="art-blue"><circle cx="176" cy="92" r="9"/><circle cx="198" cy="129" r="9"/><circle cx="243" cy="85" r="10"/><circle cx="238" cy="145" r="8"/></g>
      <g class="art-cream"><circle cx="366" cy="163" r="10"/><circle cx="399" cy="124" r="9"/><circle cx="419" cy="187" r="10"/><circle cx="397" cy="199" r="6"/></g>`
  };
}