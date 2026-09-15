'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Activity, ShieldAlert, Sparkles } from 'lucide-react';

export function ComptonSimulator() {
  const [thetaDeg, setThetaDeg] = useState<number>(90); // 90 degrees
  const [lambdaIncidentPm, setLambdaIncidentPm] = useState<number>(20); // 20 pm (X-ray)
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  // Physical constants
  const h = 6.62607015e-34; // J s
  const c = 2.99792458e8; // m / s
  const m_e = 9.1093837e-31; // kg
  const eV = 1.602176634e-19; // J
  const lambdaC_pm = 2.42631023867; // pm (Compton wavelength of electron)
  const electronRestEnergyKeV = 510.99895; // keV (m_e * c^2)

  // Calculations
  const thetaRad = (thetaDeg * Math.PI) / 180;
  const deltaLambdaPm = lambdaC_pm * (1 - Math.cos(thetaRad)); // pm
  const lambdaScatteredPm = lambdaIncidentPm + deltaLambdaPm; // pm

  // Energies in keV
  const eIncidentKeV = (1239.841984 / (lambdaIncidentPm * 1e-3)); // keV (hc / lambda)
  const eScatteredKeV = (1239.841984 / (lambdaScatteredPm * 1e-3)); // keV
  const electronKineticKeV = eIncidentKeV - eScatteredKeV; // keV

  // Electron recoil angle phi
  // cot(phi) = (1 + alpha) * tan(theta/2) where alpha = h*nu / (m_e * c^2)
  const alpha = eIncidentKeV / electronRestEnergyKeV;
  let phiDeg = 0;
  if (thetaDeg > 0 && thetaDeg < 180) {
    const cotPhi = (1 + alpha) * Math.tan(thetaRad / 2);
    phiDeg = (Math.atan(1 / cotPhi) * 180) / Math.PI;
  } else if (thetaDeg === 180) {
    phiDeg = 0; // electron recoils straight forward
  } else {
    phiDeg = 90;
  }
  const phiRad = (phiDeg * Math.PI) / 180;

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
        timeRef.current += dt * 1.5;
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

      // Dark background
      ctx.fillStyle = '#050508';
      ctx.fillRect(0, 0, w, h);

      // Grid
      ctx.strokeStyle = '#121624';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      const centerX = w * 0.42;
      const centerY = h * 0.52;

      // Draw Coordinates Axes at Collision Point
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      // X axis (incident direction)
      ctx.beginPath();
      ctx.moveTo(30, centerY);
      ctx.lineTo(w - 30, centerY);
      ctx.stroke();
      // Y axis
      ctx.beginPath();
      ctx.moveTo(centerX, 20);
      ctx.lineTo(centerX, h - 20);
      ctx.stroke();
      ctx.setLineDash([]);

      // Angular Arcs for theta and phi
      ctx.save();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 55, -thetaRad, 0, false);
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`θ = ${thetaDeg}°`, centerX + 65, centerY - 15);

      if (thetaDeg > 0 && thetaDeg < 180) {
        ctx.strokeStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 45, 0, phiRad, false);
        ctx.stroke();

        ctx.fillStyle = '#f59e0b';
        ctx.fillText(`φ = ${phiDeg.toFixed(1)}°`, centerX + 55, centerY + 22);
      }
      ctx.restore();

      // Cycle animation
      const cycleTime = 4.0; // seconds
      const cycleProgress = (timeRef.current % cycleTime) / cycleTime; // 0 to 1

      // Speed of photon (pixels per second)
      const vPhoton = 180;
      const tImpact = 0.4; // fraction of cycle when impact occurs

      if (cycleProgress < tImpact) {
        // Incident Photon approaching target
        const travelProgress = cycleProgress / tImpact;
        const photonX = 40 + travelProgress * (centerX - 40);
        const photonY = centerY;

        // Draw approaching wave packet
        ctx.save();
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let x = photonX - 50; x <= photonX; x += 2) {
          const wave = Math.sin((x - photonX) * 0.4) * 8 * Math.exp(-Math.pow((x - photonX + 25) / 18, 2));
          if (x === photonX - 50) ctx.moveTo(x, centerY + wave);
          else ctx.lineTo(x, centerY + wave);
        }
        ctx.stroke();

        // Photon particle lead dot
        ctx.fillStyle = '#38bdf8';
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(photonX, photonY, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Target electron resting at center
        ctx.save();
        ctx.fillStyle = '#3b82f6';
        ctx.shadowColor = '#2563eb';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 7, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('Electrón e⁻ (en reposo)', centerX, centerY + 22);
        ctx.restore();
      } else {
        // Post-collision: scattered photon and recoil electron
        const afterImpact = (cycleProgress - tImpact) / (1 - tImpact);

        // Scattered photon trajectory (angle -theta in canvas coordinates, upward)
        const distPhoton = afterImpact * (w * 0.55);
        const photX = centerX + distPhoton * Math.cos(-thetaRad);
        const photY = centerY + distPhoton * Math.sin(-thetaRad);

        // Recoil electron trajectory (angle +phi in canvas coordinates, downward)
        const distElectron = afterImpact * (w * 0.38);
        const elecX = centerX + distElectron * Math.cos(phiRad);
        const elecY = centerY + distElectron * Math.sin(phiRad);

        // Collision shockwave burst at center
        const shockRadius = afterImpact * 35;
        ctx.save();
        ctx.strokeStyle = `rgba(245, 158, 11, ${Math.max(0, 0.6 - afterImpact * 1.5)})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, shockRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // Draw scattered photon (longer wavelength => lower frequency, cyan-indigo)
        ctx.save();
        ctx.strokeStyle = '#818cf8';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        const numWavePts = 25;
        for (let i = 0; i <= numWavePts; i++) {
          const s = (i / numWavePts) * 50;
          const px = photX - s * Math.cos(-thetaRad);
          const py = photY - s * Math.sin(-thetaRad);
          const wave = Math.sin(s * 0.25) * 8;
          const perpX = -Math.sin(-thetaRad) * wave;
          const perpY = Math.cos(-thetaRad) * wave;
          if (i === 0) ctx.moveTo(px + perpX, py + perpY);
          else ctx.lineTo(px + perpX, py + perpY);
        }
        ctx.stroke();

        ctx.fillStyle = '#a5b4fc';
        ctx.shadowColor = '#6366f1';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(photX, photY, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#c7d2fe';
        ctx.font = 'bold 10px monospace';
        ctx.fillText(`Fotón dispersado (λ' = ${lambdaScatteredPm.toFixed(2)} pm)`, photX + 10, photY - 6);
        ctx.restore();

        // Draw recoil electron
        ctx.save();
        ctx.fillStyle = '#f59e0b';
        ctx.shadowColor = '#d97706';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(elecX, elecY, 7, 0, Math.PI * 2);
        ctx.fill();

        // Electron motion trajectory line
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(elecX, elecY);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#fde68a';
        ctx.font = 'bold 10px monospace';
        ctx.fillText(`Electrón de retroceso (K_e = ${electronKineticKeV.toFixed(1)} keV)`, elecX + 12, elecY + 14);
        ctx.restore();
      }

      // Live Relativistic Momentum Triangle (Top-Right HUD)
      const hudW = 200;
      const hudH = 140;
      const hudX = w - hudW - 25;
      const hudY = 25;

      ctx.save();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(hudX, hudY, hudW, hudH, 12);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('Conservación del Momento p⃗', hudX + 12, hudY + 20);

      // Draw Vector Triangle: p = p' + p_e
      const triStartX = hudX + 25;
      const triStartY = hudY + 85;
      const pScale = 1.4;
      const lenP = Math.min(100, (100 / lambdaIncidentPm) * 16);
      const lenPPrime = lenP * (lambdaIncidentPm / lambdaScatteredPm);

      // p_incident (horizontal right)
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(triStartX, triStartY);
      ctx.lineTo(triStartX + lenP, triStartY);
      ctx.stroke();

      // Arrow head for p
      ctx.fillStyle = '#06b6d4';
      ctx.beginPath();
      ctx.moveTo(triStartX + lenP, triStartY);
      ctx.lineTo(triStartX + lenP - 5, triStartY - 3);
      ctx.lineTo(triStartX + lenP - 5, triStartY + 3);
      ctx.fill();

      // p_scattered (at angle -theta from triStartX)
      const pPrimeEndX = triStartX + lenPPrime * Math.cos(-thetaRad);
      const pPrimeEndY = triStartY + lenPPrime * Math.sin(-thetaRad);

      ctx.strokeStyle = '#818cf8';
      ctx.beginPath();
      ctx.moveTo(triStartX, triStartY);
      ctx.lineTo(pPrimeEndX, pPrimeEndY);
      ctx.stroke();

      // p_electron (closes the triangle from pPrimeEnd to pEnd)
      ctx.strokeStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(pPrimeEndX, pPrimeEndY);
      ctx.lineTo(triStartX + lenP, triStartY);
      ctx.stroke();

      ctx.fillStyle = '#06b6d4';
      ctx.fillText('p⃗', triStartX + lenP / 2, triStartY + 14);
      ctx.fillStyle = '#818cf8';
      ctx.fillText("p⃗'", triStartX + 8, triStartY - 16);
      ctx.fillStyle = '#f59e0b';
      ctx.fillText('p⃗_e', triStartX + lenP - 15, triStartY - 16);
      ctx.restore();

      ctx.restore();
      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [thetaDeg, lambdaIncidentPm, isPlaying, thetaRad, phiRad, phiDeg, lambdaScatteredPm, electronKineticKeV]);

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 space-y-6 text-zinc-100 shadow-2xl">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Cinemática Relativista • Arthur Compton 1923
            </span>
            <span className="text-xs text-zinc-400 font-mono">Nobel de Física 1927</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mt-1.5">
            Simulador de Dispersión Compton Fotón-Electrón
          </h3>
          <p className="text-sm text-zinc-400 mt-1 max-w-3xl">
            Colisión elástica relativista entre un fotón de rayos X y un electrón libre en reposo. Comprueba el corrimiento $\Delta\lambda = \lambda_c (1 - \cos\theta)$ independiente del material.
          </p>
        </div>

        {/* Play/Pause/Reset Controls */}
        <div className="flex items-center gap-2">
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
            title="Reiniciar colisión"
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
      </div>

      {/* Controls & Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {/* Angle & Wavelength Sliders */}
        <div className="lg:col-span-2 space-y-5 p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800">
          {/* Angle Preset Buttons */}
          <div>
            <span className="text-xs font-semibold text-zinc-300 block mb-2">
              Ángulos Canónicos de Dispersión ($\theta$):
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { label: '0° (Sin desviación)', val: 0 },
                { label: '45° (Hacia adelante)', val: 45 },
                { label: '90° (Ortogonal)', val: 90 },
                { label: '135° (Oblicuo)', val: 135 },
                { label: '180° (Retrodispersión)', val: 180 },
              ].map((p) => (
                <button
                  key={p.val}
                  type="button"
                  onClick={() => setThetaDeg(p.val)}
                  className={`p-2.5 rounded-xl text-xs font-mono transition-all border cursor-pointer text-center ${
                    thetaDeg === p.val
                      ? 'bg-cyan-600 text-white border-cyan-400 shadow-md font-bold'
                      : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Scattering Angle Slider */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-300 font-medium">Ángulo de Deflexión del Fotón $\theta$ (°):</span>
              <span className="font-mono font-bold text-cyan-400">{thetaDeg}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="180"
              step="1"
              value={thetaDeg}
              onChange={(e) => setThetaDeg(Number(e.target.value))}
              className="w-full h-2.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>

          {/* Incident Photon Wavelength Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-300 font-medium">Longitud de Onda Incidente $\lambda$ (pm):</span>
              <span className="font-mono font-bold text-cyan-400">
                {lambdaIncidentPm.toFixed(1)} pm ({eIncidentKeV.toFixed(1)} keV)
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="80"
              step="1"
              value={lambdaIncidentPm}
              onChange={(e) => setLambdaIncidentPm(Number(e.target.value))}
              className="w-full h-2.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
              <span>5 pm (Rayos Gamma)</span>
              <span>20 pm (Rayos X Duros)</span>
              <span>80 pm (Rayos X Blandos)</span>
            </div>
          </div>
        </div>

        {/* Relativistic Mechanics Card */}
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4 font-mono text-xs">
          <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Resultados Relativistas</span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="text-zinc-400">Corrimiento ($\Delta\lambda$):</span>
              <span className="font-bold text-emerald-400 font-mono">+{deltaLambdaPm.toFixed(3)} pm</span>
            </div>
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="text-zinc-400">Longitud Dispersada ($\lambda^\prime$):</span>
              <span className="font-bold text-white">{lambdaScatteredPm.toFixed(3)} pm</span>
            </div>
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="text-zinc-400">Energía Fotón Dispersado ($E^\prime$):</span>
              <span className="font-bold text-cyan-300">{eScatteredKeV.toFixed(2)} keV</span>
            </div>
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <span className="text-zinc-400">Energía Cinética Electrón ($K_e$):</span>
              <span className="font-bold text-amber-400">{electronKineticKeV.toFixed(2)} keV</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Ángulo de Retroceso Electrón ($\phi$):</span>
              <span className="font-bold text-amber-300">{phiDeg.toFixed(1)}°</span>
            </div>
          </div>

          {/* Educational Note */}
          <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 text-[11px] leading-relaxed text-zinc-300">
            <span><strong>Retrodispersión Máxima:</strong> A θ = 180°, el corrimiento alcanza su valor límite Δλ = 2λ_c = 4.85 pm y el electrón absorbe la máxima transferencia de momento.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
