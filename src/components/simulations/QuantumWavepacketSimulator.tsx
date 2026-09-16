'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Activity } from 'lucide-react';
import { KaTeXRenderer } from '@/components/math/KaTeXRenderer';
import { LaboratoryModel } from './shared/LaboratoryModel';

export function QuantumWavepacketSimulator() {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [barrierHeight, setBarrierHeight] = useState<number>(3.5); // eV
  const [packetEnergy, setPacketEnergy] = useState<number>(2.2); // eV (starts below barrier for tunneling!)
  const [barrierWidth, setBarrierWidth] = useState<number>(1.0); // nm
  const [potentialType, setPotentialType] = useState<'barrier' | 'well' | 'step'>('barrier');
  const [showRealPart, setShowRealPart] = useState<boolean>(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);

  // Time in seconds
  const timeRef = useRef<number>(0);

  // Exact stationary transmission coefficients for one-dimensional piecewise-constant potentials.
  const computeTransmission = (): number => {
    const E = packetEnergy;
    const V0 = barrierHeight;
    const a = barrierWidth * 1e-9; // meters
    const m_e = 9.1093837e-31; // kg
    const hbar = 1.054571817e-34; // J s
    const e = 1.602176634e-19; // J/eV

    if (potentialType === 'well') {
      // Transmission resonance in a square well
      const k2 = Math.sqrt(2 * m_e * (E + V0) * e) / hbar;
      const sinVal = Math.sin(k2 * a);
      const denom = 1 + (Math.pow(V0, 2) * Math.pow(sinVal, 2)) / (4 * E * (E + V0));
      return Math.min(1, Math.max(0, 1 / denom));
    }

    if (potentialType === 'step') {
      if (E < V0) return 0;
      const k1 = Math.sqrt(2 * m_e * E * e) / hbar;
      const k2 = Math.sqrt(2 * m_e * (E - V0) * e) / hbar;
      const T = (4 * k1 * k2) / Math.pow(k1 + k2, 2);
      return Math.min(1, Math.max(0, T));
    }

    // Barrier
    if (E < V0) {
      // Quantum Tunneling regime
      const k2 = Math.sqrt(2 * m_e * (V0 - E) * e) / hbar;
      const sinhVal = Math.sinh(k2 * a);
      const denom = 1 + (Math.pow(V0, 2) * Math.pow(sinhVal, 2)) / (4 * E * (V0 - E));
      return Math.min(1, Math.max(0, 1 / denom));
    } else if (E > V0) {
      // Quantum over-the-barrier transmission with quantum reflection
      const k2 = Math.sqrt(2 * m_e * (E - V0) * e) / hbar;
      const sinVal = Math.sin(k2 * a);
      const denom = 1 + (Math.pow(V0, 2) * Math.pow(sinVal, 2)) / (4 * E * (E - V0));
      return Math.min(1, Math.max(0, 1 / denom));
    }
    // Finite E → V0 limit of the exact barrier expression.
    const denom = 1 + (m_e * V0 * e * a * a) / (2 * hbar * hbar);
    return Math.min(1, Math.max(0, 1 / denom));
  };

  const transmissionT = computeTransmission();
  const reflectionR = Math.max(0, 1 - transmissionT);
  const isBelowPotential = packetEnergy < barrierHeight;
  const regimeLabel = potentialType === 'well'
    ? 'Resonancias de transmisión en pozo'
    : potentialType === 'step'
      ? (isBelowPotential ? 'Onda evanescente; T = 0' : 'Propagación sobre el escalón')
      : (isBelowPotential ? 'Tunelamiento' : 'Dispersión sobre la barrera');
  const formatProbability = (value: number) => value < 0.001 ? value.toExponential(2) : value.toFixed(3);

  // Animation rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTimestamp = performance.now();

    const render = (timestamp: number) => {
      const dt = Math.min((timestamp - lastTimestamp) / 1000, 0.1);
      lastTimestamp = timestamp;

      if (isPlaying) {
        timeRef.current += dt * 1.35; // time multiplier
      }

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

      // Dark theme background
      ctx.fillStyle = '#050508';
      ctx.fillRect(0, 0, w, h);

      // Subtle spatial grid
      ctx.strokeStyle = '#121624';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      const baselineY = h * 0.74;
      const barrierCenterX = w * 0.50;
      const barrierWidthPx = (barrierWidth / 2.0) * 110;
      const barrierHeightPx = (barrierHeight / 6.0) * (h * 0.52);

      const bx1 = barrierCenterX - barrierWidthPx / 2;
      const bx2 = barrierCenterX + barrierWidthPx / 2;

      // Draw Potential V(x)
      ctx.save();
      ctx.fillStyle = 'rgba(245, 158, 11, 0.14)';
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;

      if (potentialType === 'barrier') {
        const by = baselineY - barrierHeightPx;
        ctx.fillRect(bx1, by, barrierWidthPx, barrierHeightPx);
        ctx.strokeRect(bx1, by, barrierWidthPx, barrierHeightPx);

        // Barrier labels
        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`Barrera V₀ = ${barrierHeight.toFixed(1)} eV`, barrierCenterX, by - 8);
        ctx.fillText(`a = ${barrierWidth.toFixed(1)} nm`, barrierCenterX, baselineY + 18);
      } else if (potentialType === 'well') {
        const by = baselineY;
        const wellD = (barrierHeight / 6.0) * (h * 0.25);
        ctx.fillRect(bx1, by, barrierWidthPx, wellD);
        ctx.strokeRect(bx1, by, barrierWidthPx, wellD);
        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`Pozo V₀ = -${barrierHeight.toFixed(1)} eV`, barrierCenterX, by + wellD + 16);
      } else {
        // Step
        const by = baselineY - barrierHeightPx;
        ctx.fillRect(bx1, by, w - bx1 - 20, barrierHeightPx);
        ctx.strokeRect(bx1, by, w - bx1 - 20, barrierHeightPx);
        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 10px monospace';
        ctx.fillText(`Salto V₀ = ${barrierHeight.toFixed(1)} eV`, bx1 + 60, by - 8);
      }
      ctx.restore();

      // Energy Level line E
      const energyY = baselineY - (packetEnergy / 6.0) * (h * 0.52);
      ctx.save();
      ctx.strokeStyle = '#38bdf8';
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(30, energyY);
      ctx.lineTo(w - 30, energyY);
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`Energía E = ${packetEnergy.toFixed(2)} eV — ${regimeLabel}`, 35, energyY - 6);

      // Quantum Wavepacket Dynamics with True Reflection & Transmission Split
      const v_group = 80; // px/s
      const x_start = 70;
      const distanceToBarrier = bx1 - x_start;
      const t_hit = distanceToBarrier / v_group;
      const cycleDuration = (w * 0.95) / v_group;

      // Loop time
      const t = timeRef.current % cycleDuration;

      const sigmaX = 32; // Packet spatial width
      const k0 = 0.35 + Math.sqrt(packetEnergy) * 0.15; // Wavevector
      const omega = k0 * v_group * 0.08;

      const ampScale = h * 0.32;
      const numPoints = 300;
      const startX = 30;
      const endX = w - 30;
      const stepX = (endX - startX) / numPoints;

      // Current positions of packets
      const x_inc = x_start + v_group * t;
      const t_after = Math.max(0, t - t_hit);
      const x_ref = bx1 - v_group * t_after;
      const x_trans = bx2 + v_group * t_after;

      // Decay factor for incident packet as it hits barrier
      const incidentDecay = t < t_hit ? 1 : Math.max(0, 1 - t_after * 1.5);

      // Points array
      const pointsProb: { x: number; y: number }[] = [];
      const pointsReal: { x: number; y: number }[] = [];

      for (let i = 0; i <= numPoints; i++) {
        const x = startX + i * stepX;
        let psi_real = 0;
        let psi_prob = 0;

        if (x < bx1) {
          // Left of barrier: superposition of incoming packet and reflected packet!
          // Incident packet:
          const distInc = x - x_inc;
          const envInc = incidentDecay * Math.exp(-(distInc * distInc) / (2 * sigmaX * sigmaX));
          const phaseInc = k0 * x - omega * t;

          // Reflected packet (exists when t >= t_hit, moving backward):
          let envRef = 0;
          let phaseRef = 0;
          if (t >= t_hit) {
            const distRef = x - x_ref;
            const refRamp = Math.min(1, t_after * 2.5); // smoothly forms
            envRef = Math.sqrt(reflectionR) * refRamp * Math.exp(-(distRef * distRef) / (2 * sigmaX * sigmaX));
            phaseRef = -k0 * x - omega * t; // negative wavevector (left-moving)
          }

          // Quantum Superposition: Psi = Psi_inc + Psi_ref
          const re = envInc * Math.cos(phaseInc) + envRef * Math.cos(phaseRef);
          const im = envInc * Math.sin(phaseInc) + envRef * Math.sin(phaseRef);
          psi_prob = re * re + im * im;
          psi_real = re;
        } else if (x >= bx1 && (potentialType === 'step' || x <= bx2)) {
          // Inside barrier: evanescent exponential decay for tunneling
          const overlap = Math.exp(-Math.pow(x_inc - bx1, 2) / (2 * sigmaX * sigmaX));
          if (potentialType !== 'well' && isBelowPotential) {
            const kappa = Math.sqrt(barrierHeight - packetEnergy) * 0.08;
            const decay = Math.exp(-kappa * (x - bx1));
            psi_prob = overlap * decay * Math.max(0.04, transmissionT);
            psi_real = Math.sqrt(psi_prob) * Math.cos(-omega * t);
          } else {
            psi_prob = overlap;
            psi_real = Math.sqrt(psi_prob) * Math.cos(k0 * x - omega * t);
          }
        } else {
          // Right of barrier: transmitted packet moving to the right
          if (t >= t_hit) {
            const distTrans = x - x_trans;
            const transRamp = Math.min(1, t_after * 2.5);
            const envTrans = Math.sqrt(transmissionT) * transRamp * Math.exp(-(distTrans * distTrans) / (2 * sigmaX * sigmaX));
            const phaseTrans = k0 * x - omega * t;
            psi_prob = envTrans * envTrans;
            psi_real = envTrans * Math.cos(phaseTrans);
          }
        }

        const yProb = baselineY - psi_prob * ampScale;
        const yReal = baselineY - psi_real * (ampScale * 0.65);
        pointsProb.push({ x, y: yProb });
        pointsReal.push({ x, y: yReal });
      }

      // Draw Probability Density Area (Cyan shaded envelope)
      ctx.beginPath();
      ctx.moveTo(pointsProb[0].x, baselineY);
      for (const pt of pointsProb) {
        ctx.lineTo(pt.x, pt.y);
      }
      ctx.lineTo(pointsProb[pointsProb.length - 1].x, baselineY);
      ctx.closePath();

      const probGrad = ctx.createLinearGradient(0, baselineY - ampScale, 0, baselineY);
      probGrad.addColorStop(0, 'rgba(6, 182, 212, 0.45)');
      probGrad.addColorStop(1, 'rgba(6, 182, 212, 0.02)');
      ctx.fillStyle = probGrad;
      ctx.fill();

      // Draw Probability Density Envelope Line
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let i = 0; i < pointsProb.length; i++) {
        if (i === 0) ctx.moveTo(pointsProb[i].x, pointsProb[i].y);
        else ctx.lineTo(pointsProb[i].x, pointsProb[i].y);
      }
      ctx.stroke();

      // Optional: Draw Real Part Re{psi} Oscillations
      if (showRealPart) {
        ctx.strokeStyle = '#a855f7'; // Purple wave
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let i = 0; i < pointsReal.length; i++) {
          if (i === 0) ctx.moveTo(pointsReal[i].x, pointsReal[i].y);
          else ctx.lineTo(pointsReal[i].x, pointsReal[i].y);
        }
        ctx.stroke();
      }

      // Axis Baseline
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(30, baselineY);
      ctx.lineTo(w - 30, baselineY);
      ctx.stroke();

      // Packet Labels in flight
      ctx.font = 'bold 10px monospace';
      if (t < t_hit) {
        ctx.fillStyle = '#38bdf8';
        ctx.textAlign = 'center';
        ctx.fillText('Paquete Incidente →', Math.max(80, Math.min(w - 80, x_inc)), baselineY - ampScale - 10);
      } else {
        if (reflectionR > 0.02 && x_ref > 50) {
          ctx.fillStyle = '#f43f5e';
          ctx.textAlign = 'center';
          ctx.fillText(`← Reflejado (${(reflectionR * 100).toFixed(0)}%)`, x_ref, baselineY - ampScale * Math.sqrt(reflectionR) - 10);
        }
        if (transmissionT > 0.001 && x_trans < w - 50) {
          ctx.fillStyle = '#10b981';
          ctx.textAlign = 'center';
          ctx.fillText(`Transmitido (${(transmissionT * 100).toFixed(1)}%) →`, x_trans, baselineY - ampScale * Math.sqrt(transmissionT) - 10);
        }
      }

      ctx.restore();
      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, barrierHeight, packetEnergy, barrierWidth, potentialType, transmissionT, reflectionR, showRealPart, isBelowPotential, regimeLabel]);

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 space-y-6 text-zinc-100 shadow-2xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Ecuación de Schrödinger 1D • Dispersión estacionaria
            </span>
            <span className="text-xs text-zinc-400 font-mono">Visualización Analítica</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mt-1.5">
            Dispersión 1D, Barreras y Transmisión
          </h3>
          <p className="text-sm text-zinc-400 mt-1 max-w-3xl">
            Coeficientes analíticos de reflexión y transmisión para perfiles 1D. La envolvente ilustra la dispersión; los valores{' '}
            <KaTeXRenderer math="R" /> y <KaTeXRenderer math="T" /> provienen de las expresiones estacionarias mostradas.
          </p>
        </div>

        {/* Play / Pause / Reset / RealPart Toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowRealPart(!showRealPart)}
            className={`px-3 py-2 rounded-xl text-xs font-mono font-semibold border transition-colors cursor-pointer ${
              showRealPart
                ? 'bg-purple-950/40 text-purple-300 border-purple-800/60'
                : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white'
            }`}
            title="Mostrar u ocultar oscilaciones de fase"
          >
            {showRealPart ? 'Re{ψ} Visible' : 'Solo |ψ|²'}
          </button>
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-semibold cursor-pointer transition-colors shadow-sm"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlaying ? 'Pausar' : 'Reanudar'}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              timeRef.current = 0;
            }}
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer border border-zinc-700 transition-colors"
            title="Reiniciar paquete de ondas"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Canvas Viewport */}
      <div className="relative rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-inner">
        <canvas
          ref={canvasRef}
          className="w-full h-[320px] sm:h-[380px] block"
        />

        {/* Probability Meters HUD */}
        <div className="absolute top-3 right-3 flex items-center gap-3 p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 backdrop-blur-md text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
            <span className="text-zinc-400">Reflexión R:</span>
            <span className="font-bold text-rose-400">{(reflectionR * 100).toFixed(1)}%</span>
          </div>
          <div className="h-4 w-[1px] bg-zinc-700" />
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
            <span className="text-zinc-400">Transmisión T:</span>
            <span className="font-bold text-emerald-400">{(transmissionT * 100).toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {/* Sliders & Geometry */}
        <div className="lg:col-span-2 space-y-5 p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          {/* Potential Type Tabs */}
          <div>
            <span className="text-xs font-semibold text-zinc-300 block mb-2">
              Perfil del potencial <KaTeXRenderer math={String.raw`V(x)`} />:
            </span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'barrier', label: 'Barrera Rectangular (Efecto Túnel)' },
                { id: 'well', label: 'Pozo Cuántico (Resonancias)' },
                { id: 'step', label: 'Salto de Potencial (Escalón)' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setPotentialType(p.id as 'barrier' | 'well' | 'step');
                    timeRef.current = 0;
                  }}
                  className={`p-2.5 rounded-xl text-xs font-mono transition-all border cursor-pointer text-center ${
                    potentialType === p.id
                      ? 'bg-cyan-600 text-white border-cyan-400 shadow-md font-bold'
                      : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Energy Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-300 font-medium">Energía del paquete <KaTeXRenderer math="E" /> (eV):</span>
              <span className="font-mono font-bold text-cyan-400">{packetEnergy.toFixed(2)} eV</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="5.5"
              step="0.1"
              value={packetEnergy}
              onChange={(e) => setPacketEnergy(Number(e.target.value))}
              className="w-full h-2.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>

          {/* Barrier Height & Width */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-300 font-medium">Magnitud del potencial <KaTeXRenderer math={String.raw`V_0`} /> (eV):</span>
                <span className="font-mono text-amber-400 font-bold">{barrierHeight.toFixed(1)} eV</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="6.0"
                step="0.2"
                value={barrierHeight}
                onChange={(e) => setBarrierHeight(Number(e.target.value))}
                className="w-full h-2.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-300 font-medium">Ancho de la región <KaTeXRenderer math="a" /> (nm):</span>
                <span className="font-mono text-zinc-200 font-bold">{barrierWidth.toFixed(2)} nm</span>
              </div>
              <input
                type="range"
                min="0.4"
                max="2.5"
                step="0.1"
              value={barrierWidth}
              onChange={(e) => setBarrierWidth(Number(e.target.value))}
                disabled={potentialType === 'step'}
                className="w-full h-2.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
              />
              {potentialType === 'step' && <p className="text-[10px] text-zinc-500">El salto ideal no tiene ancho finito.</p>}
            </div>
          </div>
        </div>

        {/* Analytic Metrics */}
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4 font-mono text-xs">
          <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Predicción Analítica Cuántica</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="text-zinc-400">Coef. de transmisión (<KaTeXRenderer math="T" />):</span>
              <span className="font-bold text-emerald-400 font-mono text-sm">{formatProbability(transmissionT)}</span>
            </div>
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="text-zinc-400">Coef. de reflexión (<KaTeXRenderer math="R" />):</span>
              <span className="font-bold text-rose-400 font-mono text-sm">{formatProbability(reflectionR)}</span>
            </div>
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="text-zinc-400">Unitaridad (<KaTeXRenderer math="R+T" />):</span>
              <span className="font-bold text-white">{(reflectionR + transmissionT).toFixed(3)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Régimen Físico:</span>
              <span className={`font-bold ${isBelowPotential && potentialType !== 'well' ? 'text-amber-400' : 'text-cyan-400'}`}>
                {regimeLabel}
              </span>
            </div>
          </div>

          {/* Educational callout */}
          <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 text-[11px] leading-relaxed text-zinc-300">
            {potentialType === 'barrier' && isBelowPotential ? (
              <span><strong>Tunelamiento cuántico:</strong> Clásicamente la partícula rebotaría con <KaTeXRenderer math={String.raw`R=1`} />. En mecánica cuántica, la función de onda penetra evanescentemente la barrera y una fracción finita <KaTeXRenderer math={String.raw`T>0`} /> emerge al otro lado.</span>
            ) : potentialType === 'step' && isBelowPotential ? (
              <span><strong>Escalón subumbral:</strong> En un escalón ideal semi-infinito con <KaTeXRenderer math={String.raw`E<V_0`} />, la solución a la derecha es evanescente y no transporta corriente: <KaTeXRenderer math={String.raw`T=0`} />.</span>
            ) : potentialType === 'well' ? (
              <span><strong>Pozo cuántico:</strong> La interferencia entre las dos fronteras produce resonancias; para ciertos valores de <KaTeXRenderer math={String.raw`k_2a`} />, la transmisión alcanza <KaTeXRenderer math={String.raw`T=1`} />.</span>
            ) : (
              <span><strong>Reflexión cuántica sobre-barrera:</strong> Aunque <KaTeXRenderer math={String.raw`E>V_0`} />, la discontinuidad del potencial puede causar una probabilidad no nula de reflexión <KaTeXRenderer math={String.raw`R>0`} />.</span>
            )}
          </div>
        </div>
      </div>

      <LaboratoryModel
        title="Dispersión estacionaria en potenciales unidimensionales"
        phenomenon="Las probabilidades de reflexión y transmisión se obtienen al imponer continuidad de la función de onda y de su derivada en cada frontera. La animación representa el reparto de un paquete compatible con esos coeficientes, no una integración numérica de la ecuación dependiente del tiempo."
        equations={[
          {
            label: 'Ecuación de partida',
            math: String.raw`-\frac{\hbar^2}{2m}\frac{d^2\psi}{dx^2}+V(x)\psi=E\psi`,
            explanation: 'Ecuación de Schrödinger independiente del tiempo para una partícula no relativista en una dimensión.',
          },
          {
            label: 'Barrera, E < V₀',
            math: String.raw`T=\left[1+\frac{V_0^2\sinh^2(\kappa a)}{4E(V_0-E)}\right]^{-1},\quad \kappa=\frac{\sqrt{2m(V_0-E)}}{\hbar}`,
            explanation: 'La solución dentro de una barrera finita es evanescente, pero la transmisión permanece distinta de cero.',
          },
          {
            label: 'Conservación de probabilidad',
            math: String.raw`R+T=1`,
            explanation: 'Para potenciales reales y estacionarios, los flujos reflejado y transmitido suman el flujo incidente.',
          },
        ]}
        assumptions="Partícula no relativista, una dimensión y potenciales constantes por tramos. El escalón es semi-infinito (por eso a no interviene); la barrera y el pozo tienen ancho finito a."
      />
    </div>
  );
}
