export function wordPosterior(documents, counts, tokensPerDocument, vocabulary, alpha, prior) {
  const priors = [prior, 1 - prior];
  const likelihoods = counts.map((count, i) => (count + alpha) / (documents[i] * tokensPerDocument + alpha * vocabulary));
  const weights = likelihoods.map((value, i) => value * priors[i]);
  const evidence = weights[0] + weights[1];
  return { priors, likelihoods, posterior: evidence ? weights.map(weight => weight / evidence) : null };
}

export const tokenize = text => text.toLocaleLowerCase('es').normalize('NFC').match(/[\p{L}\p{N}]+/gu) ?? [];

export function termWeights(documents, term) {
  const tf = documents.map(words => words.filter(word => word === term).length);
  const df = tf.filter(Boolean).length;
  const idf = df ? Math.log(documents.length / df) : null;
  return { tf, df, idf, weights: tf.map(count => count * (idf ?? 0)) };
}

export function confusion(tp, fp, fn, tn) {
  const ratio = (a, b) => b ? a / b : null;
  return [ratio(tp + tn, tp + fp + fn + tn), ratio(tp, tp + fp), ratio(tp, tp + fn), ratio(2 * tp, 2 * tp + fp + fn)];
}

function observations(size, phase, noise) {
  return Array.from({ length: size }, (_, i) => {
    const x = (i + phase) / size;
    return { x, y: Math.sin(2 * Math.PI * x) + noise * Math.sin((i + 1) * 7.31 + phase * 19) };
  });
}

// Piecewise constant least squares: each bin predicts its training mean.
export function generalization(bins, noise = .55) {
  const train = observations(16, .5, noise);
  const test = observations(47, .31, noise);
  const index = x => Math.min(bins - 1, Math.floor(x * bins));
  const groups = Array.from({ length: bins }, () => []);
  for (const point of train) groups[index(point.x)].push(point.y);
  const means = groups.map(group => group.reduce((sum, y) => sum + y, 0) / group.length);
  const mse = data => data.reduce((sum, point) => sum + (point.y - means[index(point.x)]) ** 2, 0) / data.length;
  return { train, test, means, trainError: mse(train), testError: mse(test) };
}

// In 2D the closest pair on the convex hulls lies at a vertex and an
// opposing edge, or two vertices. Enumerate segments and keep only valid
// separating candidates. The closest valid pair fixes the maximum margin.
export function hardMargin(points) {
  const positive = points.filter(p => p.group === 'E');
  const negative = points.filter(p => p.group === 'F');
  let best = null;
  for (const [vertices, edges, sign] of [[positive, negative, 1], [negative, positive, -1]]) {
    for (const p of vertices) {
      for (let i = 0; i < edges.length; i++) {
        const a = edges[i];
        for (let j = i; j < edges.length; j++) {
          const b = edges[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const squared = dx * dx + dy * dy;
          const t = squared ? Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / squared)) : 0;
          const q = { x: a.x + t * dx, y: a.y + t * dy };
          const distance = Math.hypot(p.x - q.x, p.y - q.y);
          if (distance < 1e-8 || (best && distance >= best.margin)) continue;
          const x = sign * 2 * (p.x - q.x) / distance ** 2;
          const y = sign * 2 * (p.y - q.y) / distance ** 2;
          const bias = -(x * (p.x + q.x) + y * (p.y + q.y)) / 2;
          const score = point => x * point.x + y * point.y + bias;
          const signed = point => (point.group === 'E' ? 1 : -1) * score(point);
          if (points.every(point => signed(point) >= 1 - 1e-7)) {
            best = { x, y, bias, score, margin: distance, support: points.filter(point => Math.abs(signed(point) - 1) < 1e-7) };
          }
        }
      }
    }
  }
  return best;
}
