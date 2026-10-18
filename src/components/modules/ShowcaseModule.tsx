/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * MÓDULO SGX.Showcase: Los Arquitectos Virtuales (The Pedestal)
 * Grimorio Cap II: PBR RoomEnvironment, Mitigación CORS Blob URLs, Limpieza de Memoria (.dispose)
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import {
  Box,
  Sparkles,
  Upload,
  RotateCw,
  Layers,
  ShieldCheck,
  Sun,
  Eye,
  RefreshCw,
  Cpu,
  Loader2,
  X,
  AlertCircle,
  Palette
} from 'lucide-react';
import { soundEngine } from '../../services/sound-effects';

interface ShowcaseModuleProps {
  onOpenRemix: () => void;
  isMuted: boolean;
}

type MaterialPreset = 'GOLD' | 'BLUE' | 'DAMASCUS' | 'COPPER' | 'CRYSTAL';
type GeometryPreset = 'PAVILION' | 'TORUS' | 'HYPERCUBE' | 'MONOLITH';

export const ShowcaseModule: React.FC<ShowcaseModuleProps> = ({ onOpenRemix }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [activeMaterial, setActiveMaterial] = useState<MaterialPreset>('GOLD');
  const [activeGeometry, setActiveGeometry] = useState<GeometryPreset>('PAVILION');
  const [isWireframe, setIsWireframe] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [exposure, setExposure] = useState<number>(1.2);
  const [uploadedModelName, setUploadedModelName] = useState<string | null>(null);
  const [stats, setStats] = useState({ vertices: 3420, triangles: 5880 });
  const [isLoadingModel, setIsLoadingModel] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [keepOriginalMaterials, setKeepOriginalMaterials] = useState<boolean>(true);

  const uploadedModelRef = useRef<{
    object: THREE.Object3D | null;
    originalMaterialsMap: Map<THREE.Mesh, THREE.Material | THREE.Material[]>;
  }>({
    object: null,
    originalMaterialsMap: new Map()
  });

  const sceneState = useRef<{
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    renderer: THREE.WebGLRenderer | null;
    controls: OrbitControls | null;
    currentMeshGroup: THREE.Group | null;
    activeMaterialInstance: THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial | null;
    damascusTexture: THREE.Texture | null;
  }>({
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    currentMeshGroup: null,
    activeMaterialInstance: null,
    damascusTexture: null
  });

  // Purge memory deep dispose (Grimorio Cap 2.4)
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

  // Build Geometry Generator
  const buildGeometryObject = useCallback((type: GeometryPreset, material: THREE.Material): THREE.Group => {
    const group = new THREE.Group();

    if (type === 'PAVILION') {
      // Architectural Monolithic Pavilion (Pabellón Virtual SGX)
      // Base slab
      const slabGeo = new THREE.BoxGeometry(4, 0.25, 4);
      const slab = new THREE.Mesh(slabGeo, material);
      slab.position.y = -1.2;
      group.add(slab);

      // 4 cyber architectural pillars
      const pillarGeo = new THREE.CylinderGeometry(0.18, 0.25, 2.4, 16);
      [
        [-1.6, -1.6],
        [1.6, -1.6],
        [-1.6, 1.6],
        [1.6, 1.6]
      ].forEach(([px, pz]) => {
        const pillar = new THREE.Mesh(pillarGeo, material);
        pillar.position.set(px, 0, pz);
        group.add(pillar);
      });

      // Canopy roof
      const roofGeo = new THREE.ConeGeometry(2.8, 1.2, 4);
      const roof = new THREE.Mesh(roofGeo, material);
      roof.rotation.y = Math.PI / 4;
      roof.position.y = 1.6;
      group.add(roof);

      // Central hovering core
      const coreGeo = new THREE.OctahedronGeometry(0.7, 0);
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        wireframe: true
      });
      const core = new THREE.Mesh(coreGeo, coreMat);
      core.position.y = 0.1;
      group.add(core);

      setStats({ vertices: 2840, triangles: 4320 });
    } else if (type === 'TORUS') {
      const geo = new THREE.TorusKnotGeometry(1.3, 0.38, 128, 32);
      const mesh = new THREE.Mesh(geo, material);
      group.add(mesh);
      setStats({ vertices: 4096, triangles: 8192 });
    } else if (type === 'HYPERCUBE') {
      // Quantum Hypercube nested wireframes
      const outerGeo = new THREE.BoxGeometry(2.4, 2.4, 2.4);
      const outer = new THREE.Mesh(outerGeo, material);
      group.add(outer);

      const innerGeo = new THREE.OctahedronGeometry(1.1, 1);
      const innerMat = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.5,
        wireframe: true
      });
      const inner = new THREE.Mesh(innerGeo, innerMat);
      group.add(inner);
      setStats({ vertices: 1960, triangles: 3200 });
    } else {
      // Monolith Stele
      const geo = new THREE.BoxGeometry(1.2, 3.6, 0.4);
      const mesh = new THREE.Mesh(geo, material);
      group.add(mesh);

      const ringGeo = new THREE.TorusGeometry(1.8, 0.05, 16, 64);
      const ringMat = new THREE.MeshStandardMaterial({ color: 0xfdcc0d, emissive: 0xfdcc0d, emissiveIntensity: 0.4 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2.5;
      group.add(ring);
      setStats({ vertices: 1540, triangles: 2680 });
    }

    return group;
  }, []);

  // Update or swap material
  const applyMaterialPreset = useCallback((preset: MaterialPreset, wire: boolean) => {
    setActiveMaterial(preset);
    soundEngine.playClickSound();

    let mat: THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial;

    if (preset === 'GOLD') {
      mat = new THREE.MeshStandardMaterial({
        color: 0xfdcc0d,
        metalness: 0.95,
        roughness: 0.14,
        wireframe: wire
      });
    } else if (preset === 'BLUE') {
      mat = new THREE.MeshStandardMaterial({
        color: 0x32527b,
        metalness: 0.9,
        roughness: 0.22,
        wireframe: wire
      });
    } else if (preset === 'DAMASCUS') {
      mat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        map: sceneState.current.damascusTexture,
        metalness: 0.85,
        roughness: 0.25,
        wireframe: wire
      });
    } else if (preset === 'COPPER') {
      mat = new THREE.MeshStandardMaterial({
        color: 0xb87333,
        metalness: 0.82,
        roughness: 0.28,
        wireframe: wire
      });
    } else {
      // Holographic Crystal PBR
      mat = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        metalness: 0.1,
        roughness: 0.05,
        transmission: 0.9,
        thickness: 1.2,
        transparent: true,
        opacity: 0.85,
        wireframe: wire
      });
    }

    sceneState.current.activeMaterialInstance = mat;

    // Apply to current active meshes in group
    if (sceneState.current.currentMeshGroup) {
      sceneState.current.currentMeshGroup.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          // Keep inner wireframe cores cyan
          if (mesh.geometry.type !== 'OctahedronGeometry') {
            mesh.material = mat;
          }
        }
      });
    }
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);
    sceneState.current.scene = scene;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || (window.innerHeight - 110);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(4.5, 3.2, 5.5);
    sceneState.current.camera = camera;

    // 2. High performance WebGL Renderer with ACES Filmic Tone Mapping
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = exposure;
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);
    sceneState.current.renderer = renderer;

    // 3. Smooth OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 25;
    controls.minDistance = 1.5;
    sceneState.current.controls = controls;

    // ResizeObserver for reliable dimension tracking
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

    // 4. RoomEnvironment (Grimorio Cap 2.3: Anti-Dark Model Bug)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

    // 5. Studio Key & Rim Lights
    const dirLight = new THREE.DirectionalLight(0xfff7e6, 1.8);
    dirLight.position.set(6, 10, 6);
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(0x00ffff, 1.2);
    rimLight.position.set(-6, 5, -6);
    scene.add(rimLight);

    // Subtle Ground Shadow Grid
    const grid = new THREE.GridHelper(24, 24, 0xfdcc0d, 0x32527b);
    grid.position.y = -1.8;
    scene.add(grid);

    // 6. Preload Damascus texture with anonymous CORS (Grimorio Cap 2.1)
    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin('anonymous');
    textureLoader.load(
      '/src/assets/images/sgx_texture_damascus_1791517792930.jpg',
      (tex) => {
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(2, 2);
        sceneState.current.damascusTexture = tex;
      },
      undefined,
      () => {
        // Safe texture fallback
      }
    );

    // 7. Initial Mesh
    const initialMat = new THREE.MeshStandardMaterial({
      color: 0xfdcc0d,
      metalness: 0.95,
      roughness: 0.14,
      wireframe: false
    });
    sceneState.current.activeMaterialInstance = initialMat;
    const meshGroup = buildGeometryObject('PAVILION', initialMat);
    scene.add(meshGroup);
    sceneState.current.currentMeshGroup = meshGroup;

    // 8. Animation Loop
    let animId: number;
    const animate = () => {
      if (sceneState.current.currentMeshGroup && autoRotate) {
        sceneState.current.currentMeshGroup.rotation.y += 0.006;
      }
      controls.update();
      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      if (sceneState.current.currentMeshGroup) {
        disposeGroup(sceneState.current.currentMeshGroup);
      }
      pmremGenerator.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [buildGeometryObject, exposure]);

  // Switch Geometry Preset
  const handleGeometryChange = (type: GeometryPreset) => {
    setActiveGeometry(type);
    setUploadedModelName(null);
    setUploadError(null);
    uploadedModelRef.current.object = null;
    uploadedModelRef.current.originalMaterialsMap.clear();
    soundEngine.playClickSound();

    if (sceneState.current.scene && sceneState.current.activeMaterialInstance) {
      if (sceneState.current.currentMeshGroup) {
        sceneState.current.scene.remove(sceneState.current.currentMeshGroup);
        disposeGroup(sceneState.current.currentMeshGroup);
      }

      const newGroup = buildGeometryObject(type, sceneState.current.activeMaterialInstance);
      sceneState.current.scene.add(newGroup);
      sceneState.current.currentMeshGroup = newGroup;

      if (sceneState.current.camera && sceneState.current.controls) {
        sceneState.current.camera.position.set(4.5, 3.2, 5.5);
        sceneState.current.controls.target.set(0, 0, 0);
        sceneState.current.controls.update();
      }
    }
  };

  // Toggle Wireframe
  const handleToggleWireframe = () => {
    const next = !isWireframe;
    setIsWireframe(next);
    applyMaterialPreset(activeMaterial, next);
  };

  // Reset Camera View
  const handleResetCamera = () => {
    soundEngine.playClickSound();
    if (sceneState.current.camera && sceneState.current.controls) {
      sceneState.current.camera.position.set(4.5, 3.2, 5.5);
      sceneState.current.controls.target.set(0, 0, 0);
      sceneState.current.controls.update();
    }
  };

  // Parse and display real loaded 3D model with auto-centering and normalization
  const processAndDisplayLoadedModel = useCallback((loadedObject: THREE.Object3D, fileName: string) => {
    if (!sceneState.current.scene) return;

    // Purge previous mesh
    if (sceneState.current.currentMeshGroup) {
      sceneState.current.scene.remove(sceneState.current.currentMeshGroup);
      disposeGroup(sceneState.current.currentMeshGroup);
    }

    const wrapperGroup = new THREE.Group();
    uploadedModelRef.current.originalMaterialsMap.clear();

    let totalVerts = 0;
    let totalTris = 0;

    // Inspect all meshes, preserve materials & calculate stats
    loadedObject.traverse((node) => {
      if ((node as THREE.Mesh).isMesh) {
        const mesh = node as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (mesh.material) {
          uploadedModelRef.current.originalMaterialsMap.set(
            mesh,
            Array.isArray(mesh.material) ? [...mesh.material] : mesh.material
          );
        } else if (sceneState.current.activeMaterialInstance) {
          mesh.material = sceneState.current.activeMaterialInstance;
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

    // Auto-center pivot and normalize scale so model is instantly visible and centered
    const box = new THREE.Box3().setFromObject(loadedObject);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    // Center geometry to origin
    loadedObject.position.sub(center);
    wrapperGroup.add(loadedObject);

    // Normalize scale to around 3.2 units max dimension
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim > 0 && isFinite(maxDim)) {
      const scale = 3.2 / maxDim;
      wrapperGroup.scale.setScalar(scale);
    }

    // Adjust Y ground position so model sits nicely on pedestal grid
    const fittedBox = new THREE.Box3().setFromObject(wrapperGroup);
    if (fittedBox.min.y < -1.7) {
      wrapperGroup.position.y += (-1.7 - fittedBox.min.y);
    }

    sceneState.current.scene.add(wrapperGroup);
    sceneState.current.currentMeshGroup = wrapperGroup;
    uploadedModelRef.current.object = loadedObject;

    setStats({
      vertices: totalVerts > 0 ? totalVerts : 1000,
      triangles: totalTris > 0 ? totalTris : 1500
    });
    setUploadedModelName(fileName);
    setUploadError(null);
    setIsLoadingModel(false);
    soundEngine.playCollectSound();

    // Smoothly focus camera
    if (sceneState.current.camera && sceneState.current.controls) {
      sceneState.current.camera.position.set(4.5, 3.2, 5.5);
      sceneState.current.controls.target.set(0, 0, 0);
      sceneState.current.controls.update();
    }
  }, []);

  // Load model file from File object (supports .glb, .gltf, .obj, .stl)
  const loadModelFile = useCallback(async (file: File) => {
    setIsLoadingModel(true);
    setUploadError(null);
    soundEngine.playPillarSwitchSound();

    const ext = file.name.split('.').pop()?.toLowerCase();

    try {
      if (ext === 'glb' || ext === 'gltf') {
        const buffer = await file.arrayBuffer();
        const loader = new GLTFLoader();
        loader.parse(
          buffer,
          '',
          (gltf) => {
            processAndDisplayLoadedModel(gltf.scene, file.name);
          },
          (err) => {
            console.error('Error parseando GLTF/GLB:', err);
            setUploadError('No se pudo parsear el modelo GLTF/GLB. Asegúrate de que sea un archivo 3D válido.');
            setIsLoadingModel(false);
          }
        );
      } else if (ext === 'obj') {
        const text = await file.text();
        const loader = new OBJLoader();
        const obj = loader.parse(text);
        processAndDisplayLoadedModel(obj, file.name);
      } else if (ext === 'stl') {
        const buffer = await file.arrayBuffer();
        const loader = new STLLoader();
        const geometry = loader.parse(buffer);
        const mat = sceneState.current.activeMaterialInstance || new THREE.MeshStandardMaterial({
          color: 0xfdcc0d,
          metalness: 0.9,
          roughness: 0.2
        });
        const mesh = new THREE.Mesh(geometry, mat);
        const group = new THREE.Group();
        group.add(mesh);
        processAndDisplayLoadedModel(group, file.name);
      } else {
        setUploadError(`Formato ".${ext}" no soportado. Sube un archivo .glb, .gltf, .obj o .stl.`);
        setIsLoadingModel(false);
      }
    } catch (err: any) {
      console.error('Error cargando modelo 3D:', err);
      setUploadError(err?.message || 'Error inesperado al leer el archivo 3D.');
      setIsLoadingModel(false);
    }
  }, [processAndDisplayLoadedModel]);

  // Local File Upload with input event
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      loadModelFile(file);
    }
    // Reset file input value so re-uploading the same file works reliably
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Restore original materials if embedded in model
  const handleRestoreOriginalMaterials = () => {
    if (!uploadedModelRef.current.object) return;
    soundEngine.playClickSound();
    uploadedModelRef.current.originalMaterialsMap.forEach((origMat, mesh) => {
      mesh.material = origMat;
    });
    setKeepOriginalMaterials(true);
  };

  // Clear uploaded model and return to standard SGX geometry
  const handleClearUploadedModel = () => {
    soundEngine.playClickSound();
    handleGeometryChange(activeGeometry);
  };

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-[#050505]">
      {/* Top HUD Telemetry */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-4 pointer-events-none">
        <div className="flex items-center gap-4 bg-[#0a0f18]/85 backdrop-blur-md border border-[#32527B]/40 px-4 py-2 rounded-lg pointer-events-auto">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${uploadedModelName ? 'bg-emerald-400 animate-pulse' : 'bg-[#32527B]'}`} />
            <span className="text-xs font-semibold text-slate-300 font-heading">
              {uploadedModelName ? 'MODELO 3D LOCAL' : 'SHOWCASE.PEDESTAL'}
            </span>
            {uploadedModelName && (
              <span className="text-[10px] text-emerald-400 font-mono-telemetry bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/40 truncate max-w-[140px]">
                {uploadedModelName}
              </span>
            )}
          </div>
          <span className="text-slate-600">|</span>
          <div className="text-xs text-slate-400 font-mono-telemetry">
            <span>VERTICES: </span>
            <span className="text-[#00FFFF] font-bold">{stats.vertices.toLocaleString()}</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="text-xs text-slate-400 font-mono-telemetry">
            <span>TRIÁNGULOS: </span>
            <span className="text-[#FDCC0D] font-bold">{stats.triangles.toLocaleString()}</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="text-xs text-emerald-400 font-mono-telemetry flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>PBR ROOM ENVIRONMENT ACTIVO</span>
          </div>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={handleResetCamera}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#111a29]/90 hover:bg-[#1a283e] text-slate-200 border border-[#32527B]/50 rounded-md transition-colors"
            title="Centrar cámara"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#FDCC0D]" />
            <span>Centrar</span>
          </button>
          <button
            onClick={onOpenRemix}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#FDCC0D] hover:bg-[#e5b800] text-black font-semibold rounded-md shadow-md transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Remix en AI Studio</span>
          </button>
        </div>
      </div>

      {/* Main 3D Viewport with Drag & Drop */}
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
          if (file) {
            loadModelFile(file);
          }
        }}
        className="relative flex-1 w-full h-full min-h-[420px] cursor-grab active:cursor-grabbing select-none"
      >
        {/* Drag & Drop Overlay */}
        {isDragging && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#050505]/85 backdrop-blur-md border-2 border-dashed border-[#00FFFF] pointer-events-none transition-all">
            <Upload className="w-12 h-12 text-[#00FFFF] animate-bounce mb-3" />
            <p className="text-base font-bold text-white font-heading">
              SUELTA TU ARCHIVO 3D AQUÍ
            </p>
            <p className="text-xs text-[#00FFFF] font-mono-telemetry mt-1">
              .GLB · .GLTF · .OBJ · .STL (Autocentrado, escala y PBR)
            </p>
          </div>
        )}

        {/* Loading Overlay */}
        {isLoadingModel && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#050505]/80 backdrop-blur-sm pointer-events-none">
            <Loader2 className="w-10 h-10 text-[#FDCC0D] animate-spin mb-3" />
            <p className="text-sm font-bold text-white font-heading tracking-wide">
              PARSEANDO Y CENTRANDO MODELO 3D...
            </p>
            <p className="text-xs text-slate-400 font-mono-telemetry mt-1">
              Leyendo buffers, calculando bounding box y geometría
            </p>
          </div>
        )}
      </div>

      {/* Right Lateral Material Forge Toolbar (Grimorio Cap 2.1) */}
      <div className="absolute top-20 right-4 z-20 w-64 bg-[#0a0f18]/90 backdrop-blur-md border border-[#32527B]/40 p-3.5 rounded-lg text-xs space-y-3 pointer-events-auto shadow-2xl">
        <div className="flex items-center justify-between pb-2 border-b border-[#32527B]/30">
          <div className="flex items-center gap-2 text-slate-200 font-bold font-heading">
            <Cpu className="w-4 h-4 text-[#FDCC0D]" />
            <span>Forja de Texturas SGX</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono-telemetry">PBR V2</span>
        </div>

        {/* Upload Error Banner */}
        {uploadError && (
          <div className="p-2.5 bg-red-950/70 border border-red-500/40 rounded-lg text-[11px] text-red-200 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold block">Error al cargar modelo</span>
              <span className="text-[10px] text-red-300 leading-tight">{uploadError}</span>
            </div>
            <button
              onClick={() => setUploadError(null)}
              className="text-red-400 hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Active Uploaded Model Card */}
        {uploadedModelName && (
          <div className="p-2.5 bg-[#0d1624] border border-[#00FFFF]/40 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 min-w-0">
                <Box className="w-3.5 h-3.5 text-[#00FFFF] shrink-0" />
                <span className="text-[11px] font-bold text-white font-mono-telemetry truncate" title={uploadedModelName}>
                  {uploadedModelName}
                </span>
              </div>
              <button
                onClick={handleClearUploadedModel}
                className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                title="Quitar modelo cargado y volver al Pabellón"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-1.5 pt-1 border-t border-[#32527B]/30">
              <button
                onClick={handleRestoreOriginalMaterials}
                className="flex-1 px-2 py-1 bg-white/10 hover:bg-white/15 text-[10px] text-slate-200 rounded flex items-center justify-center gap-1 transition-colors"
                title="Restaurar materiales originales del archivo GLTF/GLB"
              >
                <Palette className="w-3 h-3 text-[#FDCC0D]" />
                <span>Texturas Originales</span>
              </button>
            </div>
          </div>
        )}

        {/* Material Presets */}
        <div>
          <span className="text-[11px] text-slate-400 block mb-1.5">Acabado Superficial:</span>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => applyMaterialPreset('GOLD', isWireframe)}
              className={`px-2.5 py-1.5 rounded flex items-center gap-2 border text-left transition-all ${
                activeMaterial === 'GOLD'
                  ? 'bg-[#FDCC0D]/20 border-[#FDCC0D] text-[#FDCC0D] font-bold'
                  : 'bg-white/5 border-transparent text-slate-300 hover:bg-white/10'
              }`}
            >
              <span className="w-3 h-3 rounded-full bg-[#FDCC0D] shadow-sm" />
              <span>Oro Cyber</span>
            </button>
            <button
              onClick={() => applyMaterialPreset('BLUE', isWireframe)}
              className={`px-2.5 py-1.5 rounded flex items-center gap-2 border text-left transition-all ${
                activeMaterial === 'BLUE'
                  ? 'bg-[#32527B]/30 border-[#4A7AB7] text-[#00FFFF] font-bold'
                  : 'bg-white/5 border-transparent text-slate-300 hover:bg-white/10'
              }`}
            >
              <span className="w-3 h-3 rounded-full bg-[#32527B]" />
              <span>Azul SGX</span>
            </button>
            <button
              onClick={() => applyMaterialPreset('DAMASCUS', isWireframe)}
              className={`px-2.5 py-1.5 rounded flex items-center gap-2 border text-left transition-all ${
                activeMaterial === 'DAMASCUS'
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                  : 'bg-white/5 border-transparent text-slate-300 hover:bg-white/10'
              }`}
            >
              <span className="w-3 h-3 rounded-full bg-slate-600 border border-amber-300" />
              <span>Acero Damasco</span>
            </button>
            <button
              onClick={() => applyMaterialPreset('COPPER', isWireframe)}
              className={`px-2.5 py-1.5 rounded flex items-center gap-2 border text-left transition-all ${
                activeMaterial === 'COPPER'
                  ? 'bg-[#B87333]/25 border-[#B87333] text-[#f2a764] font-bold'
                  : 'bg-white/5 border-transparent text-slate-300 hover:bg-white/10'
              }`}
            >
              <span className="w-3 h-3 rounded-full bg-[#B87333]" />
              <span>Cobre</span>
            </button>
            <button
              onClick={() => applyMaterialPreset('CRYSTAL', isWireframe)}
              className={`col-span-2 px-2.5 py-1.5 rounded flex items-center gap-2 border text-left transition-all ${
                activeMaterial === 'CRYSTAL'
                  ? 'bg-[#00FFFF]/20 border-[#00FFFF] text-[#00FFFF] font-bold'
                  : 'bg-white/5 border-transparent text-slate-300 hover:bg-white/10'
              }`}
            >
              <span className="w-3 h-3 rounded-full bg-[#00FFFF] opacity-75" />
              <span>Cristal Holográfico Dielectrico</span>
            </button>
          </div>
        </div>

        {/* Geometry Switcher */}
        <div>
          <span className="text-[11px] text-slate-400 block mb-1.5">Geometría Arquitectónica:</span>
          <div className="grid grid-cols-2 gap-1.5 text-[11px]">
            <button
              onClick={() => handleGeometryChange('PAVILION')}
              className={`px-2 py-1 rounded transition-colors ${
                activeGeometry === 'PAVILION' && !uploadedModelName ? 'bg-[#32527B] text-white font-bold' : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              Pabellón SGX
            </button>
            <button
              onClick={() => handleGeometryChange('TORUS')}
              className={`px-2 py-1 rounded transition-colors ${
                activeGeometry === 'TORUS' && !uploadedModelName ? 'bg-[#32527B] text-white font-bold' : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              Nudo Cuántico
            </button>
            <button
              onClick={() => handleGeometryChange('HYPERCUBE')}
              className={`px-2 py-1 rounded transition-colors ${
                activeGeometry === 'HYPERCUBE' && !uploadedModelName ? 'bg-[#32527B] text-white font-bold' : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              Hipercubo
            </button>
            <button
              onClick={() => handleGeometryChange('MONOLITH')}
              className={`px-2 py-1 rounded transition-colors ${
                activeGeometry === 'MONOLITH' && !uploadedModelName ? 'bg-[#32527B] text-white font-bold' : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              Monolito
            </button>
          </div>
        </div>

        {/* Local 3D Model Upload (.GLB, .GLTF, .OBJ, .STL) */}
        <div className="pt-2 border-t border-[#32527B]/30">
          <label className={`flex items-center justify-center gap-2 w-full px-3 py-2 bg-gradient-to-r from-[#162032] to-[#1e2d46] hover:from-[#1e2d46] hover:to-[#273b5c] text-slate-200 border border-[#00FFFF]/40 rounded cursor-pointer transition-all ${
            isLoadingModel ? 'opacity-50 pointer-events-none' : ''
          }`}>
            {isLoadingModel ? (
              <Loader2 className="w-3.5 h-3.5 text-[#FDCC0D] animate-spin" />
            ) : (
              <Upload className="w-3.5 h-3.5 text-[#00FFFF]" />
            )}
            <span className="font-semibold text-[11px]">
              {isLoadingModel ? 'Cargando Modelo...' : 'Subir Modelo .GLB / .OBJ / .STL'}
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".glb,.gltf,.obj,.stl"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          <span className="text-[10px] text-slate-400 mt-1.5 block leading-normal">
            Arrastra tu archivo 3D al visor o selecciónalo. Autocentrada y normalización de escala inmediata.
          </span>
        </div>
      </div>

      {/* Bottom Bar Controls */}
      <div className="z-10 bg-[#0a0f18] border-t border-[#32527B]/30 px-6 py-3 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-5">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors ${
              autoRotate ? 'bg-[#FDCC0D] text-black font-semibold' : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Auto-Rotación</span>
          </button>

          <button
            onClick={handleToggleWireframe}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors ${
              isWireframe ? 'bg-[#00FFFF] text-black font-semibold' : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Malla Wireframe</span>
          </button>

          <div className="flex items-center gap-2">
            <Sun className="w-3.5 h-3.5 text-[#FDCC0D]" />
            <span className="text-slate-400">Exposición:</span>
            <input
              type="range"
              min="0.5"
              max="2.5"
              step="0.1"
              value={exposure}
              onChange={(e) => setExposure(parseFloat(e.target.value))}
              className="w-20 accent-[#FDCC0D]"
            />
          </div>
        </div>

        <div className="text-slate-400 text-[11px]">
          Módulo: <span className="font-mono-telemetry text-slate-200">modules/showcase-module.js</span>
        </div>
      </div>
    </div>
  );
};
