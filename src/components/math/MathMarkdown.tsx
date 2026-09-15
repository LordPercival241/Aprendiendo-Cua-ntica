'use client';

import React from 'react';
import { KaTeXRenderer } from './KaTeXRenderer';

interface MathMarkdownProps {
  content: string;
  className?: string;
  inline?: boolean;
}

export function MathMarkdown({ content, className = '', inline = false }: MathMarkdownProps) {
  if (!content) return null;

  // If inline mode requested, parse only inline text with possible $...$
  if (inline) {
    return <span className={className}>{renderInlineText(content)}</span>;
  }

  // Full block-level parsing for markdown content
  // First, split by block math $$...$$
  const blocks = content.split(/(\$\$[\s\S]*?\$\$)/g);

  return (
    <div className={`space-y-6 text-zinc-700 dark:text-zinc-200 ${className}`}>
      {blocks.map((block, idx) => {
        if (!block.trim()) return null;

        // If it is block math $$...$$
        if (block.startsWith('$$') && block.endsWith('$$')) {
          const math = block.slice(2, -2).trim();
          return (
            <div key={idx} className="my-8 overflow-x-auto border-y border-zinc-200 py-5 text-center dark:border-zinc-800">
              <KaTeXRenderer math={math} block className="text-zinc-900 dark:text-cyan-100" />
            </div>
          );
        }

        // Otherwise, process markdown text lines
        const lines = block.split('\n');
        const elements: React.ReactNode[] = [];
        let currentList: { type: 'ul' | 'ol'; items: React.ReactNode[] } | null = null;
        let quoteLines: string[] = [];

        const flushQuote = (key: string) => {
          if (quoteLines.length > 0) {
            elements.push(
              <div
                key={key}
                className="my-5 border-l-2 border-cyan-500 pl-5 py-1 text-base italic font-serif leading-8 text-zinc-700 dark:text-zinc-300"
              >
                {quoteLines.map((ql, qIdx) => (
                  <div key={qIdx}>{renderInlineText(ql)}</div>
                ))}
              </div>
            );
            quoteLines = [];
          }
        };

        const flushList = (key: string) => {
          if (currentList) {
            if (currentList.type === 'ul') {
              elements.push(
                <ul key={key} className="my-4 space-y-2.5 list-disc pl-5 text-base leading-7 text-zinc-700 dark:text-zinc-300">
                  {currentList.items.map((it, i) => (
                    <li key={i}>{it}</li>
                  ))}
                </ul>
              );
            } else {
              elements.push(
                <ol key={key} className="my-4 space-y-2.5 list-decimal pl-5 text-base leading-7 text-zinc-700 dark:text-zinc-300">
                  {currentList.items.map((it, i) => (
                    <li key={i}>{it}</li>
                  ))}
                </ol>
              );
            }
            currentList = null;
          }
        };

        lines.forEach((line, lIdx) => {
          const trimmed = line.trim();
          const lineKey = `${idx}-${lIdx}`;

          // Blockquote line
          if (trimmed.startsWith('>')) {
            flushList(`list-${lineKey}`);
            quoteLines.push(trimmed.replace(/^>\s*/, ''));
            return;
          } else {
            flushQuote(`quote-${lineKey}`);
          }

          // Unordered list
          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            if (!currentList || currentList.type !== 'ul') {
              flushList(`list-${lineKey}`);
              currentList = { type: 'ul', items: [] };
            }
            currentList.items.push(renderInlineText(trimmed.slice(2)));
            return;
          }

          // Numbered list
          const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
          if (numMatch) {
            if (!currentList || currentList.type !== 'ol') {
              flushList(`list-${lineKey}`);
              currentList = { type: 'ol', items: [] };
            }
            currentList.items.push(renderInlineText(numMatch[2]));
            return;
          }

          // If not a list item, flush current list
          flushList(`list-${lineKey}`);

          // Headings
          if (trimmed.startsWith('### ')) {
            elements.push(
              <h3 key={lineKey} className="mt-9 mb-3 text-xl font-semibold tracking-tight text-zinc-950 dark:text-white">
                {renderInlineText(trimmed.slice(4))}
              </h3>
            );
            return;
          }
          if (trimmed.startsWith('#### ')) {
            elements.push(
              <h4 key={lineKey} className="mt-7 mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-700 dark:text-cyan-300">
                {renderInlineText(trimmed.slice(5))}
              </h4>
            );
            return;
          }

          // Normal paragraph line
          if (trimmed.length > 0) {
            elements.push(
              <p key={lineKey} className="max-w-[78ch] text-[1rem] sm:text-[1.06rem] leading-8 text-zinc-700 dark:text-zinc-200 tracking-[-0.006em]">
                {renderInlineText(trimmed)}
              </p>
            );
          }
        });

        flushQuote(`quote-end-${idx}`);
        flushList(`list-end-${idx}`);

        return <div key={idx} className="space-y-2">{elements}</div>;
      })}
    </div>
  );
}

/**
 * Parses inline text containing:
 * - $math$ inline LaTeX
 * - **bold**
 * - *italic*
 */
function renderInlineText(text: string): React.ReactNode[] {
  if (!text) return [];

  // Split by inline math $...$ (ignoring escaped \$)
  const parts = text.split(/(\$[^\$]+?\$)/g);

  return parts.map((part, index) => {
    // If it is inline math $...$
    if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
      const math = part.slice(1, -1);
      return <KaTeXRenderer key={index} math={math} block={false} />;
    }

    // Process bold **...** and italic *...*
    const boldParts = part.split(/(\*\*.*?\*\*)/g);
    return (
      <React.Fragment key={index}>
        {boldParts.map((bPart, bIdx) => {
          if (bPart.startsWith('**') && bPart.endsWith('**') && bPart.length > 4) {
            return (
              <strong key={bIdx} className="font-semibold text-slate-100">
                {renderPlainTextWithMathFallback(bPart.slice(2, -2))}
              </strong>
            );
          }
          return (
            <React.Fragment key={bIdx}>
              {renderPlainTextWithMathFallback(bPart)}
            </React.Fragment>
          );
        })}
      </React.Fragment>
    );
  });
}

/**
 * Fallback parser for text that contains LaTeX commands (e.g. \frac{...}, \nu, \lambda_c)
 * that were not enclosed in $...$ delimiters.
 */
function renderPlainTextWithMathFallback(text: string): React.ReactNode {
  if (!text) return null;
  // If no backslash, return simple text
  if (!text.includes('\\')) return text;

  // Split on LaTeX commands like \frac{...}{...}, \sqrt{...}, \lambda_c, \vec{S}, etc.
  const regex = /(\\(?:frac\{[^{}]+\}\{[^{}]+\}|sqrt\{[^{}]+\}|[a-zA-Z]+)(?:_[a-zA-Z0-9{}]+|\^[a-zA-Z0-9{}]+|\{[^{}]*\})*)/g;
  const segments = text.split(regex);

  if (segments.length === 1) return text;

  return (
    <>
      {segments.map((seg, sIdx) => {
        if (seg && seg.startsWith('\\')) {
          return <KaTeXRenderer key={sIdx} math={seg} block={false} />;
        }
        return seg;
      })}
    </>
  );
}
