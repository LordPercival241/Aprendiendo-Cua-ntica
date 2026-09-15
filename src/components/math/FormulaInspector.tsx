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
    <div className={`my-8 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/95 shadow-lg shadow-black/10 transition-all animate-fade-in ${className}`}>
      {/* Formula Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 bg-zinc-900/90 px-5 py-3.5">
        <div className="flex items-center gap-3">
          {data.category && (
            <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              {data.category}
            </span>
          )}
          <h4 className="text-base font-semibold text-zinc-100 tracking-tight">
            {data.title}
          </h4>
        </div>

        <div className="flex items-center gap-2">
          {data.label && (
            <span className="text-sm font-mono text-zinc-400 bg-zinc-800/80 px-2.5 py-1 rounded-lg border border-zinc-700/60">
              {data.label}
            </span>
          )}
          <button
            onClick={copyLaTeX}
            title="Copiar LaTeX"
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Colapsar o expandir"
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Primary Mathematical Display — LARGER */}
      <div className="overflow-x-auto border-b border-zinc-800/80 bg-black/30 px-6 py-6 text-center">
        <KaTeXRenderer math={data.formula} block className="text-xl sm:text-2xl text-cyan-100" />
      </div>

      {/* Detailed Analysis Accordion */}
      {isOpen && (
        <div className="p-6 sm:p-8 space-y-8 text-sm text-zinc-300">
          {/* Physical Context Statement */}
          <div className="p-5 rounded-xl bg-zinc-900/60 border-l-4 border-cyan-500 text-zinc-200 leading-relaxed">
            <span className="font-bold text-cyan-400 mr-2 uppercase text-xs tracking-wider block sm:inline mb-1">
              Fundamento Físico:
            </span>
            <MathMarkdown content={data.context} inline />
          </div>

          {/* Minutious Variable Breakdown Table */}
          <div>
            <div className="flex items-center gap-2 mb-4 text-zinc-200 font-bold uppercase tracking-wider text-sm">
              <Info className="w-5 h-5 text-cyan-400" />
              <span>Desglose Analítico de Términos y Operadores</span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/40">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-900 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    <th className="py-3 px-4 w-28">Símbolo</th>
                    <th className="py-3 px-4 w-40">Magnitud Físico-Matemática</th>
                    <th className="py-3 px-4 w-36">Unidades SI / Atómicas</th>
                    <th className="py-3 px-4">Interpretación Meticulosa & Rol en la Dinámica</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-sm">
                  {data.variables.map((v, idx) => (
                    <tr key={idx} className="hover:bg-zinc-900/70 transition-colors">
                      <td className="py-3 px-4 font-semibold text-cyan-300 whitespace-nowrap">
                        <KaTeXRenderer math={v.symbol} />
                      </td>
                      <td className="py-3 px-4 font-medium text-zinc-200">
                        {v.name}
                      </td>
                      <td className="py-3 px-4">
                        {renderUnits(v.units)}
                      </td>
                      <td className="py-3 px-4 text-zinc-300 leading-relaxed">
                        <MathMarkdown content={v.description} inline />
                        {v.significance && (
                          <span className="block mt-1.5 text-xs text-cyan-400/90 font-medium">
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
            <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/50 space-y-2">
              <h5 className="text-sm font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Alcance e Implicancia Cuántica</span>
              </h5>
              <div className="text-sm text-zinc-300 leading-relaxed">
                <MathMarkdown content={data.physicalMeaning} />
              </div>
            </div>

            {(data.boundaryConditions || data.classicalLimit) && (
              <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/50 space-y-2">
                <h5 className="text-sm font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>Condiciones de Contorno & Límite Clásico</span>
                </h5>
                <div className="text-sm text-zinc-300 leading-relaxed space-y-2">
                  {data.boundaryConditions && (
                    <div>
                      <strong className="text-zinc-200">Frontera / Regularidad:</strong>{' '}
                      <MathMarkdown content={data.boundaryConditions} inline />
                    </div>
                  )}
                  {data.classicalLimit && (
                    <div>
                      <strong className="text-zinc-200">Límite Clásico:</strong>{' '}
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
