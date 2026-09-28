import * as THREE from 'three';

export const HEART_ANATOMY_INFO = {
  Left_Ventricle: {
    name: 'Left Ventricle',
    latin: 'Ventriculus sinister cordis',
    system: 'Cardiovascular System',
    pressure: '120 mmHg (Peak Systolic)',
    volume: '120 mL (End-Diastolic)',
    function: 'Pumps oxygenated blood under high systemic arterial pressure throughout the entire body via the aorta.',
    fact: 'Has myocardial walls 3 times thicker than the right ventricle to overcome systemic vascular resistance.',
    color: '#ff2d55'
  },
  Right_Ventricle: {
    name: 'Right Ventricle',
    latin: 'Ventriculus dexter cordis',
    system: 'Cardiovascular System',
    pressure: '25 mmHg (Pulmonary Systolic)',
    volume: '125 mL (End-Diastolic)',
    function: 'Pumps deoxygenated venous blood into the low-resistance pulmonary circulation for gas exchange.',
    fact: 'Crescent-shaped chamber wrapping around the conical septum of the left ventricle.',
    color: '#00d2ff'
  },
  Left_Atrium: {
    name: 'Left Atrium & Auricle',
    latin: 'Atrium sinistrum',
    system: 'Cardiovascular System',
    pressure: '8-10 mmHg',
    volume: '50-60 mL',
    function: 'Receives freshly oxygenated blood from the four pulmonary veins and transfers it into left ventricle.',
    fact: 'Forms most of the base (posterior surface) of the heart.',
    color: '#ff6b8b'
  },
  Right_Atrium: {
    name: 'Right Atrium & Auricle',
    latin: 'Atrium dextrum',
    system: 'Cardiovascular System',
    pressure: '2-6 mmHg (Central Venous)',
    volume: '55-65 mL',
    function: 'Receives systemic deoxygenated blood from the superior and inferior vena cava and coronary sinus.',
    fact: 'Houses the Sinoatrial (SA) node—the intrinsic natural pacemaker of the heart.',
    color: '#38bdf8'
  },
  Aorta_Arch: {
    name: 'Aorta & Aortic Arch',
    latin: 'Arcus aortae',
    system: 'Great Arterial Vessels',
    pressure: '120/80 mmHg',
    diameter: '28-32 mm',
    function: 'Main arterial trunk delivering systemic blood; gives off 3 primary branches to head, neck, and upper limbs.',
    fact: 'Elastic recoil of the aortic wall (Windkessel effect) maintains diastolic blood pressure while the heart rests.',
    color: '#ef4444'
  },
  Pulmonary_Trunk: {
    name: 'Pulmonary Trunk & Arteries',
    latin: 'Truncus pulmonalis',
    system: 'Pulmonary Vasculature',
    pressure: '25/10 mmHg',
    diameter: '24-28 mm',
    function: 'Carries deoxygenated blood from right ventricle, bifurcating into left and right pulmonary arteries to lungs.',
    fact: 'The only postnatal arteries in the human body that carry deoxygenated blood.',
    color: '#0284c7'
  },
  Vena_Cava: {
    name: 'Vena Cava (Superior & Inferior)',
    latin: 'Vena cava superior et inferior',
    system: 'Great Venous Vessels',
    pressure: '3-5 mmHg',
    diameter: '20-22 mm',
    function: 'Returns all systemic venous deoxygenated blood from upper and lower body to right atrium.',
    fact: 'The inferior vena cava is the largest vein in the human body.',
    color: '#0ea5e9'
  },
  Coronary_Vessels: {
    name: 'Coronary Arterial & Venous Network',
    latin: 'Arteriae et venae coronariae',
    system: 'Myocardial Perfusion',
    flow: '250 mL/min (5% of Cardiac Output)',
    diameter: '2-4 mm',
    function: 'Supplies high-pressure oxygen and nutrients directly into the beating myocardium muscle fibers.',
    fact: 'Coronary artery occlusion is the primary clinical cause of acute myocardial infarction (heart attack).',
    color: '#f43f5e'
  }
};

export function createBeatingHeart(interactiveMeshes = []) {
  const heartGroup = new THREE.Group();
  heartGroup.name = 'Human_Heart_Cardiovascular_System';

  // Myocardial muscle shader materials
  const myocardiumMat = new THREE.MeshStandardMaterial({
    color: 0x9f1239,
    roughness: 0.35,
    metalness: 0.25,
    emissive: 0x4c0519,
    emissiveIntensity: 0.4
  });

  const rightVentricleMat = new THREE.MeshStandardMaterial({
    color: 0x881337,
    roughness: 0.38,
    metalness: 0.2,
    emissive: 0x400515,
    emissiveIntensity: 0.3
  });

  const atriumMat = new THREE.MeshStandardMaterial({
    color: 0xbe123c,
    roughness: 0.4,
    metalness: 0.15,
    emissive: 0x50071c,
    emissiveIntensity: 0.4
  });

  const aortaMat = new THREE.MeshStandardMaterial({
    color: 0xdc2626,
    roughness: 0.25,
    metalness: 0.45,
    emissive: 0x7f1d1d,
    emissiveIntensity: 0.5
  });

  const pulmonaryMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    roughness: 0.25,
    metalness: 0.45,
    emissive: 0x075985,
    emissiveIntensity: 0.4
  });

  const venaCavaMat = new THREE.MeshStandardMaterial({
    color: 0x0369a1,
    roughness: 0.3,
    metalness: 0.4,
    emissive: 0x0c4a6e,
    emissiveIntensity: 0.4
  });

  const coronaryMat = new THREE.MeshStandardMaterial({
    color: 0xff0044,
    roughness: 0.2,
    metalness: 0.6,
    emissive: 0x880022
  });

  function registerHeartPart(mesh, partKey) {
    mesh.userData = {
      isAnatomyPart: true,
      organType: 'HEART',
      boneKey: partKey
    };
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    interactiveMeshes.push(mesh);
    return mesh;
  }

  // ==========================================
  // 1. VENTRICLES (Cardiac Cone & Apex)
  // ==========================================
  const ventriclesGroup = new THREE.Group();

  // Left Ventricle (Thick apex cone)
  const lvGeo = new THREE.SphereGeometry(1.4, 24, 24);
  lvGeo.scale(0.85, 1.45, 0.95);
  const leftVentricle = new THREE.Mesh(lvGeo, myocardiumMat);
  leftVentricle.position.set(-0.25, -0.4, 0.15);
  leftVentricle.rotation.z = 0.22;
  leftVentricle.rotation.y = 0.15;
  registerHeartPart(leftVentricle, 'Left_Ventricle');
  ventriclesGroup.add(leftVentricle);

  // Right Ventricle (Anterior wall wrapping)
  const rvGeo = new THREE.SphereGeometry(1.25, 24, 24);
  rvGeo.scale(0.75, 1.25, 0.85);
  const rightVentricle = new THREE.Mesh(rvGeo, rightVentricleMat);
  rightVentricle.position.set(0.65, -0.3, 0.35);
  rightVentricle.rotation.z = -0.12;
  registerHeartPart(rightVentricle, 'Right_Ventricle');
  ventriclesGroup.add(rightVentricle);

  heartGroup.add(ventriclesGroup);

  // ==========================================
  // 2. ATRIA & AURICLES
  // ==========================================
  const atriaGroup = new THREE.Group();

  // Left Atrium (Posterior superior)
  const laGeo = new THREE.SphereGeometry(0.85, 20, 20);
  laGeo.scale(0.9, 0.85, 0.85);
  const leftAtrium = new THREE.Mesh(laGeo, atriumMat);
  leftAtrium.position.set(-0.65, 1.0, -0.45);
  registerHeartPart(leftAtrium, 'Left_Atrium');
  atriaGroup.add(leftAtrium);

  // Right Atrium (Anterior lateral)
  const raGeo = new THREE.SphereGeometry(0.9, 20, 20);
  raGeo.scale(0.95, 0.9, 0.9);
  const rightAtrium = new THREE.Mesh(raGeo, atriumMat);
  rightAtrium.position.set(1.0, 0.75, -0.15);
  registerHeartPart(rightAtrium, 'Right_Atrium');
  atriaGroup.add(rightAtrium);

  heartGroup.add(atriaGroup);

  // ==========================================
  // 3. AORTA & AORTIC ARCH
  // ==========================================
  const aortaGroup = new THREE.Group();
  const aortaCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.1, 0.6, 0.1),
    new THREE.Vector3(-0.05, 1.6, 0.2),
    new THREE.Vector3(-0.25, 2.3, 0.0),
    new THREE.Vector3(-0.8, 2.3, -0.3),
    new THREE.Vector3(-1.0, 1.4, -0.5),
    new THREE.Vector3(-0.95, 0.0, -0.6)
  ]);
  const aortaGeo = new THREE.TubeGeometry(aortaCurve, 32, 0.38, 16, false);
  const aortaMesh = new THREE.Mesh(aortaGeo, aortaMat);
  registerHeartPart(aortaMesh, 'Aorta_Arch');
  aortaGroup.add(aortaMesh);

  // 3 Brachiocephalic Arch Branches
  const branchGeo = new THREE.CylinderGeometry(0.1, 0.12, 0.7, 12);
  const b1 = new THREE.Mesh(branchGeo, aortaMat);
  b1.position.set(-0.2, 2.65, 0.05);
  b1.rotation.z = -0.15;
  aortaGroup.add(b1);

  const b2 = new THREE.Mesh(branchGeo, aortaMat);
  b2.position.set(-0.45, 2.7, -0.08);
  aortaGroup.add(b2);

  const b3 = new THREE.Mesh(branchGeo, aortaMat);
  b3.position.set(-0.7, 2.65, -0.2);
  b3.rotation.z = 0.15;
  aortaGroup.add(b3);

  heartGroup.add(aortaGroup);

  // ==========================================
  // 4. PULMONARY TRUNK & ARTERIES
  // ==========================================
  const pulmonaryGroup = new THREE.Group();
  const ptCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.35, 0.4, 0.4),
    new THREE.Vector3(0.2, 1.2, 0.3),
    new THREE.Vector3(-0.15, 1.7, 0.1)
  ]);
  const ptGeo = new THREE.TubeGeometry(ptCurve, 20, 0.35, 16, false);
  const ptMesh = new THREE.Mesh(ptGeo, pulmonaryMat);
  registerHeartPart(ptMesh, 'Pulmonary_Trunk');
  pulmonaryGroup.add(ptMesh);

  // Left & Right Pulmonary Branches
  const leftPaCurve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(-0.15, 1.7, 0.1),
    new THREE.Vector3(-0.7, 1.75, -0.1),
    new THREE.Vector3(-1.4, 1.6, -0.4)
  );
  pulmonaryGroup.add(new THREE.Mesh(new THREE.TubeGeometry(leftPaCurve, 12, 0.22, 12, false), pulmonaryMat));

  const rightPaCurve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(-0.15, 1.7, 0.1),
    new THREE.Vector3(0.5, 1.75, -0.2),
    new THREE.Vector3(1.3, 1.6, -0.5)
  );
  pulmonaryGroup.add(new THREE.Mesh(new THREE.TubeGeometry(rightPaCurve, 12, 0.22, 12, false), pulmonaryMat));

  heartGroup.add(pulmonaryGroup);

  // ==========================================
  // 5. VENA CAVA (Superior & Inferior)
  // ==========================================
  const vcGroup = new THREE.Group();
  const svcGeo = new THREE.CylinderGeometry(0.32, 0.34, 1.5, 16);
  const svcMesh = new THREE.Mesh(svcGeo, venaCavaMat);
  svcMesh.position.set(1.15, 1.7, -0.4);
  registerHeartPart(svcMesh, 'Vena_Cava');
  vcGroup.add(svcMesh);

  const ivcGeo = new THREE.CylinderGeometry(0.32, 0.3, 1.2, 16);
  const ivcMesh = new THREE.Mesh(ivcGeo, venaCavaMat);
  ivcMesh.position.set(1.05, -1.1, -0.5);
  vcGroup.add(ivcMesh);

  heartGroup.add(vcGroup);

  // ==========================================
  // 6. CORONARY VESSELS (Surface Arteries)
  // ==========================================
  const coronaryGroup = new THREE.Group();
  const ladCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.1, 0.6, 0.8),
    new THREE.Vector3(0.18, 0.0, 0.95),
    new THREE.Vector3(0.05, -0.7, 0.9),
    new THREE.Vector3(-0.1, -1.3, 0.65)
  ]);
  const ladMesh = new THREE.Mesh(new THREE.TubeGeometry(ladCurve, 24, 0.045, 8, false), coronaryMat);
  registerHeartPart(ladMesh, 'Coronary_Vessels');
  coronaryGroup.add(ladMesh);

  heartGroup.add(coronaryGroup);

  // ==========================================
  // 7. REAL-TIME BLOOD FLOW PARTICLES
  // ==========================================
  const particleCount = 200;
  const bloodGeo = new THREE.BufferGeometry();
  const bloodPos = new Float32Array(particleCount * 3);
  const bloodColors = new Float32Array(particleCount * 3);
  const particleData = [];

  for (let i = 0; i < particleCount; i++) {
    const isArterial = i < particleCount * 0.55;
    particleData.push({
      t: Math.random(),
      speed: 0.35 + Math.random() * 0.35,
      isArterial
    });

    // Oxygenated arterial = Neon Red / Crimson; Deoxygenated venous = Cyan / Deep Blue
    if (isArterial) {
      bloodColors[i * 3] = 1.0;
      bloodColors[i * 3 + 1] = 0.15;
      bloodColors[i * 3 + 2] = 0.25;
    } else {
      bloodColors[i * 3] = 0.0;
      bloodColors[i * 3 + 1] = 0.85;
      bloodColors[i * 3 + 2] = 1.0;
    }
  }

  bloodGeo.setAttribute('position', new THREE.BufferAttribute(bloodPos, 3));
  bloodGeo.setAttribute('color', new THREE.BufferAttribute(bloodColors, 3));

  const bloodMat = new THREE.PointsMaterial({
    size: 0.12,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending
  });

  const bloodParticles = new THREE.Points(bloodGeo, bloodMat);
  heartGroup.add(bloodParticles);

  // Dynamic animation controller attached to heartGroup.userData
  let bpm = 72;
  let cardiacCycleTime = 0;

  heartGroup.userData = {
    setBpm: (newBpm) => {
      bpm = Math.max(40, Math.min(180, newBpm));
    },
    getBpm: () => bpm,
    animateHeartbeat: (delta) => {
      cardiacCycleTime += delta * (bpm / 60) * Math.PI * 2;

      // Realistic dual-peak cardiac contraction curve (P-wave atrium, then QRS ventricle spike)
      const atrialBeat = Math.max(0, Math.sin(cardiacCycleTime)) ** 4 * 0.1;
      const ventricularBeat = Math.max(0, Math.sin(cardiacCycleTime - 0.45)) ** 8 * 0.22;
      const elasticRecoil = Math.sin(cardiacCycleTime * 2) * 0.04;

      // Ventricular contraction: shrinks horizontally, expands slightly vertically and twists
      ventriclesGroup.scale.set(
        1.0 - ventricularBeat * 0.85 + elasticRecoil,
        1.0 + ventricularBeat * 0.4,
        1.0 - ventricularBeat * 0.85 + elasticRecoil
      );
      ventriclesGroup.rotation.y = Math.sin(cardiacCycleTime - 0.45) * 0.12;

      // Atrial contraction: precedes ventricular spike
      atriaGroup.scale.set(
        1.0 - atrialBeat,
        1.0 - atrialBeat * 0.5,
        1.0 - atrialBeat
      );

      // Aorta pulses with ventricular ejection
      aortaGroup.scale.set(
        1.0 + ventricularBeat * 0.25,
        1.0 + ventricularBeat * 0.1,
        1.0 + ventricularBeat * 0.25
      );

      // Update Blood Flow Particle Stream
      const positions = bloodGeo.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        const p = particleData[i];
        p.t = (p.t + delta * p.speed * (bpm / 70)) % 1.0;

        let pt;
        if (p.isArterial) {
          // Flowing from left ventricle out through aortic arch
          pt = aortaCurve.getPoint(p.t);
          pt.x += (Math.random() - 0.5) * 0.15;
          pt.y += (Math.random() - 0.5) * 0.15;
          pt.z += (Math.random() - 0.5) * 0.15;
        } else {
          // Flowing into vena cava or through pulmonary trunk
          pt = ptCurve.getPoint(p.t);
          pt.x += (Math.random() - 0.5) * 0.12;
          pt.y += (Math.random() - 0.5) * 0.12;
          pt.z += (Math.random() - 0.5) * 0.12;
        }

        positions[i * 3] = pt.x;
        positions[i * 3 + 1] = pt.y;
        positions[i * 3 + 2] = pt.z;
      }
      bloodGeo.attributes.position.needsUpdate = true;
    }
  };

  heartGroup.position.set(0, 0, 0);
  heartGroup.scale.set(1.4, 1.4, 1.4);

  return heartGroup;
}
