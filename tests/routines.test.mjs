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

test('reordenar conserva la prescripción y persiste el orden al recargar', () => {
  const env = setup(); const store = env.create(); const id = store.create('Orden').routineId;
  store.add(id, 'ex-01', 4, 10); store.add(id, 'ex-02', 3, 12);
  const otherId = store.create('Otra rutina').routineId; store.add(otherId,'ex-01',2,8);
  assert.equal(store.moveExercise(id,'ex-02',-1).ok,true);
  const afterMove = store.list.find(routine=>routine.id===id).items;
  assert.equal(afterMove[0].exerciseId,'ex-02'); assert.equal(afterMove[0].sets,3); assert.equal(afterMove[0].reps,12);
  const reload = env.create();
  assert.equal(reload.list[0].items[0].exerciseId,'ex-02');
  assert.equal(reload.list[1].items[0].sets,2);
  assert.equal(reload.moveExercise(id,'ex-02',1).ok,true);
  assert.equal(reload.list[0].items[0].exerciseId,'ex-01');
});
test('límites, rutina vacía e IDs inválidos no cambian los datos guardados', () => {
  const env = setup(); const store = env.create(); const id = store.create('Límites').routineId;
  assert.equal(store.moveExercise(id,'ex-01',1).ok,false);
  store.add(id,'ex-01',3,12); store.add(id,'ex-02',3,12);
  const original = env.raw();
  for (const [routineId, exerciseId, direction] of [[id,'ex-01',-1],[id,'ex-02',1],['missing','ex-01',1],[id,'missing',1],[id,'ex-01',0],[id,'ex-01',NaN]]) assert.equal(store.moveExercise(routineId,exerciseId,direction).ok,false);
  assert.equal(env.raw(),original);
});
test('reordenar con almacenamiento bloqueado mantiene la sesión y el aviso', () => {
  const store = setup(null,true).create(); const id = store.create('Orden sin guardar').routineId;
  store.add(id,'ex-01',3,12); store.add(id,'ex-02',3,12);
  assert.equal(store.moveExercise(id,'ex-01',1).ok,true);
  assert.equal(store.list[0].items[0].exerciseId,'ex-02');
  assert.ok(store.warning);
});

test('duplicación independiente: conserva orden, prescripción y persistencia', () => {
  const env = setup(); const store = env.create(); const id = store.create('Fuerza').routineId;
  store.add(id,'ex-02',4,10); store.add(id,'ex-01',3,12);
  const result = store.duplicate(id); assert.equal(result.ok,true); assert.notEqual(result.routineId,id);
  const copy = store.list.find(routine=>routine.id===result.routineId);
  assert.equal(copy.name,'Fuerza (copia)'); assert.equal(copy.items[0].exerciseId,'ex-02'); assert.equal(copy.items[0].sets,4);
  store.update(copy.id,'ex-02',5,8); store.moveExercise(copy.id,'ex-01',-1); store.rename(copy.id,'Variante');
  const original = store.list.find(routine=>routine.id===id);
  assert.equal(original.name,'Fuerza'); assert.equal(original.items[0].exerciseId,'ex-02'); assert.equal(original.items[0].sets,4); assert.equal(original.items[0].reps,10);
  const reload = env.create(); assert.equal(reload.list.length,2); assert.equal(reload.list[1].name,'Variante'); assert.equal(reload.list[1].items[0].exerciseId,'ex-01');
  store.remove(copy.id); assert.equal(store.list[0].id,id);
});
test('nombres de copia únicos, límites y rutina vacía', () => {
  const store = setup().create(); const id = store.create('A'.repeat(60)).routineId;
  const first = store.duplicate(id); const second = store.duplicate(id);
  const a=store.list.find(routine=>routine.id===first.routineId); const b=store.list.find(routine=>routine.id===second.routineId);
  assert.ok(a.name.length<=60); assert.ok(b.name.length<=60); assert.notEqual(a.name,b.name); assert.ok(b.name.endsWith('(copia 2)')); assert.equal(a.items.length,0);
  assert.equal(store.duplicate('missing').ok,false); assert.equal(store.list.length,3);
});
test('duplicación con almacenamiento bloqueado conserva la copia y avisa', () => {
  const store=setup(null,true).create(); const id=store.create('Sin conexión').routineId; store.add(id,'ex-01',3,12);
  const result=store.duplicate(id); assert.equal(result.ok,true); assert.equal(store.list.length,2); assert.ok(store.warning);
  store.removeExercise(result.routineId,'ex-01'); assert.equal(store.list[0].items.length,1);
});

test('restaurar conserva ID, posición, orden y últimas prescripciones guardadas', () => {
  const env=setup();const store=env.create();store.create('Primera');const id=store.create('Segunda').routineId;store.create('Tercera');
  store.add(id,'ex-02',3,12);store.add(id,'ex-01',4,10);store.update(id,'ex-02',5,8);
  const snapshot=store.list[1];store.remove(id);const result=store.restore(snapshot,1);
  assert.equal(result.ok,true);assert.equal(store.list[1].id,id);assert.equal(store.list[1].items[0].exerciseId,'ex-02');assert.equal(store.list[1].items[0].sets,5);
  snapshot.items[0].sets=49;assert.equal(store.list[1].items[0].sets,5);
  const reload=env.create();assert.equal(reload.list[1].id,id);assert.equal(reload.list[1].items[0].reps,8);
});
test('restaurar no duplica IDs ni acepta posiciones o datos inválidos', () => {
  const store=setup().create();const id=store.create('Rutina').routineId;const snapshot=store.list[0];
  assert.equal(store.restore(snapshot,0).ok,false);store.remove(id);
  assert.equal(store.restore(snapshot,-1).ok,false);assert.equal(store.restore({...snapshot,name:' '},0).ok,false);
  assert.equal(store.restore({...snapshot,items:[{exerciseId:'unknown',sets:3,reps:12}]},0).ok,false);
  assert.equal(store.restore(snapshot,100).ok,true);assert.equal(store.list.length,1);
});
test('restaurar con almacenamiento bloqueado conserva la recuperación en memoria', () => {
  const store=setup(null,true).create();const id=store.create('Recuperar').routineId;const snapshot=store.list[0];store.remove(id);
  assert.equal(store.restore(snapshot,0).ok,true);assert.equal(store.list[0].id,id);assert.ok(store.warning);
});
