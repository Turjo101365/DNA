import React, { useState } from 'react';
import {
  Hand,
  Minimize2,
  Lock,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Radio,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { GESTURES } from '../handTracking/gestureDetector';

export default function GestureStatus({
  currentGesture = GESTURES.NONE,
  confidence = 0,
  handsCount = 0,
  isCameraActive = true,
  activeOrgan = 'HEART'
}) {
  const [isGuideOpen, setIsGuideOpen] = useState(true);

  // Organ-specific signature actions triggered by Peace gesture
  const organPeaceAction = {
    HEART: 'Cardiac Surge / Tachycardia Pulse Boost',
    BRAIN: 'Cycle Brainwave Rhythm (Alpha/Beta/Gamma)',
    LUNGS: 'Deep Inspiratory Tidal Expansion',
    VISCERAL: 'Trigger Gastric Motility Peristalsis',
    DNA: 'Uncoil Double Helix into Flat Ladder'
  }[activeOrgan] || 'Trigger Signature Organ Mode';

  const GESTURE_CONFIG = {
    [GESTURES.NONE]: {
      label: 'NO GESTURE DETECTED',
      action: 'Show hand to webcam to interact',
      icon: Radio,
      color: 'border-slate-700/60 bg-slate-900/60 text-slate-400',
      accent: 'bg-slate-500'
    },
    [GESTURES.OPEN_PALM]: {
      label: 'OPEN PALM',
      action: `Rotate & Pan 3D ${activeOrgan} in Space`,
      icon: Hand,
      color: 'border-cyan-500/60 bg-cyan-950/40 text-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.25)]',
      accent: 'bg-cyan-400'
    },
    [GESTURES.PINCH]: {
      label: 'PINCH / SPREAD',
      action: 'Dynamic Optical Zoom & Deep Tissue Inspect',
      icon: Minimize2,
      color: 'border-fuchsia-500/60 bg-fuchsia-950/40 text-fuchsia-300 shadow-[0_0_20px_rgba(255,0,128,0.25)]',
      accent: 'bg-fuchsia-400'
    },
    [GESTURES.FIST]: {
      label: 'CLOSED FIST',
      action: 'Orientation Locked (Frozen)',
      icon: Lock,
      color: 'border-amber-500/60 bg-amber-950/40 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.25)]',
      accent: 'bg-amber-400'
    },
    [GESTURES.PEACE]: {
      label: 'PEACE SIGN',
      action: organPeaceAction,
      icon: Sparkles,
      color: 'border-emerald-500/60 bg-emerald-950/40 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.25)]',
      accent: 'bg-emerald-400'
    },
    [GESTURES.POINT]: {
      label: 'POINTING',
      action: 'Precision Alignment & Raycast Inspection',
      icon: Hand,
      color: 'border-sky-500/60 bg-sky-950/40 text-sky-300 shadow-[0_0_20px_rgba(56,189,248,0.25)]',
      accent: 'bg-sky-400'
    },
    [GESTURES.THUMBS_UP]: {
      label: 'THUMBS UP',
      action: 'Recalibrating / Resetting View',
      icon: RotateCcw,
      color: 'border-teal-500/60 bg-teal-950/40 text-teal-300 shadow-[0_0_20px_rgba(20,184,166,0.25)]',
      accent: 'bg-teal-400'
    },
    [GESTURES.TWO_HAND_ZOOM]: {
      label: 'TWO HANDS ACTIVE',
      action: 'Dual Hand Stretch & Scale',
      icon: Minimize2,
      color: 'border-indigo-500/60 bg-indigo-950/40 text-indigo-300 shadow-[0_0_20px_rgba(99,102,241,0.25)]',
      accent: 'bg-indigo-400'
    }
  };

  const config = GESTURE_CONFIG[currentGesture] || GESTURE_CONFIG[GESTURES.NONE];
  const IconComponent = config.icon;

  return (
    <div className="flex flex-col gap-3 pointer-events-none select-none">
      {/* Active Gesture HUD Card */}
      <div
        className={`pointer-events-auto backdrop-blur-md rounded-2xl border px-4 py-3 transition-all duration-300 flex items-center justify-between gap-4 ${config.color}`}
      >
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-black/40 border border-white/10">
            <IconComponent className="w-6 h-6 animate-pulse" />
            <span
              className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ${
                handsCount > 0 ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-rose-500'
              }`}
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] tracking-widest text-slate-400 uppercase">
                {handsCount > 0 ? `HAND DETECTED (${handsCount})` : 'CAMERA STANDBY'}
              </span>
              {confidence > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/50 border border-white/10 font-mono text-slate-300">
                  {Math.round(confidence * 100)}%
                </span>
              )}
            </div>
            <div className="font-bold text-sm tracking-wide font-['Orbitron']">
              {config.label}
            </div>
            <div className="text-xs opacity-80 font-['Rajdhani'] font-medium">
              {config.action}
            </div>
          </div>
        </div>

        {/* Confidence meter bar */}
        <div className="hidden sm:flex flex-col items-end gap-1">
          <span className="text-[10px] font-mono opacity-70">TRACKING FIDELITY</span>
          <div className="w-20 h-1.5 bg-black/60 rounded-full overflow-hidden border border-white/10">
            <div
              className={`h-full transition-all duration-200 ${config.accent}`}
              style={{ width: `${Math.max(10, Math.min(100, confidence * 100))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Collapsible Gesture Cheatsheet */}
      <div className="pointer-events-auto backdrop-blur-md bg-slate-950/75 border border-slate-800/80 rounded-2xl p-3 text-slate-200 shadow-xl transition-all duration-300 max-w-sm">
        <button
          onClick={() => setIsGuideOpen(!isGuideOpen)}
          className="w-full flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-200 transition-colors"
        >
          <div className="flex items-center gap-2 font-mono">
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span>Gesture Matrix Cheatsheet</span>
          </div>
          {isGuideOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {isGuideOpen && (
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-['Rajdhani'] font-medium border-t border-slate-800/60 pt-2.5">
            <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900/50 border border-slate-800/50">
              <span className="text-base">✋</span>
              <div>
                <div className="text-cyan-300 font-bold">Open Palm</div>
                <div className="text-[11px] text-slate-400">Drag to Rotate 3D</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900/50 border border-slate-800/50">
              <span className="text-base">🤏</span>
              <div>
                <div className="text-fuchsia-300 font-bold">Pinch / Spread</div>
                <div className="text-[11px] text-slate-400">Zoom Model in/out</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900/50 border border-slate-800/50">
              <span className="text-base">✊</span>
              <div>
                <div className="text-amber-300 font-bold">Fist</div>
                <div className="text-[11px] text-slate-400">Lock & Hold View</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900/50 border border-slate-800/50">
              <span className="text-base">✌️</span>
              <div>
                <div className="text-emerald-300 font-bold">Peace Sign</div>
                <div className="text-[11px] text-slate-400">{organPeaceAction.slice(0, 24)}...</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900/50 border border-slate-800/50">
              <span className="text-base">👆</span>
              <div>
                <div className="text-sky-300 font-bold">Point Finger</div>
                <div className="text-[11px] text-slate-400">Precision Align</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900/50 border border-slate-800/50">
              <span className="text-base">👍</span>
              <div>
                <div className="text-teal-300 font-bold">Thumbs Up</div>
                <div className="text-[11px] text-slate-400">Reset View & Center</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
