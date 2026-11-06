import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { randomUUID } from 'node:crypto';
import ts from 'typescript';
const compile = path => ts.transpileModule(fs.readFileSync(new URL(path, import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
function setup(raw = null, blocked = false) {
  let value = raw;
  const service = { exports: {} };
  const window = { localStorage: { getItem() { return value; }, setItem(_key, next) { if (blocked) throw Error('quota'); value = next; } } };
  vm.runInNewContext(compile('../src/services/storage.ts'), { exports: service.exports, window });
  const state = { exports: {} };
  vm.runInNewContext(compile('../src/state/routines.ts'), { exports: state.exports, require: () => service.exports, crypto: { randomUUID } });
  return { create: () => state.exports.createRoutines(['ex-01', 'ex-02']), raw: () => value };
}
test('flujo completo, persistencia y aislamiento de copias', () => {
  const env = setup(); const store = env.create();
  const id = store.create(' Fuerza ').routineId;
  assert.equal(store.list[0].name, 'Fuerza');
  assert.equal(store.add(id, 'ex-01', 3, 12).ok, true);
  assert.equal(store.add(id, 'ex-01', 4, 10).ok, false);
  assert.equal(store.add(id, 'unknown', 3, 12).ok, false);
  assert.equal(store.update(id, 'ex-01', 4, 10).ok, true);
  store.rename(id, 'Mi fuerza');
  store.list[0].items[0].sets = 999;
  const reload = env.create();
  assert.equal(reload.list[0].items[0].sets, 4);
  assert.equal(reload.list[0].name, 'Mi fuerza');
  assert.equal(reload.removeExercise(id, 'ex-01').ok, true);
  assert.equal(reload.list[0].items.length, 0);
  assert.equal(reload.remove(id).ok, true);
  assert.equal(env.raw(), '[]');
});
test('validación de nombre, límites e identificadores', () => {
  const store = setup().create();
  for (const name of ['', '   ', 'a'.repeat(61)]) assert.equal(store.create(name).ok, false);
  const id = store.create('A').routineId;
  for (const [sets, reps] of [[0,12], [51,12], [1.2,12], [3,0], [3,101], [3,NaN], [3,1.5]]) assert.equal(store.add(id, 'ex-01', sets, reps).ok, false);
  assert.equal(store.add(id, 'ex-01', 50, 100).ok, true);
  assert.equal(store.update(id, 'ex-01', -1, 10).ok, false);
  assert.equal(store.update('missing', 'ex-01', 3, 12).ok, false);
  assert.equal(store.rename(id, '  ').ok, false);
  assert.equal(store.remove('missing').ok, false);
});
test('recupera rutinas válidas sin aceptar datos corruptos', () => {
  const raw = JSON.stringify([{ id:'r1', name:'A', items:[{exerciseId:'ex-01',sets:3,reps:12},{exerciseId:'ex-01',sets:3,reps:12},{exerciseId:'unknown',sets:3,reps:12},{exerciseId:'ex-02',sets:-1,reps:10}] }, {id:'r1',name:'duplicate',items:[]}, null]);
  const store = setup(raw).create();
  assert.equal(store.list.length, 1); assert.equal(store.list[0].items.length, 1); assert.ok(store.warning);
  for (const value of ['{broken', '{}', '42']) { const state = setup(value).create(); assert.equal(state.list.length, 0); assert.ok(state.warning); }
});
test('fallo al guardar conserva las rutinas en memoria y avisa', () => {
  const store = setup(null, true).create(); const id = store.create('Sesión').routineId;
  assert.ok(store.warning); store.add(id,'ex-02',3,12);
  assert.equal(store.list[0].items.length, 1); assert.ok(store.warning);
});
