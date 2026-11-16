import { useEffect, useRef } from 'react';

type Vec = [number, number, number];
const normalize = (a:Vec):Vec => {const l=Math.hypot(...a);return [a[0]/l,a[1]/l,a[2]/l];};
function mesh() {
  const t=(1+Math.sqrt(5))/2;
  const verts:Vec[] = [[-1,t,0],[1,t,0],[-1,-t,0],[1,-t,0],[0,-1,t],[0,1,t],[0,-1,-t],[0,1,-t],[t,0,-1],[t,0,1],[-t,0,-1],[-t,0,1]].map(v=>normalize(v as Vec));
  const faces = [[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]];
  const cache=new Map<string,number>();
  const mid=(a:number,b:number)=> { const k=[a,b].sort((x,y)=>x-y).join('_');if(cache.has(k))return cache.get(k)!;
    const v=normalize([(verts[a][0]+verts[b][0])/2,(verts[a][1]+verts[b][1])/2,(verts[a][2]+verts[b][2])/2]);verts.push(v);cache.set(k,verts.length-1);return verts.length-1;};
  const subdivided:number[][]=[];
  faces.forEach(([a,b,c])=>{const ab=mid(a,b),bc=mid(b,c),ca=mid(c,a);subdivided.push([a,ab,ca],[b,bc,ab],[c,ca,bc],[ab,bc,ca]);});
  const edgeSet=new Set<string>();
  subdivided.forEach(([a,b,c])=>[[a,b],[b,c],[c,a]].forEach(([i,j])=>edgeSet.add([i,j].sort((x,y)=>x-y).join('_'))));
  return {verts,edges:[...edgeSet].map(x=>x.split('_').map(Number))};
}
const sphere=mesh();

export default function OrbCanvas({ mode='circuit' }:{mode?:'circuit'|'noise'|'hardware'}) {
  const canvas=useRef<HTMLCanvasElement>(null);
  const pointer=useRef({x:0,y:0});
  useEffect(()=>{
    const el=canvas.current;if(!el)return;
    const ctx=el.getContext('2d');if(!ctx)return;
    let frame=0,raf=0,w=0,h=0,dpr=1;
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const resize=()=>{const r=el.getBoundingClientRect();w=r.width;h=r.height;dpr=Math.min(2,window.devicePixelRatio||1);el.width=Math.ceil(w*dpr);el.height=Math.ceil(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);};
    const ro=new ResizeObserver(resize);ro.observe(el);resize();
    const onMove=(e:PointerEvent)=>{const b=el.getBoundingClientRect();pointer.current={x:((e.clientX-b.left)/b.width-.5)*2,y:((e.clientY-b.top)/b.height-.5)*2};};
    const onLeave=()=>{pointer.current={x:0,y:0};};
    el.addEventListener('pointermove',onMove);el.addEventListener('pointerleave',onLeave);
    const draw=()=>{
      ctx.clearRect(0,0,w,h);
      const cx=w*.51,cy=h*.505,r=Math.min(w*.41,h*.435);
      const rad=ctx.createRadialGradient(cx-r*.18,cy-r*.2,r*.06,cx,cy,r*1.3);
      rad.addColorStop(0,'rgba(22,103,101,.14)');rad.addColorStop(.53,'rgba(12,62,66,.22)');rad.addColorStop(.82,'rgba(6,26,31,.05)');rad.addColorStop(1,'rgba(6,26,31,0)');
      ctx.fillStyle=rad;ctx.beginPath();ctx.arc(cx,cy,r*1.3,0,Math.PI*2);ctx.fill();
      const halo=ctx.createRadialGradient(cx-r*.29,cy-r*.3,r*.2,cx,cy,r*1.06);
      halo.addColorStop(0,'rgba(218,171,133,.07)');halo.addColorStop(.45,'rgba(25,105,105,.18)');halo.addColorStop(.83,'rgba(18,104,108,.10)');halo.addColorStop(1,'rgba(106,223,218,.025)');
      ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fillStyle=halo;ctx.fill();
      ctx.save();ctx.translate(cx,cy);ctx.rotate(-.22);ctx.scale(1,.72);
      for(const [radius,stroke,blur] of [[r*1.10,'rgba(109,228,223,.27)',20],[r*.965,'rgba(218,178,145,.27)',16],[r*1.22,'rgba(115,211,208,.10)',6]] as const){
        ctx.beginPath();ctx.arc(0,0,radius,0,Math.PI*2);ctx.lineWidth=radius===r*1.10?1.6:1;ctx.strokeStyle=stroke;ctx.shadowColor=stroke;ctx.shadowBlur=blur;ctx.stroke();
      }ctx.restore();
      const time = reduced ? .35 : frame*.0031;
      const yaw=time+pointer.current.x*.26, pitch=-.19+Math.sin(time*.32)*.12-pointer.current.y*.16;
      const points=sphere.verts.map(([x,y,z])=>{
        const ax=x*Math.cos(yaw)+z*Math.sin(yaw),az=-x*Math.sin(yaw)+z*Math.cos(yaw);
        const ay=y*Math.cos(pitch)-az*Math.sin(pitch),bz=y*Math.sin(pitch)+az*Math.cos(pitch);
        const perspective=2.9/(2.9-bz*.22);
        return {x:cx+ax*r*.91*perspective,y:cy+ay*r*.91*perspective,z:bz};
      });
      const ordered=sphere.edges.map(([i,j])=>({a:points[i],b:points[j],z:(points[i].z+points[j].z)/2})).sort((a,b)=>a.z-b.z);
      for(const {a,b,z} of ordered){
        ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);
        const front=Math.max(0,(z+1)/2);
        ctx.lineWidth=.6+front*.85;
        ctx.strokeStyle= mode==='noise' ? `rgba(244,188,143,${.08+front*.47})` : `rgba(115,226,217,${.09+front*.39})`;
        ctx.stroke();
      }
      for(let i=0;i<points.length;i++){
        const p=points[i];if(p.z<-.22)continue;
        const front=Math.max(0,(p.z+1)/2);
        const hot=(i===4||i===12||i===17||i===28||i===32);
        const pulse=(Math.sin(time*2+i*1.4)+1)/2;
        ctx.beginPath();ctx.arc(p.x,p.y,hot?2.2+2.1*pulse:1.15+front*.8,0,Math.PI*2);
        ctx.fillStyle=hot?'rgba(255,207,155,.90)':`rgba(167,249,239,${.28+front*.67})`;
        if(hot){ctx.shadowColor='#ffcb9a';ctx.shadowBlur=18;}else{ctx.shadowColor='transparent';ctx.shadowBlur=0;}ctx.fill();ctx.shadowBlur=0;
      }
      // A pair of radiant research 'interference' paths, inspired by quantum phase visualization.
      const connectors=[[4,17],[12,32],[10,25]];
      for(let i=0;i<connectors.length;i++){
        const [a,b]=connectors[i],p=points[a],q=points[b];
        if(p.z<0||q.z<0)continue;
        ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);
        ctx.lineWidth=1.7;ctx.strokeStyle=i===1?'rgba(255,205,155,.72)':'rgba(170,255,246,.68)';
        ctx.shadowColor=i===1?'#ffcb9a':'#9efff2';ctx.shadowBlur=13;ctx.stroke();ctx.shadowBlur=0;
      }
      ctx.beginPath();ctx.arc(cx,cy,r*.98,0,Math.PI*2);ctx.strokeStyle='rgba(149,225,217,.12)';ctx.lineWidth=1;ctx.stroke();
      // Fine measurement tick marks around the sphere.
      ctx.strokeStyle='rgba(170,237,231,.16)';ctx.lineWidth=.75;
      for(let i=0;i<48;i++){let a=i*Math.PI/24;let s=r*1.095;ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*s,cy+Math.sin(a)*s);ctx.lineTo(cx+Math.cos(a)*(s+(i%4===0?7:3)),cy+Math.sin(a)*(s+(i%4===0?7:3)));ctx.stroke();}
      if(!reduced){frame++;raf=requestAnimationFrame(draw);}
    };
    draw();
    return()=>{cancelAnimationFrame(raf);ro.disconnect();el.removeEventListener('pointermove',onMove);el.removeEventListener('pointerleave',onLeave);};
  },[mode]);
  return <canvas ref={canvas} className="orb-canvas" aria-label="Animated geodesic quantum-network sphere visualization" role="img"/>;
}
