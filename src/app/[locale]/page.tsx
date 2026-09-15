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
  CheckCircle2,
  ExternalLink
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
      <section className="relative pt-16 pb-24 sm:pt-24 sm:pb-32">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 text-center relative z-10">
          {/* Institutional Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-700/80 bg-zinc-900/80 text-zinc-300 text-sm font-mono mb-8 shadow-sm animate-fade-in">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>{t('badge')}</span>
          </div>

          {/* Hero Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black tracking-tight text-zinc-900 dark:text-white max-w-5xl mx-auto leading-[1.05] animate-fade-in delay-100">
            {t('heroTitle')}{' '}
            <span className="block mt-3 gradient-text-cyan">
              {t('heroHighlight')}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-8 text-lg sm:text-xl text-zinc-600 dark:text-zinc-300 max-w-3xl mx-auto leading-relaxed font-normal animate-fade-in delay-200">
            {t('heroSubtitle')}
          </p>

          {/* Mathematical Expressions Ticker */}
          <div className="mt-10 inline-flex flex-wrap items-center justify-center gap-6 sm:gap-10 px-8 py-4 rounded-2xl bg-zinc-100/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 shadow-xl backdrop-blur-md animate-fade-in delay-300">
            <div className="text-sm sm:text-base font-serif">
              <KaTeXRenderer math="i\hbar\frac{\partial}{\partial t}\Psi = \hat{H}\Psi" />
            </div>
            <div className="hidden sm:block text-zinc-400 text-xl">|</div>
            <div className="text-sm sm:text-base font-serif">
              <KaTeXRenderer math="\Delta x \Delta p \ge \frac{\hbar}{2}" />
            </div>
            <div className="hidden md:block text-zinc-400 text-xl">|</div>
            <div className="hidden md:block text-sm sm:text-base font-serif">
              <KaTeXRenderer math="\langle x | p \rangle = \frac{e^{ipx/\hbar}}{\sqrt{2\pi\hbar}}" />
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4 animate-fade-in delay-400">
            <Link
              href="/modulos"
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-sm uppercase tracking-wider text-white bg-cyan-600 hover:bg-cyan-500 shadow-lg shadow-cyan-900/30 active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>{t('ctaExplore')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/recursos"
              className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-sm uppercase tracking-wider text-zinc-800 dark:text-zinc-200 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 shadow-md transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-cyan-500" />
              <span>Biblioteca & Diapositivas</span>
            </Link>

            <a
              href="/syllabus/IF411 MECANICA CUANTICA.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-5 py-4 rounded-xl font-medium text-sm text-zinc-600 dark:text-zinc-400 hover:text-cyan-500 transition-colors cursor-pointer"
            >
              <span>{t('ctaSyllabus')}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Stats Ribbon */}
      <section className="relative z-10 border-y border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/50 backdrop-blur-md py-10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div key={idx} className="flex items-center gap-4 p-4 rounded-xl animate-slide-up" style={{ animationDelay: `${idx * 100}ms` }}>
                  <div className={`p-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 ${s.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white">
                      {s.title}
                    </div>
                    <div className="text-sm text-zinc-500 dark:text-zinc-400">
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
            <span className="text-sm font-mono uppercase tracking-wider text-cyan-500">
              Investigación en Didáctica de la Física Cuántica
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white">
              {t('methodologyTitle')}
            </h2>
            <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Basado en los estudios de PhET, QuILT y QuVis: formular una predicción teórica antes de interactuar con el simulador reduce sustancialmente las concepciones erróneas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {poeSteps.map((step, idx) => (
              <div
                key={step.num}
                className="relative rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 shadow-sm hover:border-cyan-500/30 transition-all animate-slide-up"
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                <div className="flex items-center justify-between mb-5">
                  <span className={`text-2xl font-mono font-bold ${step.text}`}>
                    {step.num}
                  </span>
                  <span className="px-3 py-1 rounded-lg text-xs font-mono tracking-wider uppercase border border-zinc-700 text-zinc-300">
                    {step.badge}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules Roadmap Grid */}
      <section className="py-20 relative z-10 bg-zinc-50/60 dark:bg-zinc-950/60 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
            <div>
              <span className="text-sm font-mono uppercase tracking-wider text-cyan-500">
                Currícula Universitaria IF411
              </span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white">
                {t('syllabusTitle')}
              </h2>
              <p className="mt-3 text-base text-zinc-600 dark:text-zinc-400 max-w-2xl">
                {t('syllabusSubtitle')}
              </p>
            </div>
            <Link
              href="/modulos"
              className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 hover:underline"
            >
              <span>Ver todas las unidades</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Module Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {COURSE_MODULES.map((mod, idx) => {
              const Icon = ICONS_MAP[mod.icon] || Atom;
              const title = tm(`${mod.titleKey}.title`);
              const desc = tm(`${mod.descKey}.desc`);

              return (
                <div
                  key={mod.id}
                  className="group relative flex flex-col justify-between rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 p-6 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/5 transition-all animate-slide-up"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div>
                    {/* Header tags */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-zinc-100 dark:bg-zinc-800 text-cyan-600 dark:text-cyan-400 border border-zinc-200 dark:border-zinc-700">
                          {tm('unitPrefix')} {mod.unit}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-xs font-mono text-zinc-500 dark:text-zinc-400">
                          {tm('weekPrefix')} {mod.week}
                        </span>
                      </div>
                      {mod.simulationType !== 'none' && (
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {mod.simulationType === 'three3d' ? '3D WebGL' : 'Sim 2D'}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <div className="flex items-start gap-3 mt-2">
                      <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-cyan-500 shrink-0 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-semibold text-zinc-900 dark:text-white leading-snug group-hover:text-cyan-400 transition-colors">
                        {title}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                      {desc}
                    </p>

                    {/* Math Preview */}
                    {mod.equationsPreview && mod.equationsPreview.length > 0 && (
                      <div className="mt-4 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 text-center overflow-x-auto">
                        <KaTeXRenderer math={mod.equationsPreview[0]} />
                      </div>
                    )}
                  </div>

                  {/* Footer link */}
                  <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-sm font-semibold">
                    <Link
                      href={`/modulos/${mod.id}`}
                      className="inline-flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400 group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>{tm('startModule')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    {mod.hasPOE && (
                      <span className="flex items-center gap-1 text-xs font-mono text-zinc-400">
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
          <div className="mt-14 p-8 rounded-2xl border border-zinc-800 bg-zinc-900/60 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2 text-left">
              <span className="text-sm font-mono uppercase tracking-wider text-cyan-400">
                Facultad de Ciencias — Universidad Nacional de Ingeniería
              </span>
              <h3 className="text-lg font-bold text-white">
                Curso IF411: Mecánica Cuántica (7 Créditos)
              </h3>
              <p className="text-sm text-zinc-400 max-w-2xl leading-relaxed">
                El curso prepara al estudiante en el formalismo ondulatorio y matricial de la física cuántica, abarcando desde los fundamentos experimentales hasta la teoría de perturbaciones estacionarias y dependientes del tiempo.
              </p>
            </div>
            <Link
              href="/modulos"
              className="shrink-0 px-6 py-3 rounded-xl text-sm font-semibold uppercase tracking-wider text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-colors"
            >
              Ver Todas las Unidades →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
