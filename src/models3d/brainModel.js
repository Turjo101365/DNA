import * as THREE from 'three';

export const BRAIN_ANATOMY_INFO = {
  Frontal_Lobe: {
    name: 'Frontal Lobe (Cerebral Cortex)',
    latin: 'Lobus frontalis',
    system: 'Central Nervous System',
    neurons: '~16 Billion Cortical Neurons',
    function: 'Governs executive decision making, working memory, emotional regulation, motor control (primary motor cortex), and Broca speech articulation.',
    fact: 'The prefrontal cortex is the last evolutionary brain region to reach complete maturation (around age 25).',
    color: '#a855f7'
  },
  Parietal_Lobe: {
    name: 'Parietal Lobe',
    latin: 'Lobus parietalis',
    system: 'Central Nervous System',
    sensoryInput: 'Primary Somatosensory Cortex',
    function: 'Integrates multi-sensory modalities: spatial awareness, proprioception, tactile touch, temperature, nociception (pain), and mathematical reasoning.',
    fact: 'Contains the sensory homunculus map representing tactile sensitivity of body parts.',
    color: '#3b82f6'
  },
  Temporal_Lobe: {
    name: 'Temporal Lobe & Hippocampus',
    latin: 'Lobus temporalis',
    system: 'Central Nervous System',
    keyCenters: 'Wernicke Area & Limbic Memory',
    function: 'Processes auditory signals, long-term memory encoding, language comprehension, and facial recognition.',
    fact: 'The hippocampus deep inside the temporal lobe transfers short-term memories into permanent cerebral storage.',
    color: '#06b6d4'
  },
  Occipital_Lobe: {
    name: 'Occipital Lobe (Visual Cortex)',
    latin: 'Lobus occipitalis',
    system: 'Central Nervous System',
    bandwidth: '~10 Million bits/sec Visual Telemetry',
    function: 'Primary and secondary visual processing center: decodes color, motion, depth perception, spatial frequency, and visual memory.',
    fact: 'Visual field information crosses in the optic chiasm before arriving at the contralateral visual cortex.',
    color: '#10b981'
  },
  Cerebellum: {
    name: 'Cerebellum (Little Brain)',
    latin: 'Cerebellum',
    system: 'Motor Coordination',
    neurons: '~69 Billion Neurons (80% of Total Brain Neurons)',
    function: 'Calibrates fine-motor balance, postural equilibrium, procedural muscle memory, and microsecond motor timing precision.',
    fact: 'Despite accounting for only 10% of total brain volume, the cerebellum contains over 70-80% of all brain neurons.',
    color: '#f59e0b'
  },
  Brainstem: {
    name: 'Brainstem (Midbrain, Pons & Medulla)',
    latin: 'Truncus encephali',
    system: 'Autonomic Vital Center',
    cranialNerves: 'Cranial Nerves III through XII',
    function: 'Maintains autonomic homeostasis: cardiac rhythm, respiratory drive, vasomotor arterial tone, vomiting/swallowing reflexes, and sleep cycles.',
    fact: 'Direct injury or herniation into the medulla oblongata can cause instantaneous respiratory and cardiac arrest.',
    color: '#ef4444'
  }
};

export function createNeuralBrain(interactiveMeshes = []) {
  const brainGroup = new THREE.Group();
  brainGroup.name = 'Human_Brain_Neural_System';

  // Realistic cerebral cortical shader material with glowing sulci fissures
  const cortexMaterial = new THREE.MeshStandardMaterial({
    color: 0xc084fc,
    roughness: 0.45,
    metalness: 0.15,
    emissive: 0x3b0764,
    emissiveIntensity: 0.5
  });

  const frontalMaterial = new THREE.MeshStandardMaterial({
    color: 0x9333ea,
    roughness: 0.4,
    metalness: 0.2,
    emissive: 0x581c87,
    emissiveIntensity: 0.45
  });

  const parietalMaterial = new THREE.MeshStandardMaterial({
    color: 0x3b82f6,
    roughness: 0.4,
    metalness: 0.2,
    emissive: 0x1e3a8a,
    emissiveIntensity: 0.45
  });

  const temporalMaterial = new THREE.MeshStandardMaterial({
    color: 0x06b6d4,
    roughness: 0.4,
    metalness: 0.2,
    emissive: 0x164e63,
    emissiveIntensity: 0.45
  });

  const occipitalMaterial = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    roughness: 0.4,
    metalness: 0.2,
    emissive: 0x064e3b,
    emissiveIntensity: 0.45
  });

  const cerebellumMaterial = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.5,
    metalness: 0.1,
    emissive: 0x78350f,
    emissiveIntensity: 0.45
  });

  const brainstemMaterial = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    roughness: 0.35,
    metalness: 0.3,
    emissive: 0x7f1d1d,
    emissiveIntensity: 0.4
  });

  function registerBrainPart(mesh, partKey) {
    mesh.userData = {
      isAnatomyPart: true,
      organType: 'BRAIN',
      boneKey: partKey
    };
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    interactiveMeshes.push(mesh);
    return mesh;
  }

  // ==========================================
  // 1. CEREBRAL HEMISPHERES & LOBES
  // ==========================================
  const cerebrumGroup = new THREE.Group();

  // Create deformed gyri lobe geometries
  function createLobeMesh(scaleX, scaleY, scaleZ, mat, partKey, posX, posY, posZ) {
    const geo = new THREE.SphereGeometry(1.0, 24, 20);
    // Displace vertices slightly to mimic convolutions of gyri and sulci
    const posAttr = geo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const vx = posAttr.getX(i);
      const vy = posAttr.getY(i);
      const vz = posAttr.getZ(i);
      const noise = (Math.sin(vx * 7) + Math.cos(vy * 7) + Math.sin(vz * 7)) * 0.04;
      posAttr.setXYZ(i, vx + vx * noise, vy + vy * noise, vz + vz * noise);
    }
    geo.computeVertexNormals();
    geo.scale(scaleX, scaleY, scaleZ);

    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(posX, posY, posZ);
    registerBrainPart(mesh, partKey);
    return mesh;
  }

  // Frontal Lobes (Anterior & Superior)
  const leftFrontal = createLobeMesh(0.85, 0.95, 1.05, frontalMaterial, 'Frontal_Lobe', -0.75, 0.5, 0.75);
  const rightFrontal = createLobeMesh(0.85, 0.95, 1.05, frontalMaterial, 'Frontal_Lobe', 0.75, 0.5, 0.75);
  cerebrumGroup.add(leftFrontal);
  cerebrumGroup.add(rightFrontal);

  // Parietal Lobes (Superior & Posterior)
  const leftParietal = createLobeMesh(0.88, 0.92, 0.95, parietalMaterial, 'Parietal_Lobe', -0.78, 0.65, -0.35);
  const rightParietal = createLobeMesh(0.88, 0.92, 0.95, parietalMaterial, 'Parietal_Lobe', 0.78, 0.65, -0.35);
  cerebrumGroup.add(leftParietal);
  cerebrumGroup.add(rightParietal);

  // Temporal Lobes (Lateral & Inferior)
  const leftTemporal = createLobeMesh(0.75, 0.7, 1.1, temporalMaterial, 'Temporal_Lobe', -1.15, -0.2, 0.15);
  const rightTemporal = createLobeMesh(0.75, 0.7, 1.1, temporalMaterial, 'Temporal_Lobe', 1.15, -0.2, 0.15);
  cerebrumGroup.add(leftTemporal);
  cerebrumGroup.add(rightTemporal);

  // Occipital Lobes (Posterior Pole)
  const leftOccipital = createLobeMesh(0.75, 0.78, 0.82, occipitalMaterial, 'Occipital_Lobe', -0.7, 0.1, -1.35);
  const rightOccipital = createLobeMesh(0.75, 0.78, 0.82, occipitalMaterial, 'Occipital_Lobe', 0.7, 0.1, -1.35);
  cerebrumGroup.add(leftOccipital);
  cerebrumGroup.add(rightOccipital);

  brainGroup.add(cerebrumGroup);

  // ==========================================
  // 2. CEREBELLUM (Foliated Posterior)
  // ==========================================
  const cerebellumGroup = new THREE.Group();
  const leftCerebellumGeo = new THREE.SphereGeometry(0.72, 20, 16);
  leftCerebellumGeo.scale(0.85, 0.65, 0.8);
  const leftCerebellum = new THREE.Mesh(leftCerebellumGeo, cerebellumMaterial);
  leftCerebellum.position.set(-0.62, -0.85, -1.0);
  registerBrainPart(leftCerebellum, 'Cerebellum');
  cerebellumGroup.add(leftCerebellum);

  const rightCerebellumGeo = new THREE.SphereGeometry(0.72, 20, 16);
  rightCerebellumGeo.scale(0.85, 0.65, 0.8);
  const rightCerebellum = new THREE.Mesh(rightCerebellumGeo, cerebellumMaterial);
  rightCerebellum.position.set(0.62, -0.85, -1.0);
  registerBrainPart(rightCerebellum, 'Cerebellum');
  cerebellumGroup.add(rightCerebellum);

  brainGroup.add(cerebellumGroup);

  // ==========================================
  // 3. BRAINSTEM (Pons & Medulla)
  // ==========================================
  const brainstemGroup = new THREE.Group();
  const stemCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, -0.3, -0.2),
    new THREE.Vector3(0, -0.9, -0.3),
    new THREE.Vector3(0, -1.7, -0.4),
    new THREE.Vector3(0, -2.4, -0.45)
  ]);
  const stemGeo = new THREE.TubeGeometry(stemCurve, 20, 0.36, 16, false);
  const stemMesh = new THREE.Mesh(stemGeo, brainstemMaterial);
  registerBrainPart(stemMesh, 'Brainstem');
  brainstemGroup.add(stemMesh);

  // Pons bulge
  const ponsGeo = new THREE.SphereGeometry(0.48, 16, 16);
  ponsGeo.scale(0.9, 0.75, 1.1);
  const pons = new THREE.Mesh(ponsGeo, brainstemMaterial);
  pons.position.set(0, -0.95, -0.15);
  brainstemGroup.add(pons);

  brainGroup.add(brainstemGroup);

  // ==========================================
  // 4. NEURAL SYNAPSE IMPULSE PARTICLES
  // ==========================================
  const synapseCount = 280;
  const synapseGeo = new THREE.BufferGeometry();
  const synapsePos = new Float32Array(synapseCount * 3);
  const synapseColors = new Float32Array(synapseCount * 3);
  const synapseData = [];

  for (let i = 0; i < synapseCount; i++) {
    // Random points distributed across cortical surface and brain interior
    const phi = Math.random() * Math.PI * 2;
    const theta = Math.acos(Math.random() * 2 - 1);
    const r = 0.8 + Math.random() * 0.9;

    const x = r * Math.sin(theta) * Math.cos(phi) * 0.95;
    const y = r * Math.cos(theta) * 0.85;
    const z = r * Math.sin(theta) * Math.sin(phi) * 1.1;

    synapsePos[i * 3] = x;
    synapsePos[i * 3 + 1] = y;
    synapsePos[i * 3 + 2] = z;

    // Glowing electric violet, cyan, and amber impulses
    const colorType = Math.random();
    if (colorType < 0.45) {
      synapseColors[i * 3] = 0.65;
      synapseColors[i * 3 + 1] = 0.2;
      synapseColors[i * 3 + 2] = 1.0;
    } else if (colorType < 0.8) {
      synapseColors[i * 3] = 0.0;
      synapseColors[i * 3 + 1] = 0.95;
      synapseColors[i * 3 + 2] = 1.0;
    } else {
      synapseColors[i * 3] = 1.0;
      synapseColors[i * 3 + 1] = 0.8;
      synapseColors[i * 3 + 2] = 0.1;
    }

    synapseData.push({
      origX: x,
      origY: y,
      origZ: z,
      phase: Math.random() * Math.PI * 2,
      speed: 1.5 + Math.random() * 3.0
    });
  }

  synapseGeo.setAttribute('position', new THREE.BufferAttribute(synapsePos, 3));
  synapseGeo.setAttribute('color', new THREE.BufferAttribute(synapseColors, 3));

  const synapseMat = new THREE.PointsMaterial({
    size: 0.14,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending
  });

  const synapsePoints = new THREE.Points(synapseGeo, synapseMat);
  brainGroup.add(synapsePoints);

  // Runtime brainwave frequency & synapse firing update
  let waveMode = 'Beta'; // Alpha, Beta, Theta, Gamma
  let waveHz = 20;

  brainGroup.userData = {
    setWaveMode: (mode) => {
      waveMode = mode;
      waveHz = mode === 'Gamma' ? 40 : mode === 'Alpha' ? 10 : mode === 'Theta' ? 6 : 20;
    },
    getWaveMode: () => waveMode,
    getWaveHz: () => waveHz,
    animateBrain: (delta, elapsed) => {
      const positions = synapseGeo.attributes.position.array;
      const speedMultiplier = waveHz / 15;

      for (let i = 0; i < synapseCount; i++) {
        const d = synapseData[i];
        d.phase += delta * d.speed * speedMultiplier;

        // Neural spark oscillation
        const burst = Math.sin(d.phase) * 0.12;
        positions[i * 3] = d.origX * (1.0 + burst);
        positions[i * 3 + 1] = d.origY * (1.0 + burst);
        positions[i * 3 + 2] = d.origZ * (1.0 + burst);
      }
      synapseGeo.attributes.position.needsUpdate = true;

      // Subtle cognitive breathing wave
      const cognitivePulse = 1.0 + Math.sin(elapsed * (waveHz / 5)) * 0.015;
      cerebrumGroup.scale.set(cognitivePulse, cognitivePulse, cognitivePulse);
    }
  };

  brainGroup.position.set(0, 0.4, 0);
  brainGroup.scale.set(1.5, 1.5, 1.5);

  return brainGroup;
}
