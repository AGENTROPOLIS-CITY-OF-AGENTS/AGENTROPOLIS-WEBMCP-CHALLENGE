import { Grid, OrbitControls, Sparkles } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense, useRef } from 'react'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import type { WorldState } from '../core/engine'
import { CameraRig } from './CameraRig'
import { Infrastructure } from './Infrastructure'
import { ApprovalChamber, ExecutionForge, Gateway, IdentityPlaza, MandateCorridor, PolicyGate, ReceiptVault } from './Zones'
import { RequestPacket } from './RequestPacket'
import { TraceRail } from './TraceRail'
import { Warden } from './Warden'
import { WorldModeSelector, type WorldMode } from './WorldModeSelector'
import { WORLD_COLORS } from './theme'

function District({ state, reducedMotion, mode, onModeChange, onScenario, onExplore }: {
  state: WorldState
  reducedMotion: boolean
  mode: WorldMode
  onModeChange: (mode: WorldMode) => void
  onScenario: (kind: 'allow' | 'approval' | 'deny') => void
  onExplore: () => void
}) {
  const controls = useRef<OrbitControlsImpl>(null)
  const active = Boolean(state.request)
  const approvalActive = state.phase === 'AWAITING_APPROVAL'
  const approvedRoute = state.decision?.effect === 'ALLOW' || (state.decision?.effect === 'REQUIRE_APPROVAL' && ['EXECUTING', 'RECEIPTED'].includes(state.phase))
  const denied = state.decision?.effect === 'DENY'

  return (
    <>
      <color attach="background" args={[WORLD_COLORS.abyss]} />
      <fog attach="fog" args={[WORLD_COLORS.fog, 10, 30]} />
      <ambientLight intensity={0.28} color="#29424a" />
      <directionalLight position={[0, 12, 10]} intensity={0.95} color={WORLD_COLORS.cyanGlow} />
      <pointLight position={[-11, 3.5, 0]} intensity={active ? 9 : 3} distance={8} color={WORLD_COLORS.cyan} />
      <pointLight position={[6, 3.5, 0]} intensity={state.phase === 'EXECUTING' ? 12 : 2} distance={8} color={WORLD_COLORS.red} />
      <pointLight position={[11, 3, 0]} intensity={state.phase === 'RECEIPTED' ? 9 : 2} distance={8} color={WORLD_COLORS.cyan} />

      <Grid position={[0, -0.2, 0]} args={[38, 20]} cellSize={0.9} cellThickness={0.45} cellColor="#07232a" sectionSize={3.8} sectionThickness={0.8} sectionColor="#0b4a56" fadeDistance={28} fadeStrength={1.8} infiniteGrid={false} />
      <Infrastructure approvalActive={approvalActive} routeActive={active} resultActive={approvedRoute || denied} />

      <TraceRail points={[[-15, 0.34, 0], [-11, 0.34, 0], [-7, 0.34, 0], [-3, 0.34, 0], [1, 0.34, 0]]} active={active} />
      <TraceRail points={[[1, 0.34, 0], [2, 0.34, 5]]} active={approvalActive} color={WORLD_COLORS.approval} />
      <TraceRail points={[[2, 0.34, 5], [6, 0.34, 0]]} active={state.decision?.effect === 'REQUIRE_APPROVAL' && approvedRoute} color={WORLD_COLORS.red} />
      <TraceRail points={[[1, 0.34, 0], [6, 0.34, 0], [11, 0.34, 0]]} active={approvedRoute || denied} color={denied ? WORLD_COLORS.red : WORLD_COLORS.cyan} />

      {!reducedMotion && <Sparkles count={30} scale={[28, 7, 14]} size={1.6} speed={0.2} color={WORLD_COLORS.cyanGlow} />}

      <Gateway state={state} onScenario={onScenario} />
      <IdentityPlaza state={state} />
      <MandateCorridor state={state} reducedMotion={reducedMotion} />
      <PolicyGate state={state} reducedMotion={reducedMotion} />
      <ApprovalChamber state={state} />
      <ExecutionForge state={state} reducedMotion={reducedMotion} />
      <ReceiptVault state={state} />
      <RequestPacket state={state} reducedMotion={reducedMotion} />
      <Warden state={state} reducedMotion={reducedMotion} />
      <WorldModeSelector mode={mode} onChange={onModeChange} />

      <OrbitControls
        ref={controls}
        makeDefault
        enableDamping={!reducedMotion}
        dampingFactor={0.08}
        minDistance={4.5}
        maxDistance={28}
        minPolarAngle={0.45}
        maxPolarAngle={Math.PI / 2.2}
        maxAzimuthAngle={0.9}
        minAzimuthAngle={-0.9}
        target={[0, 1, 0]}
        onStart={onExplore}
      />
      <CameraRig phase={state.phase} guided={mode === 'GUIDED'} reducedMotion={reducedMotion} controls={controls} />
    </>
  )
}

export function WorldScene(props: {
  state: WorldState
  reducedMotion: boolean
  mode: WorldMode
  onModeChange: (mode: WorldMode) => void
  onScenario: (kind: 'allow' | 'approval' | 'deny') => void
  onExplore: () => void
  onRenderer: (mode: string) => void
}) {
  return (
    <Canvas
      shadows={false}
      dpr={props.reducedMotion ? 1 : [1, 1.5]}
      frameloop={props.reducedMotion ? 'demand' : 'always'}
      camera={{ position: [-19, 8.5, 14], fov: 42, near: 0.1, far: 100 }}
      gl={{ antialias: !props.reducedMotion, alpha: false, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => props.onRenderer(gl.capabilities.isWebGL2 ? 'WEBGL2' : 'WEBGL1')}
    >
      <Suspense fallback={null}>
        <District {...props} />
      </Suspense>
    </Canvas>
  )
}
