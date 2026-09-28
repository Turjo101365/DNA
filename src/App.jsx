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
  Layers,
  Sparkles,
  Camera,
  Maximize2
} from 'lucide-react';
import AnatomyViewer from './components/AnatomyViewer';
import CameraFeed from './components/CameraFeed';
import GestureStatus from './components/GestureStatus';
import OrganTelemetryBar from './components/OrganTelemetryBar';
import { DNAControls } from './controls/dnaControls';
import { detectMultiHandGesture, GESTURES } from './handTracking/gestureDetector';

const ORGAN_SYSTEMS = [
  { id: 'HEART', label: 'HEART', sub: 'Cardiovascular', icon: Heart, color: 'text-rose-400', activeBg: 'bg-rose-950/80 border-rose-500' },
  { id: 'BRAIN', label: 'BRAIN', sub: 'Neural Synapses', icon: Brain, color: 'text-purple-400', activeBg: 'bg-purple-950/80 border-purple-500' },
  { id: 'LUNGS', label: 'LUNGS', sub: 'Respiratory', icon: Wind, color: 'text-cyan-400', activeBg: 'bg-cyan-950/80 border-cyan-500' },
  { id: 'VISCERAL', label: 'VISCERA', sub: 'Digestive & Renal', icon: Activity, color: 'text-amber-400', activeBg: 'bg-amber-950/80 border-amber-500' },
  { id: 'DNA', label: 'DNA HELIX', sub: 'Genomic Code', icon: Dna, color: 'text-emerald-400', activeBg: 'bg-emerald-950/80 border-emerald-500' }
];

export default function App() {
  const controlsRef = useRef(new DNAControls());

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
      if (e.target.tagName === 'INPUT') return;

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
    <div className="relative w-screen h-screen overflow-hidden bg-[#070b14] text-slate-100 font-sans">
      {/* 3D WebGL Multi-Organ Canvas Layer */}
      <div className="absolute inset-0 z-0">
        <AnatomyViewer
          controls={controlsRef.current}
          activeOrgan={activeOrgan}
          heartBpm={heartBpm}
          brainWaveMode={brainWaveMode}
          lungBreathRate={lungBreathRate}
          useGlbModel={useGlbModel}
        />
      </div>

      {/* Top Header HUD Bar */}
      <header className="absolute top-0 inset-x-0 h-16 z-30 px-4 sm:px-6 flex items-center justify-between pointer-events-none backdrop-blur-md bg-gradient-to-b from-[#070b14]/95 via-[#070b14]/60 to-transparent border-b border-slate-800/40">
        {/* Project Branding */}
        <div className="pointer-events-auto flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
            <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-extrabold tracking-wider font-['Orbitron'] bg-gradient-to-r from-cyan-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
                HUMAN BIO-SIMULATOR 3D
              </h1>
              <span className="hidden sm:inline-block text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono">
                VISION v3.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-['Rajdhani'] font-medium tracking-wide">
              VITAL ORGANS & REAL-TIME WEBCAM GESTURE TELEMETRY
            </p>
          </div>
        </div>

        {/* Global Toolbar Controls */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* FPS Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-300 shadow-md">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>{fps} FPS</span>
          </div>

          {/* Auto-Rotate Toggle */}
          <button
            onClick={handleToggleAutoRotate}
            title={isAutoRotate ? 'Pause Auto-Spin' : 'Resume Auto-Spin'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/60 transition-all text-xs font-mono cursor-pointer shadow-md"
          >
            {isAutoRotate ? <Pause className="w-3.5 h-3.5 text-cyan-400" /> : <Play className="w-3.5 h-3.5 text-amber-400" />}
            <span className="hidden md:inline">{isAutoRotate ? 'SPIN' : 'PAUSED'}</span>
          </button>

          {/* Reset Orientation */}
          <button
            onClick={handleReset}
            title="Reset 3D Orientation and Zoom"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/60 transition-all text-xs font-mono cursor-pointer shadow-md"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">RESET</span>
          </button>
        </div>
      </header>

      {/* Primary Anatomical System Selector Bar */}
      <div className="absolute top-18 inset-x-0 z-30 flex justify-center px-4 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-1 sm:gap-2 p-1.5 rounded-2xl backdrop-blur-xl bg-slate-950/85 border border-slate-800/80 shadow-2xl overflow-x-auto max-w-full">
          {ORGAN_SYSTEMS.map((org, index) => {
            const Icon = org.icon;
            const isActive = activeOrgan === org.id;

            return (
              <button
                key={org.id}
                onClick={() => handleOrganChange(org.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono transition-all duration-200 whitespace-nowrap cursor-pointer border ${
                  isActive
                    ? `${org.activeBg} text-white shadow-[0_0_20px_rgba(0,240,255,0.25)] font-bold`
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-300 animate-pulse' : org.color}`} />
                <div className="flex flex-col items-start leading-tight">
                  <span className="font-['Orbitron'] tracking-wider text-[11px] sm:text-xs">
                    {org.label}
                  </span>
                  <span className="hidden md:block text-[9px] text-slate-400 font-sans opacity-80">
                    [{index + 1}] {org.sub}
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
        />
      </div>

      {/* Floating Bottom-Right UI: Picture-in-Picture Camera Feed */}
      <div className="absolute bottom-6 right-6 z-30">
        <CameraFeed
          isEnabled={isCameraEnabled}
          activeGesture={activeGesture}
          onResults={handleTrackingResults}
          onToggle={() => setIsCameraEnabled(!isCameraEnabled)}
        />
      </div>

      {/* Bottom Center Hint Bar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none hidden lg:flex items-center gap-4 px-4 py-1.5 rounded-full backdrop-blur-md bg-slate-950/70 border border-slate-800 text-[11px] font-mono text-slate-400">
        <span>🖱️ Drag to rotate</span>
        <span>•</span>
        <span>⚙️ Scroll to zoom</span>
        <span>•</span>
        <span>🖐️ Webcam hand gestures</span>
        <span>•</span>
        <span>⌨️ Keys 1-5 to switch organs</span>
        <span>•</span>
        <span>✌️ Peace gesture for signature reaction</span>
      </div>
    </div>
  );
}
