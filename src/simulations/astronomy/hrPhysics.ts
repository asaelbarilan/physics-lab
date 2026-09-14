import { clamp } from './physics';
export const SUN_TEMPERATURE=5772;
export const HR_BOUNDS={minT:2500,maxT:40000,minLogL:-4,maxLogL:6};
export const HR_PLOT={left:100,top:45,width:590,height:390};
function positive(...v:number[]){if(v.some(x=>!Number.isFinite(x)||x<=0))throw new RangeError('Expected positive finite value')}
export function stellarRadius(temperature:number,luminosity:number){
  positive(temperature,luminosity);
  return Math.sqrt(luminosity)*(SUN_TEMPERATURE/temperature)**2;
}
export function stellarLuminosity(temperature:number,radius:number){
  positive(temperature,radius);
  return radius**2*(temperature/SUN_TEMPERATURE)**4;
}
export function hrPosition(temperature:number,luminosity:number){
  positive(temperature,luminosity);
  return {x:HR_PLOT.left+HR_PLOT.width*Math.log10(HR_BOUNDS.maxT/temperature)/Math.log10(HR_BOUNDS.maxT/HR_BOUNDS.minT),
    y:HR_PLOT.top+HR_PLOT.height*(HR_BOUNDS.maxLogL-Math.log10(luminosity))/(HR_BOUNDS.maxLogL-HR_BOUNDS.minLogL)};
}
export function hrValues(x:number,y:number){
  if(!Number.isFinite(x)||!Number.isFinite(y))throw new RangeError('Invalid point');
  const a=clamp((x-HR_PLOT.left)/HR_PLOT.width,0,1),b=clamp((y-HR_PLOT.top)/HR_PLOT.height,0,1);
  return {temperature:HR_BOUNDS.maxT*(HR_BOUNDS.minT/HR_BOUNDS.maxT)**a,luminosity:10**(HR_BOUNDS.maxLogL-b*(HR_BOUNDS.maxLogL-HR_BOUNDS.minLogL))};
}
// Deliberately illustrative palette, not a spectral color integration.
export function starColor(t:number){return t<3500?'#ffac79':t<5000?'#ffd0a0':t<6500?'#fff0d6':t<10000?'#f4f7ff':'#b9d6ff'}
export function hrChallenge(t:number,l:number){
  const targetLuminosity=l<=250000?l*4:l/4;
  return {temperature:t,luminosity:l,targetLuminosity,radius:stellarRadius(t,l),targetRadius:stellarRadius(t,targetLuminosity)};
}
export const HR_EXAMPLES=[
 {name:'השמש',temperature:5772,luminosity:1,description:'נקודת הייחוס: רדיוס שמש והארת שמש.'},
 {name:'ננס אדום',temperature:3000,luminosity:.003,description:'דוגמה סכמטית לכוכב קר ועמום בסדרה הראשית.'},
 {name:'כוכב כחול',temperature:25000,luminosity:10000,description:'דוגמה סכמטית לכוכב חם ומאיר בסדרה הראשית.'},
 {name:'ענק אדום',temperature:4000,luminosity:500,description:'פני השטח קרירים יחסית, אך שטח הפנים העצום יוצר הארה גבוהה.'},
 {name:'ננס לבן',temperature:15000,luminosity:.01,description:'חם אך עמום: שטח הפנים קטן מאוד. ננס לבן הוא שריד כוכבי.'}
];

