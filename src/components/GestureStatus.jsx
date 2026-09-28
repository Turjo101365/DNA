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
import { TRANSLATIONS } from '../i18n/translations';

export default function GestureStatus({
  currentGesture = GESTURES.NONE,
  confidence = 0,
  handsCount = 0,
  isCameraActive = true,
  activeOrgan = 'HEART',
  theme = 'dark',
  language = 'en'
}) {
  const [isGuideOpen, setIsGuideOpen] = useState(true);
  const isLight = theme === 'light';

  const t = TRANSLATIONS[language]?.gestures || TRANSLATIONS.en.gestures;
  const organPeaceAction = t.actions[activeOrgan] || t.actions.DEFAULT;

  const GESTURE_CONFIG = {
    [GESTURES.NONE]: {
      label: t.items.NONE.label,
      action: t.items.NONE.action,
      icon: Radio,
      color: isLight
        ? 'border-slate-300 bg-white/95 text-slate-600 shadow-md'
        : 'border-slate-700/60 bg-slate-900/60 text-slate-400',
      accent: 'bg-slate-400'
    },
    [GESTURES.OPEN_PALM]: {
      label: t.items.OPEN_PALM.label,
      action:
        language === 'bn'
          ? `ত্রিমাত্রিক ${TRANSLATIONS.bn.organs[activeOrgan]?.label || activeOrgan} ঘোরান ও সরান`
          : `Rotate & Pan 3D ${activeOrgan} in Space`,
      icon: Hand,
      color: isLight
        ? 'border-cyan-400 bg-cyan-50/95 text-cyan-900 shadow-[0_4px_20px_rgba(6,182,212,0.18)]'
        : 'border-cyan-500/60 bg-cyan-950/40 text-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.25)]',
      accent: 'bg-cyan-500'
    },
    [GESTURES.PINCH]: {
      label: t.items.PINCH.label,
      action: t.items.PINCH.action,
      icon: Minimize2,
      color: isLight
        ? 'border-fuchsia-400 bg-fuchsia-50/95 text-fuchsia-900 shadow-[0_4px_20px_rgba(217,70,239,0.18)]'
        : 'border-fuchsia-500/60 bg-fuchsia-950/40 text-fuchsia-300 shadow-[0_0_20px_rgba(255,0,128,0.25)]',
      accent: 'bg-fuchsia-500'
    },
    [GESTURES.FIST]: {
      label: t.items.FIST.label,
      action: t.items.FIST.action,
      icon: Lock,
      color: isLight
        ? 'border-amber-400 bg-amber-50/95 text-amber-900 shadow-[0_4px_20px_rgba(245,158,11,0.18)]'
        : 'border-amber-500/60 bg-amber-950/40 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.25)]',
      accent: 'bg-amber-500'
    },
    [GESTURES.PEACE]: {
      label: t.items.PEACE.label,
      action: organPeaceAction,
      icon: Sparkles,
      color: isLight
        ? 'border-emerald-400 bg-emerald-50/95 text-emerald-900 shadow-[0_4px_20px_rgba(16,185,129,0.18)]'
        : 'border-emerald-500/60 bg-emerald-950/40 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.25)]',
      accent: 'bg-emerald-500'
    },
    [GESTURES.POINT]: {
      label: t.items.POINT.label,
      action: t.items.POINT.action,
      icon: Hand,
      color: isLight
        ? 'border-sky-400 bg-sky-50/95 text-sky-900 shadow-[0_4px_20px_rgba(14,165,233,0.18)]'
        : 'border-sky-500/60 bg-sky-950/40 text-sky-300 shadow-[0_0_20px_rgba(56,189,248,0.25)]',
      accent: 'bg-sky-500'
    },
    [GESTURES.THUMBS_UP]: {
      label: t.items.THUMBS_UP.label,
      action: t.items.THUMBS_UP.action,
      icon: RotateCcw,
      color: isLight
        ? 'border-teal-400 bg-teal-50/95 text-teal-900 shadow-[0_4px_20px_rgba(20,184,166,0.18)]'
        : 'border-teal-500/60 bg-teal-950/40 text-teal-300 shadow-[0_0_20px_rgba(20,184,166,0.25)]',
      accent: 'bg-teal-500'
    },
    [GESTURES.TWO_HAND_ZOOM]: {
      label: t.items.TWO_HAND_ZOOM.label,
      action: t.items.TWO_HAND_ZOOM.action,
      icon: Minimize2,
      color: isLight
        ? 'border-indigo-400 bg-indigo-50/95 text-indigo-900 shadow-[0_4px_20px_rgba(99,102,241,0.18)]'
        : 'border-indigo-500/60 bg-indigo-950/40 text-indigo-300 shadow-[0_0_20px_rgba(99,102,241,0.25)]',
      accent: 'bg-indigo-500'
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
          <div className={`relative flex items-center justify-center w-11 h-11 rounded-xl ${
            isLight ? 'bg-black/5 border border-black/10' : 'bg-black/40 border border-white/10'
          }`}>
            <IconComponent className="w-6 h-6 animate-pulse" />
            <span
              className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ${
                handsCount > 0 ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-rose-500'
              }`}
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className={`font-mono text-[11px] tracking-widest uppercase ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                {handsCount > 0 ? `${t.headerActive} (${handsCount})` : t.headerStandby}
              </span>
              {confidence > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                  isLight ? 'bg-black/5 border border-black/10 text-slate-700' : 'bg-black/50 border border-white/10 text-slate-300'
                }`}>
                  {Math.round(confidence * 100)}%
                </span>
              )}
            </div>
            <div className="font-bold text-sm tracking-wide font-['Orbitron']">
              {config.label}
            </div>
            <div className={`text-xs opacity-90 font-['Rajdhani'] font-medium ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              {config.action}
            </div>
          </div>
        </div>

        {/* Confidence meter bar */}
        <div className="hidden sm:flex flex-col items-end gap-1">
          <span className="text-[10px] font-mono opacity-70">{t.fidelity}</span>
          <div className={`w-20 h-1.5 rounded-full overflow-hidden border ${isLight ? 'bg-slate-200 border-slate-300' : 'bg-black/60 border-white/10'}`}>
            <div
              className={`h-full transition-all duration-200 ${config.accent}`}
              style={{ width: `${Math.max(10, Math.min(100, confidence * 100))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Collapsible Gesture Cheatsheet */}
      <div className={`pointer-events-auto backdrop-blur-md rounded-2xl p-3 shadow-xl transition-all duration-300 max-w-sm border ${
        isLight ? 'bg-white/90 border-slate-200 text-slate-800' : 'bg-slate-950/75 border-slate-800/80 text-slate-200'
      }`}>
        <button
          onClick={() => setIsGuideOpen(!isGuideOpen)}
          className={`w-full flex items-center justify-between text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
            isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="flex items-center gap-2 font-mono">
            <HelpCircle className="w-4 h-4 text-cyan-500" />
            <span>{t.cheatsheetTitle}</span>
          </div>
          {isGuideOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {isGuideOpen && (
          <div className={`mt-3 grid grid-cols-2 gap-2 text-xs font-['Rajdhani'] font-medium border-t pt-2.5 ${
            isLight ? 'border-slate-200' : 'border-slate-800/60'
          }`}>
            <div className={`flex items-center gap-2 p-1.5 rounded-lg border ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/50 border-slate-800/50'
            }`}>
              <span className="text-base">✋</span>
              <div>
                <div className={`${isLight ? 'text-cyan-700' : 'text-cyan-300'} font-bold`}>{t.items.OPEN_PALM.label}</div>
                <div className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{t.items.OPEN_PALM.tip}</div>
              </div>
            </div>

            <div className={`flex items-center gap-2 p-1.5 rounded-lg border ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/50 border-slate-800/50'
            }`}>
              <span className="text-base">🤏</span>
              <div>
                <div className={`${isLight ? 'text-fuchsia-700' : 'text-fuchsia-300'} font-bold`}>{t.items.PINCH.label}</div>
                <div className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{t.items.PINCH.tip}</div>
              </div>
            </div>

            <div className={`flex items-center gap-2 p-1.5 rounded-lg border ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/50 border-slate-800/50'
            }`}>
              <span className="text-base">✊</span>
              <div>
                <div className={`${isLight ? 'text-amber-700' : 'text-amber-300'} font-bold`}>{t.items.FIST.label}</div>
                <div className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{t.items.FIST.tip}</div>
              </div>
            </div>

            <div className={`flex items-center gap-2 p-1.5 rounded-lg border ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/50 border-slate-800/50'
            }`}>
              <span className="text-base">✌️</span>
              <div>
                <div className={`${isLight ? 'text-emerald-700' : 'text-emerald-300'} font-bold`}>{t.items.PEACE.label}</div>
                <div className={`text-[11px] truncate max-w-[110px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`} title={organPeaceAction}>
                  {organPeaceAction.slice(0, 20)}...
                </div>
              </div>
            </div>

            <div className={`flex items-center gap-2 p-1.5 rounded-lg border ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/50 border-slate-800/50'
            }`}>
              <span className="text-base">👆</span>
              <div>
                <div className={`${isLight ? 'text-sky-700' : 'text-sky-300'} font-bold`}>{t.items.POINT.label}</div>
                <div className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{t.items.POINT.tip}</div>
              </div>
            </div>

            <div className={`flex items-center gap-2 p-1.5 rounded-lg border ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/50 border-slate-800/50'
            }`}>
              <span className="text-base">👍</span>
              <div>
                <div className={`${isLight ? 'text-teal-700' : 'text-teal-300'} font-bold`}>{t.items.THUMBS_UP.label}</div>
                <div className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{t.items.THUMBS_UP.tip}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
