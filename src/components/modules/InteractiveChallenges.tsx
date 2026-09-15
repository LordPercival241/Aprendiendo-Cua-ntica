'use client';

import React, { useState } from 'react';
import { KaTeXRenderer } from '@/components/math/KaTeXRenderer';
import { MathMarkdown } from '@/components/math/MathMarkdown';
import { CheckCircle2, XCircle, Award, Sparkles, HelpCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { getModuleLearningProgress, saveModuleLearningProgress } from '@/lib/learningProgress';

interface ChallengeQuestion {
  level: 1 | 2 | 3;
  levelBadge: string;
  points: number;
  title: string;
  questionMarkdown: string;
  options: {
    id: string;
    textMarkdown: string;
    isCorrect: boolean;
  }[];
  explanationMarkdown: string;
}

const MODULE_CHALLENGES: Record<string, ChallengeQuestion[]> = {
  '01-introduccion-fisica-moderna': [
    {
      level: 1,
      levelBadge: 'Nivel I • Conceptual',
      points: 10,
      title: 'Origen de la Catástrofe Ultravioleta',
      questionMarkdown: '¿Cuál fue la suposición clásica fundamental del Teorema de Equipartición de la Energía que condujo a la divergencia en altas frecuencias en la ley de Rayleigh-Jeans?',
      options: [
        { id: 'a', textMarkdown: 'Suponer que cada modo electromagnético posee una energía media constante $\\langle E \\rangle = k_B T$, independientemente de su frecuencia.', isCorrect: true },
        { id: 'b', textMarkdown: 'Asumir que las paredes de la cavidad estaban en equilibrio térmico no lineal.', isCorrect: false },
        { id: 'c', textMarkdown: 'Ignorar la velocidad finita de la luz en el vacío $c$.', isCorrect: false },
        { id: 'd', textMarkdown: 'Considerar que la energía emitida por un modo electromagnético era proporcional a $\\nu^3$.', isCorrect: false }
      ],
      explanationMarkdown: '**Correcto**: En la física clásica, el teorema de equipartición asigna a cada grado de libertad oscilatorio una energía térmica media constante $\\langle E \\rangle = k_B T$. Como en una cavidad 3D el número de modos por unidad de frecuencia crece como $\\nu^2$, la energía total integrada $\\int_0^\\infty u(\\nu,T)d\\nu \\propto \\int_0^\\infty \\nu^2 d\\nu$ diverge a infinito.'
    },
    {
      level: 2,
      levelBadge: 'Nivel II • Cálculo Analítico',
      points: 25,
      title: 'Límite Asintótico de Rayleigh-Jeans',
      questionMarkdown: 'Al desarrollar en serie de Taylor la función exponencial en la ley de Planck $u(\\nu, T) = \\frac{8\\pi h \\nu^3}{c^3}\\frac{1}{e^{h\\nu/k_B T}-1}$ para bajas frecuencias ($h\\nu \\ll k_B T$), ¿qué término de orden cero en $h$ se recupera?',
      options: [
        { id: 'a', textMarkdown: '$u(\\nu, T) \\approx \\frac{8\\pi \\nu^2}{c^3} k_B T$', isCorrect: true },
        { id: 'b', textMarkdown: '$u(\\nu, T) \\approx \\frac{8\\pi h \\nu^3}{c^3} e^{-h\\nu/k_B T}$', isCorrect: false },
        { id: 'c', textMarkdown: '$u(\\nu, T) \\approx \\sigma T^4$', isCorrect: false },
        { id: 'd', textMarkdown: '$u(\\nu, T) \\approx \\frac{8\\pi k_B T}{\\nu^2 c}$', isCorrect: false }
      ],
      explanationMarkdown: '**Deducción**: Como $x = \\frac{h\\nu}{k_B T} \\ll 1$, aproximamos $e^x - 1 \\approx (1 + x + \\mathcal{O}(x^2)) - 1 = x = \\frac{h\\nu}{k_B T}$. Sustituyendo en la expresión de Planck: $$u(\\nu, T) \\approx \\frac{8\\pi h \\nu^3}{c^3} \\left(\\frac{k_B T}{h\\nu}\\right) = \\frac{8\\pi \\nu^2}{c^3} k_B T$$ que coincide exactamente con la ley de Rayleigh-Jeans.'
    },
    {
      level: 3,
      levelBadge: 'Nivel III • Síntesis & Termodinámica',
      points: 50,
      title: 'Deducción de la Ley de Stefan-Boltzmann',
      questionMarkdown: 'La constante de Stefan-Boltzmann $\\sigma$ en la radiancia total $R(T) = \\sigma T^4$ se deduce integrando la ley de Planck. ¿De qué combinación de constantes fundamentales depende analíticamente $\\sigma$?',
      options: [
        { id: 'a', textMarkdown: '$\\sigma = \\frac{2\\pi^5 k_B^4}{15 c^2 h^3}$', isCorrect: true },
        { id: 'b', textMarkdown: '$\\sigma = \\frac{8\\pi k_B^2}{c^3 h}$', isCorrect: false },
        { id: 'c', textMarkdown: '$\\sigma = \\frac{h c}{k_B T^2}$', isCorrect: false },
        { id: 'd', textMarkdown: '$\\sigma = \\frac{15 c^2}{2\\pi h^4 k_B}$', isCorrect: false }
      ],
      explanationMarkdown: '**Resultado**: La integral de Planck en todo el espectro produce $\\int_0^\\infty \\frac{x^3}{e^x - 1} dx = \\frac{\\pi^4}{15}$. Al multiplicar por los factores dimensionales se obtiene rigurosamente $\\sigma = \\frac{2\\pi^5 k_B^4}{15 c^2 h^3} \\approx 5.6704 \\times 10^{-8}\\text{ W}\\cdot\\text{m}^{-2}\\cdot\\text{K}^{-4}$.'
    }
  ]
};

// Fallback challenges for other modules
const DEFAULT_CHALLENGES: ChallengeQuestion[] = [
  {
    level: 1,
    levelBadge: 'Nivel I • Conceptual',
    points: 10,
    title: 'Interpretación Probabilística de Born',
    questionMarkdown: 'Para una partícula descrita por la función de onda normalizada $\\Psi(x,t)$, ¿qué magnitud física representa la cantidad $|\\Psi(x,t)|^2 dx$?',
    options: [
      { id: 'a', textMarkdown: 'La probabilidad infinitesimal de hallar a la partícula en el intervalo espacial $[x, x + dx]$ en el instante $t$.', isCorrect: true },
      { id: 'b', textMarkdown: 'La energía cinética total confinada en el elemento diferencial $dx$.', isCorrect: false },
      { id: 'c', textMarkdown: 'La carga eléctrica neta acumulada en la vecindad de $x$.', isCorrect: false }
    ],
    explanationMarkdown: '**Correcto**: De acuerdo con el postulado de Max Born (1926), la función de onda actúa como una amplitud de probabilidad, y su módulo al cuadrado es la densidad de probabilidad de posición: $P(x \\in [a,b]) = \\int_a^b |\\Psi(x,t)|^2 dx$.'
  },
  {
    level: 2,
    levelBadge: 'Nivel II • Operadores & Conmutadores',
    points: 25,
    title: 'Relación Canónica de Conmutación',
    questionMarkdown: 'Al aplicar el conmutador de posición y momentum $[\\hat{x}, \\hat{p}]$ sobre una función de prueba suave $\\psi(x)$, ¿cuál es el resultado analítico?',
    options: [
      { id: 'a', textMarkdown: '$[\\hat{x}, \\hat{p}] = i\\hbar \\hat{I}$', isCorrect: true },
      { id: 'b', textMarkdown: '$[\\hat{x}, \\hat{p}] = 0$', isCorrect: false },
      { id: 'c', textMarkdown: '$[\\hat{x}, \\hat{p}] = -i\\hbar \\frac{d}{dx}$', isCorrect: false }
    ],
    explanationMarkdown: '**Deducción**: Utilizando el operador de momentum en representación de coordenadas $\\hat{p} = -i\\hbar \\frac{d}{dx}$: $$[\\hat{x}, \\hat{p}]\\psi = x\\left(-i\\hbar \\frac{d\\psi}{dx}\\right) - \\left(-i\\hbar \\frac{d(x\\psi)}{dx}\\right) = -i\\hbar x \\psi\' + i\\hbar (\\psi + x\\psi\') = i\\hbar \\psi$$ Por lo tanto, $[\\hat{x}, \\hat{p}] = i\\hbar$.'
  },
  {
    level: 3,
    levelBadge: 'Nivel III • Estados Estacionarios',
    points: 50,
    title: 'Energía del Estado Fundamental en el Pozo Infinito',
    questionMarkdown: 'Para una partícula de masa $m$ en un pozo de potencial unidimensional infinito de ancho $L$ ($0 \\le x \\le L$), ¿cuál es la energía del estado fundamental $E_1$ y por qué no puede ser cero?',
    options: [
      { id: 'a', textMarkdown: '$E_1 = \\frac{\\pi^2 \\hbar^2}{2m L^2} > 0$; no puede ser cero por el Principio de Incertidumbre de Heisenberg (confinamiento finito $\\Delta x \\le L$).', isCorrect: true },
      { id: 'b', textMarkdown: '$E_1 = 0$; el estado fundamental clásico siempre posee energía cinética nula.', isCorrect: false },
      { id: 'c', textMarkdown: '$E_1 = \\frac{\\hbar^2}{2m L^2}$; la energía se disipa por emisión continua.', isCorrect: false }
    ],
    explanationMarkdown: '**Explicación**: Si $E=0$, la función de onda sería idénticamente nula (no normalizable) o la partícula tendría momentum nulo con certeza ($\\Delta p = 0$), lo que violaría el Principio de Incertidumbre $\\Delta x \\Delta p \\ge \\frac{\\hbar}{2}$ al estar confinada en $\\Delta x \\sim L$. Por ende, todo sistema cuántico confinado posee una energía de punto cero estrictamente positiva.'
  }
];

type TopicQuiz = Pick<ChallengeQuestion, 'title' | 'questionMarkdown' | 'explanationMarkdown'> & {
  correct: string;
  distractors: [string, string];
};

const TOPIC_QUIZZES: Record<string, TopicQuiz> = {
  '02-efecto-fotoelectrico-compton': {
    title: 'Umbral fotoeléctrico',
    questionMarkdown: 'Para un metal de función de trabajo $\\Phi$, ¿cuál es la condición necesaria para que un fotón monocromático produzca fotoemisión?',
    correct: '$h\\nu\\geq\\Phi$; entonces $K_{\\max}=h\\nu-\\Phi$.',
    distractors: ['$h\\nu\\geq 0$, independientemente del material.', '$h\\nu\\leq\\Phi$; la energía sobrante se emite como calor.'],
    explanationMarkdown: 'La conservación de energía exige que el fotón aporte al menos la función de trabajo. La intensidad modifica la cantidad de fotoelectrones, no el valor de $K_{\\max}$ para una frecuencia dada.'
  },
  '03-dualidad-onda-particula': {
    title: 'Régimen de De Broglie',
    questionMarkdown: '¿Qué expresión es válida para la longitud de onda de una partícula no relativista de momento $p$?',
    correct: '$\\lambda=h/p$, y si $K=p^2/(2m)$, $\\lambda=h/\\sqrt{2mK}$.',
    distractors: ['$\\lambda=hp$, porque el momento incrementa el periodo espacial.', '$\\lambda=mc^2/h$, independiente de la velocidad.'],
    explanationMarkdown: 'La relación de De Broglie vincula el periodo espacial de la fase con el momento. La forma con energía cinética presupone el régimen no relativista.'
  },
  '04-ecuacion-schrodinger': {
    title: 'Conservación de probabilidad',
    questionMarkdown: 'Para un potencial real y una función de onda suficientemente regular, ¿qué ecuación expresa conservación local de probabilidad?',
    correct: '$\\partial\\rho/\\partial t+\\partial J/\\partial x=0$.',
    distractors: ['$\\partial\\rho/\\partial t=J$.', '$\\partial J/\\partial t+\\partial\\rho/\\partial x=1$.'],
    explanationMarkdown: 'La ecuación de continuidad se deduce de la ecuación de Schrödinger y su conjugada compleja; al integrar con flujo nulo en la frontera, conserva la norma.'
  },
  '05-particula-libre-paquetes': {
    title: 'Velocidad de grupo',
    questionMarkdown: 'Para una partícula libre no relativista con $\\omega(k)=\\hbar k^2/(2m)$, ¿cuál es su velocidad de grupo?',
    correct: '$v_g=d\\omega/dk=\\hbar k/m=p/m$.',
    distractors: ['$v_g=\\omega k=\\hbar k^3/(2m)$.', '$v_g=0$ porque la energía es constante.'],
    explanationMarkdown: 'La envolvente de un paquete estrecho en $k$ se desplaza a $d\\omega/dk$, que coincide con la velocidad clásica no relativista.'
  },
  '06-potenciales-1d': {
    title: 'Pozo infinito 1D',
    questionMarkdown: 'Para una caja infinita entre $0$ y $L$, ¿qué condición selecciona los valores permitidos de $k$?',
    correct: '$\\psi(0)=\\psi(L)=0$, por lo que $k_n=n\\pi/L$ con $n=1,2,\\ldots$.',
    distractors: ['$\\psi\\prime(0)=\\psi\\prime(L)=0$, por lo que $k_n=0$.', '$k$ es continuo porque el potencial es cero dentro de la caja.'],
    explanationMarkdown: 'Las paredes infinitas imponen condiciones de Dirichlet y eliminan la solución constante; de ellas surge la cuantización.'
  },
  '07-tunelamiento-cuantico': {
    title: 'Barrera rectangular',
    questionMarkdown: 'En una barrera rectangular con $E<V_0$, ¿qué representa $\\kappa=\\sqrt{2m(V_0-E)}/\\hbar$?',
    correct: 'La constante de atenuación de la solución evanescente dentro de la barrera.',
    distractors: ['La frecuencia de oscilación de una onda propagante libre.', 'La carga eléctrica de la partícula incidente.'],
    explanationMarkdown: 'Para $E<V_0$, el número de onda se vuelve imaginario y la amplitud dentro de la barrera varía exponencialmente con escala $1/\\kappa$.'
  },
  '08-formalismo-dirac': {
    title: 'Completitud',
    questionMarkdown: 'Para una base ortonormal discreta completa $\\{|u_n\\rangle\\}$, ¿cuál es la resolución de la identidad?',
    correct: '$\\sum_n|u_n\\rangle\\langle u_n|=\\hat I$.',
    distractors: ['$\\sum_n\\langle u_n|u_n\\rangle=0$.', '$\\sum_n|u_n\\rangle=\\hat H$.'],
    explanationMarkdown: 'La completitud permite expandir cualquier ket como $|\\psi\\rangle=\\sum_n|u_n\\rangle\\langle u_n|\\psi\\rangle$.'
  },
  '09-oscilador-armonico': {
    title: 'Energía de punto cero',
    questionMarkdown: '¿Cuál es la energía del estado fundamental del oscilador armónico cuántico 1D?',
    correct: '$E_0=\\hbar\\omega/2$.',
    distractors: ['$E_0=0$.', '$E_0=\\hbar\\omega$.'],
    explanationMarkdown: 'Como $\\hat H=\\hbar\\omega(\\hat a^\\dagger\\hat a+1/2)$ y el número mínimo es cero, queda una energía residual no nula.'
  },
  '10-atomo-hidrogeno': {
    title: 'Niveles del hidrógeno',
    questionMarkdown: 'En el modelo no relativista de Coulomb con masa reducida, ¿de qué número cuántico depende la energía ligada del hidrógeno?',
    correct: 'Del número principal $n$: $E_n\\propto-1/n^2$.',
    distractors: ['Solo de $m$, la proyección azimutal.', 'Solo de $l$, el momento angular orbital.'],
    explanationMarkdown: 'Sin estructura fina, espín ni campos externos, la energía de Coulomb tiene degeneración en $l$ y $m$ para un mismo $n$.'
  },
  '11-momento-angular-espin': {
    title: 'Álgebra de momento angular',
    questionMarkdown: '¿Cuál es el conmutador de dos componentes distintas del momento angular?',
    correct: '$[\\hat J_i,\\hat J_j]=i\\hbar\\epsilon_{ijk}\\hat J_k$.',
    distractors: ['$[\\hat J_i,\\hat J_j]=0$ para todo par.', '$[\\hat J_i,\\hat J_j]=\\hbar^2\\hat I$.'],
    explanationMarkdown: 'La no conmutatividad impide la asignación simultánea precisa de dos componentes ortogonales.'
  },
  '12-stern-gerlach': {
    title: 'Medición secuencial Stern-Gerlach',
    questionMarkdown: 'Tras filtrar $|\\uparrow_z\\rangle$ y medir después $S_x$, ¿qué probabilidades se obtienen para $S_x$?',
    correct: '$P(+\\hbar/2)=P(-\\hbar/2)=1/2$.',
    distractors: ['$P(+\\hbar/2)=1$ porque el espín no cambia.', '$P(-\\hbar/2)=1$ por conservación de energía.'],
    explanationMarkdown: '$|\\uparrow_z\\rangle=(|\\uparrow_x\\rangle+|\\downarrow_x\\rangle)/\\sqrt2$; Born da probabilidades iguales.'
  },
  '13-perturbaciones': {
    title: 'Corrección de primer orden',
    questionMarkdown: 'Para un nivel no degenerado, ¿cuál es la corrección de energía de primer orden debida a $\\hat H\\prime$?',
    correct: '$E_n^{(1)}=\\langle\\psi_n^{(0)}|\\hat H\\prime|\\psi_n^{(0)}\\rangle$.',
    distractors: ['$E_n^{(1)}=E_n^{(0)}$.', '$E_n^{(1)}=\\sum_k E_k^{(0)}$.'],
    explanationMarkdown: 'La proyección de la ecuación perturbada sobre el autoestado no perturbado produce el valor esperado de la interacción.'
  },
  '14-perturbaciones-tiempo': {
    title: 'Dominio de la regla de oro de Fermi',
    questionMarkdown: '¿En qué situación es apropiada la regla de oro de Fermi?',
    correct: 'Acoplamiento débil hacia estados finales continuos o cuasi-continuos.',
    distractors: ['Cualquier sistema aislado de dos niveles a cualquier intensidad.', 'Una perturbación fuerte sin expansión perturbativa.'],
    explanationMarkdown: 'La regla de oro es un límite de primer orden y tiempos largos donde una densidad de estados finales permite definir una tasa.'
  }
};

function createTopicQuiz(topic: TopicQuiz): ChallengeQuestion[] {
  return [{
    level: 2,
    levelBadge: 'Quiz específico del módulo',
    points: 25,
    title: topic.title,
    questionMarkdown: topic.questionMarkdown,
    options: [
      { id: 'a', textMarkdown: topic.correct, isCorrect: true },
      { id: 'b', textMarkdown: topic.distractors[0], isCorrect: false },
      { id: 'c', textMarkdown: topic.distractors[1], isCorrect: false }
    ],
    explanationMarkdown: topic.explanationMarkdown
  }];
}

export function InteractiveChallenges({ moduleId }: { moduleId: string }) {
  const challenges = MODULE_CHALLENGES[moduleId] || (TOPIC_QUIZZES[moduleId] ? createTopicQuiz(TOPIC_QUIZZES[moduleId]) : DEFAULT_CHALLENGES);

  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [checkedStatus, setCheckedStatus] = useState<Record<number, boolean>>({});
  const [totalScore, setTotalScore] = useState<number>(0);

  const handleSelectOption = (qIdx: number, optId: string) => {
    if (checkedStatus[qIdx]) return; // locked once checked
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optId }));
  };

  const handleCheckAnswer = (qIdx: number, challenge: ChallengeQuestion) => {
    const chosen = selectedAnswers[qIdx];
    if (!chosen) return;

    const answeredCount = Object.keys({ ...checkedStatus, [qIdx]: true }).length;
    setCheckedStatus((prev) => ({ ...prev, [qIdx]: true }));
    const opt = challenge.options.find((o) => o.id === chosen);
    if (opt?.isCorrect) {
      setTotalScore((prev) => {
        const nextScore = prev + challenge.points;
        saveModuleLearningProgress(moduleId, {
          quizScore: nextScore,
          quizAnswered: answeredCount,
        });
        return nextScore;
      });
    } else {
      saveModuleLearningProgress(moduleId, {
        quizScore: totalScore,
        quizAnswered: answeredCount,
      });
    }
  };

  const handleResetChallenge = (qIdx: number, challenge: ChallengeQuestion) => {
    const wasCorrect = challenge.options.find((o) => o.id === selectedAnswers[qIdx])?.isCorrect;
    if (wasCorrect && checkedStatus[qIdx]) {
      setTotalScore((prev) => {
        const nextScore = Math.max(0, prev - challenge.points);
        saveModuleLearningProgress(moduleId, {
          quizScore: nextScore,
          quizAnswered: Math.max(0, getModuleLearningProgress(moduleId).quizAnswered - 1),
        });
        return nextScore;
      });
    }
    setSelectedAnswers((prev) => {
      const copy = { ...prev };
      delete copy[qIdx];
      return copy;
    });
    setCheckedStatus((prev) => {
      const copy = { ...prev };
      delete copy[qIdx];
      return copy;
    });
  };

  return (
    <div className="space-y-8">
      {/* Header & Score Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-3xl border border-slate-800 bg-slate-950 shadow-xl">
        <div>
          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            Evaluación Formativa & Autodiagnóstico
          </span>
          <h3 className="text-xl font-bold text-white mt-1">
            Retos de Cátedra (3 Niveles de Rigor)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Pon a prueba tu comprensión conceptual, destreza analítica y aplicación teórica.
          </p>
        </div>

        <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-900 border border-slate-800 font-mono">
          <Award className="w-5 h-5 text-cyan-400" />
          <div>
            <span className="text-slate-400 text-[10px] block">Puntuación Acumulada</span>
            <span className="font-bold text-sm text-cyan-300">{totalScore} Pts</span>
          </div>
        </div>
      </div>

      {/* Challenges List */}
      <div className="space-y-6">
        {challenges.map((ch, idx) => {
          const selected = selectedAnswers[idx];
          const isChecked = checkedStatus[idx];
          const chosenOpt = ch.options.find((o) => o.id === selected);
          const isCorrect = chosenOpt?.isCorrect;

          return (
            <div
              key={idx}
              className={`p-6 sm:p-8 rounded-3xl border transition-all ${
                isChecked
                  ? isCorrect
                    ? 'border-emerald-500/60 bg-emerald-950/10'
                    : 'border-rose-500/60 bg-rose-950/10'
                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
              }`}
            >
              {/* Question Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider border ${
                      ch.level === 1
                        ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                        : ch.level === 2
                        ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    }`}
                  >
                    {ch.levelBadge}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400">
                    +{ch.points} Pts
                  </span>
                </div>

                {isChecked && (
                  <button
                    type="button"
                    onClick={() => handleResetChallenge(idx, ch)}
                    className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-white cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reintentar</span>
                  </button>
                )}
              </div>

              {/* Title & Question Statement */}
              <h4 className="text-base font-bold text-white mb-2">
                {ch.title}
              </h4>
              <div className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 font-normal">
                <MathMarkdown content={ch.questionMarkdown} />
              </div>

              {/* Multiple Choice Options */}
              <div className="space-y-2.5 mb-6">
                {ch.options.map((opt) => {
                  const isThisSelected = selected === opt.id;
                  let optStyle = 'border-slate-800 bg-slate-950/80 hover:bg-slate-900 hover:border-slate-700 text-slate-300';

                  if (isThisSelected) {
                    optStyle = 'border-cyan-500 bg-cyan-950/30 text-white ring-1 ring-cyan-500/40';
                  }
                  if (isChecked) {
                    if (opt.isCorrect) {
                      optStyle = 'border-emerald-500 bg-emerald-950/40 text-emerald-200 ring-1 ring-emerald-500/40';
                    } else if (isThisSelected && !opt.isCorrect) {
                      optStyle = 'border-rose-500 bg-rose-950/40 text-rose-200 ring-1 ring-rose-500/40';
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={isChecked}
                      onClick={() => handleSelectOption(idx, opt.id)}
                      className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer disabled:cursor-default ${optStyle}`}
                    >
                      <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-slate-800/80 font-mono text-xs font-bold text-slate-400 shrink-0 mt-0.5">
                        {opt.id.toUpperCase()}
                      </span>
                      <div className="text-xs sm:text-sm leading-relaxed flex-1 pt-0.5">
                        <MathMarkdown content={opt.textMarkdown} inline />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Action Button: Check Answer */}
              {!isChecked ? (
                <button
                  type="button"
                  disabled={!selected}
                  onClick={() => handleCheckAnswer(idx, ch)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-white bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  <span>Comprobar Respuesta</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                /* Detailed Explanation Box */
                <div
                  className={`p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed space-y-2 ${
                    isCorrect
                      ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-100'
                      : 'border-rose-500/40 bg-rose-950/30 text-rose-100'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold font-mono uppercase text-xs">
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400">¡Respuesta Correcta! (+{ch.points} Pts)</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-rose-400" />
                        <span className="text-rose-400">Respuesta Incorrecta — Revisa el Formalismo:</span>
                      </>
                    )}
                  </div>
                  <div className="text-xs text-slate-300">
                    <MathMarkdown content={ch.explanationMarkdown} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
