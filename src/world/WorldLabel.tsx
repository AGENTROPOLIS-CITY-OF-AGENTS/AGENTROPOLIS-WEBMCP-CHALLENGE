import { Html } from '@react-three/drei'

export function WorldLabel({ title, role, state, position = [0, 3.4, 0] }: { title: string; role: string; state?: string; position?: [number, number, number] }) {
  return (
    <Html center transform distanceFactor={10} position={position} occlude={false}>
      <div className="world-label" aria-hidden="true">
        <strong>{title}</strong>
        <span>{role}</span>
        {state && <em>{state}</em>}
      </div>
    </Html>
  )
}
