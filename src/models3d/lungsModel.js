import * as THREE from 'three';

export const LUNGS_ANATOMY_INFO = {
  Trachea: {
    name: 'Trachea (Windpipe)',
    latin: 'Trachea',
    system: 'Respiratory System',
    length: '10-12 cm (Diameter: ~2 cm)',
    function: 'Rigid fibrocartilaginous tube conducting warm, humidified, filtered air from the larynx into bronchi.',
    fact: 'Reinforced by 16 to 20 C-shaped hyaline cartilage rings that prevent airway collapse during negative thoracic pressure.',
    color: '#38bdf8'
  },
  Bronchial_Tree: {
    name: 'Bronchial Arborization Tree',
    latin: 'Arbor bronchialis',
    system: 'Lower Respiratory Tract',
    generations: '23 Branching Generations',
    function: 'Distributes airflow through primary, secondary lobar, and tertiary segmental bronchi into terminal bronchioles.',
    fact: 'Ciliated pseudostratified epithelium and the mucociliary escalator constantly clear inhaled particulate debris.',
    color: '#0284c7'
  },
  Right_Lung: {
    name: 'Right Lung (3 Lobes)',
    latin: 'Pulmo dexter (Lobus superior, medius, inferior)',
    system: 'Pulmonary System',
    capacity: '~3,000 mL (55% Total Lung Capacity)',
    weight: '~600 g',
    function: 'Facilitates alveolar microvascular diffusion: oxygen transfer into blood and carbon dioxide elimination.',
    fact: 'Divided into 3 distinct lobes by horizontal and oblique fissures; slightly larger and heavier than the left lung.',
    color: '#06b6d4'
  },
  Left_Lung: {
    name: 'Left Lung & Cardiac Notch',
    latin: 'Pulmo sinister & Incisura cardiaca',
    system: 'Pulmonary System',
    capacity: '~2,500 mL (45% Total Lung Capacity)',
    weight: '~500 g',
    function: 'Provides alveolar gas exchange; features an anterior cardiac notch that cradles the apex of the human heart.',
    fact: 'Divided into only 2 lobes (superior and inferior) by a single oblique fissure to make space for the pericardium.',
    color: '#22d3ee'
  },
  Alveoli_Clusters: {
    name: 'Alveoli & Capillary Bed',
    latin: 'Alveoli pulmonis',
    system: 'Microvascular Gas Exchange',
    surfaceArea: '70-100 m² (Tennis Court Area)',
    count: '~480 Million Alveoli',
    function: 'Microscopic spherical sacs lined with Type I & Type II pneumocytes producing pulmonary surfactant.',
    fact: 'The blood-air barrier is extremely thin (0.2 to 0.5 micrometers) to allow instantaneous passive gas diffusion.',
    color: '#00f0ff'
  },
  Diaphragm: {
    name: 'Muscular Diaphragm',
    latin: 'Diaphragma',
    system: 'Primary Inspiratory Muscle',
    innervation: 'Phrenic Nerve (C3, C4, C5)',
    function: 'Contracts downward during inhalation to expand thoracic volume and create sub-atmospheric negative pressure.',
    fact: 'Responsible for approximately 75% of resting respiratory tidal volume.',
    color: '#475569'
  }
};

export function createRespiratoryLungs(interactiveMeshes = []) {
  const lungsGroup = new THREE.Group();
  lungsGroup.name = 'Human_Lungs_Respiratory_System';

  // Realistic pulmonary tissue shader materials
  const rightLungMat = new THREE.MeshStandardMaterial({
    color: 0x0891b2,
    roughness: 0.4,
    metalness: 0.2,
    emissive: 0x155e75,
    emissiveIntensity: 0.4
  });

  const leftLungMat = new THREE.MeshStandardMaterial({
    color: 0x0e7490,
    roughness: 0.4,
    metalness: 0.2,
    emissive: 0x164e63,
    emissiveIntensity: 0.4
  });

  const tracheaMat = new THREE.MeshStandardMaterial({
    color: 0xe0f2fe,
    roughness: 0.25,
    metalness: 0.35,
    emissive: 0x0284c7,
    emissiveIntensity: 0.3
  });

  const ringMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    roughness: 0.2,
    metalness: 0.5,
    emissive: 0x0369a1,
    emissiveIntensity: 0.4
  });

  const bronchiMat = new THREE.MeshStandardMaterial({
    color: 0x00f0ff,
    roughness: 0.3,
    metalness: 0.4,
    emissive: 0x005577
  });

  const diaphragmMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.5,
    metalness: 0.2,
    emissive: 0x0f172a,
    emissiveIntensity: 0.3
  });

  function registerLungPart(mesh, partKey) {
    mesh.userData = {
      isAnatomyPart: true,
      organType: 'LUNGS',
      boneKey: partKey
    };
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    interactiveMeshes.push(mesh);
    return mesh;
  }

  // ==========================================
  // 1. TRACHEA & CARTILAGINOUS RINGS
  // ==========================================
  const tracheaGroup = new THREE.Group();
  const tracheaGeo = new THREE.CylinderGeometry(0.24, 0.25, 2.4, 16);
  const tracheaMesh = new THREE.Mesh(tracheaGeo, tracheaMat);
  tracheaMesh.position.set(0, 2.0, 0);
  registerLungPart(tracheaMesh, 'Trachea');
  tracheaGroup.add(tracheaMesh);

  // Cartilage rings
  const ringGeo = new THREE.TorusGeometry(0.26, 0.035, 8, 20, Math.PI * 1.6);
  ringGeo.rotateX(Math.PI / 2);
  for (let i = 0; i < 9; i++) {
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.set(0, 1.0 + i * 0.23, 0);
    tracheaGroup.add(ring);
  }

  lungsGroup.add(tracheaGroup);

  // ==========================================
  // 2. BRONCHIAL ARBORIZATION TREE
  // ==========================================
  const bronchialGroup = new THREE.Group();

  // Right Main Bronchus
  const rightBronchusCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.8, 0),
    new THREE.Vector3(0.5, 0.4, -0.05),
    new THREE.Vector3(1.1, 0.0, -0.15)
  ]);
  const rightBronchus = new THREE.Mesh(new THREE.TubeGeometry(rightBronchusCurve, 16, 0.16, 12, false), bronchiMat);
  registerLungPart(rightBronchus, 'Bronchial_Tree');
  bronchialGroup.add(rightBronchus);

  // Secondary branches right
  const rb1 = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(1.1, 0.0, -0.15),
    new THREE.Vector3(1.5, 0.6, -0.1),
    new THREE.Vector3(1.8, 1.1, -0.05)
  );
  bronchialGroup.add(new THREE.Mesh(new THREE.TubeGeometry(rb1, 10, 0.09, 8, false), bronchiMat));

  const rb2 = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(1.1, 0.0, -0.15),
    new THREE.Vector3(1.5, -0.5, -0.1),
    new THREE.Vector3(1.7, -1.2, -0.15)
  );
  bronchialGroup.add(new THREE.Mesh(new THREE.TubeGeometry(rb2, 10, 0.09, 8, false), bronchiMat));

  // Left Main Bronchus (More horizontal due to aortic arch)
  const leftBronchusCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.8, 0),
    new THREE.Vector3(-0.6, 0.45, -0.08),
    new THREE.Vector3(-1.2, 0.1, -0.2)
  ]);
  const leftBronchus = new THREE.Mesh(new THREE.TubeGeometry(leftBronchusCurve, 16, 0.15, 12, false), bronchiMat);
  bronchialGroup.add(leftBronchus);

  // Secondary branches left
  const lb1 = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(-1.2, 0.1, -0.2),
    new THREE.Vector3(-1.6, 0.7, -0.1),
    new THREE.Vector3(-1.8, 1.2, -0.05)
  );
  bronchialGroup.add(new THREE.Mesh(new THREE.TubeGeometry(lb1, 10, 0.085, 8, false), bronchiMat));

  const lb2 = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(-1.2, 0.1, -0.2),
    new THREE.Vector3(-1.6, -0.6, -0.15),
    new THREE.Vector3(-1.8, -1.3, -0.2)
  );
  bronchialGroup.add(new THREE.Mesh(new THREE.TubeGeometry(lb2, 10, 0.085, 8, false), bronchiMat));

  lungsGroup.add(bronchialGroup);

  // ==========================================
  // 3. RIGHT LUNG (3 Lobes: Superior, Middle, Inferior)
  // ==========================================
  const rightLungGroup = new THREE.Group();

  // Superior Lobe
  const rSupGeo = new THREE.SphereGeometry(1.0, 20, 20);
  rSupGeo.scale(0.85, 1.1, 0.85);
  const rSupMesh = new THREE.Mesh(rSupGeo, rightLungMat);
  rSupMesh.position.set(1.5, 0.9, -0.05);
  registerLungPart(rSupMesh, 'Right_Lung');
  rightLungGroup.add(rSupMesh);

  // Middle Lobe
  const rMidGeo = new THREE.SphereGeometry(0.82, 18, 18);
  rMidGeo.scale(0.85, 0.75, 0.85);
  const rMidMesh = new THREE.Mesh(rMidGeo, rightLungMat);
  rMidMesh.position.set(1.55, -0.1, 0.1);
  registerLungPart(rMidMesh, 'Right_Lung');
  rightLungGroup.add(rMidMesh);

  // Inferior Lobe (Base)
  const rInfGeo = new THREE.SphereGeometry(1.05, 20, 20);
  rInfGeo.scale(0.95, 1.0, 0.95);
  const rInfMesh = new THREE.Mesh(rInfGeo, rightLungMat);
  rInfMesh.position.set(1.5, -1.0, -0.1);
  registerLungPart(rInfMesh, 'Right_Lung');
  rightLungGroup.add(rInfMesh);

  lungsGroup.add(rightLungGroup);

  // ==========================================
  // 4. LEFT LUNG (2 Lobes with Cardiac Notch)
  // ==========================================
  const leftLungGroup = new THREE.Group();

  // Superior Lobe
  const lSupGeo = new THREE.SphereGeometry(0.98, 20, 20);
  lSupGeo.scale(0.8, 1.15, 0.85);
  const lSupMesh = new THREE.Mesh(lSupGeo, leftLungMat);
  lSupMesh.position.set(-1.5, 0.9, -0.05);
  registerLungPart(lSupMesh, 'Left_Lung');
  leftLungGroup.add(lSupMesh);

  // Inferior Lobe with Cardiac Notch contour
  const lInfGeo = new THREE.SphereGeometry(1.05, 20, 20);
  lInfGeo.scale(0.88, 1.05, 0.9);
  const lInfMesh = new THREE.Mesh(lInfGeo, leftLungMat);
  lInfMesh.position.set(-1.55, -0.85, -0.1);
  registerLungPart(lInfMesh, 'Left_Lung');
  leftLungGroup.add(lInfMesh);

  lungsGroup.add(leftLungGroup);

  // ==========================================
  // 5. MUSCULAR DIAPHRAGM DOME
  // ==========================================
  const diaphragmGeo = new THREE.CylinderGeometry(2.8, 3.2, 0.4, 24);
  const diaphragmMesh = new THREE.Mesh(diaphragmGeo, diaphragmMat);
  diaphragmMesh.position.set(0, -2.4, 0);
  registerLungPart(diaphragmMesh, 'Diaphragm');
  lungsGroup.add(diaphragmMesh);

  // ==========================================
  // 6. AIRWAY GAS EXCHANGE PARTICLES
  // ==========================================
  const particleCount = 220;
  const gasGeo = new THREE.BufferGeometry();
  const gasPos = new Float32Array(particleCount * 3);
  const gasColors = new Float32Array(particleCount * 3);
  const gasData = [];

  for (let i = 0; i < particleCount; i++) {
    const isRight = i % 2 === 0;
    gasData.push({
      progress: Math.random(),
      isRight,
      speed: 0.4 + Math.random() * 0.4
    });

    // Inhaled Oxygen = Glowing Cyan; Exhaled Carbon Dioxide = Warm Emerald/Gold
    gasColors[i * 3] = 0.0;
    gasColors[i * 3 + 1] = 0.9;
    gasColors[i * 3 + 2] = 1.0;
  }

  gasGeo.setAttribute('position', new THREE.BufferAttribute(gasPos, 3));
  gasGeo.setAttribute('color', new THREE.BufferAttribute(gasColors, 3));

  const gasMat = new THREE.PointsMaterial({
    size: 0.12,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending
  });

  const gasParticles = new THREE.Points(gasGeo, gasMat);
  lungsGroup.add(gasParticles);

  // Dynamic Breathing Cycle Simulation
  let breathRate = 16; // Breaths per minute (Normal: 12-20)
  let breathCycle = 0;

  lungsGroup.userData = {
    setBreathRate: (rate) => {
      breathRate = Math.max(8, Math.min(36, rate));
    },
    getBreathRate: () => breathRate,
    animateBreathing: (delta) => {
      breathCycle += delta * (breathRate / 60) * Math.PI * 2;

      // Expansion factor (Smooth sine breathing)
      const inhale = Math.sin(breathCycle);
      const expansion = 1.0 + inhale * 0.14;
      const verticalStretch = 1.0 + inhale * 0.08;

      // Both lungs expand and contract
      rightLungGroup.scale.set(expansion, verticalStretch, expansion);
      leftLungGroup.scale.set(expansion, verticalStretch, expansion);

      // Diaphragm moves downward on inhalation, upward on exhalation
      diaphragmMesh.position.y = -2.4 - inhale * 0.25;

      // Animate Airflow particles through trachea into bronchial tree
      const pos = gasGeo.attributes.position.array;
      const colors = gasGeo.attributes.color.array;

      for (let i = 0; i < particleCount; i++) {
        const d = gasData[i];
        d.progress = (d.progress + delta * d.speed * (breathRate / 16)) % 1.0;

        let x, y, z;
        if (d.progress < 0.35) {
          // Inside trachea
          const t = d.progress / 0.35;
          x = (Math.random() - 0.5) * 0.15;
          y = 3.0 - t * 2.2;
          z = (Math.random() - 0.5) * 0.15;
        } else {
          // Inside lung lobes
          const t = (d.progress - 0.35) / 0.65;
          const side = d.isRight ? 1 : -1;
          x = side * (0.8 + t * 0.9 + (Math.random() - 0.5) * 0.3);
          y = 0.8 - t * 2.0 + (Math.random() - 0.5) * 0.3;
          z = (Math.random() - 0.5) * 0.4;
        }

        pos[i * 3] = x;
        pos[i * 3 + 1] = y;
        pos[i * 3 + 2] = z;

        // Color shift: Cyan on inhale, emerald/gold on exhale
        if (inhale > 0) {
          colors[i * 3] = 0.0;
          colors[i * 3 + 1] = 0.95;
          colors[i * 3 + 2] = 1.0;
        } else {
          colors[i * 3] = 0.2;
          colors[i * 3 + 1] = 0.9;
          colors[i * 3 + 2] = 0.4;
        }
      }
      gasGeo.attributes.position.needsUpdate = true;
      gasGeo.attributes.color.needsUpdate = true;
    }
  };

  lungsGroup.position.set(0, 0, 0);
  lungsGroup.scale.set(1.4, 1.4, 1.4);

  return lungsGroup;
}
