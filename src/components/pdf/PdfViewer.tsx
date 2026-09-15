'use client';

import React, { useState } from 'react';
import { Download, ExternalLink, Maximize2, Minimize2, FileText, AlertCircle } from 'lucide-react';

interface PdfViewerProps {
  url: string;
  title: string;
  className?: string;
  height?: string;
}

export function PdfViewer({ url, title, className = '', height = 'h-[750px]' }: PdfViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Encode URL properly for spaces and symbols in filenames
  const encodedUrl = encodeURI(url);

  return (
    <div
      className={`relative flex flex-col rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl overflow-hidden transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen w-screen' : height
      } ${className}`}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
            <FileText className="w-4 h-4" />
          </div>
          <span className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate max-w-[220px] sm:max-w-md">
            {title}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <a
            href={encodedUrl}
            download
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors border border-zinc-200 dark:border-zinc-700"
            title="Descargar PDF"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Descargar</span>
          </a>

          <a
            href={encodedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors border border-zinc-200 dark:border-zinc-700"
            title="Abrir en pestaña nueva"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors border border-zinc-200 dark:border-zinc-700 cursor-pointer"
            title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* PDF Viewport */}
      <div className="relative flex-1 w-full h-full bg-zinc-100 dark:bg-zinc-950">
        {!hasError ? (
          <object
            data={`${encodedUrl}#toolbar=1&navpanes=0`}
            type="application/pdf"
            className="w-full h-full"
            onError={() => setHasError(true)}
          >
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <AlertCircle className="w-10 h-10 text-amber-500 mb-3" />
              <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-4">
                El navegador no pudo incrustar directamente este PDF.
              </p>
              <a
                href={encodedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs shadow-lg transition-all"
              >
                Abrir PDF en pestaña nueva
              </a>
            </div>
          </object>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 mb-4">
              Error al cargar el archivo PDF.
            </p>
            <a
              href={encodedUrl}
              download
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-lg transition-all"
            >
              Descargar archivo directamente
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
