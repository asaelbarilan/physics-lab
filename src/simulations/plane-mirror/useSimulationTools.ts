import { useEffect } from 'react';
import { flushSync } from 'react-dom';
import { getPaths, type Settings } from './Diagram';
export function useSimulationTools(setSettings: (value: Settings) => void) {
  useEffect(() => {
    type Tool = { name: string; description: string; inputSchema: object; annotations: object; execute: (input: unknown) => unknown };
    const context = (document as Document & { modelContext?: { registerTool: (tool: Tool, options: {signal: AbortSignal}) => void | Promise<void> } }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const ranges: Record<keyof Settings, [number, number]> = {distance:[40,210],height:[80,200],eyeHeight:[30,205],eyeDistance:[40,230],mirrorHeight:[20,200]};
    const tool: Tool = {
      name: 'configure_plane_mirror',
      description: 'Set all mirror simulation controls in centimeters and return visible points.',
      inputSchema: {type:'object',properties:Object.fromEntries(Object.entries(ranges).map(([key,[minimum,maximum]])=>[key,{type:'integer',minimum,maximum}])),required:Object.keys(ranges),additionalProperties:false},
      annotations: {readOnlyHint:false},
      execute(input) {
        if (!input || typeof input !== 'object') throw new Error('Expected settings');
        const values = input as Record<string,unknown>;
        if(Object.keys(values).some(key=>!(key in ranges))) throw new Error('Unknown setting');
        for(const [key,[min,max]] of Object.entries(ranges)) {
          const value = values[key];
          if(typeof value !== 'number' || !Number.isInteger(value) || value < min || value > max) throw new Error('Invalid setting: '+key);
        }
        const settings = {...values} as unknown as Settings;
        flushSync(()=>setSettings(settings));
        return {settings,visiblePoints:getPaths(settings).filter(p=>p.visible).map(p=>p.name)};
      }
    };
    try { void Promise.resolve(context.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{}); } catch {}
    return ()=>lifecycle.abort();
  },[setSettings]);
}

