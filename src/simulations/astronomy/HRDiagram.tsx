import { useRef,useState,type PointerEvent } from 'react';
import ScienceRange from '../../components/ScienceRange';
import ScienceQuiz from '../../exercises/ScienceQuiz';
import { hrQuestions } from '../../data/astronomy';
import { clamp } from './physics';
import { HR_PLOT as P, HR_EXAMPLES, hrPosition,hrValues,stellarRadius,stellarLuminosity,starColor,hrChallenge } from './hrPhysics';

const fmt=(v:number)=>v.toLocaleString('he-IL',{maximumSignificantDigits:3});
const ticks=[-4,-2,0,2,4,6];
const mainSequence=[[40000,3e5],[25000,1e4],[10000,40],[5772,1],[4000,.1],[3000,.003],[2500,.0005]];
const sequence=mainSequence.map(([t,l])=>{const p=hrPosition(t,l);return p.x+','+p.y}).join(' ');
export default function HRDiagram(){
  const [temperature,setTemperature]=useState(5772),[logL,setLogL]=useState(0);
  const [regions,setRegions]=useState(true),[radiusLines,setRadiusLines]=useState(false);
  const [example,setExample]=useState('השמש');
  const luminosity=10**logL,radius=stellarRadius(temperature,luminosity),position=hrPosition(temperature,luminosity);
  const drag=useRef<number|null>(null);
  const [task,setTask]=useState(()=>hrChallenge(5772,1)),[answer,setAnswer]=useState(''),[checked,setChecked]=useState(false);
  const update=(t:number,l:number)=>{setTemperature(clamp(t,2500,40000));setLogL(clamp(Math.log10(l),-4,6));setExample('')};
  const fromPointer=(e:PointerEvent<SVGSVGElement>)=>{const matrix=e.currentTarget.getScreenCTM();if(!matrix)return;const p=new DOMPoint(e.clientX,e.clientY).matrixTransform(matrix.inverse());const v=hrValues(p.x,p.y);update(v.temperature,v.luminosity)};
  const finish=(e:PointerEvent<SVGSVGElement>)=>{if(drag.current!==e.pointerId)return;drag.current=null;if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId)};
  const numeric=Number(answer.replace(',','.'));
  const correct=answer.trim()!==''&&Number.isFinite(numeric)&&Math.abs(numeric/task.targetRadius-1)<=.03;
  const matched=Math.abs(temperature/task.temperature-1)<=.02&&Math.abs(luminosity/task.targetLuminosity-1)<=.04;
  const loadExample=(i:number)=>{const s=HR_EXAMPLES[i];update(s.temperature,s.luminosity);setExample(s.name)};
  const radiusMin=stellarRadius(temperature,1e-4),radiusMax=stellarRadius(temperature,1e6);
  const starSize=clamp(24+14*Math.log10(radius),4,95);
  return <>
    <div className="astro-workspace hr-workspace">
      <aside className="panel astro-lesson"><div className="eyebrow">מפת הכוכבים</div><h2>חם לא תמיד אומר מאיר יותר</h2><p>כל נקודה מייצגת כוכב. שמאלה — טמפרטורת פני שטח גבוהה יותר; למעלה — הספק קרינה כולל גדול יותר.</p><p><strong>הארה היא האנרגיה שהכוכב פולט בכל שנייה.</strong> זו אינה הבהירות הנראית מכדור הארץ, שתלויה גם במרחק.</p><div className="hr-star-preview"><svg viewBox="0 0 240 210" role="img" aria-label={'גודל סכמטי של כוכב ברדיוס '+fmt(radius)+' רדיוסי שמש'}><circle cx="120" cy="100" r={starSize} fill={starColor(temperature)}/></svg><strong>{fmt(radius)} רדיוסי שמש</strong><small>צבע מקורב · הגודל באיור דחוס ואינו בקנה מידה</small></div><p>{HR_EXAMPLES.find(s=>s.name===example)?.description??'נקודה חופשית: המיקום לבדו אינו קובע מסה, גיל או שלב חיים באופן חד־משמעי.'}</p></aside>
      <section className="panel astro-sim"><div className="sim-toolbar"><strong>דיאגרמת הרצשפרונג–ראסל</strong><button className="reset" onClick={()=>loadExample(0)}>↻ חזרה לשמש</button></div>
      <svg viewBox="0 0 760 535" className="hr-diagram" role="group" aria-label="דיאגרמת H–R אינטראקטיבית" onPointerDown={e=>{if(drag.current!==null||e.button!==0||!(e.target instanceof Element)||!e.target.closest('[data-hr-plot]'))return;e.preventDefault();drag.current=e.pointerId;e.currentTarget.setPointerCapture(e.pointerId);fromPointer(e)}} onPointerMove={e=>{if(drag.current===e.pointerId)fromPointer(e)}} onPointerUp={finish} onPointerCancel={finish} onLostPointerCapture={finish}>
        <defs><linearGradient id="hr-temperature"><stop stopColor="#3678aa" stopOpacity=".18"/><stop offset=".6" stopColor="#e9e5cd" stopOpacity=".04"/><stop offset="1" stopColor="#d37245" stopOpacity=".17"/></linearGradient><clipPath id="hr-clip"><rect x={P.left} y={P.top} width={P.width} height={P.height}/></clipPath></defs>
        <rect width="760" height="535" fill="#0b1b30"/>
        <rect x={P.left} y={P.top} width={P.width} height={P.height} fill="url(#hr-temperature)"/>
        {ticks.map(n=>{const y=hrPosition(5772,10**n).y;return <g key={n}><line x1={P.left} x2={P.left+P.width} y1={y} y2={y} stroke="#304457"/><text x={P.left-14} y={y+5} textAnchor="end" className="hr-tick">{fmt(10**n)}</text></g>})}
        {[40000,20000,10000,5000,2500].map(t=>{const x=hrPosition(t,1).x;return <g key={t}><line x1={x} x2={x} y1={P.top} y2={P.top+P.height} stroke="#304457"/><text x={x} y="459" textAnchor="middle" className="hr-tick">{t.toLocaleString('he-IL')}</text></g>})}
        <g clipPath="url(#hr-clip)" pointerEvents="none">
          {regions&&<><polyline points={sequence} fill="none" stroke="#7abaca" strokeWidth="42" opacity=".17" strokeLinejoin="round"/>
          <ellipse cx="570" cy="179" rx="110" ry="42" fill="#dfaa69" opacity=".15"/>
          <rect x="115" y="53" width="560" height="45" rx="18" fill="#cfba91" opacity=".12"/>
          <ellipse cx="360" cy="357" rx="112" ry="38" transform="rotate(22 360 357)" fill="#a5c8eb" opacity=".13"/>
          <text x="370" y="209" className="hr-region" textAnchor="middle" transform="rotate(31 370 209)">הסדרה הראשית</text><text x="570" y="185" className="hr-region" textAnchor="middle">ענקים אדומים</text><text x="395" y="82" className="hr-region" textAnchor="middle">על־ענקים</text><text x="345" y="365" className="hr-region" textAnchor="middle">ננסים לבנים</text></>}
          {radiusLines&&[.01,.1,1,10,100].map(r=>{const a=hrPosition(40000,stellarLuminosity(40000,r)),b=hrPosition(2500,stellarLuminosity(2500,r));return <line key={r} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#c5b89b" strokeWidth="1.5" strokeDasharray="6 6"/>})}
          <line x1={P.left} x2={position.x} y1={position.y} y2={position.y} stroke="#eaf3f9" strokeDasharray="3 5" opacity=".5"/><line x1={position.x} x2={position.x} y1={position.y} y2={P.top+P.height} stroke="#eaf3f9" strokeDasharray="3 5" opacity=".5"/>
        </g>
        <text x="395" y="26" textAnchor="middle" className="hr-axis">הארה ביחידות שמש (L☉) · גדלה כלפי מעלה ↑</text>
        <text x="395" y="492" textAnchor="middle" className="hr-axis">← חם יותר · טמפרטורת פני השטח (K) · קר יותר →</text>
        <text x="395" y="521" textAnchor="middle" className="hr-tick">שני הצירים לוגריתמיים · האזורים סכמטיים</text>
        <rect data-hr-plot="" x={P.left} y={P.top} width={P.width} height={P.height} fill="transparent"/>
        <g data-hr-plot="" role="button" tabIndex={0} aria-label="הכוכב הנגרר: חצים משנים טמפרטורה והארה" className="hr-grip" onKeyDown={e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();const step=e.shiftKey?.1:.02;update(temperature*10**(e.key==='ArrowLeft'?step:e.key==='ArrowRight'?-step:0),10**(logL+(e.key==='ArrowUp'?step:e.key==='ArrowDown'?-step:0)))}}>
          <circle cx={position.x} cy={position.y} r="23" fill="transparent"/><circle cx={position.x} cy={position.y} r="13" fill={starColor(temperature)} stroke="#fff" strokeWidth="2"/><circle cx={position.x} cy={position.y} r="19" fill="none" stroke="#fff" strokeOpacity=".4"/>
        </g>
      </svg>
      <div className="hr-options"><label><input type="checkbox" checked={regions} onChange={e=>setRegions(e.target.checked)}/> אזורי כוכבים</label><label><input type="checkbox" checked={radiusLines} onChange={e=>setRadiusLines(e.target.checked)}/> קווי רדיוס קבוע</label></div>
      {radiusLines&&<p className="interaction-note">הקווים המקווקווים, מלמטה למעלה באותה טמפרטורה: 0.01, 0.1, 1, 10, 100 רדיוסי שמש. חלק מהקווים מחוץ לטווח התצוגה.</p>}
      <p className="interaction-note">גררו את הכוכב או לחצו בתוך הגרף. במקלדת: חצים, ו־Shift לצעד גדול. גרירה חוקרת תכונות; היא אינה מריצה התפתחות כוכבית.</p></section>
    </div>
    <section className="panel astro-controls hr-controls">
      <ScienceRange label="טמפרטורת פני השטח" value={temperature} min={2500} max={40000} step={1} unit="K" format={v=>Math.round(v).toLocaleString('he-IL')} onChange={v=>update(v,luminosity)}/>
      <ScienceRange label="הארה — סולם לוגריתמי" value={logL} min={-4} max={6} step={.01} unit="L☉" format={v=>fmt(10**v)} onChange={v=>update(temperature,10**v)}/>
      <ScienceRange label="רדיוס — סולם לוגריתמי" value={Math.log10(radius)} min={Math.log10(radiusMin)} max={Math.log10(radiusMax)} step={.01} unit="R☉" format={v=>fmt(10**v)} onChange={v=>update(temperature,stellarLuminosity(temperature,10**v))}/>
    </section><p className="interaction-note">שינוי טמפרטורה שומר על ההארה ומחשב רדיוס מחדש. שינוי רדיוס שומר על הטמפרטורה ומעדכן את ההארה. שלושת המשתנים מקיימים תמיד את אותה נוסחה.</p>
    <div className="mass-examples"><span>נקודות לדוגמה:</span>{HR_EXAMPLES.map((s,i)=><button key={s.name} aria-pressed={example===s.name} onClick={()=>loadExample(i)}>{s.name}</button>)}</div>
    <section className="panel jeans-lesson"><div className="eyebrow">הקשר בין טמפרטורה, גודל והארה</div><h2>איך כוכב קר יכול להאיר בעוצמה?</h2><p>ההארה תלויה גם בשטח הפנים וגם בטמפרטורה. כוכב גדול וקר יכול לפלוט יותר אנרגיה מכוכב קטן וחם.</p><div className="formula normalized" dir="ltr"><span>L / L☉ = (R / R☉)²</span><span>· (T / 5772 K)⁴</span></div><div className="formula normalized" dir="ltr"><span>R / R☉ = √(L / L☉)</span><span>· (5772 K / T)²</span></div><p><bdi>L</bdi> — הספק הקרינה הכולל; <bdi>R</bdi> — רדיוס; <bdi>T</bdi> — טמפרטורה אפקטיבית של פני השטח. הסימן ☉ מציין יחידות שמש. זו צורתו היחסית של חוק סטפן–בולצמן: <bdi>L = 4πR²σT⁴</bdi>.</p>
      <div className="jeans-exercise"><h3>אתגר: חשבו רדיוס ובדקו בגרף</h3><p>התחלה: <strong>{fmt(task.temperature)} K</strong>, הארה <strong>{fmt(task.luminosity)} L☉</strong> ורדיוס <strong>{fmt(task.radius)} R☉</strong>. {task.targetLuminosity>task.luminosity?'הגדילו':'הקטינו'} את ההארה פי 4 בלי לשנות טמפרטורה. מה יהיה הרדיוס החדש?</p><p>חשבו תחילה, ואז הזיזו את הכוכב אנכית או גררו את בקרת ההארה אל <strong>{fmt(task.targetLuminosity)} L☉</strong>. השאלה נשארת קבועה בזמן הניסוי.</p>
      <div className="jeans-answer"><label>הרדיוס שחישבתם ביחידות שמש<input inputMode="decimal" value={answer} onChange={e=>{setAnswer(e.target.value);setChecked(false)}}/></label><button className="primary-button" onClick={()=>setChecked(true)}>בדוק חישוב וניסוי</button><button className="subtle-button" onClick={()=>{setTask(hrChallenge(temperature,luminosity));setAnswer('');setChecked(false)}}>תרגיל מהערכים הנוכחיים</button></div>
      <p>דיוק מתקבל: 3% בתשובה, 2% בטמפרטורה ו־4% בהארה.</p>
      {checked&&<div className="jeans-feedback" role="status">{!correct?<p>נסו שוב: בטמפרטורה קבועה, הרדיוס יחסי לשורש ההארה. שינוי ההארה פי 4 משנה את הרדיוס פי 2.</p>:!matched?<p>החישוב נכון! כעת כוונו את הסימולציה להארה {fmt(task.targetLuminosity)} ולטמפרטורה {fmt(task.temperature)} K כדי להשלים את הניסוי.</p>:<p>נכון — החישוב והניסוי תואמים! הרדיוס החדש הוא {fmt(task.targetRadius)} רדיוסי שמש.</p>}</div>}
      </div>
    </section>
    <details className="model-notes panel"><summary>מה הדיאגרמה מלמדת ומה היא מפשטת?</summary><p>האזורים והדוגמאות, למעט נקודת הייחוס של השמש, סכמטיים ואינם קטלוג מדידות. חקר חופשי מאפשר גם שילובים שאינם כוכבים יציבים בטבע. אין כאן חישוב מסה, גיל, הרכב כימי או מסלול התפתחות. הצבע להמחשה בלבד, והאיור הצדדי אינו מציג יחס גדלים אמיתי.</p><p><a href="https://openstax.org/books/astronomy-2e/pages/18-4-the-h-r-diagram" target="_blank" rel="noreferrer">הסבר ודוגמאות: OpenStax ↗</a></p></details>
    <div className="existing-resource"><div><strong>מדמה קיים: אוניברסיטת נברסקה</strong><p>דיאגרמת H–R עם אזורים, קווי רדיוס ודגימות כוכבים. באנגלית. המודול כאן נכתב עצמאית עם הסברים ותרגול בעברית.</p></div><a className="resource-link" href="https://astro.unl.edu/smartphone/hrdiagram/" target="_blank" rel="noreferrer">פתיחת המדמה הקיים ↗</a></div>
    <ScienceQuiz questions={hrQuestions}/>
  </>;
}

