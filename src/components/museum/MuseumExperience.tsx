'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Pause, Play, Sparkles } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { KaTeXRenderer } from '@/components/math/KaTeXRenderer';

type ArtworkId = 'planck' | 'young' | 'born';

interface Artwork {
  id: ArtworkId;
  year: string;
  title: string;
  figure: string;
  premise: string;
  formula: string;
  observation: string;
  moduleHref: string;
}

const ARTWORKS: Artwork[] = [
  {
    id: 'planck',
    year: '1900',
    title: 'La escalera de la energía',
    figure: 'Max Planck',
    premise: 'La energía deja de ser continua: cada escalón representa un cuanto permitido.',
    formula: String.raw`E_n=n h\nu`,
    observation: 'La discretización del intercambio energético elimina la divergencia ultravioleta.',
    moduleHref: '/modulos/01-introduccion-fisica-moderna',
  },
  {
    id: 'young',
    year: '1927',
    title: 'La evidencia de la interferencia',
    figure: 'Dualidad onda-partícula',
    premise: 'Las detecciones individuales construyen una distribución que solo explica la coherencia.',
    formula: String.raw`\frac{I(\theta)}{I_0}=\left(\frac{\sin\beta}{\beta}\right)^2\cos^2\delta`,
    observation: 'El patrón no es una decoración: codifica diferencias de fase observables.',
    moduleHref: '/modulos/03-dualidad-onda-particula',
  },
  {
    id: 'born',
    year: '1926',
    title: 'Materia de probabilidad',
    figure: 'Max Born',
    premise: 'El estado no describe una órbita; describe amplitudes y probabilidades de detección.',
    formula: String.raw`\rho(\mathbf r,t)=|\psi(\mathbf r,t)|^2`,
    observation: 'La densidad espacial es una predicción estadística, no la trayectoria de una partícula.',
    moduleHref: '/modulos/04-ecuacion-schrodinger',
  },
];

function unit(index: number, salt: number) {
  const value = Math.sin(index * 91.73 + salt * 127.19) * 15341.731;
  return value - Math.floor(value);
}

const probabilityCloud = Array.from({ length: 280 }, (_, index) => {
  const sign = index % 2 === 0 ? 1 : -1;
  const radius = Math.sqrt(unit(index, 1)) * 0.78;
  const angle = unit(index, 2) * Math.PI * 2;
  return {
    x: Math.cos(angle) * radius,
    y: sign * (0.2 + unit(index, 3) * 0.82) * Math.exp(-radius * radius * 1.8),
    z: Math.sin(angle) * radius,
    phase: unit(index, 4) * Math.PI * 2,
  };
});

export function MuseumExperience() {
  const [activeId, setActiveId] = useState<ArtworkId>('planck');
  const [paused, setPaused] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const active = useMemo(() => ARTWORKS.find((artwork) => artwork.id === activeId) ?? ARTWORKS[0], [activeId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    let frame = 0;
    let visible = true;
    let lastDraw = 0;
    let time = 0;
    let pointerX = 0;
    let pointerY = 0;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const renderPlanck = (width: number, height: number) => {
      const left = width * 0.16;
      const base = height * 0.77;
      const stepWidth = width * 0.075;
      const gap = height * 0.095;
      context.strokeStyle = 'rgba(103,232,249,0.82)';
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(left, base);
      for (let level = 0; level < 6; level += 1) {
        const y = base - level * gap;
        const x = left + level * stepWidth;
        context.lineTo(x + stepWidth, y);
        if (level < 5) context.lineTo(x + stepWidth, y - gap);
      }
      context.stroke();
      for (let level = 0; level < 6; level += 1) {
        const x = left + (level + 0.5) * stepWidth;
        const y = base - level * gap - 14;
        const pulse = 0.6 + Math.sin(time * 1.4 + level) * 0.25;
        context.beginPath();
        context.arc(x, y, 3 + pulse * 3, 0, Math.PI * 2);
        context.fillStyle = `rgba(129,140,248,${pulse})`;
        context.fill();
      }
      context.strokeStyle = 'rgba(103,232,249,0.28)';
      context.lineWidth = 1;
      context.beginPath();
      for (let x = width * 0.55; x <= width * 0.9; x += 3) {
        const phase = (x - width * 0.55) * 0.042 - time * 1.8;
        const envelope = Math.exp(-(((x - width * 0.72) / (width * 0.13)) ** 2));
        const y = height * 0.49 + Math.sin(phase) * height * 0.13 * envelope;
        if (x === width * 0.55) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.stroke();
    };

    const renderInterference = (width: number, height: number) => {
      const centerX = width * 0.5;
      const top = height * 0.14;
      const bottom = height * 0.83;
      for (let x = 0; x < width; x += 2) {
        const position = (x - centerX) / width;
        const envelope = Math.exp(-position * position * 22);
        const intensity = envelope * Math.cos(position * 44 + time * 0.4) ** 2;
        context.strokeStyle = `rgba(103,232,249,${0.04 + intensity * 0.8})`;
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(x, top);
        context.lineTo(x, bottom);
        context.stroke();
      }
      context.strokeStyle = 'rgba(129,140,248,0.7)';
      context.lineWidth = 1.5;
      context.beginPath();
      for (let x = 0; x <= width; x += 3) {
        const position = (x - centerX) / width;
        const envelope = Math.exp(-position * position * 22);
        const intensity = envelope * Math.cos(position * 44 + time * 0.4) ** 2;
        const y = bottom + 18 - intensity * height * 0.17;
        if (x === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.stroke();
      context.fillStyle = 'rgba(255,255,255,0.66)';
      context.fillRect(centerX - 3, top - 22, 6, 12);
      context.fillRect(centerX + 3, top - 22, 6, 12);
    };

    const renderBorn = (width: number, height: number) => {
      const centerX = width * 0.5;
      const centerY = height * 0.49;
      const scale = Math.min(width, height) * 0.54;
      const rotation = time * 0.34 + pointerX * 0.45;
      const tilt = pointerY * 0.28;
      probabilityCloud.forEach((point) => {
        const x = point.x * Math.cos(rotation) - point.z * Math.sin(rotation);
        const z = point.x * Math.sin(rotation) + point.z * Math.cos(rotation);
        const y = point.y * Math.cos(tilt) - z * Math.sin(tilt);
        const depth = z + 1.9;
        const size = (1 / depth) * (1.4 + Math.sin(time + point.phase) * 0.35);
        context.beginPath();
        context.arc(centerX + x * scale / depth, centerY + y * scale / depth, Math.max(0.45, size * 2.4), 0, Math.PI * 2);
        context.fillStyle = point.y > 0 ? 'rgba(103,232,249,0.62)' : 'rgba(129,140,248,0.52)';
        context.fill();
      });
      context.strokeStyle = 'rgba(255,255,255,0.18)';
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(centerX - scale * 0.58, centerY);
      context.lineTo(centerX + scale * 0.58, centerY);
      context.stroke();
    };

    const draw = (timestamp: number) => {
      if (!visible || paused) return;
      if (!reducedMotion && timestamp - lastDraw < 33) {
        frame = requestAnimationFrame(draw);
        return;
      }
      lastDraw = timestamp;
      if (!reducedMotion) time += 0.028;
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      context.clearRect(0, 0, width, height);
      context.fillStyle = '#050609';
      context.fillRect(0, 0, width, height);
      const halo = context.createRadialGradient(width * 0.5, height * 0.46, 0, width * 0.5, height * 0.46, width * 0.55);
      halo.addColorStop(0, 'rgba(8,145,178,0.16)');
      halo.addColorStop(1, 'rgba(0,0,0,0)');
      context.fillStyle = halo;
      context.fillRect(0, 0, width, height);
      if (activeId === 'planck') renderPlanck(width, height);
      if (activeId === 'young') renderInterference(width, height);
      if (activeId === 'born') renderBorn(width, height);
      if (!reducedMotion) frame = requestAnimationFrame(draw);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !paused) frame = requestAnimationFrame(draw);
    }, { threshold: 0.08 });
    const resizeObserver = new ResizeObserver(resize);
    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerX = (event.clientX - rect.left) / rect.width - 0.5;
      pointerY = (event.clientY - rect.top) / rect.height - 0.5;
    };

    resize();
    observer.observe(canvas);
    resizeObserver.observe(canvas);
    canvas.addEventListener('pointermove', onPointerMove);
    draw(0);
    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      canvas.removeEventListener('pointermove', onPointerMove);
      cancelAnimationFrame(frame);
    };
  }, [activeId, paused]);

  return (
    <section className="grid gap-6 lg:grid-cols-[15rem_minmax(0,1fr)_20rem]" aria-label="Obras inmersivas de mecánica cuántica">
      <div className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
        {ARTWORKS.map((artwork) => {
          const selected = artwork.id === activeId;
          return <button key={artwork.id} type="button" onClick={() => setActiveId(artwork.id)} aria-pressed={selected} className={`min-w-[14rem] rounded-xl border p-4 text-left transition-colors lg:min-w-0 ${selected ? 'border-cyan-400/60 bg-cyan-950/30 text-white' : 'border-zinc-800 bg-black/70 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'}`}>
            <span className="block font-mono text-[11px] tracking-[0.14em] text-cyan-400">{artwork.year}</span>
            <strong className="mt-1 block text-sm font-semibold">{artwork.title}</strong>
            <span className="mt-1 block text-xs text-zinc-500">{artwork.figure}</span>
          </button>;
        })}
      </div>

      <div className="relative min-h-[25rem] overflow-hidden rounded-2xl border border-zinc-800 bg-black shadow-2xl shadow-cyan-950/20">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-label={`Obra generativa: ${active.title}`} />
        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-5 sm:p-6">
          <div><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-cyan-300">Archivo cuántico / {active.year}</p><h2 className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">{active.title}</h2></div>
          <button type="button" onClick={() => setPaused((value) => !value)} className="pointer-events-auto inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-black/70 px-3 py-2 text-xs font-medium text-zinc-200 backdrop-blur hover:border-cyan-400/50" aria-pressed={paused}>{paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}{paused ? 'Reanudar' : 'Pausar'}</button>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-black via-black/75 to-transparent p-5 pt-16 sm:p-6 sm:pt-20"><p className="max-w-xl text-sm leading-6 text-zinc-300">{active.premise}</p></div>
      </div>

      <aside className="flex flex-col justify-between rounded-2xl border border-zinc-800 bg-black/80 p-5">
        <div><span className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.14em] text-cyan-400"><Sparkles className="h-3.5 w-3.5" />Lectura científica</span><div className="my-5 overflow-x-auto border-y border-zinc-800 py-4"><KaTeXRenderer math={active.formula} block className="text-lg text-cyan-100" /></div><p className="text-sm leading-6 text-zinc-400">{active.observation}</p></div>
        <Link href={active.moduleHref} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 transition-colors hover:text-cyan-100">Abrir fundamento y laboratorio <ArrowRight className="h-4 w-4" /></Link>
      </aside>
    </section>
  );
}
