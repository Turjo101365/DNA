import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Info, Sparkles, Activity } from 'lucide-react';
import { createBeatingHeart, HEART_ANATOMY_INFO } from '../models3d/heartModel';
import { createNeuralBrain, BRAIN_ANATOMY_INFO } from '../models3d/brainModel';
import { createRespiratoryLungs, LUNGS_ANATOMY_INFO } from '../models3d/lungsModel';
import { createVisceralOrgans, VISCERAL_ANATOMY_INFO } from '../models3d/visceralModel';
import { createProceduralDNA, DNA_ANATOMY_INFO } from '../models3d/dnaModel';

export default function AnatomyViewer({
  controls,
  activeOrgan = 'HEART',
  heartBpm = 72,
  brainWaveMode = 'Beta',
  lungBreathRate = 16,
  useGlbModel = true
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  const [hoveredData, setHoveredData] = useState(null);

  // References to dynamic model controllers
  const modelsRef = useRef({});

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050811, 0.022);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 16);

    // 2. Renderer Setup
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    // 3. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0x1a2639, 2.0);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x00d2ff, 3.8);
    keyLight.position.set(10, 15, 12);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xff007f, 3.0);
    rimLight.position.set(-12, -10, -10);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0x00ffaa, 2.4, 35);
    fillLight.position.set(0, 0, 10);
    scene.add(fillLight);

    // 4. Ambient Floating Bio-particles
    const particleCount = 450;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 45;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 45;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 35;

      const isCyan = Math.random() > 0.45;
      particleColors[i * 3] = isCyan ? 0.0 : 1.0;
      particleColors[i * 3 + 1] = isCyan ? 0.85 : 0.2;
      particleColors[i * 3 + 2] = 1.0;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.14,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 5. Build Anatomical Model Groups
    const mainAnchorGroup = new THREE.Group();
    scene.add(mainAnchorGroup);

    const interactiveMeshes = [];

    // Instantiate all 3D vital organ systems
    const heartGroup = createBeatingHeart(interactiveMeshes);
    const brainGroup = createNeuralBrain(interactiveMeshes);
    const lungsGroup = createRespiratoryLungs(interactiveMeshes);
    const visceralGroup = createVisceralOrgans(interactiveMeshes);
    const proceduralDnaGroup = createProceduralDNA(interactiveMeshes);

    mainAnchorGroup.add(heartGroup);
    mainAnchorGroup.add(brainGroup);
    mainAnchorGroup.add(lungsGroup);
    mainAnchorGroup.add(visceralGroup);
    mainAnchorGroup.add(proceduralDnaGroup);

    let loadedGlbMesh = null;
    const loader = new GLTFLoader();
    loader.load(
      '/models/dna.glb',
      (gltf) => {
        loadedGlbMesh = gltf.scene;
        loadedGlbMesh.name = 'GLB_DNA';
        loadedGlbMesh.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.name.includes('BasePair')) {
              const parts = child.name.split('_');
              child.userData = {
                isAnatomyPart: true,
                organType: 'DNA',
                baseType: parts[2] || 'A',
                pairIndex: parseInt(parts[1], 10) || 0
              };
              interactiveMeshes.push(child);
            }
          }
        });
        loadedGlbMesh.visible = false;
        mainAnchorGroup.add(loadedGlbMesh);
      },
      undefined,
      (err) => console.warn('GLB load fallback to procedural:', err)
    );

    modelsRef.current = {
      HEART: heartGroup,
      BRAIN: brainGroup,
      LUNGS: lungsGroup,
      VISCERAL: visceralGroup,
      DNA: proceduralDnaGroup,
      GLB_DNA: () => loadedGlbMesh
    };

    // 6. Raycasting for Tooltip Inspector
    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2();

    const handlePointerMoveRaycast = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseVector.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseVector.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouseVector, camera);

      // Only raycast visible interactive meshes
      const visibleCandidates = interactiveMeshes.filter((m) => {
        let parent = m;
        while (parent && parent !== scene) {
          if (parent.visible === false) return false;
          parent = parent.parent;
        }
        return true;
      });

      const intersects = raycaster.intersectObjects(visibleCandidates, true);

      if (intersects.length > 0) {
        const obj = intersects[0].object;
        const u = obj.userData || {};

        let info = null;
        if (u.boneKey && HEART_ANATOMY_INFO[u.boneKey]) {
          info = HEART_ANATOMY_INFO[u.boneKey];
        } else if (u.boneKey && BRAIN_ANATOMY_INFO[u.boneKey]) {
          info = BRAIN_ANATOMY_INFO[u.boneKey];
        } else if (u.boneKey && LUNGS_ANATOMY_INFO[u.boneKey]) {
          info = LUNGS_ANATOMY_INFO[u.boneKey];
        } else if (u.boneKey && VISCERAL_ANATOMY_INFO[u.boneKey]) {
          info = VISCERAL_ANATOMY_INFO[u.boneKey];
        } else if (u.baseType && DNA_ANATOMY_INFO[u.baseType]) {
          info = DNA_ANATOMY_INFO[u.baseType];
        }

        if (info) {
          setHoveredData({
            ...info,
            clientX: e.clientX,
            clientY: e.clientY
          });
          return;
        }
      }
      setHoveredData(null);
    };

    // 7. Mouse/Touch Fallback Events
    const onMouseDown = (e) => controls?.onPointerDown(e);
    const onMouseMove = (e) => {
      controls?.onPointerMove(e);
      handlePointerMoveRaycast(e);
    };
    const onMouseUp = (e) => controls?.onPointerUp(e);
    const onWheel = (e) => controls?.onWheel(e);

    canvas.addEventListener('pointerdown', onMouseDown);
    window.addEventListener('pointermove', onMouseMove);
    window.addEventListener('pointerup', onMouseUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });

    // 8. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // 9. Animation Loop
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Ambient particle floating
      particles.rotation.y = elapsed * 0.02;
      particles.rotation.x = Math.sin(elapsed * 0.015) * 0.04;

      // Smooth physics from gesture/mouse controls
      if (controls) {
        const state = controls.update(delta);

        mainAnchorGroup.rotation.x = state.rotation.x;
        mainAnchorGroup.rotation.y = state.rotation.y;
        mainAnchorGroup.rotation.z = state.rotation.z;

        mainAnchorGroup.scale.set(state.scale, state.scale, state.scale);
        mainAnchorGroup.position.set(state.position.x, state.position.y, state.position.z);

        // Organ-specific runtime simulations
        if (heartGroup.visible && heartGroup.userData.animateHeartbeat) {
          heartGroup.userData.animateHeartbeat(delta);
        }

        if (brainGroup.visible && brainGroup.userData.animateBrain) {
          brainGroup.userData.animateBrain(delta, elapsed);
        }

        if (lungsGroup.visible && lungsGroup.userData.animateBreathing) {
          lungsGroup.userData.animateBreathing(delta);
        }

        if (visceralGroup.visible && visceralGroup.userData.animateViscera) {
          visceralGroup.userData.animateViscera(delta, elapsed);
        }

        if (proceduralDnaGroup.visible && proceduralDnaGroup.userData.animateUnwind) {
          proceduralDnaGroup.userData.animateUnwind(state.unwindFactor);
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('pointerdown', onMouseDown);
      window.removeEventListener('pointermove', onMouseMove);
      window.removeEventListener('pointerup', onMouseUp);
      canvas.removeEventListener('wheel', onWheel);

      renderer.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, []);

  // Update dynamic visibility and parameters when activeOrgan or props change
  useEffect(() => {
    const models = modelsRef.current;
    if (!models.HEART) return;

    // Toggle organ visibility
    models.HEART.visible = activeOrgan === 'HEART';
    models.BRAIN.visible = activeOrgan === 'BRAIN';
    models.LUNGS.visible = activeOrgan === 'LUNGS';
    models.VISCERAL.visible = activeOrgan === 'VISCERAL';

    const glbMesh = models.GLB_DNA ? models.GLB_DNA() : null;
    if (activeOrgan === 'DNA') {
      if (useGlbModel && glbMesh) {
        glbMesh.visible = true;
        models.DNA.visible = false;
      } else {
        models.DNA.visible = true;
        if (glbMesh) glbMesh.visible = false;
      }
    } else {
      models.DNA.visible = false;
      if (glbMesh) glbMesh.visible = false;
    }

    // Pass live physiological parameters
    if (models.HEART.userData.setBpm) {
      models.HEART.userData.setBpm(heartBpm);
    }
    if (models.BRAIN.userData.setWaveMode) {
      models.BRAIN.userData.setWaveMode(brainWaveMode);
    }
    if (models.LUNGS.userData.setBreathRate) {
      models.LUNGS.userData.setBreathRate(lungBreathRate);
    }
  }, [activeOrgan, heartBpm, brainWaveMode, lungBreathRate, useGlbModel]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden select-none cursor-grab active:cursor-grabbing"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Hover Anatomical Inspection Hologram Card */}
      {hoveredData && (
        <div
          className="fixed pointer-events-none z-50 p-4 rounded-2xl backdrop-blur-2xl bg-slate-950/90 border border-cyan-500/50 shadow-[0_0_35px_rgba(0,240,255,0.3)] text-slate-100 max-w-sm transition-opacity duration-150"
          style={{
            left: `${Math.min(window.innerWidth - 380, hoveredData.clientX + 20)}px`,
            top: `${Math.min(window.innerHeight - 260, hoveredData.clientY - 40)}px`
          }}
        >
          <div className="flex items-center justify-between gap-3 border-b border-slate-800/80 pb-2 mb-2">
            <div
              className="font-bold text-sm tracking-wide font-['Orbitron'] flex items-center gap-1.5"
              style={{ color: hoveredData.color || '#38bdf8' }}
            >
              <span>{hoveredData.name}</span>
            </div>
            {hoveredData.system && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800/80 text-cyan-300 font-mono">
                {hoveredData.system}
              </span>
            )}
          </div>

          <div className="text-xs space-y-1.5 font-['Rajdhani'] font-medium">
            {hoveredData.latin && (
              <div className="text-slate-400 italic text-[11px]">
                <span className="text-slate-500 not-italic">Latin:</span> {hoveredData.latin}
              </div>
            )}
            {hoveredData.pressure && (
              <div className="text-slate-300">
                <span className="text-slate-400">Hydrodynamic Pressure:</span> {hoveredData.pressure}
              </div>
            )}
            {hoveredData.volume && (
              <div className="text-slate-300">
                <span className="text-slate-400">Capacity / Volume:</span> {hoveredData.volume}
              </div>
            )}
            {hoveredData.neurons && (
              <div className="text-slate-300">
                <span className="text-slate-400">Neural Network:</span> {hoveredData.neurons}
              </div>
            )}
            {hoveredData.capacity && (
              <div className="text-slate-300">
                <span className="text-slate-400">Functional Capacity:</span> {hoveredData.capacity}
              </div>
            )}
            {hoveredData.gfr && (
              <div className="text-slate-300">
                <span className="text-slate-400">Filtration GFR:</span> {hoveredData.gfr}
              </div>
            )}

            <p className="text-[11.5px] text-slate-300 leading-snug pt-1 font-sans border-t border-slate-900">
              {hoveredData.function || hoveredData.desc}
            </p>

            {hoveredData.fact && (
              <div className="p-2 rounded-lg bg-cyan-950/30 border border-cyan-500/20 text-[10.5px] text-cyan-200/90 font-sans leading-tight">
                💡 <span className="font-semibold">Clinical Fact:</span> {hoveredData.fact}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
