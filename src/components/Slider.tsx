export default function Slider({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (value: number) => void }) {
  return <label className="slider"><span>{label}<output>{value} ס״מ</output></span><input type="range" min={min} max={max} value={value} onChange={e => onChange(Number(e.target.value))} /></label>;
}
