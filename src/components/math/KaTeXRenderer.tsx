'use client';

import React, { useMemo } from 'react';
import katex from 'katex';

interface KaTeXRendererProps {
  math: string;
  block?: boolean;
  className?: string;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;',
  })[character] ?? character);
}

export function KaTeXRenderer({ math, block = false, className = '' }: KaTeXRendererProps) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: block,
        throwOnError: false,
        strict: false,
        // Course content is rendered as mathematics only.  Do not enable
        // KaTeX commands that can inject arbitrary HTML or external links.
        trust: false,
      });
    } catch (err) {
      console.error('KaTeX rendering error:', err);
      return `<span class="text-red-500 font-mono text-xs">${escapeHtml(math)}</span>`;
    }
  }, [math, block]);

  const sharedProps = {
    // Spacing belongs to the surrounding component. A vertical margin here
    // escapes horizontal-scrolling viewports and can be clipped at their
    // border (notably in the museum profile panel).
    className: `${block ? 'math-display select-text' : 'math-inline select-text'} ${className}`,
    dangerouslySetInnerHTML: { __html: html },
  };

  // Block equations need their own block formatting context.  Rendering a
  // .katex-display inside an inline span can create an undersized line box in
  // some browsers, clipping superscripts and fraction numerators.
  if (block) {
    return <div {...sharedProps} />;
  }

  return <span {...sharedProps} />;
}

export function EquationBlock({
  math,
  title,
  label,
  className = ''
}: {
  math: string;
  title?: string;
  label?: string;
  className?: string;
}) {
  return (
    <div className={`relative my-6 rounded-2xl border border-cyan-500/20 bg-linear-to-r from-cyan-950/20 via-zinc-900/40 to-indigo-950/20 p-6 shadow-inner backdrop-blur-xs ${className}`}>
      {title && (
        <div className="mb-3 text-sm font-semibold uppercase tracking-wider text-cyan-400/90">
          {title}
        </div>
      )}
      <div className="overflow-x-auto py-2">
        <KaTeXRenderer math={math} block className="text-xl sm:text-2xl text-cyan-100" />
      </div>
      {label && (
        <div className="mt-2 text-right text-xs font-mono text-zinc-500 dark:text-zinc-400">
          ({label})
        </div>
      )}
    </div>
  );
}
