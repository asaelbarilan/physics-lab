import type { Settings } from './Diagram';
export type DragTarget = 'object' | 'image' | 'height' | 'eye' | 'mirror-top' | 'mirror-bottom';
export function dragSettings(start: Settings, target: DragTarget, dx: number, dy: number): Partial<Settings> {
  const clamp = (value:number,min:number,max:number) => Math.max(min,Math.min(max,Math.round(value)));
  switch(target) {
    case 'object': return {distance:clamp(start.distance-dx,40,210),height:clamp(start.height-dy,80,200)};
    case 'image': return {distance:clamp(start.distance+dx,40,210),height:clamp(start.height-dy,80,200)};
    case 'height': return {height:clamp(start.height-dy,80,200)};
    case 'eye': return {eyeDistance:clamp(start.eyeDistance-dx,40,230),eyeHeight:clamp(start.eyeHeight-dy,30,205)};
    case 'mirror-top': return {mirrorHeight:clamp(start.mirrorHeight-2*dy,20,200)};
    case 'mirror-bottom': return {mirrorHeight:clamp(start.mirrorHeight+2*dy,20,200)};
  }
}

