import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { randomUUID } from 'node:crypto';
import ts from 'typescript';
function setup(blocked = false) {
  const cache = new Map(); const storage = new Map();
  const window = {localStorage:{getItem:key=>storage.get(key)??null,setItem:(key,value)=>{if(blocked) throw Error('quota'); storage.set(key,value);}}};
  function load(url) {
    if(cache.has(url.href)) return cache.get(url.href);
    const exports={};cache.set(url.href,exports);
    const code=ts.transpileModule(fs.readFileSync(url,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
    vm.runInNewContext(code,{exports,require:path=>load(new URL(path+'.ts',url)),window,crypto:{randomUUID},TextEncoder});
    return exports;
  }
  const backup=load(new URL('../src/services/backup.ts',import.meta.url));
  const favorites=load(new URL('../src/state/favorites.ts',import.meta.url)).createFavorites(['ex-01','ex-02']);
  const routines=load(new URL('../src/state/routines.ts',import.meta.url)).createRoutines(['ex-01','ex-02']);
  return {backup,favorites,routines};
}
const fixture=()=>({app:'fitfinder',version:1,exportedAt:'2026-11-06T00:00:00Z',favorites:['ex-01'],routines:[{id:'r1',name:'Fuerza',items:[{exerciseId:'ex-02',sets:3,reps:12},{exerciseId:'ex-01',sets:4,reps:10}]}]});
test('exportación independiente del estado y validación completa',()=>{
  const {backup}=setup();const data=fixture();
  const exported=backup.createBackup(data.favorites,data.routines); data.routines[0].items[0].sets=45;
  assert.equal(exported.routines[0].items[0].sets,3);
  const parsed=backup.parseBackup(JSON.stringify(exported),['ex-01','ex-02']);
  assert.equal(parsed.ok,true);assert.equal(parsed.data.routines[0].items[0].exerciseId,'ex-02');
  assert.equal(backup.parseBackup(JSON.stringify({...fixture(),favorites:[],routines:[]}),['ex-01','ex-02']).ok,true);
});
test('rechaza archivo dañado, versión desconocida, tamaño y estructuras inválidas',()=>{
  const {backup}=setup();
  for(const text of ['{broken','null','[]',JSON.stringify({...fixture(),version:2}),JSON.stringify({...fixture(),app:'other'}),JSON.stringify({...fixture(),exportedAt:'bad'}),' '.repeat(backup.MAX_BACKUP_BYTES+1)]) assert.equal(backup.parseBackup(text,['ex-01','ex-02']).ok,false);
  for(const mutate of [d=>d.favorites.push('unknown'),d=>d.favorites.push('ex-01'),d=>d.routines[0].items[0].sets=0,d=>d.routines[0].items[0].reps=1.5,d=>d.routines[0].items.push(d.routines[0].items[0]),d=>d.routines[0].name=' ',d=>d.routines.push(d.routines[0]),d=>d.routines=Array.from({length:101},(_,i)=>({id:String(i),name:'A',items:[]}))]) {const data=fixture();mutate(data);assert.equal(backup.parseBackup(JSON.stringify(data),['ex-01','ex-02']).ok,false);}
});
test('importación aditiva e idempotente conserva datos y evita colisiones de ID',()=>{
  const {backup,favorites,routines}=setup();favorites.toggle('ex-02');const existingId=routines.create('Existente').routineId;routines.add(existingId,'ex-01',2,8);
  const data=fixture();data.routines[0].id=existingId;
  const parsed=backup.parseBackup(JSON.stringify(data),['ex-01','ex-02']);assert.equal(parsed.ok,true);
  favorites.merge(parsed.data.favorites);routines.appendImported(backup.newBackupRoutines(routines.list,parsed.data.routines));
  assert.equal(favorites.size,2);assert.equal(routines.list.length,2);assert.equal(routines.list[0].name,'Existente');assert.notEqual(routines.list[1].id,existingId);
  assert.equal(backup.newBackupRoutines(routines.list,parsed.data.routines).length,0);
  assert.equal(routines.list[1].items[0].exerciseId,'ex-02');
});
test('diferencias en orden o prescripción se conservan como otra rutina',()=>{
  const {backup}=setup();const original=fixture().routines[0];const incoming=JSON.parse(JSON.stringify(original));incoming.items.reverse();
  assert.equal(backup.newBackupRoutines([original],[incoming]).length,1);
  assert.equal(backup.newBackupRoutines([],[original,original]).length,1);
});
test('fallos de almacenamiento conservan datos en memoria y notifican',()=>{
  const {favorites,routines}=setup(true);
  assert.equal(favorites.merge(['ex-01']),false);assert.equal(favorites.has('ex-01'),true);assert.ok(favorites.warning);
  assert.equal(routines.appendImported(fixture().routines),false);assert.equal(routines.list.length,1);assert.ok(routines.warning);
});
