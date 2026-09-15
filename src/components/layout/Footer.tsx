'use client';

import React from 'react';
import { Link } from '@/i18n/routing';
import { ExternalLink } from 'lucide-react';
import { QuantumMark } from '@/components/brand/QuantumMark';

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-zinc-200 dark:border-zinc-800/60 bg-white/50 dark:bg-black/80 backdrop-blur-md py-7 transition-colors">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-cyan-500/5 dark:bg-cyan-400/5 border border-cyan-500/20 dark:border-cyan-400/20 text-cyan-700 dark:text-cyan-300">
                <QuantumMark className="w-7 h-7" />
              </div>
              <span className="font-bold text-base text-zinc-900 dark:text-white tracking-tight">
                Aprendiendo Cuántica
              </span>
              <span className="text-xs text-zinc-500">IF411 · UNI</span>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Plataforma de Mecánica Cuántica.
            </p>
          </div>

          <nav aria-label="Enlaces del pie de página" className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            <Link href="/modulos" className="hover:text-cyan-500 transition-colors">Módulos</Link>
            <Link href="/recursos" className="hover:text-cyan-500 transition-colors">Recursos</Link>
            <Link href="/progreso" className="hover:text-cyan-500 transition-colors">Progreso</Link>
            <a href="/syllabus/IF411 MECANICA CUANTICA.pdf" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-cyan-500 transition-colors">
              Sílabo <ExternalLink className="w-3 h-3" />
            </a>
          </nav>
        </div>

        <div className="mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-500">
          <span>© {new Date().getFullYear()} Aprendiendo Cuántica — Facultad de Ciencias, UNI.</span>
          <span className="font-mono text-xs text-zinc-400">
            Mecánica Cuántica IF411
          </span>
        </div>
      </div>
    </footer>
  );
}
