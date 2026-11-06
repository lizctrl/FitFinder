import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const exports = {};
const code = ts.transpileModule(fs.readFileSync(new URL('../src/keyboard.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
vm.runInNewContext(code,{exports});
const base={key:'k',ctrlKey:false,metaKey:false,altKey:false,shiftKey:false,isComposing:false};
test('búsqueda con Control o Comando y tecla K',()=>{
  assert.equal(exports.isSearchShortcut({...base,ctrlKey:true}),true);
  assert.equal(exports.isSearchShortcut({...base,metaKey:true}),true);
  assert.equal(exports.isSearchShortcut({...base,key:'K',ctrlKey:true}),true);
});
test('caracteres solos, composición y otras combinaciones no activan la búsqueda',()=>{
  for(const event of [base,{...base,key:'/'},{...base,altKey:true},{...base,ctrlKey:true,shiftKey:true},{...base,metaKey:true,altKey:true},{...base,ctrlKey:true,isComposing:true},{...base,key:'f',ctrlKey:true}]) assert.equal(exports.isSearchShortcut(event),false);
});
