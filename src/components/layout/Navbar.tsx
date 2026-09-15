'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { useSupabase } from '@/components/providers/SupabaseProvider';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';
import { BookOpen, Layers, Award, Menu, X, LogIn, LogOut, UserCircle } from 'lucide-react';
import Image from 'next/image';

export function Navbar() {
  const t = useTranslations('navigation');
  const pathname = usePathname();
  const { user, signOut, isLoading } = useSupabase();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/modulos', label: t('modules'), icon: Layers },
    { href: '/recursos', label: t('resources'), icon: BookOpen },
    { href: '/progreso', label: t('progress'), icon: Award },
  ];

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800/60 bg-white/95 dark:bg-black/95 backdrop-blur-xl transition-colors">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 group-hover:border-cyan-500/50 transition-all overflow-hidden p-1">
            <Image
              src="/logo.png"
              alt="Aprendiendo Cuántica"
              width={32}
              height={32}
              className="dark:invert opacity-80 group-hover:opacity-100 transition-opacity"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-zinc-900 dark:text-white font-sans">
              Aprendiendo Cuántica
            </span>
            <span className="text-[10px] font-mono tracking-widest text-zinc-500 dark:text-zinc-500 uppercase -mt-0.5 hidden sm:inline">
              Mecánica Cuántica • IF411
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium tracking-wide transition-all ${
                  active
                    ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-500/20'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-cyan-500' : 'text-zinc-400'}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Bar */}
        <div className="hidden sm:flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />

          {/* User Auth state */}
          {!isLoading && (
            user ? (
              <div className="flex items-center gap-2 ml-2 pl-2 border-l border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-800 dark:text-zinc-200">
                  <UserCircle className="w-4 h-4 text-cyan-500" />
                  <span className="truncate max-w-[120px]">{user.email?.split('@')[0]}</span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="p-2 rounded-lg text-zinc-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                  title={t('signOut')}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-zinc-900 dark:bg-zinc-800 hover:bg-zinc-800 dark:hover:bg-zinc-700 border border-zinc-700 shadow-sm active:scale-[0.98] transition-all cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-cyan-400" />
                <span>{t('signIn')}</span>
              </Link>
            )
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="flex sm:hidden items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden px-4 pt-2 pb-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  active
                    ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/50'
                    : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                }`}
              >
                <Icon className="w-4 h-4 text-cyan-500" />
                {link.label}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800">
            {user ? (
              <div className="flex items-center justify-between py-1">
                <span className="text-sm text-zinc-500 truncate max-w-[200px]">{user.email}</span>
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-1 text-sm text-red-500 font-medium px-2 py-1 rounded-md hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  {t('signOut')}
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-white bg-zinc-900 dark:bg-zinc-800 border border-zinc-700"
              >
                <LogIn className="w-4 h-4 text-cyan-400" />
                {t('signIn')}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
