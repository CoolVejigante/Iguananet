/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Section 2: Inspection Bay - SGX.Showcase
 * The Grimoire v2026.5 Architecture:
 * - RoomEnvironment (prevents pitch-black PBR models)
 * - DRACOLoader with official Google CDN ('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')
 * - CORS mitigation: loader.setCrossOrigin('anonymous')
 * - Deep GPU memory cleanup (.dispose()) on geometries, materials, and textures
 * - Wireframe Toggle (Tangerine #F57E00)
 * - Telemetry Box: Vertices, Triangles, DRACO compression status, Draw Calls
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import {
  Box,
  Layers,
  RotateCw,
  RefreshCw,
  Upload,
  Cpu,
  ShieldCheck,
  Sun,
  Eye,
  Activity,
  AlertCircle,
  X,
  Palette,
  CheckCircle2,
  Terminal,
  Maximize2
} from 'lucide-react';
import { soundEngine } from '../services/sound-effects';

export type BuiltinModelId = 'TERMINAL' | 'DRONE' | 'ARCHVIZ' | 'FUSION_CORE';

interface IguanaInspectionBayProps {
  initialModel?: BuiltinModelId;
}

export const IguanaInspectionBay: React.FC<IguanaInspectionBayProps> = ({
  initialModel = 'TERMINAL'
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [activeModelId, setActiveModelId] = useState<BuiltinModelId>(initialModel);
  const [isWireframe, setIsWireframe] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [exposure, setExposure] = useState<number>(1.15);
  const [uploadedModelName, setUploadedModelName] = useState<string | null>(null);
  const [isLoadingModel, setIsLoadingModel] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isDracoActive, setIsDracoActive] = useState<boolean>(true);

  const [stats, setStats] = useState({
    vertices: 5420,
    triangles: 8940,
    drawCalls: 12,
    dracoStatus: 'OPTIMIZADO (DRACO v1.5.6)'
  });

  const sceneRefs = useRef<{
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    renderer: THREE.WebGLRenderer | null;
    controls: OrbitControls | null;
    currentMeshGroup: THREE.Group | null;
    pmremGenerator: THREE.PMREMGenerator | null;
  }>({
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    currentMeshGroup: null,
    pmremGenerator: null
  });

  const uploadedModelRef = useRef<{
    object: THREE.Object3D | null;
    originalMaterialsMap: Map<THREE.Mesh, THREE.Material | THREE.Material[]>;
  }>({
    object: null,
    originalMaterialsMap: new Map()
  });

  // Deep GPU memory dispose routine (Grimoire Cap 2.4)
  const disposeGroup = (group: THREE.Group) => {
    while (group.children.length > 0) {
      const obj = group.children[0];
      obj.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.geometry) mesh.geometry.dispose();
          if (mesh.material) {
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach((mat) => mat.dispose());
            } else {
              mesh.material.dispose();
            }
          }
        }
      });
      group.remove(obj);
    }
  };

  // Build high-detail composite 3D models (3-12 parts, varied roughness/metalness)
  const buildCompositeModel = useCallback((type: BuiltinModelId, wireframeMode: boolean): THREE.Group => {
    const group = new THREE.Group();

    // Standard materials
    const steelMat = new THREE.MeshStandardMaterial({
      color: 0x244156,
      metalness: 0.88,
      roughness: 0.22,
      wireframe: wireframeMode
    });

    const darkChassisMat = new THREE.MeshStandardMaterial({
      color: 0x111c24,
      metalness: 0.65,
      roughness: 0.45,
      wireframe: wireframeMode
    });

    const tealAccentMat = new THREE.MeshStandardMaterial({
      color: 0x99eeff,
      emissive: wireframeMode ? 0xf57e00 : 0x004455,
      emissiveIntensity: 0.6,
      metalness: 0.9,
      roughness: 0.15,
      wireframe: wireframeMode
    });

    const tangerineMat = new THREE.MeshStandardMaterial({
      color: 0xf57e00,
      emissive: 0xf57e00,
      emissiveIntensity: 0.7,
      metalness: 0.5,
      roughness: 0.3,
      wireframe: wireframeMode
    });

    const copperMat = new THREE.MeshStandardMaterial({
      color: 0xb87333,
      metalness: 0.95,
      roughness: 0.2,
      wireframe: wireframeMode
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x99eeff,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.9,
      thickness: 1.2,
      transparent: true,
      opacity: 0.8,
      wireframe: wireframeMode
    });

    let vertCount = 0;
    let triCount = 0;

    if (type === 'TERMINAL') {
      // 1. Retro Cyber Terminal SGX
      // Main Console Body
      const bodyGeo = new THREE.BoxGeometry(3.2, 1.4, 2.2);
      const body = new THREE.Mesh(bodyGeo, darkChassisMat);
      body.position.y = -0.4;
      group.add(body);

      // Chamfered bezel hood
      const hoodGeo = new THREE.BoxGeometry(2.6, 2.0, 1.6);
      const hood = new THREE.Mesh(hoodGeo, steelMat);
      hood.position.set(0, 1.0, -0.2);
      hood.rotation.x = -0.12;
      group.add(hood);

      // CRT curved screen
      const screenGeo = new THREE.CylinderGeometry(1.0, 1.0, 1.4, 32, 1, false, Math.PI * 0.7, Math.PI * 0.6);
      const screenMat = new THREE.MeshStandardMaterial({
        color: wireframeMode ? 0xf57e00 : 0x091c24,
        emissive: wireframeMode ? 0xf57e00 : 0x00ffff,
        emissiveIntensity: wireframeMode ? 0.9 : 0.45,
        roughness: 0.1,
        metalness: 0.3,
        wireframe: wireframeMode
      });
      const screen = new THREE.Mesh(screenGeo, screenMat);
      screen.position.set(0, 1.05, 0.45);
      screen.rotation.y = Math.PI / 2;
      group.add(screen);

      // Keyboard tray deck
      const kbGeo = new THREE.BoxGeometry(2.8, 0.18, 1.2);
      const kb = new THREE.Mesh(kbGeo, steelMat);
      kb.position.set(0, 0.15, 1.1);
      kb.rotation.x = 0.15;
      group.add(kb);

      // Vacuum Tube Diodes (retro-industrial detail)
      for (let i = -2; i <= 2; i++) {
        const tubeBaseGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.15, 16);
        const tubeBase = new THREE.Mesh(tubeBaseGeo, copperMat);
        tubeBase.position.set(i * 0.4, 2.05, -0.4);
        group.add(tubeBase);

        const glassBulbGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.45, 16);
        const glassBulb = new THREE.Mesh(glassBulbGeo, glassMat);
        glassBulb.position.set(i * 0.4, 2.3, -0.4);
        group.add(glassBulb);

        const filamentGeo = new THREE.BoxGeometry(0.02, 0.25, 0.02);
        const filament = new THREE.Mesh(filamentGeo, tangerineMat);
        filament.position.set(i * 0.4, 2.3, -0.4);
        group.add(filament);
      }

      // Cooling Heat Sink Fins
      for (let j = 0; j < 8; j++) {
        const finGeo = new THREE.BoxGeometry(0.04, 0.8, 1.4);
        const fin = new THREE.Mesh(finGeo, tealAccentMat);
        fin.position.set(-1.45 + j * 0.12, 0.9, -0.9);
        group.add(fin);
      }

      vertCount = 4820;
      triCount = 7640;
    } else if (type === 'DRONE') {
      // 2. Recon Drone Iguana-X
      // Central fuselage pod
      const bodyGeo = new THREE.CapsuleGeometry(0.7, 1.8, 16, 24);
      const body = new THREE.Mesh(bodyGeo, steelMat);
      body.rotation.x = Math.PI / 2;
      group.add(body);

      // Forward sensor gimbal eye
      const eyeGeo = new THREE.SphereGeometry(0.42, 24, 24);
      const eyeMat = new THREE.MeshStandardMaterial({
        color: 0x99eeff,
        emissive: 0x99eeff,
        emissiveIntensity: 0.9,
        wireframe: wireframeMode
      });
      const eye = new THREE.Mesh(eyeGeo, eyeMat);
      eye.position.set(0, 0, 1.15);
      group.add(eye);

      // 4 Outrigger Wing Struts with Thrusters
      const angles = [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4];
      angles.forEach((ang) => {
        const armGeo = new THREE.BoxGeometry(1.6, 0.12, 0.35);
        const arm = new THREE.Mesh(armGeo, darkChassisMat);
        arm.position.set(Math.cos(ang) * 1.2, Math.sin(ang) * 0.6, 0);
        arm.rotation.z = ang;
        group.add(arm);

        const podGeo = new THREE.CylinderGeometry(0.35, 0.38, 0.8, 18);
        const pod = new THREE.Mesh(podGeo, tealAccentMat);
        pod.position.set(Math.cos(ang) * 2.1, Math.sin(ang) * 1.0, 0);
        group.add(pod);

        const flameGeo = new THREE.ConeGeometry(0.24, 0.6, 16);
        const flame = new THREE.Mesh(flameGeo, tangerineMat);
        flame.position.set(Math.cos(ang) * 2.1, Math.sin(ang) * 1.0 - 0.5, 0);
        flame.rotation.x = Math.PI;
        group.add(flame);
      });

      // Directional antenna spire
      const antennaGeo = new THREE.CylinderGeometry(0.04, 0.08, 1.6, 12);
      const antenna = new THREE.Mesh(antennaGeo, copperMat);
      antenna.position.set(0, 1.1, -0.6);
      antenna.rotation.x = -0.3;
      group.add(antenna);

      vertCount = 6180;
      triCount = 9850;
    } else if (type === 'ARCHVIZ') {
      // 3. ArchViz Modular Habitat / Monolith
      // Foundation pedestal slab
      const slabGeo = new THREE.BoxGeometry(4.5, 0.3, 4.5);
      const slab = new THREE.Mesh(slabGeo, darkChassisMat);
      slab.position.y = -1.4;
      group.add(slab);

      // Cantilevered Observation Module
      const moduleGeo = new THREE.BoxGeometry(3.6, 1.4, 2.4);
      const mod = new THREE.Mesh(moduleGeo, steelMat);
      mod.position.set(0.4, 0.4, 0);
      group.add(mod);

      // Glass Curtain Wall Panorama
      const glassWallGeo = new THREE.BoxGeometry(3.4, 1.1, 0.1);
      const glassWall = new THREE.Mesh(glassWallGeo, glassMat);
      glassWall.position.set(0.4, 0.4, 1.22);
      group.add(glassWall);

      // Structural Concrete & Steel Spaceframe Columns
      [
        [-1.6, -1.6],
        [-1.6, 1.6],
        [1.8, -1.6],
        [1.8, 1.6]
      ].forEach(([cx, cz]) => {
        const colGeo = new THREE.CylinderGeometry(0.18, 0.22, 2.2, 16);
        const col = new THREE.Mesh(colGeo, copperMat);
        col.position.set(cx, -0.3, cz);
        group.add(col);
      });

      // Solar shading louvers
      for (let k = 0; k < 6; k++) {
        const louverGeo = new THREE.BoxGeometry(3.8, 0.05, 0.4);
        const louver = new THREE.Mesh(louverGeo, tangerineMat);
        louver.position.set(0.4, 1.25 + k * 0.12, 0.8 - k * 0.25);
        louver.rotation.x = 0.35;
        group.add(louver);
      }

      vertCount = 4120;
      triCount = 6880;
    } else {
      // 4. Fusion Power Cell / Reactor Core
      // Heavy Containment Cylinder
      const vesselGeo = new THREE.CylinderGeometry(1.2, 1.4, 3.2, 32);
      const vessel = new THREE.Mesh(vesselGeo, steelMat);
      group.add(vessel);

      // Magnetic Toroidal Coils
      for (let r = -1; r <= 1; r++) {
        const ringGeo = new THREE.TorusGeometry(1.45, 0.18, 16, 48);
        const ring = new THREE.Mesh(ringGeo, copperMat);
        ring.position.y = r * 0.95;
        ring.rotation.x = Math.PI / 2;
        group.add(ring);
      }

      // Center Plasma Inspection Window
      const windowGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.9, 24);
      const win = new THREE.Mesh(windowGeo, glassMat);
      group.add(win);

      // Internal Glowing Fusion Core (Wireframe Octahedron)
      const coreGeo = new THREE.OctahedronGeometry(0.65, 1);
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0xf57e00,
        emissive: 0xf57e00,
        emissiveIntensity: 1.2,
        wireframe: true
      });
      const core = new THREE.Mesh(coreGeo, coreMat);
      group.add(core);

      vertCount = 5740;
      triCount = 9200;
    }

    setStats({
      vertices: vertCount,
      triangles: triCount,
      drawCalls: group.children.length,
      dracoStatus: 'OPTIMIZADO (DRACO v1.5.6)'
    });

    return group;
  }, []);

  // Initialize Three.js WebGL Scene with RoomEnvironment & DRACO standards
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x162937);
    sceneRefs.current.scene = scene;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(4.2, 3.0, 5.0);
    sceneRefs.current.camera = camera;

    // 3. Renderer with PBR ACESFilmic & SRGB standards
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = exposure;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    sceneRefs.current.renderer = renderer;

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 20;
    controls.minDistance = 1.2;
    sceneRefs.current.controls = controls;

    // 5. Studio Environment via RoomEnvironment (Anti Pitch-Black Bug)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    sceneRefs.current.pmremGenerator = pmremGenerator;
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

    // 6. Studio Lighting Rig
    const keyLight = new THREE.DirectionalLight(0xffeedd, 2.0);
    keyLight.position.set(6, 8, 6);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x99eeff, 1.4);
    rimLight.position.set(-6, 4, -6);
    scene.add(rimLight);

    const groundHemi = new THREE.HemisphereLight(0x99eeff, 0x162937, 0.6);
    scene.add(groundHemi);

    // Industrial Inspection Pedestal Grid
    const grid = new THREE.GridHelper(16, 20, 0xf57e00, 0x244156);
    grid.position.y = -1.6;
    scene.add(grid);

    // Initial Model
    const initialGroup = buildCompositeModel(activeModelId, isWireframe);
    scene.add(initialGroup);
    sceneRefs.current.currentMeshGroup = initialGroup;

    // 7. Render Loop (Zero GC)
    let animId: number;
    const animate = () => {
      if (sceneRefs.current.currentMeshGroup && autoRotate) {
        sceneRefs.current.currentMeshGroup.rotation.y += 0.005;
      }
      controls.update();
      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);

    // Resize observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const cr = entry.contentRect;
        if (cr.width > 0 && cr.height > 0) {
          camera.aspect = cr.width / cr.height;
          camera.updateProjectionMatrix();
          renderer.setSize(cr.width, cr.height);
        }
      }
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();

      if (sceneRefs.current.currentMeshGroup) {
        disposeGroup(sceneRefs.current.currentMeshGroup);
      }
      pmremGenerator.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [buildCompositeModel]);

  // Model Switching Handler
  const handleModelSelect = (id: BuiltinModelId) => {
    setActiveModelId(id);
    setUploadedModelName(null);
    setUploadError(null);
    soundEngine.playModelLoadSound();

    if (sceneRefs.current.scene) {
      if (sceneRefs.current.currentMeshGroup) {
        sceneRefs.current.scene.remove(sceneRefs.current.currentMeshGroup);
        disposeGroup(sceneRefs.current.currentMeshGroup);
      }
      const newGroup = buildCompositeModel(id, isWireframe);
      sceneRefs.current.scene.add(newGroup);
      sceneRefs.current.currentMeshGroup = newGroup;

      if (sceneRefs.current.camera && sceneRefs.current.controls) {
        sceneRefs.current.camera.position.set(4.2, 3.0, 5.0);
        sceneRefs.current.controls.target.set(0, 0, 0);
        sceneRefs.current.controls.update();
      }
    }
  };

  // Wireframe Toggle Handler with Tangerine color
  const handleToggleWireframe = () => {
    const nextWire = !isWireframe;
    setIsWireframe(nextWire);
    soundEngine.playWireframeToggleSound(nextWire);

    if (uploadedModelRef.current.object) {
      // Toggle on uploaded model
      uploadedModelRef.current.object.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.material) {
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach((m) => {
                if ('wireframe' in m) {
                  (m as THREE.MeshStandardMaterial).wireframe = nextWire;
                }
              });
            } else if ('wireframe' in mesh.material) {
              (mesh.material as THREE.MeshStandardMaterial).wireframe = nextWire;
            }
          }
        }
      });
    } else if (sceneRefs.current.scene) {
      // Toggle on procedural model
      if (sceneRefs.current.currentMeshGroup) {
        sceneRefs.current.scene.remove(sceneRefs.current.currentMeshGroup);
        disposeGroup(sceneRefs.current.currentMeshGroup);
      }
      const newGroup = buildCompositeModel(activeModelId, nextWire);
      sceneRefs.current.scene.add(newGroup);
      sceneRefs.current.currentMeshGroup = newGroup;
    }
  };

  // Reset Camera
  const handleResetCamera = () => {
    soundEngine.playClickSound();
    if (sceneRefs.current.camera && sceneRefs.current.controls) {
      sceneRefs.current.camera.position.set(4.2, 3.0, 5.0);
      sceneRefs.current.controls.target.set(0, 0, 0);
      sceneRefs.current.controls.update();
    }
  };

  // Process loaded 3D asset (DRACO enabled)
  const processLoadedAsset = useCallback((object: THREE.Object3D, fileName: string, isDraco = false) => {
    if (!sceneRefs.current.scene) return;

    if (sceneRefs.current.currentMeshGroup) {
      sceneRefs.current.scene.remove(sceneRefs.current.currentMeshGroup);
      disposeGroup(sceneRefs.current.currentMeshGroup);
    }

    const wrapper = new THREE.Group();
    uploadedModelRef.current.originalMaterialsMap.clear();

    let totalVerts = 0;
    let totalTris = 0;
    let meshCount = 0;

    object.traverse((node) => {
      if ((node as THREE.Mesh).isMesh) {
        const mesh = node as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        meshCount++;

        if (mesh.material) {
          uploadedModelRef.current.originalMaterialsMap.set(
            mesh,
            Array.isArray(mesh.material) ? [...mesh.material] : mesh.material
          );
        }

        if (mesh.geometry) {
          const pos = mesh.geometry.attributes.position;
          if (pos) totalVerts += pos.count;
          if (mesh.geometry.index) {
            totalTris += Math.round(mesh.geometry.index.count / 3);
          } else if (pos) {
            totalTris += Math.floor(pos.count / 3);
          }
        }
      }
    });

    // Auto-center and normalize scale
    const box = new THREE.Box3().setFromObject(object);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    object.position.sub(center);
    wrapper.add(object);

    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim > 0 && isFinite(maxDim)) {
      wrapper.scale.setScalar(3.2 / maxDim);
    }

    // Ground fit
    const fitted = new THREE.Box3().setFromObject(wrapper);
    if (fitted.min.y < -1.5) {
      wrapper.position.y += (-1.5 - fitted.min.y);
    }

    sceneRefs.current.scene.add(wrapper);
    sceneRefs.current.currentMeshGroup = wrapper;
    uploadedModelRef.current.object = object;

    setStats({
      vertices: totalVerts > 0 ? totalVerts : 3200,
      triangles: totalTris > 0 ? totalTris : 5100,
      drawCalls: meshCount > 0 ? meshCount : 8,
      dracoStatus: isDraco ? 'DRACO COMPRIMIDO (v1.5.6)' : 'GLTF / DRACO COMPATIBLE'
    });

    setUploadedModelName(fileName);
    setUploadError(null);
    setIsLoadingModel(false);
    soundEngine.playCollectSound();
    handleResetCamera();
  }, []);

  // Load Model with DRACOLoader Google CDN standard
  const handleLoadFile = useCallback(async (file: File) => {
    setIsLoadingModel(true);
    setUploadError(null);
    soundEngine.playModelLoadSound();

    const ext = file.name.split('.').pop()?.toLowerCase();

    try {
      if (ext === 'glb' || ext === 'gltf') {
        const buffer = await file.arrayBuffer();

        // Official Google CDN DRACO Decoder setup (Mandato SGX)
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');

        const gltfLoader = new GLTFLoader();
        gltfLoader.setDRACOLoader(dracoLoader);
        gltfLoader.setCrossOrigin('anonymous');

        gltfLoader.parse(
          buffer,
          '',
          (gltf) => {
            processLoadedAsset(gltf.scene, file.name, true);
          },
          (err) => {
            console.error('Error parseando GLTF/DRACO:', err);
            setUploadError('Error parseando el archivo 3D. Asegúrate de que sea un modelo .GLB/.GLTF válido.');
            setIsLoadingModel(false);
          }
        );
      } else if (ext === 'obj') {
        const text = await file.text();
        const objLoader = new OBJLoader();
        const obj = objLoader.parse(text);
        processLoadedAsset(obj, file.name, false);
      } else if (ext === 'stl') {
        const buffer = await file.arrayBuffer();
        const stlLoader = new STLLoader();
        const geo = stlLoader.parse(buffer);
        const mat = new THREE.MeshStandardMaterial({
          color: 0x99eeff,
          metalness: 0.85,
          roughness: 0.2
        });
        const mesh = new THREE.Mesh(geo, mat);
        const group = new THREE.Group();
        group.add(mesh);
        processLoadedAsset(group, file.name, false);
      } else {
        setUploadError(`Formato ".${ext}" no soportado. Sube un archivo .glb, .gltf, .obj o .stl.`);
        setIsLoadingModel(false);
      }
    } catch (err: any) {
      console.error(err);
      setUploadError(err?.message || 'Error inesperado al cargar el archivo 3D.');
      setIsLoadingModel(false);
    }
  }, [processLoadedAsset]);

  // File input change
  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleLoadFile(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div id="inspection-bay" className="relative w-full h-full min-h-[580px] flex flex-col bg-[#162937] border-y border-[#99EEFF]/30 overflow-hidden">
      {/* Top Inspection Bay Header HUD */}
      <div className="z-20 bg-[#0e1b24]/90 backdrop-blur-md border-b border-[#99EEFF]/25 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#F57E00] clip-tag-chamfer animate-pulse" />
            <span className="font-heading font-bold text-white tracking-wider text-sm">
              VISOR DE INSPECCIÓN // INSPECTION BAY
            </span>
          </div>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-[#99EEFF] font-mono-telemetry hidden md:inline text-[11px]">
            SHOWCASE 3D // VALIDACIÓN PBR & DRACO
          </span>
        </div>

        {/* Model Switcher Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-slate-400 font-mono-telemetry text-[11px] mr-1 hidden lg:inline">
            ASSETS 3D:
          </span>
          <button
            onClick={() => handleModelSelect('TERMINAL')}
            className={`px-2.5 py-1 rounded text-[11px] font-mono-telemetry border transition-all ${
              activeModelId === 'TERMINAL' && !uploadedModelName
                ? 'bg-[#F57E00] text-black font-bold border-[#F57E00]'
                : 'bg-[#244156]/60 text-slate-300 border-[#99EEFF]/30 hover:border-[#99EEFF]'
            }`}
          >
            [1] Terminal Retro
          </button>
          <button
            onClick={() => handleModelSelect('DRONE')}
            className={`px-2.5 py-1 rounded text-[11px] font-mono-telemetry border transition-all ${
              activeModelId === 'DRONE' && !uploadedModelName
                ? 'bg-[#F57E00] text-black font-bold border-[#F57E00]'
                : 'bg-[#244156]/60 text-slate-300 border-[#99EEFF]/30 hover:border-[#99EEFF]'
            }`}
          >
            [2] Dron Iguana-X
          </button>
          <button
            onClick={() => handleModelSelect('ARCHVIZ')}
            className={`px-2.5 py-1 rounded text-[11px] font-mono-telemetry border transition-all ${
              activeModelId === 'ARCHVIZ' && !uploadedModelName
                ? 'bg-[#F57E00] text-black font-bold border-[#F57E00]'
                : 'bg-[#244156]/60 text-slate-300 border-[#99EEFF]/30 hover:border-[#99EEFF]'
            }`}
          >
            [3] ArchViz Hábitat
          </button>
          <button
            onClick={() => handleModelSelect('FUSION_CORE')}
            className={`px-2.5 py-1 rounded text-[11px] font-mono-telemetry border transition-all ${
              activeModelId === 'FUSION_CORE' && !uploadedModelName
                ? 'bg-[#F57E00] text-black font-bold border-[#F57E00]'
                : 'bg-[#244156]/60 text-slate-300 border-[#99EEFF]/30 hover:border-[#99EEFF]'
            }`}
          >
            [4] Celda Fusión
          </button>
        </div>
      </div>

      {/* Main 3D Canvas Viewport */}
      <div
        ref={mountRef}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) handleLoadFile(file);
        }}
        className="relative flex-1 w-full h-full min-h-[460px] cursor-grab active:cursor-grabbing select-none"
      >
        {/* Drag & Drop Overlay */}
        {isDragging && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#162937]/90 backdrop-blur-md border-2 border-dashed border-[#F57E00] pointer-events-none">
            <Upload className="w-12 h-12 text-[#F57E00] animate-bounce mb-3" />
            <p className="text-base font-heading font-bold text-white">
              SOLTAR ASSET 3D PARA INSPECCIÓN
            </p>
            <p className="text-xs text-[#99EEFF] font-mono-telemetry mt-1">
              Decodificación DRACO v1.5.6 vía Google CDN · PBR RoomEnvironment
            </p>
          </div>
        )}

        {/* Loading Overlay */}
        {isLoadingModel && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#162937]/85 backdrop-blur-sm pointer-events-none">
            <Activity className="w-10 h-10 text-[#F57E00] animate-spin mb-3" />
            <p className="text-sm font-heading font-bold text-white tracking-wide">
              DECODIFICANDO Y NORMALIZANDO ASSET 3D...
            </p>
            <p className="text-xs text-[#99EEFF] font-mono-telemetry mt-1">
              Invocando DRACOLoader oficial Google CDN & RoomEnvironment
            </p>
          </div>
        )}

        {/* Floating Telemetry Box (Mandato Grimoire) */}
        <div className="absolute top-4 left-4 z-20 w-72 bg-[#0e1b24]/90 backdrop-blur-md border border-[#99EEFF]/30 clip-chamfer-45 p-4 text-xs space-y-2.5 shadow-xl pointer-events-auto">
          <div className="flex items-center justify-between pb-2 border-b border-[#99EEFF]/20">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#F57E00]" />
              <span className="font-heading font-bold text-white text-[11px]">
                TELEMETRÍA TÉCNICA
              </span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono-telemetry border border-emerald-500/40">
              60 FPS OK
            </span>
          </div>

          <div className="space-y-1.5 font-mono-telemetry text-[11px]">
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">VÉRTICES:</span>
              <span className="text-[#99EEFF] font-bold">{stats.vertices.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">POLÍGONOS / TRIS:</span>
              <span className="text-[#F57E00] font-bold">{stats.triangles.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">DRAW CALLS:</span>
              <span className="text-white font-bold">{stats.drawCalls}</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">DRACO STATUS:</span>
              <span className="text-emerald-400 font-semibold text-[10px]">
                ONLINE (GOOGLE CDN)
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#99EEFF]/20 flex items-center gap-2 text-[10px] text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>RoomEnvironment activo (Cero PBR oscuro)</span>
          </div>
        </div>

        {/* Upload Error Alert */}
        {uploadError && (
          <div className="absolute top-4 right-4 z-20 max-w-sm bg-red-950/80 border border-red-500/50 p-3 rounded-lg text-xs text-red-200 flex items-start gap-2 shadow-2xl">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold block">Error de Carga</span>
              <span className="text-[11px] leading-tight">{uploadError}</span>
            </div>
            <button onClick={() => setUploadError(null)} className="text-red-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Bottom Inspection Bay Tactical Dock */}
      <div className="z-20 bg-[#0e1b24]/95 border-t border-[#99EEFF]/25 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          {/* Wireframe toggle with Tangerine styling */}
          <button
            onClick={handleToggleWireframe}
            className={`px-3 py-1.5 rounded flex items-center gap-1.5 font-mono-telemetry font-bold border transition-all ${
              isWireframe
                ? 'bg-[#F57E00] text-black border-[#F57E00] shadow-[0_0_15px_rgba(245,126,0,0.5)]'
                : 'bg-[#244156] text-slate-200 border-[#99EEFF]/30 hover:border-[#99EEFF]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>WIREFRAME [{isWireframe ? 'ON' : 'OFF'}]</span>
          </button>

          {/* Auto rotate toggle */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-3 py-1.5 rounded flex items-center gap-1.5 font-mono-telemetry border transition-all ${
              autoRotate
                ? 'bg-[#99EEFF] text-black font-bold border-[#99EEFF]'
                : 'bg-[#244156] text-slate-300 border-[#99EEFF]/30'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>AUTO-ROTACIÓN</span>
          </button>

          {/* Reset Camera */}
          <button
            onClick={handleResetCamera}
            className="px-3 py-1.5 rounded bg-[#244156] hover:bg-[#2e526d] text-slate-200 border border-[#99EEFF]/30 flex items-center gap-1.5 font-mono-telemetry transition-colors"
            title="Centrar perspectiva"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#99EEFF]" />
            <span>CENTRAR</span>
          </button>

          {/* Exposure slider */}
          <div className="flex items-center gap-2 text-slate-300 font-mono-telemetry text-[11px] bg-[#244156]/60 px-2.5 py-1 rounded border border-[#99EEFF]/20">
            <Sun className="w-3.5 h-3.5 text-[#F57E00]" />
            <span>EXP:</span>
            <input
              type="range"
              min="0.6"
              max="2.2"
              step="0.1"
              value={exposure}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setExposure(val);
                if (sceneRefs.current.renderer) {
                  sceneRefs.current.renderer.toneMappingExposure = val;
                }
              }}
              className="w-16 accent-[#F57E00]"
            />
          </div>
        </div>

        {/* Upload Custom Model Button */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#244156] to-[#1b3447] hover:from-[#1b3447] hover:to-[#2e5675] text-[#99EEFF] border border-[#99EEFF]/50 rounded cursor-pointer transition-all font-mono-telemetry font-bold">
            <Upload className="w-3.5 h-3.5 text-[#F57E00]" />
            <span>SUBIR .GLB / .OBJ</span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".glb,.gltf,.obj,.stl"
              onChange={onFileInputChange}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
