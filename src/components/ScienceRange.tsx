import { useRef, type PointerEvent } from 'react';
import { clamp } from '../simulations/astronomy/physics';
export default function ScienceRange({label,value,min,max,step=1,unit='',format,onChange,disabled=false}:{label:string;value:number;min:number;max:number;step?:number;unit?:string;format?:(value:number)=>string;onChange:(value:number)=>void;disabled?:boolean}) {
  const drag=useRef<{id:number;x:number;value:number}|null>(null);
  const snap=(v:number)=>clamp(Number((Math.round(v/step)*step).toFixed(6)),min,max);
  const end=(e:PointerEvent<HTMLOutputElement>)=>{if(drag.current?.id!==e.pointerId)return;drag.current=null;if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId)};
  return <label className="science-range"><span>{label}<output title="גררו ימינה או שמאלה לשינוי הערך" className="draggable-value" onPointerDown={e=>{if(disabled||e.button!==0||drag.current)return;e.preventDefault();drag.current={id:e.pointerId,x:e.clientX,value};e.currentTarget.setPointerCapture(e.pointerId)}} onPointerMove={e=>{const d=drag.current;if(!d||d.id!==e.pointerId)return;onChange(snap(d.value+(e.clientX-d.x)*(max-min)/260))}} onPointerUp={end} onPointerCancel={end} onLostPointerCapture={end}><bdi>{format?format(value):value.toLocaleString('he-IL',{maximumFractionDigits:2})} {unit}</bdi> ↔</output></span><input type="range" dir="ltr" disabled={disabled} min={min} max={max} step={step} value={value} onChange={e=>onChange(Number(e.target.value))}/></label>;
}

