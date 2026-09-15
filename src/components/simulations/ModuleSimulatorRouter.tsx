'use client';

import React, { useState } from 'react';
import { BlackbodySimulator } from './BlackbodySimulator';
import { PhotoelectricSimulator } from './PhotoelectricSimulator';
import { ComptonSimulator } from './ComptonSimulator';
import { QuantumWavepacketSimulator } from './QuantumWavepacketSimulator';
import { Zap, Atom } from 'lucide-react';

interface ModuleSimulatorRouterProps {
  moduleId: string;
}

export function ModuleSimulatorRouter({ moduleId }: ModuleSimulatorRouterProps) {
  const [mod2SubSim, setMod2SubSim] = useState<'photoelectric' | 'compton'>('photoelectric');

  if (moduleId === '01-introduccion-fisica-moderna') {
    return <BlackbodySimulator />;
  }

  if (moduleId === '02-efecto-fotoelectrico-compton') {
    return (
      <div className="space-y-6">
        {/* Sub-simulator switch for Module 02 */}
        <div className="flex flex-wrap items-center gap-3 p-1.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 w-fit">
          <button
            type="button"
            onClick={() => setMod2SubSim('photoelectric')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              mod2SubSim === 'photoelectric'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>1. Efecto Fotoeléctrico & Frenado</span>
          </button>

          <button
            type="button"
            onClick={() => setMod2SubSim('compton')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              mod2SubSim === 'compton'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Atom className="w-4 h-4 text-cyan-400" />
            <span>2. Dispersión Compton Relativista</span>
          </button>
        </div>

        {mod2SubSim === 'photoelectric' ? <PhotoelectricSimulator /> : <ComptonSimulator />}
      </div>
    );
  }

  // This model is valid only for the 1D Schrödinger / scattering units.  It is
  // deliberately not reused for spin, hydrogen, oscillator, or perturbation
  // modules: that would falsely imply that it simulates those phenomena.
  if (
    [
      '04-ecuacion-schrodinger',
      '05-particula-libre-paquetes',
      '06-potenciales-1d',
      '07-tunelamiento-cuantico',
    ].includes(moduleId)
  ) {
    return <QuantumWavepacketSimulator />;
  }

  return (
    <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 text-sm text-zinc-300">
      <h3 className="font-semibold text-amber-300">Laboratorio específico en desarrollo académico</h3>
      <p className="mt-2 leading-relaxed">
        Este módulo no usa el simulador de barreras 1D porque no representa fielmente su fenómeno.
        La teoría, ejercicios y recursos siguen disponibles; el laboratorio se publicará tras validar
        su Hamiltoniano, aproximaciones y pruebas numéricas.
      </p>
    </div>
  );
}
