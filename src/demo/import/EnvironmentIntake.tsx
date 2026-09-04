import { Canvas } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { useEffect, useMemo, useState } from 'react'
import * as THREE from 'three'

type ImportStatus = 'idle' | 'ready' | 'loading' | 'loaded' | 'error'

function ImportedScene({ url, onInventory }: { url: string; onInventory: (count: number, names: string[]) => void }) {
  const { scene } = useGLTF(url)
  const clone = useMemo(() => {
    const next = scene.clone(true)
    next.traverse((node) => { if (node instanceof THREE.Mesh) { node.frustumCulled = false; node.castShadow = false; node.receiveShadow = false } })
    next.updateMatrixWorld(true)
    const box = new THREE.Box3().setFromObject(next)
    const size = box.getSize(new THREE.Vector3())
    const scale = 5 / Math.max(size.x, size.y, size.z, 0.001)
    next.scale.setScalar(scale)
    const normalized = new THREE.Box3().setFromObject(next)
    const center = normalized.getCenter(new THREE.Vector3())
    next.position.sub(center)
    return next
  }, [scene])
  useEffect(() => {
    const names: string[] = []
    clone.traverse((node) => { if (node.name && (node instanceof THREE.Mesh || node.children.length === 0)) names.push(node.name) })
    onInventory(names.length, names.slice(0, 24))
  }, [clone, onInventory])
  return <primitive object={clone} />
}

export function EnvironmentIntake({ onSample }: { onSample: () => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [url, setUrl] = useState('')
  const [status, setStatus] = useState<ImportStatus>('idle')
  const [error, setError] = useState('')
  const [objectCount, setObjectCount] = useState(0)
  const [names, setNames] = useState<string[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [allowed, setAllowed] = useState<Record<string, boolean>>({ inspect: true, translate: false, rotate: false, material: false, intensity: false })
  const [showImport, setShowImport] = useState(false)

  useEffect(() => () => { if (url) URL.revokeObjectURL(url) }, [url])
  const choose = (next: File | undefined) => {
    if (!next) return
    if (!/\.(glb|gltf)$/i.test(next.name)) { setError('Only .glb and .gltf files are supported.'); setStatus('error'); return }
    if (url) URL.revokeObjectURL(url)
    setFile(next); setUrl(URL.createObjectURL(next)); setError(''); setStatus('ready'); setObjectCount(0); setNames([]); setSelected(null)
  }
  const load = () => { if (file) { setStatus('loading'); setError('') } }
  const onInventory = (count: number, inventory: string[]) => { setObjectCount(count); setNames(inventory); setStatus('loaded') }
  const toggles = Object.keys(allowed)
  return <section className="environment-intake" aria-labelledby="environment-intake-title">
    <div className="environment-intake-header"><p className="section-kicker">PARALLAX // USER ENVIRONMENT</p><h2 id="environment-intake-title">LOAD A 3D ENVIRONMENT</h2><p>Import a GLB or glTF scene. PARALLAX will inspect the scene graph and prepare it for governed agent interaction.</p></div>
    {!file || status === 'idle' || status === 'error' ? <div className="environment-choice"><div className="environment-choice-cards"><article><strong>YOUR 3D WORLD</strong><span>Import GLB / glTF</span><button className="environment-choice-primary" type="button" onClick={() => setShowImport(true)}>LOAD ENVIRONMENT</button></article><article><strong>PARALLAX SAMPLE STUDIO</strong><span>No upload required</span><button type="button" className="parallax-secondary-cta" onClick={onSample}>OPEN SAMPLE</button></article></div>{showImport ? <><input id="environment-file" type="file" accept=".glb,.gltf,model/gltf-binary,model/gltf+json" hidden onChange={(event) => choose(event.target.files?.[0])} /><label className="environment-file-trigger" htmlFor="environment-file">CHOOSE GLB / GLTF FILE</label><div className="environment-dropzone" onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); choose(event.dataTransfer.files[0]) }}>DROP A .GLB OR .GLTF HERE<br /><small>Supported formats: .glb, .gltf</small></div></> : null}{error ? <p className="environment-error" role="alert">ENVIRONMENT LOAD FAILED · {error}<br />TRY ANOTHER FILE · USE SAMPLE STUDIO</p> : null}</div> : <div className="environment-workspace">
      <div className="environment-meta"><strong>{file.name}</strong><span>{(file.size / 1024 / 1024).toFixed(2)} MB · {status === 'loaded' ? 'SCENE GRAPH READY' : status.toUpperCase()}</span></div>
      {status === 'ready' ? <button type="button" className="environment-choice-primary" onClick={load}>LOAD ENVIRONMENT</button> : null}
      <div className="environment-viewport"><Canvas camera={{ position: [0, 2.5, 7], fov: 42 }} gl={{ alpha: true }}><ambientLight intensity={1.2} /><directionalLight position={[3, 5, 4]} intensity={2} />{url && status !== 'ready' ? <ImportedScene url={url} onInventory={onInventory} /> : null}</Canvas></div>
      <aside className="environment-inventory"><strong>OBJECTS FOUND · {objectCount}</strong><div>{names.map((name) => <button type="button" key={name} className={selected === name ? 'is-selected' : ''} onClick={() => setSelected(name)}>{name}</button>)}</div>{selected ? <div className="environment-capabilities"><b>SELECTED OBJECT</b><span>{selected}</span><b>CAPABILITIES</b>{toggles.map((capability) => <label key={capability}><input type="checkbox" checked={allowed[capability]} onChange={() => setAllowed((current) => ({ ...current, [capability]: !current[capability] }))} /> {capability.toUpperCase()}</label>)}</div> : <p>Select an imported object to configure conservative capabilities.</p>}<button type="button" className="parallax-secondary-cta" onClick={onSample}>USE SAMPLE STUDIO</button></aside>
    </div>}
  </section>
}
