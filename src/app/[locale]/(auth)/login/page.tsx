'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import { Atom, Shield, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const t = useTranslations('auth');
  const { signInWithGoogle, loginAsDemoStudent, isLoading } = useSupabase();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-8 shadow-xl backdrop-blur-md">
        {/* Brand Icon */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-linear-to-tr from-cyan-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-cyan-500/20 mb-4">
            <Atom className="w-8 h-8 animate-spin-slow" />
          </div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-white">
            {t('title')}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-2">
            {t('subtitle')}
          </p>
        </div>

        {/* Google Sign In Button */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => signInWithGoogle()}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-100 font-semibold text-xs uppercase tracking-wider shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-98"
          >
            {/* Google SVG Logo */}
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{t('googleButton')}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              loginAsDemoStudent('alumno.ciencias@uni.edu.pe');
              window.location.href = '/es/progreso';
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-cyan-500/30 bg-cyan-950/30 hover:bg-cyan-900/40 text-cyan-300 font-mono text-xs font-semibold transition-all cursor-pointer"
          >
            <span>⚡ Ingreso Directo: Alumno Demo FC-UNI</span>
          </button>

          <p className="text-[11px] text-center text-slate-500 font-mono">
            Válido para cuentas @uni.pe y @gmail.com. En desarrollo local, usa el botón de Alumno Demo.
          </p>
        </div>

        {/* Benefits list */}
        <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-500">
            {t('benefitsTitle')}
          </h3>
          <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 shrink-0 mt-0.5" />
              <span>{t('benefit1')}</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 shrink-0 mt-0.5" />
              <span>{t('benefit2')}</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 shrink-0 mt-0.5" />
              <span>{t('benefit3')}</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 shrink-0 mt-0.5" />
              <span>{t('benefit4')}</span>
            </li>
          </ul>
        </div>

        {/* Continue as guest */}
        <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 text-center">
          <Link
            href="/modulos"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-cyan-500 transition-colors"
          >
            <span>{t('guestMode')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
