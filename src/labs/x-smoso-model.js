export const archive = [
  { id: 'R1', category: 'Entrega', text: 'La entrega llegó tres días tarde. El seguimiento del envío no se actualizó.' },
  { id: 'R2', category: 'Producto', text: 'La batería del producto dura dos horas. El cargador funciona bien.' },
  { id: 'R3', category: 'Atención', text: 'Soporte respondió por chat en veinte minutos y autorizó el reembolso.' },
  { id: 'R4', category: 'Entrega', text: 'La entrega tardó una semana. El seguimiento del envío quedó congelado.' },
  { id: 'R5', category: 'Producto', text: 'La batería del producto dura dos horas y se calienta durante la carga.' },
  { id: 'R6', category: 'Atención', text: 'Soporte confirmó el reembolso por chat después de revisar mi pedido.' },
  { id: 'R7', category: 'Entrega', text: 'El envío llegó tarde. El seguimiento decía entregado desde el lunes.' },
  { id: 'R8', category: 'Producto', text: 'La batería funciona bien, pero el cargador del producto venía suelto.' },
  { id: 'R9', category: 'Atención', text: 'El chat de soporte respondió rápido y explicó cómo solicitar el reembolso.' },
  { id: 'R10', category: 'Falsa', text: 'Excelente excelente producto perfecto. Cinco estrellas garantizadas.' },
  { id: 'R11', category: 'Falsa', text: 'Compra ya. Producto perfecto, cinco estrellas, recomendación garantizada.' },
  { id: 'R12', category: 'Falsa', text: 'Excelente producto perfecto. Compra ya y deja cinco estrellas.' }
];


const stopWords = new Set('a al antes como con cual cuando de del desde donde el en es esta fuera la las lo los me para por puedo que se tu un una y'.split(' '));

function tokens(text) {
  return (text.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').match(/[a-z0-9]+/g) ?? [])
    .filter(word => !stopWords.has(word));
}

function countWords(text) {
  const counts = new Map();
  for (const word of tokens(text)) counts.set(word, (counts.get(word) ?? 0) + 1);
  return counts;
}

export function spamModel(documents) {
  const vocabulary = new Set(documents.flatMap(document => tokens(document.text)));
  const classes = ['Auténtica', 'Falsa'].map(label => {
    const examples = documents.filter(document => (document.category === 'Falsa' ? 'Falsa' : 'Auténtica') === label);
    const counts = countWords(examples.map(document => document.text).join(' '));
    const total = [...counts.values()].reduce((sum, count) => sum + count, 0);
    return { label, counts, denominator: total + vocabulary.size, prior: examples.length / documents.length };
  });
  return text => {
    const words = tokens(text).filter(word => vocabulary.has(word));
    const scores = classes.map(({ label, counts, prior, denominator }) => ({
      label,
      logScore: words.reduce((score, word) => score + Math.log(((counts.get(word) ?? 0) + 1) / denominator), Math.log(prior))
    }));
    const maximum = Math.max(...scores.map(score => score.logScore));
    const normalizer = scores.reduce((sum, score) => sum + Math.exp(score.logScore - maximum), 0);
    return scores.map(score => ({ label: score.label, probability: Math.exp(score.logScore - maximum) / normalizer }));
  };
}

export function textIndex(documents) {
  const counts = documents.map(document => countWords(document.text));
  const vocabulary = [...new Set(counts.flatMap(row => [...row.keys()]))].sort();
  const idf = vocabulary.map(word => 1 + Math.log((1 + counts.length) / (1 + counts.filter(row => row.has(word)).length)));
  const vectorize = text => {
    const row = countWords(text);
    return vocabulary.map((word, index) => (row.get(word) ?? 0) * idf[index]);
  };
  const vectors = documents.map(document => vectorize(document.text));
  return {
    terms(text) {
      const row = countWords(text);
      const weights = vectorize(text);
      return vocabulary.flatMap((word, index) => row.has(word) ? [{ word, count: row.get(word), weight: weights[index] }] : [])
        .sort((a, b) => b.weight - a.weight || a.word.localeCompare(b.word));
    },
    rank(text) {
      const query = vectorize(text);
      return documents.map((document, index) => ({ ...document, score: cosine(query, vectors[index]) }))
        .filter(document => document.score > 0)
        .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
    },
    cluster(k) {
      const points = vectors.map(vector => {
        const norm = Math.hypot(...vector);
        return vector.map(weight => norm ? weight / norm : 0);
      });
      let centers = [points[0]];
      const distance = (a, b) => a.reduce((sum, value, i) => sum + (value - b[i]) ** 2, 0);
      while (centers.length < k) {
        const separation = point => Math.min(...centers.map(center => distance(point, center)));
        const farthest = points.reduce((best, point) => separation(point) > separation(best) ? point : best);
        centers.push(farthest);
      }
      let assignments = [];
      for (let iteration = 0; iteration < 20; iteration++) {
        const next = points.map(point => {
          const distances = centers.map(center => distance(point, center));
          return distances.indexOf(Math.min(...distances));
        });
        if (next.every((group, index) => group === assignments[index])) break;
        assignments = next;
        centers = centers.map((center, group) => {
          const members = points.filter((_, index) => assignments[index] === group);
          return members.length ? center.map((_, i) => members.reduce((sum, point) => sum + point[i], 0) / members.length) : center;
        });
      }
      return centers.map((center, group) => ({
        centroid: vocabulary.map((word, i) => ({ word, weight: center[i] })).filter(term => term.weight > 0)
          .sort((a, b) => b.weight - a.weight),
        keywords: vocabulary.map((word, i) => ({ word, weight: center[i] }))
          .filter(term => term.weight > 0).sort((a, b) => b.weight - a.weight).slice(0, 3).map(term => term.word),
        members: documents.filter((_, index) => assignments[index] === group)
      }));
    }
  };
}

function cosine(a, b) {
  const denominator = Math.hypot(...a) * Math.hypot(...b);
  return denominator ? a.reduce((sum, value, i) => sum + value * b[i], 0) / denominator : 0;
}
