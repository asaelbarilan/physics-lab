import { describe,it,expect } from 'vitest';
import { stellarRadius,stellarLuminosity,hrPosition,hrValues,hrChallenge,SUN_TEMPERATURE } from './hrPhysics';
describe('HR diagram physics',()=>{
it('normalizes to the Sun',()=>expect(stellarRadius(SUN_TEMPERATURE,1)).toBe(1));
it('quadrupling luminosity doubles radius at fixed temperature',()=>expect(stellarRadius(10000,400)).toBeCloseTo(2*stellarRadius(10000,100),12));
it('doubling temperature quarters radius at fixed luminosity',()=>expect(stellarRadius(10000,10)).toBeCloseTo(stellarRadius(5000,10)/4,12));
it('inverts Stefan Boltzmann for the full diagram',()=>{for(const t of [2500,5772,15000,40000])for(const l of [.0001,.01,1,1000,1e6])expect(stellarLuminosity(t,stellarRadius(t,l))).toBeCloseTo(l,7)});
it('places hot stars left and luminous stars above',()=>{expect(hrPosition(40000,1).x).toBeLessThan(hrPosition(2500,1).x);expect(hrPosition(5772,100).y).toBeLessThan(hrPosition(5772,.01).y)});
it('round trips diagram coordinates',()=>{for(const t of [2500,5772,40000])for(const l of [.0001,1,1e6]){const p=hrPosition(t,l),v=hrValues(p.x,p.y);expect(v.temperature).toBeCloseTo(t,8);expect(v.luminosity).toBeCloseTo(l,7)}});
it('clamps dragging at all edges',()=>{expect(hrValues(-1,-1)).toEqual({temperature:40000,luminosity:1e6});expect(hrValues(1000,1000)).toEqual({temperature:2500,luminosity:.0001})});
it('keeps challenge targets within the plot',()=>{for(const l of [.0001,1,250000,1e6]){const c=hrChallenge(5772,l);expect(c.targetLuminosity).toBeGreaterThanOrEqual(.0001);expect(c.targetLuminosity).toBeLessThanOrEqual(1e6)}});
it('rejects invalid geometry and physical inputs',()=>{expect(()=>stellarRadius(0,1)).toThrow();expect(()=>stellarLuminosity(1,-1)).toThrow();expect(()=>hrPosition(NaN,1)).toThrow();expect(()=>hrValues(Infinity,1)).toThrow()});
});

