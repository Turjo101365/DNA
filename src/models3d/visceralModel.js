import * as THREE from 'three';

export const VISCERAL_ANATOMY_INFO = {
  Liver: {
    name: 'Liver (Hepatic Gland)',
    latin: 'Hepar',
    system: 'Digestive & Metabolic System',
    mass: '1.4 - 1.6 kg (Largest Internal Organ)',
    functionsCount: 'Over 500 Vital Metabolic Functions',
    function: 'Detoxifies metabolic byproducts, synthesizes plasma proteins (albumin, clotting factors), stores glycogen, and secretes bile.',
    fact: 'The liver possesses remarkable regenerative capacity; as little as 25% of liver tissue can regenerate into a full organ.',
    color: '#854d0e'
  },
  Gallbladder: {
    name: 'Gallbladder',
    latin: 'Vesica biliaris',
    system: 'Biliary System',
    capacity: '30 - 50 mL Concentrated Bile',
    function: 'Stores and concentrates bile produced by the liver, releasing it via the cystic duct into duodenum upon dietary fat ingestion.',
    fact: 'Concentrates hepatic bile by up to 5 to 10-fold by actively absorbing water and electrolytes.',
    color: '#84cc16'
  },
  Stomach: {
    name: 'Stomach (Gastric Reservoir)',
    latin: 'Gaster / Ventriculus',
    system: 'Upper Gastrointestinal Tract',
    capacity: '1.0 - 1.5 Liters (Postprandial)',
    acidity: 'pH 1.5 - 2.0 (Hydrochloric Acid)',
    function: 'Performs chemical and mechanical breakdown of food via gastric acid (HCl), pepsin protease, and vigorous muscular peristalsis into chyme.',
    fact: 'The stomach secretes gastric intrinsic factor, indispensable for vitamin B12 absorption in the terminal ileum.',
    color: '#f97316'
  },
  Left_Kidney: {
    name: 'Left Kidney & Renal Capsule',
    latin: 'Ren sinister',
    system: 'Urinary / Renal System',
    nephrons: '~1.0 - 1.2 Million Functional Nephrons',
    gfr: '120 - 125 mL/min (Filtration Rate)',
    function: 'Filters blood to eliminate metabolic wastes (urea, creatinine), balances serum electrolytes, regulates extracellular fluid volume and blood pressure.',
    fact: 'Filters approximately 180 liters of blood plasma daily, reabsorbing over 99% back into circulation.',
    color: '#be185d'
  },
  Right_Kidney: {
    name: 'Right Kidney & Renal Capsule',
    latin: 'Ren dexter',
    system: 'Urinary / Renal System',
    nephrons: '~1.0 - 1.2 Million Functional Nephrons',
    position: 'Located slightly lower than left kidney due to the liver mass.',
    function: 'Synthesizes erythropoietin (stimulating red blood cell creation), calcitriol (active vitamin D), and renin for blood pressure control.',
    fact: 'Receives approximately 20-25% of total cardiac output despite weighing less than 0.5% of total body mass.',
    color: '#db2777'
  },
  Adrenal_Glands: {
    name: 'Adrenal Glands (Suprarenal)',
    latin: 'Glandulae suprarenales',
    system: 'Endocrine System',
    cortex_medulla: 'Zona Glomerulosa, Fasciculata, Reticularis + Chromaffin Medulla',
    function: 'Secretes steroid hormones (aldosterone, cortisol, androgens) and catecholamines (adrenaline/epinephrine, noradrenaline).',
    fact: 'The primary endocrine epicenter triggering the acute sympathetic "Fight or Flight" stress cascade.',
    color: '#eab308'
  },
  Ureters: {
    name: 'Ureters (Left & Right)',
    latin: 'Ureteres',
    system: 'Urinary Tract',
    length: '25 - 30 cm Muscular Ducts',
    function: 'Transports urine from the renal pelvis down into the urinary bladder via rhythmic muscular peristaltic waves.',
    fact: 'Features three physiological anatomical constrictions where kidney stones (nephrolithiasis) most commonly impact.',
    color: '#fbbf24'
  }
};

export function createVisceralOrgans(interactiveMeshes = []) {
  const visceraGroup = new THREE.Group();
  visceraGroup.name = 'Human_Visceral_Organs_System';

  // Shader materials
  const liverMat = new THREE.MeshStandardMaterial({
    color: 0x9a3412,
    roughness: 0.35,
    metalness: 0.25,
    emissive: 0x431407,
    emissiveIntensity: 0.4
  });

  const gallbladderMat = new THREE.MeshStandardMaterial({
    color: 0x65a30d,
    roughness: 0.2,
    metalness: 0.3,
    emissive: 0x1a2e05,
    emissiveIntensity: 0.4
  });

  const stomachMat = new THREE.MeshStandardMaterial({
    color: 0xe11d48,
    roughness: 0.4,
    metalness: 0.2,
    emissive: 0x4c0519,
    emissiveIntensity: 0.4
  });

  const kidneyMat = new THREE.MeshStandardMaterial({
    color: 0x9f1239,
    roughness: 0.3,
    metalness: 0.25,
    emissive: 0x4c0519,
    emissiveIntensity: 0.45
  });

  const adrenalMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.35,
    metalness: 0.3,
    emissive: 0x78350f,
    emissiveIntensity: 0.4
  });

  const ureterMat = new THREE.MeshStandardMaterial({
    color: 0xfde047,
    roughness: 0.25,
    metalness: 0.4,
    emissive: 0x854d0e,
    emissiveIntensity: 0.3
  });

  const vesselArteryMat = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    roughness: 0.3,
    metalness: 0.5,
    emissive: 0x7f1d1d
  });

  const vesselVeinMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    roughness: 0.3,
    metalness: 0.5,
    emissive: 0x075985
  });

  function registerVisceraPart(mesh, partKey) {
    mesh.userData = {
      isAnatomyPart: true,
      organType: 'VISCERAL',
      boneKey: partKey
    };
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    interactiveMeshes.push(mesh);
    return mesh;
  }

  // ==========================================
  // 1. HEPATIC LIVER & GALLBLADDER
  // ==========================================
  const liverGroup = new THREE.Group();

  // Right Hepatic Lobe (Large wedge)
  const rLobeGeo = new THREE.SphereGeometry(1.35, 20, 20);
  rLobeGeo.scale(1.15, 0.95, 0.75);
  const rLobeMesh = new THREE.Mesh(rLobeGeo, liverMat);
  rLobeMesh.position.set(1.1, 0.85, 0.3);
  rLobeMesh.rotation.z = -0.25;
  registerVisceraPart(rLobeMesh, 'Liver');
  liverGroup.add(rLobeMesh);

  // Left Hepatic Lobe (Smaller wedge extending across midline)
  const lLobeGeo = new THREE.SphereGeometry(1.0, 20, 20);
  lLobeGeo.scale(0.9, 0.8, 0.6);
  const lLobeMesh = new THREE.Mesh(lLobeGeo, liverMat);
  lLobeMesh.position.set(-0.35, 1.0, 0.35);
  lLobeMesh.rotation.z = 0.2;
  registerVisceraPart(lLobeMesh, 'Liver');
  liverGroup.add(lLobeMesh);

  // Gallbladder (Pear-shaped sac nestled beneath right lobe)
  const gbGeo = new THREE.SphereGeometry(0.38, 16, 16);
  gbGeo.scale(0.65, 1.2, 0.65);
  const gbMesh = new THREE.Mesh(gbGeo, gallbladderMat);
  gbMesh.position.set(0.9, 0.1, 0.7);
  gbMesh.rotation.z = 0.3;
  registerVisceraPart(gbMesh, 'Gallbladder');
  liverGroup.add(gbMesh);

  visceraGroup.add(liverGroup);

  // ==========================================
  // 2. STOMACH (Gastric Body & Fundus)
  // ==========================================
  const stomachGroup = new THREE.Group();

  // J-shaped stomach curve
  const stomachCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.4, 1.4, 0.1),  // Cardia
    new THREE.Vector3(-1.2, 1.3, 0.3),  // Fundus
    new THREE.Vector3(-1.6, 0.4, 0.35), // Greater Curvature
    new THREE.Vector3(-1.1, -0.4, 0.3), // Angular Notch
    new THREE.Vector3(-0.3, -0.3, 0.4), // Pyloric Antrum
    new THREE.Vector3(0.2, -0.2, 0.3)   // Pyloric Duodenum
  ]);
  const stomachGeo = new THREE.TubeGeometry(stomachCurve, 24, 0.55, 16, false);
  const stomachMesh = new THREE.Mesh(stomachGeo, stomachMat);
  registerVisceraPart(stomachMesh, 'Stomach');
  stomachGroup.add(stomachMesh);

  visceraGroup.add(stomachGroup);

  // ==========================================
  // 3. BILATERAL RENAL KIDNEYS & ADRENALS
  // ==========================================
  const renalGroup = new THREE.Group();

  // Helper: Bean-shaped kidney geometry
  function createKidneyGeo() {
    const geo = new THREE.SphereGeometry(0.75, 20, 20);
    geo.scale(0.68, 1.25, 0.75);
    const pos = geo.attributes.position;
    // Incurvate the medial hilum
    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      if (x < 0) {
        x += (1.0 - Math.abs(y / 1.0)) * 0.16;
      }
      pos.setXYZ(i, x, y, z);
    }
    geo.computeVertexNormals();
    return geo;
  }

  // Left Kidney
  const leftKidney = new THREE.Mesh(createKidneyGeo(), kidneyMat);
  leftKidney.position.set(-1.4, -0.3, -0.4);
  leftKidney.rotation.z = -0.15;
  registerVisceraPart(leftKidney, 'Left_Kidney');
  renalGroup.add(leftKidney);

  // Left Adrenal Gland
  const lAdrenalGeo = new THREE.ConeGeometry(0.32, 0.4, 10);
  const leftAdrenal = new THREE.Mesh(lAdrenalGeo, adrenalMat);
  leftAdrenal.position.set(-1.4, 0.65, -0.4);
  registerVisceraPart(leftAdrenal, 'Adrenal_Glands');
  renalGroup.add(leftAdrenal);

  // Right Kidney (Slightly lower due to liver)
  const rightKidneyGeo = createKidneyGeo();
  rightKidneyGeo.rotateY(Math.PI);
  const rightKidney = new THREE.Mesh(rightKidneyGeo, kidneyMat);
  rightKidney.position.set(1.4, -0.6, -0.4);
  rightKidney.rotation.z = 0.15;
  registerVisceraPart(rightKidney, 'Right_Kidney');
  renalGroup.add(rightKidney);

  // Right Adrenal Gland
  const rightAdrenal = new THREE.Mesh(lAdrenalGeo, adrenalMat);
  rightAdrenal.position.set(1.4, 0.35, -0.4);
  registerVisceraPart(rightAdrenal, 'Adrenal_Glands');
  renalGroup.add(rightAdrenal);

  // Ureters (Left & Right)
  const leftUreterCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.25, -0.4, -0.35),
    new THREE.Vector3(-0.9, -1.5, -0.2),
    new THREE.Vector3(-0.4, -2.6, 0.0)
  ]);
  const leftUreter = new THREE.Mesh(new THREE.TubeGeometry(leftUreterCurve, 16, 0.07, 8, false), ureterMat);
  registerVisceraPart(leftUreter, 'Ureters');
  renalGroup.add(leftUreter);

  const rightUreterCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(1.25, -0.7, -0.35),
    new THREE.Vector3(0.9, -1.6, -0.2),
    new THREE.Vector3(0.4, -2.6, 0.0)
  ]);
  const rightUreter = new THREE.Mesh(new THREE.TubeGeometry(rightUreterCurve, 16, 0.07, 8, false), ureterMat);
  registerVisceraPart(rightUreter, 'Ureters');
  renalGroup.add(rightUreter);

  // Central Abdominal Aorta and Vena Cava
  const aortaVessel = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 3.4, 16), vesselArteryMat);
  aortaVessel.position.set(-0.15, -0.6, -0.5);
  renalGroup.add(aortaVessel);

  const vcVessel = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 3.4, 16), vesselVeinMat);
  vcVessel.position.set(0.25, -0.6, -0.48);
  renalGroup.add(vcVessel);

  visceraGroup.add(renalGroup);

  // ==========================================
  // 4. RENAL FILTRATION PARTICLE SIMULATION
  // ==========================================
  const particleCount = 180;
  const nephronGeo = new THREE.BufferGeometry();
  const nephronPos = new Float32Array(particleCount * 3);
  const nephronColors = new Float32Array(particleCount * 3);
  const nephronData = [];

  for (let i = 0; i < particleCount; i++) {
    const isLeft = i % 2 === 0;
    nephronData.push({
      progress: Math.random(),
      isLeft,
      speed: 0.35 + Math.random() * 0.4
    });

    // Golden yellow filtered urine flow
    nephronColors[i * 3] = 0.95;
    nephronColors[i * 3 + 1] = 0.85;
    nephronColors[i * 3 + 2] = 0.2;
  }

  nephronGeo.setAttribute('position', new THREE.BufferAttribute(nephronPos, 3));
  nephronGeo.setAttribute('color', new THREE.BufferAttribute(nephronColors, 3));

  const nephronMat = new THREE.PointsMaterial({
    size: 0.11,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending
  });

  const nephronParticles = new THREE.Points(nephronGeo, nephronMat);
  visceraGroup.add(nephronParticles);

  // Dynamic Peristaltic and Filtration Animation
  visceraGroup.userData = {
    animateViscera: (delta, elapsed) => {
      // Gastric motility peristalsis wave
      const gastricPulse = 1.0 + Math.sin(elapsed * 2.2) * 0.05;
      stomachGroup.scale.set(gastricPulse, 1.0 + Math.cos(elapsed * 2.2) * 0.03, gastricPulse);

      // Nephron filtration particles traveling down ureters
      const pos = nephronGeo.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        const d = nephronData[i];
        d.progress = (d.progress + delta * d.speed) % 1.0;

        const curve = d.isLeft ? leftUreterCurve : rightUreterCurve;
        const pt = curve.getPoint(d.progress);
        pos[i * 3] = pt.x + (Math.random() - 0.5) * 0.06;
        pos[i * 3 + 1] = pt.y + (Math.random() - 0.5) * 0.06;
        pos[i * 3 + 2] = pt.z + (Math.random() - 0.5) * 0.06;
      }
      nephronGeo.attributes.position.needsUpdate = true;
    }
  };

  visceraGroup.position.set(0, 0.4, 0);
  visceraGroup.scale.set(1.4, 1.4, 1.4);

  return visceraGroup;
}
