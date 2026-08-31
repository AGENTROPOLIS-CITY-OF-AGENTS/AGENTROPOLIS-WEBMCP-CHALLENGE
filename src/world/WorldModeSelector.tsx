import { Html } from '@react-three/drei'
import { ZONES } from './layout'

export type WorldMode = 'GUIDED' | 'EXPLORE' | 'INSPECT'

export function WorldModeSelector({ mode, onChange }: { mode: WorldMode; onChange: (mode: WorldMode) => void }) {
  return (
    <group position={[ZONES.arrival[0], 0, 3]}>
      <mesh position={[0, 0.25, 0]}><boxGeometry args={[3.7, 0.5, 1.1]} /><meshStandardMaterial color="#020607" emissive="#ff00ff" emissiveIntensity={0.18} /></mesh>
      <Html transform center position={[0, 0.65, 0]} rotation={[-Math.PI / 2, 0, 0]} distanceFactor={7}>
        <nav className="world-mode-selector" aria-label="World camera mode">
          {(['GUIDED', 'EXPLORE', 'INSPECT'] as WorldMode[]).map((value, index) => (
            <button key={value} aria-pressed={mode === value} onClick={() => onChange(value)}>{index + 1} | {value}</button>
          ))}
        </nav>
      </Html>
    </group>
  )
}
