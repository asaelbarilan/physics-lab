import {it,expect} from 'vitest';
import {ramp,engine} from './physics';
it('conserves mechanical energy throughout the ramp',()=>{for(const m of [1,20,100])for(const f of [0,.25,.5,1]){const r=ramp(m,10,f);expect(r.potential+r.kinetic).toBeCloseTo(m*9.81*10);expect(.5*m*r.speed**2).toBeCloseTo(r.kinetic)}});
it('has zero speed at top and mass independent bottom speed',()=>{expect(ramp(10,5,1).speed).toBe(0);expect(ramp(1,5,0).speed).toBe(ramp(100,5,0).speed)});
it('clamps ramp positions and rejects invalid inputs',()=>{expect(ramp(1,5,2).h).toBe(5);expect(ramp(1,5,-1).h).toBe(0);expect(()=>ramp(0,5,.5)).toThrow()});
it('balances heat input with work and rejected heat',()=>{const e=engine(1000,10,200,20,.5,2);expect(e.heat).toBe(10000);expect(e.work+e.rejected).toBe(e.heat);expect(e.efficiency).toBeLessThan(e.carnot);expect(.5*2*e.omega**2).toBeCloseTo(e.work)});
it('uses Kelvin for Carnot and vanishes at zero time',()=>{const e=engine(1000,0,226.85,26.85,1,2);expect(e.carnot).toBeCloseTo(.4);expect(e.omega).toBe(0);expect(e.angle).toBe(0)});
it('doubling time doubles work and increases angular speed by sqrt two',()=>{const a=engine(100,2,200,20,.5,2),b=engine(100,4,200,20,.5,2);expect(b.work).toBe(2*a.work);expect(b.omega).toBeCloseTo(Math.SQRT2*a.omega)});
it('rejects impossible thermal conditions',()=>{expect(()=>engine(1,1,10,20,.5,1)).toThrow();expect(()=>engine(1,1,200,20,2,1)).toThrow()});

