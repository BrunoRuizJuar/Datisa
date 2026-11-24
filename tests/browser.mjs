import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { extname, join, resolve, sep } from 'node:path';
import { once } from 'node:events';
import { setTimeout as delay } from 'node:timers/promises';
import { sequence } from '../src/content/sections.js';
import { beholderRoutes } from '../src/encounters/beholder.js';
import { palIntegerRoutes } from '../src/encounters/pal-integer.js';

const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.md': 'text/plain' };
const root = resolve('.');
const server = createServer(async (req, res) => {
  try {
    const path = resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname.replace(/^\/$/, '/index.html')));
    if (!path.startsWith(root + sep)) throw Error('Ruta inválida');
    res.setHeader('content-type', mime[extname(path)] ?? 'application/octet-stream');
    res.end(await readFile(path));
  } catch {
    res.writeHead(404).end();
  }
}).listen(0, '127.0.0.1');
await once(server, 'listening');
const origin = 'http://127.0.0.1:' + server.address().port;
const profile = await mkdtemp(join(tmpdir(), 'datisa-browser-'));
const edge = process.env.DATISA_BROWSER || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const browser = spawn(edge, ['--headless=new', '--disable-gpu', '--remote-debugging-port=0',
  '--user-data-dir=' + profile, '--no-first-run', 'about:blank'], { windowsHide: true, stdio: 'ignore' });
let socket;
try {
  let port;
  for (let i = 0; i < 100 && !port; i++) {
    port = await readFile(join(profile, 'DevToolsActivePort'), 'utf8').then(value => value.split('\n')[0].trim(), () => null);
    if (!port) await delay(100);
  }
  assert.ok(port, 'Edge habilitó DevTools');
  const targets = await (await fetch('http://127.0.0.1:' + port + '/json/list')).json();
  socket = new WebSocket(targets.find(target => target.type === 'page').webSocketDebuggerUrl);
  await once(socket, 'open');
  const pending = new Map();
  const exceptions = [];
  const failed = [];
  let id = 0;
  socket.addEventListener('message', ({ data }) => {
    const message = JSON.parse(data);
    if (message.method === 'Runtime.exceptionThrown') exceptions.push(message.params.exceptionDetails);
    if (message.method === 'Network.responseReceived' && message.params.response.url.startsWith(origin) && message.params.response.status >= 400) failed.push(message.params.response.url);
    const callback = pending.get(message.id);
    if (callback) {
      pending.delete(message.id);
      callback(message);
    }
  });
  function call(method, params = {}) {
    return new Promise((ok, fail) => {
      const command = ++id;
      pending.set(command, message => message.error ? fail(Error(JSON.stringify(message.error))) : ok(message.result));
      socket.send(JSON.stringify({ id: command, method, params }));
    });
  }
  async function evaluate(expression) {
    const result = await call('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    assert.ok(!result.exceptionDetails, JSON.stringify(result.exceptionDetails));
    return result.result.value;
  }
  const viewport = (width, height, mobile = false) => call('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile });
  async function navigate(route, selector = 'h1') {
    await call('Page.navigate', { url: origin + '/#' + route });
    for (let i = 0; i < 100; i++) {
      if (await evaluate(`location.hash === '#${route}' && !!document.querySelector('${selector}') && document.readyState === 'complete'`)) {
        await evaluate('new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))');
        return;
      }
      await delay(50);
    }
    throw Error('No se cargó #' + route + ' para ' + selector);
  }
  await call('Page.enable');
  await call('Runtime.enable');
  await call('Network.enable');
  await call('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await viewport(1440, 980);
  const validRoutes = [...sequence.map(s => s.id), ...Object.values(beholderRoutes), ...Object.values(palIntegerRoutes)];
  let formulas = 0;
  for (const route of validRoutes) {
    await navigate(route);
    const links = await evaluate("[...document.querySelectorAll('a[href^=\"#\"]')].map(a => a.hash.slice(1))");
    assert.ok(links.every(link => validRoutes.includes(link) || link === 'contenido'), 'Enlaces internos de ' + route);
    assert.equal(await evaluate('document.querySelectorAll("main h1").length'), 1);
    const rendered = await evaluate(`[...document.querySelectorAll('[data-tex]')].map(formula =>
      !!formula.querySelector('.katex math') && !formula.querySelector('.katex-error'))`);
    assert.ok(rendered.every(Boolean), 'Fórmulas KaTeX de ' + route);
    formulas += rendered.length;
  }
  assert.ok(formulas >= 14);
  for (const file of ['kahoot-beholder.md', 'kahoot-pal-integer.md']) {
    assert.equal((await fetch(origin + '/src/encounters/' + file)).status, 200);
  }
  const targetsForCapture = [
    ['01-portada', 'portada', '.hero'],
    ['02-naive-bayes', '4-2-1-naive-bayes', '.chapter-header'],
    ['03-tf-idf', '4-3-espacios-vectoriales', '[data-lab=tfidf]'],
    ['04-k-nn', '4-3-1-vecinos-cercanos', '[data-lab=vector]'],
    ['05-svm', '4-3-2-maquinas-vectores-soporte', '[data-lab=vector]'],
    ['06-x-smoso', '4-4-x-smoso', '[data-lab=x-smoso]'],
    ['07-beholder', 'beholder-del-sobreajuste', '.encounter'],
    ['08-pal-integer', 'pal-integer', '.encounter']
  ];
  await mkdir('docs/capturas', { recursive: true });
  for (const [name, route, selector] of targetsForCapture) {
    await navigate(route, selector);
    if (!selector.includes('lab') && !selector.includes('encounter')) await evaluate('document.fonts.ready.then(() => true)');
    if (selector.includes('lab')) await evaluate(`document.querySelector('${selector}').scrollIntoView(); scrollBy(0, -65)`);
    const result = await call('Page.captureScreenshot', { format: 'png' });
    await writeFile('docs/capturas/' + name + '.png', Buffer.from(result.data, 'base64'));
  }
  await navigate('4-2-1-naive-bayes', '[data-lab=word-bayes]');
  assert.ok(await evaluate('!!document.querySelector(".katex")'));
  assert.ok(await evaluate(`(() => {
    const panel = document.querySelector('[data-lab=word-bayes]');
    const laplace = panel.querySelector('[name=laplace]');
    const before = panel.querySelector('meter').value;
    laplace.click();
    return before === 1 && panel.querySelector('meter').value < 1;
  })()`));
  await navigate('4-3-espacios-vectoriales', '[data-lab=tfidf]');
  assert.ok(await evaluate(`(() => {
    const panel = document.querySelector('[data-lab=tfidf]');
    const doc = panel.querySelector('[name=d1]');
    doc.value += ' factura';
    doc.dispatchEvent(new Event('input', { bubbles: true }));
    return panel.querySelector('[role=status]').textContent.includes('df = 2');
  })()`));
  await navigate('4-3-1-vecinos-cercanos', '[data-lab=vector]');
  const [start, finish] = await evaluate(`(() => {
    const svg = document.querySelector('.experiment-plot');
    svg.scrollIntoView({ block: 'center' });
    const matrix = svg.getScreenCTM();
    return [[184,174], [208,174]].map(([x,y]) => {
      const point = new DOMPoint(x, y).matrixTransform(matrix);
      return { x: point.x, y: point.y };
    });
  })()`);
  await call('Input.dispatchMouseEvent', { type: 'mousePressed', ...start, button: 'left', buttons: 1, clickCount: 1 });
  await call('Input.dispatchMouseEvent', { type: 'mouseMoved', ...finish, button: 'left', buttons: 1 });
  await call('Input.dispatchMouseEvent', { type: 'mouseReleased', ...finish, button: 'left', buttons: 0, clickCount: 1 });
  assert.ok(await evaluate(`document.querySelector('[data-lab=vector] [name=point]').value === 'E1' &&
    document.querySelector('[data-lab=vector] [name=x]').value === '7'`));
  assert.ok(await evaluate(`(() => {
    const panel = document.querySelector('[data-lab=vector]');
    panel.querySelector('[data-add]').click();
    return panel.querySelector('svg [data-point=P10]') && panel.querySelector('[data-result]').textContent.includes('Facturación');
  })()`));
  await navigate('4-3-2-maquinas-vectores-soporte', '[data-lab=vector]');
  assert.ok(await evaluate(`(() => {
    const panel = document.querySelector('[data-lab=vector]');
    panel.querySelector('[name=x]').value = 6;
    panel.querySelector('[name=x]').dispatchEvent(new Event('input', { bubbles: true }));
    panel.querySelector('[data-add]').click();
    return panel.querySelector('[data-result]').textContent.includes('no admite un margen duro');
  })()`));
  await navigate('4-1-1-aprendizaje-automatico', '[data-lab=generalization]');
  assert.ok(await evaluate(`(() => {
    const panel = document.querySelector('[data-lab=generalization]');
    const bins = panel.querySelector('[name=bins]');
    bins.value = 16;
    bins.dispatchEvent(new Event('input', { bubbles: true }));
    return panel.querySelector('[role=status]').textContent.includes('Entrenamiento (continua) 0');
  })()`));
  await navigate('4-1-3-clasificacion-automatica', '[data-lab=confusion]');
  assert.ok(await evaluate(`document.querySelector('[data-lab=confusion]').textContent.includes('83.333')`));
  await navigate('4-4-x-smoso', '[data-lab=x-smoso]');
  assert.ok(await evaluate(`(() => {
    const set = (selector, value, event = 'input') => {
      const control = document.querySelector(selector);
      control.value = value;
      control.dispatchEvent(new Event(event));
    };
    set('#xs-filter-text', 'entrega tarde seguimiento');
    set('#xs-vector-text', 'batería batería');
    set('#xs-groups', '3', 'change');
    set('#xs-route-text', 'reembolso por chat');
    return document.querySelector('[data-result=xs-bayes]').textContent.includes('P(auténtica)') &&
      document.querySelector('[data-result=xs-vector]').textContent.includes('TF 2') &&
      document.querySelectorAll('.xsmoso-groups > li').length === 4 &&
      document.querySelector('[data-result=xs-knn]').textContent.includes('Atención') &&
      document.querySelector('[data-result=xs-rag]').textContent.includes('Resumen extractivo');
  })()`));
  assert.ok(await evaluate(`(() => {
    const query = document.querySelector('#xs-query');
    query.value = '<img src=no>';
    document.querySelector('[data-question]').requestSubmit();
    const result = document.querySelector('[data-result=xs-rag]');
    return !result.querySelector('img') && result.textContent.includes('<img src=no>');
  })()`));
  await viewport(390, 844, true);
  for (const [route, selector] of targetsForCapture.map(([, route, selector]) => [route, selector])) {
    await navigate(route, selector);
    assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth'), 'Ancho móvil de ' + route);
  }
  await navigate('4-2-1-naive-bayes');
  await evaluate('document.querySelector("#menu").focus()');
  const key = (type, name, code, text) => call('Input.dispatchKeyEvent', { type, key: name, code: name, windowsVirtualKeyCode: code, text });
  await key('keyDown', 'Enter', 13, '\r');
  await key('keyUp', 'Enter', 13);
  assert.ok(await evaluate('!!document.activeElement.closest("#index") && document.querySelector("main").inert'));
  await key('rawKeyDown', 'Escape', 27);
  await key('keyUp', 'Escape', 27);
  assert.ok(await evaluate('document.activeElement.id === "menu" && !document.querySelector("main").inert'));
  assert.equal(await evaluate('getComputedStyle(document.body).backgroundColor'), 'rgb(255, 255, 255)');
  assert.equal(await evaluate('getComputedStyle(document.body).color'), 'rgb(32, 33, 36)');
  assert.ok(await evaluate(`(() => {
    const colors = [document.body, document.querySelector('main a'), document.querySelector('.location')];
    const luminance = color => color.match(/\\d+/g).map(Number).map(n => n / 255)
      .map(n => n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4)
      .reduce((sum, n, i) => sum + n * [.2126, .7152, .0722][i], 0);
    return colors.every(element => 1.05 / (luminance(getComputedStyle(element).color) + .05) >= 4.5);
  })()`));
  await navigate('beholder-del-sobreajuste');
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".encounter")).animationName'), 'none');
  await call('Page.navigate', { url: origin + '/#ruta-inexistente' });
  await delay(300);
  assert.equal(await evaluate('location.hash'), '#portada');
  assert.deepEqual(failed, []);
  assert.deepEqual(exceptions, []);
  console.log(`Edge: ${validRoutes.length} rutas, ${formulas} fórmulas, controles, móvil, teclado, movimiento reducido y ocho capturas.`);
} finally {
  socket?.close();
  browser.kill();
  server.closeAllConnections();
  server.close();
  await delay(350);
  await rm(profile, { recursive: true, force: true, maxRetries: 3 }).catch(() => {});
}
