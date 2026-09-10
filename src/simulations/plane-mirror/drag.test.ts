import { describe, expect, it } from 'vitest';
import { dragSettings } from './drag';
import { initialSettings as s, getPaths } from './Diagram';
describe('drag controls',()=>{
  it('moves object and image consistently on opposite sides',()=>{
    expect(dragSettings(s,'object',-20,-15)).toEqual({distance:130,height:180});
    expect(dragSettings(s,'image',20,-15)).toEqual({distance:130,height:180});
  });
  it('resizes from the head without changing distance',()=>{
    expect(dragSettings(s,'height',99,-20)).toEqual({height:185});
  });
  it('moves the eye in both axes',()=>{
    expect(dragSettings(s,'eye',20,15)).toEqual({eyeDistance:155,eyeHeight:120});
  });
  it('resizes either mirror end around its fixed center',()=>{
    expect(dragSettings(s,'mirror-top',0,-10)).toEqual({mirrorHeight:190});
    expect(dragSettings(s,'mirror-bottom',0,10)).toEqual({mirrorHeight:190});
  });
  it('clamps all variables to the same ranges as the sliders',()=>{
    expect(dragSettings(s,'object',999,999)).toEqual({distance:40,height:80});
    expect(dragSettings(s,'image',999,-999)).toEqual({distance:210,height:200});
    expect(dragSettings(s,'eye',999,999)).toEqual({eyeDistance:40,eyeHeight:30});
    expect(dragSettings(s,'eye',-999,-999)).toEqual({eyeDistance:230,eyeHeight:205});
    expect(dragSettings(s,'mirror-top',0,999)).toEqual({mirrorHeight:20});
    expect(dragSettings(s,'mirror-bottom',0,999)).toEqual({mirrorHeight:200});
  });
  it('preserves reflection law after combined drags',()=>{
    let next={...s,...dragSettings(s,'object',-40,-20)};
    next={...next,...dragSettings(next,'eye',15,50)};
    next={...next,...dragSettings(next,'mirror-bottom',0,-40)};
    for(const p of getPaths(next)){expect(p.incidence).toBeCloseTo(p.reflection,12);expect(p.image.x).toBe(-p.source.x)}
  });
});

