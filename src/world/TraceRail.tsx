import { Line } from '@react-three/drei'
export function TraceRail({ points, active = false, color = '#00ffff' }: { points: [number, number, number][]; active?: boolean; color?: string }) {
  return (
    <group>
      <Line points={points} color="#073b43" lineWidth={5} transparent opacity={0.48} />
      <Line points={points} color={color} lineWidth={active ? 2.1 : 0.7} transparent opacity={active ? 0.95 : 0.22} />
    </group>
  )
}
