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
    <section className="rounded-2xl border border-zinc-800 bg-black/70 p-5 sm:p-6" aria-label={`Modelo físico: ${title}`}>
      <div className="mb-5 border-b border-zinc-800 pb-4">
        <p className="text-[10px] font-mono font-semibold uppercase tracking-[0.16em] text-cyan-400">Modelo físico</p>
        <h4 className="mt-1 text-base font-semibold tracking-tight text-white">{title}</h4>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-zinc-300">{phenomenon}</p>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        {equations.map((equation) => (
          <article key={equation.label} className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-cyan-300">{equation.label}</p>
            <div className="my-2 overflow-x-auto border-y border-zinc-800 py-2">
              <KaTeXRenderer block math={equation.math} className="text-base text-zinc-100" />
            </div>
            <p className="text-xs leading-5 text-zinc-400">{equation.explanation}</p>
          </article>
        ))}
      </div>

      <p className="mt-4 border-l-2 border-cyan-500/70 pl-3 text-xs leading-5 text-zinc-400">
        <span className="font-semibold text-zinc-200">Alcance del modelo: </span>{assumptions}
      </p>
    </section>
  );
}
