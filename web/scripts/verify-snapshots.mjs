/** Validate website's research snapshot and exact Max-Cut graph metadata.
 * Run after npm install: npm run verify:data
 * This is a consistency test, not a new quantum experiment.
 */
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const source = fs.readFileSync(new URL('../src/data.ts', import.meta.url), 'utf8');
const js = ts.transpileModule(source, {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
const module = {exports:{}};
vm.runInNewContext(js, {exports:module.exports, module, require:()=>{throw Error('No external imports expected')}});
const data=module.exports;
const ensure=(condition, message)=> {if(!condition)throw new Error(message)};
ensure(data.graphs.length===3,'Expected three Phase 2 instances');
for(const g of data.graphs){
  const vals=[];
  for(let assignment=0;assignment<(1<<g.nodes);assignment++){
    vals.push(g.edges.reduce((v,[a,b,w])=>v+((((assignment>>a)&1)!==((assignment>>b)&1))?w:0),0));
  }
  ensure(Math.max(...vals)===g.optimum,`${g.id}: exact Max-Cut mismatch`);
  for(const depth of [1,2]){
    const run=g.qaoa[depth];ensure(run.expected<=g.optimum+1e-8&&run.expected>=0,`${g.id}: expected cut invalid`);
    ensure(run.success>=0&&run.success<=1,`${g.id}: probability invalid`);
  }
}
ensure(data.noiseStudy.length===4,'Noise sweep count mismatch');
for(const n of data.noiseStudy){ensure(n.low<=n.high,'CI bounds inverted');ensure(n.p2Share>=0&&n.p2Share<=1,'Invalid p2 fraction');}
ensure(data.policies.length===6,'Missing frozen-test policy');
for(const p of data.policies){ensure(Math.abs((p.ratio-.0005*p.cx)-p.utility)<.00002,`${p.id}: utility rule inconsistent`);}
ensure(data.policies.find(p=>p.id==='forest').utility<data.policies.find(p=>p.id==='gate').utility,'Frozen negative result missing');
for(const t of ['unrestricted','ring','line'])for(const opt of [0,2])for(const p of [1,2]){
  const rec=data.compiled[t][opt][p];ensure(rec.cx>0&&rec.depth>0,`Missing topology resource ${t}/${opt}/${p}`);
}
console.log('PASS: benchmark graph optima, ratios, probabilities, confidence bounds, policy utility, and topology resources');
