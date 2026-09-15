'use client';

import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, ChevronDown, ChevronUp, Zap, Thermometer } from 'lucide-react';
import { KaTeXRenderer } from '@/components/math/KaTeXRenderer';
import { MathMarkdown } from '@/components/math/MathMarkdown';

export function BlackbodySimulator() {
  const [temperature, setTemperature] = useState<number>(5800); // 5800 K (Sun surface)
  const [showRayleigh, setShowRayleigh] = useState<boolean>(true);
  const [showWien, setShowWien] = useState<boolean>(false);
  const [showPlanck, setShowPlanck] = useState<boolean>(true);
  const [showTheory, setShowTheory] = useState<boolean>(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Physical constants
  const h = 6.62607015e-34; // J s
  const c = 2.99792458e8; // m / s
  const kB = 1.380649e-23; // J / K
  const sigma = 5.670374419e-8; // W / (m^2 K^4)
  const bWien = 2.897771955e-3; // m K

  // Derived metrics
  const lambdaPeakNm = (bWien / temperature) * 1e9; // in nm
  const totalEmittance = sigma * Math.pow(temperature, 4); // W / m^2

    // Spectral radiance B_lambda in terms of wavelength lambda (in meters):
  // B(lambda, T) = (2 * h * c^2 / lambda^5) / (exp(h*c / (lambda * kB * T)) - 1)
  const planck = (lambdaM: number, T: number): number => {
    const exponent = (h * c) / (lambdaM * kB * T);
    if (exponent > 700) return 0; // prevent overflow
    return (2 * h * Math.pow(c, 2) / Math.pow(lambdaM, 5)) / (Math.exp(exponent) - 1);
  };

  // Rayleigh-Jeans Classical Approximation:
  // B_RJ(lambda, T) = (2 * c * kB * T) / lambda^4
  const rayleighJeans = (lambdaM: number, T: number): number => {
    return (2 * c * kB * T) / Math.pow(lambdaM, 4);
  };

  // Wien Approximation:
  // B_Wien(lambda, T) = (2 * h * c^2 / lambda^5) * exp(-h*c / (lambda * kB * T))
  const wien = (lambdaM: number, T: number): number => {
    const exponent = (h * c) / (lambdaM * kB * T);
    return (2 * h * Math.pow(c, 2) / Math.pow(lambdaM, 5)) * Math.exp(-exponent);
  };

  // Convert temperature to approximate blackbody RGB color
  const getBlackbodyColor = (T: number): string => {
    let r = 0, g = 0, b = 0;
    const temp = T / 100;
    if (temp <= 66) {
      r = 255;
      g = 99.4708025861 * Math.log(temp) - 161.1195681661;
      b = temp <= 19 ? 0 : 138.5177312231 * Math.log(temp - 10) - 305.0447927307;
    } else {
      r = 329.698727446 * Math.pow(temp - 60, -0.1332047592);
      g = 288.1221695283 * Math.pow(temp - 60, -0.0755148492);
      b = 255;
    }
    r = Math.min(255, Math.max(0, Math.round(r)));
    g = Math.min(255, Math.max(0, Math.round(g)));
    b = Math.min(255, Math.max(0, Math.round(b)));
    return `rgb(${r}, ${g}, ${b})`;
  };

  // Canvas drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high-DPI displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    // Padding for axes
    const padL = 65;
    const padR = 25;
    const padT = 30;
    const padB = 45;
    const plotW = width - padL - padR;
    const plotH = height - padT - padB;

    // Axes range: lambda from 100 nm to 2500 nm
    const minLambdaNm = 100;
    const maxLambdaNm = 2400;

    // Calculate maximum Planck radiance for scaling
    const peakPlanck = planck((bWien / temperature), temperature);
    const maxY = peakPlanck * 1.35;

    const toX = (lambdaNm: number) => padL + ((lambdaNm - minLambdaNm) / (maxLambdaNm - minLambdaNm)) * plotW;
    const toY = (val: number) => padT + plotH - (val / maxY) * plotH;

    // Visible Spectrum Band (380 nm to 750 nm)
    const visX1 = toX(380);
    const visX2 = toX(750);
    const visGrad = ctx.createLinearGradient(visX1, 0, visX2, 0);
    visGrad.addColorStop(0.0, 'rgba(138, 43, 226, 0.18)'); // Violet
    visGrad.addColorStop(0.2, 'rgba(0, 0, 255, 0.18)');   // Blue
    visGrad.addColorStop(0.4, 'rgba(0, 255, 0, 0.18)');   // Green
    visGrad.addColorStop(0.6, 'rgba(255, 255, 0, 0.18)'); // Yellow
    visGrad.addColorStop(0.8, 'rgba(255, 127, 0, 0.18)'); // Orange
    visGrad.addColorStop(1.0, 'rgba(255, 0, 0, 0.18)');   // Red

    ctx.fillStyle = visGrad;
    ctx.fillRect(visX1, padT, visX2 - visX1, plotH);

    // Grid lines
    ctx.strokeStyle = '#27272a';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);

    for (let l = 500; l <= 2000; l += 500) {
      const gx = toX(l);
      ctx.beginPath();
      ctx.moveTo(gx, padT);
      ctx.lineTo(gx, padT + plotH);
      ctx.stroke();

      ctx.fillStyle = '#64748b'; // slate-500
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${l} nm`, gx, padT + plotH + 18);
    }

    ctx.setLineDash([]);

    // Clip curve drawing strictly inside plot area to let Rayleigh-Jeans shoot straight into UV catastrophe
    ctx.save();
    ctx.beginPath();
    ctx.rect(padL, padT - 2, plotW, plotH + 4);
    ctx.clip();

    // Draw Rayleigh-Jeans Curve (Classical)
    if (showRayleigh) {
      ctx.beginPath();
      ctx.strokeStyle = '#f43f5e'; // rose-500
      ctx.lineWidth = 2.5;
      let first = true;
      for (let l = minLambdaNm; l <= maxLambdaNm; l += 15) {
        const val = rayleighJeans(l * 1e-9, temperature);
        const x = toX(l);
        const y = toY(val);
        if (first) {
          ctx.moveTo(x, y);
          first = false;
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    }

    // Draw Wien Approximation Curve
    if (showWien) {
      ctx.beginPath();
      ctx.strokeStyle = '#a855f7'; // purple-500
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 3]);
      let first = true;
      for (let l = minLambdaNm; l <= maxLambdaNm; l += 15) {
        const val = wien(l * 1e-9, temperature);
        const x = toX(l);
        const y = toY(val);
        if (first) {
          ctx.moveTo(x, y);
          first = false;
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw Planck Law (Quantum Curve)
    if (showPlanck) {
      // Shaded area under Planck curve
      ctx.beginPath();
      ctx.moveTo(toX(minLambdaNm), padT + plotH);
      for (let l = minLambdaNm; l <= maxLambdaNm; l += 10) {
        const val = planck(l * 1e-9, temperature);
        ctx.lineTo(toX(l), toY(val));
      }
      ctx.lineTo(toX(maxLambdaNm), padT + plotH);
      ctx.closePath();

      const fillGrad = ctx.createLinearGradient(0, padT, 0, padT + plotH);
      fillGrad.addColorStop(0, 'rgba(6, 182, 212, 0.35)'); // cyan-500
      fillGrad.addColorStop(1, 'rgba(6, 182, 212, 0.02)');
      ctx.fillStyle = fillGrad;
      ctx.fill();

      // Curve line
      ctx.beginPath();
      ctx.strokeStyle = '#06b6d4'; // cyan-500
      ctx.lineWidth = 3;
      for (let l = minLambdaNm; l <= maxLambdaNm; l += 10) {
        const val = planck(l * 1e-9, temperature);
        const x = toX(l);
        const y = toY(val);
        if (l === minLambdaNm) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Peak Wavelength Marker (Wien's Law)
    if (lambdaPeakNm >= minLambdaNm && lambdaPeakNm <= maxLambdaNm) {
      const px = toX(lambdaPeakNm);
      const py = toY(peakPlanck);

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(px, padT);
      ctx.lineTo(px, padT + plotH);
      ctx.stroke();
      ctx.setLineDash([]);

      // Peak dot
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 10px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`λ_max = ${Math.round(lambdaPeakNm)} nm`, px, py - 10);
    }

    ctx.restore();

    // Axes
    ctx.strokeStyle = '#475569'; // slate-600
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(padL, padT);
    ctx.lineTo(padL, padT + plotH);
    ctx.lineTo(padL + plotW, padT + plotH);
    ctx.stroke();

    // Axis Labels
    ctx.fillStyle = '#94a3b8'; // slate-400
    ctx.font = '11px Plus Jakarta Sans, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Longitud de Onda λ (nm)', padL + plotW / 2, height - 10);

    ctx.save();
    ctx.translate(18, padT + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Radiancia espectral Bλ(λ, T) [W·sr⁻¹·m⁻³]', 0, 0);
    ctx.restore();
  }, [temperature, showRayleigh, showWien, showPlanck, lambdaPeakNm]);

  return (
    <div className="rounded-3xl border border-zinc-800 bg-black p-5 sm:p-7 space-y-6 text-zinc-100 shadow-2xl">
      {/* Simulator Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            Laboratorio Interactivo • IF411
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-white mt-1">
            Simulador de Radiación de Cuerpo Negro & Catástrofe Ultravioleta
          </h3>
          <div className="text-xs text-zinc-400 mt-1 max-w-2xl">
            <MathMarkdown inline content="Compara la radiancia espectral $B_\\lambda(\\lambda,T)$ de Planck con los límites clásico de Rayleigh-Jeans y de Wien." />
          </div>
        </div>

        {/* Dynamic Color Swatch */}
        <div className="flex items-center gap-3 px-3.5 py-2 rounded-2xl bg-zinc-950 border border-zinc-800">
          <div
            className="w-7 h-7 rounded-full shadow-lg border border-white/30 transition-colors"
            style={{ backgroundColor: getBlackbodyColor(temperature) }}
          />
          <div className="text-xs font-mono">
            <span className="text-zinc-500 text-[10px] block">Temperatura</span>
            <span className="font-bold text-white">{temperature} K</span>
          </div>
        </div>
      </div>

      {/* Main Canvas Viewport */}
      <div className="relative rounded-2xl border border-zinc-800 bg-black overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-[320px] sm:h-[380px] block cursor-crosshair"
        />

        {/* Floating Legend */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 p-3 rounded-xl bg-black/90 border border-zinc-700 backdrop-blur-md text-[11px] font-mono">
          <label className="flex items-center gap-2 cursor-pointer hover:text-cyan-300">
            <input
              type="checkbox"
              checked={showPlanck}
              onChange={(e) => setShowPlanck(e.target.checked)}
              className="accent-cyan-500 rounded"
            />
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />
            <span>Ley de Planck (Cuántica)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer hover:text-rose-300">
            <input
              type="checkbox"
              checked={showRayleigh}
              onChange={(e) => setShowRayleigh(e.target.checked)}
              className="accent-rose-500 rounded"
            />
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
            <span>Rayleigh-Jeans (Divergente)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer hover:text-purple-300">
            <input
              type="checkbox"
              checked={showWien}
              onChange={(e) => setShowWien(e.target.checked)}
              className="accent-purple-500 rounded"
            />
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" />
            <span>Aprox. de Wien</span>
          </label>
        </div>
      </div>

      {/* Controls & Metrics Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Slider */}
        <div className="md:col-span-2 space-y-4 p-5 rounded-2xl bg-zinc-950 border border-zinc-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-200">
              <Thermometer className="w-4 h-4 text-cyan-400" />
              <span>Temperatura Absoluta del Cuerpo Negro (T)</span>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-black text-cyan-400 font-mono text-sm font-bold border border-zinc-700">
              {temperature.toLocaleString()} K
            </span>
          </div>

          <input
            type="range"
            min="1000"
            max="10000"
            step="50"
            value={temperature}
            onChange={(e) => setTemperature(Number(e.target.value))}
            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] font-mono text-zinc-500">Referencias:</span>
            {[
              { label: 'Filamento (2800 K)', t: 2800 },
              { label: 'Superficie Solar (5800 K)', t: 5800 },
              { label: 'Estrella Sirio (9940 K)', t: 9940 },
            ].map((p) => (
              <button
                key={p.t}
                type="button"
                onClick={() => setTemperature(p.t)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer border ${
                  temperature === p.t
                    ? 'bg-cyan-600 text-white border-cyan-400'
                    : 'bg-black text-zinc-300 border-zinc-700 hover:bg-zinc-800'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Numerical Output Card */}
        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3 font-mono text-xs">
          <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            <span>Predicciones Físicas</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <span className="text-zinc-500">Pico de Wien:</span>
              <span className="font-bold text-white">{Math.round(lambdaPeakNm)} nm</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <span className="text-zinc-500">Región del pico:</span>
              <span className="font-semibold text-cyan-300">
                {lambdaPeakNm < 380 ? 'Ultravioleta' : lambdaPeakNm <= 750 ? 'Visible' : 'Infrarrojo'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500">Emisión total:</span>
              <span className="font-bold text-emerald-400">
                {(totalEmittance / 1e6).toFixed(2)} MW/m²
              </span>
            </div>
          </div>
        </div>
      </div>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-950">
        <button type="button" onClick={() => setShowTheory((value) => !value)} className="w-full flex items-center justify-between gap-3 p-5 text-left cursor-pointer">
          <span className="flex items-center gap-2 text-sm font-semibold text-zinc-100"><BookOpen className="w-4 h-4 text-cyan-400" />Fundamento físico y lectura del experimento</span>
          {showTheory ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
        </button>
        {showTheory && <div className="border-t border-zinc-800 p-5 grid gap-5 lg:grid-cols-2 text-sm text-zinc-300 leading-relaxed">
          <div className="space-y-3">
            <h4 className="font-semibold text-cyan-300">1. Principio del cuerpo negro</h4>
            <MathMarkdown content="Una cavidad en equilibrio térmico emite una distribución espectral determinada solo por la temperatura $T$. Planck cuantizó la energía de los osciladores y obtuvo:" />
            <KaTeXRenderer block math="B_\\lambda(\\lambda,T)=\\frac{2hc^2}{\\lambda^5}\\frac{1}{e^{hc/(\\lambda k_BT)}-1}" className="text-cyan-100" />
            <p>La curva cian es esta radiancia espectral. Su área crece al aumentar la temperatura.</p>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-cyan-300">2. Qué comparar</h4>
            <MathMarkdown content="La curva roja usa el límite clásico $B_\\lambda\\approx2ck_BT/\\lambda^4$, válido para longitudes de onda grandes; falla en el ultravioleta. La curva violeta usa Wien, válida cuando $hc/(\\lambda k_BT)\\gg1$." />
            <KaTeXRenderer block math="\\lambda_{\\max}T=b\\approx2.898\\times10^{-3}\\ \\mathrm{m\\,K}" className="text-cyan-100" />
            <MathMarkdown content="Sube $T$: el pico se desplaza a menor $\\lambda$ y la emisión total aumenta como $\\sigma T^4$." />
          </div>
          <div className="lg:col-span-2 rounded-xl bg-black border border-zinc-800 p-4 text-xs text-zinc-400">
            <strong className="text-zinc-200">Convención:</strong> el gráfico representa <MathMarkdown inline content="$B_\\lambda$" />, radiancia por longitud de onda. No es la densidad de energía <MathMarkdown inline content="$u_\\nu$" /> usada en algunas deducciones; en vacío, <MathMarkdown inline content="$u_\\lambda=4\\pi B_\\lambda/c$" />.
          </div>
        </div>}
      </section>
    </div>
  );
}
