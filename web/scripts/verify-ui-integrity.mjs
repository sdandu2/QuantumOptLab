/** Dependency-free scientific UX invariants for M7A.1. These are source checks,
 * not a substitute for a live browser, typecheck or actual Qiskit run.
 */
import fs from 'node:fs';
const read = (x)=>fs.readFileSync(new URL(x,import.meta.url),'utf8');
const explore=read('../src/pages/Explore.tsx');
const circuit=read('../src/components/QAOACircuit.tsx');
const hardware=read('../src/pages/Hardware.tsx');
const bench=read('../src/pages/Benchmarks.tsx');
const method=read('../src/pages/Methodology.tsx');
const exporter=read('./export_qiskit_circuits.py');
const requireCheck=(condition,name)=>{if(!condition)throw Error('FAIL: '+name);console.log('PASS:',name)};
requireCheck(explore.includes('maxcut-math')&&explore.includes('CROSSING EDGES'),'Explained weighted Max-Cut objective and crossing-edge metrics');
requireCheck(explore.includes('LIVE CLASSICAL INTERACTION')&&explore.includes('FROZEN QUANTUM SIMULATION'),'Classical interaction visually separated from Qiskit snapshot');
requireCheck(circuit.includes('graph.edges.map')&&circuit.includes('M${y(g.v)}')===false&&circuit.includes('RZZ(-wγ'),'Two-qubit gate structure built per graph edge');
requireCheck(exporter.includes("qc.rzz(-float(w)*gamma,u,v)")&&exporter.includes("qc.rx(2*beta,q)")&&exporter.includes("qc.draw(output='text'"),'Exporter mirrors Phase 2 QAOA construction');
requireCheck(bench.includes('yFor(d.low)')&&bench.includes('yFor(d.high)')&&!bench.includes('<polygon points={bounds}'),'Per-point bootstrap CI whiskers without continuous shaded band');
requireCheck(bench.includes('min:0,max:0.8')&&bench.includes('dot-track'),'Policy utilities plotted on zero-based scale');
requireCheck(hardware.includes('compiled.unrestricted[opt][depth]'),'Hardware ratio uses same optimization level');
requireCheck(hardware.includes('shortestRoute')&&hardware.includes('not the compiler'),'Connectivity teaching path is explicitly illustrative');
requireCheck(method.includes('40</strong>')&&method.includes('LOCKED TEST'),'Graph split described in methodology');
console.log('PASS: 9/9 scientific-UI source safeguards');
