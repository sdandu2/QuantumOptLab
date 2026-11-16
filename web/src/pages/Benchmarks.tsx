import { useState } from 'react';
import { Eyebrow, DataTag, Icon, Segmented } from '../components/UI';
import { noiseStudy, policies, selectorIntervals, formatPct } from '../data';

type Metric='utility'|'ratio'|'cx';
const metricInfo:Record<Metric,{label:string;min:number;max:number;format:(v:number)=>string;isHighGood:boolean}>={
  utility:{label:'Mean decision utility',min:0,max:0.8,format:v=>v.toFixed(4),isHighGood:true},
  ratio:{label:'Approximation ratio',min:0,max:1,format:v=>formatPct(v,2),isHighGood:true},
  cx:{label:'Mean CX gates',min:0,max:70,format:v=>v.toFixed(1),isHighGood:false},
};
const plotW=800,plotH=298,margin={left:62,right:34,top:28,bottom:49};
const xFor=(v:number)=>margin.left+(v/.1)*(plotW-margin.left-margin.right);
const yFor=(v:number)=>{const min=-.035,max=.14;return plotH-margin.bottom-(v-min)/(max-min)*(plotH-margin.top-margin.bottom);};
function NoiseCurve({selected}:{selected:number}){
  const guide=noiseStudy.map((d,i)=>`${i?'L':'M'}${xFor(d.cx)} ${yFor(d.benefit)}`).join(' ');
  return <div className="chart-wrap"><svg viewBox={`0 0 ${plotW} ${plotH}`} role="img" aria-label="Four measured CX noise settings. Each point shows the mean depth-two advantage with a vertical 95 percent graph bootstrap interval; values are linked by a guide line only." className="research-chart">
    {[-.02,0,.04,.08,.12].map(t=><g key={t}><line x1={margin.left} x2={plotW-margin.right} y1={yFor(t)} y2={yFor(t)} className={t===0?'zero-grid':'chart-gridline'}/><text x={margin.left-12} y={yFor(t)+4} textAnchor="end" className="chart-tick">{(t*100).toFixed(0)}pp</text></g>)}
    {[0,.02,.05,.1].map(t=><g key={t}><line x1={xFor(t)} x2={xFor(t)} y1={margin.top} y2={plotH-margin.bottom} className="chart-gridline vertical-grid"/><text x={xFor(t)} y={plotH-20} textAnchor="middle" className="chart-tick">{Math.round(t*100)}%</text></g>)}
    <path d={guide} fill="none" stroke="#85bcb0" strokeWidth="1.6" strokeDasharray="5 7" opacity=".7"/>
    {noiseStudy.map(d=><g key={d.cx}>
      <line x1={xFor(d.cx)} x2={xFor(d.cx)} y1={yFor(d.low)} y2={yFor(d.high)} stroke="#b1dfd3" strokeWidth="2.4"/>
      <line x1={xFor(d.cx)-9} x2={xFor(d.cx)+9} y1={yFor(d.low)} y2={yFor(d.low)} stroke="#b1dfd3" strokeWidth="2.4"/>
      <line x1={xFor(d.cx)-9} x2={xFor(d.cx)+9} y1={yFor(d.high)} y2={yFor(d.high)} stroke="#b1dfd3" strokeWidth="2.4"/>
      <circle cx={xFor(d.cx)} cy={yFor(d.benefit)} r={selected===d.cx?7:5} fill={selected===d.cx?'#ffcb9a':'#8bdccb'} stroke="#082320" strokeWidth="2"/>
      <text x={xFor(d.cx)+10} y={yFor(d.high)-10} className="point-annotation">{d.cx===selected ? `${(d.benefit*100).toFixed(2)}pp` : ''}</text>
    </g>)}
    <text x={plotW/2} y={plotH-1} textAnchor="middle" className="chart-axis-title">CX depolarizing parameter</text>
  </svg></div>;
}
function PolicyBars({metric}:{metric:Metric}){
  const info=metricInfo[metric];
  const reference=policies.find(p=>p.id==='gate')![metric];
  const refX=100*(reference-info.min)/(info.max-info.min);
  return <div className="policy-list dot-policy-list">
    <div className="dotplot-axis"><span>{metric==='cx'?'0 gates':'0.0'}</span><span>{metric==='cx'?'35 gates':'0.4 / 40%'}</span><span>{metric==='cx'?'70 gates':'0.8 / 80%'}</span></div>
    {[...policies].sort((a,b)=>info.isHighGood?b[metric]-a[metric]:a[metric]-b[metric]).map((p,i)=>{const val=p[metric];const x=Math.max(0,Math.min(100,100*(val-info.min)/(info.max-info.min)));
      return <div className="policy-row policy-dot-row" key={p.id}><div className="policy-name"><span className="policy-rank">{String(i+1).padStart(2,'0')}</span><span>{p.name}</span>{p.id==='forest'&&<span className="tiny-model-tag">LEARNED</span>}</div><div className="policy-track dot-track"><span className="baseline-reference" style={{left:`${refX}%`}}/><span className={`policy-dot ${p.id==='forest'?'dot-forest':p.id==='gate'?'dot-best':''}`} style={{left:`${x}%`}} title={`${p.name}: ${info.format(val)}`}/></div><div className="policy-value">{info.format(val)}</div></div>})}
    <p className="dotplot-caption">Dot positions use a shared zero-based scale ({metric==='cx'?'0 to 70 CX gates':metric==='utility'?'0 to 0.8 decision utility':'0 to 100% approximation ratio'}). Dashed marker = gate-budget reference. Differences are deliberately not magnified.</p>
    <p className="panel-footnote">{metric==='utility'?'Utility = approximation ratio − 0.0005 × compiled CX gates. Higher is better.':metric==='ratio'?'Mean sampled approximation ratios. Higher is better.':'Mean compiled CX counts. Lower is better.'} Oracle is a hindsight upper bound, not a deployable method.</p>
  </div>;
}
export default function Benchmarks(){
  const [selected,setSelected]=useState(.05);
  const [metric,setMetric]=useState<Metric>('utility');
  const point=noiseStudy.find(v=>v.cx===selected)!;
  return <main className="inside-page layout-container">
    <div className="page-intro benchmark-page-intro"><Eyebrow>INTERACTIVE MODULE / 02</Eyebrow><h1>NOISE, DEPTH<br/><em>AND THE EVIDENCE.</em></h1><p>Compare four measured noise settings and inspect the locked-test result. Everything shown below is drawn from executed research notebooks—not a live simulation.</p></div>
    <div className="research-notice"><Icon name="info" size={18}/><p><strong>Reading the evidence:</strong> simulated noise only; 20 validation graphs for the depth-benefit curve, and a separate 20-graph locked test for policy comparison. No quantum advantage is claimed.</p><DataTag>RESEARCH SNAPSHOT / SEED 31</DataTag></div>
    <section className="panel chart-panel"><div className="panel-head"><div><span className="panel-index">01 / PHASE 04 · VALIDATION GRAPHS</span><h2>Where depth stops helping</h2></div><DataTag>95% GRAPH BOOTSTRAP CI</DataTag></div><div className="chart-layout"><div className="chart-main"><div className="chart-overline"><span className="swatch swatch-mint"/> p=2 minus p=1 <span className="swatch swatch-ci"/> 95% interval · measured points</div><NoiseCurve selected={selected}/></div><aside className="chart-detail"><span className="detail-kicker">SELECTED NOISE CONDITION</span><div className="detail-big">{Math.round(selected*100)}<span>%</span></div><div className="detail-sub">CX depolarizing parameter</div><div className="detail-rule"/><span className="detail-kicker">DEPTH-2 ADVANTAGE</span><div className={`detail-delta ${point.benefit<0?'detail-negative':''}`}>{point.benefit>=0?'+':''}{(point.benefit*100).toFixed(2)}<span> pp</span></div><div className="detail-note">95% CI: {(point.low*100).toFixed(2)} to {(point.high*100).toFixed(2)} pp</div><div className="detail-rule"/><span className="detail-kicker">VALIDATION GRAPHS FAVORING P=2</span><div className="detail-percentage">{formatPct(point.p2Share,0)}</div><div className="noise-picks">{noiseStudy.map(d=><button key={d.cx} type="button" onClick={()=>setSelected(d.cx)} className={selected===d.cx?'selected':''} aria-label={`Choose ${(d.cx*100).toFixed(0)} percent noise`}>{Math.round(d.cx*100)}%</button>)}</div></aside></div></section>
    <section className="findings-strip"><div><span className="finding-mark">01</span><h3>More depth helps when errors are low.</h3><p>At 0% synthetic CX noise, p=2 had an 8.54 percentage-point mean advantage.</p></div><div><span className="finding-mark">02</span><h3>The advantage steadily erodes.</h3><p>By 5% noise, the 95% interval includes zero; the direction is no longer established.</p></div><div><span className="finding-mark">03</span><h3>A learned rule isn't automatically better.</h3><p>The frozen Random Forest underperformed both simple adaptive rules on the final test.</p></div></section>
    <section className="panel policy-panel"><div className="panel-head"><div><span className="panel-index">02 / PHASE 06A · LOCKED TEST</span><h2>The model against its baselines</h2></div><div className="policy-controls"><Segmented options={[{value:'utility' as Metric,label:'Utility'},{value:'ratio' as Metric,label:'Approx. ratio'},{value:'cx' as Metric,label:'CX gates'}]} value={metric} onChange={setMetric}/></div></div><div className="policy-insight"><span className="insight-pip"/><strong>On the primary utility metric, the gate-budget rule finished first among deployable policies.</strong><span>The Random Forest achieved 0.7051 utility; differences from baselines are small in absolute terms.</span></div><PolicyBars metric={metric}/></section>
    <section className="paired-section"><div className="paired-copy"><Eyebrow>03 / CONFIDENCE IN THE CONCLUSION</Eyebrow><h2>A NEGATIVE RESULT<br/><em>IS STILL A RESULT.</em></h2><p>These paired bootstrap intervals measure the frozen Random Forest's utility gain over other policies across the final 20 graph instances. Negative differences mean the forest performed worse.</p><a className="inline-link" href="#/methodology">Read evaluation protocol <Icon name="arrowup" size={16}/></a></div><div className="paired-table"><div className="table-head"><span>COMPARED WITH</span><span>GAIN</span><span>95% INTERVAL</span></div>{selectorIntervals.map(r=><div className="table-row" key={r.compared}><span>{r.compared}</span><strong className={r.gain<0?'warm-ink':''}>{r.gain>=0?'+':''}{r.gain.toFixed(5)}</strong><span>{r.low.toFixed(5)} / {r.high.toFixed(5)}</span></div>)}<p>Intervals against both simple adaptive rules exclude zero. The frozen learned selector did not demonstrate a generalizable improvement.</p></div></section>
    <div className="next-route"><div><Eyebrow>NEXT MODULE</Eyebrow><h2>Every logical gate meets a physical constraint.</h2></div><a href="#/hardware" className="next-route-link">Explore routing <Icon name="arrow" size={20}/></a></div>
  </main>;
}
