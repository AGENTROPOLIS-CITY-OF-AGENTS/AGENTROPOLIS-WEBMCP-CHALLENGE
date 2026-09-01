import { Html, Line } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import * as THREE from 'three'
import { ExecutionReceipt, OperationCard, SignalCard } from '../../packages/ui-vault/src'
import type { ExecutionReceipt as ExecutionReceiptRecord } from '../core/contracts'
import { governanceEngine } from '../core/engine'
import type { WorldState } from '../core/engine'
import { ZONES } from './layout'
import { WORLD_COLORS } from './theme'
import { WorldLabel } from './WorldLabel'

function Plinth({ size = [3.6, 0.42, 3.2] as [number, number, number], emissive = WORLD_COLORS.cyanDim }: { size?: [number, number, number]; emissive?: string }) {
  return (
    <mesh position={[0, 0.22, 0]} receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color="#0a0f12" emissive={emissive} emissiveIntensity={0.18} metalness={0.85} roughness={0.28} />
    </mesh>
  )
}

export function Gateway({ state, onScenario }: { state: WorldState; onScenario: (kind: 'allow' | 'approval' | 'deny') => void }) {
  const active = state.toolStatus === 'registered'
  const status = active ? 'LIVE TOOL DISCOVERY' : state.toolStatus === 'unsupported' ? 'LOCAL GOVERNED MODE' : 'DISCOVERY CHECK'
  return (
    <group position={ZONES.gateway}>
      <Plinth size={[3.8, 0.45, 3.2]} emissive={active ? WORLD_COLORS.cyan : WORLD_COLORS.cyanDim} />
      <mesh position={[0, 2.15, 0]}>
        <torusGeometry args={[1.25, 0.12, 10, 44]} />
        <meshStandardMaterial color="#0b1418" emissive={WORLD_COLORS.cyan} emissiveIntensity={active ? 1.1 : 0.28} />
      </mesh>
      {[-1, 1].map((x) => (
        <group key={x} position={[x * 1.15, 0.55, 0]}>
          <mesh position={[0, 1.1, 0]}>
            <boxGeometry args={[0.22, 2.25, 0.22]} />
            <meshStandardMaterial color="#11171b" emissive={WORLD_COLORS.cyan} emissiveIntensity={active ? 0.8 : 0.18} />
          </mesh>
          <mesh position={[0, 2.35, 0]}>
            <octahedronGeometry args={[0.2, 0]} />
            <meshStandardMaterial color="#071116" emissive={WORLD_COLORS.red} emissiveIntensity={0.38} />
          </mesh>
        </group>
      ))}
      <Line points={[[-1.15, 1.6, 0], [1.15, 1.6, 0]]} color={WORLD_COLORS.cyan} lineWidth={1.2} transparent opacity={0.72} />
      <WorldLabel title="WEBMCP GATEWAY" role="Structured capability enters the district here." state={status} position={[0, 3.5, -1.7]} />
      <Html transform distanceFactor={8} position={[0, 0.9, 1.9]} rotation={[-Math.PI / 7, 0, 0]}>
        <div className="scenario-console" aria-label="Launch governed request from the Gateway">
          <SignalCard district="webmcp" eyebrow="Gateway Ports" title="Launch Request Packet" status={status}>
            <div className="hud-action-grid">
              <button disabled={state.busy || state.phase === 'AWAITING_APPROVAL'} onClick={() => onScenario('allow')}>INSPECT</button>
              <button disabled={state.busy || state.phase === 'AWAITING_APPROVAL'} onClick={() => onScenario('approval')}>APPROVAL</button>
              <button disabled={state.busy || state.phase === 'AWAITING_APPROVAL'} onClick={() => onScenario('deny')}>DENY</button>
            </div>
          </SignalCard>
        </div>
      </Html>
    </group>
  )
}

export function IdentityPlaza({ state }: { state: WorldState }) {
  const actor = state.request?.actor
  return (
    <group position={ZONES.identity}>
      <Plinth size={[3.9, 0.38, 3.9]} emissive={WORLD_COLORS.cyanDim} />
      <mesh position={[0, 0.42, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.95, 1.55, 48]} />
        <meshBasicMaterial color={WORLD_COLORS.cyan} transparent opacity={0.38} />
      </mesh>
      {[-1, 1].map((x) => (
        <mesh key={x} position={[x * 1.05, 1.2, 0]}>
          <cylinderGeometry args={[0.16, 0.26, 1.85, 8]} />
          <meshStandardMaterial color="#0e1417" emissive={actor ? WORLD_COLORS.red : WORLD_COLORS.cyanDim} emissiveIntensity={actor ? 0.58 : 0.18} />
        </mesh>
      ))}
      <mesh position={[0, 2.25, 0]}>
        <octahedronGeometry args={[0.38, 0]} />
        <meshStandardMaterial color="#071116" emissive={actor ? WORLD_COLORS.red : WORLD_COLORS.cyan} emissiveIntensity={actor ? 0.9 : 0.2} metalness={0.88} />
      </mesh>
      <WorldLabel title="IDENTITY PLAZA" role="The request receives an actor and trace companion." state={actor ? actor.id : 'Awaiting actor bind'} position={[0, 3.45, -1.9]} />
    </group>
  )
}

export function MandateCorridor({ state, reducedMotion }: { state: WorldState; reducedMotion: boolean }) {
  const invalid = Boolean(state.request && !state.request.mandate && ['MANDATE_CHECKED', 'POLICY_DECIDED', 'RECEIPTED'].includes(state.phase))
  const barrier = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (!barrier.current) return
    barrier.current.position.y = invalid ? (reducedMotion ? 1.2 : 1.2 + Math.sin(clock.elapsedTime * 7) * 0.04) : 3.4
  })
  return (
    <group position={ZONES.mandate}>
      <Plinth size={[4.8, 0.34, 2.8]} emissive={invalid ? WORLD_COLORS.redDim : WORLD_COLORS.cyanDim} />
      {[-0.85, 0.85].map((z) => (
        <group key={z} position={[0, 0.4, z]}>
          <mesh position={[0, 0.8, 0]}>
            <boxGeometry args={[4.1, 1.6, 0.1]} />
            <meshStandardMaterial color="#0d1316" emissive={WORLD_COLORS.cyanDim} emissiveIntensity={0.22} />
          </mesh>
          <Line points={[[-2.05, 1.65, 0], [2.05, 1.65, 0]]} color={invalid ? WORLD_COLORS.red : WORLD_COLORS.cyan} lineWidth={0.9} transparent opacity={0.45} />
        </group>
      ))}
      <mesh position={[0, 2.05, 0]}>
        <boxGeometry args={[4.2, 0.14, 1.85]} />
        <meshStandardMaterial color="#0a1013" emissive={WORLD_COLORS.cyanDim} emissiveIntensity={0.16} />
      </mesh>
      <mesh ref={barrier} position={[0, invalid ? 1.2 : 3.4, 0]}>
        <boxGeometry args={[0.32, 2.05, 1.8]} />
        <meshStandardMaterial color="#180406" emissive={WORLD_COLORS.red} emissiveIntensity={invalid ? 1.5 : 0.12} transparent opacity={invalid ? 0.84 : 0.08} />
      </mesh>
      {!reducedMotion && invalid && (
        <pointLight color={WORLD_COLORS.red} intensity={8} distance={5} position={[0, 1.6, 0]} />
      )}
      <WorldLabel title="MANDATE CORRIDOR" role="Intent must fit delegated authority before passage." state={invalid ? 'Route physically blocked' : state.request?.mandate ?? 'Awaiting mandate'} position={[0, 3.2, -1.7]} />
    </group>
  )
}

export function PolicyGate({ state, reducedMotion }: { state: WorldState; reducedMotion: boolean }) {
  const left = useRef<THREE.Mesh>(null)
  const right = useRef<THREE.Mesh>(null)
  const effect = state.decision?.effect
  const open = effect === 'ALLOW' || (effect === 'REQUIRE_APPROVAL' && ['EXECUTING', 'RECEIPTED'].includes(state.phase))
  const color = effect === 'DENY' ? WORLD_COLORS.red : effect === 'REQUIRE_APPROVAL' ? WORLD_COLORS.approval : WORLD_COLORS.cyan
  useFrame((_, delta) => {
    const target = open ? 1.25 : 0.46
    const amount = reducedMotion ? target : THREE.MathUtils.damp(left.current?.position.z ?? 0.46, target, 7, delta)
    if (left.current) left.current.position.z = amount
    if (right.current) right.current.position.z = -amount
  })
  return (
    <group position={ZONES.policy}>
      <Plinth size={[3.8, 0.42, 3.6]} emissive={WORLD_COLORS.cyanDim} />
      <mesh position={[0, 2.1, 1.55]}><boxGeometry args={[0.58, 3.9, 0.42]} /><meshStandardMaterial color="#090e11" emissive={color} emissiveIntensity={0.55} /></mesh>
      <mesh position={[0, 2.1, -1.55]}><boxGeometry args={[0.58, 3.9, 0.42]} /><meshStandardMaterial color="#090e11" emissive={color} emissiveIntensity={0.55} /></mesh>
      <mesh position={[0, 3.4, 0]}><boxGeometry args={[0.48, 0.22, 3.18]} /><meshStandardMaterial color="#10161a" emissive={color} emissiveIntensity={0.48} /></mesh>
      <mesh ref={left} position={[0, 1.8, 0.46]}><boxGeometry args={[0.34, 2.7, 1.25]} /><meshStandardMaterial color="#0c1013" emissive={color} emissiveIntensity={0.88} /></mesh>
      <mesh ref={right} position={[0, 1.8, -0.46]}><boxGeometry args={[0.34, 2.7, 1.25]} /><meshStandardMaterial color="#0c1013" emissive={color} emissiveIntensity={0.88} /></mesh>
      <WorldLabel title="POLICY GATE" role="Deterministic policy opens, stops, or diverts the route." state={effect ?? 'Awaiting decision'} position={[0, 4.15, -1.8]} />
    </group>
  )
}

export function ApprovalChamber({ state }: { state: WorldState }) {
  const waiting = state.phase === 'AWAITING_APPROVAL'
  const [error, setError] = useState('')
  const approve = async () => {
    setError('')
    try {
      await governanceEngine.approve('human.visitor')
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Approval failed.')
    }
  }
  const deny = () => {
    setError('')
    try {
      governanceEngine.denyApproval('human.visitor')
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Decision failed.')
    }
  }
  return (
    <group position={ZONES.approval}>
      <Plinth size={[4.2, 0.32, 4.2]} emissive="#201129" />
      <Line points={[[-1.2, 0.38, -1.2], [1.2, 0.38, -1.2], [1.2, 0.38, 1.2], [-1.2, 0.38, 1.2], [-1.2, 0.38, -1.2]]} color={WORLD_COLORS.approval} lineWidth={1.2} transparent opacity={0.42} />
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.9, 1.28, 2.55, 12, 1, true]} />
        <meshStandardMaterial color="#0e0b14" emissive={WORLD_COLORS.approval} emissiveIntensity={waiting ? 0.7 : 0.14} wireframe />
      </mesh>
      <mesh position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.72, 0.72, 0.18, 24]} />
        <meshStandardMaterial color="#141018" emissive={WORLD_COLORS.approval} emissiveIntensity={waiting ? 0.8 : 0.12} />
      </mesh>
      <pointLight color={WORLD_COLORS.approval} intensity={waiting ? 10 : 1} distance={7} position={[0, 2, 0]} />
      <WorldLabel title="APPROVAL CHAMBER" role="A distinct human releases or terminates the paused request." state={waiting ? 'Request paused here' : 'Standby branch'} position={[0, 3.75, -1.75]} />
      {waiting && (
        <Html transform position={[0, 1.15, 1.45]} distanceFactor={7}>
          <div className="approval-console">
            <OperationCard
              district="webmcp"
              stage="Human Approval"
              title={state.request?.action.replaceAll('_', ' ') ?? 'Paused Request'}
              summary="A separate human identity must release or terminate the paused packet before execution resumes."
              status="REQUIRE_APPROVAL"
              meta={[`actor:${state.request?.actor.id ?? 'unknown'}`, `mandate:${state.request?.mandate ?? 'none'}`]}
            >
              <div className="hud-action-grid hud-action-grid--stack">
                <button onClick={approve}>AUTHORIZE</button>
                <button className="deny" onClick={deny}>DECLINE</button>
              </div>
              {error && <small>{error}</small>}
            </OperationCard>
          </div>
        </Html>
      )}
    </group>
  )
}

export function ExecutionForge({ state, reducedMotion }: { state: WorldState; reducedMotion: boolean }) {
  const rotor = useRef<THREE.Group>(null)
  const executing = state.phase === 'EXECUTING'
  useFrame((_, delta) => {
    if (rotor.current && executing && !reducedMotion) rotor.current.rotation.y += delta * 2.6
  })
  return (
    <group position={ZONES.forge}>
      <Plinth size={[4.5, 0.42, 3.3]} emissive={WORLD_COLORS.redDim} />
      <mesh position={[0, 1.35, 0]}>
        <cylinderGeometry args={[0.9, 1.2, 2.1, 10]} />
        <meshStandardMaterial color="#130d0f" emissive={WORLD_COLORS.red} emissiveIntensity={executing ? 1.1 : 0.22} />
      </mesh>
      <group ref={rotor} position={[0, 1.6, 0]}>
        {[0, Math.PI / 2].map((rotation) => (
          <mesh key={rotation} rotation={[rotation, 0, 0]}>
            <torusGeometry args={[1.05, 0.12, 8, 28]} />
            <meshStandardMaterial color="#111417" emissive={WORLD_COLORS.red} emissiveIntensity={executing ? 0.9 : 0.18} />
          </mesh>
        ))}
      </group>
      <mesh position={[0, 2.55, 0]}>
        <boxGeometry args={[0.26, 0.95, 0.26]} />
        <meshStandardMaterial color="#101215" emissive={WORLD_COLORS.cyan} emissiveIntensity={0.24} />
      </mesh>
      <pointLight color={WORLD_COLORS.redGlow} intensity={executing ? 12 : 1.5} distance={8} position={[0, 2.1, 0]} />
      <WorldLabel title="EXECUTION FORGE" role="Bounded action runs only after governance clears passage." state={executing ? 'Active execution' : 'Standby'} position={[0, 3.9, -1.75]} />
    </group>
  )
}

function ReceiptArtifact({ receipt, index, selected }: { receipt: ExecutionReceiptRecord; index: number; selected: boolean }) {
  const color = receipt.status === 'EXECUTED' ? WORLD_COLORS.success : receipt.status === 'DENIED' ? WORLD_COLORS.red : WORLD_COLORS.approval
  return (
    <mesh position={[(index % 3) * 0.9 - 0.9, 0.95 + Math.floor(index / 3) * 0.8, 0]} onClick={(event) => { event.stopPropagation(); governanceEngine.selectReceipt(selected ? null : receipt.receiptId) }}>
      <octahedronGeometry args={[selected ? 0.36 : 0.28, 0]} />
      <meshStandardMaterial color="#06090b" emissive={color} emissiveIntensity={selected ? 1.8 : 0.85} metalness={0.84} roughness={0.2} />
    </mesh>
  )
}

export function ReceiptVault({ state }: { state: WorldState }) {
  const selected = state.receipts.find((receipt) => receipt.receiptId === state.selectedReceiptId)
  return (
    <group position={ZONES.vault}>
      <Plinth size={[4.8, 0.48, 4]} emissive={WORLD_COLORS.cyanDim} />
      <mesh position={[0, 2.1, 0]}><cylinderGeometry args={[1.45, 1.75, 3.85, 10, 1, true]} /><meshStandardMaterial color="#071014" emissive={WORLD_COLORS.cyan} emissiveIntensity={0.22} wireframe /></mesh>
      {[-0.95, 0, 0.95].map((x) => (
        <mesh key={x} position={[x, 1.45, -1.15]}>
          <boxGeometry args={[0.28, 2.2, 0.18]} />
          <meshStandardMaterial color="#11161a" emissive={WORLD_COLORS.cyan} emissiveIntensity={0.38} />
        </mesh>
      ))}
      {state.receipts.slice(-9).map((receipt, index) => <ReceiptArtifact key={receipt.receiptId} receipt={receipt} index={index} selected={receipt.receiptId === state.selectedReceiptId} />)}
      <WorldLabel title="RECEIPT VAULT" role="Immutable outcome artifacts enter the audit ledger here." state={`${state.receipts.length} archived`} position={[0, 4, -1.8]} />
      {selected && (
        <Html transform position={[0, 2.1, 1.85]} distanceFactor={8}>
          <article className="receipt-inspector">
            <button aria-label="Close receipt" onClick={() => governanceEngine.selectReceipt(null)}>X</button>
            <ExecutionReceipt
              receiptId={selected.receiptId}
              decision={selected.decision}
              status={selected.status}
              actor={selected.approvedBy ?? state.request?.actor.id ?? 'system'}
              summary={selected.policyReasons[0]}
            />
            <dl>
              <dt>Request</dt><dd>{selected.requestId}</dd>
              <dt>Tool</dt><dd>{selected.tool}</dd>
              <dt>Approved by</dt><dd>{selected.approvedBy ?? 'None'}</dd>
              <dt>Executed at</dt><dd>{selected.executedAt ?? 'Not executed'}</dd>
            </dl>
          </article>
        </Html>
      )}
    </group>
  )
}
