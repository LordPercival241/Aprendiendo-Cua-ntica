'use client';

import { useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import { KaTeXRenderer } from '@/components/math/KaTeXRenderer';
import { LaboratoryModel } from './shared/LaboratoryModel';

const WIDTH = 800;
const LEFT = 56;
const RIGHT = 744;
const BASELINE = 246;

function points(values: number[], mapY: (value: number) => number) {
  return values.map((value, index) => `${LEFT + (index / (values.length - 1)) * (RIGHT - LEFT)},${mapY(value)}`).join(' ');
}

function useClock(speed = 1) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [time, setTime] = useState(0);
  const lastRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isPlaying) return;
    const tick = (now: number) => {
      const last = lastRef.current ?? now;
      lastRef.current = now;
      setTime((current) => current + Math.min((now - last) / 1000, 0.08) * speed);
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      lastRef.current = null;
    };
  }, [isPlaying, speed]);

  return { isPlaying, setIsPlaying, time, reset: () => setTime(0) };
}

function Playback({ isPlaying, onToggle, onReset }: { isPlaying: boolean; onToggle: () => void; onReset: () => void }) {
  return <div className="flex items-center gap-2"><button type="button" onClick={onToggle} className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-cyan-500">{isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}{isPlaying ? 'Pausar' : 'Reanudar'}</button><button type="button" onClick={onReset} title="Reiniciar" className="rounded-xl border border-zinc-700 bg-zinc-900 p-2 text-zinc-300 transition-colors hover:border-cyan-400 hover:text-cyan-300"><RotateCcw className="h-4 w-4" /></button></div>;
}

function LabHeader({ badge, title, description, playback }: { badge: string; title: string; description: React.ReactNode; playback: React.ReactNode }) {
  return <div className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-800 pb-5"><div><div className="inline-flex rounded-md border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-cyan-400">{badge}</div><h3 className="mt-2 text-xl font-bold text-white sm:text-2xl">{title}</h3><p className="mt-1 max-w-3xl text-sm leading-6 text-zinc-400">{description}</p></div>{playback}</div>;
}

function Plot({ density, real, markerX, label }: { density: number[]; real?: number[]; markerX?: number; label: string }) {
  const densityPoints = points(density, (value) => BASELINE - value * 82);
  const areaPoints = `${LEFT},${BASELINE} ${densityPoints} ${RIGHT},${BASELINE}`;
  const realPoints = real ? points(real, (value) => 124 - value * 48) : '';
  return <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#050508] shadow-inner"><svg viewBox={`0 0 ${WIDTH} 320`} className="block h-auto w-full" role="img" aria-label={label}><defs><linearGradient id="probability" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#22d3ee" stopOpacity="0.45" /><stop offset="1" stopColor="#22d3ee" stopOpacity="0.03" /></linearGradient></defs>{Array.from({ length: 15 }, (_, index) => <line key={index} x1={LEFT + index * ((RIGHT - LEFT) / 14)} x2={LEFT + index * ((RIGHT - LEFT) / 14)} y1="24" y2={BASELINE} stroke="#111827" />)}<line x1={LEFT} x2={RIGHT} y1={BASELINE} y2={BASELINE} stroke="#475569" strokeWidth="1.5" /><line x1={LEFT} x2={RIGHT} y1="124" y2="124" stroke="#312e81" strokeDasharray="4 5" /><text x={LEFT} y="19" fill="#a855f7" fontSize="11" fontFamily="monospace">Re&#123;ψ&#125;</text><text x={LEFT} y={BASELINE + 23} fill="#22d3ee" fontSize="11" fontFamily="monospace">|ψ|²</text>{markerX !== undefined && <line x1={LEFT + markerX * (RIGHT - LEFT)} x2={LEFT + markerX * (RIGHT - LEFT)} y1="24" y2={BASELINE} stroke="#fbbf24" strokeDasharray="5 5" />}{real && <polyline points={realPoints} fill="none" stroke="#a855f7" strokeWidth="1.6" />}<polygon points={areaPoints} fill="url(#probability)" /><polyline points={densityPoints} fill="none" stroke="#22d3ee" strokeWidth="2.5" /></svg></div>;
}

export function SchrodingerSuperpositionSimulator() {
  const { isPlaying, setIsPlaying, time, reset } = useClock(1);
  const [mixing, setMixing] = useState(45);
  const angle = mixing * Math.PI / 180;
  const c1 = Math.cos(angle);
  const c2 = Math.sin(angle);
  const energy1 = Math.PI ** 2 / 2;
  const energy2 = 2 * Math.PI ** 2;
  const values = Array.from({ length: 180 }, (_, index) => index / 179);
  const real = values.map((x) => c1 * Math.sqrt(2) * Math.sin(Math.PI * x) * Math.cos(energy1 * time) + c2 * Math.sqrt(2) * Math.sin(2 * Math.PI * x) * Math.cos(energy2 * time));
  const density = values.map((x, index) => {
    const imaginary = -c1 * Math.sqrt(2) * Math.sin(Math.PI * x) * Math.sin(energy1 * time) - c2 * Math.sqrt(2) * Math.sin(2 * Math.PI * x) * Math.sin(energy2 * time);
    return real[index] ** 2 + imaginary ** 2;
  });

  return <div className="space-y-6 rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-zinc-100 shadow-2xl sm:p-8"><LabHeader badge="Unidad IV · ecuación dependiente del tiempo" title="Superposición y evolución temporal" description="La densidad cambia por interferencia entre dos autoestados del pozo infinito; la probabilidad total permanece normalizada." playback={<Playback isPlaying={isPlaying} onToggle={() => setIsPlaying(!isPlaying)} onReset={reset} />} /><Plot density={density} real={real} label="Evolución temporal de una superposición en un pozo infinito" /><div className="grid gap-5 lg:grid-cols-[1.4fr_0.9fr]"><div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5"><div className="flex items-center justify-between text-xs"><span>Mezcla del estado <KaTeXRenderer math={String.raw`|\psi(0)\rangle=c_1|1\rangle+c_2|2\rangle`} /></span><span className="font-mono font-bold text-cyan-300">{mixing}°</span></div><input type="range" min="0" max="90" value={mixing} onChange={(event) => setMixing(Number(event.target.value))} className="mt-4 w-full accent-cyan-500" /><p className="mt-4 text-xs leading-5 text-zinc-400">La fase relativa evoluciona con <KaTeXRenderer math={String.raw`(E_2-E_1)t/\hbar`} />, por lo que la densidad de una superposición no estacionaria puede oscilar en el tiempo.</p></div><div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 font-mono text-xs"><p className="text-cyan-400">DIAGNÓSTICO FÍSICO</p><dl className="mt-4 space-y-3 text-zinc-300"><div className="flex justify-between"><dt>Norma</dt><dd className="font-bold text-emerald-400">1.000</dd></div><div className="flex justify-between"><dt>Estados</dt><dd>|1⟩, |2⟩</dd></div><div className="flex justify-between"><dt>Dominio</dt><dd>0 &lt; x &lt; L</dd></div></dl></div></div><LaboratoryModel title="Superposición en un pozo infinito" phenomenon="La visualización calcula la evolución unitaria de una combinación de dos autoestados normalizados. No representa una barrera ni un coeficiente de transmisión." equations={[{ label: 'Evolución', math: String.raw`i\hbar\frac{\partial\psi}{\partial t}=\hat H\psi`, explanation: 'Ecuación de Schrödinger dependiente del tiempo.' }, { label: 'Superposición', math: String.raw`\psi(x,t)=c_1\phi_1e^{-iE_1t/\hbar}+c_2\phi_2e^{-iE_2t/\hbar}`, explanation: 'La interferencia depende de la fase relativa.' }, { label: 'Conservación', math: String.raw`\int_0^L|\psi(x,t)|^2dx=1`, explanation: 'La evolución unitaria preserva la probabilidad total.' }]} assumptions="Pozo infinito unidimensional, partícula no relativista y unidades reducidas ℏ = m = L = 1." /></div>;
}

export function FreeWavepacketSimulator() {
  const { isPlaying, setIsPlaying, time, reset } = useClock(0.72);
  const [sigma0, setSigma0] = useState(0.9);
  const [momentum, setMomentum] = useState(1.25);
  const displayTime = time % 7.2;
  const sigma = sigma0 * Math.sqrt(1 + (displayTime / (2 * sigma0 ** 2)) ** 2);
  const center = -4.8 + momentum * displayTime;
  const values = Array.from({ length: 180 }, (_, index) => -8 + (index / 179) * 16);
  const density = values.map((x) => Math.exp(-((x - center) ** 2) / (2 * sigma ** 2)) / (Math.sqrt(2 * Math.PI) * sigma));
  const real = values.map((x, index) => Math.sqrt(Math.max(0, density[index])) * Math.cos(momentum * x - (momentum ** 2 / 2) * displayTime));
  const normalizedMarker = Math.max(0, Math.min(1, (center + 8) / 16));

  return <div className="space-y-6 rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-zinc-100 shadow-2xl sm:p-8"><LabHeader badge="Unidad V · partícula libre" title="Dispersión de un paquete gaussiano" description="Un paquete libre se desplaza con velocidad de grupo y aumenta su incertidumbre espacial aun sin potencial externo." playback={<Playback isPlaying={isPlaying} onToggle={() => setIsPlaying(!isPlaying)} onReset={reset} />} /><Plot density={density} real={real} markerX={normalizedMarker} label="Dispersión temporal de un paquete gaussiano libre" /><div className="grid gap-5 lg:grid-cols-[1.4fr_0.9fr]"><div className="space-y-5 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5"><label className="block text-xs text-zinc-300"><span className="flex justify-between"><span>Ancho inicial <KaTeXRenderer math={String.raw`\sigma_0`} /></span><strong className="font-mono text-cyan-300">{sigma0.toFixed(2)}</strong></span><input type="range" min="0.5" max="1.8" step="0.05" value={sigma0} onChange={(event) => setSigma0(Number(event.target.value))} className="mt-3 w-full accent-cyan-500" /></label><label className="block text-xs text-zinc-300"><span className="flex justify-between"><span>Momento medio <KaTeXRenderer math={String.raw`\langle p\rangle`} /></span><strong className="font-mono text-cyan-300">{momentum.toFixed(2)}</strong></span><input type="range" min="0.5" max="2.2" step="0.05" value={momentum} onChange={(event) => setMomentum(Number(event.target.value))} className="mt-3 w-full accent-cyan-500" /></label></div><div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 font-mono text-xs"><p className="text-cyan-400">OBSERVABLES</p><dl className="mt-4 space-y-3 text-zinc-300"><div className="flex justify-between"><dt>σₓ(t)</dt><dd className="font-bold text-emerald-400">{sigma.toFixed(3)}</dd></div><div className="flex justify-between"><dt>⟨x⟩</dt><dd>{center.toFixed(3)}</dd></div><div className="flex justify-between"><dt>⟨p⟩</dt><dd>{momentum.toFixed(3)}</dd></div></dl></div></div><LaboratoryModel title="Paquete gaussiano libre" phenomenon="La envolvente representa una densidad de probabilidad gaussiana normalizada. Su ensanchamiento es una consecuencia de la dispersión de fases de las componentes de momento." equations={[{ label: 'Hamiltoniano libre', math: String.raw`\hat H=\frac{\hat p^2}{2m}`, explanation: 'No hay potencial externo: V(x)=0.' }, { label: 'Ancho temporal', math: String.raw`\sigma_x(t)=\sigma_0\sqrt{1+\left(\frac{\hbar t}{2m\sigma_0^2}\right)^2}`, explanation: 'Resultado para un paquete gaussiano mínimo.' }, { label: 'Centro del paquete', math: String.raw`\langle x\rangle(t)=x_0+\frac{\langle p\rangle}{m}t`, explanation: 'Evolución del valor esperado de posición.' }]} assumptions="Paquete gaussiano libre unidimensional; el lienzo emplea unidades reducidas ℏ = m = 1 y reinicia la vista tras cruzar el dominio gráfico." /></div>;
}

export function InfiniteWellSimulator() {
  const [level, setLevel] = useState(1);
  const [length, setLength] = useState(1);
  const values = Array.from({ length: 180 }, (_, index) => index / 179);
  const density = values.map((u) => (2 / length) * Math.sin(level * Math.PI * u) ** 2);
  const real = values.map((u) => Math.sqrt(2 / length) * Math.sin(level * Math.PI * u));
  const energy = (level ** 2 * Math.PI ** 2) / (2 * length ** 2);

  return <div className="space-y-6 rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-zinc-100 shadow-2xl sm:p-8"><LabHeader badge="Unidad VI · potenciales 1D" title="Estados ligados en un pozo infinito" description="Selecciona un autoestado: su densidad es estacionaria y la energía solo puede tomar valores discretos." playback={<div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-3 py-2 font-mono text-xs text-cyan-300">Estado estacionario</div>} /><Plot density={density} real={real} label="Autoestado ligado de una partícula en un pozo infinito" /><div className="grid gap-5 lg:grid-cols-[1.4fr_0.9fr]"><div className="grid gap-5 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 sm:grid-cols-2"><label className="text-xs text-zinc-300"><span className="flex justify-between"><span>Número cuántico <KaTeXRenderer math="n" /></span><strong className="font-mono text-cyan-300">{level}</strong></span><input type="range" min="1" max="6" step="1" value={level} onChange={(event) => setLevel(Number(event.target.value))} className="mt-3 w-full accent-cyan-500" /></label><label className="text-xs text-zinc-300"><span className="flex justify-between"><span>Ancho <KaTeXRenderer math="L" /></span><strong className="font-mono text-cyan-300">{length.toFixed(2)}</strong></span><input type="range" min="0.7" max="1.6" step="0.05" value={length} onChange={(event) => setLength(Number(event.target.value))} className="mt-3 w-full accent-cyan-500" /></label></div><div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 font-mono text-xs"><p className="text-cyan-400">ESTADO LIGADO</p><dl className="mt-4 space-y-3 text-zinc-300"><div className="flex justify-between"><dt>Eₙ</dt><dd className="font-bold text-emerald-400">{energy.toFixed(3)}</dd></div><div className="flex justify-between"><dt>Nodos internos</dt><dd>{level - 1}</dd></div><div className="flex justify-between"><dt>Corriente</dt><dd>0</dd></div></dl></div></div><LaboratoryModel title="Pozo cuadrado infinito" phenomenon="La simulación presenta autoestados ligados, no un paquete que incide sobre una barrera. La densidad de cada autoestado es independiente del tiempo." equations={[{ label: 'Potencial', math: String.raw`V(x)=\begin{cases}0,&0<x<L\\\infty,&\text{fuera}\end{cases}`, explanation: 'Las paredes imponen condiciones de frontera nulas.' }, { label: 'Autoestado', math: String.raw`\psi_n(x)=\sqrt{\frac{2}{L}}\sin\left(\frac{n\pi x}{L}\right)`, explanation: 'Funciones propias normalizadas en el interior.' }, { label: 'Energía', math: String.raw`E_n=\frac{n^2\pi^2\hbar^2}{2mL^2}`, explanation: 'Espectro discreto de estados ligados.' }]} assumptions="Pozo infinito unidimensional y partícula no relativista. El pozo finito se aborda conceptualmente como extensión: allí existen menos estados ligados y colas evanescentes." /></div>;
}
