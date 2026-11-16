import type { ReactNode } from 'react';
export function Icon({name,size=18,className=''}:{name:string;size?:number;className?:string}){
  const common={fill:'none',stroke:'currentColor',strokeWidth:1.6,strokeLinecap:'round' as const,strokeLinejoin:'round' as const};
  const paths:Record<string,ReactNode>={
    arrow:<><path d="M4 12h16m-6-6 6 6-6 6"/></>,
    arrowup:<><path d="M7 17 17 7M8 7h9v9"/></>,
    chevron:<><path d="m9 18 6-6-6-6"/></>,
    play:<><path d="m8 5 12 7-12 7z"/></>,
    info:<><circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-8h.01"/></>,
    sliders:<><path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="2" fill="#071b1b"/><circle cx="16" cy="17" r="2" fill="#071b1b"/></>,
    layers:<><path d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5"/></>,
    atom:<><circle cx="12" cy="12" r="2"/><ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(45 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(-45 12 12)"/></>,
    menu:<><path d="M4 7h16M4 12h16M4 17h16"/></>,
    close:<><path d="M5 5 19 19M19 5 5 19"/></>,
    check:<><path d="m4 12 5 5L20 6"/></>,
    graph:<><circle cx="4" cy="6" r="2"/><circle cx="20" cy="7" r="2"/><circle cx="12" cy="19" r="2"/><path d="m6 7 12 0M5 8l6 9M19 9l-6 8"/></>,
    pulse:<><path d="M2 12h4l3-8 5 16 3-8h5"/></>,
    reset:<><path d="M20 11a8 8 0 1 1-2-5.5"/><path d="M20 3v5h-5"/></>
  };
  return <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true" {...common}>{paths[name]||paths.atom}</svg>;
}
export function Eyebrow({children,light=false}:{children:ReactNode;light?:boolean}){return <div className={`eyebrow${light?' eyebrow-light':''}`}><span className="eyebrow-square"/>{children}</div>}
export function ButtonLink({to,children,secondary=false}:{to:string;children:ReactNode;secondary?:boolean}){return <a className={`btn ${secondary?'btn-ghost':'btn-primary'}`} href={to}>{children}<Icon name="arrowup" size={17}/></a>}
export function SectionHeading({kicker,title,desc}:{kicker:string;title:ReactNode;desc?:ReactNode}){return <div className="section-heading"><Eyebrow>{kicker}</Eyebrow><h2>{title}</h2>{desc&&<p>{desc}</p>}</div>}
export function Segmented<T extends string|number>({options,value,onChange}:{options:{value:T;label:string}[];value:T;onChange:(v:T)=>void}){
  return <div className="segmented" role="group" aria-label="Select display mode">{options.map(o=><button key={o.value} className={o.value===value?'is-active':''} onClick={()=>onChange(o.value)} type="button" aria-pressed={o.value===value}>{o.label}</button>)}</div>;
}
export function DataTag({children}:{children:ReactNode}){return <span className="data-tag">{children}</span>}
