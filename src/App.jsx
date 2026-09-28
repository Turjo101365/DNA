import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Heart,
  Brain,
  Wind,
  Activity,
  Dna,
  RotateCcw,
  Play,
  Pause,
  Sun,
  Moon,
  Globe,
  Bot
} from 'lucide-react';
import AnatomyViewer from './components/AnatomyViewer';
import CameraFeed from './components/CameraFeed';
import GestureStatus from './components/GestureStatus';
import OrganTelemetryBar from './components/OrganTelemetryBar';
import OrganAIChatbot from './components/OrganAIChatbot';
import { DNAControls } from './controls/dnaControls';
import { detectMultiHandGesture, GESTURES } from './handTracking/gestureDetector';
import { TRANSLATIONS } from './i18n/translations';

const ORGAN_SYSTEMS = [
  {
    id: 'HEART',
    defaultLabel: 'HEART',
    defaultSub: 'Cardiovascular',
    icon: Heart,
    color: 'text-rose-500',
    activeBg: 'bg-rose-950/80 border-rose-500 text-white',
    activeBgLight: 'bg-rose-50 border-rose-500 text-rose-900'
  },
  {
    id: 'BRAIN',
    defaultLabel: 'BRAIN',
    defaultSub: 'Neural Synapses',
    icon: Brain,
    color: 'text-purple-500',
    activeBg: 'bg-purple-950/80 border-purple-500 text-white',
    activeBgLight: 'bg-purple-50 border-purple-500 text-purple-900'
  },
  {
    id: 'LUNGS',
    defaultLabel: 'LUNGS',
    defaultSub: 'Respiratory',
    icon: Wind,
    color: 'text-cyan-500',
    activeBg: 'bg-cyan-950/80 border-cyan-500 text-white',
    activeBgLight: 'bg-cyan-50 border-cyan-500 text-cyan-900'
  },
  {
    id: 'VISCERAL',
    defaultLabel: 'VISCERA',
    defaultSub: 'Digestive & Renal',
    icon: Activity,
    color: 'text-amber-500',
    activeBg: 'bg-amber-950/80 border-amber-500 text-white',
    activeBgLight: 'bg-amber-50 border-amber-500 text-amber-900'
  },
  {
    id: 'DNA',
    defaultLabel: 'DNA HELIX',
    defaultSub: 'Genomic Code',
    icon: Dna,
    color: 'text-emerald-500',
    activeBg: 'bg-emerald-950/80 border-emerald-500 text-white',
    activeBgLight: 'bg-emerald-50 border-emerald-500 text-emerald-900'
  }
];

export default function App() {
  const controlsRef = useRef(new DNAControls());

  // Language & Theme State with LocalStorage Persistence
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('bio_sim_lang') || 'en';
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('bio_sim_theme') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('bio_sim_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('bio_sim_theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.body.classList.add('theme-light');
    } else {
      document.documentElement.classList.remove('light');
      document.body.classList.remove('theme-light');
    }
  }, [theme]);

  const isLight = theme === 'light';
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Navigation & Simulation State (Default: Beating Heart)
  const [activeOrgan, setActiveOrgan] = useState('HEART');
  const [heartBpm, setHeartBpm] = useState(72);
  const [brainWaveMode, setBrainWaveMode] = useState('Beta');
  const [lungBreathRate, setLungBreathRate] = useState(16);
  const [dnaUnwind, setDnaUnwind] = useState(0);

  // System & Tracking State
  const [activeGesture, setActiveGesture] = useState(GESTURES.NONE);
  const [gestureConfidence, setGestureConfidence] = useState(0);
  const [handsCount, setHandsCount] = useState(0);
  const [isCameraEnabled, setIsCameraEnabled] = useState(true);
  const [useGlbModel, setUseGlbModel] = useState(true);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [sensitivity, setSensitivity] = useState(3.2);
  const [fps, setFps] = useState(60);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  // FPS Counter
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animId;

    const measureFps = () => {
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastTime)));
        frameCount = 0;
        lastTime = now;
      }
      animId = requestAnimationFrame(measureFps);
    };

    animId = requestAnimationFrame(measureFps);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Update sensitivity in controls
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.sensitivity = sensitivity;
    }
  }, [sensitivity]);

  // Handle special action triggered by PEACE gesture
  useEffect(() => {
    if (!controlsRef.current) return;

    controlsRef.current.onSpecialAction = () => {
      if (activeOrgan === 'HEART') {
        // Tachycardia pulse burst
        setHeartBpm((prev) => (prev > 100 ? 72 : 128));
      } else if (activeOrgan === 'BRAIN') {
        // Cycle brainwave state
        setBrainWaveMode((prev) => {
          const modes = ['Theta', 'Alpha', 'Beta', 'Gamma'];
          const nextIdx = (modes.indexOf(prev) + 1) % modes.length;
          return modes[nextIdx];
        });
      } else if (activeOrgan === 'LUNGS') {
        // Deep breath cycle
        setLungBreathRate((prev) => (prev > 20 ? 16 : 26));
      } else if (activeOrgan === 'DNA') {
        controlsRef.current.toggleUnwind();
      }
    };
  }, [activeOrgan]);

  // Keyboard Shortcuts (1-5 to switch organs, Space for auto-spin, R for reset, E for special action)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === '1') setActiveOrgan('HEART');
      else if (e.key === '2') setActiveOrgan('BRAIN');
      else if (e.key === '3') setActiveOrgan('LUNGS');
      else if (e.key === '4') setActiveOrgan('VISCERAL');
      else if (e.key === '5') setActiveOrgan('DNA');
      else if (e.key === ' ') {
        e.preventDefault();
        handleToggleAutoRotate();
      } else if (e.key === 'r' || e.key === 'R') {
        handleReset();
      } else if (e.key === 'e' || e.key === 'E') {
        controlsRef.current.onSpecialAction?.();
      } else if (e.key === 'c' || e.key === 'C') {
        setIsChatbotOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeOrgan]);

  // Handle hand tracking results
  const handleTrackingResults = useCallback((results) => {
    if (!results || !results.landmarks || results.landmarks.length === 0) {
      setHandsCount(0);
      setActiveGesture(GESTURES.NONE);
      setGestureConfidence(0);
      controlsRef.current.processGesture(null);
      return;
    }

    setHandsCount(results.landmarks.length);
    const gestureResult = detectMultiHandGesture(results.landmarks);

    setActiveGesture(gestureResult.gesture);
    setGestureConfidence(gestureResult.confidence || 0.85);

    controlsRef.current.processGesture(gestureResult);
  }, []);

  const handleReset = () => {
    controlsRef.current.reset();
  };

  const handleToggleAutoRotate = () => {
    controlsRef.current.toggleAutoRotate();
    setIsAutoRotate(controlsRef.current.autoRotate);
  };

  const handleOrganChange = (id) => {
    setActiveOrgan(id);
    controlsRef.current.reset();
  };

  return (
    <div
      className={`relative w-screen h-screen overflow-hidden select-none transition-colors duration-300 ${
        isLight ? 'bg-[#f1f5f9] text-slate-800' : 'bg-[#070b14] text-slate-100'
      } ${language === 'bn' ? 'font-bangla' : 'font-sans'}`}
    >
      {/* 3D WebGL Multi-Organ Canvas Layer */}
      <div className="absolute inset-0 z-0">
        <AnatomyViewer
          controls={controlsRef.current}
          activeOrgan={activeOrgan}
          heartBpm={heartBpm}
          brainWaveMode={brainWaveMode}
          lungBreathRate={lungBreathRate}
          useGlbModel={useGlbModel}
          theme={theme}
          language={language}
        />
      </div>

      {/* Top Header HUD Bar */}
      <header
        className={`absolute top-0 inset-x-0 h-16 z-30 px-4 sm:px-6 flex items-center justify-between pointer-events-none backdrop-blur-md border-b transition-colors duration-300 ${
          isLight
            ? 'bg-gradient-to-b from-white/95 via-white/80 to-transparent border-slate-200/80 shadow-xs'
            : 'bg-gradient-to-b from-[#070b14]/95 via-[#070b14]/60 to-transparent border-slate-800/40'
        }`}
      >
        {/* Project Branding */}
        <div className="pointer-events-auto flex items-center gap-3">
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-xl border transition-all ${
              isLight
                ? 'bg-cyan-500/10 border-cyan-500/30 shadow-[0_2px_10px_rgba(6,182,212,0.2)]'
                : 'bg-cyan-500/10 border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.3)]'
            }`}
          >
            <Activity className="w-5 h-5 text-cyan-500 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1
                className={`text-sm sm:text-base font-extrabold tracking-wider ${
                  language === 'bn' ? 'font-bangla' : "font-['Orbitron']"
                } bg-gradient-to-r ${
                  isLight
                    ? 'from-cyan-700 via-sky-600 to-emerald-600'
                    : 'from-cyan-400 via-sky-300 to-emerald-400'
                } bg-clip-text text-transparent`}
              >
                {t.appTitle}
              </h1>
              <span
                className={`hidden sm:inline-block text-[10px] px-1.5 py-0.5 rounded border font-mono ${
                  isLight
                    ? 'bg-cyan-50 border-cyan-300 text-cyan-700 font-semibold'
                    : 'bg-cyan-950/80 border-cyan-500/40 text-cyan-300'
                }`}
              >
                {t.versionBadge}
              </span>
            </div>
            <p
              className={`text-[11px] font-medium tracking-wide ${
                language === 'bn' ? 'font-bangla' : "font-['Rajdhani']"
              } ${isLight ? 'text-slate-600' : 'text-slate-400'}`}
            >
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Global Toolbar Controls */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* FPS Badge */}
          <div
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-mono shadow-md ${
              isLight
                ? 'bg-white/90 border-slate-200 text-slate-700'
                : 'bg-slate-900/80 border-slate-800 text-slate-300'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-500" />
            <span>{fps} {t.fps}</span>
          </div>

          {/* Auto-Rotate Toggle */}
          <button
            onClick={handleToggleAutoRotate}
            title={isAutoRotate ? 'Pause Auto-Spin' : 'Resume Auto-Spin'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all text-xs font-mono cursor-pointer shadow-md ${
              isLight
                ? 'bg-white/90 border-slate-200 text-slate-700 hover:text-cyan-700 hover:border-cyan-400'
                : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/60'
            }`}
          >
            {isAutoRotate ? (
              <Pause className="w-3.5 h-3.5 text-cyan-500" />
            ) : (
              <Play className="w-3.5 h-3.5 text-amber-500" />
            )}
            <span className="hidden md:inline">{isAutoRotate ? t.spin : t.paused}</span>
          </button>

          {/* Reset Orientation */}
          <button
            onClick={handleReset}
            title="Reset 3D Orientation and Zoom"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all text-xs font-mono cursor-pointer shadow-md ${
              isLight
                ? 'bg-white/90 border-slate-200 text-slate-700 hover:text-cyan-700 hover:border-cyan-400'
                : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/60'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{t.reset}</span>
          </button>

          {/* AI Organ Chatbot Toggle Button */}
          <button
            onClick={() => setIsChatbotOpen((prev) => !prev)}
            title={language === 'bn' ? 'অর্গান এআই চ্যাটবট খুলুন (Ollama)' : 'Open Organ AI Chatbot (Ollama)'}
            className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all text-xs font-mono cursor-pointer shadow-md ${
              isChatbotOpen
                ? 'bg-gradient-to-r from-cyan-500/30 to-blue-500/30 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                : isLight
                  ? 'bg-white/90 border-slate-200 text-slate-700 hover:text-cyan-700 hover:border-cyan-400'
                  : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/60'
            }`}
          >
            <Bot className={`w-3.5 h-3.5 ${isChatbotOpen ? 'text-cyan-300 animate-pulse' : 'text-cyan-400'}`} />
            <span className="hidden sm:inline font-bold">
              {t.aiChat || 'BIO-AI'}
            </span>
            <span className="flex h-1.5 w-1.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-500"></span>
            </span>
          </button>

          {/* Language Selector: Pill Toggle [ EN | বাং ] */}
          <div
            className={`flex items-center p-0.5 rounded-xl border text-xs font-mono shadow-md ${
              isLight
                ? 'bg-white/90 border-slate-200 text-slate-700'
                : 'bg-slate-900/80 border-slate-700 text-slate-300'
            }`}
          >
            <button
              onClick={() => setLanguage('en')}
              title="Switch to English"
              className={`px-2 py-1 rounded-lg transition-all cursor-pointer text-xs ${
                language === 'en'
                  ? isLight
                    ? 'bg-cyan-600 text-white font-bold shadow-xs'
                    : 'bg-cyan-500/30 text-cyan-300 font-bold border border-cyan-500/40 shadow-xs'
                  : isLight
                    ? 'text-slate-500 hover:text-slate-900'
                    : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('bn')}
              title="বাংলা ভাষায় পরিবর্তন করুন"
              className={`px-2 py-1 rounded-lg transition-all cursor-pointer text-xs font-bangla ${
                language === 'bn'
                  ? isLight
                    ? 'bg-cyan-600 text-white font-bold shadow-xs'
                    : 'bg-cyan-500/30 text-cyan-300 font-bold border border-cyan-500/40 shadow-xs'
                  : isLight
                    ? 'text-slate-500 hover:text-slate-900'
                    : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              বাং
            </button>
          </div>

          {/* Theme Toggle: Sun / Moon Button */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title={theme === 'dark' ? t.themeLight : t.themeDark}
            className={`flex items-center justify-center p-2 rounded-xl border transition-all cursor-pointer shadow-md ${
              isLight
                ? 'bg-white/90 border-slate-200 text-amber-600 hover:bg-amber-50 hover:border-amber-400'
                : 'bg-slate-900/80 border-slate-700 text-amber-400 hover:text-amber-300 hover:border-amber-500/60'
            }`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Primary Anatomical System Selector Bar */}
      <div className="absolute top-18 inset-x-0 z-30 flex justify-center px-4 pointer-events-none">
        <div
          className={`pointer-events-auto flex items-center gap-1 sm:gap-2 p-1.5 rounded-2xl backdrop-blur-xl border shadow-2xl overflow-x-auto max-w-full transition-colors duration-300 ${
            isLight
              ? 'bg-white/90 border-slate-200 shadow-slate-300/40'
              : 'bg-slate-950/85 border-slate-800/80'
          }`}
        >
          {ORGAN_SYSTEMS.map((org, index) => {
            const Icon = org.icon;
            const isActive = activeOrgan === org.id;
            const organInfo = t.organs[org.id] || { label: org.defaultLabel, sub: org.defaultSub };

            return (
              <button
                key={org.id}
                onClick={() => handleOrganChange(org.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono transition-all duration-200 whitespace-nowrap cursor-pointer border ${
                  isActive
                    ? isLight
                      ? `${org.activeBgLight} shadow-[0_2px_12px_rgba(0,0,0,0.08)] font-bold`
                      : `${org.activeBg} shadow-[0_0_20px_rgba(0,240,255,0.25)] font-bold`
                    : isLight
                      ? 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive
                      ? isLight
                        ? 'text-cyan-700 animate-pulse'
                        : 'text-cyan-300 animate-pulse'
                      : org.color
                  }`}
                />
                <div className="flex flex-col items-start leading-tight">
                  <span
                    className={`tracking-wider text-[11px] sm:text-xs ${
                      language === 'bn' ? 'font-bangla font-bold' : "font-['Orbitron']"
                    }`}
                  >
                    {organInfo.label}
                  </span>
                  <span
                    className={`hidden md:block text-[9px] opacity-80 ${
                      language === 'bn' ? 'font-bangla' : 'font-sans'
                    } ${isLight ? 'text-slate-600' : 'text-slate-400'}`}
                  >
                    [{index + 1}] {organInfo.sub}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating Left UI HUD: Gesture Status */}
      <div className="absolute top-34 left-6 z-20 max-w-sm">
        <GestureStatus
          currentGesture={activeGesture}
          confidence={gestureConfidence}
          handsCount={handsCount}
          isCameraActive={isCameraEnabled}
          activeOrgan={activeOrgan}
          theme={theme}
          language={language}
        />
      </div>

      {/* Floating Bottom-Left UI: Live Organ Telemetry */}
      <div className="absolute bottom-6 left-6 z-20">
        <OrganTelemetryBar
          organType={activeOrgan}
          heartBpm={heartBpm}
          onHeartBpmChange={setHeartBpm}
          brainWaveMode={brainWaveMode}
          onBrainWaveModeChange={setBrainWaveMode}
          lungBreathRate={lungBreathRate}
          onLungBreathRateChange={setLungBreathRate}
          dnaUnwind={dnaUnwind}
          onDnaUnwindToggle={() => controlsRef.current.toggleUnwind()}
          theme={theme}
          language={language}
        />
      </div>

      {/* Floating Bottom-Right UI: Picture-in-Picture Camera Feed */}
      <div className="absolute bottom-6 right-6 z-30">
        <CameraFeed
          isEnabled={isCameraEnabled}
          activeGesture={activeGesture}
          onResults={handleTrackingResults}
          onToggle={() => setIsCameraEnabled(!isCameraEnabled)}
          theme={theme}
          language={language}
        />
      </div>

      {/* Bottom Center Hint Bar */}
      <div
        className={`absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none hidden lg:flex items-center gap-4 px-4 py-1.5 rounded-full backdrop-blur-md border text-[11px] font-mono transition-colors duration-300 ${
          isLight
            ? 'bg-white/90 border-slate-200 text-slate-600 shadow-md'
            : 'bg-slate-950/70 border-slate-800 text-slate-400'
        } ${language === 'bn' ? 'font-bangla' : ''}`}
      >
        <span>{t.hints.drag}</span>
        <span>•</span>
        <span>{t.hints.zoom}</span>
        <span>•</span>
        <span>{t.hints.gestures}</span>
        <span>•</span>
        <span>{t.hints.keys}</span>
        <span>•</span>
        <span>{t.hints.peace}</span>
        <span>•</span>
        <span>{t.hints.aiChat}</span>
      </div>

      {/* Floating Bio-AI Organ Chatbot Drawer */}
      <OrganAIChatbot
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
        activeOrgan={activeOrgan}
        onSelectOrgan={handleOrganChange}
        telemetry={{
          heartBpm,
          brainWaveMode,
          lungBreathRate,
          dnaUnwind
        }}
        theme={theme}
        language={language}
      />
    </div>
  );
}
