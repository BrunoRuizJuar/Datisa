import test from 'node:test';
import assert from 'node:assert/strict';
import { confusion, generalization, hardMargin, tokenize, termWeights, wordPosterior } from '../src/labs/experiment-model.js';
import { posterior } from '../src/labs/bayes.js';
import { documents, vote } from '../src/labs/vector-model.js';
import { archive, spamModel, textIndex } from '../src/labs/x-smoso-model.js';

test('Bayes conserva el caso original y calcula Laplace', () => {
  assert.equal(posterior(20, 60, 10).probability, .6);
  assert.deepEqual(wordPosterior([2, 8], [12, 0], 10, 5, 0, .2).posterior, [1, 0]);
  assert.equal(wordPosterior([2, 8], [12, 0], 10, 5, 1, .2).likelihoods[1], 1 / 85);
  assert.equal(wordPosterior([2, 8], [0, 0], 10, 5, 0, .2).posterior, null);
});
test('TF-IDF cuenta documentos, conserva Unicode y admite documentos vacíos', () => {
  const docs = ['Factura FACTURA. Envío', 'envío', ''].map(tokenize);
  assert.deepEqual(docs[0], ['factura', 'factura', 'envío']);
  assert.deepEqual(termWeights(docs, 'factura').weights, [2 * Math.log(3), 0, 0]);
  assert.equal(termWeights([['x'], ['x'], ['x']], 'x').idf, 0);
});
test('Matriz de confusión y denominadores nulos', () => {
  assert.deepEqual(confusion(8, 2, 3, 17), [25 / 30, .8, 8 / 11, 16 / 21]);
  assert.deepEqual(confusion(0, 0, 0, 0), [null, null, null, null]);
});
test('Generalización ajusta medias y mide el error sobre datos separados', () => {
  assert.equal(generalization(16).trainError, 0);
  assert.ok(generalization(16).testError > .1);
  assert.ok(generalization(4).testError < generalization(1).testError);
  for (let i = 1; i <= 16; i++) assert.ok(Number.isFinite(generalization(i).testError));
});
test('k-NN cambia de vecino con la métrica y distingue empates', () => {
  const points = [{ id: 'A', x: 2, y: 2, group: 'E' }, { id: 'B', x: 3, y: 0, group: 'F' }];
  const query = { x: 0, y: 0 };
  assert.equal(vote(query, 1, points).classification, 'Entrega');
  assert.equal(vote(query, 1, points, 'manhattan').classification, 'Facturación');
  assert.equal(vote(query, 2, points).classification, null);
});
test('SVM identifica soportes y detecta clases solapadas', () => {
  const fit = hardMargin(documents);
  assert.deepEqual(fit.support.map(point => point.id), ['E1', 'F1']);
  assert.ok(Math.abs(fit.margin - Math.sqrt(8)) < 1e-9);
  assert.equal(hardMargin([...documents, { ...documents[0], group: 'F' }]), null);
  assert.equal(hardMargin([{ x: 0, y: 0, group: 'F' }, { x: 4, y: 0, group: 'F' }, { x: 2, y: 3, group: 'E' }]).margin, 3);
});
test('X-smoso clasifica, vectoriza, agrupa y recupera evidencia', () => {
  const probabilities = spamModel(archive)('producto perfecto cinco estrellas');
  assert.ok(Math.abs(probabilities.reduce((sum, item) => sum + item.probability, 0) - 1) < 1e-9);
  const index = textIndex(archive.slice(0, 9));
  assert.equal(index.terms('batería batería')[0].count, 2);
  assert.equal(index.rank('batería')[0].category, 'Producto');
  assert.deepEqual(index.rank('ornitorrinco'), []);
  for (const k of [1, 2, 3, 4, 5]) {
    const clusters = index.cluster(k);
    assert.equal(clusters.length, k);
    assert.equal(new Set(clusters.flatMap(group => group.members.map(member => member.id))).size, 9);
    assert.ok(clusters.every(group => group.centroid.length > 0));
  }
});
