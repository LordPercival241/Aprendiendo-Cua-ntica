'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Zap, Activity } from 'lucide-react';

interface Metal {
  name: string;
  symbol: string;
  phiEv: number; // Work function in eV
}

const METALS: Metal[] = [
  { name: 'Cesio (Cs)', symbol: 'Cs', phiEv: 2.14 },
  { name: 'Potasio (K)', symbol: 'K', phiEv: 2.30 },
  { name: 'Sodio (Na)', symbol: 'Na', phiEv: 2.28 },
  { name: 'Zinc (Zn)', symbol: 'Zn', phiEv: 4.31 },
  { name: 'Platino (Pt)', symbol: 'Pt', phiEv: 6.35 },
];

interface Electron {
  x: number;
  y: number;
  vx: number;
  vy: number;
  initialEnergy: number; // in eV
  life: number;
  turnedAround: boolean;
}

interface Photon {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

export function PhotoelectricSimulator() {
  const [selectedMetal, setSelectedMetal] = useState<Metal>(METALS[2]); // Sodium (2.28 eV)
  const [wavelengthNm, setWavelengthNm] = useState<number>(380); // 380 nm (Near UV / Violet)
  const [intensity, setIntensity] = useState<number>(60); // %
  const [voltage, setVoltage] = useState<number>(0); // Volts (-3.5 to +3.5)

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const electronsRef = useRef<Electron[]>([]);
  const photonsRef = useRef<Photon[]>([]);

  // Physical constants
  const h = 4.135667696e-15; // eV * s
  const c = 2.99792458e8; // m / s

  // Physical calculations
  const frequencyHz = c / (wavelengthNm * 1e-9); // Hz
  const photonEnergyEv = h * frequencyHz; // eV
  const kMaxEv = Math.max(0, photonEnergyEv - selectedMetal.phiEv); // eV
  const isEjection = photonEnergyEv >= selectedMetal.phiEv;
  const stoppingPotentialV = kMaxEv; // V_stop in Volts
  const thresholdWavelengthNm = (h * c) / (selectedMetal.phiEv * 1e-9); // nm

  // Pedagogical phenomenological current curve.  It preserves the threshold,
  // stopping potential and saturation trends, but is not a Fowler-DuBridge fit.
  let currentPa = 0;
  if (isEjection && intensity > 0) {
    const iSat = intensity * 1.8; // Saturation current in pA
    if (voltage >= 0) {
      // Saturation region with small space-charge saturation slope
      currentPa = Math.round(iSat * (1 + 0.05 * Math.min(voltage, 3.0)));
    } else {
      // Retarding region: drops strictly to 0 at V = -V_stop
      const retardingV = Math.abs(voltage);
      if (retardingV < stoppingPotentialV) {
        // Smooth curve reaching exactly 0 at V_stop
        const ratio = 1 - retardingV / stoppingPotentialV;
        currentPa = Math.round(iSat * Math.pow(ratio, 1.6));
      } else {
        currentPa = 0;
      }
    }
  }

  // Wavelength to RGB color approximation
  const nmToRgb = (wl: number): string => {
    let r = 0, g = 0, b = 0;
    if (wl >= 380 && wl < 440) {
      r = -(wl - 440) / (440 - 380);
      b = 1.0;
    } else if (wl >= 440 && wl < 490) {
      g = (wl - 440) / (490 - 440);
      b = 1.0;
    } else if (wl >= 490 && wl < 510) {
      g = 1.0;
      b = -(wl - 510) / (510 - 490);
    } else if (wl >= 510 && wl < 580) {
      r = (wl - 510) / (580 - 510);
      g = 1.0;
    } else if (wl >= 580 && wl < 645) {
      r = 1.0;
      g = -(wl - 645) / (645 - 580);
    } else if (wl >= 645 && wl <= 750) {
      r = 1.0;
    } else if (wl < 380) {
      // Ultraviolet: rich luminous violet-cyan
      return 'rgb(147, 51, 234)';
    } else {
      // Infrared: deep dark red
      return 'rgb(185, 28, 28)';
    }
    return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
  };

  // Main canvas animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastPhotonSpawn = Date.now();

    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      const w = rect.width;
      const h = rect.height;

      // Pure black chamber background
      ctx.fillStyle = '#050508';
      ctx.fillRect(0, 0, w, h);

      // Vacuum Tube Geometry
      const tubeX = 40;
      const tubeY = 35;
      const tubeW = Math.min(w - 80, 720);
      const tubeH = h - 70;

      // Draw Glass Vacuum Envelope (rounded tube with soft glow)
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2;
      ctx.strokeRect(tubeX, tubeY, tubeW, tubeH);

      // Cathode Plate (Left - Emitter)
      const cathX = tubeX + 60;
      const cathY = tubeY + 25;
      const cathW = 12;
      const cathH = tubeH - 50;

      const cathGrad = ctx.createLinearGradient(cathX, cathY, cathX + cathW, cathY);
      cathGrad.addColorStop(0, '#334155');
      cathGrad.addColorStop(0.5, '#64748b');
      cathGrad.addColorStop(1, '#1e293b');
      ctx.fillStyle = cathGrad;
      ctx.fillRect(cathX, cathY, cathW, cathH);

      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`Cátodo (${selectedMetal.symbol})`, cathX + cathW / 2, cathY - 8);

      // Anode Plate (Right - Collector)
      const anodX = tubeX + tubeW - 80;
      const anodY = cathY;
      const anodW = 10;
      const anodH = cathH;

      const anodGrad = ctx.createLinearGradient(anodX, anodY, anodX + anodW, anodY);
      anodGrad.addColorStop(0, '#1e293b');
      anodGrad.addColorStop(0.5, '#475569');
      anodGrad.addColorStop(1, '#0f172a');
      ctx.fillStyle = anodGrad;
      ctx.fillRect(anodX, anodY, anodW, anodH);

      ctx.fillStyle = '#64748b';
      ctx.fillText('Ánodo (Colector)', anodX + anodW / 2, anodY - 8);

      // Electric Field Lines representation between plates
      const dPlate = anodX - (cathX + cathW);
      if (Math.abs(voltage) > 0.1) {
        ctx.save();
        ctx.strokeStyle = voltage > 0 ? 'rgba(56, 189, 248, 0.12)' : 'rgba(239, 68, 68, 0.12)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);
        for (let fy = cathY + 15; fy < cathY + cathH - 10; fy += 25) {
          ctx.beginPath();
          ctx.moveTo(cathX + cathW + 5, fy);
          ctx.lineTo(anodX - 5, fy);
          ctx.stroke();
        }
        ctx.restore();
      }

      // External Battery / Circuit Indicator
      const wireY = tubeY + tubeH + 14;
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      // Cathode wire down
      ctx.moveTo(cathX + cathW / 2, cathY + cathH);
      ctx.lineTo(cathX + cathW / 2, wireY);
      ctx.lineTo(tubeX + tubeW / 2 - 40, wireY);
      // Anode wire down
      ctx.moveTo(anodX + anodW / 2, anodY + anodH);
      ctx.lineTo(anodX + anodW / 2, wireY);
      ctx.lineTo(tubeX + tubeW / 2 + 40, wireY);
      ctx.stroke();

      // Battery label
      ctx.fillStyle = voltage >= 0 ? '#38bdf8' : '#f87171';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(
        `Fuente DC: ${voltage > 0 ? '+' : ''}${voltage.toFixed(2)} V ${voltage < 0 ? '(Retardador)' : '(Acelerador)'}`,
        tubeX + tubeW / 2,
        wireY + 4
      );

      // Spawn Incident Photons from Lamp
      const now = Date.now();
      const lightColor = nmToRgb(wavelengthNm);

      if (intensity > 0 && now - lastPhotonSpawn > Math.max(25, 140 - intensity)) {
        lastPhotonSpawn = now;
        const targetY = cathY + 10 + Math.random() * (cathH - 20);
        const sourceX = tubeX + 10;
        const sourceY = tubeY + 10;
        const angle = Math.atan2(targetY - sourceY, (cathX + 4) - sourceX);
        const speed = 7.5;
        photonsRef.current.push({
          x: sourceX,
          y: sourceY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
        });
      }

      // Draw and Update Photons
      const survivingPhotons: Photon[] = [];
      ctx.fillStyle = lightColor;
      ctx.strokeStyle = lightColor;

      for (const p of photonsRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        // Draw photon as oscillating wave packet
        ctx.save();
        ctx.globalAlpha = 0.85;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Wave line trailing behind photon
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.vx * 2, p.y - p.vy * 2);
        ctx.stroke();
        ctx.restore();

        // Check impact with Cathode plate
        if (p.x >= cathX && p.x <= cathX + cathW && p.y >= cathY && p.y <= cathY + cathH) {
          // Photoelectric Ejection!
          if (isEjection) {
            // Emitted energy distribution: from 0.15 * K_max to K_max
            const energyFraction = 0.15 + Math.random() * 0.85;
            const initialEnergy = kMaxEv * energyFraction;
            // Calibrate velocity: v_0 = sqrt(E_k) * 4.2 px/frame
            const v0 = Math.sqrt(initialEnergy) * 4.2;
            // Small angular spread
            const theta = (Math.random() - 0.5) * 0.5;

            electronsRef.current.push({
              x: cathX + cathW + 2,
              y: p.y,
              vx: v0 * Math.cos(theta),
              vy: v0 * Math.sin(theta),
              initialEnergy,
              life: 0,
              turnedAround: false,
            });
          }
        } else if (p.x < cathX + cathW && p.y < cathY + cathH + 20) {
          survivingPhotons.push(p);
        }
      }
      photonsRef.current = survivingPhotons;

      // Update and Draw Electrons with EXACT Physical Acceleration
      // Physics: 2 * a * dPlate = V * C_scale
      // When V = -E_k, v_anode^2 = 0 => a = (V * 4.2^2) / (2 * dPlate)
      const accelX = (voltage * Math.pow(4.2, 2)) / (2 * dPlate);

      const survivingElectrons: Electron[] = [];
      for (const e of electronsRef.current) {
        // Apply electrostatic acceleration from potential difference V
        e.vx += accelX;
        e.x += e.vx;
        e.y += e.vy;
        e.life++;

        if (e.vx <= 0 && !e.turnedAround) {
          e.turnedAround = true;
        }

        // Draw Electron dot
        ctx.save();
        ctx.beginPath();
        ctx.arc(e.x, e.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = e.turnedAround ? '#f87171' : '#38bdf8'; // Blue forward, Red if turning back!
        ctx.shadowColor = e.turnedAround ? '#ef4444' : '#0284c7';
        ctx.shadowBlur = 6;
        ctx.fill();

        // Motion trail
        ctx.fillStyle = e.turnedAround ? 'rgba(239, 68, 68, 0.25)' : 'rgba(56, 189, 248, 0.25)';
        ctx.beginPath();
        ctx.arc(e.x - e.vx * 1.5, e.y - e.vy * 1.5, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Collision logic:
        // 1. Reached Anode: absorbed, registered as current
        if (e.x >= anodX) {
          continue;
        }
        // 2. Turned around and hit Cathode back: absorbed by cathode
        if (e.turnedAround && e.x <= cathX + cathW) {
          continue;
        }
        // 3. Out of vertical bounds or expired
        if (e.y < cathY - 5 || e.y > cathY + cathH + 5 || e.life > 180) {
          continue;
        }

        survivingElectrons.push(e);
      }
      electronsRef.current = survivingElectrons;

      // Status HUD on top of canvas
      ctx.textAlign = 'left';
      ctx.font = 'bold 11px monospace';
      if (!isEjection) {
        ctx.fillStyle = '#f87171';
        ctx.fillText(`✕ SUB-UMBRAL: hν (${photonEnergyEv.toFixed(2)} eV) < Φ (${selectedMetal.phiEv} eV) — Cero emisión`, tubeX + 15, 20);
      } else {
        ctx.fillStyle = '#34d399';
        ctx.fillText(
          `✓ EMISIÓN ACTIVA: K_max = ${kMaxEv.toFixed(2)} eV | V_stop = -${stoppingPotentialV.toFixed(2)} V`,
          tubeX + 15,
          20
        );
      }

      ctx.textAlign = 'right';
      ctx.fillStyle = currentPa > 0 ? '#38bdf8' : '#94a3b8';
      ctx.fillText(`Fotocorriente I = ${currentPa} pA`, tubeX + tubeW - 15, 20);

      ctx.restore();
      animFrameRef.current = requestAnimationFrame(render);
    };

    render();
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [wavelengthNm, intensity, voltage, selectedMetal, isEjection, kMaxEv, photonEnergyEv, stoppingPotentialV, currentPa]);

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 space-y-6 text-zinc-100 shadow-2xl">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Laboratorio Cuántico Fundamental • Einstein 1905
            </span>
            <span className="text-xs text-zinc-400 font-mono">Nobel de Física 1921</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mt-1.5">
            Simulador de Fotocélula & Potencial de Frenado
          </h3>
          <p className="text-sm text-zinc-400 mt-1 max-w-3xl">
            Comprueba cómo la emisión de fotoelectrones ocurre al instante solo si la frecuencia supera el umbral (hν ≥ Φ). Observa el giro de los electrones cuando el voltaje retardador iguala a -V_stop.
          </p>
        </div>

        {/* Current Ammeter Badge */}
        <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-zinc-900/90 border border-zinc-800 font-mono shadow-inner">
          <Zap className={`w-6 h-6 ${currentPa > 0 ? 'text-amber-400 animate-pulse' : 'text-zinc-600'}`} />
          <div>
            <span className="text-zinc-400 text-[11px] uppercase tracking-wider block font-semibold">Fotocorriente (I)</span>
            <span className={`font-bold text-lg ${currentPa > 0 ? 'text-cyan-300' : 'text-zinc-500'}`}>
              {currentPa} <span className="text-xs font-normal text-zinc-400">pA</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Simulation Viewport */}
      <div className="relative rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-inner">
        <canvas
          ref={canvasRef}
          className="w-full h-[320px] sm:h-[380px] block"
        />
      </div>

      {/* Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {/* Metal Selector & Sliders */}
        <div className="lg:col-span-2 space-y-5 p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          {/* Target Metal */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-300 mb-2">
              <span>Material del Cátodo Emisor:</span>
              <span className="font-mono text-cyan-400">Φ = {selectedMetal.phiEv} eV</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {METALS.map((m) => (
                <button
                  key={m.symbol}
                  type="button"
                  onClick={() => setSelectedMetal(m)}
                  className={`p-2.5 rounded-xl text-xs font-mono transition-all border cursor-pointer text-center ${
                    selectedMetal.symbol === m.symbol
                      ? 'bg-cyan-600 text-white border-cyan-400 shadow-md font-bold'
                      : 'bg-zinc-800/90 text-zinc-300 border-zinc-700 hover:bg-zinc-700'
                  }`}
                >
                  <strong className="block text-sm">{m.symbol}</strong>
                  <span className="text-[10px] opacity-80 block">{m.phiEv} eV</span>
                </button>
              ))}
            </div>
          </div>

          {/* Wavelength Slider */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-300 font-medium">Longitud de Onda Incidentes $\lambda$ (nm):</span>
              <span className="font-mono font-bold text-cyan-400">
                {wavelengthNm} nm ({photonEnergyEv.toFixed(2)} eV)
                <span className="ml-2 text-zinc-400 text-[11px]">
                  {wavelengthNm < 380 ? '[Ultravioleta]' : wavelengthNm > 700 ? '[Infrarrojo]' : '[Luz Visible]'}
                </span>
              </span>
            </div>
            <input
              type="range"
              min="180"
              max="750"
              step="5"
              value={wavelengthNm}
              onChange={(e) => setWavelengthNm(Number(e.target.value))}
              className="w-full h-2.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
              <span>180 nm (UV Lejano)</span>
              <span>380 nm (Violeta)</span>
              <span>550 nm (Verde)</span>
              <span>750 nm (Rojo/IR)</span>
            </div>
          </div>

          {/* Intensity & Voltage Dual Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-300 font-medium">Intensidad de la Luz (Flujo de fotones):</span>
                <span className="font-mono text-zinc-200 font-bold">{intensity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="w-full h-2.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-300 font-medium">Voltaje Placas $V$ (Frenado / Acelerador):</span>
                <span className={`font-mono font-bold ${voltage < 0 ? 'text-rose-400' : 'text-cyan-400'}`}>
                  {voltage > 0 ? '+' : ''}{voltage.toFixed(2)} V
                </span>
              </div>
              <input
                type="range"
                min="-4.0"
                max="3.5"
                step="0.05"
                value={voltage}
                onChange={(e) => setVoltage(Number(e.target.value))}
                className="w-full h-2.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-rose-400">-4.0 V (Retardador)</span>
                <span className="text-zinc-500">0.0 V</span>
                <span className="text-cyan-400">+3.5 V (Acelerador)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Physical Diagnostics */}
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4 font-mono text-xs">
          <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Balance Energético de Einstein</span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="text-zinc-400">Energía del Fotón (hν):</span>
              <span className="font-bold text-white">{photonEnergyEv.toFixed(2)} eV</span>
            </div>
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="text-zinc-400">Función Trabajo (Φ):</span>
              <span className="font-bold text-zinc-300">{selectedMetal.phiEv.toFixed(2)} eV</span>
            </div>
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="text-zinc-400">Energía Cinética K_max:</span>
              <span className={`font-bold ${isEjection ? 'text-emerald-400' : 'text-zinc-500'}`}>
                {kMaxEv.toFixed(2)} eV
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="text-zinc-400">Potencial Frenado (V_stop):</span>
              <span className="font-bold text-cyan-300">
                {isEjection ? `-${stoppingPotentialV.toFixed(2)} V` : '0.00 V'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Longitud de Onda Umbral:</span>
              <span className="font-bold text-amber-400">
                {thresholdWavelengthNm.toFixed(0)} nm
              </span>
            </div>
          </div>

          {/* Retarding Potential Notice */}
          <div className={`p-3 rounded-xl border text-[11px] leading-relaxed ${
            !isEjection
              ? 'bg-rose-950/30 border-rose-800/40 text-rose-300'
              : Math.abs(voltage) >= stoppingPotentialV && voltage < 0
              ? 'bg-amber-950/30 border-amber-800/40 text-amber-300'
              : 'bg-cyan-950/30 border-cyan-800/40 text-cyan-300'
          }`}>
            {!isEjection ? (
              <span>La radiación no tiene suficiente energía cuántica para arrancar electrones (hν &lt; Φ). Aumenta la frecuencia reduciendo la longitud de onda.</span>
            ) : Math.abs(voltage) >= stoppingPotentialV && voltage < 0 ? (
              <span><strong>Frenado Completo:</strong> El potencial retardador (|V| ≥ V_stop) frena y hace regresar a todos los electrones antes del ánodo. La fotocorriente es exactamente 0.</span>
            ) : (
              <span>Electrones con energía suficiente superan el potencial y alcanzan el ánodo cerrando el circuito.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
