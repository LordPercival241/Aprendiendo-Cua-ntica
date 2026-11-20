'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';
import { QuantumMark } from '@/components/brand/QuantumMark';
import { BookOpen, Layers, Award, HandHeart, Landmark, Menu, X } from 'lucide-react';
import { SupportDialog } from './SupportDialog';

export function Navbar() {
  const t = useTranslations('navigation');
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);

  const navLinks = [
    { href: '/modulos', label: t('modules'), icon: Layers },
    { href: '/museo', label: t('museum'), icon: Landmark },
    { href: '/recursos', label: t('resources'), icon: BookOpen },
    { href: '/progreso', label: t('progress'), icon: Award },
  ];

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-700/70 bg-white/95 dark:bg-[#1E293B]/95 backdrop-blur-xl transition-colors">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/25 dark:border-amber-400/25 group-hover:border-amber-500/50 group-hover:bg-amber-500/20 transition-all shadow-sm">
            <QuantumMark className="w-8 h-8" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-[#1E293B] dark:text-[#F1F5F9] font-sans">
              Aprendiendo Cuántica
            </span>
            <span className="text-[10px] font-mono tracking-widest text-[#475569] dark:text-[#94A3B8] uppercase -mt-0.5 hidden sm:inline">
              Mecánica Cuántica • IF411
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold tracking-wide transition-all ${
                  active
                    ? 'bg-[#0284C7] text-[#FFFFFF] dark:bg-[#38BDF8] dark:text-[#0F172A] shadow-xs'
                    : 'text-[#334155] dark:text-[#CBD5E1] hover:text-[#1E293B] dark:hover:text-[#F1F5F9] hover:bg-slate-100 dark:hover:bg-slate-700/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-[#FFFFFF] dark:text-[#0F172A]' : 'text-[#475569] dark:text-[#94A3B8]'}`} />
                {link.label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => setSupportOpen(true)}
            className="ml-1 flex items-center gap-2 rounded-lg border border-transparent px-3 py-2 text-sm font-medium tracking-wide text-[#334155] transition-all hover:border-pink-500/25 hover:bg-pink-50 hover:text-pink-700 dark:text-[#CBD5E1] dark:hover:bg-pink-950/30 dark:hover:text-pink-300 cursor-pointer"
            aria-haspopup="dialog"
            aria-expanded={supportOpen}
          >
            <HandHeart className="h-4 w-4 text-pink-600 dark:text-pink-400" />
            {t('support')}
          </button>
        </nav>

        {/* Right Action Bar */}
        <div className="hidden sm:flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>

        {/* Mobile Hamburger */}
        <div className="flex sm:hidden items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-[#334155] dark:text-[#CBD5E1] hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden px-4 pt-2 pb-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold ${
                  active
                    ? 'bg-[#0284C7] text-[#FFFFFF] dark:bg-[#38BDF8] dark:text-[#0F172A]'
                    : 'text-[#334155] dark:text-[#CBD5E1] hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-[#FFFFFF] dark:text-[#0F172A]' : 'text-sky-500'}`} />
                {link.label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              setSupportOpen(true);
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-[#334155] hover:bg-pink-50 hover:text-pink-700 dark:text-[#CBD5E1] dark:hover:bg-pink-950/40 dark:hover:text-pink-300"
            aria-haspopup="dialog"
          >
            <HandHeart className="h-4 w-4 text-pink-500" />
            {t('support')}
          </button>
        </div>
      )}
      <SupportDialog open={supportOpen} onClose={() => setSupportOpen(false)} />
    </header>
  );
}
