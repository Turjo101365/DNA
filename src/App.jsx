import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Dna,
  RotateCcw,
  Play,
  Pause,
  Layers,
  Sliders,
  Sparkles,
  Camera,
  Activity,
  Maximize2
} from 'lucide-react';
import DNAViewer from './components/DNAViewer';
import CameraFeed from './components/CameraFeed';
import GestureStatus from './components/GestureStatus';
import { DNAControls } from './controls/dnaControls';
import { detectMultiHandGesture, GESTURES } from './handTracking/gestureDetector';

export default function App() {
  const controlsRef = useRef(new DNAControls());

  // State
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

  // Handle hand landmark results from CameraFeed
  const handleTrackingResults = useCallback((results) => {
    if (!results || !results.landmarks || results.landmarks.length === 0) {
      setHandsCount(0);
      setActiveGesture(GESTURES.NONE);
      setGestureConfidence(0);
      controlsRef.current.processGesture(null);
      return;
    }

    setHandsCount(results.landmarks.length);

    // Detect gestures across hands
    const gestureResult = detectMultiHandGesture(results.landmarks);

    setActiveGesture(gestureResult.gesture);
    setGestureConfidence(gestureResult.confidence || 0.85);

    // Send to smooth physics controls
    controlsRef.current.processGesture(gestureResult);
  }, []);

  const handleReset = () => {
    controlsRef.current.reset();
  };

  const handleToggleAutoRotate = () => {
    controlsRef.current.toggleAutoRotate();
    setIsAutoRotate(controlsRef.current.autoRotate);
  };

  const handleToggleModelMode = () => {
    setUseGlbModel((prev) => !prev);
  };

  const handleToggleUnwind = () => {
    controlsRef.current.toggleUnwind();
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#070b14] text-slate-100 font-sans">
      {/* 3D WebGL Canvas Layer */}
      <div className="absolute inset-0 z-0">
        <DNAViewer
          controls={controlsRef.current}
          useGlbModel={useGlbModel}
          onModelToggle={handleToggleModelMode}
          onReset={handleReset}
        />
      </div>

      {/* Top Header HUD Bar */}
      <header className="absolute top-0 inset-x-0 h-16 z-30 px-6 flex items-center justify-between pointer-events-none backdrop-blur-sm bg-gradient-to-b from-[#070b14]/90 via-[#070b14]/40 to-transparent">
        {/* Project Branding */}
        <div className="pointer-events-auto flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
            <Dna className="w-6 h-6 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold tracking-wider font-['Orbitron'] bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                DNA HELIX LAB
              </h1>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono">
                VISION v2.0
              </span>
            </div>
            <p className="text-xs text-slate-400 font-['Rajdhani'] font-medium tracking-wide">
              REAL-TIME WEBCAM HAND GESTURE TELEMETRY
            </p>
          </div>
        </div>

        {/* Global Toolbar Controls */}
        <div className="pointer-events-auto flex items-center gap-2 sm:gap-3">
          {/* FPS Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-300 shadow-md">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>{fps} FPS</span>
          </div>

          {/* Model Toggle (GLB vs Procedural) */}
          <button
            onClick={handleToggleModelMode}
            title="Toggle between GLB Model and Procedural Uncoiling Helix"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono border transition-all cursor-pointer shadow-md ${
              useGlbModel
                ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300'
                : 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{useGlbModel ? 'GLB 3D MODEL' : 'PROCEDURAL'}</span>
          </button>

          {/* Unwind Action Button */}
          <button
            onClick={handleToggleUnwind}
            title="Uncoil Helix into Flat Ladder / Mutate"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-emerald-300 hover:border-emerald-500/60 transition-all text-xs font-mono cursor-pointer shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">UNWIND</span>
          </button>

          {/* Auto-Rotate Toggle */}
          <button
            onClick={handleToggleAutoRotate}
            title={isAutoRotate ? 'Pause Auto-Spin' : 'Resume Auto-Spin'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/60 transition-all text-xs font-mono cursor-pointer shadow-md"
          >
            {isAutoRotate ? <Pause className="w-3.5 h-3.5 text-cyan-400" /> : <Play className="w-3.5 h-3.5 text-amber-400" />}
            <span className="hidden lg:inline">{isAutoRotate ? 'AUTO-SPIN' : 'PAUSED'}</span>
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

      {/* Floating Left/Center UI HUD: Gesture Status */}
      <div className="absolute top-20 left-6 z-20 max-w-sm">
        <GestureStatus
          currentGesture={activeGesture}
          confidence={gestureConfidence}
          handsCount={handsCount}
          isCameraActive={isCameraEnabled}
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
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none hidden md:flex items-center gap-4 px-4 py-1.5 rounded-full backdrop-blur-md bg-slate-950/60 border border-slate-800 text-[11px] font-mono text-slate-400">
        <span>🖱️ Drag to rotate with mouse</span>
        <span>•</span>
        <span>⚙️ Scroll to zoom</span>
        <span>•</span>
        <span>🖐️ Use webcam hand gestures</span>
      </div>
    </div>
  );
}
