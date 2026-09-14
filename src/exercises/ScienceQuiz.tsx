import { useState } from 'react';
export interface Question {question:string;options:string[];answer:number;explanation:string}
export default function ScienceQuiz({questions}:{questions:Question[]}) {
  const [answers,setAnswers]=useState<Record<number,number>>({}),[checked,setChecked]=useState<Record<number,boolean>>({});
  return <section className="practice" id="practice"><div className="section-heading"><div><div className="eyebrow">בודקים שהבנו</div><h2>שלוש שאלות למחשבה</h2></div></div><div className="exercise-grid">{questions.map((q,i)=><article className="exercise panel" key={q.question}><span className="question-number">0{i+1}</span><h3>שאלה {i+1}</h3><p>{q.question}</p><fieldset><legend className="sr-only">{q.question}</legend>{q.options.map((o,j)=><label key={o}><input type="radio" name={'astro-q'+i} checked={answers[i]===j} onChange={()=>{setAnswers({...answers,[i]:j});setChecked({...checked,[i]:false})}}/>{o}</label>)}</fieldset><button className="check-button" disabled={answers[i]===undefined} onClick={()=>setChecked({...checked,[i]:true})}>בדוק</button><div aria-live="polite">{checked[i]&&<p className={'feedback '+(answers[i]===q.answer?'correct':'incorrect')}><strong>{answers[i]===q.answer?'נכון!':'כדאי לבדוק שוב.'}</strong> {q.explanation}</p>}</div></article>)}</div></section>;
}


