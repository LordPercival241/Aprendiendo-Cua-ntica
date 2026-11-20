'use client';

import React, { useState } from 'react';
import { KaTeXRenderer } from './KaTeXRenderer';
import { MathMarkdown } from './MathMarkdown';
import { Info, CheckCircle2, ChevronDown, ChevronUp, Copy, Check, ShieldAlert } from 'lucide-react';

export interface FormulaVariable {
  symbol: string;
  name: string;
  units: string;
  description: string;
  significance?: string;
}

export interface FormulaData {
  title: string;
  formula: string;
  label?: string;
  category?: string;
  context: string;
  variables: FormulaVariable[];
  physicalMeaning: string;
  boundaryConditions?: string;
  classicalLimit?: string;
}

interface FormulaInspectorProps {
  data: FormulaData;
  className?: string;
}

export function FormulaInspector({ data, className = '' }: FormulaInspectorProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [copied, setCopied] = useState(false);

  const copyLaTeX = () => {
    navigator.clipboard.writeText(data.formula);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to render unit either as KaTeX if it contains LaTeX or as styled text
  const renderUnits = (units: string) => {
    if (!units) return <span className="text-zinc-500">—</span>;
    if (units.includes('\\') || units.includes('^') || units.includes('{') || units.includes('_')) {
      return <KaTeXRenderer math={units} block={false} />;
    }
    return <span className="font-mono text-sm text-zinc-300">{units}</span>;
  };

  return (
    <div className={`my-8 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] shadow-lg shadow-black/5 transition-all animate-fade-in ${className}`}>
      {/* Formula Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/80 px-5 py-3.5">
        <div className="flex items-center gap-3">
          {data.category && (
            <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/30">
              {data.category}
            </span>
          )}
          <h4 className="text-base font-bold text-[#1E293B] dark:text-[#F1F5F9] tracking-tight">
            {data.title}
          </h4>
        </div>

        <div className="flex items-center gap-2">
          {data.label && (
            <span className="text-sm font-mono text-[#475569] dark:text-[#94A3B8] bg-slate-200 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700/60">
              {data.label}
            </span>
          )}
          <button
            onClick={copyLaTeX}
            title="Copiar LaTeX"
            className="p-2 rounded-lg text-[#475569] dark:text-[#94A3B8] hover:text-[#1E293B] dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg text-[#475569] dark:text-[#94A3B8] hover:text-[#1E293B] dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Colapsar o expandir"
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Primary Mathematical Display — Cajas de ecuaciones (spec: #131C31 dark / #E2E8F0 light) */}
      <div className="overflow-x-auto border-b border-slate-300 dark:border-slate-700/80 bg-[#E2E8F0] dark:bg-[#131C31] px-6 py-6 text-center text-[#1E293B] dark:text-[#F1F5F9]">
        <KaTeXRenderer math={data.formula} block className="text-xl sm:text-2xl text-[#1E293B] dark:text-[#F1F5F9]" />
      </div>

      {/* Detailed Analysis Accordion */}
      {isOpen && (
        <div className="p-6 sm:p-8 space-y-8 text-sm text-[#334155] dark:text-[#CBD5E1]">
          {/* Physical Context Statement */}
          <div className="p-5 rounded-xl bg-slate-50 dark:bg-[#0F172A] border-l-4 border-sky-500 text-[#1E293B] dark:text-[#F1F5F9] leading-relaxed">
            <span className="font-bold text-sky-600 dark:text-sky-400 mr-2 uppercase text-xs tracking-wider block sm:inline mb-1">
              Fundamento Físico:
            </span>
            <MathMarkdown content={data.context} inline />
          </div>

          {/* Minutious Variable Breakdown Table */}
          <div>
            <div className="flex items-center gap-2 mb-4 text-[#1E293B] dark:text-[#F1F5F9] font-bold uppercase tracking-wider text-sm">
              <Info className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              <span>Desglose Analítico de Términos y Operadores</span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0F172A]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-xs font-bold text-[#475569] dark:text-[#94A3B8] uppercase tracking-wider">
                    <th className="py-3 px-4 w-28">Símbolo</th>
                    <th className="py-3 px-4 w-40">Magnitud Físico-Matemática</th>
                    <th className="py-3 px-4 w-36">Unidades SI / Atómicas</th>
                    <th className="py-3 px-4">Interpretación Meticulosa & Rol en la Dinámica</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700/60 text-sm">
                  {data.variables.map((v, idx) => (
                    <tr key={idx} className="hover:bg-slate-100/70 dark:hover:bg-slate-800/70 transition-colors">
                      <td className="py-3 px-4 font-semibold text-sky-600 dark:text-sky-400 whitespace-nowrap">
                        <KaTeXRenderer math={v.symbol} />
                      </td>
                      <td className="py-3 px-4 font-medium text-[#1E293B] dark:text-[#F1F5F9]">
                        {v.name}
                      </td>
                      <td className="py-3 px-4">
                        {renderUnits(v.units)}
                      </td>
                      <td className="py-3 px-4 text-[#334155] dark:text-[#CBD5E1] leading-relaxed">
                        <MathMarkdown content={v.description} inline />
                        {v.significance && (
                          <span className="block mt-1.5 text-xs text-sky-600 dark:text-sky-400 font-medium">
                            • <MathMarkdown content={v.significance} inline />
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Deep Interpretation & Conditions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0F172A] space-y-2">
              <h5 className="text-sm font-bold uppercase tracking-wider text-[#1E293B] dark:text-[#F1F5F9] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span>Alcance e Implicancia Cuántica</span>
              </h5>
              <div className="text-sm text-[#334155] dark:text-[#CBD5E1] leading-relaxed">
                <MathMarkdown content={data.physicalMeaning} />
              </div>
            </div>

            {(data.boundaryConditions || data.classicalLimit) && (
              <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0F172A] space-y-2">
                <h5 className="text-sm font-bold uppercase tracking-wider text-[#1E293B] dark:text-[#F1F5F9] flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-500" />
                  <span>Condiciones de Contorno & Límite Clásico</span>
                </h5>
                <div className="text-sm text-[#334155] dark:text-[#CBD5E1] leading-relaxed space-y-2">
                  {data.boundaryConditions && (
                    <div>
                      <strong className="text-[#1E293B] dark:text-[#F1F5F9]">Frontera / Regularidad:</strong>{' '}
                      <MathMarkdown content={data.boundaryConditions} inline />
                    </div>
                  )}
                  {data.classicalLimit && (
                    <div>
                      <strong className="text-[#1E293B] dark:text-[#F1F5F9]">Límite Clásico:</strong>{' '}
                      <MathMarkdown content={data.classicalLimit} inline />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
