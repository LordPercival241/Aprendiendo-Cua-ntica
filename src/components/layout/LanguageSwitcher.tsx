'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const nextLocale = locale === 'es' ? 'en' : 'es';
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      aria-label="Switch Language"
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:border-cyan-500/40 text-slate-700 dark:text-slate-300 transition-colors shadow-xs cursor-pointer"
    >
      <Globe className="w-3.5 h-3.5 text-cyan-500" />
      <span className="tracking-wider">
        <span className={locale === 'es' ? 'text-cyan-500 font-bold' : 'text-slate-400'}>ES</span>
        <span className="text-slate-500 mx-1">/</span>
        <span className={locale === 'en' ? 'text-cyan-500 font-bold' : 'text-slate-400'}>EN</span>
      </span>
    </button>
  );
}
