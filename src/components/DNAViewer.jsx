import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Info, Dna, Eye, Layers, Activity } from 'lucide-react';

const BASE_PAIR_INFO = {
  A: {
    name: 'Adenine (A)',
    type: 'Purine Nucleobase',
    formula: 'C₅H₅N₅',
    complement: 'Thymine (T)',
    bonds: '2 Hydrogen Bonds',
    desc: 'Forms complementary base pairs with Thymine. Essential in cellular respiration (ATP).',
    color: '#00f0ff'
  },
  T: {
    name: 'Thymine (T)',
    type: 'Pyrimidine Nucleobase',
    formula: 'C₅H₆N₂O₂',
    complement: 'Adenine (A)',
    bonds: '2 Hydrogen Bonds',
    desc: 'Pairs exclusively with Adenine in DNA double-helical stabilization.',
    color: '#ff3366'
  },
  G: {
    name: 'Guanine (G)',
    type: 'Purine Nucleobase',
    formula: 'C₅H₅N₅O',
    complement: 'Cytosine (C)',
    bonds: '3 Hydrogen Bonds',
    desc: 'Forms robust 3-bond pairs with Cytosine, providing high thermal stability.',
    color: '#00ff88'
  },
  C: {
    name: 'Cytosine (C)',
    type: 'Pyrimidine Nucleobase',
    formula: 'C₄H₅N₃O',
    complement: 'Guanine (G)',
    bonds: '3 Hydrogen Bonds',
    desc: 'Crucial for epigenetic DNA methylation and gene regulation.',
    color: '#ffaa00'
  }
};

export default function DNAViewer({
  controls,
  useGlbModel = true,
  onModelToggle,
  onReset,
  handData = null,
  isCameraActive = true
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [activeBase, setActiveBase] = useState(null);
  const [handCursor, setHandCursor] = useState(null);
  const [modelLoading, setModelLoading] = useState(false);
  const [dnaStats, setDnaStats] = useState({ basePairs: 36, lengthNm: '12.2 nm' });

  // Keep handData updated in a ref so Three.js render loop accesses it without re-mounting
  const handDataRef = useRef(handData);
  useEffect(() => {
    handDataRef.current = handData;
  }, [handData]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050811, 0.025);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 16);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0x1a2639, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x00d2ff, 3.5);
    keyLight.position.set(10, 15, 10);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xff007f, 2.8);
    rimLight.position.set(-10, -10, -10);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0x00ffaa, 2.0, 30);
    fillLight.position.set(0, 0, 8);
    scene.add(fillLight);

    // 4. Floating Ambient Bio-particles
    const particleCount = 450;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 40;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 30;

      const isCyan = Math.random() > 0.4;
      particleColors[i * 3] = isCyan ? 0.0 : 1.0;
      particleColors[i * 3 + 1] = isCyan ? 0.9 : 0.2;
      particleColors[i * 3 + 2] = 1.0;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.14,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 5. 3D Holographic Focal Targeting Ring Beacons
    const beaconGeo = new THREE.RingGeometry(0.38, 0.48, 32);
    const beaconMat = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.95,
      depthTest: false
    });
    const beaconRing = new THREE.Mesh(beaconGeo, beaconMat);
    beaconRing.renderOrder = 999;
    beaconRing.visible = false;
    scene.add(beaconRing);

    const outerRingGeo = new THREE.RingGeometry(0.58, 0.64, 32);
    const outerRingMat = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
      wireframe: true,
      depthTest: false
    });
    const outerBeaconRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    outerBeaconRing.renderOrder = 999;
    outerBeaconRing.visible = false;
    scene.add(outerBeaconRing);

    // 6. DNA Model Hierarchy
    const mainDnaGroup = new THREE.Group();
    scene.add(mainDnaGroup);

    let loadedGlbMesh = null;
    let proceduralDnaGroup = null;

    // Procedural DNA Generator supporting dynamic uncoiling
    const numPairs = 36;
    const radius = 2.4;
    const heightStep = 0.55;
    const basePairsSequence = [
      ['A', 'T'], ['G', 'C'], ['T', 'A'], ['C', 'G'],
      ['A', 'T'], ['A', 'T'], ['G', 'C'], ['C', 'G'],
      ['T', 'A'], ['G', 'C'], ['A', 'T'], ['C', 'G']
    ];

    const baseMaterials = {
      A: new THREE.MeshStandardMaterial({ color: 0x00f0ff, roughness: 0.25, metalness: 0.4, emissive: 0x004050 }),
      T: new THREE.MeshStandardMaterial({ color: 0xff3366, roughness: 0.25, metalness: 0.4, emissive: 0x501020 }),
      G: new THREE.MeshStandardMaterial({ color: 0x00ff88, roughness: 0.25, metalness: 0.4, emissive: 0x005025 }),
      C: new THREE.MeshStandardMaterial({ color: 0xffaa00, roughness: 0.25, metalness: 0.4, emissive: 0x503500 })
    };

    const backboneMat1 = new THREE.MeshStandardMaterial({
      color: 0x00d2ff,
      roughness: 0.2,
      metalness: 0.8,
      emissive: 0x002244
    });

    const backboneMat2 = new THREE.MeshStandardMaterial({
      color: 0xff0088,
      roughness: 0.2,
      metalness: 0.8,
      emissive: 0x440022
    });

    const sphereGeo = new THREE.SphereGeometry(0.32, 16, 16);
    const cylinderGeo = new THREE.CylinderGeometry(0.12, 0.12, 1, 12);
    cylinderGeo.rotateZ(Math.PI / 2);

    const interactiveBaseMeshes = [];

    function buildProceduralDNA() {
      const group = new THREE.Group();
      group.name = 'Procedural_DNA';

      const rungs = [];

      for (let i = 0; i < numPairs; i++) {
        const y = (i - numPairs / 2) * heightStep;
        const [b1, b2] = basePairsSequence[i % basePairsSequence.length];

        const node1 = new THREE.Mesh(sphereGeo, backboneMat1);
        const node2 = new THREE.Mesh(sphereGeo, backboneMat2);
        group.add(node1);
        group.add(node2);

        const rungMat1 = baseMaterials[b1].clone();
        const rung1 = new THREE.Mesh(cylinderGeo, rungMat1);
        rung1.scale.set(radius * 0.95, 1, 1);
        rung1.userData = {
          baseType: b1,
          pairIndex: i,
          origEmissive: rungMat1.emissive.getHex(),
          origIntensity: 1.0
        };
        group.add(rung1);
        interactiveBaseMeshes.push(rung1);

        const rungMat2 = baseMaterials[b2].clone();
        const rung2 = new THREE.Mesh(cylinderGeo, rungMat2);
        rung2.scale.set(radius * 0.95, 1, 1);
        rung2.userData = {
          baseType: b2,
          pairIndex: i,
          origEmissive: rungMat2.emissive.getHex(),
          origIntensity: 1.0
        };
        group.add(rung2);
        interactiveBaseMeshes.push(rung2);

        const hydrogenBond = new THREE.Mesh(
          new THREE.SphereGeometry(0.14, 10, 10),
          new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1, metalness: 0.9, emissive: 0x333333 })
        );
        group.add(hydrogenBond);

        rungs.push({ node1, node2, rung1, rung2, hydrogenBond, y, index: i });
      }

      group.userData = { rungs };
      return group;
    }

    proceduralDnaGroup = buildProceduralDNA();
    mainDnaGroup.add(proceduralDnaGroup);

    // Try loading GLB model
    const loader = new GLTFLoader();
    setModelLoading(true);

    loader.load(
      '/models/dna.glb',
      (gltf) => {
        loadedGlbMesh = gltf.scene;
        loadedGlbMesh.name = 'GLB_DNA';

        // Tag child meshes for raycasting
        loadedGlbMesh.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.name.includes('BasePair')) {
              const parts = child.name.split('_');
              const baseType = parts[2] || 'A';
              const pairIndex = parseInt(parts[1], 10) || 0;
              if (child.material) {
                child.material = child.material.clone();
                child.userData = {
                  baseType,
                  pairIndex,
                  origEmissive: child.material.emissive ? child.material.emissive.getHex() : 0x000000,
                  origIntensity: child.material.emissiveIntensity || 1.0
                };
              }
              interactiveBaseMeshes.push(child);
            }
          }
        });

        if (useGlbModel) {
          proceduralDnaGroup.visible = false;
          mainDnaGroup.add(loadedGlbMesh);
        } else {
          loadedGlbMesh.visible = false;
          mainDnaGroup.add(loadedGlbMesh);
        }
        setModelLoading(false);
      },
      undefined,
      (err) => {
        console.warn('GLB load error, using procedural model:', err);
        setModelLoading(false);
        proceduralDnaGroup.visible = true;
      }
    );

    // 7. Dynamic Mesh Highlighting
    let currentHighlightedMesh = null;

    const highlightMesh = (mesh) => {
      if (currentHighlightedMesh === mesh) return;
      if (currentHighlightedMesh && currentHighlightedMesh.material && currentHighlightedMesh.material.emissive) {
        currentHighlightedMesh.material.emissive.setHex(currentHighlightedMesh.userData.origEmissive || 0x000000);
        currentHighlightedMesh.material.emissiveIntensity = currentHighlightedMesh.userData.origIntensity || 1.0;
      }
      currentHighlightedMesh = mesh;
      if (mesh && mesh.material && mesh.material.emissive) {
        mesh.material.emissive.setHex(0xffffff);
        mesh.material.emissiveIntensity = 2.8;
      }
    };

    const clearHighlight = () => {
      if (currentHighlightedMesh && currentHighlightedMesh.material && currentHighlightedMesh.material.emissive) {
        currentHighlightedMesh.material.emissive.setHex(currentHighlightedMesh.userData.origEmissive || 0x000000);
        currentHighlightedMesh.material.emissiveIntensity = currentHighlightedMesh.userData.origIntensity || 1.0;
      }
      currentHighlightedMesh = null;
    };

    // 8. Raycasting Engine
    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2();
    let lastMouseTime = 0;

    const handlePointerMoveRaycast = (e) => {
      lastMouseTime = performance.now();
      const rect = canvas.getBoundingClientRect();
      mouseVector.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseVector.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouseVector, camera);
      const intersects = raycaster.intersectObjects(interactiveBaseMeshes, false);

      if (intersects.length > 0 && intersects[0].object.userData.baseType) {
        const obj = intersects[0].object;
        const type = obj.userData.baseType;
        const pIndex = obj.userData.pairIndex;
        if (BASE_PAIR_INFO[type]) {
          highlightMesh(obj);
          beaconRing.visible = false;
          outerBeaconRing.visible = false;
          setActiveBase({
            ...BASE_PAIR_INFO[type],
            pairIndex: pIndex !== undefined ? pIndex + 1 : undefined,
            totalPairs: numPairs,
            clientX: Math.round(e.clientX),
            clientY: Math.round(e.clientY),
            isHandSimulation: false
          });
          return;
        }
      }
      clearHighlight();
      setActiveBase(null);
    };

    // 9. Event Listeners for Mouse/Touch interaction
    const onMouseDown = (e) => {
      controls?.onPointerDown(e);
    };
    const onMouseMove = (e) => {
      controls?.onPointerMove(e);
      handlePointerMoveRaycast(e);
    };
    const onMouseUp = (e) => {
      controls?.onPointerUp(e);
    };
    const onWheel = (e) => {
      controls?.onWheel(e);
    };

    canvas.addEventListener('pointerdown', onMouseDown);
    window.addEventListener('pointermove', onMouseMove);
    window.addEventListener('pointerup', onMouseUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });

    // 10. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // 11. Animation Loop & Real-Time Gestural Telemetry
    let animationId;
    const clock = new THREE.Clock();
    let lastUiUpdateTime = 0;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Gentle floating particles
      particles.rotation.y = elapsed * 0.02;
      particles.rotation.x = Math.sin(elapsed * 0.015) * 0.05;

      // Update smooth physics from controls
      if (controls) {
        const state = controls.update(delta);

        mainDnaGroup.rotation.x = state.rotation.x;
        mainDnaGroup.rotation.y = state.rotation.y;
        mainDnaGroup.rotation.z = state.rotation.z;

        mainDnaGroup.scale.set(state.scale, state.scale, state.scale);
        mainDnaGroup.position.set(state.position.x, state.position.y, state.position.z);

        // Animate procedural dynamic uncoiling / twist
        if (proceduralDnaGroup && proceduralDnaGroup.visible) {
          const rungs = proceduralDnaGroup.userData.rungs;
          const twist = (1 - state.unwindFactor * 0.95) * 0.35;

          rungs.forEach((rungData) => {
            const angle = rungData.index * twist;
            const y = rungData.y;

            const x1 = Math.cos(angle) * radius;
            const z1 = Math.sin(angle) * radius;
            const x2 = Math.cos(angle + Math.PI) * radius;
            const z2 = Math.sin(angle + Math.PI) * radius;

            const p1 = new THREE.Vector3(x1, y, z1);
            const p2 = new THREE.Vector3(x2, y, z2);

            rungData.node1.position.copy(p1);
            rungData.node2.position.copy(p2);

            const dir1 = new THREE.Vector3().subVectors(new THREE.Vector3(0, y, 0), p1).normalize();
            const mid1 = new THREE.Vector3().lerpVectors(p1, new THREE.Vector3(0, y, 0), 0.5);
            rungData.rung1.position.copy(mid1);
            rungData.rung1.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), dir1);

            const dir2 = new THREE.Vector3().subVectors(new THREE.Vector3(0, y, 0), p2).normalize();
            const mid2 = new THREE.Vector3().lerpVectors(p2, new THREE.Vector3(0, y, 0), 0.5);
            rungData.rung2.position.copy(mid2);
            rungData.rung2.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), dir2);

            rungData.hydrogenBond.position.set(0, y, 0);
          });
        }
      }

      // Check Hand Gesture Inspection & Telemetry
      const now = performance.now();
      const isMouseActive = now - lastMouseTime < 1200;
      const currentHandData = handDataRef.current;
      const hasHands = currentHandData && currentHandData.landmarks && currentHandData.landmarks.length > 0;

      if (!isMouseActive && hasHands) {
        const primaryLandmarks = currentHandData.landmarks[0];
        const activeGesture = currentHandData.activeGesture || 'NONE';

        // Select tracking point: index tip (8) for POINT, or palm/middle knuckle (9)
        const isPointing = activeGesture === 'POINT';
        const pointerPoint = isPointing ? primaryLandmarks[8] : (primaryLandmarks[9] || primaryLandmarks[0]);

        // Mirrored X for webcam user perspective
        const hScreenX = (1 - pointerPoint.x) * container.clientWidth;
        const hScreenY = pointerPoint.y * container.clientHeight;

        setHandCursor({
          x: Math.round(hScreenX),
          y: Math.round(hScreenY),
          gesture: activeGesture,
          isPointing
        });

        // 1. Try hand pointer raycast first (targeting specific rungs)
        const hNdcX = (hScreenX / container.clientWidth) * 2 - 1;
        const hNdcY = -(hScreenY / container.clientHeight) * 2 + 1;

        raycaster.setFromCamera({ x: hNdcX, y: hNdcY }, camera);
        const handIntersects = raycaster.intersectObjects(interactiveBaseMeshes, false);

        let targetMesh = null;
        let targetType = null;
        let targetPairIndex = null;
        let detectSource = 'point';

        if (handIntersects.length > 0 && handIntersects[0].object.userData.baseType) {
          targetMesh = handIntersects[0].object;
          targetType = targetMesh.userData.baseType;
          targetPairIndex = targetMesh.userData.pairIndex;
        } else {
          // 2. Focal center detection: closest base pair to viewport center during rotation, zoom, or pan
          detectSource = 'focal';
          let minScore = Infinity;
          const tempPos = new THREE.Vector3();

          for (let i = 0; i < interactiveBaseMeshes.length; i++) {
            const mesh = interactiveBaseMeshes[i];
            if (!mesh.visible) continue;

            mesh.getWorldPosition(tempPos);
            tempPos.project(camera);

            // Must be within camera frustum and facing camera
            if (tempPos.z > -1 && tempPos.z < 1) {
              const distToCenter = Math.hypot(tempPos.x, tempPos.y);
              const score = distToCenter * 1.8 + (tempPos.z + 1.0) * 0.35;
              if (score < minScore) {
                minScore = score;
                targetMesh = mesh;
                targetType = mesh.userData.baseType;
                targetPairIndex = mesh.userData.pairIndex;
              }
            }
          }
        }

        if (targetMesh && targetType && BASE_PAIR_INFO[targetType]) {
          highlightMesh(targetMesh);

          const worldPos = new THREE.Vector3();
          targetMesh.getWorldPosition(worldPos);

          // Position 3D holographic beacon over the active nucleotide
          beaconRing.position.copy(worldPos);
          beaconRing.quaternion.copy(camera.quaternion);
          beaconRing.visible = true;

          outerBeaconRing.position.copy(worldPos);
          outerBeaconRing.quaternion.copy(camera.quaternion);
          outerBeaconRing.rotation.z = elapsed * 1.8;
          outerBeaconRing.visible = true;

          const baseColor = BASE_PAIR_INFO[targetType].color;
          beaconMat.color.set(baseColor);
          outerBeaconRing.material.color.set(baseColor);

          const pulse = 1.0 + Math.sin(elapsed * 7) * 0.16;
          beaconRing.scale.set(pulse, pulse, pulse);

          // Project 3D position to 2D screen coordinates
          const projected = worldPos.clone().project(camera);
          const screenX = (projected.x * 0.5 + 0.5) * container.clientWidth;
          const screenY = (-projected.y * 0.5 + 0.5) * container.clientHeight;

          if (now - lastUiUpdateTime > 40) {
            lastUiUpdateTime = now;
            setActiveBase({
              ...BASE_PAIR_INFO[targetType],
              pairIndex: targetPairIndex !== undefined ? targetPairIndex + 1 : undefined,
              totalPairs: numPairs,
              clientX: Math.round(screenX),
              clientY: Math.round(screenY),
              isHandSimulation: true,
              detectSource,
              gesture: activeGesture
            });
          }
        }
      } else {
        beaconRing.visible = false;
        outerBeaconRing.visible = false;
        if (!hasHands) {
          setHandCursor(null);
          if (!isMouseActive) {
            clearHighlight();
            setActiveBase(null);
          }
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Toggle GLB vs Procedural visibility
    if (loadedGlbMesh && proceduralDnaGroup) {
      loadedGlbMesh.visible = useGlbModel;
      proceduralDnaGroup.visible = !useGlbModel;
    }

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('pointerdown', onMouseDown);
      window.removeEventListener('pointermove', onMouseMove);
      window.removeEventListener('pointerup', onMouseUp);
      canvas.removeEventListener('wheel', onWheel);

      clearHighlight();
      beaconGeo.dispose();
      beaconMat.dispose();
      outerRingGeo.dispose();
      outerRingMat.dispose();
      renderer.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, [useGlbModel]);

  // Dynamic Card & Connector Line Layout Calculation
  const cardWidth = 320;
  const cardHeight = 230;
  const isRightHalf = activeBase && activeBase.clientX > (window.innerWidth / 2);
  const cardX = activeBase
    ? isRightHalf
      ? Math.max(24, activeBase.clientX - cardWidth - 36)
      : Math.min(window.innerWidth - cardWidth - 24, activeBase.clientX + 36)
    : 0;
  const cardY = activeBase
    ? Math.min(window.innerHeight - cardHeight - 24, Math.max(84, activeBase.clientY - 60))
    : 0;

  // Leader line endpoint touches card boundary
  const lineAnchorX = isRightHalf ? cardX + cardWidth : cardX;
  const lineAnchorY = cardY + 36;

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden select-none cursor-grab active:cursor-grabbing">
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Model Loading Indicator */}
      {modelLoading && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 pointer-events-none px-4 py-2 rounded-full backdrop-blur-md bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono flex items-center gap-2 animate-pulse">
          <Dna className="w-4 h-4 animate-spin text-cyan-400" />
          <span>SYNTHESIZING 3D NUCLEOTIDE MESH...</span>
        </div>
      )}

      {/* Futuristic Holographic Hand Reticle */}
      {handCursor && (
        <div
          className="fixed pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
          style={{ left: `${handCursor.x}px`, top: `${handCursor.y}px` }}
        >
          <div className="relative flex items-center justify-center w-12 h-12">
            <div className="absolute inset-0 rounded-full border border-cyan-400/60 animate-ping opacity-30" />
            <div
              className="absolute inset-1 rounded-full border border-dashed border-cyan-400/80 animate-spin"
              style={{ animationDuration: '6s' }}
            />
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_12px_#00f0ff]" />

            {/* Gesture Action Mini Badge */}
            <span className="absolute -bottom-5 whitespace-nowrap px-2 py-0.5 rounded bg-black/85 border border-cyan-500/40 text-[9px] font-mono text-cyan-300 tracking-wider shadow-lg">
              {handCursor.gesture === 'POINT'
                ? '👆 POINT TARGET'
                : handCursor.gesture === 'PINCH'
                ? '🤏 OPTICAL ZOOM'
                : handCursor.gesture === 'FIST'
                ? '✊ ROTATION LOCKED'
                : handCursor.gesture === 'PEACE'
                ? '✌️ UNCOIL HELIX'
                : '🖐️ 3D PAN & ROTATE'}
            </span>
          </div>
        </div>
      )}

      {/* Holographic Leader Line & Anchor connecting 3D Base to Telemetry Card */}
      {activeBase && (
        <svg className="fixed inset-0 pointer-events-none z-40 w-full h-full">
          <defs>
            <filter id="neon-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Reticle anchor at nucleotide screen position */}
          <circle
            cx={activeBase.clientX}
            cy={activeBase.clientY}
            r="11"
            fill="none"
            stroke={activeBase.color}
            strokeWidth="1.5"
            strokeDasharray="3 2"
            filter="url(#neon-glow)"
          />
          <circle
            cx={activeBase.clientX}
            cy={activeBase.clientY}
            r="4"
            fill={activeBase.color}
            filter="url(#neon-glow)"
          />

          {/* Glowing connector line to Card */}
          <line
            x1={activeBase.clientX}
            y1={activeBase.clientY}
            x2={lineAnchorX}
            y2={lineAnchorY}
            stroke={activeBase.color}
            strokeWidth="1.5"
            strokeDasharray="4 3"
            opacity="0.8"
            filter="url(#neon-glow)"
          />
          <circle
            cx={lineAnchorX}
            cy={lineAnchorY}
            r="3.5"
            fill={activeBase.color}
          />
        </svg>
      )}

      {/* Molecular Inspector & Live Gestural Telemetry Card */}
      {activeBase && (
        <div
          className="fixed pointer-events-none z-50 p-4 rounded-2xl backdrop-blur-xl bg-slate-950/92 border border-cyan-500/50 shadow-[0_0_35px_rgba(0,240,255,0.25)] text-slate-100 w-80 transition-opacity duration-150"
          style={{
            left: `${cardX}px`,
            top: `${cardY}px`
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 border-b border-slate-800/90 pb-2.5 mb-2.5">
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: activeBase.color, boxShadow: `0 0 10px ${activeBase.color}` }}
              />
              <span className="font-bold text-sm font-['Orbitron'] tracking-wide" style={{ color: activeBase.color }}>
                {activeBase.name}
              </span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[10px]">
              {activeBase.pairIndex && (
                <span className="px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
                  PAIR #{activeBase.pairIndex}
                </span>
              )}
              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                {activeBase.formula}
              </span>
            </div>
          </div>

          {/* Molecular Classification & Pairing Details */}
          <div className="text-xs space-y-1.5 font-['Rajdhani'] font-medium">
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400">Class:</span>
              <span className="font-mono text-cyan-200">{activeBase.type}</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400">Complementary Base:</span>
              <span className="font-mono text-emerald-300">{activeBase.complement}</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400">Bond Strength:</span>
              <span className="font-mono text-amber-300">{activeBase.bonds}</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-tight pt-1.5 border-t border-slate-800/60 font-sans">
              {activeBase.desc}
            </p>
          </div>

          {/* Live Gesture Tracking Telemetry Status Badge */}
          {activeBase.isHandSimulation && (
            <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-cyan-400">
              <div className="flex items-center gap-1.5">
                <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
                <span>CAMERA SENSOR ACTIVE</span>
              </div>
              <span className="text-slate-400 uppercase">
                {activeBase.detectSource === 'point' ? '👆 DIRECT POINT' : '👁️ FOCAL IN-VIEW'}
              </span>
            </div>
          )}
        </div>
      )}

      {/* DNA Helix Molecular Legend */}
      <div className="absolute bottom-6 left-6 pointer-events-auto backdrop-blur-md bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3 text-slate-300 text-xs font-mono shadow-2xl flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          <span>Nucleobase Key</span>
          <span className="text-cyan-400">36 Base Pairs</span>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00f0ff] shadow-[0_0_8px_#00f0ff]" />
            <span className="font-medium text-slate-200">Adenine (A)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff3366] shadow-[0_0_8px_#ff3366]" />
            <span className="font-medium text-slate-200">Thymine (T)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00ff88] shadow-[0_0_8px_#00ff88]" />
            <span className="font-medium text-slate-200">Guanine (G)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffaa00] shadow-[0_0_8px_#ffaa00]" />
            <span className="font-medium text-slate-200">Cytosine (C)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
