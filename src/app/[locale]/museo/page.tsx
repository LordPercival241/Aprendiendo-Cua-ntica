import { setRequestLocale } from 'next-intl/server';
import { MuseumExperience } from '@/components/museum/MuseumExperience';

export default async function MuseumPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="relative mx-auto max-w-[1600px] px-4 py-10 sm:px-6 lg:px-10 lg:py-16">
      <header className="max-w-3xl border-l border-cyan-400/70 pl-5 sm:pl-7">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-400">Museo cuántico · experiencias originales</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">Descubrimientos que cambiaron la realidad.</h1>
        <p className="mt-5 text-base leading-7 text-zinc-400 sm:text-lg">Una galería generativa para contemplar los hitos de la mecánica cuántica antes de estudiarlos formalmente. Cada obra deriva de un modelo físico y conduce a su teoría y laboratorio.</p>
      </header>
      <div className="mt-10"><MuseumExperience /></div>
      <p className="mt-8 max-w-3xl text-sm leading-6 text-zinc-500">Las visualizaciones son composiciones originales generadas en el navegador. No representan trayectorias clásicas de electrones ni sustituyen las simulaciones cuantitativas del curso.</p>
    </div>
  );
}
