import { Line } from '@react-three/drei'
import { ZONES } from './layout'
import { WORLD_COLORS } from './theme'

function DistrictPad({
  position,
  size,
  title,
  accent = WORLD_COLORS.cyan,
}: {
  position: readonly [number, number, number]
  size: [number, number, number]
  title: string
  accent?: string
}) {
  const [x, , z] = position
  const [w, h, d] = size
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, -0.22, 0]} receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color="#05090b" emissive="#08171c" emissiveIntensity={0.32} metalness={0.82} roughness={0.42} />
      </mesh>
      <Line points={[[-w / 2, -0.08, -d / 2], [w / 2, -0.08, -d / 2], [w / 2, -0.08, d / 2], [-w / 2, -0.08, d / 2], [-w / 2, -0.08, -d / 2]]} color={accent} lineWidth={1.2} transparent opacity={0.44} />
      <Line points={[[-w / 2 + 0.35, -0.079, -d / 2 + 0.35], [-w / 4, -0.079, -d / 2 + 0.35], [-w / 4, -0.079, -d / 4]]} color={accent} lineWidth={0.9} transparent opacity={0.34} />
      <Line points={[[w / 2 - 0.35, -0.079, d / 2 - 0.35], [w / 4, -0.079, d / 2 - 0.35], [w / 4, -0.079, d / 4]]} color={accent} lineWidth={0.9} transparent opacity={0.34} />
      <mesh position={[0, -0.02, d / 2 - 0.24]}>
        <boxGeometry args={[Math.min(w * 0.66, 3.6), 0.04, 0.22]} />
        <meshBasicMaterial color={accent} transparent opacity={0.58} />
      </mesh>
      <mesh position={[0, 0.01, d / 2 - 0.24]}>
        <planeGeometry args={[Math.min(w * 0.64, 3.4), 0.12]} />
        <meshBasicMaterial color="#041116" transparent opacity={0.88} />
      </mesh>
      <mesh position={[0, 0.012, d / 2 - 0.24]}>
        <planeGeometry args={[Math.min(w * 0.56, 3.0), 0.05]} />
        <meshBasicMaterial color={accent} transparent opacity={0.55} />
      </mesh>
      <mesh position={[0, 0.014, d / 2 - 0.24]}>
        <planeGeometry args={[Math.min(w * 0.54, 2.9), 0.03]} />
        <meshBasicMaterial color={WORLD_COLORS.abyss} transparent opacity={0.95} />
      </mesh>
      <group position={[0, 0.025, d / 2 - 0.24]}>
        {title.split('').slice(0, 18).map((_, index) => (
          <mesh key={index} position={[-Math.min(w * 0.24, 1.45) + index * 0.16, 0, 0]}>
            <boxGeometry args={[0.06, 0.012, 0.018]} />
            <meshBasicMaterial color={accent} transparent opacity={index % 2 === 0 ? 0.85 : 0.38} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

function Conduit({ points, active = false, color = WORLD_COLORS.cyan }: { points: [number, number, number][]; active?: boolean; color?: string }) {
  return (
    <group>
      <Line points={points} color="#092129" lineWidth={6} transparent opacity={0.92} />
      <Line points={points} color={color} lineWidth={active ? 1.6 : 0.6} transparent opacity={active ? 0.74 : 0.18} />
    </group>
  )
}

export function Infrastructure({ approvalActive, routeActive, resultActive }: { approvalActive: boolean; routeActive: boolean; resultActive: boolean }) {
  const pads = [
    { position: ZONES.gateway, size: [4.6, 0.28, 4], title: 'GATEWAY NODE', accent: WORLD_COLORS.cyan },
    { position: ZONES.identity, size: [4.4, 0.24, 4.8], title: 'IDENTITY PLAZA', accent: WORLD_COLORS.cyan },
    { position: ZONES.mandate, size: [5.2, 0.24, 3.8], title: 'MANDATE CORRIDOR', accent: WORLD_COLORS.red },
    { position: ZONES.policy, size: [4.2, 0.28, 4], title: 'POLICY GATE', accent: WORLD_COLORS.cyan },
    { position: ZONES.approval, size: [4.4, 0.24, 4.8], title: 'APPROVAL CHAMBER', accent: WORLD_COLORS.approval },
    { position: ZONES.forge, size: [5, 0.24, 4], title: 'EXECUTION FORGE', accent: WORLD_COLORS.red },
    { position: ZONES.vault, size: [5.2, 0.28, 4.8], title: 'RECEIPT VAULT', accent: WORLD_COLORS.cyan },
  ] as const

  return (
    <group>
      <mesh position={[0, -0.45, 0]} receiveShadow>
        <boxGeometry args={[34, 0.3, 18]} />
        <meshStandardMaterial color="#020406" emissive="#041116" emissiveIntensity={0.18} metalness={0.9} roughness={0.52} />
      </mesh>
      <mesh position={[0, -0.18, 0]}>
        <planeGeometry args={[34, 18]} />
        <meshBasicMaterial color="#02090b" transparent opacity={0.95} />
      </mesh>

      {pads.map((pad) => (
        <DistrictPad key={pad.title} position={pad.position} size={[pad.size[0], pad.size[1], pad.size[2]]} title={pad.title} accent={pad.accent} />
      ))}

      <Conduit points={[[-15, -0.02, -2.6], [-11, -0.02, -2.6], [-11, -0.02, 0], [-7, -0.02, 0], [-7, -0.02, -2.1], [-3, -0.02, -2.1], [-3, -0.02, 0], [1, -0.02, 0], [1, -0.02, -2], [6, -0.02, -2], [6, -0.02, 0], [11, -0.02, 0]]} active={routeActive} />
      <Conduit points={[[1, -0.02, 0], [1, -0.02, 2.8], [2, -0.02, 2.8], [2, -0.02, 5]]} active={approvalActive} color={WORLD_COLORS.approval} />
      <Conduit points={[[2, -0.02, 5], [6, -0.02, 5], [6, -0.02, 0]]} active={resultActive} color={WORLD_COLORS.red} />

      {[-14, -10, -6, -2, 2, 6, 10, 14].map((x) => (
        <group key={x} position={[x, 0, -6.9]}>
          <mesh position={[0, 1.3, 0]}>
            <boxGeometry args={[0.22, 2.6, 0.22]} />
            <meshStandardMaterial color={WORLD_COLORS.steel} emissive={WORLD_COLORS.cyanDim} emissiveIntensity={0.28} />
          </mesh>
          <mesh position={[0, 2.72, 0]}>
            <boxGeometry args={[0.52, 0.14, 0.52]} />
            <meshStandardMaterial color="#081317" emissive={x % 4 === 0 ? WORLD_COLORS.red : WORLD_COLORS.cyan} emissiveIntensity={0.44} />
          </mesh>
        </group>
      ))}

      {[-14, -8, -2, 4, 10].map((x) => (
        <mesh key={`spine-${x}`} position={[x, 0.3, 6.75]}>
          <boxGeometry args={[1.7, 0.14, 0.24]} />
          <meshStandardMaterial color="#081015" emissive="#103845" emissiveIntensity={0.34} />
        </mesh>
      ))}
    </group>
  )
}
