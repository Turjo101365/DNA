import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Info, Dna, Eye, Layers } from 'lucide-react';

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
  onReset
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [hoveredBase, setHoveredBase] = useState(null);
  const [modelLoading, setModelLoading] = useState(false);
  const [dnaStats, setDnaStats] = useState({ basePairs: 36, lengthNm: '12.2 nm' });

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

    // 5. DNA Model Hierarchy
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

        const rung1 = new THREE.Mesh(cylinderGeo, baseMaterials[b1]);
        rung1.scale.set(radius * 0.95, 1, 1);
        rung1.userData = { baseType: b1, pairIndex: i };
        group.add(rung1);
        interactiveBaseMeshes.push(rung1);

        const rung2 = new THREE.Mesh(cylinderGeo, baseMaterials[b2]);
        rung2.scale.set(radius * 0.95, 1, 1);
        rung2.userData = { baseType: b2, pairIndex: i };
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
              child.userData = { baseType: parts[2] || 'A', pairIndex: parseInt(parts[1], 10) || 0 };
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

    // 6. Raycasting for Base Pair Tooltip
    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2();

    const handlePointerMoveRaycast = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseVector.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseVector.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouseVector, camera);
      const intersects = raycaster.intersectObjects(interactiveBaseMeshes, false);

      if (intersects.length > 0 && intersects[0].object.userData.baseType) {
        const type = intersects[0].object.userData.baseType;
        if (BASE_PAIR_INFO[type]) {
          setHoveredBase({
            ...BASE_PAIR_INFO[type],
            clientX: e.clientX,
            clientY: e.clientY
          });
          return;
        }
      }
      setHoveredBase(null);
    };

    // 7. Event Listeners for Mouse/Touch interaction
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
    let animationId;
    const clock = new THREE.Clock();

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
          const twist = (1 - state.unwindFactor * 0.95) * 0.35; // uncoils into parallel ladder

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

      renderer.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, [useGlbModel]);

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

      {/* Base Pair Hover Molecular Inspector Card */}
      {hoveredBase && (
        <div
          className="fixed pointer-events-none z-50 p-4 rounded-2xl backdrop-blur-xl bg-slate-950/90 border border-cyan-500/50 shadow-[0_0_30px_rgba(0,240,255,0.25)] text-slate-100 max-w-xs transition-opacity duration-150"
          style={{
            left: `${Math.min(window.innerWidth - 320, hoveredBase.clientX + 20)}px`,
            top: `${Math.min(window.innerHeight - 200, hoveredBase.clientY - 40)}px`
          }}
        >
          <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-2 mb-2">
            <div className="font-bold text-sm font-['Orbitron']" style={{ color: hoveredBase.color }}>
              {hoveredBase.name}
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 font-mono">
              {hoveredBase.formula}
            </span>
          </div>
          <div className="text-xs space-y-1.5 font-['Rajdhani'] font-medium">
            <div className="text-slate-300">
              <span className="text-slate-400">Class:</span> {hoveredBase.type}
            </div>
            <div className="text-slate-300">
              <span className="text-slate-400">Pairing:</span> {hoveredBase.complement} ({hoveredBase.bonds})
            </div>
            <p className="text-[11px] text-slate-400 leading-tight pt-1 font-sans">
              {hoveredBase.desc}
            </p>
          </div>
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
