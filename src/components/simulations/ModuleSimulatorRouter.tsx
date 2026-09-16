'use client';

import React, { useState } from 'react';
import { BlackbodySimulator } from './BlackbodySimulator';
import { PhotoelectricSimulator } from './PhotoelectricSimulator';
import { ComptonSimulator } from './ComptonSimulator';
import { QuantumWavepacketSimulator } from './QuantumWavepacketSimulator';
import {
  DoubleSlitSimulator,
  HarmonicOscillatorSimulator,
  HydrogenOrbitalSimulator,
  PerturbationSimulator,
  RabiSimulator,
  SpinMeasurementSimulator,
  SternGerlachSimulator,
} from './AcademicSimulators';
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

  if (moduleId === '03-dualidad-onda-particula') return <DoubleSlitSimulator />;

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

  if (moduleId === '09-oscilador-armonico') return <HarmonicOscillatorSimulator />;
  if (moduleId === '10-atomo-hidrogeno') return <HydrogenOrbitalSimulator />;
  if (moduleId === '11-momento-angular-espin') return <SpinMeasurementSimulator />;
  if (moduleId === '12-stern-gerlach') return <SternGerlachSimulator />;
  if (moduleId === '13-perturbaciones') return <PerturbationSimulator />;
  if (moduleId === '14-perturbaciones-tiempo') return <RabiSimulator />;

  return (
    <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 text-sm text-zinc-300">
      <h3 className="font-semibold text-amber-300">Laboratorio específico en desarrollo académico</h3>
      <p className="mt-2 leading-relaxed">
        El formalismo de Dirac se desarrolla aquí como herramienta matemática. No se muestra una animación
        genérica porque no representaría por sí sola un fenómeno físico; los laboratorios posteriores aplican
        esta notación a medición de espín, estados y evolución temporal.
      </p>
    </div>
  );
}
