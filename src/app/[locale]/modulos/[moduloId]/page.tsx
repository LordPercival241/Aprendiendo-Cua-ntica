'use client';

import React, { useState, use } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { COURSE_MODULES } from '@/types/module';
import { DETAILED_MODULES_DATA } from '@/content/modulesData';
import { COMPLETION_SECTIONS } from '@/content/completionSections';
import { notFound } from 'next/navigation';
import { KaTeXRenderer } from '@/components/math/KaTeXRenderer';
import { FormulaInspector } from '@/components/math/FormulaInspector';
import { MathMarkdown } from '@/components/math/MathMarkdown';
import { PdfViewer } from '@/components/pdf/PdfViewer';
import { ModuleSimulatorRouter } from '@/components/simulations/ModuleSimulatorRouter';
import { InteractiveChallenges } from '@/components/modules/InteractiveChallenges';
import { saveModuleLearningProgress } from '@/lib/learningProgress';
import {
  ArrowLeft,
  BookOpen,
  Sparkles,
  Award,
  FileText,
  Clock,
  GraduationCap,
  Send,
  CheckCircle2,
  AlertCircle,
  Quote
} from 'lucide-react';

export default function ModuleDetailPage({
  params,
}: {
  params: Promise<{ locale: string; moduloId: string }>;
}) {
  const resolvedParams = use(params);
  const { moduloId } = resolvedParams;
  const mod = COURSE_MODULES.find((m) => m.id === moduloId);

  if (!mod) {
    notFound();
  }

  const detailed = DETAILED_MODULES_DATA[mod.id];
  const sections = [...(detailed?.sections ?? []), ...(COMPLETION_SECTIONS[mod.id] ?? [])];
  const t = useTranslations('modules');
  const [activeTab, setActiveTab] = useState<'theory' | 'simulation' | 'challenges' | 'slides'>('theory');

  // Interactive POE state
  const [prediction, setPrediction] = useState('');
  const [observation, setObservation] = useState('');
  const [poeStep, setPoeStep] = useState<1 | 2 | 3>(1);
  const [poeSaved, setPoeSaved] = useState(false);

  const title = t(`${mod.titleKey}.title`);
  const desc = t(`${mod.descKey}.desc`);

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-10">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 mb-8 animate-fade-in">
        <Link
          href="/modulos"
          className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-cyan-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Currícula IF411</span>
        </Link>
        <span className="text-sm text-zinc-400">/</span>
        <span className="text-sm font-mono font-bold text-cyan-600 dark:text-cyan-400">
          {detailed?.syllabusUnit || `Unidad ${mod.unit}`}
        </span>
      </div>

      {/* Module Title Banner */}
      <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-8 sm:p-10 shadow-sm mb-10 animate-fade-in delay-100">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="px-4 py-1.5 rounded-lg text-sm font-mono font-bold bg-zinc-100 dark:bg-zinc-800 text-cyan-600 dark:text-cyan-400 border border-zinc-200 dark:border-zinc-700">
            {detailed?.syllabusUnit || `Unidad ${mod.unit}`} • IF411
          </span>
          <span className="px-3 py-1.5 rounded-lg text-sm font-mono text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800">
            Semana {mod.week}
          </span>
          {detailed?.hours && (
            <span className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-mono text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800">
              <Clock className="w-4 h-4 text-cyan-500" />
              <span>{detailed.hours} Horas Lectivas</span>
            </span>
          )}
          {mod.simulationType !== 'none' && (
            <span className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {mod.simulationType === 'three3d' ? '3D WebGL' : 'Simulación 2D'}
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white tracking-tight leading-tight">
          {title}
        </h1>
        <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400 max-w-4xl leading-relaxed">
          {desc}
        </p>

        {/* Syllabus Competencies */}
        {detailed?.learningOutcomes && (
          <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800">
            <h4 className="text-sm font-mono uppercase tracking-wider text-cyan-500 mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              <span>Competencias Específicas del Sílabo</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-zinc-600 dark:text-zinc-300">
              {detailed.learningOutcomes.map((outcome, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{outcome}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tabs Menu */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 mb-10 overflow-x-auto pb-1 animate-fade-in delay-200">
        <button
          type="button"
          onClick={() => setActiveTab('theory')}
          className={`flex items-center gap-2 px-6 py-3.5 text-sm font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'theory'
              ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400 font-bold'
              : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Teoría Completa del Sílabo</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('simulation')}
          className={`flex items-center gap-2 px-6 py-3.5 text-sm font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'simulation'
              ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400 font-bold'
              : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Simulador & Laboratorio POE</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('challenges')}
          className={`flex items-center gap-2 px-6 py-3.5 text-sm font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'challenges'
              ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400 font-bold'
              : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Retos de Evaluación (3 Niveles)</span>
        </button>

        {mod.slidesPath && mod.slidesPath.length > 0 && (
          <button
            type="button"
            onClick={() => setActiveTab('slides')}
            className={`flex items-center gap-2 px-6 py-3.5 text-sm font-semibold uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'slides'
                ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400 font-bold'
                : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Diapositivas ({mod.slidesPath.length})</span>
          </button>
        )}
      </div>

      {/* Tab 1: Comprehensive Theory — Full Width & Enlarged Presentation */}
      {activeTab === 'theory' && (
        <div className="mx-auto w-full max-w-6xl space-y-10">
          {sections.length > 0 ? (
            sections.map((sec, secIdx) => (
              <section
                key={sec.id}
                id={sec.id}
                className="space-y-9 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-10 lg:p-12 dark:border-zinc-800 dark:bg-zinc-950/85 dark:shadow-black/20 animate-slide-up"
                style={{ animationDelay: `${secIdx * 100}ms` }}
              >
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 pb-6 dark:border-zinc-800">
                  <div>
                    {sec.badge && (
                      <span className="mr-3 border-l-2 border-cyan-500 pl-2.5 text-[11px] font-mono font-semibold uppercase tracking-[0.12em] text-cyan-700 dark:text-cyan-300">
                        {sec.badge}
                      </span>
                    )}
                    <h2 className="mt-3 text-2xl font-semibold tracking-[-0.025em] text-zinc-950 sm:text-3xl dark:text-white">
                      {sec.title}
                    </h2>
                  </div>
                </div>

                {/* Summary Callout with Math Support */}
                <div className="border-l-2 border-cyan-500 py-1 pl-5 text-base leading-8 text-zinc-700 sm:text-lg dark:text-zinc-300">
                  <MathMarkdown content={sec.summary} inline />
                </div>

                {/* Detailed Body Paragraphs with KaTeX Integration */}
                <div className="text-base leading-[1.85] font-normal text-zinc-700 sm:text-lg dark:text-zinc-200">
                  <MathMarkdown content={sec.contentMarkdown.trim()} />
                </div>

                {/* Formula Inspector with Minutious Breakdown */}
                {sec.formulas && sec.formulas.length > 0 && (
                  <div className="pt-6">
                    <div className="mb-4 flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-[0.14em] text-cyan-700 dark:text-cyan-300">
                      <span className="h-px w-6 bg-cyan-500" />
                      <span>Análisis de ecuaciones</span>
                    </div>
                    {sec.formulas.map((form, fIdx) => (
                      <FormulaInspector key={fIdx} data={form} />
                    ))}
                  </div>
                )}

                {/* Academic Problem Context */}
                {sec.academicRelevance && (
                  <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm sm:text-base text-zinc-700 dark:text-zinc-300 flex items-start gap-4">
                    <AlertCircle className="w-5 h-5 text-cyan-500 shrink-0 mt-1" />
                    <div>
                      <strong className="font-semibold text-zinc-900 dark:text-white">Problemas Clave de Cátedra:</strong>{' '}
                      <MathMarkdown content={sec.academicRelevance} inline />
                    </div>
                  </div>
                )}

                {/* Citations Section */}
                {sec.citations && sec.citations.length > 0 && (
                  <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-2 text-sm font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-4 font-semibold">
                      <Quote className="w-4 h-4 text-cyan-400" />
                      <span>Referencias Bibliográficas</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {sec.citations.map((cite, cIdx) => (
                        <div key={cIdx} className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 leading-relaxed">
                          <span className="text-cyan-400 font-mono font-bold mr-2">[{cIdx + 1}]</span>
                          {cite}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            ))
          ) : (
            /* Fallback for other modules */
            <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-10 space-y-6">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                Contenido Teórico en Desarrollo
              </h2>
              <p className="text-base text-zinc-600 dark:text-zinc-400">
                Las derivaciones analíticas y desgloses de fórmulas están siendo incorporados de acuerdo con las diapositivas oficiales de la semana {mod.week}.
              </p>
              {mod.equationsPreview && (
                <div className="space-y-4">
                  {mod.equationsPreview.map((eq, idx) => (
                    <div key={idx} className="p-6 rounded-xl bg-zinc-950 text-center text-white">
                      <KaTeXRenderer math={eq} block />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Bibliografía Recomendada del Sílabo (Full Width Card) */}
          {detailed && detailed.suggestedReadings && detailed.suggestedReadings.length > 0 && (
            <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 p-8 sm:p-12 shadow-lg space-y-6 animate-slide-up">
              <div className="flex items-center gap-3 text-sm font-mono font-bold uppercase tracking-wider text-cyan-500">
                <BookOpen className="w-5 h-5" />
                <span>Bibliografía Recomendada del Sílabo</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {detailed.suggestedReadings.map((r, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-2">
                    <strong className="block text-base font-bold text-zinc-900 dark:text-white">{r.bookTitle}</strong>
                    <span className="block text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm">{r.chapters}</span>
                    <span className="inline-block px-2.5 py-1 rounded-md text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono font-semibold">{r.keyProblems}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Simulation & POE Interface */}
      {activeTab === 'simulation' && (
        <div className="space-y-8">
          <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-8 sm:p-10 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-mono uppercase tracking-wider text-cyan-500">
                  Metodología Activa POE (Predecir - Observar - Explicar)
                </span>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mt-2">
                  Laboratorio Computacional
                </h2>
              </div>
              <div className="flex items-center gap-2">
                {[1, 2, 3].map((step) => (
                  <button
                    key={step}
                    type="button"
                    onClick={() => setPoeStep(step as 1 | 2 | 3)}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-mono font-bold transition-colors cursor-pointer ${
                      poeStep === step
                        ? 'bg-cyan-600 text-white shadow-sm'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {step}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 1: Predict */}
            {poeStep === 1 && (
              <div className="p-6 rounded-2xl border border-zinc-700 bg-zinc-950 space-y-5">
                <div className="flex items-center gap-2 text-cyan-400 text-sm font-mono uppercase tracking-wider">
                  <AlertCircle className="w-5 h-5" />
                  <span>Fase 1: Planteamiento de Hipótesis Cuántica</span>
                </div>
                <p className="text-base text-zinc-300 leading-relaxed">
                  ¿Qué ocurrirá con la función de onda o las magnitudes medibles al modificar los parámetros del simulador? Escribe tu hipótesis antes de interactuar con el entorno.
                </p>
                <textarea
                  value={prediction}
                  onChange={(e) => setPrediction(e.target.value)}
                  placeholder="Formula tu hipótesis física aquí..."
                  rows={4}
                  className="w-full p-4 text-sm rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:ring-2 focus:ring-cyan-500 focus:outline-hidden"
                />
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setPoeStep(2)}
                    disabled={!prediction.trim()}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold uppercase tracking-wider text-white bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    <span>Confirmar Hipótesis y Desbloquear Simulación</span>
                    <Send className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPrediction(
                        mod.id === '01-introduccion-fisica-moderna'
                          ? 'Al aumentar la temperatura T, el pico espectral se desplazará hacia menores longitudes de onda (Ley de Wien) y la aproximación de Rayleigh-Jeans divergerá bruscamente en el ultravioleta.'
                          : mod.id === '02-efecto-fotoelectrico-compton'
                          ? 'Al incrementar la frecuencia por encima de la función de trabajo Φ, la energía cinética máxima aumentará linealmente, requiriendo un mayor potencial de frenado Vs para extinguir la fotocorriente.'
                          : 'Al incrementar la energía del paquete E respecto a la barrera V0, la probabilidad de tunelamiento aumentará exponencialmente conforme el ancho a decrece.'
                      );
                    }}
                    className="px-5 py-3 rounded-xl text-sm font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 hover:bg-cyan-900/50 transition-colors cursor-pointer"
                  >
                    Cargar hipótesis sugerida
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Observe */}
            {poeStep >= 2 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-300">
                  <div>
                    <span className="font-mono text-cyan-400 uppercase text-xs block">Hipótesis registrada:</span>
                    <span>&quot;{prediction}&quot;</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPoeStep(1)}
                    className="text-sm font-mono text-cyan-400 hover:underline cursor-pointer"
                  >
                    Editar
                  </button>
                </div>

                {/* Real Interactive Physics Simulator */}
                <ModuleSimulatorRouter moduleId={mod.id} />

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setPoeStep(3)}
                    className="px-6 py-3 rounded-xl text-sm font-semibold uppercase tracking-wider text-white bg-cyan-600 hover:bg-cyan-500 transition-colors cursor-pointer"
                  >
                    Continuar a Fase de Explicación →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Explain */}
            {poeStep === 3 && (
              <div className="p-6 rounded-2xl border border-zinc-700 bg-zinc-950 space-y-5">
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-mono uppercase tracking-wider">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Fase 3: Explicación y Confrontación Conceptual</span>
                </div>
                <p className="text-base text-zinc-300 leading-relaxed">
                  Compara tus observaciones con tu hipótesis inicial. ¿Cómo se relacionan los resultados numéricos con el formalismo matemático de la lección?
                </p>
                <textarea
                  value={observation}
                  onChange={(e) => setObservation(e.target.value)}
                  placeholder="Explica físicamente el fenómeno observado..."
                  rows={4}
                  className="w-full p-4 text-sm rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      saveModuleLearningProgress(mod.id, { poeCompleted: true });
                      setPoeSaved(true);
                    }}
                    disabled={!observation.trim()}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Guardar Explicación en Sesión</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setObservation(
                        mod.id === '01-introduccion-fisica-moderna'
                          ? 'Los datos del simulador confirman que la catástrofe ultravioleta surge del postulado clásico continuo. La cuantización discreta de Planck E = n h nu introduce el factor exponencial en el denominador que suprime la radiación en altas frecuencias.'
                          : 'Se verifica experimentalmente que la emisión de electrones solo ocurre si la energía del fotón h*nu excede la función de trabajo Φ del metal, validando la hipótesis corpuscular de Einstein.'
                      );
                    }}
                    className="px-5 py-3 rounded-xl text-sm font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 hover:bg-emerald-900/50 transition-colors cursor-pointer"
                  >
                    Cargar Síntesis Conceptual
                  </button>
                </div>
                {poeSaved && (
                  <p className="text-sm font-mono text-emerald-400 mt-2">
                    ✓ Respuestas del ciclo POE registradas en este dispositivo.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Interactive Challenges */}
      {activeTab === 'challenges' && (
        <InteractiveChallenges moduleId={mod.id} />
      )}

      {/* Tab 4: Slides Viewer */}
      {activeTab === 'slides' && mod.slidesPath && mod.slidesPath.length > 0 && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
              Diapositivas ({mod.slidesPath.length} Archivo(s))
            </h2>
          </div>
          {mod.slidesPath.map((path, idx) => (
            <div key={idx} className="space-y-2">
              <PdfViewer url={path} title={`${title} — Parte ${idx + 1}`} height="h-[750px]" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
