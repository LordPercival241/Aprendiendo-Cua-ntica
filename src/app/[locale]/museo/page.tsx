import { getTranslations, setRequestLocale } from 'next-intl/server';
import { MuseumExperience } from '@/components/museum/MuseumExperience';

export default async function MuseumPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'museum' });

  return (
    <div className="relative mx-auto max-w-[1600px] px-4 py-10 sm:px-6 lg:px-10 lg:py-16">
      <header className="max-w-3xl border-l border-cyan-400/70 pl-5 sm:pl-7">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-400">{t('eyebrow')}</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">{t('title')}</h1>
        <p className="mt-5 text-base leading-7 text-zinc-400 sm:text-lg">{t('subtitle')}</p>
      </header>
      <div className="mt-10"><MuseumExperience locale={locale} /></div>
      <p className="mt-8 max-w-3xl text-sm leading-6 text-zinc-500">{t('provenance')}</p>
    </div>
  );
}
