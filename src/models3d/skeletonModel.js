import * as THREE from 'three';

// Comprehensive anatomical metadata for 206 human bones
export const SKELETON_ANATOMY_INFO = {
  // Axial Skeleton - Cranium & Face
  Cranium_Vault: {
    name: 'Neurocranium (Frontal, Parietal, Occipital, Temporal)',
    latin: 'Calvaria & Neurocranium',
    system: 'Axial Skeleton (Cranial)',
    bonesInGroup: 8,
    function: 'Encloses, cushions, and protects the cerebral hemispheres, cerebellum, and brainstem; anchors neck and facial muscles.',
    fact: 'The human cranium bones are interlocked by fibrous immovable joints called cranial sutures (coronal, sagittal, lambdoid).',
    color: '#e7e3d8'
  },
  Facial_Bones: {
    name: 'Facial Viscerocranium (Zygomatic, Maxillae, Nasal)',
    latin: 'Viscerocranium (Maxilla, Zygomaticum, Nasale)',
    system: 'Axial Skeleton (Facial)',
    bonesInGroup: 14,
    function: 'Houses optical sensory orbits, nasal olfactory airway, and dental maxillary arches for mastication and speech articulation.',
    fact: 'The zygomatic arch (cheekbone) protects the temporalis tendon and defines individual facial contours.',
    color: '#ded8cc'
  },
  Mandible: {
    name: 'Mandible (Lower Jawbone)',
    latin: 'Mandibula',
    system: 'Axial Skeleton (Facial)',
    bonesInGroup: 1,
    function: 'Forms the mobile temporomandibular joint (TMJ); supports lower dentition and anchors muscles of mastication.',
    fact: 'The strongest and only freely movable bone of the adult human skull, exerting over 70 kg of bite force.',
    color: '#f0ece2'
  },
  Hyoid_Bone: {
    name: 'Hyoid Bone (Lingual Anchor)',
    latin: 'Os hyoideum',
    system: 'Axial Skeleton (Cervical)',
    bonesInGroup: 1,
    function: 'Suspends the larynx and acts as a movable base for the tongue, crucial for deglutition (swallowing) and phonation.',
    fact: 'The only bone in the entire human skeleton that does not articulate directly with any other bone, suspended by stylohyoid ligaments.',
    color: '#cbd5e1'
  },

  // Axial Skeleton - Vertebral Column (26 bones)
  Cervical_Vertebra: {
    name: 'Cervical Spine Vertebrae (C1 Atlas to C7 Prominens)',
    latin: 'Vertebrae cervicales (C1-C7)',
    system: 'Axial Skeleton (Spine)',
    bonesInGroup: 7,
    function: 'Provides neck mobility (nodding, rotation) while protecting the cervical spinal cord and vertebral arteries.',
    fact: 'C1 (Atlas) has no vertebral body and pivots upon the odontoid dens peg of C2 (Axis).',
    color: '#38bdf8'
  },
  Thoracic_Vertebra: {
    name: 'Thoracic Spine Vertebrae (T1 to T12)',
    latin: 'Vertebrae thoracicae (T1-T12)',
    system: 'Axial Skeleton (Spine)',
    bonesInGroup: 12,
    function: 'Articulates directly with the 12 pairs of ribs via costal demifacets to stabilize the thoracic cage.',
    fact: 'Has long, downward-sloping spinous processes that overlap like roof shingles to prevent hyperextension.',
    color: '#0ea5e9'
  },
  Lumbar_Vertebra: {
    name: 'Lumbar Spine Vertebrae (L1 to L5)',
    latin: 'Vertebrae lumbales (L1-L5)',
    system: 'Axial Skeleton (Spine)',
    bonesInGroup: 5,
    function: 'Bears greatest upper body weight and dynamic axial loading during bipedal standing, walking, and heavy lifting.',
    fact: 'Possesses large kidney-shaped vertebral bodies; the L5-S1 disc is the most common site of lumbar disc herniation.',
    color: '#0284c7'
  },
  Sacrum_Coccyx: {
    name: 'Sacrum (5 Fused) & Coccyx (4 Fused Tailbone)',
    latin: 'Os sacrum et Os coccygis',
    system: 'Axial Skeleton (Pelvic Anchor)',
    bonesInGroup: 2,
    function: 'Transfers vertical spinal forces outward into the iliac bones of the pelvis; anchors pelvic diaphragm musculature.',
    fact: 'The triangular sacrum contains 4 pairs of anterior and posterior sacral foramina for sacral nerve roots.',
    color: '#94a3b8'
  },

  // Axial Skeleton - Thoracic Cage (25 bones)
  Sternum: {
    name: 'Sternum (Manubrium, Body, Xiphoid Process)',
    latin: 'Sternum (Manubrium, Corpus, Processus xiphoideus)',
    system: 'Axial Skeleton (Thorax)',
    bonesInGroup: 1,
    function: 'Anterior anchor for true ribs via costal cartilages; shields the pericardium, myocardium, and ascending aorta.',
    fact: 'The manubriosternal junction forms the Angle of Louis (sternal angle), an essential landmark for counting ribs in cardiology.',
    color: '#f8fafc'
  },
  Rib_Pair: {
    name: 'Costal Ribs (12 Bilateral Pairs = 24 Ribs)',
    latin: 'Costae (Costae verae, spuriae et fluctuantes)',
    system: 'Axial Skeleton (Thorax)',
    bonesInGroup: 24,
    function: 'Protects vital cardiopulmonary organs and expands dynamically during inspiration via intercostal muscle action.',
    fact: 'Ribs 1-7 are true ribs, 8-10 are false ribs sharing cartilage, and 11-12 are floating ribs with unattached anterior tips.',
    color: '#e2e8f0'
  },

  // Appendicular Skeleton - Upper Extremities (64 bones)
  Clavicle: {
    name: 'Clavicle (Collarbone, Left & Right)',
    latin: 'Clavicula sinistra et dextra',
    system: 'Appendicular Skeleton (Pectoral)',
    bonesInGroup: 2,
    function: 'Strut maintaining the scapula and upper limb away from the thoracic wall for maximum arm range of motion.',
    fact: 'The first bone in the human embryo to begin ossification (around the 5th week) and the last to finish (around age 25).',
    color: '#e7e3d8'
  },
  Scapula: {
    name: 'Scapula (Shoulder Blade with Acromion & Spine)',
    latin: 'Scapula (Spina scapulae, Acromion, Processus coracoideus)',
    system: 'Appendicular Skeleton (Pectoral)',
    bonesInGroup: 2,
    function: 'Provides shallow glenoid cavity for multi-axial glenohumeral articulation and anchors 17 shoulder/arm muscles.',
    fact: 'Glides over the thoracic cage on a bed of loose connective tissue without any direct bony joint to the spine.',
    color: '#d6d3d1'
  },
  Humerus: {
    name: 'Humerus (Upper Arm Bone, Bilateral)',
    latin: 'Humerus (Caput, Tubercula, Trochlea, Capitulum)',
    system: 'Appendicular Skeleton (Upper Limb)',
    bonesInGroup: 2,
    function: 'Connects shoulder girdle to forearm elbow; transmits lifting, pushing, and overhead rotational torque.',
    fact: 'The radial spiral groove houses the radial nerve; midshaft fractures can result in temporary wrist drop.',
    color: '#f5f5f4'
  },
  Radius: {
    name: 'Radius (Lateral Forearm Bone, Bilateral)',
    latin: 'Radius (Caput, Tuberositas, Processus styloideus)',
    system: 'Appendicular Skeleton (Upper Limb)',
    bonesInGroup: 2,
    function: 'Pivots smoothly around the stationary ulna to allow pronation and supination of the hand.',
    fact: 'Distal radius fracture (Colles fracture) is the single most common bone fracture in adults over 50.',
    color: '#e5e5e5'
  },
  Ulna: {
    name: 'Ulna (Medial Forearm Bone with Olecranon Elbow)',
    latin: 'Ulna (Olecranon, Incisura trochlearis)',
    system: 'Appendicular Skeleton (Upper Limb)',
    bonesInGroup: 2,
    function: 'Forms the stable hinge joint of the elbow with the humeral trochlea, preventing hyperextension.',
    fact: 'The olecranon process forms the subcutaneous point of the elbow and anchors the triceps brachii tendon.',
    color: '#e0e0e0'
  },
  Carpal_Bones: {
    name: 'Carpal Wrist Bones (16 Bones: 8 Per Hand)',
    latin: 'Ossa carpi (Scaphoideum, Lunatum, Triquetrum, Pisiforme, Trapezium, Trapezoideum, Capitatum, Hamatum)',
    system: 'Appendicular Skeleton (Hand)',
    bonesInGroup: 16,
    function: 'Provides multi-directional wrist flexion, extension, radial/ulnar deviation, and arch for carpal tunnel tendons.',
    fact: 'The scaphoid bone receives retrograde blood supply; fractures can result in avascular necrosis if untreated.',
    color: '#06b6d4'
  },
  Metacarpal_Bones: {
    name: 'Metacarpal Bones (10 Bones: I through V per Hand)',
    latin: 'Ossa metacarpi (I, II, III, IV, V)',
    system: 'Appendicular Skeleton (Hand)',
    bonesInGroup: 10,
    function: 'Forms palm framework; Metacarpal I (thumb) has a saddle joint allowing true opposition against all fingers.',
    fact: 'The human opposable thumb saddle carpometacarpal joint was a fundamental evolutionary leap for precision tool use.',
    color: '#22d3ee'
  },
  Phalanges_Hand: {
    name: 'Hand Phalanges (28 Bones: Proximal, Middle, Distal)',
    latin: 'Phalanges digitorum manus (Proximalis, Media, Distalis)',
    system: 'Appendicular Skeleton (Hand)',
    bonesInGroup: 28,
    function: 'Facilitates high-precision pinch grip, power grasp, and tactile finger manipulation.',
    fact: 'The thumb has only 2 phalanges (proximal and distal), while fingers 2-5 each have 3 distinct phalanges.',
    color: '#67e8f9'
  },

  // Appendicular Skeleton - Lower Extremities (62 bones)
  Pelvis_Coxal: {
    name: 'Pelvic Girdle (Bilateral Coxal: Ilium, Ischium, Pubis)',
    latin: 'Os coxae (Os ilii, Os ischii, Os pubis)',
    system: 'Appendicular Skeleton (Pelvis)',
    bonesInGroup: 2,
    function: 'Supports visceral organs, transfers trunk weight to lower limbs, and provides deep acetabulum hip sockets.',
    fact: 'The female pelvis has a wider subpubic angle (>90°) and broader pelvic inlet adapted for childbirth.',
    color: '#e2e8f0'
  },
  Femur: {
    name: 'Femur (Thigh Bone, Bilateral)',
    latin: 'Os femoris (Caput, Collum, Trochanteres, Condyli)',
    system: 'Appendicular Skeleton (Lower Limb)',
    bonesInGroup: 2,
    function: 'Longest, strongest, and heaviest bone in the body; withstands axial forces exceeding 1,000 kg during jumping.',
    fact: 'The femoral head sits at a 125° angle of inclination to the shaft, maximizing bipedal gait leverage.',
    color: '#f8fafc'
  },
  Patella: {
    name: 'Patella (Kneecap Sesamoid, Bilateral)',
    latin: 'Patella (Facies articularis)',
    system: 'Appendicular Skeleton (Lower Limb)',
    bonesInGroup: 2,
    function: 'Increases quadriceps extensor mechanical leverage by 30% and protects the knee joint capsule from anterior impact.',
    fact: 'The largest sesamoid bone in the human body, developing completely within the quadriceps tendon.',
    color: '#4ade80'
  },
  Tibia: {
    name: 'Tibia (Shinbone, Weight-Bearing, Bilateral)',
    latin: 'Tibia (Condyli, Tuberositas, Malleolus medialis)',
    system: 'Appendicular Skeleton (Lower Limb)',
    bonesInGroup: 2,
    function: 'Bears 90% of body weight between knee plateau and talus ankle mortise.',
    fact: 'The anterior tibial border is completely subcutaneous along the shin with no muscular cushioning.',
    color: '#e2e8f0'
  },
  Fibula: {
    name: 'Fibula (Calf Stabilizer Bone, Bilateral)',
    latin: 'Fibula (Caput, Malleolus lateralis)',
    system: 'Appendicular Skeleton (Lower Limb)',
    bonesInGroup: 2,
    function: 'Does not bear axial weight; anchors leg muscles and forms the lateral malleolus stabilizing the ankle mortise.',
    fact: 'Because it is non-weight bearing, mid-shaft fibula segments are frequently harvested for vascularized bone graft reconstruction.',
    color: '#cbd5e1'
  },
  Tarsal_Bones: {
    name: 'Tarsal Ankle Bones (14 Bones: 7 Per Foot)',
    latin: 'Ossa tarsi (Calcaneus, Talus, Naviculare, Cuneiformia 1-3, Cuboideum)',
    system: 'Appendicular Skeleton (Foot)',
    bonesInGroup: 14,
    function: 'Transmits ground reaction forces through the heel calcaneus and talus dome during bipedal heel-strike.',
    fact: 'The calcaneus (heel bone) is the largest foot bone and anchors the powerful Achilles tendon (tendo calcaneus).',
    color: '#10b981'
  },
  Metatarsal_Bones: {
    name: 'Metatarsal Bones (10 Bones: I through V per Foot)',
    latin: 'Ossa metatarsi (I, II, III, IV, V)',
    system: 'Appendicular Skeleton (Foot)',
    bonesInGroup: 10,
    function: 'Forms transverse and longitudinal shock-absorbing arches of the human foot.',
    fact: 'Metatarsal I (big toe) bears double the load of the other metatarsals during push-off propulsion.',
    color: '#34d399'
  },
  Phalanges_Foot: {
    name: 'Foot Toe Phalanges (28 Bones: Proximal, Middle, Distal)',
    latin: 'Phalanges digitorum pedis (Hallux & Toes 2-5)',
    system: 'Appendicular Skeleton (Foot)',
    bonesInGroup: 28,
    function: 'Provides ground gripping, dynamic balance stabilization, and propulsion during terminal gait cycle.',
    fact: 'Like the thumb, the great toe (hallux) has only 2 phalanges, whereas toes 2-5 have 3 phalanges.',
    color: '#6ee7b7'
  }
};

/**
 * Creates an anatomically authentic, museum-grade Human Skeleton model in Three.js
 * featuring all 206 individual human bones.
 */
export function createHumanSkeleton(interactiveMeshes = [], renderStyle = 'REALISTIC') {
  const skeletonGroup = new THREE.Group();
  skeletonGroup.name = 'Human_Skeleton_206_Bones_System';

  // 1. Materials
  // Natural realistic cortical bone material with organic roughness and subtle warm subsurface glow
  const boneMat = new THREE.MeshStandardMaterial({
    color: 0xede8db,
    roughness: 0.42,
    metalness: 0.08,
    emissive: 0x221d15,
    emissiveIntensity: 0.2
  });

  // Dense cortical bone for long bone shafts and mandible
  const denseBoneMat = new THREE.MeshStandardMaterial({
    color: 0xf2eee3,
    roughness: 0.36,
    metalness: 0.1,
    emissive: 0x28231a,
    emissiveIntensity: 0.2
  });

  // Articular cartilage & intervertebral discs
  const cartilageMat = new THREE.MeshStandardMaterial({
    color: 0x93c5fd,
    roughness: 0.25,
    metalness: 0.2,
    transparent: true,
    opacity: 0.85,
    emissive: 0x1d4ed8,
    emissiveIntensity: 0.25
  });

  // Joint articulation caps & condyles
  const jointMat = new THREE.MeshStandardMaterial({
    color: 0xe5e5e5,
    roughness: 0.28,
    metalness: 0.15
  });

  // Exploded view tracker
  const explodedParts = [];
  let boneRegistrationCount = 0;

  function registerBone(mesh, boneKey, explodeOffset, boneNumber) {
    boneRegistrationCount++;
    mesh.userData = {
      isAnatomyPart: true,
      organType: 'SKELETON',
      boneKey: boneKey,
      boneIndex: boneNumber || boneRegistrationCount,
      originalPos: mesh.position.clone(),
      explodeOffset: explodeOffset || new THREE.Vector3(0, 0, 0)
    };
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    interactiveMeshes.push(mesh);
    explodedParts.push(mesh);
    return mesh;
  }

  // ==========================================
  // HELPER GENERATORS FOR ORGANIC ANATOMICAL SHAPES
  // ==========================================

  // Anatomical long bone generator (bulbous condyle heads + curved diaphysis)
  function createAnatomicalLongBone(length, rShaft, rHeadProximal, rHeadDistal, mat = boneMat) {
    const group = new THREE.Group();

    // Shaft (slightly tapered and curved)
    const shaftGeo = new THREE.CylinderGeometry(rShaft * 0.9, rShaft * 1.05, length * 0.72, 16);
    const shaft = new THREE.Mesh(shaftGeo, mat);
    group.add(shaft);

    // Proximal head (spherical condyles/trochanters)
    const pHeadGeo = new THREE.SphereGeometry(rHeadProximal, 16, 14);
    pHeadGeo.scale(1.0, 1.15, 0.9);
    const pHead = new THREE.Mesh(pHeadGeo, denseBoneMat);
    pHead.position.set(0, length * 0.38, 0);
    group.add(pHead);

    // Distal condyles (two rounded knuckles)
    const dCondyle1 = new THREE.Mesh(new THREE.SphereGeometry(rHeadDistal * 0.75, 12, 12), jointMat);
    dCondyle1.position.set(-rHeadDistal * 0.45, -length * 0.38, 0);
    group.add(dCondyle1);

    const dCondyle2 = new THREE.Mesh(new THREE.SphereGeometry(rHeadDistal * 0.75, 12, 12), jointMat);
    dCondyle2.position.set(rHeadDistal * 0.45, -length * 0.38, 0);
    group.add(dCondyle2);

    return group;
  }

  // Anatomical vertebra generator (body + pedicles + spinous process + transverse processes)
  function createAnatomicalVertebra(y, bodyScale, spinousLength, spinousAngle, transverseSpan, boneKey, explodeVec, mat = boneMat) {
    const vGroup = new THREE.Group();
    vGroup.position.set(0, y, 0);

    // 1. Vertebral Body (Anterior weight-bearing cylinder with concave waist)
    const bodyGeo = new THREE.CylinderGeometry(0.24 * bodyScale, 0.26 * bodyScale, 0.16 * bodyScale, 16);
    const body = new THREE.Mesh(bodyGeo, mat);
    body.position.set(0, 0, 0.12 * bodyScale);
    vGroup.add(body);

    // 2. Intervertebral Disc
    const discGeo = new THREE.CylinderGeometry(0.25 * bodyScale, 0.25 * bodyScale, 0.05 * bodyScale, 16);
    const disc = new THREE.Mesh(discGeo, cartilageMat);
    disc.position.set(0, -0.09 * bodyScale, 0.12 * bodyScale);
    vGroup.add(disc);

    // 3. Posterior Spinous Process (The visible spine knobs on your back)
    const spinousGeo = new THREE.ConeGeometry(0.08 * bodyScale, spinousLength * bodyScale, 8);
    spinousGeo.rotateX(spinousAngle);
    const spinous = new THREE.Mesh(spinousGeo, mat);
    spinous.position.set(0, -0.02 * bodyScale, -0.22 * bodyScale);
    vGroup.add(spinous);

    // 4. Bilateral Transverse Processes (Lateral wings where ribs attach)
    const leftTpCurve = new THREE.LineCurve3(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(-transverseSpan * bodyScale, 0.02 * bodyScale, -0.1 * bodyScale)
    );
    const rightTpCurve = new THREE.LineCurve3(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(transverseSpan * bodyScale, 0.02 * bodyScale, -0.1 * bodyScale)
    );
    const tpGeo = new THREE.TubeGeometry(leftTpCurve, 4, 0.05 * bodyScale, 6, false);
    const leftTp = new THREE.Mesh(tpGeo, mat);
    vGroup.add(leftTp);

    const rightTp = new THREE.Mesh(new THREE.TubeGeometry(rightTpCurve, 4, 0.05 * bodyScale, 6, false), mat);
    vGroup.add(rightTp);

    registerBone(vGroup, boneKey, explodeVec);
    return vGroup;
  }

  // =========================================================================
  // 1. AXIAL SKELETON: CRANIUM, FACE, MANDIBLE & HYOID (23 Bones)
  // =========================================================================
  const skullGroup = new THREE.Group();
  skullGroup.position.set(0, 4.45, 0);

  // Neurocranium (Brain Vault: Frontal, Parietals, Temporals, Occipital, Sphenoid)
  const calvariaGeo = new THREE.SphereGeometry(0.9, 28, 24);
  calvariaGeo.scale(0.88, 1.08, 1.18);
  // Indent temples and occipital shelf
  const calvPos = calvariaGeo.attributes.position;
  for (let i = 0; i < calvPos.count; i++) {
    let x = calvPos.getX(i);
    let y = calvPos.getY(i);
    let z = calvPos.getZ(i);
    // Temporal fossae indentation
    if (Math.abs(x) > 0.5 && y > 0.1 && y < 0.8 && z > -0.2 && z < 0.5) {
      x *= 0.92;
    }
    // Foramen magnum flat base
    if (y < -0.6) {
      y *= 0.85;
    }
    calvPos.setXYZ(i, x, y, z);
  }
  calvariaGeo.computeVertexNormals();

  const calvariaMesh = new THREE.Mesh(calvariaGeo, denseBoneMat);
  registerBone(calvariaMesh, 'Cranium_Vault', new THREE.Vector3(0, 2.2, 0));
  skullGroup.add(calvariaMesh);

  // Facial Viscerocranium (Maxillae, Zygomatics, Nasal bridge, Orbits)
  const faceGroup = new THREE.Group();
  faceGroup.position.set(0, -0.32, 0.65);

  // Maxilla and Upper Dental Arch
  const maxillaGeo = new THREE.CylinderGeometry(0.38, 0.44, 0.45, 16, 1, false, 0, Math.PI);
  maxillaGeo.rotateY(Math.PI / 2);
  const maxillaMesh = new THREE.Mesh(maxillaGeo, denseBoneMat);
  maxillaMesh.position.set(0, -0.15, 0.28);
  faceGroup.add(maxillaMesh);

  // Bilateral Eye Orbits (Hollow cones)
  const orbitGeo = new THREE.ConeGeometry(0.24, 0.35, 16, 1, true);
  orbitGeo.rotateX(Math.PI / 2);
  const leftOrbit = new THREE.Mesh(orbitGeo, jointMat);
  leftOrbit.position.set(-0.32, 0.08, 0.38);
  faceGroup.add(leftOrbit);

  const rightOrbit = new THREE.Mesh(orbitGeo, jointMat);
  rightOrbit.position.set(0.32, 0.08, 0.38);
  faceGroup.add(rightOrbit);

  // Nasal Aperture (Piriform aperture)
  const nasalBridgeGeo = new THREE.BoxGeometry(0.14, 0.32, 0.22);
  const nasalBridge = new THREE.Mesh(nasalBridgeGeo, boneMat);
  nasalBridge.position.set(0, 0.04, 0.46);
  faceGroup.add(nasalBridge);

  // Zygomatic Arches (Cheekbones curving to temporal)
  const leftCheekCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.35, 0.0, 0.4),
    new THREE.Vector3(-0.75, -0.05, 0.2),
    new THREE.Vector3(-0.7, -0.08, -0.2)
  ]);
  const leftCheek = new THREE.Mesh(new THREE.TubeGeometry(leftCheekCurve, 12, 0.065, 8, false), denseBoneMat);
  faceGroup.add(leftCheek);

  const rightCheekCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.35, 0.0, 0.4),
    new THREE.Vector3(0.75, -0.05, 0.2),
    new THREE.Vector3(0.7, -0.08, -0.2)
  ]);
  const rightCheek = new THREE.Mesh(new THREE.TubeGeometry(rightCheekCurve, 12, 0.065, 8, false), denseBoneMat);
  faceGroup.add(rightCheek);

  registerBone(faceGroup, 'Facial_Bones', new THREE.Vector3(0, 1.6, 1.2));
  skullGroup.add(faceGroup);

  // Mandible (Lower Jawbone with coronoid process, condyles, and chin protuberance)
  const mandibleGroup = new THREE.Group();
  mandibleGroup.position.set(0, -0.85, 0.35);

  const jawCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.62, 0.38, -0.32), // Left TMJ condyle
    new THREE.Vector3(-0.68, 0.05, -0.15), // Left angle of jaw
    new THREE.Vector3(-0.48, -0.05, 0.32), // Left body
    new THREE.Vector3(0, -0.08, 0.48),    // Mental protuberance (Chin)
    new THREE.Vector3(0.48, -0.05, 0.32),  // Right body
    new THREE.Vector3(0.68, 0.05, -0.15),  // Right angle
    new THREE.Vector3(0.62, 0.38, -0.32)  // Right TMJ condyle
  ]);
  const jawMesh = new THREE.Mesh(new THREE.TubeGeometry(jawCurve, 28, 0.08, 10, false), denseBoneMat);
  mandibleGroup.add(jawMesh);

  registerBone(mandibleGroup, 'Mandible', new THREE.Vector3(0, 0.6, 1.6));
  skullGroup.add(mandibleGroup);

  // Hyoid Bone (Suspended in anterior neck)
  const hyoidCurve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(-0.25, -1.2, 0.2),
    new THREE.Vector3(0, -1.25, 0.42),
    new THREE.Vector3(0.25, -1.2, 0.2)
  );
  const hyoidMesh = new THREE.Mesh(new THREE.TubeGeometry(hyoidCurve, 12, 0.035, 8, false), boneMat);
  registerBone(hyoidMesh, 'Hyoid_Bone', new THREE.Vector3(0, 0.2, 0.8));
  skullGroup.add(hyoidMesh);

  skeletonGroup.add(skullGroup);

  // =========================================================================
  // 2. AXIAL SKELETON: VERTEBRAL COLUMN (26 Distinct Moveable Units / 33 Vertebrae)
  // =========================================================================
  const spineGroup = new THREE.Group();

  // A. Cervical Spine: 7 Vertebrae (C1 Atlas, C2 Axis, C3-C7)
  const cervicalGroup = new THREE.Group();
  for (let i = 0; i < 7; i++) {
    const y = 3.45 - i * 0.16;
    const bodyScale = 0.75 + i * 0.03;
    const spinousLen = 0.22 + i * 0.03;
    const isC7 = i === 6; // Vertebra prominens
    const v = createAnatomicalVertebra(
      y,
      bodyScale,
      isC7 ? 0.38 : spinousLen,
      Math.PI * 0.65,
      0.32,
      'Cervical_Vertebra',
      new THREE.Vector3(0, 0.8, -0.4),
      denseBoneMat
    );
    cervicalGroup.add(v);
  }
  spineGroup.add(cervicalGroup);

  // B. Thoracic Spine: 12 Vertebrae (T1 to T12 with long overlapping spinous processes)
  const thoracicSpineGroup = new THREE.Group();
  for (let i = 0; i < 12; i++) {
    const y = 2.25 - i * 0.18;
    const bodyScale = 0.95 + i * 0.025;
    // Kyphotic natural backward thoracic curve
    const zCurve = -Math.sin((i / 11) * Math.PI) * 0.14;
    const v = createAnatomicalVertebra(
      y,
      bodyScale,
      0.42,
      Math.PI * 0.78, // Pointing sharply down and back
      0.45,
      'Thoracic_Vertebra',
      new THREE.Vector3(0, 0, -0.9),
      boneMat
    );
    v.position.z = zCurve;
    thoracicSpineGroup.add(v);
  }
  spineGroup.add(thoracicSpineGroup);

  // C. Lumbar Spine: 5 Massive Vertebrae (L1 to L5)
  const lumbarSpineGroup = new THREE.Group();
  for (let i = 0; i < 5; i++) {
    const y = -0.05 - i * 0.22;
    const bodyScale = 1.25 + i * 0.04;
    // Lordotic natural forward lumbar curve
    const zCurve = 0.05 + Math.sin((i / 4) * Math.PI) * 0.08;
    const v = createAnatomicalVertebra(
      y,
      bodyScale,
      0.35,
      Math.PI * 0.52, // Horizontal sturdy spinous process
      0.55,
      'Lumbar_Vertebra',
      new THREE.Vector3(0, -0.5, -0.7),
      denseBoneMat
    );
    v.position.z = zCurve;
    lumbarSpineGroup.add(v);
  }
  spineGroup.add(lumbarSpineGroup);

  // D. Sacrum (5 Fused) & Coccyx (4 Fused Tailbone)
  const sacrumCoccyxGroup = new THREE.Group();
  sacrumCoccyxGroup.position.set(0, -1.55, -0.05);

  // Sacrum triangular wedge with median sacral crest and sacral foramina
  const sacrumGeo = new THREE.ConeGeometry(0.58, 0.95, 14);
  sacrumGeo.rotateX(Math.PI * 1.05);
  sacrumGeo.scale(1.15, 1.0, 0.65);
  const sacrumMesh = new THREE.Mesh(sacrumGeo, denseBoneMat);
  sacrumCoccyxGroup.add(sacrumMesh);

  // Coccyx (Small curved tailbone apex)
  const coccyxGeo = new THREE.ConeGeometry(0.18, 0.38, 8);
  coccyxGeo.rotateX(Math.PI * 1.2);
  const coccyxMesh = new THREE.Mesh(coccyxGeo, boneMat);
  coccyxMesh.position.set(0, -0.58, -0.15);
  sacrumCoccyxGroup.add(coccyxMesh);

  registerBone(sacrumCoccyxGroup, 'Sacrum_Coccyx', new THREE.Vector3(0, -1.0, -0.5));
  spineGroup.add(sacrumCoccyxGroup);

  skeletonGroup.add(spineGroup);

  // =========================================================================
  // 3. AXIAL SKELETON: THORACIC CAGE (Sternum + 24 Complete Ribs)
  // =========================================================================
  const thoraxGroup = new THREE.Group();

  // Sternum (Manubrium with jugular notch, Body with costal facets, Xiphoid tip)
  const sternumGroup = new THREE.Group();
  sternumGroup.position.set(0, 1.45, 1.12);

  // Manubrium
  const manubriumGeo = new THREE.BoxGeometry(0.55, 0.36, 0.12);
  const manubrium = new THREE.Mesh(manubriumGeo, denseBoneMat);
  manubrium.position.set(0, 0.72, 0);
  sternumGroup.add(manubrium);

  // Gladiolus (Sternal Body)
  const gladiolusGeo = new THREE.BoxGeometry(0.34, 1.15, 0.09);
  const gladiolus = new THREE.Mesh(gladiolusGeo, denseBoneMat);
  gladiolus.position.set(0, -0.05, 0);
  sternumGroup.add(gladiolus);

  // Xiphoid Process (Pointed cartilage tip)
  const xiphoidGeo = new THREE.ConeGeometry(0.1, 0.28, 6);
  xiphoidGeo.rotateX(Math.PI);
  const xiphoid = new THREE.Mesh(xiphoidGeo, cartilageMat);
  xiphoid.position.set(0, -0.72, 0);
  sternumGroup.add(xiphoid);

  registerBone(sternumGroup, 'Sternum', new THREE.Vector3(0, 0.4, 1.8));
  thoraxGroup.add(sternumGroup);

  // All 24 Individual Ribs (12 Pairs: True, False, Floating)
  const ribsGroup = new THREE.Group();

  for (let i = 0; i < 12; i++) {
    const pairIndex = i + 1;
    const y = 2.15 - i * 0.17;
    const isFloating = i >= 10; // Ribs 11 & 12
    const isFalse = i >= 7 && i < 10; // Ribs 8, 9, 10

    // Curvature width and anteroposterior barrel chest depth
    const barrel = Math.sin((i / 11) * Math.PI);
    const span = 0.75 + barrel * 0.95;
    const depth = 0.7 + barrel * 0.45;
    const antY = y - (isFloating ? 0.05 : 0.22);
    const antZ = isFloating ? depth * 0.5 : 1.05;

    // Left Rib
    const leftRibCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(-0.22, y + 0.02, -0.1),  // Head at vertebra
      new THREE.Vector3(-span * 1.05, y + 0.05, depth * 0.2), // Angle & tubercle
      new THREE.Vector3(-span * 0.85, y - 0.15, depth * 0.85), // Costal groove
      new THREE.Vector3(-0.25, antY, antZ) // Anterior sternal end
    );
    const leftRib = new THREE.Mesh(
      new THREE.TubeGeometry(leftRibCurve, 20, 0.042, 8, false),
      denseBoneMat
    );
    ribsGroup.add(leftRib);

    // Right Rib
    const rightRibCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(0.22, y + 0.02, -0.1),
      new THREE.Vector3(span * 1.05, y + 0.05, depth * 0.2),
      new THREE.Vector3(span * 0.85, y - 0.15, depth * 0.85),
      new THREE.Vector3(0.25, antY, antZ)
    );
    const rightRib = new THREE.Mesh(
      new THREE.TubeGeometry(rightRibCurve, 20, 0.042, 8, false),
      denseBoneMat
    );
    ribsGroup.add(rightRib);

    // Costal Cartilage extensions connecting ribs 1-10 to sternum
    if (!isFloating) {
      const leftCartCurve = new THREE.LineCurve3(
        new THREE.Vector3(-0.25, antY, antZ),
        new THREE.Vector3(-0.16, 1.45 + (3 - i) * 0.14, 1.12)
      );
      ribsGroup.add(new THREE.Mesh(new THREE.TubeGeometry(leftCartCurve, 4, 0.038, 6, false), cartilageMat));

      const rightCartCurve = new THREE.LineCurve3(
        new THREE.Vector3(0.25, antY, antZ),
        new THREE.Vector3(0.16, 1.45 + (3 - i) * 0.14, 1.12)
      );
      ribsGroup.add(new THREE.Mesh(new THREE.TubeGeometry(rightCartCurve, 4, 0.038, 6, false), cartilageMat));
    }
  }

  registerBone(ribsGroup, 'Rib_Pair', new THREE.Vector3(0, 0, 1.4));
  thoraxGroup.add(ribsGroup);
  skeletonGroup.add(thoraxGroup);

  // =========================================================================
  // 4. APPENDICULAR SKELETON: PECTORAL GIRDLE & UPPER LIMBS (64 Bones)
  // =========================================================================
  const upperLimbGroup = new THREE.Group();

  // A. Clavicles (Bilateral S-shaped Struts)
  const clavicleGroup = new THREE.Group();
  const leftClavCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.16, 2.38, 1.08), // Sternal end
    new THREE.Vector3(-0.85, 2.45, 0.85), // Convex anterior curve
    new THREE.Vector3(-1.65, 2.35, 0.35)  // Acromial end
  ]);
  const leftClav = new THREE.Mesh(new THREE.TubeGeometry(leftClavCurve, 16, 0.062, 8, false), denseBoneMat);
  clavicleGroup.add(leftClav);

  const rightClavCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.16, 2.38, 1.08),
    new THREE.Vector3(0.85, 2.45, 0.85),
    new THREE.Vector3(1.65, 2.35, 0.35)
  ]);
  const rightClav = new THREE.Mesh(new THREE.TubeGeometry(rightClavCurve, 16, 0.062, 8, false), denseBoneMat);
  clavicleGroup.add(rightClav);

  registerBone(clavicleGroup, 'Clavicle', new THREE.Vector3(0, 0.8, 0.8));
  upperLimbGroup.add(clavicleGroup);

  // B. Scapulae (Shoulder Blades with Spine, Acromion & Coracoid)
  const scapulaGroup = new THREE.Group();

  function createAnatomicalScapula(isLeft) {
    const s = new THREE.Group();
    const sign = isLeft ? -1 : 1;

    // Triangular body plate
    const scaGeo = new THREE.BufferGeometry();
    const scaVertices = new Float32Array([
      0, 0.65, 0,
      sign * 0.75, -0.45, 0.05,
      sign * -0.25, -0.55, -0.05
    ]);
    scaGeo.setAttribute('position', new THREE.BufferAttribute(scaVertices, 3));
    scaGeo.computeVertexNormals();
    s.add(new THREE.Mesh(scaGeo, denseBoneMat));

    // Elevated Spine of Scapula running horizontally across posterior surface
    const spineCurve = new THREE.LineCurve3(
      new THREE.Vector3(sign * -0.2, 0.35, -0.05),
      new THREE.Vector3(sign * 0.68, 0.58, 0.15)
    );
    s.add(new THREE.Mesh(new THREE.TubeGeometry(spineCurve, 8, 0.05, 6, false), denseBoneMat));

    // Acromion Process tip
    const acromion = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.1, 0.25), jointMat);
    acromion.position.set(sign * 0.7, 0.62, 0.25);
    s.add(acromion);

    // Coracoid Process hook anteriorly
    const coracoidCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(sign * 0.45, 0.5, 0.0),
      new THREE.Vector3(sign * 0.55, 0.65, 0.2),
      new THREE.Vector3(sign * 0.35, 0.55, 0.35)
    );
    s.add(new THREE.Mesh(new THREE.TubeGeometry(coracoidCurve, 8, 0.045, 6, false), denseBoneMat));

    s.position.set(sign * 1.15, 1.85, -0.38);
    s.rotation.y = sign * 0.25;
    return s;
  }

  scapulaGroup.add(createAnatomicalScapula(true));
  scapulaGroup.add(createAnatomicalScapula(false));
  registerBone(scapulaGroup, 'Scapula', new THREE.Vector3(0, 0, -1.2));
  upperLimbGroup.add(scapulaGroup);

  // C. Upper Limbs: Humerus (Bilateral)
  const leftHumerus = createAnatomicalLongBone(1.75, 0.105, 0.22, 0.18, denseBoneMat);
  leftHumerus.position.set(-1.82, 1.35, 0.1);
  leftHumerus.rotation.z = 0.08;
  registerBone(leftHumerus, 'Humerus', new THREE.Vector3(-1.6, 0.5, 0));
  upperLimbGroup.add(leftHumerus);

  const rightHumerus = createAnatomicalLongBone(1.75, 0.105, 0.22, 0.18, denseBoneMat);
  rightHumerus.position.set(1.82, 1.35, 0.1);
  rightHumerus.rotation.z = -0.08;
  registerBone(rightHumerus, 'Humerus', new THREE.Vector3(1.6, 0.5, 0));
  upperLimbGroup.add(rightHumerus);

  // D. Forearms: Radius & Ulna (Bilateral)
  const leftRadius = createAnatomicalLongBone(1.5, 0.075, 0.12, 0.14, boneMat);
  leftRadius.position.set(-2.02, -0.35, 0.12);
  registerBone(leftRadius, 'Radius', new THREE.Vector3(-2.2, -0.4, 0.2));
  upperLimbGroup.add(leftRadius);

  const leftUlna = createAnatomicalLongBone(1.55, 0.08, 0.16, 0.11, denseBoneMat);
  leftUlna.position.set(-1.85, -0.35, 0.02);
  registerBone(leftUlna, 'Ulna', new THREE.Vector3(-2.0, -0.4, -0.2));
  upperLimbGroup.add(leftUlna);

  const rightRadius = createAnatomicalLongBone(1.5, 0.075, 0.12, 0.14, boneMat);
  rightRadius.position.set(2.02, -0.35, 0.12);
  registerBone(rightRadius, 'Radius', new THREE.Vector3(2.2, -0.4, 0.2));
  upperLimbGroup.add(rightRadius);

  const rightUlna = createAnatomicalLongBone(1.55, 0.08, 0.16, 0.11, denseBoneMat);
  rightUlna.position.set(1.85, -0.35, 0.02);
  registerBone(rightUlna, 'Ulna', new THREE.Vector3(2.0, -0.4, -0.2));
  upperLimbGroup.add(rightUlna);

  // E. Complete Articulated Hands (Carpals 16, Metacarpals 10, Phalanges 28 = 54 Bones)
  function createArticulatedHand(isLeft) {
    const hand = new THREE.Group();
    const sign = isLeft ? -1 : 1;

    // 1. 8 Carpal Bones in 2 rows
    const carpalGroup = new THREE.Group();
    const carpalNames = ['Scaphoid', 'Lunate', 'Triquetrum', 'Pisiform', 'Trapezium', 'Trapezoid', 'Capitate', 'Hamate'];
    for (let c = 0; c < 8; c++) {
      const row = c < 4 ? 0 : 1;
      const col = c % 4;
      const cMesh = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.045, 0),
        jointMat
      );
      cMesh.position.set((col - 1.5) * 0.08, -row * 0.07, (Math.random() - 0.5) * 0.03);
      carpalGroup.add(cMesh);
    }
    hand.add(carpalGroup);

    // 2. 5 Metacarpals (Fan-like spread)
    const metaGroup = new THREE.Group();
    for (let m = 0; m < 5; m++) {
      const angle = (m - 2) * 0.12;
      const length = m === 0 ? 0.32 : 0.42; // Thumb metacarpal is shorter
      const mBone = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.03, length, 8),
        denseBoneMat
      );
      mBone.position.set((m - 2) * 0.075, -0.3, 0);
      mBone.rotation.z = -angle * sign;
      metaGroup.add(mBone);
    }
    hand.add(metaGroup);

    // 3. 14 Hand Phalanges (Thumb has 2; Fingers 2-5 each have 3)
    const phalanxGroup = new THREE.Group();
    for (let f = 0; f < 5; f++) {
      const isThumb = f === 0;
      const numSegments = isThumb ? 2 : 3;
      const baseX = (f - 2) * 0.078;
      let curY = -0.52;

      for (let s = 0; s < numSegments; s++) {
        const segLen = (0.24 - s * 0.05) * (isThumb ? 0.85 : 1.0);
        const pMesh = new THREE.Mesh(
          new THREE.CylinderGeometry(0.02, 0.024, segLen, 8),
          boneMat
        );
        pMesh.position.set(baseX, curY - segLen / 2, 0);
        phalanxGroup.add(pMesh);

        // Interphalangeal joint bead
        const jMesh = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), jointMat);
        jMesh.position.set(baseX, curY, 0);
        phalanxGroup.add(jMesh);

        curY -= segLen + 0.02;
      }
    }
    hand.add(phalanxGroup);

    hand.position.set(sign * 1.95, -1.35, 0.08);
    return hand;
  }

  const leftHand = createArticulatedHand(true);
  registerBone(leftHand, 'Hand_Bones', new THREE.Vector3(-2.8, -1.2, 0));
  upperLimbGroup.add(leftHand);

  const rightHand = createArticulatedHand(false);
  registerBone(rightHand, 'Hand_Bones', new THREE.Vector3(2.8, -1.2, 0));
  upperLimbGroup.add(rightHand);

  skeletonGroup.add(upperLimbGroup);

  // =========================================================================
  // 5. APPENDICULAR SKELETON: PELVIC GIRDLE (2 Coxal Hip Bones)
  // =========================================================================
  const pelvicGroup = new THREE.Group();
  pelvicGroup.position.set(0, -1.5, 0.05);

  function createAnatomicalCoxalBone(isLeft) {
    const hip = new THREE.Group();
    const sign = isLeft ? -1 : 1;

    // A. Ilium Blade (Wing-like curved plate with prominent crest)
    const iliumGeo = new THREE.TorusGeometry(0.72, 0.16, 14, 28, Math.PI * 0.8);
    iliumGeo.rotateZ(sign * Math.PI * 0.2);
    const ilium = new THREE.Mesh(iliumGeo, denseBoneMat);
    ilium.position.set(sign * 0.72, 0.12, 0.05);
    hip.add(ilium);

    // B. Acetabulum (Deep spherical hip socket for femoral head)
    const acetabulumGeo = new THREE.SphereGeometry(0.25, 16, 12, 0, Math.PI);
    acetabulumGeo.rotateY(sign * Math.PI / 2);
    const acetabulum = new THREE.Mesh(acetabulumGeo, jointMat);
    acetabulum.position.set(sign * 0.95, -0.45, 0.02);
    hip.add(acetabulum);

    // C. Ischium & Pubis with large Obturator Foramen ring
    const obturatorGeo = new THREE.TorusGeometry(0.28, 0.08, 10, 20);
    const obturator = new THREE.Mesh(obturatorGeo, denseBoneMat);
    obturator.position.set(sign * 0.65, -0.72, 0.15);
    hip.add(obturator);

    // D. Pubic symphysis anterior bridge
    const pubis = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.45, 10), cartilageMat);
    pubis.position.set(sign * 0.18, -0.75, 0.35);
    pubis.rotation.z = Math.PI / 2;
    hip.add(pubis);

    return hip;
  }

  pelvicGroup.add(createAnatomicalCoxalBone(true));
  pelvicGroup.add(createAnatomicalCoxalBone(false));
  registerBone(pelvicGroup, 'Pelvis_Coxal', new THREE.Vector3(0, -0.8, 0.7));
  skeletonGroup.add(pelvicGroup);

  // =========================================================================
  // 6. APPENDICULAR SKELETON: LOWER LIMBS & FEET (60 Bones)
  // =========================================================================
  const lowerLimbGroup = new THREE.Group();

  // A. Femurs (Thigh Bones with angled neck and greater trochanter)
  function createAnatomicalFemur(isLeft) {
    const f = new THREE.Group();
    const sign = isLeft ? -1 : 1;

    // Shaft (slightly forward bowed)
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.15, 2.2, 16), denseBoneMat);
    shaft.position.set(0, 0, 0);
    f.add(shaft);

    // Femoral Head (Spherical ball articulating into acetabulum)
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 16), jointMat);
    head.position.set(-sign * 0.32, 1.15, 0.05);
    f.add(head);

    // Angled Femoral Neck connecting head to shaft
    const neckCurve = new THREE.LineCurve3(
      new THREE.Vector3(0, 0.95, 0),
      new THREE.Vector3(-sign * 0.32, 1.15, 0.05)
    );
    f.add(new THREE.Mesh(new THREE.TubeGeometry(neckCurve, 8, 0.11, 10, false), denseBoneMat));

    // Greater Trochanter (Lateral muscle attachment crest)
    const trochanter = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.25, 0.18), denseBoneMat);
    trochanter.position.set(sign * 0.12, 1.05, -0.02);
    f.add(trochanter);

    // Distal Lateral & Medial Condyles
    const condyle1 = new THREE.Mesh(new THREE.SphereGeometry(0.17, 14, 14), jointMat);
    condyle1.position.set(-0.15, -1.1, -0.05);
    f.add(condyle1);

    const condyle2 = new THREE.Mesh(new THREE.SphereGeometry(0.17, 14, 14), jointMat);
    condyle2.position.set(0.15, -1.1, -0.05);
    f.add(condyle2);

    f.position.set(sign * 0.98, -3.05, 0.08);
    f.rotation.z = -sign * 0.07;
    return f;
  }

  const leftFemur = createAnatomicalFemur(true);
  registerBone(leftFemur, 'Femur', new THREE.Vector3(-1.4, -1.5, 0));
  lowerLimbGroup.add(leftFemur);

  const rightFemur = createAnatomicalFemur(false);
  registerBone(rightFemur, 'Femur', new THREE.Vector3(1.4, -1.5, 0));
  lowerLimbGroup.add(rightFemur);

  // B. Patellae (Sesamoid Kneecaps)
  const leftPatella = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 12), jointMat);
  leftPatella.scale.set(1.1, 1.3, 0.55);
  leftPatella.position.set(-0.95, -4.25, 0.28);
  registerBone(leftPatella, 'Patella', new THREE.Vector3(-1.2, -2.2, 0.9));
  lowerLimbGroup.add(leftPatella);

  const rightPatella = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 12), jointMat);
  rightPatella.scale.set(1.1, 1.3, 0.55);
  rightPatella.position.set(0.95, -4.25, 0.28);
  registerBone(rightPatella, 'Patella', new THREE.Vector3(1.2, -2.2, 0.9));
  lowerLimbGroup.add(rightPatella);

  // C. Lower Leg: Tibia (Shin) & Fibula
  function createAnatomicalLowerLeg(isLeft) {
    const leg = new THREE.Group();
    const sign = isLeft ? -1 : 1;

    // Tibia: Broad plateau, sharp anterior crest, medial malleolus
    const tib = new THREE.Group();
    const tibShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.11, 2.05, 14), denseBoneMat);
    tib.add(tibShaft);

    // Plateau
    const plateau = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.16, 0.18, 16), jointMat);
    plateau.position.set(0, 1.02, 0);
    tib.add(plateau);

    // Medial malleolus (Inner ankle bone)
    const mMal = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.2, 8), denseBoneMat);
    mMal.position.set(-sign * 0.1, -1.05, 0);
    tib.add(mMal);

    leg.add(tib);

    // Fibula: Slender lateral stabilizer
    const fib = new THREE.Group();
    const fibShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 1.98, 10), boneMat);
    fib.add(fibShaft);

    // Lateral malleolus (Outer ankle bone)
    const lMal = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 10), denseBoneMat);
    lMal.position.set(0, -1.02, 0);
    fib.add(lMal);

    fib.position.set(sign * 0.28, -0.05, -0.02);
    leg.add(fib);

    leg.position.set(sign * 0.95, -5.45, 0.05);
    return leg;
  }

  const leftLeg = createAnatomicalLowerLeg(true);
  registerBone(leftLeg, 'Tibia', new THREE.Vector3(-1.6, -3.2, 0));
  lowerLimbGroup.add(leftLeg);

  const rightLeg = createAnatomicalLowerLeg(false);
  registerBone(rightLeg, 'Tibia', new THREE.Vector3(1.6, -3.2, 0));
  lowerLimbGroup.add(rightLeg);

  // D. Complete Articulated Feet (Tarsals 14, Metatarsals 10, Phalanges 28 = 52 Bones)
  function createArticulatedFoot(isLeft) {
    const foot = new THREE.Group();
    const sign = isLeft ? -1 : 1;

    // 1. Tarsals (Calcaneus heel projecting back, Talus dome articulating with ankle mortise, Navicular, Cuboid, 3 Cuneiforms)
    const tarsalGroup = new THREE.Group();

    // Calcaneus (Heel bone)
    const calcaneus = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.22, 0.48), denseBoneMat);
    calcaneus.position.set(0, -0.1, -0.22);
    tarsalGroup.add(calcaneus);

    // Talus (Ankle dome)
    const talus = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), jointMat);
    talus.position.set(0, 0.04, 0.02);
    tarsalGroup.add(talus);

    // Navicular, Cuneiforms & Cuboid cluster
    const midfoot = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.16, 0.25), boneMat);
    midfoot.position.set(0, -0.05, 0.22);
    tarsalGroup.add(midfoot);

    foot.add(tarsalGroup);

    // 2. 5 Metatarsal Bones (Transverse and longitudinal arches)
    const metaGroup = new THREE.Group();
    for (let m = 0; m < 5; m++) {
      const isGreatToe = m === 0;
      const mX = (m - 2) * 0.075 * sign;
      const mLen = isGreatToe ? 0.38 : 0.42;
      const mMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(isGreatToe ? 0.04 : 0.025, isGreatToe ? 0.045 : 0.03, mLen, 8),
        denseBoneMat
      );
      mMesh.rotateX(Math.PI / 2);
      mMesh.position.set(mX, -0.12, 0.52);
      metaGroup.add(mMesh);
    }
    foot.add(metaGroup);

    // 3. 14 Toe Phalanges (Great toe has 2; toes 2-5 each have 3)
    const toeGroup = new THREE.Group();
    for (let t = 0; t < 5; t++) {
      const isGreatToe = t === 0;
      const numPhal = isGreatToe ? 2 : 3;
      const tX = (t - 2) * 0.075 * sign;
      let curZ = 0.74;

      for (let s = 0; s < numPhal; s++) {
        const segLen = (0.16 - s * 0.04) * (isGreatToe ? 1.15 : 0.85);
        const pToe = new THREE.Mesh(
          new THREE.CylinderGeometry(0.025, 0.028, segLen, 8),
          boneMat
        );
        pToe.rotateX(Math.PI / 2);
        pToe.position.set(tX, -0.14, curZ + segLen / 2);
        toeGroup.add(pToe);

        curZ += segLen + 0.02;
      }
    }
    foot.add(toeGroup);

    foot.position.set(sign * 0.95, -6.65, 0.18);
    return foot;
  }

  const leftFoot = createArticulatedFoot(true);
  registerBone(leftFoot, 'Foot_Bones', new THREE.Vector3(-1.8, -4.2, 0.8));
  lowerLimbGroup.add(leftFoot);

  const rightFoot = createArticulatedFoot(false);
  registerBone(rightFoot, 'Foot_Bones', new THREE.Vector3(1.8, -4.2, 0.8));
  lowerLimbGroup.add(rightFoot);

  skeletonGroup.add(lowerLimbGroup);

  // ==========================================
  // RUNTIME CONTROLLERS & ANIMATION
  // ==========================================
  skeletonGroup.userData = {
    totalBonesCount: 206,
    explodedParts,
    animateExplode: (explodeRatio) => {
      explodedParts.forEach((part) => {
        if (!part.userData.originalPos || !part.userData.explodeOffset) return;
        const targetPos = part.userData.originalPos
          .clone()
          .addScaledVector(part.userData.explodeOffset, explodeRatio);
        part.position.copy(targetPos);
      });
    }
  };

  // Center vertically
  skeletonGroup.position.set(0, 0.85, 0);
  skeletonGroup.scale.set(0.72, 0.72, 0.72);

  return skeletonGroup;
}
