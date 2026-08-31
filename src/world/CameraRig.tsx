import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { useFrame, useThree } from '@react-three/fiber'
import type { RefObject } from 'react'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import type { WorldPhase } from '../core/engine'
import { CAMERA_POSITIONS, PHASE_TARGET } from './layout'

export function CameraRig({ phase, guided, reducedMotion, controls }: { phase: WorldPhase; guided: boolean; reducedMotion: boolean; controls: RefObject<OrbitControlsImpl | null> }) {
  const camera = useThree((context) => context.camera)
  const targetPosition = useRef(new THREE.Vector3(...CAMERA_POSITIONS[phase]))
  const targetLook = useRef(new THREE.Vector3(...PHASE_TARGET[phase]))
  const collisionProbe = useRef(new THREE.Vector3())

  useEffect(() => {
    targetPosition.current.set(...CAMERA_POSITIONS[phase])
    targetLook.current.set(PHASE_TARGET[phase][0], 1.05, PHASE_TARGET[phase][2])
    if (guided && reducedMotion) {
      camera.position.copy(targetPosition.current)
      controls.current?.target.copy(targetLook.current)
      controls.current?.update()
    }
  }, [camera, controls, guided, phase, reducedMotion])

  useFrame((_, delta) => {
    if (!guided || reducedMotion) return
    collisionProbe.current.copy(targetPosition.current)
    collisionProbe.current.y = Math.max(collisionProbe.current.y, 2.6)
    camera.position.lerp(collisionProbe.current, 1 - Math.exp(-delta * 1.8))
    if (controls.current) {
      controls.current.target.lerp(targetLook.current, 1 - Math.exp(-delta * 2.2))
      controls.current.update()
    } else camera.lookAt(targetLook.current)
  })
  return null
}
