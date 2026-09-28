import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, Eye, EyeOff, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import { HandTracker } from '../handTracking/handTracker';

export default function CameraFeed({
  onResults,
  activeGesture = 'NONE',
  isEnabled = true,
  onToggle
}) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const trackerRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [mirror, setMirror] = useState(true);

  // Initialize and run hand tracker
  useEffect(() => {
    if (!isEnabled) {
      if (trackerRef.current) {
        trackerRef.current.stop();
      }
      return;
    }

    let isMounted = true;
    const tracker = new HandTracker();
    trackerRef.current = tracker;

    setIsLoading(true);
    setCameraError(null);

    const videoEl = videoRef.current;
    if (!videoEl) return;

    tracker
      .start(
        videoEl,
        (results) => {
          if (!isMounted) return;
          setIsLoading(false);

          // Draw skeleton on canvas
          const canvas = canvasRef.current;
          if (canvas && videoEl.videoWidth) {
            if (canvas.width !== videoEl.videoWidth || canvas.height !== videoEl.videoHeight) {
              canvas.width = videoEl.videoWidth;
              canvas.height = videoEl.videoHeight;
            }
            const ctx = canvas.getContext('2d');
            HandTracker.drawLandmarks(ctx, canvas.width, canvas.height, results.landmarks, activeGesture);
          }

          // Forward results to parent
          if (onResults) {
            onResults(results);
          }
        },
        (err) => {
          if (!isMounted) return;
          setIsLoading(false);
          console.warn('CameraFeed error:', err);
          setCameraError(err.message || 'Camera permission denied or camera unavailable');
        }
      )
      .catch((err) => {
        if (!isMounted) return;
        setIsLoading(false);
        setCameraError(err.message || 'Unable to access webcam');
      });

    return () => {
      isMounted = false;
      tracker.stop();
    };
  }, [isEnabled]);

  if (!isEnabled) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={onToggle}
          className="flex items-center gap-2 px-3 py-2 rounded-xl backdrop-blur-md bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 transition-all text-xs font-mono shadow-lg cursor-pointer"
        >
          <Camera className="w-4 h-4 text-cyan-400" />
          <span>START WEBCAM CONTROL</span>
        </button>
      </div>
    );
  }

  return (
    <div className="relative group select-none">
      {/* Container Card */}
      <div
        className={`relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-slate-950/80 backdrop-blur-xl shadow-2xl transition-all duration-300 ${
          isMinimized ? 'w-48 h-12' : 'w-64 sm:w-72 h-48 sm:h-52'
        }`}
      >
        {/* Header HUD Bar */}
        <div className="absolute top-0 inset-x-0 h-8 bg-gradient-to-b from-black/80 to-transparent z-20 flex items-center justify-between px-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[10px] font-mono tracking-widest text-cyan-400 font-bold uppercase">
              OPTIC SENSOR
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setMirror(!mirror)}
              title="Toggle Mirror View"
              className="p-1 rounded text-slate-400 hover:text-cyan-300 hover:bg-slate-800/60 transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              title={isMinimized ? 'Expand Camera' : 'Minimize Camera'}
              className="p-1 rounded text-slate-400 hover:text-cyan-300 hover:bg-slate-800/60 transition-colors"
            >
              {isMinimized ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={onToggle}
              title="Disable Camera"
              className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 transition-colors"
            >
              <CameraOff className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Video and Overlay Canvas */}
        {!isMinimized && (
          <div className="relative w-full h-full pt-6 bg-black flex items-center justify-center overflow-hidden">
            {isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-950/90 z-10 text-cyan-400">
                <RefreshCw className="w-6 h-6 animate-spin text-cyan-400" />
                <span className="text-xs font-mono">INITIALIZING VISION AI...</span>
              </div>
            )}

            {cameraError && (
              <div className="absolute inset-0 p-4 flex flex-col items-center justify-center text-center gap-2 bg-slate-950/95 z-10 text-rose-300">
                <AlertCircle className="w-7 h-7 text-rose-400" />
                <span className="text-xs font-semibold">Vision Input Offline</span>
                <p className="text-[10px] text-slate-400 leading-tight">
                  {cameraError.includes('denied')
                    ? 'Camera permission denied. Use mouse/touch to interact with the 3D model.'
                    : cameraError}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-1 text-[10px] px-2.5 py-1 rounded bg-slate-800 border border-slate-700 hover:border-cyan-500 text-slate-200"
                >
                  Retry Camera
                </button>
              </div>
            )}

            {/* Hidden / background video element */}
            <video
              ref={videoRef}
              playsInline
              muted
              className={`absolute inset-0 w-full h-full object-cover opacity-35 filter contrast-125 ${
                mirror ? 'scale-x-[-1]' : ''
              }`}
            />

            {/* Glowing Landmark Skeleton Overlay Canvas */}
            <canvas
              ref={canvasRef}
              className={`absolute inset-0 w-full h-full pointer-events-none object-cover ${
                mirror ? 'scale-x-[-1]' : ''
              }`}
            />

            {/* Futuristic Grid / Scanline FX */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />
            <div className="absolute inset-0 pointer-events-none opacity-15 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" />
          </div>
        )}

        {isMinimized && (
          <div className="w-full h-full flex items-center justify-center px-3 pt-6 text-[11px] font-mono text-cyan-300">
            <span>TRACKING ACTIVE</span>
          </div>
        )}
      </div>
    </div>
  );
}
