import { useEffect, useState } from 'react';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Benchmarks from './pages/Benchmarks';
import Hardware from './pages/Hardware';
import Methodology from './pages/Methodology';
import { Icon } from './components/UI';

type Page='home'|'explore'|'benchmarks'|'hardware'|'methodology';
const routes:{id:Page;label:string;hash:string}[]=[
  {id:'home',label:'Home',hash:'#/'},
  {id:'explore',label:'Explorer',hash:'#/explore'},
  {id:'benchmarks',label:'Benchmarks',hash:'#/benchmarks'},
  {id:'hardware',label:'Hardware',hash:'#/hardware'},
  {id:'methodology',label:'Methodology',hash:'#/methodology'},
];
const currentPage=():Page => {
  const path=window.location.hash.replace(/^#\/?/,'').split(/[/?]/)[0];
  return (routes.find(r=>r.id===path)?.id ?? 'home');
};
export default function App(){
  const [page,setPage]=useState<Page>(currentPage());
  const [menuOpen,setMenuOpen]=useState(false);
  useEffect(()=>{
    const onHash=()=>{setPage(currentPage());setMenuOpen(false);window.scrollTo({top:0,behavior:'instant'});};
    window.addEventListener('hashchange',onHash);return()=>window.removeEventListener('hashchange',onHash);
  },[]);
  return <div className="app-shell">
    <header className="site-header">
      <a className="brand" href="#/" aria-label="QuantumOptLab home"><span className="brand-symbol"><Icon name="atom" size={24}/></span><span>QUANTUM<span className="brand-lighter">OPT</span>LAB<span className="brand-sup">®</span></span></a>
      <nav className={`site-nav ${menuOpen?'nav-open':''}`} aria-label="Primary navigation">{routes.map(r=><a href={r.hash} className={page===r.id?'nav-active':''} key={r.id} aria-current={page===r.id?'page':undefined}>{r.label}</a>)}</nav>
      <div className="header-right"><span className="header-status"><i/> QISKIT RESEARCH</span><a className="header-button" href="#/explore">Enter lab</a></div>
      <button className="mobile-nav-toggle" type="button" aria-label={menuOpen?'Close menu':'Open menu'} aria-expanded={menuOpen} onClick={()=>setMenuOpen(!menuOpen)}><Icon name={menuOpen?'close':'menu'} size={22}/></button>
    </header>
    {page==='home'&&<Home/>}
    {page==='explore'&&<Explore/>}
    {page==='benchmarks'&&<Benchmarks/>}
    {page==='hardware'&&<Hardware/>}
    {page==='methodology'&&<Methodology/>}
    <footer className="site-footer"><div className="footer-top"><a href="#/" className="footer-brand"><Icon name="atom" size={24}/> QUANTUMOPTLAB</a><div className="footer-links"><a href="#/explore">Explorer</a><a href="#/benchmarks">Benchmarks</a><a href="#/hardware">Hardware</a><a href="#/methodology">Methodology</a></div></div><div className="footer-bottom"><span>© 2026 QUANTUMOPTLAB / RESEARCH PREVIEW</span><span>BUILT ON QISKIT · DATA FROZEN FROM EXECUTED NOTEBOOKS · NO QUANTUM ADVANTAGE CLAIMED</span><a href="#/" onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}>Back to top</a></div></footer>
  </div>;
}
