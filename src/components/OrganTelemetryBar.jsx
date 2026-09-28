import React, { useEffect, useRef } from 'react';
import {
  Heart,
  Brain,
  Wind,
  Dna,
  Activity,
  Zap,
  Gauge,
  Sliders,
  Sparkles
} from 'lucide-react';
import { TRANSLATIONS } from '../i18n/translations';

export default function OrganTelemetryBar({
  organType = 'HEART',
  heartBpm = 72,
  onHeartBpmChange,
  brainWaveMode = 'Beta',
  onBrainWaveModeChange,
  lungBreathRate = 16,
  onLungBreathRateChange,
  dnaUnwind = 0,
  onDnaUnwindToggle,
  theme = 'dark',
  language = 'en'
}) {
  const canvasRef = useRef(null);
  const isLight = theme === 'light';

  const t = TRANSLATIONS[language]?.telemetry || TRANSLATIONS.en.telemetry;
  const organLabel = TRANSLATIONS[language]?.organs[organType]?.label || organType;

  // Live waveform animation on small HUD canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let offset = 0;

    const drawWave = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      offset += 1.5;

      const w = canvas.width;
      const h = canvas.height;
      const midY = h / 2;

      ctx.lineWidth = 2;

      if (organType === 'HEART') {
        // Draw ECG Cardiac P-Q-R-S-T wave
        ctx.strokeStyle = '#ff2d55';
        ctx.shadowColor = '#ff2d55';
        ctx.shadowBlur = 8;
        ctx.beginPath();

        const period = 120;
        for (let x = 0; x < w; x++) {
          const tVal = (x + offset) % period;
          let y = midY;

          if (tVal > 20 && tVal < 35) {
            // P-wave
            y -= Math.sin(((tVal - 20) / 15) * Math.PI) * 7;
          } else if (tVal >= 45 && tVal < 48) {
            // Q dip
            y += 4;
          } else if (tVal >= 48 && tVal < 54) {
            // R spike
            y -= 24;
          } else if (tVal >= 54 && tVal < 58) {
            // S dip
            y += 8;
          } else if (tVal > 70 && tVal < 95) {
            // T-wave
            y -= Math.sin(((tVal - 70) / 25) * Math.PI) * 11;
          }

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      } else if (organType === 'BRAIN') {
        // Draw EEG neural wave
        ctx.strokeStyle = '#c084fc';
        ctx.shadowColor = '#c084fc';
        ctx.shadowBlur = 8;
        ctx.beginPath();

        const freq = brainWaveMode === 'Gamma' ? 0.25 : brainWaveMode === 'Alpha' ? 0.08 : brainWaveMode === 'Theta' ? 0.04 : 0.15;
        for (let x = 0; x < w; x++) {
          const y = midY + Math.sin((x + offset) * freq) * 10 + Math.sin((x + offset) * freq * 2.3) * 6;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      } else if (organType === 'LUNGS') {
        // Draw Spirometer respiratory wave
        ctx.strokeStyle = '#06b6d4';
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 8;
        ctx.beginPath();

        for (let x = 0; x < w; x++) {
          const y = midY + Math.sin((x + offset) * 0.035) * 14;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      } else {
        // General Biotech telemetry sine pulse
        ctx.strokeStyle = '#00f0ff';
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        for (let x = 0; x < w; x++) {
          const y = midY + Math.sin((x + offset) * 0.05) * 8;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      ctx.shadowBlur = 0;
      animId = requestAnimationFrame(drawWave);
    };

    drawWave();
    return () => cancelAnimationFrame(animId);
  }, [organType, brainWaveMode, heartBpm]);

  return (
    <div className={`backdrop-blur-xl rounded-2xl p-3 shadow-2xl text-xs font-mono select-none flex flex-col gap-2.5 max-w-sm sm:max-w-md w-full border ${
      isLight ? 'bg-white/90 border-slate-200 text-slate-800' : 'bg-slate-950/80 border-slate-800/80 text-slate-200'
    }`}>
      {/* Header & Waveform HUD */}
      <div className={`flex items-center justify-between gap-2 border-b pb-2 ${isLight ? 'border-slate-200' : 'border-slate-800/60'}`}>
        <div className="flex items-center gap-2">
          {organType === 'HEART' && <Heart className="w-4 h-4 text-rose-500 animate-pulse" />}
          {organType === 'BRAIN' && <Brain className="w-4 h-4 text-purple-500 animate-pulse" />}
          {organType === 'LUNGS' && <Wind className="w-4 h-4 text-cyan-500 animate-pulse" />}
          {organType === 'DNA' && <Dna className="w-4 h-4 text-cyan-500" />}
          {organType === 'VISCERAL' && <Activity className="w-4 h-4 text-amber-500" />}

          <span className={`font-bold tracking-wider uppercase font-['Orbitron'] ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
            {organLabel} {t.titleSuffix}
          </span>
        </div>

        {/* Live Mini Oscilloscope Waveform */}
        <div className="relative rounded-lg bg-black/85 border border-slate-800 px-1 py-0.5 overflow-hidden">
          <canvas ref={canvasRef} width={120} height={32} className="block" />
        </div>
      </div>

      {/* Dynamic Telemetry Metrics & Sliders */}
      {organType === 'HEART' && (
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
            <div className={`p-1.5 rounded-lg border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
              <span className={`block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{t.heart.pulseRate}</span>
              <span className="text-rose-500 font-bold text-sm">{heartBpm} BPM</span>
            </div>
            <div className={`p-1.5 rounded-lg border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
              <span className={`block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{t.heart.bloodPress}</span>
              <span className={`${isLight ? 'text-emerald-600' : 'text-emerald-400'} font-bold text-sm`}>120/80</span>
            </div>
            <div className={`p-1.5 rounded-lg border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
              <span className={`block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{t.heart.output}</span>
              <span className={`${isLight ? 'text-sky-600' : 'text-sky-400'} font-bold text-sm`}>{(heartBpm * 0.07).toFixed(1)} L/m</span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1 text-[11px]">
            <span className={`whitespace-nowrap ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>{t.heart.bpmSlider}</span>
            <input
              type="range"
              min="45"
              max="160"
              value={heartBpm}
              onChange={(e) => onHeartBpmChange && onHeartBpmChange(Number(e.target.value))}
              className={`w-full accent-rose-500 cursor-pointer h-1.5 rounded-lg ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`}
            />
          </div>
        </div>
      )}

      {organType === 'BRAIN' && (
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
            <div className={`p-1.5 rounded-lg border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
              <span className={`block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{t.brain.frequency}</span>
              <span className={`${isLight ? 'text-purple-700' : 'text-purple-400'} font-bold text-sm`}>
                {brainWaveMode === 'Gamma' ? '40 Hz' : brainWaveMode === 'Alpha' ? '10 Hz' : brainWaveMode === 'Theta' ? '6 Hz' : '20 Hz'}
              </span>
            </div>
            <div className={`p-1.5 rounded-lg border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
              <span className={`block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{t.brain.neurons}</span>
              <span className={`${isLight ? 'text-indigo-700' : 'text-indigo-300'} font-bold text-sm`}>{t.brain.neuronsValue}</span>
            </div>
            <div className={`p-1.5 rounded-lg border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
              <span className={`block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{t.brain.synapseLoad}</span>
              <span className={`${isLight ? 'text-cyan-700' : 'text-cyan-400'} font-bold text-sm`}>
                {brainWaveMode === 'Gamma' ? '92%' : brainWaveMode === 'Beta' ? '74%' : '38%'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 pt-1 text-[10px]">
            <span className={`mr-1 ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>{t.brain.rhythm}</span>
            {['Theta', 'Alpha', 'Beta', 'Gamma'].map((mode) => (
              <button
                key={mode}
                onClick={() => onBrainWaveModeChange && onBrainWaveModeChange(mode)}
                className={`px-2 py-1 rounded-md border transition-all cursor-pointer ${
                  brainWaveMode === mode
                    ? isLight
                      ? 'bg-purple-100 border-purple-500 text-purple-900 font-bold shadow-sm'
                      : 'bg-purple-950/80 border-purple-500 text-purple-300 shadow-[0_0_10px_rgba(192,132,252,0.3)] font-bold'
                    : isLight
                      ? 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      )}

      {organType === 'LUNGS' && (
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
            <div className={`p-1.5 rounded-lg border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
              <span className={`block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{t.lungs.breathRate}</span>
              <span className={`${isLight ? 'text-cyan-700' : 'text-cyan-400'} font-bold text-sm`}>
                {lungBreathRate} {t.lungs.breathRateUnit}
              </span>
            </div>
            <div className={`p-1.5 rounded-lg border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
              <span className={`block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{t.lungs.spo2}</span>
              <span className={`${isLight ? 'text-emerald-700' : 'text-emerald-400'} font-bold text-sm`}>99%</span>
            </div>
            <div className={`p-1.5 rounded-lg border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
              <span className={`block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{t.lungs.tidalVol}</span>
              <span className={`${isLight ? 'text-sky-700' : 'text-sky-400'} font-bold text-sm`}>500 mL</span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1 text-[11px]">
            <span className={`whitespace-nowrap ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>{t.lungs.breathSpeed}</span>
            <input
              type="range"
              min="10"
              max="32"
              value={lungBreathRate}
              onChange={(e) => onLungBreathRateChange && onLungBreathRateChange(Number(e.target.value))}
              className={`w-full accent-cyan-500 cursor-pointer h-1.5 rounded-lg ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`}
            />
          </div>
        </div>
      )}

      {organType === 'DNA' && (
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
            <div className={`p-1.5 rounded-lg border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
              <span className={`block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{t.dna.basePairs}</span>
              <span className={`${isLight ? 'text-cyan-700' : 'text-cyan-400'} font-bold text-sm`}>{t.dna.basePairsValue}</span>
            </div>
            <div className={`p-1.5 rounded-lg border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
              <span className={`block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{t.dna.helixPitch}</span>
              <span className={`${isLight ? 'text-emerald-700' : 'text-emerald-400'} font-bold text-sm`}>3.4 nm</span>
            </div>
            <div className={`p-1.5 rounded-lg border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
              <span className={`block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{t.dna.stabilityTm}</span>
              <span className={`${isLight ? 'text-amber-700' : 'text-amber-400'} font-bold text-sm`}>78.4°C</span>
            </div>
          </div>

          <button
            onClick={onDnaUnwindToggle}
            className={`w-full mt-1 flex items-center justify-center gap-2 py-1.5 rounded-xl border text-xs cursor-pointer shadow-md transition-all font-semibold ${
              isLight
                ? 'bg-cyan-50 border-cyan-300 text-cyan-800 hover:bg-cyan-100'
                : 'bg-cyan-950/50 border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
            <span>{t.dna.uncoilBtn}</span>
          </button>
        </div>
      )}

      {organType === 'VISCERAL' && (
        <div className="space-y-2">
          <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
            <div className={`p-1.5 rounded-lg border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
              <span className={`block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{t.visceral.renalGfr}</span>
              <span className={`${isLight ? 'text-amber-700' : 'text-amber-400'} font-bold text-sm`}>125 mL/m</span>
            </div>
            <div className={`p-1.5 rounded-lg border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
              <span className={`block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{t.visceral.gastricPh}</span>
              <span className="text-rose-500 font-bold text-sm">1.8 pH</span>
            </div>
            <div className={`p-1.5 rounded-lg border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'}`}>
              <span className={`block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{t.visceral.liverFlow}</span>
              <span className={`${isLight ? 'text-sky-700' : 'text-sky-400'} font-bold text-sm`}>1.45 L/m</span>
            </div>
          </div>

          <div className={`text-[11px] text-center pt-1 font-['Rajdhani'] ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
            {t.visceral.activeNote}
          </div>
        </div>
      )}
    </div>
  );
}
