'use client';

import { useMemo, useState } from 'react';
import { LaboratoryModel } from './shared/LaboratoryModel';

function LabShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="space-y-5 rounded-3xl border border-zinc-800 bg-black p-5 text-zinc-100 shadow-2xl sm:p-7">
      <header className="border-b border-zinc-800 pb-5">
        <p className="text-[10px] font-mono font-semibold uppercase tracking-[0.16em] text-cyan-400">Laboratorio numérico · IF411</p>
        <h3 className="mt-1 text-lg font-bold tracking-tight text-white sm:text-xl">{title}</h3>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">{subtitle}</p>
      </header>
      {children}
    </section>
  );
}

function RangeControl({ label, value, min, max, step, unit, onChange }: { label: string; value: number; min: number; max: number; step: number; unit: string; onChange: (value: number) => void }) {
  return (
    <label className="block space-y-2 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
      <span className="flex items-center justify-between gap-3 text-xs font-medium text-zinc-300">
        <span>{label}</span><strong className="font-mono text-cyan-300">{value} {unit}</strong>
      </span>
      <input className="w-full cursor-pointer accent-cyan-500" type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

function Metric({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4"><p className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">{label}</p><div className="mt-1 text-sm font-semibold text-cyan-300">{children}</div></div>;
}

const factorial = (n: number) => Array.from({ length: n }, (_, index) => index + 1).reduce((result, value) => result * value, 1);

export function DoubleSlitSimulator() {
  const [wavelength, setWavelength] = useState(520);
  const [separation, setSeparation] = useState(20);
  const [slitWidth, setSlitWidth] = useState(5);
  const [distance, setDistance] = useState(1);
  const profile = useMemo(() => Array.from({ length: 241 }, (_, index) => {
    const yMm = -40 + index / 3;
    const theta = Math.atan((yMm * 1e-3) / distance);
    const lambda = wavelength * 1e-9;
    const beta = Math.PI * slitWidth * 1e-6 * Math.sin(theta) / lambda;
    const delta = Math.PI * separation * 1e-6 * Math.sin(theta) / lambda;
    const envelope = Math.abs(beta) < 1e-10 ? 1 : (Math.sin(beta) / beta) ** 2;
    return { yMm, intensity: envelope * Math.cos(delta) ** 2 };
  }), [wavelength, separation, slitWidth, distance]);
  const fringeMm = distance * wavelength * 1e-3 / separation;

  return <LabShell title="Interferencia de doble rendija" subtitle="Calcula la intensidad de Fraunhofer de dos rendijas de anchura finita. La pantalla corresponde a un corte transversal de la distribución de detección.">
    <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-3">
        <svg viewBox="0 0 760 300" className="h-[290px] w-full" role="img" aria-label="Patrón de interferencia de doble rendija">
          <rect width="760" height="300" fill="#050505" />
          {profile.map((point, index) => <line key={index} x1={80 + index * 2.5} x2={80 + index * 2.5} y1="34" y2="160" stroke={`rgba(34,211,238,${0.05 + point.intensity * 0.95})`} strokeWidth="2.5" />)}
          <line x1="80" y1="235" x2="680" y2="235" stroke="#52525b" />
          <polyline fill="none" stroke="#22d3ee" strokeWidth="2.5" points={profile.map((point, index) => `${80 + index * 2.5},${235 - point.intensity * 110}`).join(' ')} />
          <text x="80" y="270" fill="#a1a1aa" fontSize="12">−40 mm</text><text x="360" y="270" fill="#a1a1aa" fontSize="12">0</text><text x="628" y="270" fill="#a1a1aa" fontSize="12">+40 mm</text>
          <text x="80" y="22" fill="#a1a1aa" fontSize="12">Pantalla: intensidad relativa</text>
        </svg>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        <RangeControl label="Longitud de onda" value={wavelength} min={380} max={700} step={5} unit="nm" onChange={setWavelength} />
        <RangeControl label="Separación entre rendijas" value={separation} min={10} max={60} step={1} unit="μm" onChange={setSeparation} />
        <RangeControl label="Anchura de cada rendija" value={slitWidth} min={2} max={15} step={1} unit="μm" onChange={setSlitWidth} />
        <RangeControl label="Distancia a la pantalla" value={distance} min={0.5} max={2} step={0.1} unit="m" onChange={setDistance} />
      </div>
    </div>
    <div className="grid gap-3 sm:grid-cols-2"><Metric label="Separación angular / lineal aproximada">Δy ≈ {fringeMm.toFixed(1)} mm</Metric><Metric label="Lectura">Al disminuir λ o aumentar d, las franjas se acercan.</Metric></div>
    <LaboratoryModel title="Régimen de Fraunhofer" phenomenon="La amplitud de cada rendija se superpone coherentemente; la anchura finita introduce una envolvente de difracción que modula las franjas de interferencia." equations={[{ label: 'Intensidad', math: String.raw`\frac{I(\theta)}{I_0}=\left(\frac{\sin\beta}{\beta}\right)^2\cos^2\delta`, explanation: 'Se representa en la curva; β depende de la anchura y δ de la separación.' }, { label: 'Fases', math: String.raw`\beta=\frac{\pi a\sin\theta}{\lambda},\quad\delta=\frac{\pi d\sin\theta}{\lambda}`, explanation: 'a es la anchura, d la separación y λ la longitud de onda.' }, { label: 'Franjas cercanas al eje', math: String.raw`\Delta y\simeq\frac{L\lambda}{d}`, explanation: 'Aproximación de ángulo pequeño para la separación entre máximos.' }]} assumptions="Campo lejano (Fraunhofer), luz monocromática y dos rendijas idénticas. La gráfica es una intensidad relativa, no una simulación de impactos individuales." />
  </LabShell>;
}

export function HarmonicOscillatorSimulator() {
  const [n, setN] = useState(0);
  const [omega, setOmega] = useState(1);
  const points = useMemo(() => Array.from({ length: 181 }, (_, index) => {
    const x = -4 + index * 8 / 180;
    let h0 = 1; let h1 = 2 * x;
    let hermite = n === 0 ? h0 : h1;
    for (let order = 2; order <= n; order += 1) { const next = 2 * x * h1 - 2 * (order - 1) * h0; h0 = h1; h1 = next; hermite = next; }
    const density = Math.exp(-x * x) * hermite * hermite / (Math.sqrt(Math.PI) * 2 ** n * factorial(n));
    return { x, density };
  }), [n]);
  const energy = (n + 0.5) * omega;
  return <LabShell title="Oscilador armónico cuántico" subtitle="Visualiza la densidad de probabilidad estacionaria de los autoestados del potencial parabólico. Las unidades son adimensionales: ξ=x√(mω/ℏ).">
    <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-3"><svg viewBox="0 0 760 300" className="h-[290px] w-full" role="img" aria-label="Densidad de probabilidad del oscilador armónico">
        <rect width="760" height="300" fill="#050505" /><line x1="70" y1="230" x2="700" y2="230" stroke="#52525b" />
        <path d="M70 55 Q385 430 700 55" fill="none" stroke="#52525b" strokeWidth="2" /><text x="78" y="43" fill="#a1a1aa" fontSize="12">V(x)</text>
        <polyline fill="none" stroke="#22d3ee" strokeWidth="3" points={points.map((point, index) => `${70 + index * 3.5},${230 - point.density * 130}`).join(' ')} />
        <line x1="385" y1="35" x2="385" y2="235" stroke="#27272a" strokeDasharray="4 5" /><text x="72" y="260" fill="#a1a1aa" fontSize="12">−4</text><text x="379" y="260" fill="#a1a1aa" fontSize="12">0</text><text x="690" y="260" fill="#a1a1aa" fontSize="12">+4 ξ</text>
      </svg></div>
      <div className="grid gap-3"><RangeControl label="Número cuántico n" value={n} min={0} max={6} step={1} unit="" onChange={setN} /><RangeControl label="Frecuencia ω" value={omega} min={0.5} max={2} step={0.1} unit="ω₀" onChange={setOmega} /><Metric label="Energía">Eₙ = {energy.toFixed(2)} ℏω₀</Metric></div>
    </div>
    <LaboratoryModel title="Autoestados del pozo parabólico" phenomenon="Cada valor entero de n produce una densidad de probabilidad con n nodos. La energía no puede ser cero: el estado fundamental conserva energía de punto cero." equations={[{ label: 'Hamiltoniano', math: String.raw`\hat H=\frac{\hat p^2}{2m}+\frac12m\omega^2\hat x^2`, explanation: 'El potencial dibujado es la parte cuadrática del Hamiltoniano.' }, { label: 'Energías', math: String.raw`E_n=\left(n+\frac12\right)\hbar\omega`, explanation: 'El control de ω escala el espaciado entre niveles.' }, { label: 'Densidad', math: String.raw`|\psi_n(\xi)|^2=\frac{e^{-\xi^2}H_n^2(\xi)}{\sqrt\pi\,2^n n!}`, explanation: 'La curva cian se calcula mediante los polinomios de Hermite.' }]} assumptions="Oscilador unidimensional, no relativista y sin perturbación externa. La curva muestra densidad, no la función de onda con su fase." />
  </LabShell>;
}

type Orbital = '1s' | '2pz' | '3dz2';
export function HydrogenOrbitalSimulator() {
  const [orbital, setOrbital] = useState<Orbital>('1s');
  const density = (x: number, z: number) => {
    const r = Math.sqrt(x * x + z * z); const cosTheta = r < 1e-6 ? 1 : z / r;
    if (orbital === '1s') return Math.exp(-2 * r);
    if (orbital === '2pz') return z * z * Math.exp(-r);
    return r ** 4 * Math.exp(-2 * r / 3) * (3 * cosTheta * cosTheta - 1) ** 2;
  };
  const values = Array.from({ length: 45 * 45 }, (_, index) => { const col = index % 45; const row = Math.floor(index / 45); return density((col - 22) / 5.5, (row - 22) / 5.5); });
  const maximumDensity = Math.max(...values);
  const cells = values.map((value, index) => ({ value: value / maximumDensity, col: index % 45, row: Math.floor(index / 45) }));
  const descriptors = { '1s': 'n=1, ℓ=0, m=0', '2pz': 'n=2, ℓ=1, m=0', '3dz2': 'n=3, ℓ=2, m=0' };
  return <LabShell title="Densidad electrónica del átomo de hidrógeno" subtitle="Corte meridional de |ψₙℓₘ|² para orbitales reales de m=0. El color representa densidad relativa, no una trayectoria de un electrón.">
    <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-3"><svg viewBox="0 0 450 450" className="mx-auto h-[320px] max-w-full" role="img" aria-label="Densidad electrónica del orbital de hidrógeno"><rect width="450" height="450" fill="#050505" />{cells.map(({ value, col, row }) => <rect key={`${col}-${row}`} x={col * 10} y={row * 10} width="10" height="10" fill={`rgba(34,211,238,${value.toFixed(3)})`} />)}<line x1="225" y1="0" x2="225" y2="450" stroke="#ffffff" strokeOpacity="0.2"/><line x1="0" y1="225" x2="450" y2="225" stroke="#ffffff" strokeOpacity="0.2"/><circle cx="225" cy="225" r="5" fill="#fbbf24" /></svg></div>
      <div className="space-y-3"><label className="block rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-300">Orbital<select value={orbital} onChange={(event) => setOrbital(event.target.value as Orbital)} className="mt-2 w-full rounded-lg border border-zinc-700 bg-black p-2 text-sm text-white"><option value="1s">1s</option><option value="2pz">2pᶻ</option><option value="3dz2">3d(z²)</option></select></label><Metric label="Números cuánticos">{descriptors[orbital]}</Metric><Metric label="Interpretación">Los nodos son regiones de probabilidad nula.</Metric></div>
    </div>
    <LaboratoryModel title="Solución de Coulomb central" phenomenon="La función de onda se separa en una parte radial y un armónico esférico. El corte visualizado permite identificar lóbulos y superficies nodales de orbitales seleccionados." equations={[{ label: 'Separación', math: String.raw`\psi_{nlm}(r,\theta,\phi)=R_{nl}(r)Y_l^m(\theta,\phi)`, explanation: 'La densidad se obtiene elevando el módulo de esta función al cuadrado.' }, { label: 'Energía', math: String.raw`E_n=-\frac{13.6\ \mathrm{eV}}{n^2}`, explanation: 'En el átomo de hidrógeno ideal, la energía depende únicamente de n.' }, { label: 'Radio de Bohr', math: String.raw`a_0=\frac{4\pi\varepsilon_0\hbar^2}{m_e e^2}`, explanation: 'La escala espacial de la cuadrícula está expresada en múltiplos de a₀.' }]} assumptions="Átomo de hidrógeno no relativista, sin estructura fina ni campos externos. Se muestra un corte 2D de densidad para reducir el coste computacional; no es un render 3D volumétrico." />
  </LabShell>;
}

export function SpinMeasurementSimulator() {
  const [angle, setAngle] = useState(55);
  const theta = angle * Math.PI / 180; const plus = Math.cos(theta / 2) ** 2;
  return <LabShell title="Medición de espín 1/2" subtitle="Prepara un electrón en |+z⟩ y orienta el analizador de Stern–Gerlach a un ángulo θ respecto de z. La medición proyectiva produce solamente dos resultados.">
    <div className="grid gap-5 lg:grid-cols-[1fr_280px]"><div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4"><svg viewBox="0 0 520 290" className="h-[270px] w-full" role="img" aria-label="Esfera de Bloch y probabilidades de espín"><circle cx="220" cy="145" r="105" fill="none" stroke="#52525b" strokeWidth="2"/><line x1="115" y1="145" x2="325" y2="145" stroke="#52525b"/><line x1="220" y1="40" x2="220" y2="250" stroke="#52525b"/><line x1="220" y1="145" x2={220 + 96 * Math.sin(theta)} y2={145 - 96 * Math.cos(theta)} stroke="#22d3ee" strokeWidth="4"/><circle cx={220 + 96 * Math.sin(theta)} cy={145 - 96 * Math.cos(theta)} r="7" fill="#22d3ee"/><text x="210" y="30" fill="#e4e4e7" fontSize="14">+z</text><text x="210" y="278" fill="#e4e4e7" fontSize="14">−z</text><text x="365" y="115" fill="#a1a1aa" fontSize="14">P(+n) = {(plus * 100).toFixed(1)}%</text><text x="365" y="150" fill="#a1a1aa" fontSize="14">P(−n) = {((1 - plus) * 100).toFixed(1)}%</text></svg></div><div className="grid gap-3"><RangeControl label="Ángulo del analizador θ" value={angle} min={0} max={180} step={1} unit="°" onChange={setAngle} /><Metric label="Resultado +n">{(plus * 100).toFixed(1)} %</Metric><Metric label="Resultado −n">{((1 - plus) * 100).toFixed(1)} %</Metric></div></div>
    <LaboratoryModel title="Regla de Born para un espín preparado" phenomenon="La orientación del vector de Bloch determina las probabilidades de los dos canales del analizador. No hay valores intermedios de espín medidos." equations={[{ label: 'Base rotada', math: String.raw`|+\mathbf n\rangle=\cos\frac\theta2|+z\rangle+\sin\frac\theta2|-z\rangle`, explanation: 'El estado propio del analizador se expresa en la base z.' }, { label: 'Probabilidades', math: String.raw`P(+\mathbf n)=\cos^2\frac\theta2,\quad P(-\mathbf n)=\sin^2\frac\theta2`, explanation: 'Se calculan con la regla de Born para el estado inicial |+z⟩.' }, { label: 'Operador', math: String.raw`\hat S_{\mathbf n}=\frac\hbar2\,\mathbf n\cdot\boldsymbol\sigma`, explanation: 'Sus únicos autovalores son ±ℏ/2.' }]} assumptions="Partícula de espín 1/2 ideal, sin evolución temporal ni campo magnético externo. El diagrama es la representación geométrica de un estado puro." />
  </LabShell>;
}

export function SternGerlachSimulator() {
  const [firstAngle, setFirstAngle] = useState(0); const [secondAngle, setSecondAngle] = useState(90);
  const pFirst = Math.cos(firstAngle * Math.PI / 360) ** 2; const pSecondAfterPlus = Math.cos((secondAngle - firstAngle) * Math.PI / 360) ** 2; const total = pFirst * pSecondAfterPlus;
  return <LabShell title="Stern–Gerlach secuencial" subtitle="Un haz preparado en |+z⟩ cruza un primer analizador, se filtra su salida +n₁ y luego entra en un segundo analizador. Cambia los ejes para observar proyección y preparación de estado.">
    <div className="grid gap-5 lg:grid-cols-[1fr_280px]"><div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4"><svg viewBox="0 0 720 250" className="h-[240px] w-full" role="img" aria-label="Secuencia de analizadores Stern Gerlach"><line x1="45" y1="125" x2="650" y2="125" stroke="#22d3ee" strokeWidth="5"/><polygon points="220,55 280,125 220,195" fill="#155e75" stroke="#22d3ee"/><polygon points="470,55 530,125 470,195" fill="#155e75" stroke="#22d3ee"/><path d="M280 125 L430 70" stroke="#fbbf24" strokeWidth="4"/><text x="45" y="105" fill="#e4e4e7" fontSize="14">|+z⟩</text><text x="175" y="225" fill="#a1a1aa" fontSize="12">SG(n₁): {firstAngle}°</text><text x="425" y="225" fill="#a1a1aa" fontSize="12">SG(n₂): {secondAngle}°</text><text x="545" y="105" fill="#e4e4e7" fontSize="14">+n₂</text><text x="310" y="58" fill="#fbbf24" fontSize="13">canal +n₁ filtrado</text></svg></div><div className="grid gap-3"><RangeControl label="Eje del primer analizador" value={firstAngle} min={0} max={180} step={1} unit="°" onChange={setFirstAngle}/><RangeControl label="Eje del segundo analizador" value={secondAngle} min={0} max={180} step={1} unit="°" onChange={setSecondAngle}/></div></div>
    <div className="grid gap-3 sm:grid-cols-3"><Metric label="P(+n₁)">{(pFirst * 100).toFixed(1)} %</Metric><Metric label="P(+n₂ | +n₁)">{(pSecondAfterPlus * 100).toFixed(1)} %</Metric><Metric label="Transmisión total">{(total * 100).toFixed(1)} %</Metric></div>
    <LaboratoryModel title="Medición secuencial y postselección" phenomenon="El primer imán no solo separa el haz: al filtrar su salida positiva prepara el estado |+n₁⟩. La probabilidad posterior depende del ángulo relativo entre n₁ y n₂." equations={[{ label: 'Primer analizador', math: String.raw`P(+\mathbf n_1|+z)=\cos^2\frac{\theta_1}{2}`, explanation: 'Probabilidad de que el filtro permita pasar el primer canal.' }, { label: 'Segundo analizador', math: String.raw`P(+\mathbf n_2|+\mathbf n_1)=\cos^2\frac{\theta_2-\theta_1}{2}`, explanation: 'El estado ha sido preparado por la primera medición.' }, { label: 'Transmisión', math: String.raw`P_{\mathrm{total}}=P(+\mathbf n_1)P(+\mathbf n_2|+\mathbf n_1)`, explanation: 'Producto de probabilidades condicionales para la secuencia filtrada.' }]} assumptions="Medición ideal de espín 1/2, detectores perfectos y sin fases dinámicas entre analizadores. Los ángulos se toman en un mismo plano." />
  </LabShell>;
}

export function PerturbationSimulator() {
  const [gap, setGap] = useState(4); const [coupling, setCoupling] = useState(1.2);
  const eMinus = -Math.sqrt((gap / 2) ** 2 + coupling ** 2); const ePlus = -eMinus;
  return <LabShell title="Anticruce en un sistema de dos niveles" subtitle="Diagonaliza un Hamiltoniano de dos niveles con acoplamiento V. Observa cómo la perturbación evita el cruce de niveles que habría para V=0.">
    <div className="grid gap-5 lg:grid-cols-[1fr_280px]"><div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4"><svg viewBox="0 0 620 300" className="h-[280px] w-full" role="img" aria-label="Niveles de energía perturbados"><line x1="80" y1="150" x2="550" y2="150" stroke="#3f3f46"/><line x1="310" y1="30" x2="310" y2="270" stroke="#3f3f46" strokeDasharray="4 5"/><line x1="95" y1={150 - ePlus * 24} x2="525" y2={150 - ePlus * 24} stroke="#22d3ee" strokeWidth="5"/><line x1="95" y1={150 - eMinus * 24} x2="525" y2={150 - eMinus * 24} stroke="#a855f7" strokeWidth="5"/><line x1="95" y1="95" x2="525" y2="205" stroke="#71717a" strokeDasharray="7 5"/><line x1="95" y1="205" x2="525" y2="95" stroke="#71717a" strokeDasharray="7 5"/><text x="100" y="35" fill="#22d3ee" fontSize="14">E₊ = {ePlus.toFixed(2)}</text><text x="100" y="285" fill="#c084fc" fontSize="14">E₋ = {eMinus.toFixed(2)}</text><text x="345" y="140" fill="#a1a1aa" fontSize="12">sin acoplamiento</text></svg></div><div className="grid gap-3"><RangeControl label="Separación no perturbada Δ" value={gap} min={0} max={8} step={0.1} unit="E₀" onChange={setGap}/><RangeControl label="Acoplamiento |V|" value={coupling} min={0} max={3} step={0.1} unit="E₀" onChange={setCoupling}/><Metric label="Separación observada">{(ePlus - eMinus).toFixed(2)} E₀</Metric></div></div>
    <LaboratoryModel title="Diagonalización exacta de un subespacio" phenomenon="Cerca de una degeneración, la fórmula de perturbación no degenerada deja de ser fiable. El modelo diagonaliza exactamente el bloque 2×2, mostrando el anticruce." equations={[{ label: 'Hamiltoniano', math: String.raw`H=\begin{pmatrix}\Delta/2&V\\V&-\Delta/2\end{pmatrix}`, explanation: 'Δ es la diferencia no perturbada y V mezcla los estados.' }, { label: 'Autovalores', math: String.raw`E_\pm=\pm\sqrt{(\Delta/2)^2+|V|^2}`, explanation: 'Los niveles no se cruzan cuando V ≠ 0.' }, { label: 'Límite lejano', math: String.raw`\delta E\simeq\frac{|V|^2}{\Delta}`, explanation: 'Recupera el comportamiento de segundo orden lejos de la degeneración.' }]} assumptions="Dos estados aislados, Hamiltoniano real y estacionario. Es una diagonalización exacta del subespacio, no una aproximación para un espectro completo." />
  </LabShell>;
}

export function RabiSimulator() {
  const [rabi, setRabi] = useState(1); const [detuning, setDetuning] = useState(0.6); const [time, setTime] = useState(4);
  const omegaR = Math.sqrt(rabi ** 2 + detuning ** 2); const probability = (rabi ** 2 / omegaR ** 2) * Math.sin(omegaR * time / 2) ** 2;
  const curve = useMemo(() => Array.from({ length: 160 }, (_, index) => { const t = index * 8 / 159; return { t, p: (rabi ** 2 / omegaR ** 2) * Math.sin(omegaR * t / 2) ** 2 }; }), [rabi, omegaR]);
  return <LabShell title="Transiciones de dos niveles: oscilaciones de Rabi" subtitle="Resuelve exactamente un sistema de dos niveles impulsado cerca de resonancia dentro de la aproximación de onda rotante. Ajusta el desajuste y la amplitud del acoplamiento.">
    <div className="grid gap-5 lg:grid-cols-[1fr_280px]"><div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-3"><svg viewBox="0 0 760 300" className="h-[290px] w-full" role="img" aria-label="Probabilidad de transición de Rabi"><rect width="760" height="300" fill="#050505"/><line x1="70" y1="235" x2="700" y2="235" stroke="#52525b"/><line x1="70" y1="35" x2="70" y2="235" stroke="#52525b"/><polyline fill="none" stroke="#22d3ee" strokeWidth="3" points={curve.map((point, index) => `${70 + index * 630 / 159},${235 - point.p * 180}`).join(' ')}/><line x1={70 + time * 630 / 8} y1="35" x2={70 + time * 630 / 8} y2="235" stroke="#fbbf24" strokeDasharray="5 5"/><text x="70" y="268" fill="#a1a1aa" fontSize="12">0</text><text x="680" y="268" fill="#a1a1aa" fontSize="12">8 / Ω₀</text><text x="22" y="45" fill="#a1a1aa" fontSize="12">1</text><text x="22" y="235" fill="#a1a1aa" fontSize="12">0</text></svg></div><div className="grid gap-3"><RangeControl label="Acoplamiento Ω" value={rabi} min={0.2} max={2} step={0.1} unit="Ω₀" onChange={setRabi}/><RangeControl label="Desajuste δ" value={detuning} min={0} max={3} step={0.1} unit="Ω₀" onChange={setDetuning}/><RangeControl label="Tiempo t" value={time} min={0} max={8} step={0.1} unit="Ω₀⁻¹" onChange={setTime}/></div></div>
    <div className="grid gap-3 sm:grid-cols-2"><Metric label="Probabilidad excitada Pₑ(t)">{(probability * 100).toFixed(1)} %</Metric><Metric label="Frecuencia generalizada Ωᴿ">{omegaR.toFixed(2)} Ω₀</Metric></div>
    <LaboratoryModel title="Dinámica coherente cerca de resonancia" phenomenon="Un campo armónico puede transferir población entre dos estados. El desajuste reduce la amplitud máxima de la transición aunque aumenta la frecuencia generalizada." equations={[{ label: 'Frecuencia de Rabi', math: String.raw`\Omega_R=\sqrt{\Omega^2+\delta^2}`, explanation: 'Incluye el acoplamiento resonante Ω y el desajuste δ.' }, { label: 'Población excitada', math: String.raw`P_e(t)=\frac{\Omega^2}{\Omega_R^2}\sin^2\!\left(\frac{\Omega_Rt}{2}\right)`, explanation: 'La curva cian se evalúa con esta expresión.' }, { label: 'Resonancia', math: String.raw`\delta=\omega-\omega_{eg}=0`, explanation: 'En resonancia se alcanza transferencia completa para un pulso π.' }]} assumptions="Sistema aislado de dos niveles, campo monocromático y aproximación de onda rotante. No incorpora decoherencia, emisión espontánea ni acoplamientos a otros niveles." />
  </LabShell>;
}
