import { Html, Line } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import type { WorldState } from '../core/engine'
import { PHASE_TARGET } from './layout'
import { WORLD_COLORS } from './theme'

function phasePrompt(state: WorldState): string {
  if (!state.request) return 'Scanning the district spine.'
  if (state.phase === 'AWAITING_APPROVAL') return 'Approval chamber focus.'
  if (state.phase === 'RECEIPTED') return 'Receipt archived. Inspect artifact.'
  return `Tracking ${state.request.action}.`
}

export function Warden({ state, reducedMotion }: { state: WorldState; reducedMotion: boolean }) {
  const root = useRef<THREE.Group>(null)
  const halo = useRef<THREE.Mesh>(null)
  const arm = useRef<THREE.Group>(null)
  const target = PHASE_TARGET[state.phase]
  const guideLine: [number, number, number][] = [[0, 0, 0], [target[0], 1.25, target[2]]]

  useFrame(({ clock }, delta) => {
    if (!root.current) return

    const destination = new THREE.Vector3(target[0] - 1.45, 1.85, target[2] - 1.85)
    if (reducedMotion) root.current.position.copy(destination)
    else {
      root.current.position.lerp(destination, 1 - Math.exp(-delta * 2.35))
      root.current.position.y = destination.y + Math.sin(clock.elapsedTime * 1.35) * 0.08
    }

    root.current.lookAt(target[0], 1.4, target[2])
    if (halo.current && !reducedMotion) halo.current.rotation.y += delta * 0.6
    if (arm.current && !reducedMotion) arm.current.rotation.z = Math.sin(clock.elapsedTime * 2) * 0.08
  })

  return (
    <group>
      <Line points={guideLine} color={state.phase === 'AWAITING_APPROVAL' ? WORLD_COLORS.approval : WORLD_COLORS.cyan} lineWidth={0.8} transparent opacity={0.35} />
      <group ref={root} position={[-16, 1.85, -1.85]}>
        <mesh>
          <octahedronGeometry args={[0.52, 0]} />
          <meshStandardMaterial color="#081116" emissive={WORLD_COLORS.cyan} emissiveIntensity={1.35} metalness={0.9} roughness={0.18} />
        </mesh>
        <mesh ref={halo} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.92, 0.045, 10, 40]} />
          <meshBasicMaterial color={WORLD_COLORS.cyan} transparent opacity={0.85} />
        </mesh>
        <group ref={arm} position={[0, -0.08, 0]}>
          <mesh position={[0.42, -0.02, 0]}>
            <boxGeometry args={[0.48, 0.08, 0.08]} />
            <meshStandardMaterial color={WORLD_COLORS.steel} emissive={WORLD_COLORS.red} emissiveIntensity={0.42} />
          </mesh>
          <mesh position={[-0.42, -0.02, 0]}>
            <boxGeometry args={[0.48, 0.08, 0.08]} />
            <meshStandardMaterial color={WORLD_COLORS.steel} emissive={WORLD_COLORS.red} emissiveIntensity={0.42} />
          </mesh>
        </group>
        <mesh position={[-0.16, 0.08, 0.42]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color={WORLD_COLORS.red} />
        </mesh>
        <mesh position={[0.16, 0.08, 0.42]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color={WORLD_COLORS.red} />
        </mesh>
        <pointLight color={WORLD_COLORS.cyan} intensity={6} distance={5} />
      </group>
      <Html transform position={[target[0] - 1.3, 2.95, target[2] - 0.4]} distanceFactor={12}>
        <aside className="warden-beacon">
          <strong>HERMES</strong>
          <p>{phasePrompt(state)}</p>
        </aside>
      </Html>
    </group>
  )
}
