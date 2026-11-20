import { getTranslations, setRequestLocale } from 'next-intl/server';
import { MuseumExperience } from '@/components/museum/MuseumExperience';

export default async function MuseumPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'museum' });

  return (
    <div className="museum-page relative mx-auto max-w-[1600px] px-4 py-10 sm:px-6 lg:flex lg:h-[calc(100dvh-4rem)] lg:flex-col lg:overflow-hidden lg:px-10 lg:py-4">
      <header className="max-w-3xl border-l-2 border-sky-500 pl-5 sm:pl-7 lg:flex lg:max-w-none lg:shrink-0 lg:items-center lg:gap-4 lg:pl-4">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-sky-600 dark:text-sky-400">{t('eyebrow')}</p>
        <h1 className="mt-4 text-4xl font-bold tracking-[-0.04em] text-[#1E293B] dark:text-[#F1F5F9] sm:text-5xl lg:mt-0 lg:text-2xl">{t('title')}</h1>
        <p className="mt-5 text-base leading-7 text-[#334155] dark:text-[#CBD5E1] sm:text-lg lg:hidden">{t('subtitle')}</p>
      </header>
      <div className="mt-10 lg:mt-4 lg:min-h-0 lg:flex-1"><MuseumExperience locale={locale} /></div>
      <p className="mt-8 max-w-3xl text-sm leading-6 text-[#475569] dark:text-[#94A3B8] lg:hidden">{t('provenance')}</p>
    </div>
  );
}
