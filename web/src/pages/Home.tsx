import { useState } from 'react';
import OrbCanvas from '../components/OrbCanvas';
import { ButtonLink, Eyebrow, Icon } from '../components/UI';
import { researchStats } from '../data';

type Focus = 'circuit'|'noise'|'hardware';
const modes:{key:Focus;tag:string;description:string;number:string}[] = [
  {key:'circuit',tag:'Circuit architecture',description:'Explore how QAOA turns graph problems into quantum circuits.',number:'01'},
  {key:'noise',tag:'Noise sensitivity',description:'Measure the point where extra depth becomes a liability.',number:'02'},
  {key:'hardware',tag:'Hardware topology',description:'See how physical connectivity changes compilation cost.',number:'03'},
];
export default function Home(){
  const [focus,setFocus]=useState<Focus>('circuit');
  const active=modes.find(m=>m.key===focus)!;
  return <main>
    <section className="home-hero">
      <div className="hero-grid-overlay"/>
      <div className="hero-corner tl"/><div className="hero-corner tr"/><div className="hero-corner bl"/><div className="hero-corner br"/>
      <div className="hero-inner">
        <div className="hero-copy">
          <Eyebrow light>Quantum research / 2026</Eyebrow>
          <h1>WHEN<br/><em>DEPTH</em><br/>MEETS<br/>NOISE<span className="hero-dot">.</span></h1>
          <p className="hero-subtitle">An interactive atlas of quantum optimization, circuit complexity, and the decisions that emerge between them.</p>
          <div className="hero-buttons"><ButtonLink to="#/explore">Enter the explorer</ButtonLink><a className="hero-text-link" href="#/methodology">Read the research <Icon name="arrow" size={18}/></a></div>
        </div>
        <div className="hero-visual">
          <div className="sphere-label sphere-label-top"><span className="label-line"/>SYS / QAOA-01 <span className="tiny-pulse"/></div>
          <OrbCanvas mode={focus}/>
          <div className="sphere-label sphere-label-bottom">SIMULATED STATE SPACE <span className="sphere-line"/> QUBIT NETWORK</div>
          <div className="sphere-coordinates">40° 31′ 04″ / 11:01</div>
          <div className="sphere-crosshair cross-a">+</div><div className="sphere-crosshair cross-b">+</div>
        </div>
        <div className="hero-rail"><span>RESEARCH ATLAS</span><div className="rail-line"/><span>VOL. 001 — QISKIT</span></div>
      </div>
      <div className="hero-bottom">
        <div className="hero-bottom-left"><span className="status-led"/> SYSTEM STATUS <span>RESEARCH PREVIEW / PRECOMPUTED DATA</span></div>
        <div className="hero-mode-picker" role="group" aria-label="Choose visualization focus">{modes.map(m=><button type="button" key={m.key} onClick={()=>setFocus(m.key)} aria-pressed={focus===m.key} className={focus===m.key?'active':''}><span>{m.number}</span> {m.tag}</button>)}</div>
      </div>
    </section>

    <section className="home-intro layout-container">
      <div className="home-intro-head"><Eyebrow>01 / The investigation</Eyebrow><span className="mini-index">QOL — 001 / 006</span></div>
      <div className="intro-body"><h2>More qubits. More gates.<br/><span>More questions.</span></h2><div className="intro-side"><p>QAOA uses deeper circuits to explore candidate solutions. But each extra layer introduces operations that can fail under noise. QuantumOptLab explores where the tradeoff changes—and what that means for quantum optimization.</p><a href="#/benchmarks" className="inline-link">Examine the evidence <Icon name="arrowup" size={16}/></a></div></div>
      <div className="metrics-row">
        <div className="metric-item"><div className="metric-number">{researchStats.totalGraphs}</div><div className="metric-title">Graph instances</div><p>Across generated benchmark families</p></div>
        <div className="metric-item"><div className="metric-number">{researchStats.lockedTestAerRuns}</div><div className="metric-title">Locked-test Aer executions</div><p>Across 20 previously reserved graphs</p></div>
        <div className="metric-item"><div className="metric-number">{researchStats.compiledCircuits}</div><div className="metric-title">Compiled circuits</div><p>Topology and optimization study</p></div>
      </div>
    </section>

    <section className="feature-slab">
      <div className="layout-container">
        <div className="feature-heading"><Eyebrow light>02 / Research modules</Eyebrow><h2>EXPLORE THE<br/><i>QUANTUM SYSTEM.</i></h2><p>{active.description}</p></div>
        <div className="feature-cards">
          <a href="#/explore" className="feature-card"><div className="feature-card-meta"><span>FIELD NOTE / 01</span><Icon name="arrowup" size={18}/></div><div className="feature-symbol symbol-circuit"><span>H</span><span>ZZ</span><span>RX</span><span className="symbol-line"/></div><div><h3>Quantum explorer</h3><p>Inspect Max-Cut graphs, toggle cut assignments, and understand QAOA's logical circuit structure.</p></div><span className="feature-card-cta">Explore circuits <Icon name="arrow" size={16}/></span></a>
          <a href="#/benchmarks" className="feature-card"><div className="feature-card-meta"><span>FIELD NOTE / 02</span><Icon name="arrowup" size={18}/></div><div className="feature-symbol symbol-wave"><svg viewBox="0 0 210 110" aria-hidden="true"><path d="M5 72 C36 10 72 31 100 58 S160 122 205 42" fill="none" stroke="#b9e7df" strokeWidth="2"/><path d="M5 26 C36 45 72 22 100 39 S160 50 205 86" fill="none" stroke="#d9b08c" strokeWidth="2"/><path d="M5 92H205" stroke="#b9e7df" opacity=".2"/></svg></div><div><h3>Noise & benchmarks</h3><p>Compare measured depth tradeoffs, confidence intervals, and the frozen model's test outcome.</p></div><span className="feature-card-cta">See the evidence <Icon name="arrow" size={16}/></span></a>
          <a href="#/hardware" className="feature-card"><div className="feature-card-meta"><span>FIELD NOTE / 03</span><Icon name="arrowup" size={18}/></div><div className="feature-symbol symbol-nodes"><span/><span/><span/><span/><span/><svg viewBox="0 0 210 110"><path d="M23 53L68 29 111 69 157 32 190 72" fill="none" stroke="#b9e7df" strokeWidth="1.4"/></svg></div><div><h3>Hardware topology</h3><p>Explore how constrained qubit connections increase compiled two-qubit gate counts.</p></div><span className="feature-card-cta">View topologies <Icon name="arrow" size={16}/></span></a>
        </div>
      </div>
    </section>

    <section className="takeaway-section layout-container">
      <div className="takeaway-orbit"><span className="orbit-a"/><span className="orbit-b"/><span className="orbit-core"/></div>
      <div><Eyebrow>03 / The honest finding</Eyebrow><h2>WHAT THE EXPERIMENTS<br/><span>REVEALED.</span></h2><p>On the reserved test graphs, simple noise-aware rules achieved better cost-adjusted utility than the trained Random Forest. This result is part of the evidence, alongside the quantum noise and circuit-routing studies.</p><ButtonLink to="#/benchmarks" secondary>Inspect the locked test</ButtonLink></div>
    </section>
    <section className="home-footer-band"><div className="layout-container"><div><Eyebrow light>RESEARCH / OPEN FOR INSPECTION</Eyebrow><h2>Curiosity, <i>compiled.</i></h2></div><ButtonLink to="#/methodology">Explore methodology</ButtonLink></div></section>
  </main>;
}
