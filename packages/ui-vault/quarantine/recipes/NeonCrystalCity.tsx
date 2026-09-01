'use client'

import React, { useEffect, useRef, useState } from 'react'

export interface NeonCrystalCityProps {
  cameraSpeed?: number
  tileSize?: number
  unionK?: number
  maxSteps?: number
  maxDist?: number
  surfDist?: number
  className?: string
  ariaLabel?: string
}

const vsSource = `#version 300 es
in vec2 a_position;
void main(){gl_Position=vec4(a_position,0.0,1.0);}`

const fsSource = `#version 300 es
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_cameraSpeed;
uniform float u_tileSize;
uniform float u_unionK;
uniform int u_maxSteps;
uniform float u_maxDist;
uniform float u_surfDist;
out vec4 fragColor;
float sdBox(vec3 p,vec3 b){vec3 q=abs(p)-b;return length(max(q,0.0))+min(max(q.x,max(q.y,q.z)),0.0);}
float opSmoothUnion(float d1,float d2,float k){float h=clamp(0.5+0.5*(d2-d1)/k,0.0,1.0);return mix(d2,d1,h)-k*h*(1.0-h);}
float getDist(vec3 p){vec2 id=floor(p.xz/u_tileSize);p.xz=mod(p.xz,u_tileSize)-u_tileSize*0.5;float n=fract(sin(dot(id,vec2(12.9898,78.233)))*43758.5453);float h=1.0+n*4.0;float b=sdBox(p-vec3(0.0,h-1.0,0.0),vec3(0.4,h,0.4));if(n>0.8){float s=length(p-vec3(0.0,h*2.0,0.0))-0.5;b=opSmoothUnion(b,s,u_unionK);}float ground=p.y+1.0;return min(b,ground);}
float rayMarch(vec3 ro,vec3 rd){float dist=0.0;for(int i=0;i<256;i++){if(i>=u_maxSteps) break;vec3 pos=ro+rd*dist;float dS=getDist(pos);dist+=dS;if(dist>u_maxDist||abs(dS)<u_surfDist) break;}return dist;}
vec3 palette(float t){vec3 a=vec3(0.5);vec3 b=vec3(0.5);vec3 c=vec3(1.0,1.0,0.5);vec3 d=vec3(0.8,0.9,0.3);return a+b*cos(6.28318*(c*t+d));}
void main(){vec2 uv=(gl_FragCoord.xy*2.0-u_resolution.xy)/u_resolution.y;vec3 ro=vec3(0.0,0.0,u_time*u_cameraSpeed);vec3 rd=normalize(vec3(uv,1.0));float mx=(u_mouse.x/u_resolution.x-0.5)*3.14;float my=(u_mouse.y/u_resolution.y-0.5)*1.5;mat3 rotX=mat3(1,0,0,0,cos(my),-sin(my),0,sin(my),cos(my));mat3 rotY=mat3(cos(mx),0,sin(mx),0,1,0,-sin(mx),0,cos(mx));rd=rotY*rotX*rd;float dist=rayMarch(ro,rd);vec3 col=vec3(0.0);if(dist<u_maxDist){vec3 p=ro+rd*dist;float idSeed=floor(p.xz/u_tileSize).x*157.0+floor(p.xz/u_tileSize).y*311.0;float n=fract(sin(idSeed)*43758.5453);float lines=max(abs(fract(p.y*2.0)-0.5),0.002);float glow=pow(0.01/lines,1.5);col+=palette(n+u_time*0.1)*glow;}col=mix(col,vec3(0.0,0.0,0.05),smoothstep(0.0,u_maxDist*0.7,dist));fragColor=vec4(col,1.0);}`

export default function NeonCrystalCity({cameraSpeed=5,tileSize=2,unionK=0.5,maxSteps=100,maxDist=100,surfDist=0.001,className='',ariaLabel='Neon Crystal City shader background'}: NeonCrystalCityProps){
  const canvasRef=useRef<HTMLCanvasElement|null>(null)
  const mouse=useRef({x:0,y:0})
  const [error,setError]=useState<string|null>(null)
  useEffect(()=>{
    const canvas=canvasRef.current
    if(!canvas) return
    const gl=canvas.getContext('webgl2')
    if(!gl){setError('WebGL2 not supported');return}
    const compile=(type:GLenum,src:string)=>{const sh=gl.createShader(type);if(!sh)return null;gl.shaderSource(sh,src);gl.compileShader(sh);if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS)){console.error(gl.getShaderInfoLog(sh));setError('Shader compile error');gl.deleteShader(sh);return null}return sh}
    const vs=compile(gl.VERTEX_SHADER,vsSource),fs=compile(gl.FRAGMENT_SHADER,fsSource)
    if(!vs||!fs)return
    const prog=gl.createProgram();if(!prog)return
    gl.attachShader(prog,vs);gl.attachShader(prog,fs);gl.linkProgram(prog)
    if(!gl.getProgramParameter(prog,gl.LINK_STATUS)){setError('Program link error');return}
    const posLoc=gl.getAttribLocation(prog,'a_position')
    const loc=(n:string)=>gl.getUniformLocation(prog,n)
    const quadBuf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,quadBuf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,1,-1,-1,1,1,1,-1]),gl.STATIC_DRAW)
    const onPointer=(e:PointerEvent)=>{const r=canvas.getBoundingClientRect();mouse.current={x:(e.clientX-r.left)*Math.min(devicePixelRatio||1,2),y:(r.height-(e.clientY-r.top))*Math.min(devicePixelRatio||1,2)}}
    canvas.addEventListener('pointermove',onPointer,{passive:true})
    const resize=()=>{const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.max(1,Math.floor(canvas.clientWidth*dpr));canvas.height=Math.max(1,Math.floor(canvas.clientHeight*dpr));gl.viewport(0,0,canvas.width,canvas.height);if(mouse.current.x===0&&mouse.current.y===0)mouse.current={x:canvas.width/2,y:canvas.height/2}}
    const ro=new ResizeObserver(resize);ro.observe(canvas);resize()
    const start=performance.now();let raf=0
    const render=()=>{gl.useProgram(prog);gl.enableVertexAttribArray(posLoc);gl.bindBuffer(gl.ARRAY_BUFFER,quadBuf);gl.vertexAttribPointer(posLoc,2,gl.FLOAT,false,0,0);gl.uniform2f(loc('u_resolution'),canvas.width,canvas.height);gl.uniform1f(loc('u_time'),(performance.now()-start)/1000);gl.uniform2f(loc('u_mouse'),mouse.current.x,mouse.current.y);gl.uniform1f(loc('u_cameraSpeed'),cameraSpeed);gl.uniform1f(loc('u_tileSize'),tileSize);gl.uniform1f(loc('u_unionK'),unionK);gl.uniform1i(loc('u_maxSteps'),Math.min(maxSteps,256));gl.uniform1f(loc('u_maxDist'),maxDist);gl.uniform1f(loc('u_surfDist'),surfDist);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);raf=requestAnimationFrame(render)}
    raf=requestAnimationFrame(render)
    return()=>{cancelAnimationFrame(raf);ro.disconnect();canvas.removeEventListener('pointermove',onPointer);if(quadBuf)gl.deleteBuffer(quadBuf);gl.deleteProgram(prog);gl.deleteShader(vs);gl.deleteShader(fs)}
  },[cameraSpeed,tileSize,unionK,maxSteps,maxDist,surfDist])
  return <div role="region" aria-label={ariaLabel} className={`relative h-full w-full overflow-hidden ${className}`}>{error&&<div className="absolute inset-0 flex items-center justify-center bg-black/80 p-4 font-mono text-white">{error}</div>}<canvas ref={canvasRef} className="block h-full w-full" /></div>
}
