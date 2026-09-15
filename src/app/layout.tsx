import type { Metadata } from 'next';
import './globals.css';
import 'katex/dist/katex.min.css';

export const metadata: Metadata = {
  title: 'Aprendiendo Cuántica — Mecánica Cuántica IF411',
  description: 'Plataforma educativa con rigor matemático y analítico para el curso IF411 de Mecánica Cuántica. Teoría exhaustiva con citas académicas, desglose de fórmulas, simulaciones interactivas y metodología activa POE.',
  metadataBase: new URL('https://quantum-uni.vercel.app'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] antialiased">
        {children}
      </body>
    </html>
  );
}
