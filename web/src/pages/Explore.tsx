import { useMemo, useState } from 'react';
import { graphs, type Depth, type GraphDefinition, formatPct } from '../data';
import { DataTag, Eyebrow, Icon, Segmented } from '../components/UI';
import QAOACircuit from '../components/QAOACircuit';

const positions:Record<number,{x:number;y:number}[]>={
  4:[{x:27,y:26},{x:73,y:26},{x:73,y:75},{x:27,y:75}],
  5:[{x:19,y:32},{x:63,y:16},{x:85,y:55},{x:53,y:84},{x:15,y:78}],
  6:[{x:24,y:22},{x:52,y:11},{x:83,y:33},{x:79,y:75},{x:46,y:88},{x:14,y:62}],
};
function CutGraph({graph,assignment,onToggle}:{graph:GraphDefinition;assignment:number[];onToggle:(i:number)=>void}){
  const pts=positions[graph.nodes];
  return <div className="cut-graph"><div className="graph-grid"/><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" className="edge-layer">
    {graph.edges.map(([u,v,w])=>{const a=pts[u],b=pts[v],crossing=assignment[u]!==assignment[v];return <g key={`${u}-${v}`}><line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={crossing?'#e3b18c':'#43756c'} strokeWidth={crossing?.53:.28} strokeDasharray={crossing?undefined:'1.2 1.2'}/>{w>1&&<><circle cx={(a.x+b.x)/2} cy={(a.y+b.y)/2} r="2.4" fill="#102c2b" stroke="#658a82" strokeWidth=".35"/><text x={(a.x+b.x)/2} y={(a.y+b.y)/2+.9} textAnchor="middle" fontSize="2.4" fill="#f3d6b0">{w}</text></>}</g>})}
  </svg>
    {pts.map((p,i)=><button type="button" key={i} aria-label={`Node ${i}: group ${assignment[i]===0?'A':'B'}. Activate to switch groups.`} aria-pressed={assignment[i]===1} title={`Node ${i}, group ${assignment[i]===0?'A':'B'} — click to change`} onClick={()=>onToggle(i)} className={`graph-node ${assignment[i]?'graph-node-warm':'graph-node-mint'}`} style={{left:`${p.x}%`,top:`${p.y}%`}}><span>{i}</span></button>)}
    <div className="graph-legend"><span><i className="legend-node-a"/> Group A / 0</span><span><i className="legend-node-b"/> Group B / 1</span><span><i className="legend-edge"/> Crossing edge</span></div>
  </div>;
}
export default function Explore(){
  const [graphId,setGraphId]=useState(graphs[0].id);
  const [depth,setDepth]=useState<Depth>(2);
  const [assignment,setAssignment]=useState<number[]>([0,1,0,1]);
  const graph=graphs.find(g=>g.id===graphId)!;
  const current=useMemo(()=>graph.edges.reduce((acc,[u,v,w])=>acc+(assignment[u]!==assignment[v]?w:0),0),[graph,assignment]);
  const crossings=graph.edges.filter(([u,v])=>assignment[u]!==assignment[v]).length;
  const changeGraph=(id:typeof graphId)=>{setGraphId(id);const n=graphs.find(g=>g.id===id)!.nodes;setAssignment(Array.from({length:n},(_,i)=>i%2));};
  const reset=()=>setAssignment(Array.from({length:graph.nodes},()=>0));
  const q=graph.qaoa[depth];
  return <main className="inside-page layout-container explorer-v2">
    <div className="page-intro compact-page-intro"><Eyebrow>QUANTUM EXPLORER / 01</Eyebrow><h1>FROM A GRAPH<br/><em>TO A CIRCUIT.</em></h1><p>Start with a weighted Max-Cut problem. Explore its classical partitions, then inspect a separately saved Qiskit QAOA experiment and its actual two-qubit gate structure.</p></div>
    <div className="workspace-toolbar"><div><label className="control-label" htmlFor="graph-select">PROBLEM GRAPH</label><div className="select-wrap"><select id="graph-select" value={graphId} onChange={e=>changeGraph(e.target.value as typeof graphId)}>{graphs.map(g=><option key={g.id} value={g.id}>{g.label} · {g.nodes} qubits</option>)}</select><Icon name="chevron" size={16}/></div></div><div><span className="control-label">QAOA DEPTH</span><Segmented options={[{value:1 as Depth,label:'p = 1'},{value:2 as Depth,label:'p = 2'}]} value={depth} onChange={setDepth}/></div><div className="workspace-toolbar-status"><span className="status-led"/> PHASE 02 · SAVED QISKIT RESULTS</div></div>
    <div className="explorer-grid">
      <section className="panel graph-panel live-workbench" aria-label="Interactive classical Max-Cut workbench">
        <div className="panel-head"><div><span className="panel-index">01 / LIVE CLASSICAL INTERACTION</span><h2>Find the best partition</h2></div><button onClick={reset} className="reset-button" type="button"><Icon name="reset" size={15}/> Reset nodes</button></div>
        <p className="panel-context">Click any vertex to switch its group. Only the score in this panel updates.</p>
        <CutGraph graph={graph} assignment={assignment} onToggle={i=>setAssignment(old=>old.map((x,j)=>j===i?1-x:x))}/>
        <div className="graph-score-grid" aria-live="polite"><div><span>YOUR WEIGHTED CUT</span><strong>{current}<small> / {graph.optimum}</small></strong></div><div><span>BEST POSSIBLE</span><strong>{graph.optimum}</strong></div><div><span>CROSSING EDGES</span><strong>{crossings}<small> of {graph.edges.length}</small></strong></div></div>
        <p className="panel-footnote">This is a local classical scoring tool. It does not run a quantum circuit or modify the saved QAOA outcome.</p>
      </section>
      <div className="explorer-side">
        <section className="panel result-panel saved-result" aria-label="Saved ideal QAOA result"><div className="panel-head"><div><span className="panel-index">02 / FROZEN QUANTUM SIMULATION</span><h2>QAOA · depth {depth}</h2></div><DataTag>QISKIT SNAPSHOT</DataTag></div>
          <div className="result-lede"><span className="data-origin">NOT A LIVE RESULT</span><p>These values were calculated in Phase 2 with optimized QAOA angles. Choosing a graph or depth changes the snapshot; clicking vertices does not.</p></div>
          <div className="huge-percent">{formatPct(q.expected/graph.optimum)}<small> expected approximation ratio</small></div><div className="result-track"><span style={{width:formatPct(q.expected/graph.optimum)}}/></div>
          <div className="result-rows"><div><span>Expected weighted cut</span><b>{q.expected.toFixed(4)}</b></div><div><span>Probability of optimal bitstring</span><b>{formatPct(q.success)}</b></div><div><span>Exact classical optimum</span><b>{graph.optimum}</b></div></div>
          <p className="panel-footnote">Source: Phase 2 ideal-statevector optimization, seed 31. No hardware run.</p></section>
      </div>
    </div>
    <section className="objective-v2" aria-labelledby="maxcut-heading">
      <div className="objective-editorial"><Eyebrow>03 / MATHEMATICAL OBJECTIVE</Eyebrow><h2 id="maxcut-heading">The weighted<br/><em>Max-Cut problem.</em></h2><p>Assign each vertex to one of two groups. An edge contributes its weight only when its endpoints belong to different groups. The goal is to maximize the total weight of those crossing edges.</p><div className="objective-micro"><span>{graph.nodes} vertices</span><span>{graph.edges.length} edges</span><span>Binary assignment</span></div></div>
      <div className="objective-math-panel"><span className="data-origin">FORMAL OBJECTIVE / MAXIMIZE</span>
        <div className="maxcut-math" role="math" aria-label="maximize over binary vertex assignments x, the sum across graph edges of edge weight times the absolute difference between endpoint assignments"><span className="maxcut-max">max<small>x ∈ {'{0,1}'}<sup>|V|</sup></small></span><span className="maxcut-sum">∑<small>(i,j) ∈ E</small></span><span className="maxcut-equation">w<sub>ij</sub> |x<sub>i</sub> − x<sub>j</sub>|</span></div>
        <div className="math-glossary"><div><strong>x<sub>i</sub> ∈ {'{0,1}'}</strong><span>Group assigned to vertex i</span></div><div><strong>w<sub>ij</sub></strong><span>Weight of the edge between i and j</span></div><div><strong>|x<sub>i</sub> − x<sub>j</sub>|</strong><span>1 when groups differ; 0 otherwise</span></div></div>
        <div className="math-takeaway"><Icon name="info" size={19}/><span>Try changing a node above: the weighted score increases only when the total crossing-edge weight increases.</span></div>
      </div>
    </section>
    <section className="panel circuit-panel" aria-labelledby="circuit-heading"><div className="panel-head"><div><span className="panel-index">04 / QISKIT CIRCUIT ANATOMY</span><h2 id="circuit-heading">From the objective to gates</h2></div><DataTag>{depth} QAOA LAYER{depth===1?'':'S'}</DataTag></div><QAOACircuit graph={graph} depth={depth}/></section>
    <div className="next-route"><div><Eyebrow>CONTINUE THE EXPLORATION</Eyebrow><h2>What happens when those gates become noisy?</h2></div><a href="#/benchmarks" className="next-route-link">Investigate noise</a></div>
  </main>;
}
