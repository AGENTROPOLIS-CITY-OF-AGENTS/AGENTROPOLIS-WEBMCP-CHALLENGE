import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html, Line, useGLTF } from '@react-three/drei'
import { Component, Suspense, useMemo, useRef, useState, type ReactNode } from 'react'
import * as THREE from 'three'
import type { SpatialObject, WorldGraph } from '../../spatial/world-graph'
import { cameraModeForPhase } from '../../spatial/temporal/camera-director'
import type { TemporalPhase } from '../../spatial/temporal/temporal-plan'

type DemoPhase = 'IDLE' | 'OBSERVE' | 'ACT' | 'SEE AGAIN' | 'VERIFY' | 'RECEIPT' | 'DENIED'

const modelBase = `${import.meta.env.BASE_URL}assets/models/`
const modelSources = {
  chair: `${modelBase}interview-chair.glb`,
  key: `${modelBase}key-light.glb`,
  microphone: `${modelBase}microphone.glb`,
  camera: `${modelBase}cc0_-_camera.glb`,
  cameraFallback: `${modelBase}camera.glb`,
} as const

function GLBProp({ src, size = 1.2, opacity = 1 }: { src: string; size?: number; opacity?: number }) {
  const { scene } = useGLTF(src)
  const object = useMemo(() => {
    const clone = scene.clone(true)
    clone.updateMatrixWorld(true)
    const initialBox = new THREE.Box3().setFromObject(clone)
    const initialSize = initialBox.getSize(new THREE.Vector3())
    const scale = size / Math.max(initialSize.x, initialSize.y, initialSize.z, 0.001)
    clone.scale.setScalar(scale)
    const normalizedBox = new THREE.Box3().setFromObject(clone)
    const center = normalizedBox.getCenter(new THREE.Vector3())
    clone.position.x -= center.x
    clone.position.z -= center.z
    clone.position.y -= normalizedBox.min.y
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.visible = true
        child.frustumCulled = false
        if (Array.isArray(child.material)) child.material = child.material.map((material) => material.clone())
        else if (child.material) child.material = child.material.clone()
        child.castShadow = false
        child.receiveShadow = false
        if (child.material) {
          const materials = Array.isArray(child.material) ? child.material : [child.material]
          materials.forEach((material) => { material.visible = true; material.opacity = opacity; material.transparent = opacity < 1; material.depthWrite = opacity >= 1 })
        }
      }
    })
    clone.updateMatrixWorld(true)
    return clone
  }, [scene, size, opacity])
  return <primitive object={object} />
}

class ModelFallback extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? this.props.fallback : <Suspense fallback={this.props.fallback}>{this.props.children}</Suspense> }
}

function SceneLabel({ name, detail, tone = 'normal', active = false, position = [0, .55, 0] }: { name: string; detail?: string; tone?: 'normal' | 'cyan' | 'magenta' | 'green' | 'red'; active?: boolean; position?: [number, number, number] }) {
  return <Html center distanceFactor={8} position={position} className={`scene-label scene-label-${tone} ${active ? 'scene-label-active' : ''}`}><span>{name}</span>{detail ? <small>{detail}</small> : null}</Html>
}

function SystemAgents({ phase }: { phase: DemoPhase }) {
  const agents = [
    ['OBSERVATION', 'SCENE INTELLIGENCE', phase === 'OBSERVE' || phase === 'SEE AGAIN' ? 'SCANNING' : 'STANDBY', [-3.6, 1.25, 1.2] as [number, number, number]],
    ['ORCHESTRATOR', 'PARALLAX CONTROL', phase === 'ACT' ? 'PLANNING' : phase === 'IDLE' ? 'READY' : 'ROUTING', [-1.5, 2.25, .2] as [number, number, number]],
    ['POLICY', 'GOVERNANCE AGENT', phase === 'DENIED' ? 'DENY' : phase === 'ACT' ? 'ALLOW' : 'STANDBY', [0, 3.05, -1.4] as [number, number, number]],
    ['EXECUTION', 'SPATIAL OPERATOR', phase === 'ACT' ? 'ACTING' : 'STANDBY', [1.8, 1.45, -.4] as [number, number, number]],
    ['VERIFICATION', 'RESULT AGENT', phase === 'VERIFY' ? 'CHECKING' : phase === 'RECEIPT' ? 'PASS' : 'STANDBY', [3.5, 1.75, 1.25] as [number, number, number]],
    ['RECEIPT', 'AUDIT AGENT', phase === 'RECEIPT' ? 'RECORDING' : phase === 'DENIED' ? 'DENIAL LOG' : 'STANDBY', [5.1, 1.2, 2.3] as [number, number, number]],
  ] as const
  const active = (state: string) => state !== 'STANDBY' && state !== 'READY' && !(phase === 'IDLE' && state === 'ROUTING')
  return <group>
    <mesh position={[-1.2, .01, .7]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[2.2, 2.24, 48]} /><meshBasicMaterial color="#19e6e6" transparent opacity={.16} /></mesh>
    <mesh position={[2.7, .02, .3]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[2.1, 2.14, 48]} /><meshBasicMaterial color="#ff3131" transparent opacity={.12} /></mesh>
    {agents.map(([name, role, state, position]) => <group key={name} position={position} scale={active(state) ? 1.12 : 0.9}><mesh><icosahedronGeometry args={[.18, 1]} /><meshStandardMaterial color={state === 'DENY' || state === 'DENIAL LOG' ? '#ff3131' : state === 'PASS' ? '#39ff14' : '#19e6e6'} emissive={state === 'DENY' || state === 'DENIAL LOG' ? '#ff3131' : '#19e6e6'} emissiveIntensity={active(state) ? 2.2 : .55} /></mesh><SceneLabel name={name} detail={`${role} · ${state}`} tone={state === 'DENY' || state === 'DENIAL LOG' ? 'red' : state === 'PASS' ? 'green' : active(state) ? 'cyan' : 'normal'} active={active(state)} /></group>)}
    <Line points={agents.slice(0, -1).map((agent) => agent[3])} color={phase === 'DENIED' ? '#ff3131' : '#19e6e6'} lineWidth={.8} transparent opacity={.32} />
  </group>
}

function StudioObjects({ graph, before, phase, reducedMotion, selectedId, onSelect, systemView }: { graph: WorldGraph; before: WorldGraph | null; phase: DemoPhase; reducedMotion: boolean; selectedId: string | null; onSelect: (id: string) => void; systemView: boolean }) {
  const agent = useRef<THREE.Group>(null)
  const { camera: threeCamera } = useThree()
  const lastPhase = useRef<DemoPhase>(phase)
  const [motionProgress, setMotionProgress] = useState(phase === 'ACT' ? 0 : 1)
  const targetIds = ['chair-01', 'camera-01', 'key-light-01', 'mic-01']
  useFrame((_, delta) => {
    if (phase !== lastPhase.current) { lastPhase.current = phase; setMotionProgress(phase === 'ACT' ? 0 : 1) }
    if (phase === 'ACT' && motionProgress < 1) setMotionProgress(Math.min(1, motionProgress + delta / 4.8))
    if (!agent.current) return
    const destinations: Record<DemoPhase, [number, number, number]> = {
      IDLE: [-3, 1.5, 2], OBSERVE: [-1.5, 1.4, .8], ACT: [1.4, 2.3, -.5], 'SEE AGAIN': [2.8, 1.8, 1.8], VERIFY: [0, 2.5, 3], RECEIPT: [4.2, 2.2, 1], DENIED: [2, 1.6, .7],
    }
    let target = destinations[phase]
    if (phase === 'ACT') {
      const active = graph.objects.find((object) => object.id === targetIds[Math.min(targetIds.length - 1, Math.floor(motionProgress * targetIds.length))])
      if (active) target = [active.position[0] + 1.1, active.position[1] + .7, active.position[2] + .7]
    }
    agent.current.position.lerp(new THREE.Vector3(...target), reducedMotion ? 1 : delta * 2.2)
    agent.current.rotation.y += reducedMotion ? 0 : delta * 1.4
    const cameraMode = cameraModeForPhase((phase === 'SEE AGAIN' ? 'SEE_AGAIN' : phase) as TemporalPhase)
    const cameraTargets: Record<string, [number, number, number]> = { wide: [7, 5, 9], trackTarget: [5, 3.8, 6], comparison: [7, 5, 9], hold: [7, 5, 9], pullback: [9.5, 6, 12] }
    const cameraTarget = cameraTargets[cameraMode]
    threeCamera.position.lerp(new THREE.Vector3(...cameraTarget), reducedMotion ? 1 : delta * 1.1)
    threeCamera.lookAt(0, 1, .4)
  })

  const byId = (id: string) => graph.objects.find((object) => object.id === id)
  const baseChair = byId('chair-01')
  const baseCamera = byId('camera-01')
  const baseMic = byId('mic-01')
  const baseKey = byId('key-light-01')
  const baseFill = byId('fill-light-01')
  const display = byId('display-01')
  const renderPosition = (object: SpatialObject | undefined) => object?.position ?? [0, 0, 0] as [number, number, number]
  const visualObject = (id: string) => {
    const current = byId(id)
    const initial = before?.objects.find((object) => object.id === id)
    if (!current || !initial || phase !== 'ACT') return current
    const t = reducedMotion ? 1 : motionProgress
    return { ...current, position: initial.position.map((value, index) => value + (current.position[index] - value) * t) as [number, number, number], rotation: initial.rotation.map((value, index) => value + (current.rotation[index] - value) * t) as [number, number, number], intensity: initial.intensity == null || current.intensity == null ? current.intensity : initial.intensity + (current.intensity - initial.intensity) * t }
  }
  const chair = visualObject('chair-01') ?? baseChair
  const camera = visualObject('camera-01') ?? baseCamera
  const mic = visualObject('mic-01') ?? baseMic
  const key = visualObject('key-light-01') ?? baseKey
  const fill = visualObject('fill-light-01') ?? baseFill
  const scan = phase === 'OBSERVE' || phase === 'SEE AGAIN'
  const verify = phase === 'VERIFY' || phase === 'RECEIPT'
  const compare = phase === 'SEE AGAIN' || verify
  return (
    <>
      <mesh position={[0, -.18, 0]}><boxGeometry args={[9, .25, 7]} /><meshStandardMaterial color="#17272b" transparent opacity={.34} /></mesh>
      <mesh position={[0, 2.8, -3.2]}><boxGeometry args={[9, 5.5, .18]} /><meshStandardMaterial color="#102126" transparent opacity={.26} /></mesh>
      <mesh position={[-4.4, 2.2, 0]}><boxGeometry args={[.18, 4.5, 7]} /><meshStandardMaterial color="#102126" transparent opacity={.22} /></mesh>
      <mesh position={[0, .72, 1.8]}><boxGeometry args={[3.2, .18, 1.2]} /><meshStandardMaterial color="#252d31" /></mesh>
      <mesh position={[0, .36, 1.8]}><boxGeometry args={[.18, .72, .18]} /><meshStandardMaterial color="#1a2226" /></mesh>
      <mesh position={[0, -.02, .2]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[.72, .78, 40]} /><meshBasicMaterial color="#19e6e6" transparent opacity={.55} /></mesh><Html center position={[0, .02, .2]} className="target-marker"><span>CHAIR TARGET</span></Html>
      <Line points={[[0, 1.6, -2.8], [0, 1.15, .2]]} color="#19e6e6" lineWidth={.6} transparent opacity={.28} /><Html center position={[.45, 1.7, -2.6]} className="target-marker"><span>CAMERA TARGET</span></Html>
      <mesh position={[.28, .02, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[.2, .24, 24]} /><meshBasicMaterial color="#19e6e6" transparent opacity={.48} /></mesh><Html center position={[.45, .05, 0]} className="target-marker"><span>MIC TARGET</span></Html>
      {systemView && <SystemAgents phase={phase} />}
      {chair && <group position={renderPosition(chair)} rotation={chair.rotation} onClick={(event) => { event.stopPropagation(); onSelect(chair.id) }}><ModelFallback fallback={<><mesh position={[0, .45, 0]}><boxGeometry args={[1.2, .15, 1.1]} /><meshStandardMaterial color={selectedId === chair.id || verify ? '#19e6e6' : '#283338'} /></mesh><mesh position={[0, 1.2, .42]}><boxGeometry args={[1.2, 1.3, .15]} /><meshStandardMaterial color="#1b2529" /></mesh></>}><GLBProp src={modelSources.chair} size={1.7} /></ModelFallback><SceneLabel name="INTERVIEW CHAIR" tone={verify ? 'green' : phase === 'ACT' ? 'magenta' : selectedId === chair.id ? 'cyan' : 'normal'} active={selectedId === chair.id || phase === 'ACT'} /></group>}
      {camera && <group position={renderPosition(camera)} rotation={camera.rotation} onClick={(event) => { event.stopPropagation(); onSelect(camera.id) }}><ModelFallback fallback={<ModelFallback fallback={<><mesh><boxGeometry args={[.55, .42, .75]} /><meshStandardMaterial color="#12191d" /></mesh><mesh position={[0, 0, -.42]}><cylinderGeometry args={[.2, .2, .12, 16]} /><meshStandardMaterial color="#ff3131" emissive="#551018" /></mesh></>}><GLBProp src={modelSources.cameraFallback} size={1.55} /></ModelFallback>}><GLBProp src={modelSources.camera} size={1.55} /></ModelFallback><group position={[0, -.55, 0]}><mesh><cylinderGeometry args={[.045, .06, 1.1, 8]} /><meshStandardMaterial color="#6d7e82" /></mesh><mesh position={[.27, -.4, .08]} rotation={[0, 0, -.35]}><cylinderGeometry args={[.025, .035, .85, 8]} /><meshStandardMaterial color="#6d7e82" /></mesh><mesh position={[-.27, -.4, .08]} rotation={[0, 0, .35]}><cylinderGeometry args={[.025, .035, .85, 8]} /><meshStandardMaterial color="#6d7e82" /></mesh><mesh position={[0, -.4, -.25]} rotation={[.35, 0, 0]}><cylinderGeometry args={[.025, .035, .85, 8]} /><meshStandardMaterial color="#6d7e82" /></mesh></group><SceneLabel name="CAMERA" detail={phase === 'OBSERVE' ? 'SCANNING' : phase === 'ACT' ? 'ROTATE · AUTHORIZED' : undefined} tone={phase === 'ACT' ? 'magenta' : verify ? 'green' : 'cyan'} active={selectedId === camera.id || phase === 'OBSERVE' || phase === 'ACT'} /></group>}
      {mic && <group position={renderPosition(mic)} rotation={mic.rotation} onClick={(event) => { event.stopPropagation(); onSelect(mic.id) }}><ModelFallback fallback={<><mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[.1, .1, .65, 12]} /><meshStandardMaterial color="#d6e4e4" /></mesh><mesh position={[0, -.35, 0]}><cylinderGeometry args={[.025, .025, .7, 8]} /><meshStandardMaterial color="#6d7e82" /></mesh></>}><GLBProp src={modelSources.microphone} size={.9} /></ModelFallback><SceneLabel name="MICROPHONE" detail={phase === 'OBSERVE' ? 'SCANNING' : phase === 'ACT' ? 'MOVE · AUTHORIZED' : undefined} tone={phase === 'ACT' ? 'magenta' : verify ? 'green' : selectedId === mic.id ? 'cyan' : 'normal'} active={selectedId === mic.id || phase === 'OBSERVE' || phase === 'ACT'} /></group>}
      {key && <pointLight position={renderPosition(key)} intensity={(key.intensity ?? 0) / 18} distance={6} color="#19e6e6" />}
      {fill && <pointLight position={renderPosition(fill)} intensity={(fill.intensity ?? 0) / 24} distance={5} color="#ff5265" />}
      {key && <group position={renderPosition(key)} rotation={key.rotation} onClick={(event) => { event.stopPropagation(); onSelect(key.id) }}><ModelFallback fallback={<mesh><sphereGeometry args={[.16, 12, 12]} /><meshStandardMaterial color="#19e6e6" emissive="#19e6e6" emissiveIntensity={2} /></mesh>}><GLBProp src={modelSources.key} size={1.25} /></ModelFallback><SceneLabel name="KEY LIGHT" detail={phase === 'ACT' ? 'ADJUST · AUTHORIZED' : undefined} tone={phase === 'ACT' ? 'magenta' : verify ? 'green' : selectedId === key.id ? 'cyan' : 'cyan'} active={selectedId === key.id || phase === 'ACT'} /></group>}
      {fill && <mesh position={renderPosition(fill)} onClick={(event) => { event.stopPropagation(); onSelect(fill.id) }}><sphereGeometry args={[.13, 12, 12]} /><meshStandardMaterial color="#ff3131" emissive="#ff3131" emissiveIntensity={1.5} /><SceneLabel name="FILL LIGHT" tone={selectedId === fill.id ? 'cyan' : 'normal'} active={selectedId === fill.id} /></mesh>}
      {display && <group position={display.position} rotation={display.rotation} onClick={(event) => { event.stopPropagation(); onSelect(display.id) }}><mesh><boxGeometry args={[1.6, .95, .12]} /><meshStandardMaterial color="#0e181c" emissive="#06383f" emissiveIntensity={1} /></mesh><mesh position={[0, 0, -.08]}><planeGeometry args={[1.3, .68]} /><meshBasicMaterial color="#19e6e6" transparent opacity={.3} /></mesh><SceneLabel name="DISPLAY" tone={selectedId === display.id ? 'cyan' : 'normal'} active={selectedId === display.id} /></group>}
      {scan && <mesh position={[0, 1.2, .4]} rotation={[0, 0, 0]}><sphereGeometry args={[2.4, 24, 12]} /><meshBasicMaterial color="#19e6e6" wireframe transparent opacity={.12} /></mesh>}
      <group ref={agent}><mesh><icosahedronGeometry args={[.3, 1]} /><meshStandardMaterial color="#19e6e6" emissive="#19e6e6" emissiveIntensity={2} /></mesh><mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[.48, .025, 8, 32]} /><meshBasicMaterial color="#19e6e6" transparent opacity={.65} /></mesh><SceneLabel name="PARALLAX AGENT" tone="cyan" active /></group>
      {compare && before && ['chair-01', 'camera-01', 'key-light-01', 'mic-01'].map((id) => { const original = before.objects.find((object) => object.id === id); return original && <mesh key={`ghost-${id}`} position={original.position} rotation={original.rotation}><boxGeometry args={[.8, .8, .8]} /><meshBasicMaterial color="#19e6e6" wireframe transparent opacity={.35} /></mesh> })}
      {phase === 'ACT' && (() => { const active = graph.objects.find((object) => object.id === targetIds[Math.min(targetIds.length - 1, Math.floor(motionProgress * targetIds.length))]); return active ? (<Html center position={[active.position[0], active.position[1] + .8, active.position[2]]} className="scene-action-signal"><span>ALLOW · ACT</span></Html>) : null })()}
      {phase === 'RECEIPT' && <mesh position={[3.4, 1.3, 1.3]}><boxGeometry args={[.7, .45, .08]} /><meshStandardMaterial color="#ff3131" emissive="#19e6e6" emissiveIntensity={1} /></mesh>}
      <group position={[2, .55, .7]} onClick={(event) => { event.stopPropagation(); onSelect('restricted-object') }}><mesh><boxGeometry args={[.65, 1.1, .65]} /><meshStandardMaterial color="#240b10" /></mesh><SceneLabel name="RESTRICTED OBJECT" detail={phase === 'DENIED' ? 'UNAUTHORIZED · DENIED' : undefined} tone="red" active={selectedId === 'restricted-object' || phase === 'DENIED'} /></group>
      {phase === 'DENIED' && <><mesh position={[2, 1.1, .7]}><sphereGeometry args={[.82, 16, 8]} /><meshBasicMaterial color="#ff3131" wireframe transparent opacity={.42} /></mesh><Line points={[[2, 1.6, .7], [2, 1.1, .7]]} color="#ff3131" lineWidth={1.5} /></>}
    </>
  )
}

export function StudioScene3D({ graph, before, phase, reducedMotion, selectedId, onSelect, systemView = false }: { graph: WorldGraph; before: WorldGraph | null; phase: DemoPhase; reducedMotion: boolean; selectedId: string | null; onSelect: (id: string) => void; systemView?: boolean }) {
  return <Canvas camera={{ position: [7, 5, 9], fov: 42 }} dpr={reducedMotion ? 1 : [1, 1.5]} frameloop={reducedMotion ? 'demand' : 'always'} gl={{ alpha: true, antialias: !reducedMotion }}><ambientLight intensity={.4} color="#2e5961" /><StudioObjects graph={graph} before={before} phase={phase} reducedMotion={reducedMotion} selectedId={selectedId} onSelect={onSelect} systemView={systemView} /></Canvas>
}

export type { DemoPhase }
