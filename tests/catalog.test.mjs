import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
function load(path) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(new URL(path, import.meta.url), 'utf8'), { compilerOptions:{ module:ts.ModuleKind.CommonJS, target:ts.ScriptTarget.ES2022 } }).outputText;
  vm.runInNewContext(code, { exports });
  return exports;
}
const { exercises } = load('../src/data/exercises.ts');
const { filterExercises } = load('../src/filter-exercises.ts');
const { muscleGroups, difficulties, equipmentOptions } = load('../src/types/exercise.ts');
const base = {query:'',muscleGroup:'',difficulty:'',equipment:''};
test('catálogo íntegro y recursos locales disponibles', () => {
  assert.equal(exercises.length,20);
  assert.equal(new Set(exercises.map(exercise=>exercise.id)).size,exercises.length);
  for (const exercise of exercises) {
    assert.ok(exercise.name.trim());
    assert.ok(exercise.description.trim());
    assert.ok(muscleGroups.includes(exercise.muscleGroup));
    assert.ok(difficulties.includes(exercise.difficulty));
    assert.ok(equipmentOptions.includes(exercise.equipment));
    assert.ok(exercise.primaryMuscles.length);
    assert.ok(exercise.instructions.length);
    assert.ok(exercise.instructions.every(step=>step.trim()));
    assert.ok(fs.existsSync(new URL(`../public${exercise.image}`,import.meta.url)));
  }
});
test('búsqueda tolera tildes, mayúsculas y espacios', () => {
  assert.equal(filterExercises(exercises,{...base,query:'  BICEPS  '})[0].name,'Curl de bíceps');
  assert.equal(filterExercises(exercises,{...base,query:'ELEVACIÓN'}).length,2);
});
test('filtros combinados y estados vacíos sin modificar el catálogo', () => {
  const original = JSON.stringify(exercises);
  assert.equal(filterExercises(exercises,base).length,20);
  assert.equal(filterExercises(exercises,{...base,muscleGroup:'Piernas'}).length,4);
  const combined = {...base,muscleGroup:'Piernas',difficulty:'Intermedio',equipment:'Mancuernas'};
  assert.equal(filterExercises(exercises,combined)[0].name,'Peso muerto rumano');
  assert.equal(filterExercises(exercises,{...combined,equipment:'Peso corporal'}).length,0);
  assert.equal(filterExercises(exercises,{...base,query:'<script>'}).length,0);
  assert.equal(JSON.stringify(exercises),original);
});
