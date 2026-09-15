export const G=9.81;
export const limit=(v:number,a:number,b:number)=>Math.min(b,Math.max(a,v));
function positive(...vs:number[]){if(vs.some(v=>!Number.isFinite(v)||v<=0))throw new RangeError('Expected positive finite inputs')}
export function ramp(mass:number,height:number,fraction:number){
positive(mass,height);if(!Number.isFinite(fraction))throw new RangeError('Invalid position');
const h=height*limit(fraction,0,1),potential=mass*G*h,total=mass*G*height,kinetic=total-potential;
return {h,potential,kinetic,total,speed:Math.sqrt(2*kinetic/mass),duration:Math.sqrt(2*height/(G*.25))};
}
export function engine(power:number,time:number,hotC:number,coldC:number,quality:number,inertia:number){
positive(power,inertia);if(![time,hotC,coldC,quality].every(Number.isFinite)||time<0||coldC<=-273.15||hotC<=coldC||quality<0||quality>1)throw new RangeError('Invalid heat engine inputs');
const carnot=1-(coldC+273.15)/(hotC+273.15),efficiency=quality*carnot,heat=power*time,work=efficiency*heat,rejected=heat-work,omega=Math.sqrt(2*work/inertia);
return {carnot,efficiency,heat,work,rejected,omega,angle:2/3*Math.sqrt(2*efficiency*power/inertia)*time**1.5};
}

