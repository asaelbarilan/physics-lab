import { describe, expect, it } from 'vitest';
import { cloudModel, compactObject, formationStage, schwarzschildKm } from './physics';
describe('Schwarzschild compactness model',()=>{
  it('gives about 2.953 km per solar mass',()=>expect(schwarzschildKm(1)).toBeCloseTo(2.95334,4));
  it('scales linearly with mass',()=>{for(const m of [5,10,100])expect(schwarzschildKm(m)).toBeCloseTo(m*schwarzschildKm(1),10)});
  it('distinguishes outside, boundary and inside without invalid escape speeds',()=>{const rs=schwarzschildKm(10);expect(compactObject(10,rs*1.001).hasHorizon).toBe(false);expect(compactObject(10,rs).hasHorizon).toBe(true);expect(compactObject(10,rs*.999).hasHorizon).toBe(true)});
  it('keeps the horizon fixed while radius changes',()=>expect(compactObject(10,10).horizonKm).toBe(compactObject(10,100).horizonKm));
  it('rejects invalid mass/radius',()=>{for(const bad of [0,-1,NaN,Infinity]){expect(()=>schwarzschildKm(bad)).toThrow();expect(()=>compactObject(10,bad)).toThrow()}});
});
describe('molecular cloud model',()=>{
  it('has a realistic order of magnitude for a dense cold cloud',()=>{const c=cloudModel(3,1e5);expect(c.soundSpeed).toBeGreaterThan(180);expect(c.soundSpeed).toBeLessThan(200);expect(c.freeFallYears).toBeGreaterThan(100000);expect(c.freeFallYears).toBeLessThan(120000)});
  it('scales Jeans mass and free-fall time inversely with sqrt density',()=>{const a=cloudModel(3,1e4),b=cloudModel(3,4e4);expect(b.jeansMassSolar).toBeCloseTo(a.jeansMassSolar/2,10);expect(b.freeFallYears).toBeCloseTo(a.freeFallYears/2,8)});
  it('scales Jeans mass with temperature to power 1.5',()=>expect(cloudModel(3,1e5,40).jeansMassSolar).toBeCloseTo(8*cloudModel(3,1e5,10).jeansMassSolar,10));
  it('scales radius with cube root of mass and inverse density',()=>{const a=cloudModel(1,1e5);expect(cloudModel(8,1e5).radiusAU).toBeCloseTo(2*a.radiusAU,8);expect(cloudModel(1,8e5).radiusAU).toBeCloseTo(a.radiusAU/2,8)});
  it('detects both sides of the Jeans threshold',()=>{const j=cloudModel(1,1e5).jeansMassSolar;expect(cloudModel(j*.999,1e5).unstable).toBe(false);expect(cloudModel(j*1.001,1e5).unstable).toBe(true)});
  it('does not let a supported cloud advance to fusion',()=>{for(const p of [0,.2,.6,1])expect(formationStage(p,false)).toBe(0);expect([0,.2,.6,1].map(p=>formationStage(p,true))).toEqual([0,1,2,3])});
  it('validates inputs and clamps schematic progress',()=>{expect(()=>cloudModel(0,1e5)).toThrow();expect(()=>cloudModel(1,NaN)).toThrow();expect(()=>cloudModel(1,1e5,-1)).toThrow();expect(()=>formationStage(NaN,true)).toThrow();expect(formationStage(10,true)).toBe(3)});
});

