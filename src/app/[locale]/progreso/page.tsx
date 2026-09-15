'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { COURSE_MODULES } from '@/types/module';
import { KaTeXRenderer } from '@/components/math/KaTeXRenderer';
import { countCompletedModules, LearningProgress, readLearningProgress } from '@/lib/learningProgress';
import {
  Award,
  TrendingUp,
  Layers,
  BarChart3,
  Flame,
  HelpCircle
} from 'lucide-react';

export default function ProgressDashboardPage() {
  const t = useTranslations('progress');

  const [learningProgress, setLearningProgress] = useState<LearningProgress>({});

  useEffect(() => {
    const timer = window.setTimeout(() => setLearningProgress(readLearningProgress()), 0);
    const onStorage = () => setLearningProgress(readLearningProgress());
    window.addEventListener('storage', onStorage);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const completedModules = countCompletedModules(learningProgress);
  const totalModules = COURSE_MODULES.length;
  const progressPercent = Math.round((completedModules / totalModules) * 100);
  const moduleValues = Object.values(learningProgress);
  const challengesSolved = moduleValues.reduce((total, item) => total + item.quizAnswered, 0);
  const poeResponses = moduleValues.filter((item) => item.poeCompleted).length;
  const preTestScore = 0;
  const postTestScore = 0;

  // Hake Gain calculation: g = (post - pre) / (100 - pre)
  const hakeGain = preTestScore < 100 && postTestScore > preTestScore
    ? Number(((postTestScore - preTestScore) / (100 - preTestScore)).toFixed(2))
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-3">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Analítica de Aprendizaje Cuántico</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white">
          {t('title')}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-3xl">
          {t('subtitle')}
        </p>
        <p className="mt-4 inline-flex items-center gap-2 rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-3 py-2 text-xs text-zinc-600 dark:text-zinc-400">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
          Progreso guardado localmente en este navegador.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-zinc-500">Módulos</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-500">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-zinc-900 dark:text-white">
            {completedModules} / {totalModules}
          </div>
          <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-cyan-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-[11px] text-zinc-400 mt-2 block font-medium">
            {progressPercent}% del sílabo completado
          </span>
        </div>

        <div className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-zinc-500">Retos Resueltos</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-zinc-900 dark:text-white">
            {challengesSolved}
          </div>
          <span className="text-[11px] text-zinc-400 mt-3 block font-medium">
            Niveles 1, 2 y 3 completados
          </span>
        </div>

        <div className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-zinc-500">Hipótesis POE</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-zinc-900 dark:text-white">
            {poeResponses}
          </div>
          <span className="text-[11px] text-zinc-400 mt-3 block font-medium">
            Predicciones y explicaciones guardadas
          </span>
        </div>

        <div className="p-6 rounded-3xl border border-emerald-500/30 bg-emerald-50/10 dark:bg-emerald-950/20">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              Ganancia de Hake ⟨g⟩
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-500">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {hakeGain ?? '—'}
          </div>
          <span className="text-[11px] text-emerald-500/90 mt-3 block font-semibold">
            Requiere pre y post test
          </span>
        </div>
      </div>

      {/* Hake Gain Pedagogical Box */}
      <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 p-6 sm:p-8 space-y-4 mb-10">
        <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold text-sm">
          <HelpCircle className="w-4 h-4" />
          <span>¿Cómo se evalúa la Ganancia de Hake en la Investigación Educativa?</span>
        </div>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-4xl">
          El factor de ganancia normalizada propuesto por Richard Hake (1998) se calculará cuando el estudiante complete un pretest y un postest comparables:
        </p>

        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 text-center">
          <KaTeXRenderer
            math="\langle g \rangle = \frac{\%_{\text{post}} - \%_{\text{pre}}}{100 - \%_{\text{pre}}}"
            block
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
            <span className="font-bold text-emerald-500">Alta Ganancia (g ≥ 0.7)</span>
            <p className="text-zinc-500 mt-0.5">Comprensión profunda y sólida del formalismo.</p>
          </div>
          <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
            <span className="font-bold text-cyan-500">Media (0.3 ≤ g &lt; 0.7)</span>
            <p className="text-zinc-500 mt-0.5">Aprendizaje activo estándar alcanzado.</p>
          </div>
          <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
            <span className="font-bold text-amber-500">Baja (g &lt; 0.3)</span>
            <p className="text-zinc-500 mt-0.5">Típico de métodos tradicionales de conferencia pasiva.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
