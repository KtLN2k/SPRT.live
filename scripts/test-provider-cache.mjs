import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import assert from 'node:assert/strict';
const source=fs.readFileSync(new URL('../lib/football/provider.ts',import.meta.url),'utf8');
const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
let calls=0;
const context={exports:{},require:()=>({hebrewTeam:x=>x}),process:{env:{}},AbortSignal,console,fetch:async()=>{
 calls++;
 // A canceled Worker request may never settle its outstanding I/O.
 if(calls===1)return new Promise(()=>{});
 return {ok:true,json:async()=>({events:[{idEvent:'real-response'}]})};
}};
vm.runInNewContext(js,context);
void context.exports.provider('eventsday.php?d=2026-09-26',60);
const result=await Promise.race([context.exports.provider('eventsday.php?d=2026-09-26',60),new Promise((_,reject)=>setTimeout(()=>reject(Error('New request blocked by abandoned I/O')),200))]);
assert.equal(result.data.events[0].idEvent,'real-response');
assert.equal(calls,2);
await context.exports.provider('eventsday.php?d=2026-09-26',60);
assert.equal(calls,2,'Settled data should still be cached');
console.log('PASS: abandoned I/O cannot block a new request; settled JSON remains cached.');
