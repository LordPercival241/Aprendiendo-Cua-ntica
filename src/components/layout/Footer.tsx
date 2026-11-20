'use client';

import React from 'react';
import { Link } from '@/i18n/routing';
import { ExternalLink } from 'lucide-react';
import { QuantumMark } from '@/components/brand/QuantumMark';

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-slate-200 dark:border-slate-700/70 bg-white/90 dark:bg-[#1E293B]/95 backdrop-blur-md py-7 transition-colors">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/25 dark:border-amber-400/25">
                <QuantumMark className="w-7 h-7" />
              </div>
              <span className="font-bold text-base text-[#1E293B] dark:text-[#F1F5F9] tracking-tight">
                Aprendiendo Cuántica
              </span>
              <span className="text-xs text-[#475569] dark:text-[#94A3B8]">IF411 · UNI</span>
            </div>
            <p className="text-sm text-[#334155] dark:text-[#CBD5E1]">
              Plataforma de Mecánica Cuántica.
            </p>
          </div>

          <nav aria-label="Enlaces del pie de página" className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#334155] dark:text-[#CBD5E1]">
            <Link href="/modulos" className="hover:text-[#0284C7] dark:hover:text-[#38BDF8] transition-colors">Módulos</Link>
            <Link href="/recursos" className="hover:text-[#0284C7] dark:hover:text-[#38BDF8] transition-colors">Recursos</Link>
            <Link href="/progreso" className="hover:text-[#0284C7] dark:hover:text-[#38BDF8] transition-colors">Progreso</Link>
            <a href="/syllabus/IF411 MECANICA CUANTICA.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-[#0284C7] dark:hover:text-[#38BDF8] transition-colors">
              Sílabo <ExternalLink className="w-3 h-3" />
            </a>
          </nav>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#475569] dark:text-[#94A3B8]">
          <span>© {new Date().getFullYear()} Aprendiendo Cuántica — Facultad de Ciencias, UNI.</span>
          <span className="font-mono text-xs text-[#475569] dark:text-[#94A3B8]">
            by Dante Olivas 
          </span>
        </div>
      </div>
    </footer>
  );
}
