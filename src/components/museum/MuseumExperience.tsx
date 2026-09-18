'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { ArrowRight, ExternalLink, Landmark } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { KaTeXRenderer } from '@/components/math/KaTeXRenderer';

type Locale = 'es' | 'en';

interface LocalizedText {
  es: string;
  en: string;
}

interface Scientist {
  id: string;
  year: number;
  timelineLabel?: string;
  name: string;
  years: string;
  portrait: string;
  contribution: LocalizedText;
  biography: LocalizedText;
  formula: string;
  formulaNote?: LocalizedText;
  moduleHref: string;
  sourceUrl: string;
}

const SCIENTISTS: Scientist[] = [
  { id: 'planck', year: 1900, name: 'Max Planck', years: '1858–1947', portrait: '/museum/max-planck.png', contribution: { es: 'Cuantización de la energía y ley de radiación del cuerpo negro.', en: 'Energy quantization and the blackbody radiation law.' }, biography: { es: 'Profesor en Berlín, introdujo los cuantos de energía para resolver el espectro del cuerpo negro. Su hipótesis abrió la ruptura con la física clásica.', en: 'A professor in Berlin, he introduced energy quanta to resolve the blackbody spectrum. His hypothesis marked the break with classical physics.' }, formula: String.raw`E_n=n h\nu`, formulaNote: { es: 'Forma histórica para los niveles del oscilador de Planck.', en: 'Historical form for Planck oscillator energy levels.' }, moduleHref: '/modulos/01-introduccion-fisica-moderna', sourceUrl: 'https://www.nobelprize.org/prizes/physics/1918/planck/facts/' },
  { id: 'einstein', year: 1905, name: 'Albert Einstein', years: '1879–1955', portrait: '/museum/albert-einstein.png', contribution: { es: 'Hipótesis del cuanto de luz y explicación del efecto fotoeléctrico.', en: 'Light-quantum hypothesis and explanation of the photoelectric effect.' }, biography: { es: 'En 1905 propuso que la radiación intercambia energía en cuantos. La condición de umbral del efecto fotoeléctrico proporcionó evidencia decisiva de la naturaleza cuántica de la luz.', en: 'In 1905 he proposed that radiation exchanges energy in quanta. The photoelectric threshold provided decisive evidence for the quantum nature of light.' }, formula: String.raw`K_{\max}=h\nu-\Phi`, moduleHref: '/modulos/02-efecto-fotoelectrico-compton', sourceUrl: 'https://www.nobelprize.org/prizes/physics/1921/einstein/facts/' },
  { id: 'bohr', year: 1913, name: 'Niels Bohr', years: '1885–1962', portrait: '/museum/niels-bohr.png', contribution: { es: 'Modelo cuántico del átomo de hidrógeno y niveles estacionarios.', en: 'Quantum model of the hydrogen atom and stationary levels.' }, biography: { es: 'Propuso niveles energéticos discretos para el hidrógeno y explicó sus líneas espectrales. Más adelante fue una figura central en la interpretación de Copenhague y la complementariedad.', en: 'He proposed discrete energy levels for hydrogen and explained its spectral lines. He later became a central figure in the Copenhagen interpretation and complementarity.' }, formula: String.raw`E_n=-\frac{13.6\ \mathrm{eV}}{n^2}`, formulaNote: { es: 'Válida para el modelo no relativista del átomo de hidrógeno.', en: 'Valid for the non-relativistic hydrogen-atom model.' }, moduleHref: '/modulos/10-atomo-hidrogeno', sourceUrl: 'https://www.nobelprize.org/prizes/physics/1922/bohr/facts/' },
  { id: 'broglie', year: 1924, name: 'Louis de Broglie', years: '1892–1987', portrait: '/museum/louis-de-broglie.png', contribution: { es: 'Hipótesis de las ondas de materia.', en: 'Matter-wave hypothesis.' }, biography: { es: 'Extendió la dualidad de la luz a la materia: una partícula con momento definido se asocia a una longitud de onda. La difracción electrónica confirmó esta idea.', en: 'He extended light duality to matter: a particle with definite momentum is associated with a wavelength. Electron diffraction confirmed this idea.' }, formula: String.raw`\lambda=\frac{h}{p}`, moduleHref: '/modulos/03-dualidad-onda-particula', sourceUrl: 'https://www.nobelprize.org/prizes/physics/1929/broglie/facts/' },
  { id: 'pauli', year: 1925, name: 'Wolfgang Pauli', years: '1900–1958', portrait: '/museum/wolfgang-pauli.png', contribution: { es: 'Principio de exclusión y estructura de los estados de fermiones.', en: 'Exclusion principle and the structure of fermionic states.' }, biography: { es: 'Formuló el principio de exclusión, esencial para comprender las configuraciones electrónicas, la tabla periódica y la materia fermiónica.', en: 'He formulated the exclusion principle, essential to understanding electron configurations, the periodic table, and fermionic matter.' }, formula: String.raw`n_i\in\{0,1\}`, formulaNote: { es: 'Para un modo fermiónico i, su número de ocupación solo puede ser cero o uno.', en: 'For a fermionic mode i, its occupation number can only be zero or one.' }, moduleHref: '/modulos/11-momento-angular-espin', sourceUrl: 'https://www.nobelprize.org/prizes/physics/1945/pauli/facts/' },
  { id: 'heisenberg', year: 1925, timelineLabel: '1925–1927', name: 'Werner Heisenberg', years: '1901–1976', portrait: '/museum/werner-heisenberg.png', contribution: { es: 'Mecánica matricial y relación de incertidumbre.', en: 'Matrix mechanics and the uncertainty relation.' }, biography: { es: 'En 1925 desarrolló una formulación basada en magnitudes observables y matrices no conmutativas; en 1927 estableció la relación de incertidumbre.', en: 'In 1925 he developed a formulation based on observables and non-commuting matrices; in 1927 he established the uncertainty relation.' }, formula: String.raw`\Delta x\,\Delta p\geq\frac{\hbar}{2}`, formulaNote: { es: 'Relación de incertidumbre publicada en 1927.', en: 'Uncertainty relation published in 1927.' }, moduleHref: '/modulos/08-formalismo-dirac', sourceUrl: 'https://www.nobelprize.org/prizes/physics/1932/heisenberg/facts/' },
  { id: 'schrodinger', year: 1926, name: 'Erwin Schrödinger', years: '1887–1961', portrait: '/museum/erwin-schrodinger.png', contribution: { es: 'Ecuación de onda de la mecánica cuántica.', en: 'Wave equation of quantum mechanics.' }, biography: { es: 'Formuló la ecuación que gobierna la evolución de la función de onda. Su enfoque ondulatorio es equivalente a la mecánica matricial y sustenta gran parte de la teoría no relativista.', en: 'He formulated the equation governing wave-function evolution. His wave approach is equivalent to matrix mechanics and underpins much of non-relativistic theory.' }, formula: String.raw`i\hbar\frac{\partial\psi}{\partial t}=\hat H\psi`, moduleHref: '/modulos/04-ecuacion-schrodinger', sourceUrl: 'https://www.nobelprize.org/prizes/physics/1933/schrodinger/facts/' },
  { id: 'born', year: 1926, name: 'Max Born', years: '1882–1970', portrait: '/museum/max-born.png', contribution: { es: 'Interpretación probabilística de la función de onda.', en: 'Probabilistic interpretation of the wave function.' }, biography: { es: 'Propuso que el módulo cuadrado de la función de onda determina una densidad de probabilidad. Esta regla conecta el formalismo con los resultados de medición.', en: 'He proposed that the squared modulus of the wave function determines a probability density. This rule connects the formalism with measurement outcomes.' }, formula: String.raw`\rho(\mathbf r,t)=|\psi(\mathbf r,t)|^2`, moduleHref: '/modulos/04-ecuacion-schrodinger', sourceUrl: 'https://www.nobelprize.org/prizes/physics/1954/born/facts/' },
  { id: 'dirac', year: 1928, name: 'Paul Dirac', years: '1902–1984', portrait: '/museum/paul-dirac.png', contribution: { es: 'Teoría cuántica relativista del electrón y predicción del positrón.', en: 'Relativistic quantum theory of the electron and prediction of the positron.' }, biography: { es: 'Formuló una teoría cuántica compatible con relatividad especial. Su ecuación incorporó espín y condujo a la predicción de una antipartícula del electrón.', en: 'He formulated a quantum theory compatible with special relativity. His equation incorporated spin and led to the prediction of an electron antiparticle.' }, formula: String.raw`\left(i\hbar c\,\gamma^\mu\partial_\mu-mc^2\right)\psi=0`, formulaNote: { es: 'Forma covariante con c y ℏ explícitos.', en: 'Covariant form with explicit c and ℏ.' }, moduleHref: '/modulos/08-formalismo-dirac', sourceUrl: 'https://www.nobelprize.org/prizes/physics/1933/dirac/facts/' },
  { id: 'feynman', year: 1948, name: 'Richard Feynman', years: '1918–1988', portrait: '/museum/richard-feynman.png', contribution: { es: 'Integral de caminos y electrodinámica cuántica.', en: 'Path integral and quantum electrodynamics.' }, biography: { es: 'Desarrolló una formulación basada en la suma de amplitudes sobre historias posibles y contribuyó decisivamente a la electrodinámica cuántica renormalizada.', en: 'He developed a formulation based on summing amplitudes over possible histories and made decisive contributions to renormalized quantum electrodynamics.' }, formula: String.raw`\langle x_f,t_f\mid x_i,t_i\rangle=\int_{x(t_i)=x_i}^{x(t_f)=x_f}\!\mathcal D x(t)\,e^{iS[x]/\hbar}`, formulaNote: { es: 'Forma esquemática; la normalización depende de la discretización y del sistema.', en: 'Schematic form; normalization depends on the discretization and system.' }, moduleHref: '/modulos/14-perturbaciones-tiempo', sourceUrl: 'https://www.nobelprize.org/prizes/physics/1965/feynman/facts/' },
];

const UI: Record<Locale, Record<string, string>> = {
  es: { timeline: 'Línea de tiempo de científicos de la mecánica cuántica', archive: 'archivo histórico', milestone: 'Hito de la teoría cuántica', study: 'Estudiar el módulo', source: 'Ficha biográfica Nobel', bridge: 'La ecuación presenta una puerta de entrada al desarrollo formal; el módulo asociado contiene sus hipótesis, alcance y deducción.', collection: 'Colección permanente', record: 'Registro', of: 'de', focus: 'Pieza en estudio' },
  en: { timeline: 'Timeline of quantum-mechanics scientists', archive: 'historical archive', milestone: 'Quantum-theory milestone', study: 'Study the module', source: 'Nobel biographical profile', bridge: 'The equation is an entry point to the formal development; the associated module covers its assumptions, scope, and derivation.', collection: 'Permanent collection', record: 'Record', of: 'of', focus: 'Work under study' },
};

export function MuseumExperience({ locale }: { locale: string }) {
  const [activeId, setActiveId] = useState('planck');
  const active = useMemo(() => SCIENTISTS.find((scientist) => scientist.id === activeId) ?? SCIENTISTS[0], [activeId]);
  const language: Locale = locale === 'en' ? 'en' : 'es';
  const t = UI[language];
  const activeYear = active.timelineLabel ?? String(active.year);
  const activeIndex = SCIENTISTS.findIndex((scientist) => scientist.id === active.id) + 1;

  return (
    <section aria-label={t.timeline}>
      <div className="mb-8 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/70 px-2 pt-1 shadow-[0_20px_60px_-42px_rgba(34,211,238,0.5)] sm:px-5">
        <div className="flex items-center justify-between gap-4 border-b border-zinc-800 px-3 py-3 text-[10px] font-mono uppercase tracking-[0.16em] text-zinc-500">
          <span>{t.collection}</span>
          <span className="text-cyan-400">1900 — 1948</span>
        </div>
        <div className="relative overflow-x-auto pb-4">
        <div className="relative flex min-w-max items-start gap-0 px-3 pt-7">
          <div className="absolute left-3 right-3 top-[2.55rem] h-px bg-linear-to-r from-cyan-400/20 via-cyan-400/70 to-indigo-400/20" />
          {SCIENTISTS.map((scientist) => {
            const selected = scientist.id === activeId;
            return <button key={scientist.id} type="button" onClick={() => setActiveId(scientist.id)} aria-pressed={selected} className="group relative z-10 w-28 px-2 text-center"><span className={`mx-auto block h-3 w-3 rounded-full border-2 transition-all ${selected ? 'border-cyan-200 bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.8)]' : 'border-zinc-700 bg-black group-hover:border-cyan-400'}`} /><span className={`mt-3 block font-mono text-[11px] ${selected ? 'text-cyan-300' : 'text-zinc-500'}`}>{scientist.timelineLabel ?? scientist.year}</span><span className={`mt-1 block text-xs font-medium leading-4 ${selected ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`}>{scientist.name}</span></button>;
          })}
        </div>
        </div>
      </div>

      <article className="grid overflow-hidden rounded-[1.5rem] border border-zinc-800 bg-black shadow-[0_30px_100px_-45px_rgba(6,182,212,0.38)] lg:grid-cols-[minmax(20rem,0.9fr)_minmax(0,1.1fr)]">
        <div className="relative min-h-[30rem] overflow-hidden border-b border-zinc-800 bg-zinc-950 lg:min-h-[40rem] lg:border-b-0 lg:border-r">
          <Image key={`ambient-${active.portrait}`} src={active.portrait} alt="" aria-hidden fill sizes="(min-width: 1024px) 45vw, 100vw" quality={90} className="scale-110 object-cover object-center opacity-25 blur-2xl grayscale" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(34,211,238,0.12),transparent_42%),linear-gradient(to_bottom,rgba(9,9,11,0.1),rgba(0,0,0,0.94))]" />
          <div className="absolute inset-4 border border-cyan-300/20 sm:inset-6">
            <div className="absolute inset-1 overflow-hidden border border-white/10 bg-black/30">
              <Image key={active.portrait} src={active.portrait} alt={`${language === 'es' ? 'Retrato histórico de' : 'Historical portrait of'} ${active.name}`} fill sizes="(min-width: 1024px) 42vw, 100vw" quality={100} priority={active.id === 'planck'} className="object-contain object-center grayscale contrast-125 brightness-110 transition-opacity duration-500" />
            </div>
          </div>
          <div className="absolute left-7 top-7 flex items-center gap-2 rounded-full border border-white/10 bg-black/65 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-300 backdrop-blur sm:left-9 sm:top-9"><span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />{t.focus}</div>
          <div className="absolute right-7 top-7 rounded border border-cyan-400/25 bg-black/65 px-2.5 py-1.5 font-mono text-[10px] tracking-[0.12em] text-cyan-300 backdrop-blur sm:right-9 sm:top-9">{String(activeIndex).padStart(2, '0')} / {String(SCIENTISTS.length).padStart(2, '0')}</div>
          <div className="absolute inset-x-0 bottom-0 z-10 bg-linear-to-t from-black via-black/95 to-transparent px-7 pb-7 pt-20 sm:px-9 sm:pb-9 sm:pt-28">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-cyan-300 drop-shadow-[0_1px_10px_rgba(0,0,0,1)]">{activeYear} · {t.archive}</p>
            <h2 className="mt-2 max-w-[90%] text-3xl font-semibold tracking-[-0.04em] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,1)] sm:text-4xl">{active.name}</h2>
            <p className="mt-1 text-sm font-medium text-zinc-300 drop-shadow-[0_1px_8px_rgba(0,0,0,1)]">{active.years}</p>
          </div>
        </div>
        <div className="flex flex-col p-6 sm:p-8 lg:p-10">
          <div className="flex items-center justify-between gap-3 text-[10px] font-mono uppercase tracking-[0.16em] text-cyan-400"><span className="flex items-center gap-2"><Landmark className="h-3.5 w-3.5" />{t.milestone}</span><span className="text-zinc-600">{t.record} {activeIndex} {t.of} {SCIENTISTS.length}</span></div>
          <h3 className="mt-4 text-xl font-semibold tracking-tight text-white sm:text-2xl">{active.contribution[language]}</h3>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base">{active.biography[language]}</p>
          <div className="my-7 overflow-x-auto border-y border-zinc-800 py-5 sm:my-9"><KaTeXRenderer math={active.formula} block className="text-xl text-cyan-100 sm:text-2xl" /></div>
          {active.formulaNote && <p className="-mt-3 mb-2 text-xs leading-5 text-zinc-500">{active.formulaNote[language]}</p>}
          <p className="text-sm leading-6 text-zinc-500">{t.bridge}</p>
          <div className="mt-auto flex flex-wrap items-center gap-4 pt-8"><Link href={active.moduleHref} className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cyan-500">{t.study} <ArrowRight className="h-4 w-4" /></Link><a href={active.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition-colors hover:text-cyan-300">{t.source} <ExternalLink className="h-3.5 w-3.5" /></a></div>
        </div>
      </article>
    </section>
  );
}
