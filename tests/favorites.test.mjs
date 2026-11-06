import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const compile = path => ts.transpileModule(fs.readFileSync(new URL(path, import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
function setup(raw = null, mode = '') {
  let value = raw;
  const storage = {
    getItem() { if (mode === 'read') throw new Error('blocked'); return value; },
    setItem(_key, next) { if (mode === 'write') throw new Error('quota'); value = next; },
  };
  const window = mode === 'access' ? Object.defineProperty({}, 'localStorage', { get() { throw new Error('blocked'); } }) : { localStorage: storage };
  const service = { exports: {} };
  vm.runInNewContext(compile('../src/services/storage.ts'), { exports: service.exports, window });
  const state = { exports: {} };
  vm.runInNewContext(compile('../src/state/favorites.ts'), { exports: state.exports, require: () => service.exports });
  return { create: () => state.exports.createFavorites(['ex-01', 'ex-02']), raw: () => value };
}
test('guardado, recarga, eliminación e IDs desconocidos', () => {
  const env = setup();
  const state = env.create();
  assert.equal(state.size, 0);
  assert.equal(state.toggle('ex-01'), true);
  assert.equal(state.has('ex-01'), true);
  assert.equal(env.raw(), '["ex-01"]');
  const reload = env.create();
  assert.equal(reload.has('ex-01'), true);
  assert.equal(reload.toggle('unknown'), false);
  assert.equal(reload.size, 1);
  reload.toggle('ex-01');
  assert.equal(env.raw(), '[]');
});
test('filtra duplicados, tipos incorrectos e IDs ausentes del catálogo', () => {
  const state = setup('["ex-01","ex-01",7,"unknown","ex-02"]').create();
  assert.equal(state.size, 2);
  assert.ok(state.warning);
});
for (const raw of ['{broken', '{}', '42', '"text"']) {
  test(`datos dañados o estructura inválida: ${raw}`, () => {
    const env = setup(raw);
    const state = env.create();
    assert.equal(state.size, 0);
    assert.ok(state.warning);
    state.toggle('ex-02');
    assert.equal(env.raw(), '["ex-02"]');
    assert.equal(state.warning, '');
  });
}
for (const mode of ['access', 'read', 'write']) {
  test(`almacenamiento no disponible: ${mode}`, () => {
    const state = setup(null, mode).create();
    if (mode !== 'write') assert.ok(state.warning);
    const saved = state.toggle('ex-01');
    assert.equal(state.has('ex-01'), true);
    if (mode !== 'read') { assert.equal(saved, false); assert.ok(state.warning); }
  });
}
