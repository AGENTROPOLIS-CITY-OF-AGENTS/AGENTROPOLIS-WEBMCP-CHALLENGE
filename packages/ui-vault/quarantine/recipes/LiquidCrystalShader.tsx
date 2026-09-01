'use client'

import React, { useEffect, useRef } from 'react'

type ShaderParams={hue:number;speed:number;noise:number;warp:number;zoom:number;brightness:number}

function useWebGLShader(canvasRef:React.RefObject<HTMLCanvasElement|null>,fragmentShader:string,props:ShaderParams){
  const mousePos=useRef({x:0.5,y:0.5})
  useEffect(()=>{
    const canvas=canvasRef.current
    if(!canvas)return
    const gl=canvas.getContext('webgl',{antialias:true})
    if(!gl){console.error('WebGL is not supported in this browser.');return}
    const vertexShaderSource='attribute vec2 position; void main(){ gl_Position=vec4(position,0.0,1.0); }'
    const compile=(source:string,type:number)=>{const shader=gl.createShader(type);if(!shader)return null;gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){console.error(gl.getShaderInfoLog(shader));gl.deleteShader(shader);return null}return shader}
    const vertexShader=compile(vertexShaderSource,gl.VERTEX_SHADER)
    const fragShader=compile(fragmentShader,gl.FRAGMENT_SHADER)
    if(!vertexShader||!fragShader)return
    const program=gl.createProgram();if(!program)return
    gl.attachShader(program,vertexShader);gl.attachShader(program,fragShader);gl.linkProgram(program)
    if(!gl.getProgramParameter(program,gl.LINK_STATUS)){console.error(gl.getProgramInfoLog(program));return}
    gl.useProgram(program)
    const vertexBuffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW)
    const positionAttributeLocation=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(positionAttributeLocation);gl.vertexAttribPointer(positionAttributeLocation,2,gl.FLOAT,false,0,0)
    const loc=(n:string)=>gl.getUniformLocation(program,n)
    const onPointer=(e:PointerEvent)=>{const r=canvas.getBoundingClientRect();mousePos.current={x:(e.clientX-r.left)/Math.max(1,r.width),y:1-(e.clientY-r.top)/Math.max(1,r.height)}}
    canvas.addEventListener('pointermove',onPointer,{passive:true})
    const resize=()=>{const dpr=Math.min(window.devicePixelRatio||1,2);canvas.width=Math.max(1,Math.floor(canvas.clientWidth*dpr));canvas.height=Math.max(1,Math.floor(canvas.clientHeight*dpr));gl.viewport(0,0,canvas.width,canvas.height);gl.uniform2f(loc('iResolution'),canvas.width,canvas.height)}
    const ro=new ResizeObserver(resize);ro.observe(canvas);resize()
    const start=performance.now();let raf=0
    const animate=()=>{const time=((performance.now()-start)/1000)*props.speed;gl.uniform1f(loc('iTime'),time);gl.uniform2f(loc('iMouse'),mousePos.current.x,mousePos.current.y);gl.uniform1f(loc('uHue'),props.hue);gl.uniform1f(loc('uNoise'),props.noise);gl.uniform1f(loc('uWarp'),props.warp);gl.uniform1f(loc('uZoom'),props.zoom);gl.uniform1f(loc('uBrightness'),props.brightness);gl.drawArrays(gl.TRIANGLES,0,6);raf=requestAnimationFrame(animate)}
    raf=requestAnimationFrame(animate)
    return()=>{cancelAnimationFrame(raf);ro.disconnect();canvas.removeEventListener('pointermove',onPointer);if(vertexBuffer)gl.deleteBuffer(vertexBuffer);gl.deleteProgram(program);gl.deleteShader(vertexShader);gl.deleteShader(fragShader)}
  },[canvasRef,fragmentShader,props.hue,props.speed,props.noise,props.warp,props.zoom,props.brightness])
}

export const ControlsPanel=({params,onParamChange}:{params:ShaderParams;onParamChange:(key:keyof ShaderParams)=>(e:React.ChangeEvent<HTMLInputElement>)=>void})=><div className="absolute left-4 top-4 w-[340px] rounded-2xl border border-white/10 bg-gray-900/60 p-6 text-white shadow-2xl backdrop-blur-xl"><h1 className="mb-6 text-2xl font-bold tracking-wider text-white/90">Liquid Crystal</h1>{([
['Hue','hue',0,360,1],['Speed','speed',0,2,0.01],['Noise','noise',0,1,0.01],['Warp','warp',0,0.5,0.01],['Zoom','zoom',0.5,5,0.01],['Brightness','brightness',0.1,2,0.01]
] as const).map(([name,key,min,max,step])=><div className="mb-4" key={key}><label htmlFor={key} className="mb-2 block text-sm font-medium text-white/80">{name}: {params[key].toFixed(step<1?2:0)}</label><input id={key} type="range" min={min} max={max} step={step} value={params[key]} onChange={onParamChange(key)} className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-white/10 accent-cyan-500"/></div>)}</div>

export const InteractiveShader=(props:ShaderParams)=>{
  const canvasRef=useRef<HTMLCanvasElement|null>(null)
  const fragmentShader=`precision highp float;uniform float iTime;uniform vec2 iResolution;uniform vec2 iMouse;uniform float uHue;uniform float uNoise;uniform float uWarp;uniform float uZoom;uniform float uBrightness;
  vec3 hsv2rgb(vec3 c){vec3 rgb=clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0,0.0,1.0);return c.z*mix(vec3(1.0),rgb,c.y);} vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;} vec2 mod289(vec2 x){return x-floor(x*(1.0/289.0))*289.0;} vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);} float snoise(vec2 v){const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);vec2 i=floor(v+dot(v,C.yy));vec2 x0=v-i+dot(i,C.xx);vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);vec4 x12=x0.xyxy+C.xxzz;x12.xy-=i1;i=mod289(i);vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);m=m*m;m=m*m;vec3 x=2.0*fract(p*C.www)-1.0;vec3 h=abs(x)-0.5;vec3 ox=floor(x+0.5);vec3 a0=x-ox;m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);vec3 g;g.x=a0.x*x0.x+h.x*x0.y;g.yz=a0.yz*x12.xz+h.yz*x12.yw;return 130.0*dot(m,g);} void main(){vec2 uv=(gl_FragCoord.xy*2.0-iResolution.xy)/min(iResolution.x,iResolution.y);uv*=uZoom;vec2 mouseUv=(iMouse*2.0-1.0);mouseUv.y*=-1.0;uv+=mouseUv*uWarp;float time=iTime*0.5;float noise_pattern=snoise(uv*1.5+vec2(time*0.3,-time*0.2))*0.5;noise_pattern+=snoise(uv*3.0+vec2(-time*0.2,time*0.3))*0.25;noise_pattern=(noise_pattern+1.0)*0.5;float bands=sin(noise_pattern*15.0-time*2.0);bands=smoothstep(0.4,0.6,bands);float detail=snoise(uv*10.0+time)*0.5+0.5;bands=mix(bands,bands+detail,uNoise);vec3 baseColor=hsv2rgb(vec3(uHue/360.0,0.7,1.0));vec3 color=baseColor*bands*uBrightness;gl_FragColor=vec4(color,1.0);}`
  useWebGLShader(canvasRef,fragmentShader,props)
  return <canvas ref={canvasRef} className="absolute left-0 top-0 h-full w-full"/>
}

export default ControlsPanel
