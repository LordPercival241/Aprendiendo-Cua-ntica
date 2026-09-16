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
  const [isLoading, setIsLoading] = useState(true);

  // Encode URL properly for spaces and symbols in filenames
  const encodedUrl = encodeURI(url);

  return (
    <div
      className={`relative flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 text-zinc-100 shadow-2xl transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen w-screen' : height
      } ${className}`}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-zinc-800 bg-black px-4 py-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
            <FileText className="w-4 h-4" />
          </div>
          <span className="max-w-[220px] truncate text-xs font-semibold text-zinc-100 sm:max-w-md sm:text-sm">
            {title}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <a
            href={encodedUrl}
            download
            className="flex items-center gap-1 rounded-lg border border-zinc-700 px-2.5 py-1.5 text-xs font-medium text-zinc-200 transition-colors hover:bg-zinc-800"
            title="Descargar PDF"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Descargar</span>
          </a>

          <a
            href={encodedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-zinc-700 p-1.5 text-zinc-200 transition-colors hover:bg-zinc-800"
            title="Abrir en pestaña nueva"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="cursor-pointer rounded-lg border border-zinc-700 p-1.5 text-zinc-200 transition-colors hover:bg-zinc-800"
            title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* PDF Viewport */}
      <div className="relative h-full w-full flex-1 bg-[#07080c]">
        {!hasError ? (
          <>
            {isLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#07080c]">
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <span className="h-4 w-4 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
                  Cargando diapositivas…
                </div>
              </div>
            )}
            <iframe
              src={`${encodedUrl}#toolbar=1&navpanes=0`}
              title={title}
              className="h-full w-full border-0 bg-[#07080c]"
              referrerPolicy="same-origin"
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setHasError(true);
              }}
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
            <p className="mb-4 text-sm font-medium text-zinc-200">
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
