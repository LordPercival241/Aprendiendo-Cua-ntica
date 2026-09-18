'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

interface FieldNode {
  x: number;
  y: number;
  z: number;
  phase: number;
  drift: number;
  radius: number;
}

interface ProjectedNode extends FieldNode {
  screenX: number;
  screenY: number;
  depth: number;
  scale: number;
}

function seededUnit(index: number, salt: number) {
  const value = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453123;
  return value - Math.floor(value);
}

/** A projected phase-space field, deliberately avoiding decorative atom orbits. */
export function QuantumBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    const nodes: FieldNode[] = Array.from({ length: 88 }, (_, index) => ({
      x: seededUnit(index, 1) * 2 - 1,
      y: seededUnit(index, 2) * 1.35 - 0.68,
      z: seededUnit(index, 3) * 2 - 1,
      phase: seededUnit(index, 4) * Math.PI * 2,
      drift: 0.35 + seededUnit(index, 5) * 0.65,
      radius: 0.75 + seededUnit(index, 6) * 1.5,
    }));

    let frame = 0;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let pixelRatio = 1;
    let time = 0;
    let pointerX = 0;
    let pointerY = 0;
    let targetX = 0;
    let targetY = 0;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dark = resolvedTheme !== 'light';

    const resize = () => {
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const onPointerMove = (event: PointerEvent) => {
      targetX = (event.clientX / Math.max(width, 1) - 0.5) * 2;
      targetY = (event.clientY / Math.max(height, 1) - 0.5) * 2;
    };

    const onPointerLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    const draw = () => {
      time += reducedMotion ? 0 : 0.0035;
      pointerX += (targetX - pointerX) * 0.025;
      pointerY += (targetY - pointerY) * 0.025;
      context.clearRect(0, 0, width, height);

      const centerX = width * 0.5;
      const centerY = height * 0.36;
      const fieldScale = Math.min(width, height) * 0.58;
      const yaw = time * 0.34 + pointerX * 0.12;
      const pitch = -0.18 + pointerY * 0.08;
      const cosYaw = Math.cos(yaw);
      const sinYaw = Math.sin(yaw);
      const cosPitch = Math.cos(pitch);
      const sinPitch = Math.sin(pitch);
      const projected: ProjectedNode[] = nodes.map((node) => {
        const oscillation = reducedMotion ? 0 : Math.sin(time * node.drift + node.phase) * 0.035;
        const xYaw = node.x * cosYaw - (node.z + oscillation) * sinYaw;
        const zYaw = node.x * sinYaw + (node.z + oscillation) * cosYaw;
        const yPitch = node.y * cosPitch - zYaw * sinPitch;
        const zPitch = node.y * sinPitch + zYaw * cosPitch;
        const depth = zPitch + 2.85;
        const scale = 1 / depth;
        return { ...node, depth, scale, screenX: centerX + xYaw * fieldScale * scale, screenY: centerY + yPitch * fieldScale * scale };
      }).sort((a, b) => b.depth - a.depth);

      const glow = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(width, height) * 0.55);
      glow.addColorStop(0, dark ? 'rgba(8, 145, 178, 0.10)' : 'rgba(8, 145, 178, 0.055)');
      glow.addColorStop(0.42, dark ? 'rgba(30, 41, 59, 0.03)' : 'rgba(14, 116, 144, 0.018)');
      glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);

      for (let first = 0; first < projected.length; first += 1) {
        for (let second = first + 1; second < projected.length; second += 1) {
          const a = projected[first];
          const b = projected[second];
          const dx = a.screenX - b.screenX;
          const dy = a.screenY - b.screenY;
          const distanceSquared = dx * dx + dy * dy;
          const threshold = Math.max(42, Math.min(width, height) * 0.13);
          if (distanceSquared > threshold * threshold || Math.abs(a.depth - b.depth) > 0.52) continue;
          const intensity = (1 - Math.sqrt(distanceSquared) / threshold) * Math.min(a.scale, b.scale);
          context.strokeStyle = dark ? `rgba(34, 211, 238, ${Math.max(0, intensity * 0.17)})` : `rgba(8, 145, 178, ${Math.max(0, intensity * 0.12)})`;
          context.lineWidth = Math.max(0.35, intensity * 1.05);
          context.beginPath();
          context.moveTo(a.screenX, a.screenY);
          context.lineTo(b.screenX, b.screenY);
          context.stroke();
        }
      }

      projected.forEach((node) => {
        const pulse = 0.75 + (reducedMotion ? 0 : Math.sin(time * node.drift * 1.8 + node.phase) * 0.25);
        const radius = Math.max(0.5, node.radius * node.scale * 4.2 * pulse);
        const alpha = Math.min(0.7, 0.12 + node.scale * 0.85);
        context.beginPath();
        context.arc(node.screenX, node.screenY, radius, 0, Math.PI * 2);
        context.fillStyle = dark ? `rgba(103, 232, 249, ${alpha})` : `rgba(8, 145, 178, ${alpha})`;
        context.fill();
      });

      if (!reducedMotion) frame = window.requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerleave', onPointerLeave);
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
      window.cancelAnimationFrame(frame);
    };
  }, [resolvedTheme]);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-75 dark:opacity-70" aria-hidden="true" />;
}
