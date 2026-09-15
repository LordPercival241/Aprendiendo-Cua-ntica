import React from 'react';

interface QuantumMarkProps {
  className?: string;
  title?: string;
}

/** Vector mark with animated orbital electrons. It inherits its colour from its container. */
export function QuantumMark({ className = '', title }: QuantumMarkProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      className={`quantum-mark ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {title && <title>{title}</title>}
      <circle cx="32" cy="32" r="7" className="fill-cyan-500 dark:fill-cyan-300" opacity="0.16" />
      <circle cx="32" cy="32" r="3.25" className="fill-cyan-600 dark:fill-cyan-300" />

      <g transform="rotate(-25 32 32)">
        <g className="quantum-mark-orbit quantum-mark-orbit-a">
          <ellipse cx="32" cy="32" rx="23" ry="9" stroke="currentColor" strokeWidth="1.7" opacity="0.9" />
          <circle cx="55" cy="32" r="3.25" className="fill-cyan-500 dark:fill-cyan-300" />
        </g>
      </g>
      <g transform="rotate(38 32 32)">
        <g className="quantum-mark-orbit quantum-mark-orbit-b">
          <ellipse cx="32" cy="32" rx="23" ry="9" stroke="currentColor" strokeWidth="1.7" opacity="0.72" />
          <circle cx="9" cy="32" r="3" className="fill-indigo-500 dark:fill-indigo-300" />
        </g>
      </g>
      <g transform="rotate(88 32 32)">
        <g className="quantum-mark-orbit quantum-mark-orbit-c">
          <ellipse cx="32" cy="32" rx="23" ry="9" stroke="currentColor" strokeWidth="1.5" opacity="0.58" />
          <circle cx="54" cy="32" r="2.75" className="fill-sky-500 dark:fill-sky-300" />
        </g>
      </g>
    </svg>
  );
}
