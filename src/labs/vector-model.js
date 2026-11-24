export const documents = [
  { id: 'E1', x: 6, y: 4, group: 'E', support: true },
  { id: 'E2', x: 8, y: 3, group: 'E' },
  { id: 'E3', x: 8.6, y: 5.4, group: 'E' },
  { id: 'E4', x: 6.3, y: 1.8, group: 'E' },
  { id: 'F1', x: 4, y: 6, group: 'F', support: true },
  { id: 'F2', x: 3, y: 5.2, group: 'F' },
  { id: 'F3', x: 3.5, y: 6.1, group: 'F' },
  { id: 'F4', x: 5.4, y: 8.5, group: 'F' },
  { id: 'F5', x: 2, y: 7.3, group: 'F' }
];

export const groups = { E: 'Entrega', F: 'Facturación' };

export function vote(query, k) {
  const neighbors = documents.map(doc => {
    const dx = Math.round(doc.x * 10) - Math.round(query.x * 10);
    const dy = Math.round(doc.y * 10) - Math.round(query.y * 10);
    return { ...doc, distanceSquared: dx ** 2 + dy ** 2 };
  }).sort((a, b) => a.distanceSquared - b.distanceSquared || a.id.localeCompare(b.id))
    .slice(0, k);
  const delivery = neighbors.filter(doc => doc.group === 'E').length;
  const billing = neighbors.length - delivery;
  return { neighbors, delivery, billing, classification: delivery === billing ? null : groups[delivery > billing ? 'E' : 'F'] };
}

export function svm(query) {
  const score = (query.x - query.y) / 2;
  return { score, classification: score === 0 ? 'En la frontera' : groups[score > 0 ? 'E' : 'F'] };
}