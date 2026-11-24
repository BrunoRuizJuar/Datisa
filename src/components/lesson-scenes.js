export function lessonScenes({ paper, envelope, tag, question }) {
  const ground = '<ellipse class="art-ground" cx="300" cy="245" rx="200" ry="16"/>';
  const label = (x, y, text, kind = 'art-small-word') =>
    `<text class="art-word ${kind}" x="${x}" y="${y}" text-anchor="middle">${text}</text>`;
  const dot = (x, y, color, radius = 8) =>
    `<circle class="art-${color}" cx="${x}" cy="${y}" r="${radius}"/>`;
  const board = '<rect class="art-gray" x="128" y="43" width="344" height="183" rx="14"/>';
  const axes = '<path class="art-lines" d="M161 72v130h273"/>';
  const card = (x, y, color, word) => `<g transform="translate(${x} ${y})">
    <rect class="art-${color}" width="124" height="76" rx="11"/>${label(62, 44, word)}
  </g>`;
  const folder = (x, y, color, word) => `<g transform="translate(${x} ${y})">
    <path class="art-${color}" d="M0 34h45l9 12h68v73H0Z"/>
    <rect class="art-gray" x="19" y="13" width="80" height="74" rx="6"/>
    <path class="art-lines" d="M32 33h53m-53 13h42"/>
    <path class="art-${color}" d="M-6 64h134l-11 56H5Z"/>${label(61, 98, word)}
  </g>`;
  const tagAt = (x, y, color, text) => tag(x, y, color, text);
  const classes = [[191, 112], [219, 88], [251, 115], [271, 82], [328, 176], [362, 191], [389, 146], [412, 170]];
  const lines = '<path class="art-candidate" d="m213 225 159-181m-104 181 159-181"/><path class="art-boundary" d="m241 225 159-181"/>';
  return {
    tagged: (word, category) => `${ground}${paper(200, 58, 'gray', -10)}
      ${paper(267, 72, 'blue', 6)}
      ${label(313, 173, word)}
      ${tagAt(342, 152, 'green', category)}`,
    archiveStack: (first, second) => `${ground}${folder(136, 81, 'blue', first)}
      ${folder(344, 68, 'purple', second)}${paper(253, 111, 'gray', -7)}`,
    representation: (a, b, c) => `${ground}
      ${paper(111, 66, 'blue', -7)}${label(157, 205, a)}
      <rect class="art-purple" x="226" y="78" width="148" height="92" rx="11"/>
      ${[242, 281, 320].map((x, i) => `<rect class="art-gray" x="${x}" y="96" width="32" height="55" rx="5"/>${label(x + 16, 129, i + 1)}`).join('')}
      ${label(300, 205, b)}${tagAt(391, 96, 'green', c)}`,
    choices: (a, b) => `${ground}${paper(116, 82, 'gray', -8)}
      ${question(286, 137)}${tagAt(348, 77, 'green', a)}${tagAt(365, 152, 'cream', b)}`,
    wordCards: (...words) => `${ground}${words.map((word, i) => {
      const x = (words.length === 2 ? 167 : 100) + i * 138;
      return card(x, i === 1 ? 105 : 91, ['blue', 'purple', 'green'][i], word);
    }).join('')}`,
    split: (a, b, c) => `${ground}${folder(101, 85, 'blue', a)}
      ${folder(240, 68, 'purple', b)}${folder(379, 85, 'green', c)}`,
    comparison: (a, b, result) => `${ground}${card(157, 61, 'blue', a)}
      ${card(319, 61, 'cream', b)}${tagAt(230, 161, 'green', result)}`,
    duplicates: (a, b) => `${ground}${paper(152, 63, 'blue', -8)}${paper(350, 63, 'cream', 8)}
      ${label(199, 207, a)}${label(399, 207, b)}${question(300, 117)}`,
    threshold: (a, b, middle) => `${ground}
      <rect class="art-gray" x="119" y="52" width="362" height="171" rx="12"/>
      <rect class="art-blue" x="155" y="128" width="142" height="14" rx="7"/>
      <rect class="art-cream" x="297" y="128" width="145" height="14" rx="7"/>
      <path class="art-candidate" d="M240 104v56m115-56v56"/>
      ${dot(300, 135, 'purple', 14)}
      ${label(240, 185, a)}${label(355, 185, b)}${middle ? label(300, 99, middle) : ''}`,
    evidence: (a, b, c) => `${ground}${envelope(245, 55, 'gray', -8)}
      ${card(121, 103, 'blue', a)}${card(355, 103, 'cream', b)}
      ${tagAt(230, 165, 'green', c)}`,
    neighborhood: (caption, outlier = false) => `${ground}${board}
      <circle class="art-candidate" cx="302" cy="131" r="48"/>
      ${[[205, 98], [263, 115], [286, 151], [318, 113], [370, 89], [379, 166], [408, 135]].map(([x, y], i) => dot(x, y, i < 4 && !(outlier && i === 3) ? 'blue' : 'cream')).join('')}
      ${dot(302, 131, 'green', 10)}${label(302, 206, caption)}`,
    rays: (a, b, angle) => {
      const short = angle ? [292, 154] : [284, 132];
      return `${ground}${board}${axes}
        <path class="art-ray-orange" d="M161 202 407 62"/>
        <path class="art-ray-blue" d="M161 202 ${short[0]} ${short[1]}"/>
        ${dot(...short, 'blue', 8)}${dot(407, 62, 'cream', 8)}
        ${label(324, short[1] + 14, a)}${label(429, 72, b)}${angle ? label(217, 178, angle) : ''}`;
    },
    margin: (a, b, delivery = false, inside = false) => `${ground}${board}${lines}
      ${classes.map(([x, y], i) => dot(x, y, i < 4 ? 'cream' : 'blue')).join('')}
      ${b ? dot(292.5, 134.5, 'cream', 9) + dot(347.5, 134.5, 'blue', 9) : ''}
      ${delivery || inside ? dot(delivery ? 375 : 307, delivery ? 135 : 157, 'green', 10) : ''}
      ${label(226, 207, a)}${b ? label(393, 207, b) : ''}`
  };
}