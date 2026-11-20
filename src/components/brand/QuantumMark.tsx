import React from 'react';
import Image from 'next/image';

interface QuantumMarkProps {
  className?: string;
  title?: string;
}

/**
 * Brand logo representing Aprendiendo Cuántica:
 * The geometric origami hummingbird in golden amber tones.
 */
export function QuantumMark({ className = 'w-8 h-8', title = 'Aprendiendo Cuántica' }: QuantumMarkProps) {
  return (
    <span
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      role={title ? 'img' : undefined}
      aria-label={title}
      title={title}
    >
      <Image
        src="/logo.png"
        alt={title}
        width={64}
        height={64}
        priority
        className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(251,169,29,0.35)] select-none transition-transform group-hover:scale-105 duration-200"
      />
    </span>
  );
}
