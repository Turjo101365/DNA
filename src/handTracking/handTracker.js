import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';

// Hand landmark connection indices for drawing skeleton
export const HAND_CONNECTIONS = [
  // Thumb
  [0, 1], [1, 2], [2, 3], [3, 4],
  // Index
  [0, 5], [5, 6], [6, 7], [7, 8],
  // Middle
  [9, 10], [10, 11], [11, 12],
  // Ring
  [13, 14], [14, 15], [15, 16],
  // Pinky
  [0, 17], [17, 18], [18, 19], [19, 20],
  // Palm knuckle bar
  [5, 9], [9, 13], [13, 17]
];

export class HandTracker {
  constructor() {
    this.handLandmarker = null;
    this.video = null;
    this.stream = null;
    this.animationFrameId = null;
    this.isRunning = false;
    this.lastVideoTime = -1;
    this.onResultsCallback = null;
    this.onErrorCallback = null;
    this.isInitializing = false;
  }

  async initialize() {
    if (this.handLandmarker) return this.handLandmarker;
    if (this.isInitializing) {
      while (this.isInitializing) {
        await new Promise((r) => setTimeout(r, 50));
      }
      return this.handLandmarker;
    }

    this.isInitializing = true;
    try {
      // First try local WASM path, fallback to CDN
      let vision;
      try {
        vision = await FilesetResolver.forVisionTasks('/wasm');
      } catch (e) {
        console.warn('Local WASM failed, falling back to CDN:', e);
        vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
        );
      }

      // First try local task model path, fallback to Google storage CDN
      const modelPath = '/models/hand_landmarker.task';
      try {
        this.handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: modelPath,
            delegate: 'GPU'
          },
          runningMode: 'VIDEO',
          numHands: 2,
          minHandDetectionConfidence: 0.6,
          minHandPresenceConfidence: 0.6,
          minTrackingConfidence: 0.6
        });
      } catch (localErr) {
        console.warn('Local model failed, loading from CDN:', localErr);
        this.handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
            delegate: 'GPU'
          },
          runningMode: 'VIDEO',
          numHands: 2,
          minHandDetectionConfidence: 0.6,
          minHandPresenceConfidence: 0.6,
          minTrackingConfidence: 0.6
        });
      }

      console.log('HandLandmarker initialized successfully');
      return this.handLandmarker;
    } catch (err) {
      console.error('Failed to initialize HandLandmarker:', err);
      if (this.onErrorCallback) this.onErrorCallback(err);
      throw err;
    } finally {
      this.isInitializing = false;
    }
  }

  async start(videoElement, onResults, onError) {
    this.video = videoElement;
    this.onResultsCallback = onResults;
    this.onErrorCallback = onError;

    try {
      await this.initialize();

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Webcam API is not supported in this browser environment');
      }

      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false
      });

      this.video.srcObject = this.stream;
      await new Promise((resolve) => {
        this.video.onloadedmetadata = () => {
          this.video.play().then(resolve);
        };
      });

      this.isRunning = true;
      this.predictLoop();
    } catch (err) {
      console.error('HandTracker start failed:', err);
      if (this.onErrorCallback) this.onErrorCallback(err);
      this.stop();
      throw err;
    }
  }

  predictLoop() {
    if (!this.isRunning) return;

    if (this.video && this.video.readyState >= 2 && this.handLandmarker) {
      if (this.video.currentTime !== this.lastVideoTime) {
        this.lastVideoTime = this.video.currentTime;
        const startTimeMs = performance.now();
        const results = this.handLandmarker.detectForVideo(this.video, startTimeMs);

        if (this.onResultsCallback && results) {
          this.onResultsCallback(results);
        }
      }
    }

    this.animationFrameId = requestAnimationFrame(() => this.predictLoop());
  }

  stop() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }

    if (this.video) {
      this.video.srcObject = null;
    }
  }

  // Neon biotech overlay drawing
  static drawLandmarks(ctx, width, height, handsLandmarks, activeGesture = 'NONE') {
    ctx.clearRect(0, 0, width, height);

    if (!handsLandmarks || handsLandmarks.length === 0) return;

    handsLandmarks.forEach((landmarks) => {
      // 1. Draw connection bones
      ctx.lineWidth = 2.5;
      HAND_CONNECTIONS.forEach(([i, j]) => {
        const p1 = landmarks[i];
        const p2 = landmarks[j];

        const x1 = (1 - p1.x) * width; // Mirrored for natural user view
        const y1 = p1.y * height;
        const x2 = (1 - p2.x) * width;
        const y2 = p2.y * height;

        const grad = ctx.createLinearGradient(x1, y1, x2, y2);
        if (activeGesture === 'PINCH' || activeGesture === 'FIST') {
          grad.addColorStop(0, 'rgba(255, 59, 105, 0.7)');
          grad.addColorStop(1, 'rgba(255, 187, 0, 0.7)');
        } else {
          grad.addColorStop(0, 'rgba(0, 240, 255, 0.7)');
          grad.addColorStop(1, 'rgba(0, 255, 136, 0.7)');
        }

        ctx.strokeStyle = grad;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      });

      // 2. Draw joints and glowing fingertips
      landmarks.forEach((pt, index) => {
        const x = (1 - pt.x) * width;
        const y = pt.y * height;

        const isTip = [4, 8, 12, 16, 20].includes(index);
        const isWrist = index === 0;

        ctx.beginPath();
        const r = isTip ? 5.5 : isWrist ? 6 : 3.5;
        ctx.arc(x, y, r, 0, 2 * Math.PI);

        if (isTip) {
          ctx.fillStyle = activeGesture === 'PINCH' && (index === 4 || index === 8)
            ? '#ff0055'
            : '#00f0ff';
          ctx.shadowColor = '#00f0ff';
          ctx.shadowBlur = 10;
        } else {
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#00ff88';
          ctx.shadowBlur = 4;
        }

        ctx.fill();
        ctx.shadowBlur = 0; // reset
      });
    });
  }
}
