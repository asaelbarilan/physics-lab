import type { Question } from '../exercises/ScienceQuiz';
export const astronomyTopics=[
{ id:'star-formation',title:'היווצרות כוכב',icon:'✦',controls:'מסה וצפיפות של ענן',result:'ענן → קריסה → פרוטו־כוכב → היתוך',available:true },
{ id:'black-hole',title:'היווצרות חור שחור',icon:'◉',controls:'מסה ורדיוס של גוף',result:'מתי רדיוס הגוף קטן מרדיוס שוורצשילד?',available:true },
{ id:'fusion',title:'היתוך בשמש',icon:'☀',controls:'טמפרטורת הליבה',result:'מימן → הליום ואנרגיה',available:false },
{ id:'star-color',title:'צבע הכוכב',icon:'◈',controls:'טמפרטורה: 3,000–30,000 K',result:'צבע וספקטרום',available:false },
{ id:'hr',title:'דיאגרמת H–R',icon:'⌁',controls:'בחירה וגרירה של כוכב',result:'מיקום בדיאגרמה, צבע וגודל',available:false },
{ id:'lifecycle',title:'מחזור חיי כוכב',icon:'✧',controls:'מסת הכוכב',result:'מהענן ועד השריד',available:false },
{ id:'red-giant',title:'ענק אדום',icon:'●',controls:'שלב החיים',result:'ליבה מתכווצת ומעטפת מתנפחת',available:false },
{ id:'supernova',title:'סופרנובה',icon:'✹',controls:'מסת הכוכב',result:'קריסת ליבה, פיצוץ ושריד',available:false },
{ id:'pulsar',title:'פולסר',icon:'↻',controls:'סיבוב וזווית צפייה',result:'אלומות ופולסים',available:false },
{ id:'magnetar',title:'מגנטר',icon:'⋈',controls:'עוצמת השדה המגנטי',result:'קווי שדה והתפרצות',available:false },
{ id:'calculator',title:'מחשבון חור שחור',icon:'⊙',controls:'מסה',result:'גודל אופק האירועים — זמין בתוך מודול ההיווצרות',available:false },
{ id:'fall',title:'נפילה לחור שחור',icon:'↘',controls:'מרחק מהחור',result:'מה רואים הנופל והצופה הרחוק?',available:false },
{ id:'tidal',title:'ספגטיפיקציה',icon:'↕',controls:'מרחק ומסה',result:'הבדלי תאוצה בין הראש לרגליים',available:false },
{ id:'time',title:'התארכות זמן כבידתית',icon:'◷',controls:'מרחק מהחור',result:'שני שעונים בקצבים שונים',available:false },
{ id:'lensing',title:'עדשה כבידתית',icon:'◎',controls:'מיקום ומסה של העדשה',result:'קשתות וטבעת איינשטיין',available:false },
{ id:'waves',title:'גלי כבידה',icon:'≈',controls:'מסות ומרחק ביניהן',result:'הקפה ואות משתנה',available:false },
{ id:'relativity',title:'יחסות פרטית',icon:'⇢',controls:'מהירות ביחס למהירות האור',result:'שעון בחללית מול שעון בכדור הארץ',available:false },
{ id:'light',title:'מהירות האור',icon:'☄',controls:'מרחק',result:'זמן מעבר בין הארץ, הירח והשמש',available:false },
];
export const starQuestions:Question[]=[
{question:'מה מחמם את הפרוטו־כוכב לפני שמתחיל היתוך מתמשך?',options:['התכווצות כבידתית והמרת אנרגיה לחום','בעירה של חמצן','אור מכוכבים רחוקים בלבד'],answer:0,explanation:'במהלך הקריסה משתחררת אנרגיה כבידתית. כאשר החום נלכד, פנים הגוף מתחמם.'},
{question:'באותה טמפרטורה, כיצד הגדלת צפיפות הענן משפיעה על מסת ג׳ינס?',options:['מגדילה אותה','מקטינה אותה, ולכן מקלה על הקריסה','אינה משנה אותה'],answer:1,explanation:'מסת ג׳ינס פרופורציונית ל־1/√ρ. לענן צפוף יותר נדרשת מסה קטנה יותר כדי לעבור את הסף במודל.'},
{question:'האם ענן שעובר את סף הקריסה הופך מיד לכוכב שמבצע היתוך?',options:['כן, באותו רגע','לא; תחילה נוצרים אזורים קורסים ופרוטו־כוכבים','רק אם הוא כחול'],answer:1,explanation:'סף ג׳ינס עוסק בתחילת אי־היציבות. הגעה להיתוך היא שלב מאוחר, שאינו מחושב באמצעות הסף לבדו.'}
];
export const blackHoleQuestions:Question[]=[
{question:'מהו בקירוב רדיוס שוורצשילד של גוף בעל 10 מסות שמש?',options:['3 ק״מ','30 ק״מ','300 ק״מ'],answer:1,explanation:'רדיוס שוורצשילד הוא כ־2.95 ק״מ לכל מסת שמש: עבור 10 מסות שמש מתקבלים כ־29.5 ק״מ.'},
{question:'במסה קבועה, מה קורה לרדיוס שוורצשילד כשמכווצים את הגוף?',options:['הוא נשאר קבוע','הוא קטן עם הגוף','הוא גדל תמיד'],answer:0,explanation:'Rs = 2GM/c² תלוי במסה. רדיוס הגוף משתנה בנפרד, עד שהוא מגיע לתוך הגבול הזה.'},
{question:'האם האפשרות לכווץ מסה של שמש בסימולטור אומרת שהשמש תהפוך לחור שחור?',options:['כן, כל כוכב הופך לחור שחור','לא; זהו ניסוי מחשבתי ולא חיזוי גורל השמש','כן, אם מעלים את בהירותה'],answer:1,explanation:'הסימולטור בודק דחיסות של גוף אידיאלי. לשמש אין המסה הדרושה למסלול הטבעי של קריסת ליבה לחור שחור.'}
];

