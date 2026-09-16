'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { PdfViewer } from '@/components/pdf/PdfViewer';
import {
  Download,
  Eye,
  FolderOpen,
  Search
} from 'lucide-react';

interface ResourceItem {
  id: string;
  title: string;
  category: 'lectures' | 'books' | 'syllabus';
  week?: string;
  author?: string;
  path: string;
  size?: string;
  description: string;
}

const RESOURCES_DATA: ResourceItem[] = [
  // Syllabus
  {
    id: 'syl-01',
    title: 'Sílabo Oficial IF411 Mecánica Cuántica',
    category: 'syllabus',
    author: 'Facultad de Ciencias — UNI',
    path: '/syllabus/IF411 MECANICA CUANTICA.pdf',
    description: 'Programa analítico, objetivos, competencias, sistema de evaluación y bibliografía del curso.',
  },

  // Lectures
  {
    id: 'lec-01-1',
    title: 'Semana 1: Introducción a la Mecánica Cuántica',
    category: 'lectures',
    week: 'Semana 1',
    path: '/lectures/sem1/INTRODUCCION.pdf',
    description: 'Fracaso de la física clásica, radiación de cuerpo negro, ley de Stefan-Boltzmann y distribución de Planck.',
  },
  {
    id: 'lec-01-2',
    title: 'Semana 1: Efecto Fotoeléctrico y Compton',
    category: 'lectures',
    week: 'Semana 1',
    path: '/lectures/sem1/Efecto fotoeléctrico - Compton.pdf',
    description: 'Hipótesis del cuanto de luz de Einstein, función de trabajo y ecuación fotoeléctrica.',
  },
  {
    id: 'lec-02-1',
    title: 'Semana 2: Efecto Compton (Continuación)',
    category: 'lectures',
    week: 'Semana 2',
    path: '/lectures/sem2/Efecto fotoeléctrico - Compton continuación.pdf',
    description: 'Conservación de cuadrimomento relativista y corrimiento de longitud de onda Compton.',
  },
  {
    id: 'lec-02-2',
    title: 'Semana 2: Principio de Louis De Broglie',
    category: 'lectures',
    week: 'Semana 2',
    path: '/lectures/sem2/Principio de Louis DeBroglie -  Principio de incertidumbre -.pdf',
    description: 'Ondas de materia, difracción de electrones y relaciones de incertidumbre de Heisenberg.',
  },
  {
    id: 'lec-02-3',
    title: 'Semana 2: Átomo de Hidrógeno (Modelo de Bohr)',
    category: 'lectures',
    week: 'Semana 2',
    path: '/lectures/sem2/Atomo de hidrogeno.pdf',
    description: 'Postulados de Bohr, cuantización de momento angular y radios orbitales.',
  },
  {
    id: 'lec-03',
    title: 'Semana 3: Ecuación de Schrödinger',
    category: 'lectures',
    week: 'Semana 3',
    path: '/lectures/sem3/MECANICA_CUANTICA_SEM_4 lu (1).pdf',
    description: 'Ecuación temporal, interpretación de Born, ecuación de continuidad y densidad de probabilidad.',
  },
  {
    id: 'lec-04',
    title: 'Semana 4: Repaso y Aplicaciones de Schrödinger',
    category: 'lectures',
    week: 'Semana 4',
    path: '/lectures/sem4/MECANICA_CUANTICA_SEM_4 (repitio clase por el paro hizo repaso).pdf',
    description: 'Ejercicios de aplicación y estados estacionarios independientes del tiempo.',
  },
  {
    id: 'lec-05-1',
    title: 'Semana 5: Operadores Cuánticos y Teorema de Ehrenfest',
    category: 'lectures',
    week: 'Semana 5',
    path: '/lectures/sem5/Teorema de Ehrenfest (1).pdf',
    description: 'Evolución temporal del valor esperado y conexión con la mecánica clásica de Newton.',
  },
  {
    id: 'lec-05-2',
    title: 'Semana 5: Formalismo y Paquetes de Onda',
    category: 'lectures',
    week: 'Semana 5',
    path: '/lectures/sem5/MECANICA_CUANTICA_SEM_6-12-18.pdf',
    description: 'Superposición continua y dispersión de paquetes de onda gaussianos.',
  },
  {
    id: 'lec-06',
    title: 'Semana 6: Representación en el Espacio de Momentum',
    category: 'lectures',
    week: 'Semana 6',
    path: '/lectures/sem6/Representación Momentum.pdf',
    description: 'Transformada de Fourier entre espacio de coordenadas y espacio de momentos p.',
  },
  {
    id: 'lec-07-1',
    title: 'Semana 7: Partícula Libre',
    category: 'lectures',
    week: 'Semana 7',
    path: '/lectures/sem7/MECANICA_CUANTICA_SEM_6 continuación partícula libre.pdf',
    description: 'Soluciones continuas y condiciones de contorno para estados no ligados.',
  },
  {
    id: 'lec-07-2',
    title: 'Semana 7: Potenciales Seccionalmente Constantes',
    category: 'lectures',
    week: 'Semana 7',
    path: '/lectures/sem7/potenciales seccionalmente constantes + (1).pdf',
    description: 'Pozo rectangular infinito, pozo finito, tunelamiento cuántico a través de barreras.',
  },
  {
    id: 'lec-09-1',
    title: 'Semana 9: Formalismo de Dirac (Bra-Ket)',
    category: 'lectures',
    week: 'Semana 9',
    path: '/lectures/sem9/DIRAC (1).pdf',
    description: 'Espacio de Hilbert, proyectores, bases ortonormales y representación matricial de operadores.',
  },
  {
    id: 'lec-09-2',
    title: 'Semana 9: Oscilador Armónico (Parte 1)',
    category: 'lectures',
    week: 'Semana 9',
    path: '/lectures/sem9/oscilador_armonico_rpdocx_parte1.pdf',
    description: 'Ecuación diferencial y solución analítica en términos de polinomios de Hermite.',
  },
  {
    id: 'lec-10',
    title: 'Semana 10: Oscilador Armónico (Versión Algebraica)',
    category: 'lectures',
    week: 'Semana 10',
    path: '/lectures/sem10/EL_OSCILADOR_ARMONICO_VESION_ALGEBRAICA correg (1).pdf',
    description: 'Operadores escalera a y a-dagger, estado fundamental y álgebra de conmutación.',
  },
  {
    id: 'lec-11-1',
    title: 'Semana 11: Problema de Dos Cuerpos',
    category: 'lectures',
    week: 'Semana 11',
    path: '/lectures/sem11/problemas_de_los_dos_cuerposff-1.pdf',
    description: 'Reducción al centro de masa y potencial central efectivo.',
  },
  {
    id: 'lec-11-2',
    title: 'Semana 11: Exposición de Cuántica (Átomo de Hidrógeno)',
    category: 'lectures',
    week: 'Semana 11',
    path: '/lectures/sem11/Exposición_de_Cuántica.pdf',
    description: 'Tratamiento cuántico tridimensional del electrón en potencial coulombiano.',
  },
  {
    id: 'lec-12',
    title: 'Semana 12: Momento Magnético Orbital y Espín',
    category: 'lectures',
    week: 'Semana 12',
    path: '/lectures/sem12/Momento magnético orbital (1).pdf',
    description: 'Interacción con campo magnético externo B y factor giromagnético.',
  },
  {
    id: 'lec-13-1',
    title: 'Semana 13: Operador de Momento Angular',
    category: 'lectures',
    week: 'Semana 13',
    path: '/lectures/sem14/Tema-momento-angular.pdf',
    description: 'Álgebra de Lie de momento angular, operadores escalonados J+ y J-.',
  },
  {
    id: 'lec-13-2',
    title: 'Semana 13: Frecuencia de Precesión de Larmor',
    category: 'lectures',
    week: 'Semana 13',
    path: '/lectures/sem14/Frecuencia de precesion.pdf',
    description: 'Dinámica de precesión de espín en campos magnéticos estáticos y oscilantes.',
  },
  {
    id: 'lec-14-1',
    title: 'Semana 14: Teoría de Perturbaciones (No Degenerado)',
    category: 'lectures',
    week: 'Semana 14',
    path: '/lectures/sem13/Teoría de las perturbaciones_caso_no_degenerado-1-4 (1).pdf',
    description: 'Corrección de energías a primer y segundo orden y corrección de funciones de onda.',
  },
  {
    id: 'lec-14-2',
    title: 'Semana 14: Teoría de Perturbaciones (Caso Degenerado)',
    category: 'lectures',
    week: 'Semana 14',
    path: '/lectures/sem13/Teoría de las perturbaciones_caso_degenerado-5-7 (1).pdf',
    description: 'Diagonalización en subespacios degenerados, ruptura de degeneración y efecto Stark.',
  },
  {
    id: 'lec-15',
    title: 'Semana 15: Composición de Momentos Angulares',
    category: 'lectures',
    week: 'Semana 15',
    path: '/lectures/sem15/Composición de momentums angulares f.pdf',
    description: 'Suma de J1 + J2, base desacoplada y coeficientes de Clebsch-Gordan.',
  },

  // Books
  {
    id: 'book-01',
    title: 'Quantum Mechanics (Vol. I & II)',
    category: 'books',
    author: 'Claude Cohen-Tannoudji, Bernard Diu, Franck Laloë',
    path: '/books/L-0014096705-pdf.pdf',
    size: '49.9 MB',
    description: 'La referencia fundamental y más rigurosa de mecánica cuántica a nivel universitario.',
  },
  {
    id: 'book-02',
    title: 'Quantum Mechanics (3rd Edition)',
    category: 'books',
    author: 'Eugen Merzbacher',
    path: '/books/Merzbacher-Quantum-Mechanics.pdf',
    size: '34.5 MB',
    description: 'Texto avanzado clásico con excelente cobertura de paquetes de onda, teoría de dispersión y formalismo matemático.',
  },
  {
    id: 'book-03',
    title: 'The Feynman Lectures on Physics — Vol. III (Quantum Mechanics)',
    category: 'books',
    author: 'Richard P. Feynman, Robert B. Leighton, Matthew Sands',
    path: '/books/feynman-lectures.pdf',
    size: '63.8 MB',
    description: 'Enfoque magistral e intuitivo basado en amplitudes de probabilidad y experimentos de Stern-Gerlach.',
  },
  {
    id: 'book-04',
    title: 'Quantum Physics of Atoms, Molecules, Solids, Nuclei, and Particles (Solutions)',
    category: 'books',
    author: 'Robert Eisberg, Robert Resnick',
    path: '/books/eisberg-r-resnick-r-quantum-physics-atoms-molecules-solids-nuclei-and-particles-solutions-supplement-accompany-2ed-wiley_compress.pdf',
    size: '11.6 MB',
    description: 'Suplemento completo de soluciones a los problemas del clásico libro de Eisberg-Resnick.',
  },
  {
    id: 'book-05',
    title: 'Fundamentos de Mecánica Cuántica',
    category: 'books',
    author: 'Pedro Fernández de Córdova',
    path: '/books/fundamentos de mecánica cuántica.pdf',
    size: '4.0 MB',
    description: 'Manual conciso en español con explicaciones pedagógicas de los principios y postulados.',
  },
  {
    id: 'book-06',
    title: 'Quantum Mechanics Script & Exercises',
    category: 'books',
    author: 'Greiner & Walter',
    path: '/books/QuantumMechanicsScript.pdf',
    size: '57.8 MB',
    description: 'Notas detalladas de cátedra y problemas resueltos de mecánica cuántica básica y avanzada.',
  },
];

export default function ResourcesPage() {
  const t = useTranslations('resources');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'lectures' | 'books' | 'syllabus'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePdf, setActivePdf] = useState<ResourceItem | null>(RESOURCES_DATA[0]);

  const filteredResources = RESOURCES_DATA.filter((r) => {
    const matchesCat = selectedCategory === 'all' || r.category === selectedCategory;
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.author && r.author.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleViewPdf = (res: ResourceItem) => {
    setActivePdf(res);
    const el = document.getElementById('pdf-viewer-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold bg-slate-900 text-cyan-400 border border-slate-800 mb-3">
          <FolderOpen className="w-3.5 h-3.5" />
          <span>Biblioteca Digital • Facultad de Ciencias UNI</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {t('title')}
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
          {t('subtitle')}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          {[
            { id: 'all', label: t('tabAll') },
            { id: 'lectures', label: t('tabLectures') },
            { id: 'books', label: t('tabBooks') },
            { id: 'syllabus', label: t('tabSyllabus') },
          ].map((tab) => (
            <button
              key={tab.id}
            onClick={() => setSelectedCategory(tab.id as 'all' | 'lectures' | 'books' | 'syllabus')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === tab.id
                  ? 'bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por tema o autor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-hidden focus:ring-2 focus:ring-cyan-500/50 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Active PDF Viewer */}
      {activePdf && (
        <div id="pdf-viewer-section" className="mb-12 scroll-mt-20">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-cyan-500" />
              <span>Documento Activo: {activePdf.title}</span>
            </h2>
            <span className="text-xs font-mono text-slate-500">
              {activePdf.author || activePdf.week || 'IF411'}
            </span>
          </div>
          <PdfViewer url={activePdf.path} title={activePdf.title} height="h-[650px] sm:h-[750px]" />
        </div>
      )}

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map((res) => {
          const isSelected = activePdf?.id === res.id;
          const isBook = res.category === 'books';

          return (
            <div
              key={res.id}
              className={`flex flex-col justify-between p-5 rounded-2xl border transition-all ${
                isSelected
                  ? 'border-cyan-500 bg-cyan-50 dark:bg-black ring-1 ring-cyan-500/40'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-black hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      isBook
                        ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                    }`}
                  >
                    {res.category === 'books' ? 'Libro de Texto' : res.category === 'syllabus' ? 'Sílabo' : 'Diapositivas'}
                  </span>
                  {res.size && (
                    <span className="text-[10px] font-mono text-slate-500">
                      {res.size}
                    </span>
                  )}
                  {res.week && (
                    <span className="text-[10px] font-mono text-slate-400">
                      {res.week}
                    </span>
                  )}
                </div>

                <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 leading-snug line-clamp-2">
                  {res.title}
                </h3>
                {res.author && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {res.author}
                  </p>
                )}
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {res.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleViewPdf(res)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-cyan-500 hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{isSelected ? 'Mostrando' : t('view')}</span>
                </button>

                <a
                  href={encodeURI(res.path)}
                  download
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Descargar PDF"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t('download')}</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
