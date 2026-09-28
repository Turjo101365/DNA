/**
 * Landmark Indices reference:
 * 0: WRIST
 * 1-4: THUMB (CMC, MCP, IP, TIP)
 * 5-8: INDEX (MCP, PIP, DIP, TIP)
 * 9-12: MIDDLE (MCP, PIP, DIP, TIP)
 * 13-16: RING (MCP, PIP, DIP, TIP)
 * 17-20: PINKY (MCP, PIP, DIP, TIP)
 */

export const GESTURES = {
  NONE: 'NONE',
  OPEN_PALM: 'OPEN_PALM',     // Rotate / Pan
  PINCH: 'PINCH',             // Zoom in/out
  FIST: 'FIST',               // Lock / Freeze rotation
  PEACE: 'PEACE',             // Unwind / Mutate mode
  POINT: 'POINT',             // Precision inspect
  THUMBS_UP: 'THUMBS_UP',     // Reset position
  TWO_HAND_ZOOM: 'TWO_HAND_ZOOM'
};

// Euclidean distance between two 2D/3D points
export function getDistance(p1, p2, use3D = false) {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  if (use3D && p1.z !== undefined && p2.z !== undefined) {
    const dz = p1.z - p2.z;
    return Math.hypot(dx, dy, dz);
  }
  return Math.hypot(dx, dy);
}

// Calculate hand scale reference (Wrist to Middle Finger MCP)
export function getHandScale(landmarks) {
  return getDistance(landmarks[0], landmarks[9]) || 0.1;
}

// Check if a finger is extended
export function isFingerExtended(landmarks, tipIdx, pipIdx, mcpIdx) {
  const wrist = landmarks[0];
  const tipDist = getDistance(wrist, landmarks[tipIdx]);
  const pipDist = getDistance(wrist, landmarks[pipIdx]);
  const mcpDist = getDistance(wrist, landmarks[mcpIdx]);
  return tipDist > pipDist * 1.15 && tipDist > mcpDist * 1.3;
}

// Check if thumb is extended
export function isThumbExtended(landmarks) {
  const thumbTip = landmarks[4];
  const indexMcp = landmarks[5];
  const pinkyMcp = landmarks[17];
  const wrist = landmarks[0];

  const distToPinky = getDistance(thumbTip, pinkyMcp);
  const mcpToPinky = getDistance(indexMcp, pinkyMcp);
  const distToWrist = getDistance(thumbTip, wrist);
  const thumbMcpToWrist = getDistance(landmarks[2], wrist);

  return distToPinky > mcpToPinky * 0.9 && distToWrist > thumbMcpToWrist * 1.1;
}

// Detect Thumbs Up (Thumb points up while all other fingers are curled)
export function isThumbsUp(landmarks) {
  const wrist = landmarks[0];
  const thumbTip = landmarks[4];
  const thumbIp = landmarks[3];

  // All other fingers must NOT be extended
  const indexExt = isFingerExtended(landmarks, 8, 6, 5);
  const middleExt = isFingerExtended(landmarks, 12, 10, 9);
  const ringExt = isFingerExtended(landmarks, 16, 14, 13);
  const pinkyExt = isFingerExtended(landmarks, 20, 18, 17);

  if (indexExt || middleExt || ringExt || pinkyExt) return false;

  // Thumb tip should be higher than wrist and IP (y is inverted in screen coords: lower y is higher on screen)
  const thumbPointingUp = thumbTip.y < thumbIp.y && thumbTip.y < wrist.y - 0.1;
  return thumbPointingUp;
}

// Detect single hand gesture
export function detectHandGesture(landmarks) {
  if (!landmarks || landmarks.length < 21) {
    return { gesture: GESTURES.NONE, confidence: 0, details: {} };
  }

  const handScale = getHandScale(landmarks);

  const thumbExtended = isThumbExtended(landmarks);
  const indexExtended = isFingerExtended(landmarks, 8, 6, 5);
  const middleExtended = isFingerExtended(landmarks, 12, 10, 9);
  const ringExtended = isFingerExtended(landmarks, 16, 14, 13);
  const pinkyExtended = isFingerExtended(landmarks, 20, 18, 17);

  // Pinch detection: Thumb Tip (4) to Index Tip (8)
  const pinchDistanceRaw = getDistance(landmarks[4], landmarks[8]);
  const normalizedPinchDist = pinchDistanceRaw / handScale;
  const isPinching = normalizedPinchDist < 0.28;

  // Palm center (approximate average of wrist and knuckles)
  const palmCenter = {
    x: (landmarks[0].x + landmarks[5].x + landmarks[9].x + landmarks[13].x + landmarks[17].x) / 5,
    y: (landmarks[0].y + landmarks[5].y + landmarks[9].y + landmarks[13].y + landmarks[17].y) / 5,
    z: (landmarks[0].z + landmarks[5].z + landmarks[9].z + landmarks[13].z + landmarks[17].z) / 5
  };

  // 1. Check Thumbs Up
  if (isThumbsUp(landmarks)) {
    return {
      gesture: GESTURES.THUMBS_UP,
      confidence: 0.95,
      details: { palmCenter, handScale }
    };
  }

  // 2. Check Pinch
  if (isPinching) {
    return {
      gesture: GESTURES.PINCH,
      confidence: Math.max(0.7, 1 - normalizedPinchDist),
      details: {
        pinchDistance: normalizedPinchDist,
        pinchCenter: {
          x: (landmarks[4].x + landmarks[8].x) / 2,
          y: (landmarks[4].y + landmarks[8].y) / 2,
        },
        palmCenter,
        handScale
      }
    };
  }

  // Count extended fingers
  const extendedCount = [indexExtended, middleExtended, ringExtended, pinkyExtended].filter(Boolean).length;

  // 3. Peace / V-sign (Index & Middle extended, Ring & Pinky curled)
  if (indexExtended && middleExtended && !ringExtended && !pinkyExtended) {
    return {
      gesture: GESTURES.PEACE,
      confidence: 0.9,
      details: { palmCenter, handScale }
    };
  }

  // 4. Point (Index extended only)
  if (indexExtended && !middleExtended && !ringExtended && !pinkyExtended) {
    return {
      gesture: GESTURES.POINT,
      confidence: 0.9,
      details: {
        pointTip: landmarks[8],
        palmCenter,
        handScale
      }
    };
  }

  // 5. Fist (All fingers curled)
  if (extendedCount === 0 && !thumbExtended) {
    return {
      gesture: GESTURES.FIST,
      confidence: 0.92,
      details: { palmCenter, handScale }
    };
  }

  // 6. Open Palm (At least 3-4 fingers clearly extended)
  if (extendedCount >= 3) {
    return {
      gesture: GESTURES.OPEN_PALM,
      confidence: extendedCount === 4 ? 0.95 : 0.8,
      details: { palmCenter, handScale }
    };
  }

  return {
    gesture: GESTURES.NONE,
    confidence: 0.5,
    details: { palmCenter, handScale }
  };
}

// Multi-hand gesture detection (e.g. 2 hands)
export function detectMultiHandGesture(handsLandmarks) {
  if (!handsLandmarks || handsLandmarks.length === 0) {
    return { gesture: GESTURES.NONE, hands: [] };
  }

  const individualResults = handsLandmarks.map((landmarks, idx) => ({
    handIndex: idx,
    ...detectHandGesture(landmarks)
  }));

  // Check two-hand interaction
  if (handsLandmarks.length >= 2) {
    const hand1Center = individualResults[0].details.palmCenter;
    const hand2Center = individualResults[1].details.palmCenter;

    if (hand1Center && hand2Center) {
      const distanceBetweenHands = getDistance(hand1Center, hand2Center);
      return {
        gesture: GESTURES.TWO_HAND_ZOOM,
        confidence: 0.95,
        hands: individualResults,
        twoHandDistance: distanceBetweenHands,
        midPoint: {
          x: (hand1Center.x + hand2Center.x) / 2,
          y: (hand1Center.y + hand2Center.y) / 2
        }
      };
    }
  }

  return {
    gesture: individualResults[0].gesture,
    confidence: individualResults[0].confidence,
    hands: individualResults,
    details: individualResults[0].details
  };
}
