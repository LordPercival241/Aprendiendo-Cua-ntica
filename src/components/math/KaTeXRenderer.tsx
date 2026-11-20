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
    <div className={`relative my-6 rounded-2xl border border-slate-300 dark:border-slate-700/80 bg-[#E2E8F0] dark:bg-[#131C31] text-[#1E293B] dark:text-[#F1F5F9] p-6 shadow-sm ${className}`}>
      {title && (
        <div className="mb-3 text-sm font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
          {title}
        </div>
      )}
      <div className="overflow-x-auto py-2">
        <KaTeXRenderer math={math} block className="text-xl sm:text-2xl text-[#1E293B] dark:text-[#F1F5F9]" />
      </div>
      {label && (
        <div className="mt-2 text-right text-xs font-mono text-[#475569] dark:text-[#94A3B8]">
          ({label})
        </div>
      )}
    </div>
  );
}
