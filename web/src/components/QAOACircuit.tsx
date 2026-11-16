import { useEffect, useMemo, useState } from 'react';
import { type Depth, type GraphDefinition } from '../data';
import { Segmented } from './UI';

type View = 'qiskit'|'structure';

/** Accurate gate topology: each RZZ connects TWO qubit wires, in Phase 2 edge order. */
function ExactGateStructure({graph,depth}:{graph:GraphDefinition;depth:Depth}){
  const row=61, pad=65, h=graph.nodes*row+75;
  const step=60, initX=80;
  const layers=Array.from({length:depth},(_,l)=>l);
  const layerWidth=(graph.edges.length+1)*step+16;
  const x0=initX+step;
  const right=x0+depth*layerWidth+65;
  const y=(i:number)=>pad+i*row;
  const gates=layers.flatMap(l=>graph.edges.map(([u,v,w],e)=>({u,v,w,x:x0+l*layerWidth+e*step, l, e})));
  const lastLayerX=(l:number)=>x0+l*layerWidth+graph.edges.length*step;
  return <div className="circuit-horizontal" tabIndex={0} role="region" aria-label="Scrollable, edge-accurate QAOA gate structure">
    <svg className="accurate-circuit" viewBox={`0 0 ${right} ${h}`} width={right} height={h} role="img" aria-label={`QAOA depth ${depth}: ${graph.nodes} Hadamard gates, ${graph.edges.length*depth} two-qubit RZZ gates, ${graph.nodes*depth} RX gates, followed by measurement`}>
      {Array.from({length:graph.nodes},(_,i)=><g key={'wire'+i}>
        <text x="12" y={y(i)+5} fill="#b2ded2" fontSize="13" fontFamily="monospace">q{i}</text>
        <path d={`M45 ${y(i)} H${right-10}`} stroke="#4d7b72" strokeWidth="1"/>
        <rect x="76" y={y(i)-17} width="34" height="34" rx="3" fill="#164742" stroke="#7ecabe"/>
        <text x="93" y={y(i)+5} fill="#d9f1e9" fontSize="15" textAnchor="middle" fontFamily="monospace">H</text>
        {layers.map(l=><g key={l}><rect x={lastLayerX(l)-21} y={y(i)-17} width="42" height="34" rx="3" fill="#195d54" stroke="#93dbce"/><text x={lastLayerX(l)} y={y(i)+4} textAnchor="middle" fill="#e5f8ee" fontSize="12" fontFamily="monospace">RX</text></g>)}
        <rect x={right-52} y={y(i)-17} width="34" height="34" rx="3" fill="#293e3b" stroke="#b6c9c2"/>
        <text x={right-35} y={y(i)+5} fill="#ecf7f1" textAnchor="middle" fontSize="13">M</text>
      </g>)}
      {gates.map(g=><g key={`${g.l}-${g.e}`}>
        <path d={`M${g.x} ${y(g.u)} V${y(g.v)}`} stroke="#d9b08c" strokeWidth="2.1"/>
        {[g.u,g.v].map((idx,j)=><circle key={j} cx={g.x} cy={y(idx)} r="6" fill="#102928" stroke="#ffc99a" strokeWidth="2"/>)}
        <rect x={g.x-15} y={(y(g.u)+y(g.v))/2-11} width="30" height="21" rx="3" fill="#44382e" stroke="#d9b08c"/>
        <text x={g.x} y={(y(g.u)+y(g.v))/2+4} textAnchor="middle" fontSize="12" fill="#ffcb9a" fontFamily="monospace">ZZ</text>
        <text x={g.x} y={pad-43} fill="#c9a782" fontSize="11" textAnchor="middle" fontFamily="monospace">{g.w>1?`w${g.w}`:''}</text>
      </g>)}
      {layers.map(l=><text key={'label'+l} x={x0+l*layerWidth+(graph.edges.length-1)*step/2} y="15" textAnchor="middle" fill="#8dbeb1" fontSize="13" fontFamily="monospace">LAYER {l+1} · RZZ(-wγ{l+1}) / RX(2β{l+1})</text>)}
    </svg>
  </div>;
}
export default function QAOACircuit({graph,depth}:{graph:GraphDefinition;depth:Depth}){
  const [view,setView]=useState<View>('qiskit');
  const [available,setAvailable]=useState<boolean|null>(null);
  const url=useMemo(()=>`${import.meta.env.BASE_URL}circuits/${graph.id}_p${depth}.svg`,[graph.id,depth]);
  useEffect(()=>setAvailable(null),[url]);
  return <div className="circuit-v2">
    <div className="circuit-view-head"><div><span className="data-origin">GATE-LEVEL IMPLEMENTATION</span><p>Each weighted edge becomes one two-qubit RZZ gate per layer. RX mixes each qubit afterward.</p></div><Segmented value={view} onChange={setView} options={[{value:'qiskit' as const,label:'Qiskit output'},{value:'structure' as const,label:'Structure view'}]}/></div>
    {view==='qiskit'?<>
      {available!==false?<div className="circuit-horizontal circuit-export" tabIndex={0} role="region" aria-label="Scrollable Qiskit-generated quantum circuit"><img key={url} src={url} alt={`Authentic Qiskit text circuit exported from Phase 2 gate construction for ${graph.label}, p=${depth}`} onLoad={()=>setAvailable(true)} onError={()=>setAvailable(false)}/></div>:
      <><ExactGateStructure graph={graph} depth={depth}/><div className="circuit-export-notice"><strong>Qiskit export not generated yet.</strong> The accurate structure view is shown. Run <code>python web/scripts/export_qiskit_circuits.py</code> from the project root and refresh to see Qiskit's authoritative circuit drawing.</div></>}
    </>:<ExactGateStructure graph={graph} depth={depth}/>}
    <div className="circuit-legend-v2"><span><i className="key-zz"/> RZZ: two-qubit cost interaction</span><span><i className="key-rx"/> RX: mixer</span><span>H: initial superposition</span><span>M: measurement</span></div>
    <p className="circuit-foot-v2">Parameter notation is symbolic and preserves the original Phase 2 gate order; the displayed circuit is not hardware-transpiled. Swipe or scroll horizontally to inspect all gates.</p>
  </div>;
}
