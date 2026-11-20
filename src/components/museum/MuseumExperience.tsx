'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, ExternalLink, Landmark, Pause, Play } from 'lucide-react';
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
  es: { timeline: 'Línea de tiempo de científicos de la mecánica cuántica', archive: 'archivo histórico', milestone: 'Hito de la teoría cuántica', study: 'Estudiar el módulo', source: 'Ficha biográfica Nobel', bridge: 'La ecuación presenta una puerta de entrada al desarrollo formal; el módulo asociado contiene sus hipótesis, alcance y deducción.', collection: 'Colección permanente', record: 'Registro', of: 'de', focus: 'Pieza en estudio', previous: 'Científico anterior', next: 'Siguiente científico', pause: 'Pausar recorrido automático', play: 'Reanudar recorrido automático', paused: 'Recorrido en pausa', automatic: 'Recorrido automático' },
  en: { timeline: 'Timeline of quantum-mechanics scientists', archive: 'historical archive', milestone: 'Quantum-theory milestone', study: 'Study the module', source: 'Nobel biographical profile', bridge: 'The equation is an entry point to the formal development; the associated module covers its assumptions, scope, and derivation.', collection: 'Permanent collection', record: 'Record', of: 'of', focus: 'Work under study', previous: 'Previous scientist', next: 'Next scientist', pause: 'Pause automatic tour', play: 'Resume automatic tour', paused: 'Tour paused', automatic: 'Automatic tour' },
};

export function MuseumExperience({ locale }: { locale: string }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const timelineRailRef = useRef<HTMLDivElement | null>(null);
  const timelineItemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [transitionId, setTransitionId] = useState(0);
  const [travelDirection, setTravelDirection] = useState<'forward' | 'backward'>('forward');
  const [isPaused, setIsPaused] = useState(false);
  const [isInViewport, setIsInViewport] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const active = useMemo(() => SCIENTISTS[activeIndex] ?? SCIENTISTS[0], [activeIndex]);
  const language: Locale = locale === 'en' ? 'en' : 'es';
  const t = UI[language];
  const activeYear = active.timelineLabel ?? String(active.year);
  const displayIndex = activeIndex + 1;
  const animationClass = travelDirection === 'forward' ? 'animate-[museum-forward_700ms_cubic-bezier(0.16,1,0.3,1)_both]' : 'animate-[museum-backward_700ms_cubic-bezier(0.16,1,0.3,1)_both]';

  const move = useCallback((step: 1 | -1) => {
    setTravelDirection(step === 1 ? 'forward' : 'backward');
    setActiveIndex((current) => (current + step + SCIENTISTS.length) % SCIENTISTS.length);
    setTransitionId((current) => current + 1);
  }, []);

  const selectScientist = useCallback((index: number) => {
    setTravelDirection(index >= activeIndex ? 'forward' : 'backward');
    setActiveIndex(index);
    setTransitionId((current) => current + 1);
  }, [activeIndex]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = () => setPrefersReducedMotion(media.matches);
    const observer = new IntersectionObserver(([entry]) => setIsInViewport(entry.isIntersecting), { threshold: 0.28 });
    const updatePageVisibility = () => setIsPageVisible(!document.hidden);
    updateMotionPreference();
    if (sectionRef.current) observer.observe(sectionRef.current);
    document.addEventListener('visibilitychange', updatePageVisibility);
    media.addEventListener('change', updateMotionPreference);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', updatePageVisibility);
      media.removeEventListener('change', updateMotionPreference);
    };
  }, []);

  useEffect(() => {
    if (isPaused || prefersReducedMotion || !isInViewport || !isPageVisible) return;
    const timer = window.setInterval(() => move(1), 6200);
    return () => window.clearInterval(timer);
  }, [isPaused, prefersReducedMotion, isInViewport, isPageVisible, move]);

  // On narrow screens the timeline is a horizontal rail. Keep the selected
  // scientist centred in that rail without moving the document vertically.
  useEffect(() => {
    const rail = timelineRailRef.current;
    const item = timelineItemRefs.current[activeIndex];
    if (!rail || !item) return;

    rail.scrollTo({
      left: Math.max(0, item.offsetLeft - (rail.clientWidth - item.offsetWidth) / 2),
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  }, [activeIndex, prefersReducedMotion]);

  return (
    <section ref={sectionRef} aria-label={t.timeline} className="museum-experience lg:flex lg:h-full lg:min-h-0 lg:flex-col">
      <div className="mb-6 shrink-0 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] px-2 pt-1 shadow-lg sm:px-5 lg:mb-4">
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700 px-3 py-3 text-[10px] font-mono uppercase tracking-[0.16em] text-[#475569] dark:text-[#94A3B8] lg:py-2">
          <span>{t.collection}</span>
          <div className="flex items-center gap-1.5">
            <button type="button" onClick={() => move(-1)} aria-label={t.previous} title={t.previous} className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-300 dark:border-slate-700 text-[#334155] dark:text-[#CBD5E1] transition-colors hover:border-sky-500 hover:text-sky-600 dark:hover:text-sky-300"><ChevronLeft className="h-3.5 w-3.5" /></button>
            <button type="button" onClick={() => setIsPaused((paused) => !paused)} aria-label={isPaused ? t.play : t.pause} title={isPaused ? t.play : t.pause} aria-pressed={isPaused} className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-300 dark:border-slate-700 text-[#334155] dark:text-[#CBD5E1] transition-colors hover:border-sky-500 hover:text-sky-600 dark:hover:text-sky-300">{isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}</button>
            <button type="button" onClick={() => move(1)} aria-label={t.next} title={t.next} className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-300 dark:border-slate-700 text-[#334155] dark:text-[#CBD5E1] transition-colors hover:border-sky-500 hover:text-sky-600 dark:hover:text-sky-300"><ChevronRight className="h-3.5 w-3.5" /></button>
            <span className="ml-2 font-bold text-sky-600 dark:text-sky-400">1900 — 1948</span>
          </div>
        </div>
        <div ref={timelineRailRef} className="relative overflow-x-auto pb-4 scroll-smooth lg:pb-3">
        <div className="relative flex min-w-max items-start gap-0 px-3 pt-7 lg:pt-5">
          <div className="absolute left-3 right-3 top-[2.55rem] h-px bg-linear-to-r from-sky-400/20 via-sky-400/70 to-indigo-400/20 lg:top-[2rem]" />
          {SCIENTISTS.map((scientist, index) => {
            const selected = index === activeIndex;
            return <button ref={(element) => { timelineItemRefs.current[index] = element; }} key={scientist.id} type="button" onClick={() => selectScientist(index)} aria-pressed={selected} className="group relative z-10 w-28 px-2 text-center lg:w-[6.65rem]"><span className={`mx-auto block h-3 w-3 rounded-full border-2 transition-all ${selected ? 'border-sky-200 bg-sky-400 shadow-[0_0_18px_rgba(56,189,248,0.8)]' : 'border-slate-400 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 group-hover:border-sky-400'}`} /><span className={`mt-3 block font-mono text-[11px] lg:mt-2 ${selected ? 'text-sky-600 dark:text-sky-400 font-bold' : 'text-[#475569] dark:text-[#94A3B8]'}`}>{scientist.timelineLabel ?? scientist.year}</span><span className={`mt-1 block text-xs font-medium leading-4 ${selected ? 'text-[#1E293B] dark:text-[#F1F5F9] font-bold' : 'text-[#475569] dark:text-[#94A3B8] group-hover:text-slate-800 dark:group-hover:text-slate-200'}`}>{scientist.name}</span></button>;
          })}
        </div>
        </div>
      </div>

      <article className="grid overflow-hidden rounded-[1.5rem] border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] shadow-xl lg:h-full lg:min-h-0 lg:flex-1 lg:grid-cols-[minmax(20rem,0.9fr)_minmax(0,1.1fr)]">
        <div key={`portrait-${active.id}-${transitionId}`} className={`relative min-h-[26rem] overflow-hidden border-b border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-[#0F172A] lg:min-h-0 lg:border-b-0 lg:border-r ${animationClass}`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(56,189,248,0.12),transparent_42%),linear-gradient(to_bottom,rgba(15,23,42,0.05),rgba(15,23,42,0.85))]" />
          <div className="absolute inset-4 border border-sky-400/20 sm:inset-6">
            <div className="absolute inset-1 overflow-hidden border border-slate-300/40 dark:border-white/10 bg-white/20 dark:bg-black/30">
              <Image key={active.portrait} src={active.portrait} alt={`${language === 'es' ? 'Retrato histórico de' : 'Historical portrait of'} ${active.name}`} fill sizes="(min-width: 1024px) 42vw, 100vw" quality={100} loading="eager" className="object-contain object-center grayscale contrast-125 brightness-110 transition-opacity duration-500" />
            </div>
          </div>
          <div className="absolute left-7 top-7 flex items-center gap-2 rounded-full border border-slate-300/60 dark:border-white/10 bg-white/80 dark:bg-black/65 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#334155] dark:text-[#CBD5E1] backdrop-blur sm:left-9 sm:top-9"><span className="h-1.5 w-1.5 rounded-full bg-sky-500" />{t.focus}</div>
          <div className="absolute right-7 top-7 rounded border border-sky-500/25 bg-white/80 dark:bg-black/65 px-2.5 py-1.5 font-mono text-[10px] tracking-[0.12em] text-sky-600 dark:text-sky-300 backdrop-blur sm:right-9 sm:top-9">{String(activeIndex).padStart(2, '0')} / {String(SCIENTISTS.length).padStart(2, '0')}</div>
        </div>
        <div key={`detail-${active.id}-${transitionId}`} className={`flex min-h-0 flex-col p-6 sm:p-8 lg:overflow-y-auto lg:p-7 xl:p-8 ${animationClass}`}>
          <div className="flex items-center justify-between gap-3 text-[10px] font-mono uppercase tracking-[0.16em] text-sky-600 dark:text-sky-400"><span className="flex items-center gap-2"><Landmark className="h-3.5 w-3.5" />{t.milestone}</span><span className="font-semibold text-[#475569] dark:text-[#94A3B8]">{t.record} {displayIndex} {t.of} {SCIENTISTS.length}</span></div>
          <div className="mt-6 border-b border-slate-200 dark:border-slate-700/80 pb-6 sm:mt-8">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">{activeYear} · {t.archive}</p>
            <h2 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-[#1E293B] dark:text-[#F1F5F9] sm:text-4xl">{active.name}</h2>
            <p className="mt-1 text-sm font-medium text-[#475569] dark:text-[#94A3B8]">{active.years}</p>
          </div>
          <h3 className="mt-4 text-xl font-semibold tracking-tight text-[#1E293B] dark:text-[#F1F5F9] sm:text-2xl">{active.contribution[language]}</h3>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#334155] dark:text-[#CBD5E1] sm:text-base">{active.biography[language]}</p>
          <div className="museum-formula my-7 flex min-h-32 items-center justify-center overflow-visible rounded-2xl border border-slate-300 dark:border-slate-700/80 bg-[#E2E8F0] dark:bg-[#131C31] px-6 py-5 sm:my-9 shadow-inner">
            <KaTeXRenderer math={active.formula} block className="text-xl text-[#1E293B] dark:text-[#F1F5F9] sm:text-2xl" />
          </div>
          {active.formulaNote && <p className="-mt-3 mb-2 text-xs leading-5 text-[#475569] dark:text-[#94A3B8]">{active.formulaNote[language]}</p>}
          <p className="text-sm leading-6 text-[#475569] dark:text-[#94A3B8]">{t.bridge}</p>
          <div className="mt-auto flex flex-wrap items-center justify-between gap-5 pt-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#475569] dark:text-[#94A3B8]">{isPaused ? t.paused : t.automatic}</span>
            <div className="flex flex-wrap items-center gap-4"><Link href={active.moduleHref} className="inline-flex items-center gap-2 rounded-lg bg-[#0284C7] text-[#FFFFFF] hover:bg-[#0284C7]/90 dark:bg-[#38BDF8] dark:text-[#0F172A] dark:hover:bg-[#38BDF8]/90 px-4 py-2.5 text-sm font-bold shadow-md transition-all">{t.study} <ArrowRight className="h-4 w-4" /></Link><a href={active.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-[#475569] dark:text-[#94A3B8] transition-colors hover:text-sky-600 dark:hover:text-sky-300">{t.source} <ExternalLink className="h-3.5 w-3.5" /></a></div>
          </div>
        </div>
      </article>
    </section>
  );
}
