import { useState } from 'react';
import { compiled, type OptLevel, type Topology, formatPct } from '../data';
import { DataTag, Eyebrow, Icon, Segmented } from '../components/UI';
const nodes=Array.from({length:8},(_,i)=>{const a=i*Math.PI/4-Math.PI/2;return {x:180+Math.cos(a)*119,y:168+Math.sin(a)*119};});
function shortestRoute(topology:Topology,source:number,target:number):number[]{
  if(source===target)return [source];
  if(topology==='unrestricted')return [source,target];
  if(topology==='line')return Array.from({length:Math.abs(target-source)+1},(_,i)=>source+i*Math.sign(target-source));
  const clockwise=(target-source+8)%8;
  const anticlockwise=(source-target+8)%8;
  const step=clockwise<=anticlockwise?1:-1;
  return Array.from({length:Math.min(clockwise,anticlockwise)+1},(_,i)=>(source+i*step+16)%8);
}
function TopologyDiagram({topology,route}:{topology:Topology;route:number[]}){
  const edges:number[][]=[];
  if(topology==='unrestricted')for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++)edges.push([i,j]);
  if(topology==='line')for(let i=0;i<nodes.length-1;i++)edges.push([i,i+1]);
  if(topology==='ring')for(let i=0;i<nodes.length;i++)edges.push([i,(i+1)%nodes.length]);
  const pts=topology==='line'?nodes.map((_,i)=>({x:34+i*42,y:167})):nodes;
  const routeEdges=new Set(route.slice(1).map((v,i)=>[route[i],v].sort((a,b)=>a-b).join('-')));
  return <svg viewBox="0 0 360 335" className="topology-svg" role="img" aria-label={`${topology} connectivity schematic with eight nodes`}>
    <defs><radialGradient id="nodeGlow"><stop offset="0" stopColor="#2f8880" stopOpacity=".38"/><stop offset="1" stopColor="#2f8880" stopOpacity="0"/></radialGradient></defs>
    <circle cx="180" cy="168" r="142" fill="none" stroke="#4c7771" strokeDasharray="2 8" opacity=".35"/>
    {edges.map(([a,b])=><line key={`${a}-${b}`} x1={pts[a].x} y1={pts[a].y} x2={pts[b].x} y2={pts[b].y} stroke={routeEdges.has([a,b].sort((x,y)=>x-y).join('-'))?'#ffc99a':topology==='unrestricted'?'#70ad9f':'#7ad3c6'} opacity={routeEdges.has([a,b].sort((x,y)=>x-y).join('-'))?'1':topology==='unrestricted'?'.13':'.34'} strokeWidth={routeEdges.has([a,b].sort((x,y)=>x-y).join('-'))?3.5:1.35}/>)}
    {pts.map((p,i)=><g key={i}><circle cx={p.x} cy={p.y} r="24" fill="url(#nodeGlow)"/><circle cx={p.x} cy={p.y} r="13" fill={route.includes(i)?"#4d392c":"#123735"} stroke={route.includes(i)?"#ffcb9a":"#86d2c3"} strokeWidth="1.7"/><text x={p.x} y={p.y+4} textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#e0f1eb">q{i}</text></g>)}
  </svg>;
}
export default function Hardware(){
  const [topology,setTopology]=useState<Topology>('line');
  const [opt,setOpt]=useState<OptLevel>(2);
  const [depth,setDepth]=useState<1|2>(2);
  const [source,setSource]=useState(0);
  const [target,setTarget]=useState(4);
  const route=shortestRoute(topology,source,target);
  const data=compiled[topology][opt][depth];
  const baseline=compiled.unrestricted[opt][depth];
  const reduction=topology==='unrestricted'?0:(1-compiled[topology][2][depth].cx/compiled[topology][0][depth].cx);
  const comparison=(['unrestricted','ring','line'] as const).map(t=>({name:t,value:compiled[t][opt][depth].cx}));
  const max=Math.max(...comparison.map(x=>x.value));
  return <main className="inside-page layout-container">
    <div className="page-intro"><Eyebrow>INTERACTIVE MODULE / 03</Eyebrow><h1>HARDWARE<br/><em>CHANGES EVERYTHING.</em></h1><p>A logical QAOA circuit and a device-routed circuit can require very different resources. Explore measured Qiskit transpilation resources for synthetic line, ring, and all-to-all layouts.</p></div>
    <div className="workspace-toolbar hardware-toolbar"><div><span className="control-label">CONNECTIVITY</span><div className="select-wrap"><select value={topology} onChange={e=>setTopology(e.target.value as Topology)} aria-label="Qubit connectivity"><option value="unrestricted">All-to-all</option><option value="ring">Ring</option><option value="line">Line</option></select><Icon name="chevron" size={16}/></div></div><div><span className="control-label">OPTIMIZATION LEVEL</span><Segmented options={[{value:0 as OptLevel,label:'Level 0'},{value:2 as OptLevel,label:'Level 2'}]} value={opt} onChange={setOpt}/></div><div><span className="control-label">QAOA DEPTH</span><Segmented options={[{value:1 as const,label:'p = 1'},{value:2 as const,label:'p = 2'}]} value={depth} onChange={setDepth}/></div></div>
    <section className="hardware-grid"><div className="panel topology-panel"><div className="panel-head"><div><span className="panel-index">01 / CONNECTION MAP</span><h2>{topology==='unrestricted'?'All-to-all':topology==='ring'?'Ring':'Line'} topology</h2></div><DataTag>SCHEMATIC · 8 QUBITS</DataTag></div><TopologyDiagram topology={topology} route={route}/><div className="route-playground"><div className="route-playground-title"><strong>Illustrate a logical interaction</strong><span>{route.length-1} {route.length===2?'connection':'connection hops'} · shortest path</span></div><div className="route-pickers"><label>From qubit <select value={source} onChange={e=>{const v=Number(e.target.value);setSource(v);if(v===target)setTarget((v+1)%8);}}>{nodes.map((_,i)=><option key={i} value={i}>q{i}</option>)}</select></label><label>To qubit <select value={target} onChange={e=>{const v=Number(e.target.value);setTarget(v);if(v===source)setSource((v+1)%8);}}>{nodes.map((_,i)=><option key={i} value={i}>q{i}</option>)}</select></label></div><p>The copper path illustrates shortest connectivity, not the compiler's actual SWAP schedule or a physical-device execution.</p></div><div className="topology-foot"><span className="status-led"/> SIMULATED CONNECTIVITY <span>NOT AN IBM DEVICE MAP</span></div></div><div className="hardware-snapshot"><div className="hardware-stat-block"><span className="detail-kicker">MEAN COMPILED CX GATES</span><strong>{data.cx.toFixed(2)}</strong><p>Same-level all-to-all reference: {baseline.cx.toFixed(2)} CX (level {opt})</p></div><div className="hardware-two"><div><span className="detail-kicker">COMPILED DEPTH</span><strong>{data.depth.toFixed(2)}</strong></div><div><span className="detail-kicker">RELATIVE CX COUNT</span><strong>{(data.cx/baseline.cx).toFixed(2)}×</strong></div></div><div className="hardware-insight"><Icon name="layers" size={24}/><div><strong>{topology==='unrestricted'?'All-to-all reference':opt===2?'Optimization reduces compiled gate cost':'Routing adds gates on limited connectivity'}</strong><p>{topology==='unrestricted'?'The compiler allows direct interactions between any qubit pair.':opt===2?`At level 2, CX count is ${formatPct(reduction,1)} lower than level 0 for this topology and depth.`:'Level 0 shows the unoptimized routing overhead. Select level 2 to see gate-count reductions.'}</p></div></div></div></section>
    <section className="panel topology-comparison"><div className="panel-head"><div><span className="panel-index">02 / COMPILATION COST</span><h2>Compare connectivity</h2></div><DataTag>PHASE 06B · 20 VALIDATION GRAPHS</DataTag></div><div className="topology-bars">{comparison.map(x=><div className="topology-bar-row" key={x.name}><span>{x.name==='unrestricted'?'All-to-all':x.name[0].toUpperCase()+x.name.slice(1)}</span><div className="topology-bar-track"><span className={topology===x.name?'active-bar':''} style={{width:`${100*x.value/max}%`}}/></div><strong>{x.value.toFixed(2)} <small>CX</small></strong></div>)}</div><p className="panel-footnote">Values are mean Qiskit-compiled CX counts across 20 validation graphs. The relative count compares against all-to-all at the SAME optimization level and QAOA depth. This study did not execute routed circuits under device-calibrated noise.</p></section>
    <section className="hardware-explainer"><div><Eyebrow>03 / WHY THE COMPILER MATTERS</Eyebrow><h2>BETWEEN ALGORITHM<br/>AND <em>ARCHITECTURE.</em></h2></div><p>A QAOA cost layer couples qubits associated with graph edges. When a target device lacks a direct connection, the transpiler introduces routing operations. Those operations can increase the physical error exposure beyond what an ideal connectivity model predicts.</p></section>
    <div className="next-route"><div><Eyebrow>FINAL MODULE</Eyebrow><h2>Read the protocol behind every number.</h2></div><a href="#/methodology" className="next-route-link">View methodology</a></div>
  </main>;
}
