import { dragSettings, type DragTarget } from './drag';
import { useRef, type PointerEvent as ReactPointerEvent, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { degrees, objectPoints, reflectionPath, type Point } from './geometry';
export type Display = { real: boolean; virtual: boolean; normal: boolean; incidence: boolean; reflection: boolean; image: boolean };
export interface Settings { distance: number; height: number; eyeHeight: number; eyeDistance: number; mirrorHeight: number }
export const initialSettings: Settings = { distance: 110, height: 165, eyeHeight: 135, eyeDistance: 175, mirrorHeight: 170 };
const X = (x: number) => 420 + x * 1.55;
const Y = (y: number) => 365 - y * 1.55;
export function getPaths(s: Settings) { return objectPoints(s.distance, s.height).map(p => ({ name: p.name, ...reflectionPath(p, { x: -s.eyeDistance, y: s.eyeHeight }, { x: 0, bottom: 105 - s.mirrorHeight / 2, top: 105 + s.mirrorHeight / 2 }) })); }
export default function Diagram({ settings: s, display: d, step, selected, onSelect, onSettingsChange }: { settings: Settings; display: Display; step: number; selected: number; onSelect: (index: number) => void; onSettingsChange: (patch:Partial<Settings>) => void }) {
  const drag = useRef<{id:number;point:DOMPoint;settings:Settings;target:DragTarget} | null>(null);
  const svgPoint = (event: ReactPointerEvent<SVGSVGElement>) => {
    const matrix = event.currentTarget.getScreenCTM();
    return matrix ? new DOMPoint(event.clientX,event.clientY).matrixTransform(matrix.inverse()) : null;
  };
  const startDrag = (event: ReactPointerEvent<SVGSVGElement>) => {
    if(drag.current || event.button !== 0 || !(event.target instanceof Element))return;
    const target=event.target.closest('[data-drag]')?.getAttribute('data-drag') as DragTarget | null;
    const point=svgPoint(event); if(!target || !point)return;
    event.preventDefault();
    drag.current={id:event.pointerId,point,settings:{...s},target};
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const moveDrag = (event: ReactPointerEvent<SVGSVGElement>) => {
    const active=drag.current; if(!active || active.id!==event.pointerId)return;
    const point=svgPoint(event); if(!point)return;
    onSettingsChange(dragSettings(active.settings,active.target,(point.x-active.point.x)/1.55,(point.y-active.point.y)/1.55));
  };
  const endDrag = (event: ReactPointerEvent<SVGSVGElement>) => {
    if(drag.current?.id!==event.pointerId)return;
    drag.current=null;
    if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId);
  };
  const keyboardDrag = (event: ReactKeyboardEvent<SVGGElement>, target:DragTarget) => {
    const directions:Record<string,[number,number]>={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};
    const direction=directions[event.key]; if(!direction)return;
    event.preventDefault();event.stopPropagation();
    const amount=event.shiftKey?10:1;
    onSettingsChange(dragSettings(s,target,direction[0]*amount,direction[1]*amount));
  };
  const paths = getPaths(s), current = paths[selected];
  const line = (a: Point, b: Point, className: string, marker?: string) => <line x1={X(a.x)} y1={Y(a.y)} x2={X(b.x)} y2={Y(b.y)} className={className} markerEnd={marker ? `url(#${marker})` : undefined} />;
  const angle = (p: Point, color: string, radius: number) => {
    const h = current.hit, a = Math.atan2(-(p.y-h.y), p.x-h.x), start = { x: X(h.x)-radius, y: Y(h.y) }, end = { x: X(h.x)+radius*Math.cos(a), y: Y(h.y)+radius*Math.sin(a) };
    return <path d={`M ${start.x} ${start.y} A ${radius} ${radius} 0 0 ${p.y > h.y ? 1 : 0} ${end.x} ${end.y}`} fill="none" stroke={color} strokeWidth="2.5" />;
  };
  const person = (x: number, ghost = false) => <g data-drag={ghost?'image':'object'} role="group" tabIndex={0} aria-label={ghost?'גרירת הדמות: מרחק וגובה':'גרירת העצם: מרחק וגובה'} onKeyDown={event=>keyboardDrag(event,ghost?'image':'object')} className={ghost ? 'person ghost' : 'person'}><rect x={X(x)-30} y={Y(s.height)-12} width="60" height={s.height*1.55+24} fill="transparent" stroke="none"/><circle cx={X(x)} cy={Y(s.height*.92)} r={s.height*.055*1.55}/><path d={`M ${X(x)} ${Y(s.height*.84)} L ${X(x)} ${Y(s.height*.44)} M ${X(x-18)} ${Y(s.height*.59)} L ${X(x)} ${Y(s.height*.76)} L ${X(x+18)} ${Y(s.height*.59)} M ${X(x-15)} ${Y(0)} L ${X(x)} ${Y(s.height*.44)} L ${X(x+15)} ${Y(0)}`} /></g>;
  return <svg onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag} onLostPointerCapture={endDrag} className="diagram" viewBox="0 0 840 435" role="group" aria-labelledby="diagram-title diagram-desc"><title id="diagram-title">מסלול האור במראה מישורית</title><desc id="diagram-desc">עצם משמאל, מראה במרכז ודמות מדומה מימין. קרניים אדומות פוגעות במראה וכחולות מוחזרות לעין. קווים מקווקווים הם המשכים גיאומטריים בלבד.</desc><defs><pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".8" fill="#d6e2e8"/></pattern>{['incoming','outgoing'].map((id,i)=><marker key={id} id={id} viewBox="0 0 10 10" refX="10" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill={i ? '#2273cb':'#db514e'}/></marker>)}</defs><rect width="840" height="435" fill="url(#grid)"/><rect x="424" width="416" height="385" fill="#e9f3f7" opacity=".55"/><text x="180" y="28" className="region-label">לפני המראה · אור אמיתי</text><text x="640" y="28" className="region-label">מאחורי המראה · המשך גיאומטרי</text><line x1="38" y1="366" x2="804" y2="366" stroke="#cbd9dd"/>
    {person(-s.distance)}{d.image && step >= 6 && person(s.distance,true)}
    {paths.map((p,i) => p.visible && <g key={p.name} opacity={i === selected ? 1 : .26}>{d.virtual && step >= 5 && line(p.hit,p.image,'ray virtual')}{d.real && step >= 2 && line(p.source,p.hit,'ray incident','incoming')}{d.real && step >= 4 && line(p.hit,p.eye,'ray reflected','outgoing')}</g>)}
    <rect x="420" y={Y(105+s.mirrorHeight/2)} width="7" height={s.mirrorHeight*1.55} rx="3" fill="#436878"/><line x1="419" x2="419" y1={Y(105+s.mirrorHeight/2)} y2={Y(105-s.mirrorHeight/2)} stroke="#82d5dc" strokeWidth="3"/><text x="420" y="414" className="svg-label">מראה</text>
    {current.visible && <>{d.normal && step >= 3 && <line x1="318" x2="464" y1={Y(current.hit.y)} y2={Y(current.hit.y)} className="normal"/>}{d.incidence && step >= 3 && angle(current.source,'#db514e',36)}{d.reflection && step >= 4 && angle(current.eye,'#2273cb',47)}</>}
    {paths.map((p,i)=><g key={p.name}><g data-drag="object" role="button" tabIndex={0} aria-label={`בחירת ${p.name}`} onClick={()=>onSelect(i)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onSelect(i)}}} className="point-button"><circle cx={X(p.source.x)} cy={Y(p.source.y)} r="12" fill="transparent"/><circle cx={X(p.source.x)} cy={Y(p.source.y)} r={i===selected?6:4} fill={i===selected?'#087d7c':'#fff'} stroke="#087d7c" strokeWidth="2"/></g>{d.image && step>=6 && <circle cx={X(p.image.x)} cy={Y(p.image.y)} r="4" fill="#83aeb3"/>}</g>)}
    <g data-drag="eye" className="eye-control" role="group" tabIndex={0} aria-label="גרירת העין: מרחק וגובה" onKeyDown={event=>keyboardDrag(event,'eye')} transform={`translate(${X(-s.eyeDistance)},${Y(s.eyeHeight)})`}><circle r="24" fill="transparent"/><ellipse rx="15" ry="9" fill="white" stroke="#203d51" strokeWidth="2"/><circle r="5" fill="#203d51"/><text y="-21" className="svg-label">עין</text></g><text x={X(-s.distance)} y="391" className="svg-label">עצם</text>{d.image&&step>=6&&<text x={X(s.distance)} y="391" className="svg-label">דמות מדומה</text>}
    <text x="180" y="418" className="distance-label">מרחק העצם: {s.distance} ס״מ</text>{d.image&&step>=6&&<text x="650" y="418" className="distance-label">מרחק הדמות: {s.distance} ס״מ</text>}
    <text x="26" y="56" className="angle-summary" textAnchor="start">{current.visible ? `${current.name}: ${d.incidence&&step>=3?`θᵢ = ${degrees(current.incidence).toFixed(1)}°`:''} ${d.reflection&&step>=4?`θᵣ = ${degrees(current.reflection).toFixed(1)}°`:''}` : 'הנקודה מחוץ לשדה הראייה'}</text>

    {([-s.distance,...(d.image&&step>=6?[s.distance]:[])]).map(x=><g key={x} data-drag="height" className="drag-handle vertical" role="slider" tabIndex={0} aria-label="גובה העצם" aria-valuemin={80} aria-valuemax={200} aria-valuenow={s.height} aria-orientation="vertical" onKeyDown={event=>keyboardDrag(event,'height')} transform={`translate(${X(x)},${Y(s.height)-18})`}><title>גררו לשינוי גובה העצם</title><circle r="16" fill="transparent"/><rect x="-13" y="-7" width="26" height="14" rx="7"/><path d="M -6 0 H 6"/></g>)}
    {(['mirror-top','mirror-bottom'] as const).map(target=><g key={target} data-drag={target} className="drag-handle vertical" role="slider" tabIndex={0} aria-label={target==='mirror-top'?'גובה המראה — קצה עליון':'גובה המראה — קצה תחתון'} aria-valuemin={20} aria-valuemax={200} aria-valuenow={s.mirrorHeight} aria-orientation="vertical" onKeyDown={event=>keyboardDrag(event,target)} transform={`translate(423,${Y(105+(target==='mirror-top'?1:-1)*s.mirrorHeight/2)})`}><title>גררו את קצה המראה לשינוי גובהה</title><circle r="19" fill="transparent"/><rect x="-12" y="-8" width="24" height="16" rx="5"/><path d="M -5 -2 H 5 M -5 2 H 5"/></g>)}
  </svg>;
}


