'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ExternalLink, GraduationCap, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

export function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="relative z-10 border-t border-zinc-200 dark:border-zinc-800/60 bg-white/50 dark:bg-black/80 backdrop-blur-md py-14 transition-colors">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Col 1: Brand & Uni */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1">
                <Image
                  src="/logo.png"
                  alt="Aprendiendo Cuántica"
                  width={28}
                  height={28}
                  className="dark:invert opacity-80"
                />
              </div>
              <span className="font-bold text-base text-zinc-900 dark:text-white tracking-tight">
                Aprendiendo Cuántica
              </span>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-md leading-relaxed">
              {t('text')} Diseñado bajo el enfoque pedagógico de física cuántica moderna, integrando simulación numérica y formalismo riguroso.
            </p>
            <div className="flex items-center gap-2 text-sm text-zinc-500 pt-1">
              <GraduationCap className="w-4 h-4 text-cyan-500" />
              <span>Universidad Nacional de Ingeniería — Facultad de Ciencias</span>
            </div>
          </div>

          {/* Col 2: Accesos Directos */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-200 mb-4">
              Estructura Académica
            </h4>
            <ul className="space-y-2.5 text-sm text-zinc-600 dark:text-zinc-400">
              <li>
                <Link href="/modulos" className="hover:text-cyan-500 transition-colors">
                  13 Unidades del Sílabo
                </Link>
              </li>
              <li>
                <Link href="/recursos" className="hover:text-cyan-500 transition-colors">
                  Diapositivas y Textos Clásicos
                </Link>
              </li>
              <li>
                <Link href="/progreso" className="hover:text-cyan-500 transition-colors">
                  Analítica de Aprendizaje
                </Link>
              </li>
              <li>
                <a
                  href="/syllabus/IF411 MECANICA CUANTICA.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-cyan-500 transition-colors"
                >
                  Sílabo Oficial PDF <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Base en Investigación */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-200 mb-4">
              Enfoque Pedagógico
            </h4>
            <ul className="space-y-2.5 text-sm text-zinc-600 dark:text-zinc-400">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-500 shrink-0" />
                <span>Metodología Activa POE</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-500 shrink-0" />
                <span>QuILT (Doble Rendija)</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-500 shrink-0" />
                <span>Simulaciones QuVis & PhET</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-500 shrink-0" />
                <span>Evaluación de Ganancia de Hake ⟨g⟩</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-zinc-500">
          <span>© {new Date().getFullYear()} Aprendiendo Cuántica — Facultad de Ciencias, UNI.</span>
          <span className="font-mono text-xs text-zinc-400">
            Mecánica Cuántica IF411
          </span>
        </div>
      </div>
    </footer>
  );
}
