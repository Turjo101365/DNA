import * as THREE from 'three';

export const DNA_ANATOMY_INFO = {
  A: {
    name: 'Adenine (A)',
    latin: 'Adeninum (Purina)',
    type: 'Purine Nucleobase',
    formula: 'C₅H₅N₅',
    complement: 'Thymine (T)',
    bonds: '2 Hydrogen Bonds',
    desc: 'Forms complementary base pairs with Thymine. Essential in cellular energy transduction (ATP) and coenzymes (NAD, FAD).',
    color: '#00f0ff'
  },
  T: {
    name: 'Thymine (T)',
    latin: 'Thyminum (Pyrimidina)',
    type: 'Pyrimidine Nucleobase',
    formula: 'C₅H₆N₂O₂',
    complement: 'Adenine (A)',
    bonds: '2 Hydrogen Bonds',
    desc: 'Pairs exclusively with Adenine in DNA double-helical stabilization; replaced by Uracil (U) in RNA transcription.',
    color: '#ff3366'
  },
  G: {
    name: 'Guanine (G)',
    latin: 'Guaninum (Purina)',
    type: 'Purine Nucleobase',
    formula: 'C₅H₅N₅O',
    complement: 'Cytosine (C)',
    bonds: '3 Hydrogen Bonds',
    desc: 'Forms robust 3-hydrogen-bond pairs with Cytosine, imparting high thermodynamic stability to genomic DNA.',
    color: '#00ff88'
  },
  C: {
    name: 'Cytosine (C)',
    latin: 'Cytosinum (Pyrimidina)',
    type: 'Pyrimidine Nucleobase',
    formula: 'C₄H₅N₃O',
    complement: 'Guanine (G)',
    bonds: '3 Hydrogen Bonds',
    desc: 'Crucial for epigenetic DNA methylation and gene expression regulation; pairs exclusively with Guanine.',
    color: '#ffaa00'
  }
};

export function createProceduralDNA(interactiveMeshes = []) {
  const dnaGroup = new THREE.Group();
  dnaGroup.name = 'Procedural_DNA_Double_Helix';

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

  const rungs = [];

  for (let i = 0; i < numPairs; i++) {
    const y = (i - numPairs / 2) * heightStep;
    const [b1, b2] = basePairsSequence[i % basePairsSequence.length];

    const node1 = new THREE.Mesh(sphereGeo, backboneMat1);
    const node2 = new THREE.Mesh(sphereGeo, backboneMat2);
    dnaGroup.add(node1);
    dnaGroup.add(node2);

    const rung1 = new THREE.Mesh(cylinderGeo, baseMaterials[b1]);
    rung1.scale.set(radius * 0.95, 1, 1);
    rung1.userData = { isAnatomyPart: true, organType: 'DNA', baseType: b1, pairIndex: i };
    dnaGroup.add(rung1);
    interactiveMeshes.push(rung1);

    const rung2 = new THREE.Mesh(cylinderGeo, baseMaterials[b2]);
    rung2.scale.set(radius * 0.95, 1, 1);
    rung2.userData = { isAnatomyPart: true, organType: 'DNA', baseType: b2, pairIndex: i };
    dnaGroup.add(rung2);
    interactiveMeshes.push(rung2);

    const hydrogenBond = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 10, 10),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1, metalness: 0.9, emissive: 0x333333 })
    );
    dnaGroup.add(hydrogenBond);

    rungs.push({ node1, node2, rung1, rung2, hydrogenBond, y, index: i });
  }

  dnaGroup.userData = {
    rungs,
    animateUnwind: (unwindFactor) => {
      const twist = (1 - unwindFactor * 0.95) * 0.35;
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
  };

  dnaGroup.scale.set(0.9, 0.9, 0.9);
  return dnaGroup;
}
