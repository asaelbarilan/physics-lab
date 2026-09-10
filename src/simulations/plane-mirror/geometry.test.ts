import { describe, expect, it } from 'vitest';
import { reflectPoint, reflectionPath, objectPoints } from './geometry';
describe('plane mirror geometry',()=>{
  it('reflects across a translated mirror and is an involution',()=>{const p={x:-40,y:150};expect(reflectPoint(p,10)).toEqual({x:60,y:150});expect(reflectPoint(reflectPoint(p,10),10)).toEqual(p)});
  it('preserves image height and size',()=>{const points=objectPoints(40,180);const images=points.map(p=>reflectPoint(p,0));expect(images[0].y-images[4].y).toBe(180);expect(images.every(p=>p.x===40)).toBe(true)});
  it('finds the known midpoint for equal distances',()=>{const p=reflectionPath({x:-100,y:180},{x:-100,y:120},{x:0,bottom:0,top:200});expect(p.hit).toEqual({x:0,y:150});expect(p.incidence).toBeCloseTo(Math.atan(.3),12)});
  it('obeys reflection, collinearity, and equal distances over the slider range',()=>{for(const d of [40,110,210])for(const h of [80,165,200])for(const ex of [40,175,230])for(const ey of [30,135,205])for(const source of objectPoints(d,h)){const p=reflectionPath(source,{x:-ex,y:ey},{x:0,bottom:5,top:205});expect(p.incidence).toBeCloseTo(p.reflection,12);expect(p.image.x).toBe(-source.x);expect((p.hit.x-p.eye.x)*(p.image.y-p.eye.y)-(p.hit.y-p.eye.y)*(p.image.x-p.eye.x)).toBeCloseTo(0,8);expect(p.hit.x).toBe(0)}});
  it('includes edges and rejects rays missing a finite mirror',()=>{const s={x:-100,y:180},e={x:-100,y:120};expect(reflectionPath(s,e,{x:0,bottom:150,top:170}).visible).toBe(true);expect(reflectionPath(s,e,{x:0,bottom:151,top:170}).visible).toBe(false);expect(reflectionPath(s,e,{x:0,bottom:130,top:150}).visible).toBe(true)});
  it('handles normal incidence without singularities',()=>{const p=reflectionPath({x:-50,y:100},{x:-140,y:100},{x:0,bottom:0,top:200});expect(p.incidence).toBe(0);expect(p.reflection).toBe(0);expect(p.hit.y).toBe(100)});
  it('rejects invalid geometry',()=>{expect(()=>reflectionPath({x:0,y:0},{x:-50,y:1},{x:0,bottom:0,top:200})).toThrow();expect(()=>reflectionPath({x:-1,y:NaN},{x:-50,y:1},{x:0,bottom:0,top:200})).toThrow();expect(()=>reflectionPath({x:-1,y:0},{x:1,y:1},{x:0,bottom:0,top:200})).toThrow()});
});
