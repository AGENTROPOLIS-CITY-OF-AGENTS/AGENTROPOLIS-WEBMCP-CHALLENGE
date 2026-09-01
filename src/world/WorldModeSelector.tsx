import { Html } from '@react-three/drei'
import { SystemNav } from '../../packages/ui-vault/src'
import { ZONES } from './layout'

export type WorldMode = 'GUIDED' | 'EXPLORE' | 'INSPECT'

export function WorldModeSelector({ mode, onChange }: { mode: WorldMode; onChange: (mode: WorldMode) => void }) {
  return (
    <group position={[ZONES.arrival[0], 0, 3]}>
      <mesh position={[0, 0.25, 0]}><boxGeometry args={[4.6, 0.52, 1.25]} /><meshStandardMaterial color="#020607" emissive="#0c3942" emissiveIntensity={0.22} /></mesh>
      <Html transform center position={[0, 0.65, 0]} rotation={[-Math.PI / 2, 0, 0]} distanceFactor={7}>
        <div className="world-mode-selector">
          <SystemNav
            district="webmcp"
            items={(['GUIDED', 'EXPLORE', 'INSPECT'] as WorldMode[]).map((value) => ({ id: value, label: value }))}
            activeId={mode}
            onSelect={(value) => onChange(value as WorldMode)}
          />
        </div>
      </Html>
    </group>
  )
}
