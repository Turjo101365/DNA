import { GESTURES } from '../handTracking/gestureDetector.js';

export class DNAControls {
  constructor() {
    // Current smooth values
    this.rotation = { x: 0.2, y: 0, z: 0 };
    this.targetRotation = { x: 0.2, y: 0, z: 0 };
    this.rotationVelocity = { x: 0, y: 0.005 };

    this.scale = 1.0;
    this.targetScale = 1.0;
    this.minScale = 0.4;
    this.maxScale = 3.2;

    this.position = { x: 0, y: 0, z: 0 };
    this.targetPosition = { x: 0, y: 0, z: 0 };

    // Unwind / inspection effect factor (0 = normal helix, 1 = uncoiled flat ladder)
    this.unwindFactor = 0.0;
    this.targetUnwindFactor = 0.0;

    // State flags
    this.isFrozen = false;
    this.autoRotate = true;
    this.autoRotateSpeed = 0.006;
    this.sensitivity = 3.2;

    // Tracking history for deltas
    this.lastPalmCenter = null;
    this.lastPinchDist = null;
    this.lastTwoHandDist = null;
    this.lastGestureTime = 0;

    // Mouse fallback state
    this.isDragging = false;
    this.lastMousePos = { x: 0, y: 0 };
  }

  reset() {
    this.targetRotation = { x: 0.2, y: 0, z: 0 };
    this.targetScale = 1.0;
    this.targetPosition = { x: 0, y: 0, z: 0 };
    this.targetUnwindFactor = 0.0;
    this.rotationVelocity = { x: 0, y: 0.005 };
    this.isFrozen = false;
  }

  toggleAutoRotate() {
    this.autoRotate = !this.autoRotate;
  }

  toggleUnwind() {
    this.targetUnwindFactor = this.targetUnwindFactor > 0.5 ? 0.0 : 1.0;
  }

  processGesture(gestureData) {
    if (!gestureData) return;

    const { gesture, details, twoHandDistance } = gestureData;
    const now = performance.now();

    // 1. Check FIST (Freeze rotation)
    if (gesture === GESTURES.FIST) {
      this.isFrozen = true;
      this.rotationVelocity = { x: 0, y: 0 };
      this.lastPalmCenter = null;
      return;
    } else {
      this.isFrozen = false;
    }

    // 2. Check THUMBS_UP (Reset)
    if (gesture === GESTURES.THUMBS_UP) {
      this.reset();
      this.lastPalmCenter = null;
      return;
    }

    // 3. Check PEACE (Unwind / Mutate)
    if (gesture === GESTURES.PEACE) {
      // Debounce toggling unwind
      if (now - this.lastGestureTime > 1200) {
        this.toggleUnwind();
        this.lastGestureTime = now;
      }
    }

    // 4. Two Hand Zoom & Stretch
    if (gesture === GESTURES.TWO_HAND_ZOOM && twoHandDistance) {
      if (this.lastTwoHandDist !== null) {
        const deltaDist = twoHandDistance - this.lastTwoHandDist;
        this.targetScale = Math.min(
          this.maxScale,
          Math.max(this.minScale, this.targetScale + deltaDist * 2.0)
        );
      }
      this.lastTwoHandDist = twoHandDistance;
      this.lastPalmCenter = null;
      return;
    } else {
      this.lastTwoHandDist = null;
    }

    // 5. Single Hand PINCH (Zoom)
    if (gesture === GESTURES.PINCH && details && details.pinchDistance !== undefined) {
      const currentDist = details.pinchDistance;
      if (this.lastPinchDist !== null) {
        const pinchDelta = currentDist - this.lastPinchDist;
        // Spreading thumb and index zooms in, closing zooms out
        this.targetScale = Math.min(
          this.maxScale,
          Math.max(this.minScale, this.targetScale + pinchDelta * 3.5)
        );
      }
      this.lastPinchDist = currentDist;
      this.lastPalmCenter = null;
      return;
    } else {
      this.lastPinchDist = null;
    }

    // 6. OPEN_PALM / POINT (Rotate 3D)
    if ((gesture === GESTURES.OPEN_PALM || gesture === GESTURES.POINT) && details && details.palmCenter) {
      const palm = details.palmCenter;

      if (this.lastPalmCenter !== null) {
        // Mirrored coordinate: hand moving right increases screen X
        const dx = -(palm.x - this.lastPalmCenter.x);
        const dy = palm.y - this.lastPalmCenter.y;

        // Apply rotation based on palm movement
        const rotY = dx * this.sensitivity;
        const rotX = dy * this.sensitivity;

        this.targetRotation.y += rotY;
        this.targetRotation.x += rotX;

        // Impart momentum
        this.rotationVelocity.x = rotX * 0.4;
        this.rotationVelocity.y = rotY * 0.4;
      }

      this.lastPalmCenter = { x: palm.x, y: palm.y, z: palm.z };
      return;
    } else {
      this.lastPalmCenter = null;
    }
  }

  // Mouse / Touch Fallback handlers
  onPointerDown(e) {
    this.isDragging = true;
    this.lastMousePos = { x: e.clientX, y: e.clientY };
  }

  onPointerMove(e) {
    if (!this.isDragging) return;
    const dx = (e.clientX - this.lastMousePos.x) * 0.008;
    const dy = (e.clientY - this.lastMousePos.y) * 0.008;

    this.targetRotation.y += dx;
    this.targetRotation.x += dy;

    this.rotationVelocity.x = dy * 0.3;
    this.rotationVelocity.y = dx * 0.3;

    this.lastMousePos = { x: e.clientX, y: e.clientY };
  }

  onPointerUp() {
    this.isDragging = false;
  }

  onWheel(e) {
    e.preventDefault();
    const zoomDelta = -e.deltaY * 0.0015;
    this.targetScale = Math.min(
      this.maxScale,
      Math.max(this.minScale, this.targetScale + zoomDelta)
    );
  }

  // Per-frame physics update
  update(delta = 0.016) {
    const lerpSpeed = 0.12;

    if (!this.isFrozen) {
      // Idle auto-rotation when not actively being manipulated
      if (this.autoRotate && !this.isDragging && !this.lastPalmCenter) {
        this.targetRotation.y += this.autoRotateSpeed;
      }

      // Decay velocity inertia
      this.targetRotation.x += this.rotationVelocity.x;
      this.targetRotation.y += this.rotationVelocity.y;
      this.rotationVelocity.x *= 0.92;
      this.rotationVelocity.y *= 0.92;
    }

    // Clamp pitch to avoid extreme flips
    this.targetRotation.x = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, this.targetRotation.x));

    // Smooth LERP to target
    this.rotation.x += (this.targetRotation.x - this.rotation.x) * lerpSpeed;
    this.rotation.y += (this.targetRotation.y - this.rotation.y) * lerpSpeed;
    this.rotation.z += (this.targetRotation.z - this.rotation.z) * lerpSpeed;

    this.scale += (this.targetScale - this.scale) * lerpSpeed;

    this.position.x += (this.targetPosition.x - this.position.x) * lerpSpeed;
    this.position.y += (this.targetPosition.y - this.position.y) * lerpSpeed;
    this.position.z += (this.targetPosition.z - this.position.z) * lerpSpeed;

    this.unwindFactor += (this.targetUnwindFactor - this.unwindFactor) * 0.06;

    return {
      rotation: this.rotation,
      scale: this.scale,
      position: this.position,
      unwindFactor: this.unwindFactor
    };
  }
}
