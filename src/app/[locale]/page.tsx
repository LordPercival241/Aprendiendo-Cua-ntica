import React from 'react';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { COURSE_MODULES } from '@/types/module';
import { KaTeXRenderer } from '@/components/math/KaTeXRenderer';
import {
  Atom,
  Zap,
  Waves,
  Activity,
  Wind,
  Box,
  ShieldAlert,
  Code,
  TrendingUp,
  Globe,
  RotateCw,
  GitFork,
  Sliders,
  ArrowRight,
  BookOpen,
  Sparkles,
  Layers,
  Compass,
  FileCheck,
  CheckCircle2
} from 'lucide-react';

const ICONS_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Atom,
  Zap,
  Waves,
  Activity,
  Wind,
  Box,
  ShieldAlert,
  Code,
  TrendingUp,
  Globe,
  RotateCw,
  GitFork,
  Sliders
};

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <LandingContent />;
}

function LandingContent() {
  const t = useTranslations('landing');
  const tm = useTranslations('modules');

  const stats = [
    { title: t('statsModules'), sub: t('statsModulesSub'), icon: Layers, color: 'text-cyan-400' },
    { title: t('statsSims'), sub: t('statsSimsSub'), icon: Sparkles, color: 'text-indigo-400' },
    { title: t('statsPOE'), sub: t('statsPOESub'), icon: Compass, color: 'text-zinc-300' },
    { title: t('statsHake'), sub: t('statsHakeSub'), icon: FileCheck, color: 'text-emerald-400' },
  ];

  const poeSteps = [
    {
      num: '01',
      title: t('poe1Title'),
      desc: t('poe1Desc'),
      badge: 'Hipótesis Previa',
      text: 'text-cyan-400',
    },
    {
      num: '02',
      title: t('poe2Title'),
      desc: t('poe2Desc'),
      badge: 'Simulación Numérica',
      text: 'text-indigo-400',
    },
    {
      num: '03',
      title: t('poe3Title'),
      desc: t('poe3Desc'),
      badge: 'Formalismo Teórico',
      text: 'text-emerald-400',
    },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 sm:py-28 lg:py-32">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-300/80 dark:border-slate-700/80 bg-white/80 dark:bg-[#1E293B]/80 text-[#334155] dark:text-[#CBD5E1] text-[11px] sm:text-xs font-mono shadow-sm backdrop-blur-md animate-fade-in">
            <span className="flex h-1.5 w-1.5 rounded-full bg-sky-400" />
            <span>{t('badge')}</span>
          </div>

          <h1 className="mt-8 text-5xl sm:text-6xl lg:text-7xl font-bold tracking-[-0.055em] text-[#1E293B] dark:text-[#F1F5F9] leading-[0.96] animate-fade-in delay-100">
            {t('heroTitle')}
          </h1>
          <p className="mt-5 text-lg sm:text-xl font-medium tracking-[-0.02em] gradient-text-cyan animate-fade-in delay-100">
            {t('heroHighlight')}
          </p>

          <p className="mt-6 text-base sm:text-lg text-[#334155] dark:text-[#CBD5E1] max-w-xl mx-auto leading-relaxed animate-fade-in delay-200">
            {t('heroSubtitle')}
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 animate-fade-in delay-300">
            <Link
              href="/modulos"
              className="flex items-center gap-2 px-6 py-3.5 rounded-lg font-bold text-sm bg-[#0284C7] text-[#FFFFFF] hover:bg-[#0284C7]/90 dark:bg-[#38BDF8] dark:text-[#0F172A] dark:hover:bg-[#38BDF8]/90 shadow-md active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>{t('ctaExplore')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/recursos"
              className="flex items-center gap-2 px-6 py-3.5 rounded-lg font-bold text-sm text-[#1E293B] dark:text-[#F1F5F9] bg-white/90 dark:bg-[#1E293B] border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-sm backdrop-blur-md transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-sky-500" />
              <span>Biblioteca & Diapositivas</span>
            </Link>

          </div>

          <p className="mt-8 text-xs font-mono uppercase tracking-[0.15em] text-[#475569] dark:text-[#94A3B8] animate-fade-in delay-400">
            IF411 · Teoría · Simulación · Evaluación
          </p>
        </div>
      </section>

      {/* Stats Ribbon */}
      <section className="relative z-10 border-y border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-[#1E293B]/70 backdrop-blur-md py-10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div key={idx} className="flex items-center gap-4 p-4 rounded-xl animate-slide-up" style={{ animationDelay: `${idx * 100}ms` }}>
                  <div className={`p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 ${s.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-lg sm:text-xl font-bold text-[#1E293B] dark:text-[#F1F5F9]">
                      {s.title}
                    </div>
                    <div className="text-sm text-[#475569] dark:text-[#94A3B8]">
                      {s.sub}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* POE Active Methodology Section */}
      <section className="py-24 relative z-10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sm font-mono uppercase tracking-wider text-sky-600 dark:text-sky-400 font-semibold">
              Investigación en Didáctica de la Física Cuántica
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-[#1E293B] dark:text-[#F1F5F9]">
              {t('methodologyTitle')}
            </h2>
            <p className="mt-4 text-base text-[#334155] dark:text-[#CBD5E1] leading-relaxed">
              Basado en los estudios de PhET, QuILT y QuVis: formular una predicción teórica antes de interactuar con el simulador reduce sustancialmente las concepciones erróneas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {poeSteps.map((step, idx) => (
              <div
                key={step.num}
                className="relative rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] p-8 shadow-sm hover:border-sky-500/50 transition-all animate-slide-up"
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                <div className="flex items-center justify-between mb-5">
                  <span className={`text-2xl font-mono font-bold ${step.text}`}>
                    {step.num}
                  </span>
                  <span className="px-3 py-1 rounded-lg text-xs font-mono tracking-wider uppercase border border-slate-300 dark:border-slate-600 text-[#475569] dark:text-[#94A3B8]">
                    {step.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#1E293B] dark:text-[#F1F5F9] mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-[#334155] dark:text-[#CBD5E1] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules Roadmap Grid */}
      <section className="py-20 relative z-10 bg-slate-50/60 dark:bg-[#0F172A]/70 border-t border-slate-200 dark:border-slate-700">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
            <div>
              <span className="text-sm font-mono uppercase tracking-wider text-sky-600 dark:text-sky-400 font-semibold">
                Currícula Universitaria IF411
              </span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-[#1E293B] dark:text-[#F1F5F9]">
                {t('syllabusTitle')}
              </h2>
              <p className="mt-3 text-base text-[#334155] dark:text-[#CBD5E1] max-w-2xl">
                {t('syllabusSubtitle')}
              </p>
            </div>
            <Link
              href="/modulos"
              className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#0284C7] dark:text-[#38BDF8] hover:underline"
            >
              <span>Ver todas las unidades</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Module Cards Grid (Tarjetas: #FFFFFF light / #1E293B dark) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {COURSE_MODULES.map((mod, idx) => {
              const Icon = ICONS_MAP[mod.icon] || Atom;
              const title = tm(`${mod.titleKey}.title`);
              const desc = tm(`${mod.descKey}.desc`);

              return (
                <div
                  key={mod.id}
                  className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] p-6 hover:border-sky-500/50 hover:shadow-xl hover:shadow-sky-500/5 transition-all animate-slide-up"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div>
                    {/* Header tags */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                          {tm('unitPrefix')} {mod.unit}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-xs font-mono text-[#475569] dark:text-[#94A3B8]">
                          {tm('weekPrefix')} {mod.week}
                        </span>
                      </div>
                      {mod.simulationType !== 'none' && (
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border border-indigo-500/20">
                          {mod.simulationType === 'three3d' ? '3D WebGL' : 'Sim 2D'}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <div className="flex items-start gap-3 mt-2">
                      <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sky-600 dark:text-sky-400 shrink-0 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-bold text-[#1E293B] dark:text-[#F1F5F9] leading-snug group-hover:text-sky-500 transition-colors">
                        {title}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="mt-3 text-sm text-[#334155] dark:text-[#CBD5E1] line-clamp-3 leading-relaxed">
                      {desc}
                    </p>

                    {/* Math Preview (Cajas de ecuaciones: #E2E8F0 light / #131C31 dark) */}
                    {mod.equationsPreview && mod.equationsPreview.length > 0 && (
                      <div className="mt-4 p-3 rounded-xl bg-[#E2E8F0] dark:bg-[#131C31] border border-slate-300 dark:border-slate-700/80 text-[#1E293B] dark:text-[#F1F5F9] text-center overflow-x-auto">
                        <KaTeXRenderer math={mod.equationsPreview[0]} />
                      </div>
                    )}
                  </div>

                  {/* Footer link */}
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between text-sm font-semibold">
                    <Link
                      href={`/modulos/${mod.id}`}
                      className="inline-flex items-center gap-1.5 text-[#0284C7] dark:text-[#38BDF8] group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>{tm('startModule')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    {mod.hasPOE && (
                      <span className="flex items-center gap-1 text-xs font-mono text-[#475569] dark:text-[#94A3B8]">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>POE</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Official Course Summary Box */}
          <div className="mt-14 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
            <div className="space-y-2 text-left">
              <span className="text-sm font-mono uppercase tracking-wider text-sky-600 dark:text-sky-400 font-semibold">
                Facultad de Ciencias — Universidad Nacional de Ingeniería
              </span>
              <h3 className="text-lg font-bold text-[#1E293B] dark:text-[#F1F5F9]">
                Curso IF411: Mecánica Cuántica (7 Créditos)
              </h3>
              <p className="text-sm text-[#334155] dark:text-[#CBD5E1] max-w-2xl leading-relaxed">
                El curso prepara al estudiante en el formalismo ondulatorio y matricial de la física cuántica, abarcando desde los fundamentos experimentales hasta la teoría de perturbaciones estacionarias y dependientes del tiempo.
              </p>
            </div>
            <Link
              href="/modulos"
              className="shrink-0 px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-wider bg-[#0284C7] text-white hover:bg-[#0284C7]/90 dark:bg-[#38BDF8] dark:text-[#0F172A] dark:hover:bg-[#38BDF8]/90 transition-colors shadow-md"
            >
              Ver Todas las Unidades →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
