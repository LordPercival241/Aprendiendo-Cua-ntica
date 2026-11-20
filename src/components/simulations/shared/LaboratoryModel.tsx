'use client';

import { KaTeXRenderer } from '@/components/math/KaTeXRenderer';

export interface LaboratoryEquation {
  label: string;
  math: string;
  explanation: string;
}

interface LaboratoryModelProps {
  title: string;
  phenomenon: string;
  equations: LaboratoryEquation[];
  assumptions: string;
}

/**
 * Compact, explicit statement of the physical model used by a laboratory.
 * Keeping the equations next to the controls makes clear which calculated
 * quantities are predictions and which canvas elements are pedagogical views.
 */
export function LaboratoryModel({ title, phenomenon, equations, assumptions }: LaboratoryModelProps) {
  return (
    <section className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] p-5 sm:p-6 shadow-md" aria-label={`Modelo físico: ${title}`}>
      <div className="mb-5 border-b border-slate-200 dark:border-slate-700 pb-4">
        <p className="text-[10px] font-mono font-semibold uppercase tracking-[0.16em] text-sky-600 dark:text-sky-400">Modelo físico</p>
        <h4 className="mt-1 text-base font-bold tracking-tight text-[#1E293B] dark:text-[#F1F5F9]">{title}</h4>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-[#334155] dark:text-[#CBD5E1]">{phenomenon}</p>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        {equations.map((equation) => (
          <article key={equation.label} className="rounded-xl border border-slate-300 dark:border-slate-700/80 bg-[#E2E8F0] dark:bg-[#131C31] p-4 text-[#1E293B] dark:text-[#F1F5F9]">
            <p className="text-[11px] font-bold uppercase tracking-wide text-sky-600 dark:text-sky-400">{equation.label}</p>
            <div className="my-2 overflow-x-auto border-y border-slate-300 dark:border-slate-700/80 py-2">
              <KaTeXRenderer block math={equation.math} className="text-base text-[#1E293B] dark:text-[#F1F5F9]" />
            </div>
            <p className="text-xs leading-5 text-[#475569] dark:text-[#94A3B8]">{equation.explanation}</p>
          </article>
        ))}
      </div>

      <p className="mt-4 border-l-2 border-sky-500/70 pl-3 text-xs leading-5 text-[#475569] dark:text-[#94A3B8]">
        <span className="font-semibold text-[#1E293B] dark:text-[#F1F5F9]">Alcance del modelo: </span>{assumptions}
      </p>
    </section>
  );
}
