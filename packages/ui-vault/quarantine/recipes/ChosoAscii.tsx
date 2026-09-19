"use client";

import React, { useEffect, useRef } from "react";

export interface ChosoAsciiProps {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  cellSize?: number;
  animated?: boolean;
  pulseSpeed?: number;
  pulseIntensity?: number;
  onReady?: () => void;
}

/**
 * QUARANTINE RECIPE.
 * Canvas2D reimplementation inspired by the user-supplied 21st.dev
 * CHOSO ASCII recipe. It does not copy internal 21st.dev code.
 * The caller supplies its own image through src.
 */
export function ChosoAscii({
  src,
  alt = "",
  width = 960,
  height = 720,
  className = "",
  cellSize = 9,
  animated = true,
  pulseSpeed = 64,
  pulseIntensity = 41,
  onReady,
}: ChosoAsciiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    const source = document.createElement("canvas");
    source.width = width;
    source.height = height;
    const sctx = source.getContext("2d", { willReadFrequently: true });
    if (!sctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    let disposed = false;

    const fitCover = () => {
      const scale = Math.max(width / img.naturalWidth, height / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      const dx = (width - dw) / 2;
      const dy = (height - dh) / 2;
      sctx.clearRect(0, 0, width, height);
      sctx.drawImage(img, dx, dy, dw, dh);
    };

    const toneCurve = (v: number) => {
      const pts = [[0, 0], [0.28, 0.14], [0.72, 0.86], [1, 1]];
      for (let i = 0; i < pts.length - 1; i++) {
        const x0 = pts[i][0], y0 = pts[i][1];
        const x1 = pts[i + 1][0], y1 = pts[i + 1][1];
        if (v >= x0 && v <= x1) {
          const t = (v - x0) / (x1 - x0 || 1);
          return y0 + (y1 - y0) * t;
        }
      }
      return v;
    };

    const bayer = [
      [0, 8, 2, 10],
      [12, 4, 14, 6],
      [3, 11, 1, 9],
      [15, 7, 13, 5],
    ];

    const drawFrame = (time: number) => {
      if (disposed) return;
      ctx.clearRect(0, 0, width, height);

      const imageData = sctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      const speed = Math.max(0.05, pulseSpeed / 100) * 0.0048;
      const amp = Math.max(0, pulseIntensity / 100) * 0.22;
      const pulse = animated ? 1 + Math.sin(time * speed) * amp : 1;

      for (let y = 0; y < height; y += cellSize) {
        for (let x = 0; x < width; x += cellSize) {
          let r = 0, g = 0, b = 0, n = 0;
          const maxY = Math.min(y + cellSize, height);
          const maxX = Math.min(x + cellSize, width);

          for (let sy = y; sy < maxY; sy += 2) {
            for (let sx = x; sx < maxX; sx += 2) {
              const i = (sy * width + sx) * 4;
              r += data[i];
              g += data[i + 1];
              b += data[i + 2];
              n++;
            }
          }

          if (!n) continue;

          r = Math.max(0, Math.min(255, r / n - 16));
          g = Math.max(0, Math.min(255, g / n - 16));
          b = Math.max(0, Math.min(255, b / n - 16));

          let lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
          lum = toneCurve(lum);
          lum = Math.max(0, Math.min(1, lum * pulse));

          const gx = Math.floor(x / cellSize);
          const gy = Math.floor(y / cellSize);
          const threshold = (bayer[gy % 4][gx % 4] + 0.5) / 16;
          const densityBias = 0.24 * 0.18;
          const on = lum + densityBias > threshold;

          ctx.fillStyle = on ? "#f5f5f5" : "#050505";
          ctx.fillRect(x, y, cellSize, cellSize);
        }
      }

      const snapshot = document.createElement("canvas");
      snapshot.width = width;
      snapshot.height = height;
      const snap = snapshot.getContext("2d");

      if (snap) {
        snap.drawImage(canvas, 0, 0);
        ctx.save();
        ctx.globalCompositeOperation = "screen";
        ctx.globalAlpha = 0.14;
        ctx.drawImage(snapshot, 3, 0);
        ctx.globalCompositeOperation = "multiply";
        ctx.globalAlpha = 0.08;
        ctx.drawImage(snapshot, -3, 0);
        ctx.restore();
      }

      if (animated) rafRef.current = requestAnimationFrame(drawFrame);
    };

    img.onload = () => {
      if (disposed) return;
      fitCover();
      onReady?.();
      rafRef.current = requestAnimationFrame(drawFrame);
    };

    img.onerror = () => {
      console.warn("[ChosoAscii] image failed to load. Check URL/CORS permissions.");
    };

    img.src = src;

    return () => {
      disposed = true;
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [src, width, height, cellSize, animated, pulseSpeed, pulseIntensity, onReady]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={alt}
      className={className}
      style={{
        width: "100%",
        height: "auto",
        display: "block",
        imageRendering: "pixelated",
      }}
    />
  );
}

export default ChosoAscii;
