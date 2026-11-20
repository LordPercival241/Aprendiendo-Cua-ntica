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
  Radio,
  Sliders,
  ArrowRight,
  CheckCircle2,
  Layers
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
  Radio,
  Sliders
};

export default async function ModulesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ModulesContent />;
}

function ModulesContent() {
  const t = useTranslations('modules');

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-12">
      {/* Header */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 mb-4">
          <Layers className="w-4 h-4" />
          <span>Currícula Semestral IF411</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-[#1E293B] dark:text-[#F1F5F9] tracking-tight">
          {t('title')}
        </h1>
        <p className="mt-3 text-base sm:text-lg text-[#334155] dark:text-[#CBD5E1] max-w-3xl leading-relaxed">
          {t('subtitle')}
        </p>
      </div>

      {/* Grid of 13 Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {COURSE_MODULES.map((mod, idx) => {
          const Icon = ICONS_MAP[mod.icon] || Atom;
          const title = t(`${mod.titleKey}.title`);
          const desc = t(`${mod.descKey}.desc`);

          return (
            <div
              key={mod.id}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] p-6 shadow-sm hover:border-sky-500/60 hover:shadow-xl hover:shadow-sky-500/5 transition-all animate-slide-up"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div>
                {/* Meta pills */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                      {t('unitPrefix')} {mod.unit}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-[#475569] dark:text-[#94A3B8]">
                      {t('weekPrefix')} {mod.week}
                    </span>
                  </div>

                  {mod.simulationType !== 'none' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border border-indigo-500/20">
                      {mod.simulationType === 'three3d' ? '3D WebGL' : 'Sim 2D'}
                    </span>
                  )}
                </div>

                {/* Title */}
                <div className="flex items-start gap-3 mt-2">
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-sky-600 dark:text-sky-400 group-hover:bg-sky-500 group-hover:text-white transition-colors shrink-0">
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

                {/* Mathematical Formula Preview (Cajas de ecuaciones: #E2E8F0 light / #131C31 dark) */}
                {mod.equationsPreview && mod.equationsPreview.length > 0 && (
                  <div className="mt-4 p-3 rounded-xl bg-[#E2E8F0] dark:bg-[#131C31] border border-slate-300 dark:border-slate-700/80 text-[#1E293B] dark:text-[#F1F5F9] text-center overflow-x-auto">
                    <KaTeXRenderer math={mod.equationsPreview[0]} />
                  </div>
                )}
              </div>

              {/* Action link */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between">
                <Link
                  href={`/modulos/${mod.id}`}
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#0284C7] dark:text-[#38BDF8] group-hover:translate-x-1 transition-transform"
                >
                  <span>{t('startModule')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                {mod.hasPOE && (
                  <span className="flex items-center gap-1 text-xs text-amber-500 font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>POE</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
