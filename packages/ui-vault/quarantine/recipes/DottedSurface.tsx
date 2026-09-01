'use client'

import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

export interface DottedSurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number
  opacity?: number
  sizeAttenuation?: boolean
  vertexColors?: boolean
  dark?: boolean
}

export default function DottedSurface({className='',size=8,opacity=0.8,sizeAttenuation=true,vertexColors=true,dark=true,...props}:DottedSurfaceProps){
  const containerRef=useRef<HTMLDivElement|null>(null)

  useEffect(()=>{
    const container=containerRef.current
    if(!container)return
    const separation=150, amountX=40, amountY=60
    const scene=new THREE.Scene()
    scene.fog=new THREE.Fog(0xffffff,2000,10000)
    const camera=new THREE.PerspectiveCamera(60,1,1,10000)
    camera.position.set(0,355,1220)
    const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true})
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2))
    renderer.setClearColor(scene.fog.color,0)
    container.appendChild(renderer.domElement)

    const positions:number[]=[]
    const colors:number[]=[]
    for(let ix=0;ix<amountX;ix++){
      for(let iy=0;iy<amountY;iy++){
        positions.push(ix*separation-(amountX*separation)/2,0,iy*separation-(amountY*separation)/2)
        const c=dark?0.78:0
        colors.push(c,c,c)
      }
    }
    const geometry=new THREE.BufferGeometry()
    geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3))
    geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3))
    const material=new THREE.PointsMaterial({size,vertexColors,color:vertexColors?undefined:(dark?0xc8c8c8:0x000000),transparent:true,opacity,sizeAttenuation})
    const points=new THREE.Points(geometry,material)
    scene.add(points)

    const resize=()=>{
      const width=Math.max(1,container.clientWidth)
      const height=Math.max(1,container.clientHeight)
      camera.aspect=width/height
      camera.updateProjectionMatrix()
      renderer.setSize(width,height,false)
    }
    const ro=new ResizeObserver(resize)
    ro.observe(container)
    resize()

    let count=0,animationId=0
    const animate=()=>{
      const attr=geometry.attributes.position
      const arr=attr.array as Float32Array
      let i=0
      for(let ix=0;ix<amountX;ix++){
        for(let iy=0;iy<amountY;iy++){
          arr[i*3+1]=Math.sin((ix+count)*0.3)*50+Math.sin((iy+count)*0.5)*50
          i++
        }
      }
      attr.needsUpdate=true
      renderer.render(scene,camera)
      count+=0.1
      animationId=requestAnimationFrame(animate)
    }
    animationId=requestAnimationFrame(animate)

    return()=>{
      ro.disconnect()
      cancelAnimationFrame(animationId)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      if(renderer.domElement.parentNode===container)container.removeChild(renderer.domElement)
    }
  },[size,opacity,sizeAttenuation,vertexColors,dark])

  return <div ref={containerRef} className={`pointer-events-none fixed inset-0 -z-10 ${className}`} {...props}/>
}
