import { useState } from 'react';
import { cloudModel, densityChallenge } from './physics';

const number = (v:number) => v.toLocaleString('he-IL',{maximumFractionDigits:2});
export default function JeansLesson({mass,density}:{mass:number;density:number}) {
  const [task,setTask]=useState(()=>densityChallenge(mass,density));
  const [answer,setAnswer]=useState(''),[prediction,setPrediction]=useState(''),[checked,setChecked]=useState(false);
  const current=cloudModel(mass,density);
  const numeric=Number(answer.replace(',','.'));
  const correct=answer.trim()!==''&&Number.isFinite(numeric)&&Math.abs(numeric/task.expectedMass-1)<=.02;
  const predicted=prediction===(task.mass>task.expectedMass?'yes':'no');
  const matched=Math.abs(density/task.targetDensity-1)<=.03&&Math.abs(mass-task.mass)<.001;
  const restart=()=>{setTask(densityChallenge(mass,density));setAnswer('');setPrediction('');setChecked(false)};
  return <section className="panel jeans-lesson">
    <div className="eyebrow">מבינים, מחשבים, בודקים</div>
    <h2>מה זו מסת ג׳ינס?</h2>
    <p>הכבידה מושכת את הגז פנימה; התנועה התרמית של החלקיקים יוצרת לחץ שמתנגד לדחיסה. <strong>מסת ג׳ינס היא המסה הקריטית שמעליה לחץ הגז אינו מספיק למנוע קריסה במודל.</strong> בענן קר וצפוף קל יותר לכבידה להתגבר על הלחץ.</p>
    <div className="jeans-formulas">
      <div><h3>תנאי לתחילת קריסה</h3><div className="formula" dir="ltr">M &gt; M<sub>J</sub></div><p>משווים את מסת מקטע הענן לסף. בשוויון נמצאים בגבול; מתחת לסף אין אי־יציבות ג׳ינס במודל.</p></div>
      <div><h3>מסת ג׳ינס</h3><div className="formula" dir="ltr">M<sub>J</sub> = (π<sup>5/2</sup> / 6) · c<sub>s</sub><sup>3</sup> / √(G<sup>3</sup>ρ)</div><div className="formula small-formula" dir="ltr">c<sub>s</sub> = √(k<sub>B</sub>T / (μm<sub>p</sub>))</div></div>
    </div>
    <p className="formula-key"><bdi>M</bdi> — מסת הענן; <bdi>ρ</bdi> — צפיפות מסה; <bdi>c<sub>s</sub></bdi> — מהירות הקול בגז; <bdi>T</bdi> — טמפרטורה; <bdi>G</bdi> — קבוע הכבידה; <bdi>k<sub>B</sub></bdi> — קבוע בולצמן; <bdi>m<sub>p</sub></bdi> — מסת פרוטון; <bdi>μ = 2.33</bdi> — מסת חלקיק ממוצעת ביחידות מסת פרוטון.</p>
    <p>בבקרה משנים צפיפות מספרית <bdi>n</bdi> (חלקיקים בסמ״ק), ולא צפיפות מסה. ממירים ליחידות SI בעזרת <bdi dir="ltr">ρ = 10⁶nμm<sub>p</sub></bdi>. לחישוב נוח במסות שמש:</p>
    <div className="formula normalized" dir="ltr"><span>M<sub>J</sub> ≈ 0.91 M☉</span><span> · (T / 10 K)<sup>3/2</sup></span><span> · (n / 100,000 cm⁻³)<sup>−1/2</sup></span></div>
    <p>כאן הטמפרטורה ההתחלתית קבועה: <bdi>10 K</bdi>. לכן הגדלת הצפיפות פי 4 מקטינה את מסת ג׳ינס פי 2. הגדלת מסת הענן אינה משנה את הסף, אבל עשויה להעביר את הענן מעליו.</p>
    <div className="jeans-live"><strong>במצב הנוכחי:</strong> מסה {number(mass)} מסות שמש; מסת ג׳ינס {current.jeansMassSolar.toFixed(2)} מסות שמש. {current.unstable?'המסה מעל הסף — הקריסה יכולה להתחיל.':'המסה אינה מעל הסף — אין קריסה במודל.'}</div>
    <p>במהלך ההתכווצות משתחררת אנרגיית כבידה וחלקה מחמם את הגז. בהמשך עשוי להיווצר פרוטו־כוכב, ואם הליבה מגיעה לתנאים מתאימים — מתחיל היתוך מימן מתמשך. נוסחת ג׳ינס בודקת את אי־היציבות ההתחלתית; היא אינה מחשבת את כל התהליך.</p>
    <div className="jeans-exercise">
      <h3>אתגר חישובי: חזו ואז הזיזו</h3>
      <p>התרגיל נוצר מהבקרות ונשאר קבוע בזמן הניסוי. לחצו על ״תרגיל מהערכים הנוכחיים״ כדי ליצור שאלה חדשה.</p>
      <p>נתוני ההתחלה: מסה <strong>{number(task.mass)} מסות שמש</strong>, צפיפות <strong>{number(task.density)} חלקיקים בסמ״ק</strong>, ומסת ג׳ינס <strong>{task.initialMass.toFixed(3)} מסות שמש</strong>.</p>
      <ol><li>{task.factor===4?'הגדילו':'הקטינו'} את הצפיפות פי 4, ל־<strong>{number(task.targetDensity)} חלקיקים בסמ״ק</strong>. חשבו מראש את מסת ג׳ינס החדשה, בלי לשנות את המסה.</li><li>הזינו תשובה ותחזית לקריסה, ואז גררו את בקרת הצפיפות למעלה אל ערך היעד.</li></ol>
      <p className="formula small-formula" dir="ltr">M<sub>J,2</sub> = M<sub>J,1</sub> · √(n₁ / n₂)</p>
      <div className="jeans-answer"><label>מסת ג׳ינס שחישבתם (מסות שמש)<input type="text" inputMode="decimal" value={answer} onChange={e=>{setAnswer(e.target.value);setChecked(false)}} /></label>
      <label>האם המסה תהיה מעל סף הקריסה?<select value={prediction} onChange={e=>{setPrediction(e.target.value);setChecked(false)}}><option value="">בחרו תחזית</option><option value="yes">כן</option><option value="no">לא</option></select></label>
      <button className="primary-button" onClick={()=>setChecked(true)}>בדוק חישוב וניסוי</button>
      <button className="subtle-button" onClick={restart}>תרגיל מהערכים הנוכחיים</button></div>
      <p className="experiment-status">מצב הבקרות: {matched?'הגעתם לערך היעד ושמרתם על המסה.':`כוונו לצפיפות ${number(task.targetDensity)} ולמסה ${number(task.mass)}. מתקבלת סטייה של עד 3% בצפיפות.`}</p>
      {checked&&<div className="jeans-feedback" role="status">{!correct?<p>בדקו שוב: מסת ג׳ינס משתנה ביחס הפוך לשורש הצפיפות. {task.factor===4?'חלקו את מסת ג׳ינס ההתחלתית ב־2.':'הכפילו את מסת ג׳ינס ההתחלתית ב־2.'} מתקבלת סטייה של עד 2% בתשובה.</p>:!predicted?<p>החישוב נכון. כעת השוו את מסת הענן, {number(task.mass)}, למסת ג׳ינס שחישבתם: רק מסה גדולה מהסף מאפשרת קריסה.</p>:!matched?<p>החישוב והתחזית נכונים! להשלמת הניסוי, הזיזו את בקרת הצפיפות לערך היעד ושמרו על המסה המקורית, ואז בדקו שוב.</p>:current.unstable!==(task.mass>task.expectedMass)?<p>אתם קרובים מאוד לסף. הזיזו את הצפיפות עוד צעד קטן {task.mass>task.expectedMass?"כלפי מעלה":"כלפי מטה"} ובדקו שוב, עד שגם מצב הקריסה יתאים לתחזית.</p>:<p>נכון — החישוב והניסוי תואמים! מסת ג׳ינס ביעד היא {task.expectedMass.toFixed(3)} מסות שמש. {task.mass>task.expectedMass?'מסת הענן גדולה ממנה, ולכן הקריסה יכולה להתחיל.':'מסת הענן אינה גדולה ממנה, ולכן אין קריסה במודל.'}</p>}</div>}
    </div>
  </section>;
}


