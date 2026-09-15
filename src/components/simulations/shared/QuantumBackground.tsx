'use client';

import React, { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

export function QuantumBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const handleResize = () => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    let time = 0;
    const isDark = resolvedTheme === 'dark';
    const contours = Array.from({ length: 7 }, (_, index) => ({
      baseline: 0.1 + index * 0.13,
      amplitude: 18 + (index % 3) * 12,
      frequency: 0.004 + (index % 2) * 0.0013,
      speed: 0.22 + (index % 4) * 0.055,
      phase: index * 1.43,
    }));

    const render = () => {
      time += reducedMotion ? 0 : 0.006;
      ctx.clearRect(0, 0, width, height);

      const aura = ctx.createRadialGradient(width * 0.5, height * 0.32, 0, width * 0.5, height * 0.32, Math.max(width, height) * 0.65);
      aura.addColorStop(0, isDark ? 'rgba(8, 145, 178, 0.075)' : 'rgba(14, 116, 144, 0.055)');
      aura.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = aura;
      ctx.fillRect(0, 0, width, height);

      contours.forEach((contour, index) => {
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(0.24, isDark ? 'rgba(34, 211, 238, 0.18)' : 'rgba(8, 145, 178, 0.14)');
        gradient.addColorStop(0.58, isDark ? 'rgba(129, 140, 248, 0.14)' : 'rgba(79, 70, 229, 0.11)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.beginPath();
        for (let x = -40; x <= width + 40; x += 12) {
          const envelope = 0.48 + 0.52 * Math.sin((x / width) * Math.PI);
          const y = height * contour.baseline
            + Math.sin(x * contour.frequency + time * contour.speed + contour.phase) * contour.amplitude * envelope
            + Math.sin(x * contour.frequency * 0.47 - time * contour.speed * 0.7 + contour.phase) * contour.amplitude * 0.28;
          if (x === -40) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = gradient;
        ctx.lineWidth = index === 3 ? 1.15 : 0.75;
        ctx.stroke();
      });

      if (!reducedMotion) animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [resolvedTheme]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-50 dark:opacity-45"
    />
  );
}
