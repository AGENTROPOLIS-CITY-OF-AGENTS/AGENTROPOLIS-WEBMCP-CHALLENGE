import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import type { WorldState } from '../core/engine'
import { PHASE_TARGET, ZONES } from './layout'
import { WORLD_COLORS } from './theme'

function packetTarget(state: WorldState): readonly [number, number, number] {
  if (state.phase === 'RECEIPTED' && state.activeReceipt?.status === 'DENIED') {
    return state.request?.mandate ? ZONES.policy : ZONES.mandate
  }

  return PHASE_TARGET[state.phase]
}

function mandateColor(state: WorldState): string {
  if (!state.request?.mandate) return WORLD_COLORS.red
  if (state.request.mandate === 'operate-grid') return WORLD_COLORS.approval
  return WORLD_COLORS.cyan
}

function decisionColor(state: WorldState): string {
  if (state.decision?.effect === 'DENY') return WORLD_COLORS.red
  if (state.decision?.effect === 'REQUIRE_APPROVAL') return WORLD_COLORS.approval
  if (state.phase === 'RECEIPTED') return WORLD_COLORS.success
  return WORLD_COLORS.cyan
}

export function RequestPacket({ state, reducedMotion }: { state: WorldState; reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null)
  const shell = useRef<THREE.Mesh>(null)
  const actorNode = useRef<THREE.Mesh>(null)
  const decisionRing = useRef<THREE.Mesh>(null)
  const target = packetTarget(state)
  const visible = Boolean(state.request)
  const color = decisionColor(state)
  const mandate = mandateColor(state)

  useFrame((_, delta) => {
    if (!group.current) return

    const destination = new THREE.Vector3(target[0], 1.18, target[2])
    if (reducedMotion) group.current.position.copy(destination)
    else group.current.position.lerp(destination, 1 - Math.exp(-delta * 3.2))

    if (shell.current && !reducedMotion) shell.current.rotation.y += delta * 0.9
    if (decisionRing.current && !reducedMotion) decisionRing.current.rotation.z -= delta * 1.6
    if (actorNode.current && !reducedMotion) actorNode.current.position.y = 0.42 + Math.sin(performance.now() * 0.006) * 0.04
  })

  if (!visible) return null

  return (
    <group ref={group} position={[ZONES.gateway[0], 1.18, 0]}>
      <mesh>
        <icosahedronGeometry args={[0.34, 0]} />
        <meshStandardMaterial color="#071115" emissive={WORLD_COLORS.cyan} emissiveIntensity={1.15} metalness={0.92} roughness={0.18} />
      </mesh>
      <mesh ref={shell} rotation={[0, 0, Math.PI / 4]}>
        <octahedronGeometry args={[0.58, 0]} />
        <meshStandardMaterial color="#04090d" emissive={mandate} emissiveIntensity={0.28} transparent opacity={0.5} wireframe />
      </mesh>
      <mesh ref={decisionRing} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.72, 0.04, 8, 28]} />
        <meshBasicMaterial color={color} transparent opacity={0.9} />
      </mesh>
      <mesh position={[0, -0.25, 0]}>
        <boxGeometry args={[0.18, 0.06, 0.7]} />
        <meshStandardMaterial color="#11161a" emissive={mandate} emissiveIntensity={0.5} />
      </mesh>
      {state.phase !== 'REQUESTED' && (
        <mesh ref={actorNode} position={[0.48, 0.42, 0]}>
          <sphereGeometry args={[0.11, 10, 10]} />
          <meshBasicMaterial color={WORLD_COLORS.redGlow} />
        </mesh>
      )}
      {state.decision && (
        <mesh position={[-0.5, 0.18, 0]}>
          <boxGeometry args={[0.16, 0.16, 0.16]} />
          <meshStandardMaterial color="#0c1014" emissive={color} emissiveIntensity={0.85} />
        </mesh>
      )}
      {state.phase === 'RECEIPTED' && (
        <mesh position={[0, 0, -0.54]}>
          <octahedronGeometry args={[0.14, 0]} />
          <meshStandardMaterial color="#09100b" emissive={WORLD_COLORS.success} emissiveIntensity={1.4} metalness={0.9} />
        </mesh>
      )}
      <pointLight color={color} intensity={7} distance={4} />
      <Html center position={[0, 1.05, 0]} distanceFactor={10}>
        <span className="packet-label">
          <b>{state.request?.action}</b>
          <i>{state.request?.actor.id}</i>
        </span>
      </Html>
    </group>
  )
}
