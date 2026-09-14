import { lazy, Suspense, useEffect, useState } from 'react';
import { topics } from './data/topics';
import PlaneMirror from './simulations/plane-mirror/PlaneMirror';
import AstronomyCatalog from './simulations/astronomy/AstronomyCatalog';
import './simulations/astronomy/astronomy.css';
const StarFormation=lazy(()=>import('./simulations/astronomy/StarFormation'));
const BlackHoleFormation=lazy(()=>import('./simulations/astronomy/BlackHoleFormation'));
const HRDiagram=lazy(()=>import('./simulations/astronomy/HRDiagram'));
type Route='optics'|'astronomy'|'star-formation'|'black-hole'|'hr';
const routes:Route[]=['optics','astronomy','star-formation','black-hole','hr'];
function routeFromHash():Route|null {const value=window.location.hash.slice(1);return routes.includes(value as Route)?value as Route:null}
export default function App() {
  const [route,setRoute]=useState<Route>(()=>routeFromHash()??'optics');
  useEffect(()=>{const handler=()=>{const next=routeFromHash();if(next)setRoute(next)};window.addEventListener('hashchange',handler);return()=>window.removeEventListener('hashchange',handler)},[]);
  useEffect(()=>{document.title=({'optics':'מראה מישורית','astronomy':'אסטרונומיה','star-formation':'היווצרות כוכב','black-hole':'היווצרות חור שחור','hr':'דיאגרמת H–R'}[route])+' | מעבדת פיזיקה'},[route]);
  const navigate=(next:Route)=>{setRoute(next);window.location.hash=next;window.scrollTo({top:0,behavior:'instant'})};
  const astro=route!=='optics';
  return <><header className="site-header"><a className="brand" href="#optics" onClick={e=>{e.preventDefault();navigate('optics')}}><span className="brand-mark">✳</span> מעבדת פיזיקה</a><span className="header-note">מגלים. משנים. מבינים.</span>{route!=='astronomy'&&<a href="#practice" className="header-link" onClick={e=>{e.preventDefault();document.getElementById('practice')?.scrollIntoView({behavior:'smooth'})}}>לתרגול עצמי ←</a>}</header><main><nav className="topics" aria-label="תחומי הפיזיקה">{topics.map(t=><button key={t.name} className={'topic '+((t.name==='אופטיקה'&&!astro||t.name==='אסטרונומיה'&&astro)?'active':'')} disabled={!t.available} aria-pressed={t.available?(t.name==='אסטרונומיה'?astro:!astro):undefined} onClick={()=>navigate(t.name==='אסטרונומיה'?'astronomy':'optics')}><span className="topic-icon">{t.icon}</span><span>{t.name}</span>{!t.available&&<small>בהמשך</small>}{t.name==='אסטרונומיה'&&<small>חדש</small>}</button>)}</nav>{route==='optics'?<><section className="intro" id="lab"><div><div className="eyebrow">אופטיקה גיאומטרית / מעבדה 01</div><h1>מה באמת רואים במראה?</h1><p>שנו את הניסוי וגלו איך אור יוצר דמות מדומה.</p></div><span className="module-badge">מראה מישורית · חוק ההחזרה</span></section><PlaneMirror/></>:route==='astronomy'?<AstronomyCatalog onOpen={navigate}/>:<><div className="astro-breadcrumb"><button onClick={()=>navigate('astronomy')}>→ לכל נושאי האסטרונומיה</button><button onClick={()=>navigate(route==='star-formation'?'black-hole':'star-formation')}>{route==='star-formation'?'למעבדת החור השחור':'למעבדת היווצרות כוכב'} ←</button></div><section className="intro astro-intro"><div><div className="eyebrow">אסטרונומיה / {route==='hr'?'מעבדה 04':route==='star-formation'?'מעבדה 02':'מעבדה 03'}</div><h1>{route==='hr'?'מה אפשר ללמוד ממפת הכוכבים?':route==='star-formation'?'איך נולד כוכב?':'מתי גוף הופך לחור שחור?'}</h1><p>{route==='hr'?'גררו כוכב וגלו את הקשר בין טמפרטורה, הארה ורדיוס.':route==='star-formation'?'בדקו מתי כבידה גוברת על לחץ הגז.':'שנו מסה ורדיוס וגלו את גבול אופק האירועים.'}</p></div><span className="module-badge">מודל לימודי · בקרות נגררות</span></section><Suspense fallback={<p role="status">טוענים את המעבדה…</p>}>{route==='hr'?<HRDiagram/>:route==='star-formation'?<StarFormation/>:<BlackHoleFormation/>}</Suspense></>}</main><footer>מעבדת פיזיקה <span>לומדים דרך התנסות</span></footer></>;
}


