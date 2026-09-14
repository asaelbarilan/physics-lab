// SI internally. Educational assumptions are documented in research/astronomy-review.md.
export const G = 6.67430e-11;
export const C = 299792458;
export const SOLAR_MASS = 1.98847e30;
export const PROTON_MASS = 1.67262192369e-27;
export const BOLTZMANN = 1.380649e-23;
export const AU = 149597870700;
export const YEAR = 365.25 * 86400;
export const MU = 2.33;
export const CLOUD_TEMPERATURE = 10;
export const clamp = (x:number,min:number,max:number) => Math.min(max,Math.max(min,x));
function positive(...values:number[]) {
  if(values.some(v=>!Number.isFinite(v)||v<=0)) throw new RangeError('Expected finite positive physical input');
}
export function schwarzschildKm(massSolar:number) {
  positive(massSolar);
  return 2*G*massSolar*SOLAR_MASS/(C*C)/1000;
}
export function compactObject(massSolar:number,radiusKm:number) {
  positive(massSolar,radiusKm);
  const horizonKm=schwarzschildKm(massSolar);
  return {horizonKm,ratio:radiusKm/horizonKm,hasHorizon:radiusKm<=horizonKm};
}
export function cloudModel(massSolar:number,numberDensityCm3:number,temperatureK=CLOUD_TEMPERATURE) {
  positive(massSolar,numberDensityCm3,temperatureK);
  const density=numberDensityCm3*1e6*MU*PROTON_MASS;
  const soundSpeed=Math.sqrt(BOLTZMANN*temperatureK/(MU*PROTON_MASS));
  const jeansMassSolar=Math.PI**2.5*soundSpeed**3/(6*G**1.5*Math.sqrt(density))/SOLAR_MASS;
  const freeFallYears=Math.sqrt(3*Math.PI/(32*G*density))/YEAR;
  const radiusAU=Math.cbrt(3*massSolar*SOLAR_MASS/(4*Math.PI*density))/AU;
  return {density,soundSpeed,jeansMassSolar,freeFallYears,radiusAU,unstable:massSolar>jeansMassSolar};
}
export function formationStage(progress:number,unstable:boolean) {
  if(!Number.isFinite(progress))throw new RangeError('Invalid progress');
  if(!unstable)return 0;
  const p=clamp(progress,0,1);
  return p<.15?0:p<.5?1:p<.9?2:3;
}
export const STAR_STAGES = ['ענן קר וצפוף','קריסה כבידתית','פרוטו־כוכב','היתוך מימן מתמשך'];


export const SOLAR_RADIUS_KM = 695700;
export const MAX_STELLAR_RADIUS_KM = 1000 * SOLAR_RADIUS_KM;
export function densityChallenge(mass:number,density:number) {
  const factor=density<=250000?4:.25;
  return {mass,density,factor,targetDensity:density*factor,
    initialMass:cloudModel(mass,density).jeansMassSolar,
    expectedMass:cloudModel(mass,density*factor).jeansMassSolar};
}

