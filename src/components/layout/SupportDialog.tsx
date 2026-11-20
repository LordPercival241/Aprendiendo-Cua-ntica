'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { HandHeart, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface SupportDialogProps {
  open: boolean;
  onClose: () => void;
}

export function SupportDialog({ open, onClose }: SupportDialogProps) {
  const t = useTranslations('support');
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      window.cancelAnimationFrame(focusFrame);
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm sm:items-center"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="support-dialog-title"
        aria-describedby="support-dialog-description"
        className="relative my-auto flex w-full max-w-md max-h-[calc(100dvh-2rem)] flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1E293B] text-[#1E293B] dark:text-[#F1F5F9] shadow-2xl"
      >
        <div className="shrink-0 border-b border-slate-200 dark:border-slate-700 px-6 pb-5 pt-6 sm:px-7">
          <button
            type="button"
            onClick={onClose}
            ref={closeButtonRef}
            className="absolute right-4 top-4 rounded-lg p-2 text-[#475569] dark:text-[#94A3B8] transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#1E293B] dark:hover:text-white"
            aria-label={t('close')}
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2 text-pink-500 dark:text-pink-400">
            <HandHeart className="h-5 w-5" aria-hidden="true" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em]">{t('eyebrow')}</span>
          </div>
          <h2 id="support-dialog-title" className="mt-3 pr-8 text-xl font-bold tracking-tight text-[#1E293B] dark:text-[#F1F5F9]">
            {t('title')}
          </h2>
          <p id="support-dialog-description" className="mt-2 text-sm leading-6 text-[#334155] dark:text-[#CBD5E1]">{t('description')}</p>
        </div>

        <div className="space-y-4 overflow-y-auto px-6 py-5 sm:px-7">
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0F172A] p-4 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#475569] dark:text-[#94A3B8]">{t('scanTitle')}</p>
            <div className="mx-auto w-full max-w-[210px] rounded-lg bg-white p-2 shadow-inner sm:max-w-[250px]">
              <Image
                src="/support/yape-qr.png"
                alt={t('qrAlt')}
                width={1024}
                height={1024}
                className="h-auto w-full"
                priority
              />
            </div>
            <p className="mt-3 text-xs leading-5 text-[#475569] dark:text-[#94A3B8]">{t('scanDescription')}</p>
          </div>

          <p className="border-l-2 border-pink-500/70 pl-3 text-xs leading-5 text-[#475569] dark:text-[#94A3B8]">{t('impact')}</p>
          <p className="text-center text-[11px] text-[#475569] dark:text-[#94A3B8]">{t('voluntary')}</p>
        </div>

        <div className="shrink-0 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0F172A] px-6 py-4 text-center sm:px-7">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-semibold bg-slate-200 dark:bg-slate-800 text-[#1E293B] dark:text-[#F1F5F9] transition-colors hover:bg-slate-300 dark:hover:bg-slate-700"
          >
            {t('close')}
          </button>
        </div>
      </section>
    </div>,
    document.body,
  );
}
