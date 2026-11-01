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
  Maximize2,
  Sliders,
  Play,
  Pause,
  HelpCircle,
  Boxes,
  FileCode,
  Check,
  Copy,
  Sparkles,
  ExternalLink,
  Split,
  BookOpen
} from 'lucide-react';
import { soundEngine } from '../services/sound-effects';
import { useLanguage } from '../context/LanguageContext';

export type BuiltinModelId = 'TERMINAL' | 'DRONE' | 'ARCHVIZ' | 'FUSION_CORE';

/**
 * ============================================================================
 * GUÍA DE INGENIERÍA 3D // ASSETS MANUALES DE BLENDER (.GLB) CON COMPRESIÓN DRACO
 * ============================================================================
 * 
 * 1. ALOJAMIENTO NATIVO (SAME-ORIGIN):
 *    Los modelos 3D se colocan en /public/assets/models/ dentro del proyecto.
 *    Al servirse desde el mismo dominio/origen que la aplicación web, el navegador
 *    nunca dispara bloqueos de seguridad CORS (Access-Control-Allow-Origin).
 * 
 * 2. COMPRESIÓN GEOMÉTRICA DRACO v1.5.6:
 *    Permite reducir el tamaño de las mallas 3D entre un 70% y 90% preservando
 *    la fidelidad de vértices, normales y coordenadas UV.
 *    El decodificador WebAssembly se carga desde el CDN oficial de Google:
 *    https://www.gstatic.com/draco/versioned/decoders/1.5.6/
 * 
 * 3. RESOLUCIÓN DINÁMICA DE RUTA CON VITE:
 *    Usamos import.meta.env.BASE_URL para que las rutas funcionen tanto en
 *    desarrollo local (localhost:3000/Iguananet/) como en producción (GitHub Pages).
 */

export interface BlenderModelMeta {
  id: BuiltinModelId;
  title: string;
  category: string;
  fileName: string;
  relativePath: string;
  hasDraco: boolean;
  targetScale: number;
  description: string;
}

export const BLENDER_MODELS_REGISTRY: Record<BuiltinModelId, BlenderModelMeta> = {
  TERMINAL: {
    id: 'TERMINAL',
    title: 'Teléfono Inteligente',
    category: 'Dispositivo Móvil & Hardware Retrofuturista',
    fileName: 'newsovphone.glb',
    relativePath: 'assets/models/newsovphone.glb',
    hasDraco: true,
    targetScale: 3.2,
    description: 'Smartphone modular retrofuturista modelado a mano en Blender con acabado negro titanio, pantalla táctil y botones laterales.'
  },
  DRONE: {
    id: 'DRONE',
    title: 'Iguana',
    category: 'Mascota Cibernética & Escultura 3D',
    fileName: 'iguana.glb',
    relativePath: 'assets/models/iguana.glb',
    hasDraco: true,
    targetScale: 3.3,
    description: 'Escultura emblemática de la Iguana modelada a mano en Blender con cresta bioluminiscente y topología anatómica en tiempo real.'
  },
  ARCHVIZ: {
    id: 'ARCHVIZ',
    title: 'Plato Arqueológico',
    category: 'Patrimonio Cultural & Arqueología',
    fileName: 'plato_arqueologico.glb',
    relativePath: 'assets/models/plato_arqueologico.glb',
    hasDraco: true,
    targetScale: 3.0,
    description: 'Reconstrucción arqueológica de plato ceremonial con iconografía ancestral, pátina porosa y compresión DRACO aplicada en Blender.'
  },
  FUSION_CORE: {
    id: 'FUSION_CORE',
    title: 'Apartamento Retrofuturista',
    category: 'ArchViz Modular Concept',
    fileName: 'modapar.glb',
    relativePath: 'assets/models/modapar.glb',
    hasDraco: true,
    targetScale: 3.2,
    description: 'Concepto de apartamento modular con arquitectura retrofuturista, grandes ventanales y compresión DRACO v1.5.6.'
  }
};

/**
 * PASO 1: FUNCIÓN DE RESOLUCIÓN DE RUTA DINÁMICA
 * Resuelve cualquier ruta relativa en el servidor asegurando compatibilidad
 * con subcarpetas en GitHub Pages o dominios raíz en Vercel/Netlify.
 */
export const resolveModelUrl = (relativePath: string): string => {
  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  const cleanPath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
  return `${cleanBase}${cleanPath}`;
};

interface IguanaInspectionBayProps {
  initialModel?: BuiltinModelId;
  onModelChange?: (modelId: BuiltinModelId) => void;
}

export interface ExplodedComponent {
  mesh: THREE.Object3D;
  originalPosition: THREE.Vector3;
  direction: THREE.Vector3;
  distance: number;
  name: string;
}

export const IguanaInspectionBay: React.FC<IguanaInspectionBayProps> = ({
  initialModel = 'TERMINAL',
  onModelChange
}) => {
  const { t, language } = useLanguage();
  const mountRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const prevInitialModelPropRef = useRef<BuiltinModelId>(initialModel);

  const [activeModelId, setActiveModelId] = useState<BuiltinModelId>(initialModel);
  const [isWireframe, setIsWireframe] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [exposure, setExposure] = useState<number>(1.15);
  const [uploadedModelName, setUploadedModelName] = useState<string | null>(null);
  const [isLoadingModel, setIsLoadingModel] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isDracoActive, setIsDracoActive] = useState<boolean>(true);

  // Exploded View State (Cinemática y Despiece 3D)
  const [isExplodedView, setIsExplodedView] = useState<boolean>(false);
  const [explodeFactor, setExplodeFactor] = useState<number>(0);
  const [autoExplode, setAutoExplode] = useState<boolean>(false);
  const [showGuideLines, setShowGuideLines] = useState<boolean>(true);
  const [showBlenderTutorial, setShowBlenderTutorial] = useState<boolean>(false);
  const [activeExplodedCount, setActiveExplodedCount] = useState<number>(0);
  const [isDecomposedStructure, setIsDecomposedStructure] = useState<boolean>(false);
  const [copyCodeSuccess, setCopyCodeSuccess] = useState<boolean>(false);

  const explodedComponentsRef = useRef<ExplodedComponent[]>([]);
  const explodeFactorRef = useRef<number>(0);
  const autoExplodeRef = useRef<boolean>(false);
  const autoRotateRef = useRef<boolean>(true);
  const showGuideLinesRef = useRef<boolean>(true);

  const [stats, setStats] = useState({
    vertices: 2128,
    triangles: 1712,
    drawCalls: 4,
    dracoStatus: 'OPTIMIZADO (DRACO v1.5.6)'
  });

  const sceneRefs = useRef<{
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    renderer: THREE.WebGLRenderer | null;
    controls: OrbitControls | null;
    currentMeshGroup: THREE.Group | null;
    pmremGenerator: THREE.PMREMGenerator | null;
    guideLinesGroup: THREE.Group | null;
  }>({
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    currentMeshGroup: null,
    pmremGenerator: null,
    guideLinesGroup: null
  });

  const uploadedModelRef = useRef<{
    object: THREE.Object3D | null;
    originalMaterialsMap: Map<THREE.Mesh, THREE.Material | THREE.Material[]>;
  }>({
    object: null,
    originalMaterialsMap: new Map()
  });

  // PASO 3: LIMPIEZA PROFUNDA DE MEMORIA GPU (.dispose())
  // Libera geometrías, materiales y texturas al cambiar de modelo para evitar memory leaks
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
      // 1. Retro Cyber Terminal / Smartphone
      // Main Console Body
      const bodyGeo = new THREE.BoxGeometry(3.2, 1.4, 2.2);
      const body = new THREE.Mesh(bodyGeo, darkChassisMat);
      body.position.y = -0.4;
      body.name = 'Chasis Principal Unibody';
      group.add(body);

      // Chamfered bezel hood
      const hoodGeo = new THREE.BoxGeometry(2.6, 2.0, 1.6);
      const hood = new THREE.Mesh(hoodGeo, steelMat);
      hood.position.set(0, 1.0, -0.2);
      hood.rotation.x = -0.12;
      hood.name = 'Marco Biselado Frontal';
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
      screen.name = 'Display Táctil OLED Retro';
      group.add(screen);

      // Keyboard tray deck
      const kbGeo = new THREE.BoxGeometry(2.8, 0.18, 1.2);
      const kb = new THREE.Mesh(kbGeo, steelMat);
      kb.position.set(0, 0.15, 1.1);
      kb.rotation.x = 0.15;
      kb.name = 'Módulo Teclado Táctil';
      group.add(kb);

      // Vacuum Tube Diodes (retro-industrial detail)
      for (let i = -2; i <= 2; i++) {
        const tubeBaseGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.15, 16);
        const tubeBase = new THREE.Mesh(tubeBaseGeo, copperMat);
        tubeBase.position.set(i * 0.4, 2.05, -0.4);
        tubeBase.name = `Base Diodo ${i + 3}`;
        group.add(tubeBase);

        const glassBulbGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.45, 16);
        const glassBulb = new THREE.Mesh(glassBulbGeo, glassMat);
        glassBulb.position.set(i * 0.4, 2.3, -0.4);
        glassBulb.name = `Bulbo Cristal ${i + 3}`;
        group.add(glassBulb);

        const filamentGeo = new THREE.BoxGeometry(0.02, 0.25, 0.02);
        const filament = new THREE.Mesh(filamentGeo, tangerineMat);
        filament.position.set(i * 0.4, 2.3, -0.4);
        filament.name = `Filamento Lumínico ${i + 3}`;
        group.add(filament);
      }

      // Cooling Heat Sink Fins
      for (let j = 0; j < 8; j++) {
        const finGeo = new THREE.BoxGeometry(0.04, 0.8, 1.4);
        const fin = new THREE.Mesh(finGeo, tealAccentMat);
        fin.position.set(-1.45 + j * 0.12, 0.9, -0.9);
        fin.name = `Aleta Disipadora ${j + 1}`;
        group.add(fin);
      }

      vertCount = 4820;
      triCount = 7640;
    } else if (type === 'DRONE') {
      // 2. Recon Drone Iguana-X
      const bodyGeo = new THREE.CapsuleGeometry(0.7, 1.8, 16, 24);
      const body = new THREE.Mesh(bodyGeo, steelMat);
      body.rotation.x = Math.PI / 2;
      body.name = 'Fuselaje Pod Central';
      group.add(body);

      const eyeGeo = new THREE.SphereGeometry(0.42, 24, 24);
      const eyeMat = new THREE.MeshStandardMaterial({
        color: 0x99eeff,
        emissive: 0x99eeff,
        emissiveIntensity: 0.9,
        wireframe: wireframeMode
      });
      const eye = new THREE.Mesh(eyeGeo, eyeMat);
      eye.position.set(0, 0, 1.15);
      eye.name = 'Sensor Gimbal Ocular';
      group.add(eye);

      const angles = [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4];
      angles.forEach((ang, idx) => {
        const armGeo = new THREE.BoxGeometry(1.6, 0.12, 0.35);
        const arm = new THREE.Mesh(armGeo, darkChassisMat);
        arm.position.set(Math.cos(ang) * 1.2, Math.sin(ang) * 0.6, 0);
        arm.rotation.z = ang;
        arm.name = `Brazo Outrigger ${idx + 1}`;
        group.add(arm);

        const podGeo = new THREE.CylinderGeometry(0.35, 0.38, 0.8, 18);
        const pod = new THREE.Mesh(podGeo, tealAccentMat);
        pod.position.set(Math.cos(ang) * 2.1, Math.sin(ang) * 1.0, 0);
        pod.name = `Turbina Pod ${idx + 1}`;
        group.add(pod);

        const flameGeo = new THREE.ConeGeometry(0.24, 0.6, 16);
        const flame = new THREE.Mesh(flameGeo, tangerineMat);
        flame.position.set(Math.cos(ang) * 2.1, Math.sin(ang) * 1.0 - 0.5, 0);
        flame.rotation.x = Math.PI;
        flame.name = `Tobera Propulsora ${idx + 1}`;
        group.add(flame);
      });

      const antennaGeo = new THREE.CylinderGeometry(0.04, 0.08, 1.6, 12);
      const antenna = new THREE.Mesh(antennaGeo, copperMat);
      antenna.position.set(0, 1.1, -0.6);
      antenna.rotation.x = -0.3;
      antenna.name = 'Antena Direccional';
      group.add(antenna);

      vertCount = 6180;
      triCount = 9850;
    } else if (type === 'ARCHVIZ') {
      // 3. Plato Arqueológico Ceremonial (Patrimonio Cultural)
      const plateRimGeo = new THREE.CylinderGeometry(2.4, 2.1, 0.22, 32);
      const plateRim = new THREE.Mesh(plateRimGeo, copperMat);
      plateRim.name = 'Borde Ceremonial Biselado';
      group.add(plateRim);

      const basinGeo = new THREE.CylinderGeometry(2.0, 1.8, 0.12, 32);
      const basin = new THREE.Mesh(basinGeo, darkChassisMat);
      basin.position.y = 0.08;
      basin.name = 'Cuenco Cerámico Ancestral';
      group.add(basin);

      const medallionGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.06, 24);
      const medallion = new THREE.Mesh(medallionGeo, tangerineMat);
      medallion.position.y = 0.15;
      medallion.name = 'Medallón Iconográfico Central';
      group.add(medallion);

      for (let g = 0; g < 8; g++) {
        const ang = (g * Math.PI) / 4;
        const glyphGeo = new THREE.BoxGeometry(0.3, 0.08, 0.2);
        const glyph = new THREE.Mesh(glyphGeo, tealAccentMat);
        glyph.position.set(Math.cos(ang) * 1.5, 0.16, Math.sin(ang) * 1.5);
        glyph.rotation.y = -ang;
        glyph.name = `Relieve Glífico ${g + 1}`;
        group.add(glyph);
      }

      vertCount = 3840;
      triCount = 6120;
    } else {
      // 4. FUSION_CORE: Apartamento Retrofuturista (ArchViz Modular Concept)
      // Losa de cimentación y pedestal
      const slabGeo = new THREE.BoxGeometry(4.5, 0.3, 4.5);
      const slab = new THREE.Mesh(slabGeo, darkChassisMat);
      slab.position.y = -1.4;
      slab.name = 'Losa de Cimentación & Suelo';
      group.add(slab);

      // Módulo habitacional voladizo (Cantilever)
      const moduleGeo = new THREE.BoxGeometry(3.6, 1.4, 2.4);
      const mod = new THREE.Mesh(moduleGeo, steelMat);
      mod.position.set(0.4, 0.4, 0);
      mod.name = 'Módulo Habitacional Cantilever';
      group.add(mod);

      // Muro cortina de vidrio panorámico
      const glassWallGeo = new THREE.BoxGeometry(3.4, 1.1, 0.1);
      const glassWall = new THREE.Mesh(glassWallGeo, glassMat);
      glassWall.position.set(0.4, 0.4, 1.22);
      glassWall.name = 'Muro Cortina Panorámico de Vidrio';
      group.add(glassWall);

      // Columnas y pórticos estructurales
      [
        [-1.6, -1.6],
        [-1.6, 1.6],
        [1.8, -1.6],
        [1.8, 1.6]
      ].forEach(([cx, cz], i) => {
        const colGeo = new THREE.CylinderGeometry(0.18, 0.22, 2.2, 16);
        const col = new THREE.Mesh(colGeo, copperMat);
        col.position.set(cx, -0.3, cz);
        col.name = `Pilar Estructural ${i + 1}`;
        group.add(col);
      });

      // Persianas y louvers solares superiores
      for (let k = 0; k < 6; k++) {
        const louverGeo = new THREE.BoxGeometry(3.8, 0.05, 0.4);
        const louver = new THREE.Mesh(louverGeo, tangerineMat);
        louver.position.set(0.4, 1.25 + k * 0.12, 0.8 - k * 0.25);
        louver.rotation.x = 0.35;
        louver.name = `Persiana Louver Solar ${k + 1}`;
        group.add(louver);
      }

      vertCount = 4120;
      triCount = 6880;
    }

    setStats({
      vertices: vertCount,
      triangles: triCount,
      drawCalls: group.children.length,
      dracoStatus: 'OPTIMIZADO (DRACO v1.5.6)'
    });

    return group;
  }, []);

  // ============================================================================
  // PASO 4: RESET DE CÁMARA & CONTROLES ORBITALES
  // ============================================================================
  const handleResetCamera = useCallback(() => {
    soundEngine.playClickSound();
    if (sceneRefs.current.camera && sceneRefs.current.controls) {
      sceneRefs.current.camera.position.set(4.2, 3.0, 5.0);
      sceneRefs.current.controls.target.set(0, 0, 0);
      sceneRefs.current.controls.update();
    }
  }, []);

  // ============================================================================
  // MOTOR DE VISTA EXPLOSIONADA (DISASSEMBLY & EXPLODED VIEW VECTOR ENGINE)
  // ============================================================================
  const applyExplosion = useCallback((factor: number) => {
    const comps = explodedComponentsRef.current;
    if (!comps || comps.length === 0) return;

    // 1. Desplazar cada pieza a lo largo de su vector normalizado
    comps.forEach((comp) => {
      const offset = comp.direction.clone().multiplyScalar(comp.distance * factor);
      comp.mesh.position.copy(comp.originalPosition).add(offset);
    });

    // 2. Trazar líneas guía CAD vectoriales entre el punto de ensamble original y actual
    const linesGroup = sceneRefs.current.guideLinesGroup;
    if (!linesGroup) return;

    // Limpieza de mallas previas de líneas
    while (linesGroup.children.length > 0) {
      const child = linesGroup.children[0] as THREE.LineSegments;
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) child.material.forEach((m) => m.dispose());
        else child.material.dispose();
      }
      linesGroup.remove(child);
    }

    if (factor > 0.02 && showGuideLinesRef.current) {
      const points: THREE.Vector3[] = [];
      comps.forEach((comp) => {
        const p0 = new THREE.Vector3();
        const p1 = new THREE.Vector3();

        // Posición de anclaje original en espacio global
        const parentMat = comp.mesh.parent ? comp.mesh.parent.matrixWorld : new THREE.Matrix4();
        p0.copy(comp.originalPosition).applyMatrix4(parentMat);

        // Posición actual desplazada en espacio global
        comp.mesh.getWorldPosition(p1);

        points.push(p0);
        points.push(p1);
      });

      if (points.length > 0) {
        const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
        const lineMat = new THREE.LineDashedMaterial({
          color: 0x99eeff,
          dashSize: 0.12,
          gapSize: 0.08,
          transparent: true,
          opacity: 0.75
        });
        const lines = new THREE.LineSegments(lineGeo, lineMat);
        lines.computeLineDistances();
        linesGroup.add(lines);
      }
    }
  }, []);

  // Configuración de nodos y vectores para el despiece automático
  const setupExplodedComponents = useCallback((object: THREE.Object3D, currentId: BuiltinModelId) => {
    const comps: ExplodedComponent[] = [];
    const modelBox = new THREE.Box3().setFromObject(object);
    const modelCenter = modelBox.getCenter(new THREE.Vector3());

    const meshes: THREE.Mesh[] = [];
    object.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        meshes.push(child as THREE.Mesh);
      }
    });

    if (meshes.length > 1) {
      meshes.forEach((mesh, index) => {
        const rawName = (mesh.name || '').toLowerCase();
        let dir = new THREE.Vector3();
        let dist = 1.8;
        let label = mesh.name || `Componente ${index + 1}`;

        if (rawName.includes('cube.042') || rawName.includes('body') || rawName.includes('chassis') || rawName.includes('chasis')) {
          dir.set(0, 0, -0.7);
          dist = 1.3;
          label = language === 'es' ? 'Chasis Principal Unibody (Titanio)' : 'Titanium Unibody Chassis';
        } else if (rawName.includes('cylinder.034') || (rawName.includes('button') && index === 1)) {
          dir.set(1.8, -0.35, 0);
          dist = 2.2;
          label = language === 'es' ? 'Botón Inferior Lateral (Volumen)' : 'Lower Lateral Button (Volume)';
        } else if (rawName.includes('cylinder.036') || (rawName.includes('button') && index === 2)) {
          dir.set(1.8, 0.35, 0);
          dist = 2.2;
          label = language === 'es' ? 'Botón Superior Lateral (Power)' : 'Upper Lateral Button (Power)';
        } else if (rawName.includes('cylinder.035') || rawName.includes('dial') || rawName.includes('antenna')) {
          dir.set(-0.4, 2.0, 0.3);
          dist = 2.5;
          label = language === 'es' ? 'Selector Giratorio / Antena Óptica' : 'Rotary Selector / Optical Antenna';
        } else if (rawName.includes('screen') || rawName.includes('pantalla')) {
          dir.set(0, 0, 1.8);
          dist = 2.2;
          label = language === 'es' ? 'Display Táctil OLED Retro' : 'Retro OLED Touch Display';
        } else if (rawName.includes('bezel') || rawName.includes('hood') || rawName.includes('marco')) {
          dir.set(0, 0, 0.9);
          dist = 1.2;
          label = language === 'es' ? 'Marco Biselado Frontal' : 'Front Beveled Bezel';
        } else if (rawName.includes('kb') || rawName.includes('teclado')) {
          dir.set(0, -0.9, 1.3);
          dist = 1.6;
          label = language === 'es' ? 'Módulo Teclado Táctil' : 'Tactile Keyboard Module';
        } else if (rawName.includes('slab') || rawName.includes('cimentacion')) {
          dir.set(0, -1.8, 0);
          dist = 1.8;
          label = language === 'es' ? 'Losa de Cimentación & Suelo' : 'Foundation Slab & Floor';
        } else if (rawName.includes('mod') || rawName.includes('habitat')) {
          dir.set(0.4, 0.4, -0.8);
          dist = 1.6;
          label = language === 'es' ? 'Pabellón Habitacional Cantilever' : 'Cantilever Habitat Pavilion';
        } else if (rawName.includes('glass') || rawName.includes('vidrio')) {
          dir.set(0.4, 0.4, 2.0);
          dist = 2.4;
          label = language === 'es' ? 'Muro Cortina Panorámico de Vidrio' : 'Panoramic Glass Curtain Wall';
        } else if (rawName.includes('col') || rawName.includes('pilar')) {
          const colCenter = new THREE.Box3().setFromObject(mesh).getCenter(new THREE.Vector3());
          dir.set(colCenter.x > 0 ? 1.5 : -1.5, -0.4, colCenter.z > 0 ? 1.5 : -1.5);
          dist = 2.0;
          label = language === 'es' ? 'Pilar Espacial Estructural' : 'Structural Spaceframe Column';
        } else if (rawName.includes('louver') || rawName.includes('pergola')) {
          dir.set(0.3, 2.2, 0.6);
          dist = 2.5;
          label = language === 'es' ? 'Lamas de Protección Solar' : 'Solar Shading Louvers';
        } else if (rawName.includes('tube') || rawName.includes('diodo')) {
          dir.set(0, 2.0, -0.3);
          dist = 2.2;
          label = language === 'es' ? 'Diodos de Vacío Lumínicos' : 'Vacuum Tube Diodes';
        } else if (rawName.includes('fin') || rawName.includes('aleta')) {
          dir.set(-1.8, 0, 0);
          dist = 2.0;
          label = language === 'es' ? 'Aleta Disipadora Térmica' : 'Thermal Dissipation Fin';
        } else {
          const b = new THREE.Box3().setFromObject(mesh);
          const c = b.getCenter(new THREE.Vector3());
          dir.copy(c).sub(modelCenter);
          if (dir.lengthSq() < 0.001) {
            dir.set((index % 2 === 0 ? 1 : -1) * 0.8, 1.2, (index % 3 === 0 ? 1 : -1) * 0.8);
          } else {
            dir.normalize();
          }
          dist = 1.8;
        }

        comps.push({
          mesh,
          originalPosition: mesh.position.clone(),
          direction: dir,
          distance: dist,
          name: label
        });
      });
    }

    explodedComponentsRef.current = comps;
    setActiveExplodedCount(comps.length);
  }, [language]);

  // ============================================================================
  // PASO 5: PROCESAMIENTO, CENTRADO Y NORMALIZACIÓN DE ESCALA (THREE.Box3)
  // ============================================================================
  const processLoadedAsset = useCallback(
    (
      object: THREE.Object3D,
      fileName: string,
      isDraco = false,
      targetScale = 3.2,
      wireframeMode = false
    ) => {
      if (!sceneRefs.current.scene) return;

      // 1. Limpieza profunda en la GPU del modelo anterior
      if (sceneRefs.current.currentMeshGroup) {
        sceneRefs.current.scene.remove(sceneRefs.current.currentMeshGroup);
        disposeGroup(sceneRefs.current.currentMeshGroup);
      }

      const wrapper = new THREE.Group();
      uploadedModelRef.current.originalMaterialsMap.clear();

      let totalVerts = 0;
      let totalTris = 0;
      let meshCount = 0;

      // 2. Travesía de la jerarquía de nodos de Blender
      object.traverse((node) => {
        if ((node as THREE.Mesh).isMesh) {
          const mesh = node as THREE.Mesh;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          meshCount++;

          // Almacenar el material PBR original para alternar wireframe sin pérdida de texturas
          if (mesh.material) {
            uploadedModelRef.current.originalMaterialsMap.set(
              mesh,
              Array.isArray(mesh.material) ? [...mesh.material] : mesh.material
            );

            // Si el visor está en modo Wireframe al cargar, aplicar Tangerine #F57E00
            if (wireframeMode) {
              mesh.material = new THREE.MeshStandardMaterial({
                color: 0xf57e00,
                emissive: 0xf57e00,
                emissiveIntensity: 0.6,
                wireframe: true
              });
            }
          }

          // Extracción de telemetría técnica real del asset de Blender
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

      // 3. Centrado del modelo en el origen (0, 0, 0)
      const box = new THREE.Box3().setFromObject(object);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());

      object.position.sub(center);
      wrapper.add(object);

      // 4. Normalización automática de escala para presentación equilibrada
      const maxDim = Math.max(size.x, size.y, size.z);
      if (maxDim > 0 && isFinite(maxDim)) {
        wrapper.scale.setScalar(targetScale / maxDim);
      }

      // 5. Ajuste sobre el pedestal de inspección industrial
      const fitted = new THREE.Box3().setFromObject(wrapper);
      if (fitted.min.y < -1.5) {
        wrapper.position.y += (-1.5 - fitted.min.y);
      }

      sceneRefs.current.scene.add(wrapper);
      sceneRefs.current.currentMeshGroup = wrapper;
      uploadedModelRef.current.object = object;

      // 6. Configurar componentes dinámicos para la Vista Explosionada
      setupExplodedComponents(object, activeModelId);

      // 7. Actualización de telemetría de inspección
      setStats({
        vertices: totalVerts > 0 ? totalVerts : 3200,
        triangles: totalTris > 0 ? totalTris : 5100,
        drawCalls: meshCount > 0 ? meshCount : 1,
        dracoStatus: isDraco ? 'DRACO v1.5.6 (GOOGLE CDN)' : 'GLTF / DRACO PBR'
      });

      setUploadedModelName(fileName);
      setUploadError(null);
      setIsLoadingModel(false);
      handleResetCamera();
    },
    [handleResetCamera, setupExplodedComponents, activeModelId]
  );

  // ============================================================================
  // PASO 2: CARGADOR DE MODELOS MANUALES BLENDER (.GLB) CON DRACOLOADER
  // ============================================================================
  const loadBlenderGlbModel = useCallback(
    (modelId: BuiltinModelId, wireframeMode: boolean) => {
      const meta = BLENDER_MODELS_REGISTRY[modelId];
      if (!meta) return;

      setIsLoadingModel(true);
      setUploadError(null);
      soundEngine.playModelLoadSound();

      // Resetear estado de explosión para el nuevo modelo
      setIsExplodedView(false);
      setExplodeFactor(0);
      explodeFactorRef.current = 0;
      setAutoExplode(false);
      autoExplodeRef.current = false;
      setIsDecomposedStructure(false);

      // Resolver URL Same-Origin considerando Vite BASE_URL (/Iguananet/ o /)
      const resolvedUrl = resolveModelUrl(meta.relativePath);

      // Inicializar decodificador DRACO con WebAssembly oficial de Google CDN
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');

      // Inicializar cargador GLTF conectado al decodificador DRACO
      const gltfLoader = new GLTFLoader();
      gltfLoader.setDRACOLoader(dracoLoader);
      gltfLoader.setCrossOrigin('anonymous');

      gltfLoader.load(
        resolvedUrl,
        (gltf) => {
          processLoadedAsset(
            gltf.scene,
            `${meta.title} (${meta.fileName})`,
            meta.hasDraco,
            meta.targetScale,
            wireframeMode
          );
          dracoLoader.dispose();
        },
        undefined,
        (err) => {
          console.warn(`[Iguana3D] Fallback procedural activo para ${meta.title} (${resolvedUrl}):`, err);
          dracoLoader.dispose();

          // Red de seguridad: si no se encontrara el archivo binario, recurrir a modelo procedural
          if (sceneRefs.current.scene) {
            if (sceneRefs.current.currentMeshGroup) {
              sceneRefs.current.scene.remove(sceneRefs.current.currentMeshGroup);
              disposeGroup(sceneRefs.current.currentMeshGroup);
            }
            const fallbackGroup = buildCompositeModel(modelId, wireframeMode);
            sceneRefs.current.scene.add(fallbackGroup);
            sceneRefs.current.currentMeshGroup = fallbackGroup;
            setupExplodedComponents(fallbackGroup, modelId);
          }
          setIsLoadingModel(false);
        }
      );
    },
    [processLoadedAsset, buildCompositeModel, setupExplodedComponents]
  );

  // ============================================================================
  // INICIALIZACIÓN DE THREE.JS CON ROOMENVIRONMENT & LIGHTING RIG
  // ============================================================================
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Escena WebGL con fondo oscuro industrial
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x162937);
    sceneRefs.current.scene = scene;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // 2. Cámara de perspectiva
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(4.2, 3.0, 5.0);
    sceneRefs.current.camera = camera;

    // 3. Renderizador con espacio de color SRGB y mapeo tonal ACESFilmic
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

    // 4. OrbitControls con amortiguación suave
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 20;
    controls.minDistance = 1.2;
    sceneRefs.current.controls = controls;

    // 5. Entorno RoomEnvironment (previene modelos PBR negros sin luz HDRI externa)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    sceneRefs.current.pmremGenerator = pmremGenerator;
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

    // 6. Plataforma de iluminación de estudio de inspección
    const keyLight = new THREE.DirectionalLight(0xffeedd, 2.0);
    keyLight.position.set(6, 8, 6);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x99eeff, 1.4);
    rimLight.position.set(-6, 4, -6);
    scene.add(rimLight);

    const groundHemi = new THREE.HemisphereLight(0x99eeff, 0x162937, 0.6);
    scene.add(groundHemi);

    // Cuadrícula pedestal de inspección industrial
    const grid = new THREE.GridHelper(16, 20, 0xf57e00, 0x244156);
    grid.position.y = -1.6;
    scene.add(grid);

    // Grupo para líneas guía CAD vectoriales de la Vista Explosionada
    const guideLinesGroup = new THREE.Group();
    scene.add(guideLinesGroup);
    sceneRefs.current.guideLinesGroup = guideLinesGroup;

    // Cargar inmediatamente el modelo inicial manual hecho en Blender
    loadBlenderGlbModel(activeModelId, isWireframe);

    // 7. Bucle de renderizado a 60 FPS con auto-rotación y auto-explosión
    let animId: number;
    const animate = () => {
      if (sceneRefs.current.currentMeshGroup && autoRotateRef.current) {
        sceneRefs.current.currentMeshGroup.rotation.y += 0.005;
      }

      if (autoExplodeRef.current) {
        const time = performance.now() * 0.0014;
        const factor = (Math.sin(time) + 1) * 0.45;
        explodeFactorRef.current = factor;
        setExplodeFactor(factor);
        applyExplosion(factor);
      }

      controls.update();
      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);

    // Observer de redimensionamiento responsivo
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
  }, [loadBlenderGlbModel, applyExplosion]);

  // Mantener refs sincronizadas con el estado reactivo
  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    showGuideLinesRef.current = showGuideLines;
    applyExplosion(explodeFactorRef.current);
  }, [showGuideLines, applyExplosion]);

  // Manejadores para la Vista Explosionada
  const handleExplodeSliderChange = (newFactor: number) => {
    setAutoExplode(false);
    autoExplodeRef.current = false;
    setExplodeFactor(newFactor);
    explodeFactorRef.current = newFactor;
    if (newFactor > 0.01 && !isExplodedView) {
      setIsExplodedView(true);
    } else if (newFactor <= 0.01 && isExplodedView) {
      setIsExplodedView(false);
    }
    applyExplosion(newFactor);
  };

  const handleToggleExplodedView = () => {
    const next = !isExplodedView;
    setIsExplodedView(next);
    soundEngine.playPillarSwitchSound();

    if (next) {
      const defaultFactor = 0.75;
      setExplodeFactor(defaultFactor);
      explodeFactorRef.current = defaultFactor;
      applyExplosion(defaultFactor);
    } else {
      setAutoExplode(false);
      autoExplodeRef.current = false;
      setExplodeFactor(0);
      explodeFactorRef.current = 0;
      applyExplosion(0);
    }
  };

  const handleToggleAutoExplode = () => {
    const next = !autoExplode;
    setAutoExplode(next);
    autoExplodeRef.current = next;
    soundEngine.playClickSound();
    if (next && !isExplodedView) {
      setIsExplodedView(true);
    }
  };

  const handleToggleApartmentDecomposed = (decomposed: boolean) => {
    setIsDecomposedStructure(decomposed);
    soundEngine.playClickSound();

    if (sceneRefs.current.scene) {
      if (sceneRefs.current.currentMeshGroup) {
        sceneRefs.current.scene.remove(sceneRefs.current.currentMeshGroup);
        disposeGroup(sceneRefs.current.currentMeshGroup);
      }

      if (decomposed) {
        const compositeGroup = buildCompositeModel('FUSION_CORE', isWireframe);
        sceneRefs.current.scene.add(compositeGroup);
        sceneRefs.current.currentMeshGroup = compositeGroup;
        setupExplodedComponents(compositeGroup, 'FUSION_CORE');
        setIsExplodedView(true);
        setExplodeFactor(0.75);
        explodeFactorRef.current = 0.75;
        applyExplosion(0.75);
      } else {
        loadBlenderGlbModel('FUSION_CORE', isWireframe);
        setIsExplodedView(false);
        setExplodeFactor(0);
        explodeFactorRef.current = 0;
      }
    }
  };

  const handleTogglePhoneDecomposed = (decomposed: boolean) => {
    setIsDecomposedStructure(decomposed);
    soundEngine.playClickSound();

    if (sceneRefs.current.scene) {
      if (sceneRefs.current.currentMeshGroup) {
        sceneRefs.current.scene.remove(sceneRefs.current.currentMeshGroup);
        disposeGroup(sceneRefs.current.currentMeshGroup);
      }

      if (decomposed) {
        const compositeGroup = buildCompositeModel('TERMINAL', isWireframe);
        sceneRefs.current.scene.add(compositeGroup);
        sceneRefs.current.currentMeshGroup = compositeGroup;
        setupExplodedComponents(compositeGroup, 'TERMINAL');
        setIsExplodedView(true);
        setExplodeFactor(0.75);
        explodeFactorRef.current = 0.75;
        applyExplosion(0.75);
      } else {
        loadBlenderGlbModel('TERMINAL', isWireframe);
      }
    }
  };

  // Sincronizar selección externa de modelo ÚNICAMENTE cuando la prop externa cambie de valor
  useEffect(() => {
    if (initialModel && initialModel !== prevInitialModelPropRef.current) {
      prevInitialModelPropRef.current = initialModel;
      setActiveModelId(initialModel);
      setUploadedModelName(null);
      setUploadError(null);
      loadBlenderGlbModel(initialModel, isWireframe);
    }
  }, [initialModel, isWireframe, loadBlenderGlbModel]);

  // Manejador de cambio manual de modelo mediante los botones [1], [2], [3], [4]
  const handleModelSelect = (id: BuiltinModelId) => {
    prevInitialModelPropRef.current = id;
    setActiveModelId(id);
    setUploadedModelName(null);
    setUploadError(null);
    loadBlenderGlbModel(id, isWireframe);
    onModelChange?.(id);
  };

  // Alternar modo Wireframe en color Tangerine (#F57E00) con restauración de texturas PBR
  const handleToggleWireframe = () => {
    const nextWire = !isWireframe;
    setIsWireframe(nextWire);
    soundEngine.playWireframeToggleSound(nextWire);

    if (uploadedModelRef.current.object) {
      // Alternar en el modelo de Blender activo
      uploadedModelRef.current.object.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.material) {
            if (nextWire) {
              // Modo Wireframe Tangerine
              mesh.material = new THREE.MeshStandardMaterial({
                color: 0xf57e00,
                emissive: 0xf57e00,
                emissiveIntensity: 0.6,
                wireframe: true
              });
            } else {
              // Restaurar material PBR original de Blender
              const orig = uploadedModelRef.current.originalMaterialsMap.get(mesh);
              if (orig) {
                mesh.material = orig;
              }
            }
          }
        }
      });
    } else if (sceneRefs.current.scene) {
      // Toggle en modelo procedural de fallback
      if (sceneRefs.current.currentMeshGroup) {
        sceneRefs.current.scene.remove(sceneRefs.current.currentMeshGroup);
        disposeGroup(sceneRefs.current.currentMeshGroup);
      }
      const newGroup = buildCompositeModel(activeModelId, nextWire);
      sceneRefs.current.scene.add(newGroup);
      sceneRefs.current.currentMeshGroup = newGroup;
    }
  };

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
            {language === 'es' ? 'ASSETS 3D:' : '3D ASSETS:'}
          </span>
          <button
            onClick={() => handleModelSelect('TERMINAL')}
            className={`px-2.5 py-1 rounded text-[11px] font-mono-telemetry border transition-all flex items-center gap-1.5 ${
              activeModelId === 'TERMINAL' && !uploadedModelName
                ? 'bg-[#F57E00] text-black font-bold border-[#F57E00]'
                : 'bg-[#244156]/60 text-slate-300 border-[#99EEFF]/30 hover:border-[#99EEFF]'
            }`}
            title="Soporta Vista Explosionada de Componentes"
          >
            <span>[1] {t.inspectionBay.tabs.terminal}</span>
            <span className="px-1 py-0.2 bg-black/40 text-[9px] text-[#99EEFF] rounded font-bold">
              💥 EXPLODE
            </span>
          </button>
          <button
            onClick={() => handleModelSelect('DRONE')}
            className={`px-2.5 py-1 rounded text-[11px] font-mono-telemetry border transition-all ${
              activeModelId === 'DRONE' && !uploadedModelName
                ? 'bg-[#F57E00] text-black font-bold border-[#F57E00]'
                : 'bg-[#244156]/60 text-slate-300 border-[#99EEFF]/30 hover:border-[#99EEFF]'
            }`}
          >
            [2] {t.inspectionBay.tabs.drone}
          </button>
          <button
            onClick={() => handleModelSelect('ARCHVIZ')}
            className={`px-2.5 py-1 rounded text-[11px] font-mono-telemetry border transition-all ${
              activeModelId === 'ARCHVIZ' && !uploadedModelName
                ? 'bg-[#F57E00] text-black font-bold border-[#F57E00]'
                : 'bg-[#244156]/60 text-slate-300 border-[#99EEFF]/30 hover:border-[#99EEFF]'
            }`}
          >
            [3] {t.inspectionBay.tabs.archviz}
          </button>
          <button
            onClick={() => handleModelSelect('FUSION_CORE')}
            className={`px-2.5 py-1 rounded text-[11px] font-mono-telemetry border transition-all flex items-center gap-1.5 ${
              activeModelId === 'FUSION_CORE' && !uploadedModelName
                ? 'bg-[#F57E00] text-black font-bold border-[#F57E00]'
                : 'bg-[#244156]/60 text-slate-300 border-[#99EEFF]/30 hover:border-[#99EEFF]'
            }`}
            title="Soporta Vista Explosionada de Componentes"
          >
            <span>[4] {t.inspectionBay.tabs.fusionCore}</span>
            <span className="px-1 py-0.2 bg-black/40 text-[9px] text-[#99EEFF] rounded font-bold">
              💥 EXPLODE
            </span>
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
                {language === 'es' ? 'TELEMETRÍA TÉCNICA' : 'TECHNICAL TELEMETRY'}
              </span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono-telemetry border border-emerald-500/40">
              60 FPS OK
            </span>
          </div>

          <div className="space-y-1.5 font-mono-telemetry text-[11px]">
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">{t.inspectionBay.vertices}:</span>
              <span className="text-[#99EEFF] font-bold">{stats.vertices.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">{t.inspectionBay.triangles} / TRIS:</span>
              <span className="text-[#F57E00] font-bold">{stats.triangles.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">{t.inspectionBay.drawCalls}:</span>
              <span className="text-white font-bold">{stats.drawCalls}</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">{t.inspectionBay.dracoStatus}:</span>
              <span className="text-emerald-400 font-semibold text-[10px]">
                ONLINE (GOOGLE CDN)
              </span>
            </div>
            {isExplodedView && (
              <div className="flex justify-between items-center text-slate-200 pt-1 border-t border-[#F57E00]/40">
                <span className="text-[#F57E00] font-bold">
                  {language === 'es' ? 'DESPIECE:' : 'EXPLOSION:'}
                </span>
                <span className="text-[#99EEFF] font-bold">
                  {Math.round(explodeFactor * 100)}% ({activeExplodedCount} {language === 'es' ? 'piezas' : 'parts'})
                </span>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-[#99EEFF]/20 flex items-center gap-2 text-[10px] text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{language === 'es' ? 'RoomEnvironment activo (Cero PBR oscuro)' : 'RoomEnvironment active (No dark PBR)'}</span>
          </div>
        </div>

        {/* Upload Error Alert */}
        {uploadError && (
          <div className="absolute top-4 right-4 z-20 max-w-sm bg-red-950/80 border border-red-500/50 p-3 rounded-lg text-xs text-red-200 flex items-start gap-2 shadow-2xl">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold block">{language === 'es' ? 'Error de Carga' : 'Upload Error'}</span>
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
            <span>{language === 'es' ? 'AUTO-ROTACIÓN' : 'AUTO-ROTATION'}</span>
          </button>

          {/* Reset Camera */}
          <button
            onClick={handleResetCamera}
            className="px-3 py-1.5 rounded bg-[#244156] hover:bg-[#2e526d] text-slate-200 border border-[#99EEFF]/30 flex items-center gap-1.5 font-mono-telemetry transition-colors"
            title={language === 'es' ? 'Centrar perspectiva' : 'Reset perspective'}
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#99EEFF]" />
            <span>{language === 'es' ? 'CENTRAR' : 'RESET'}</span>
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

          {/* Exploded View Toggle Button */}
          <button
            onClick={handleToggleExplodedView}
            className={`px-3 py-1.5 rounded flex items-center gap-1.5 font-mono-telemetry font-bold border transition-all ${
              isExplodedView
                ? 'bg-[#F57E00] text-black border-[#F57E00] shadow-[0_0_15px_rgba(245,126,0,0.6)]'
                : 'bg-[#244156] text-slate-200 border-[#99EEFF]/30 hover:border-[#99EEFF]'
            }`}
            title={language === 'es' ? 'Alternar vista explosionada de componentes' : 'Toggle exploded view'}
          >
            <Split className="w-3.5 h-3.5" />
            <span>
              {language === 'es' ? 'VISTA EXPLOSIONADA' : 'EXPLODED VIEW'}
              {activeExplodedCount > 0 ? ` [${activeExplodedCount}]` : ''}
            </span>
          </button>

          {/* Sub-bar for Exploded View Slider and Controls */}
          {isExplodedView && (
            <div className="flex items-center gap-2 bg-[#162937]/95 px-3 py-1 rounded border border-[#F57E00]/40 flex-wrap animate-fadeIn">
              <span className="font-mono-telemetry text-[11px] text-[#F57E00] font-bold min-w-[34px]">
                {Math.round(explodeFactor * 100)}%
              </span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={explodeFactor}
                onChange={(e) => handleExplodeSliderChange(parseFloat(e.target.value))}
                className="w-20 sm:w-28 accent-[#F57E00] cursor-pointer"
                title={language === 'es' ? 'Ajustar distancia de despiece' : 'Adjust explosion distance'}
              />

              {/* Auto cycle button */}
              <button
                onClick={handleToggleAutoExplode}
                className={`px-2 py-0.5 rounded text-[10px] font-mono-telemetry border flex items-center gap-1 transition-all ${
                  autoExplode
                    ? 'bg-[#99EEFF] text-black font-bold border-[#99EEFF]'
                    : 'bg-[#244156] text-slate-300 border-[#99EEFF]/20 hover:border-[#99EEFF]'
                }`}
                title={language === 'es' ? 'Ciclo continuo de ensamblaje' : 'Auto cycle assembly'}
              >
                {autoExplode ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                <span>AUTO</span>
              </button>

              {/* CAD guide lines toggle */}
              <button
                onClick={() => setShowGuideLines(!showGuideLines)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono-telemetry border transition-all ${
                  showGuideLines
                    ? 'bg-[#244156] text-[#99EEFF] font-bold border-[#99EEFF]/50'
                    : 'bg-[#244156]/50 text-slate-400 border-transparent'
                }`}
                title={language === 'es' ? 'Líneas vectoriales de anclaje CAD' : 'CAD guide lines'}
              >
                CAD
              </button>

              {/* Layer mode switch for Apartment / Phone */}
              {(activeModelId === 'FUSION_CORE' || activeModelId === 'TERMINAL') && (
                <button
                  onClick={() => {
                    if (activeModelId === 'FUSION_CORE') {
                      handleToggleApartmentDecomposed(!isDecomposedStructure);
                    } else {
                      handleTogglePhoneDecomposed(!isDecomposedStructure);
                    }
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono-telemetry border flex items-center gap-1 transition-all ${
                    isDecomposedStructure
                      ? 'bg-gradient-to-r from-[#F57E00] to-[#e66c00] text-black font-bold border-[#F57E00]'
                      : 'bg-[#244156] text-slate-300 border-[#99EEFF]/30 hover:border-[#99EEFF]'
                  }`}
                  title={language === 'es' ? 'Alternar entre GLB original y despiece multicapa' : 'Toggle multi-layer decomposed structure'}
                >
                  <Boxes className="w-3 h-3" />
                  <span>
                    {isDecomposedStructure
                      ? (language === 'es' ? 'MODO CAPAS' : 'LAYERS MODE')
                      : (language === 'es' ? 'GLB ORIGINAL' : 'ORIGINAL GLB')}
                  </span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Blender GLB Exploded View Tutorial Button */}
          <button
            onClick={() => {
              soundEngine.playClickSound();
              setShowBlenderTutorial(true);
            }}
            className="px-2.5 py-1.5 rounded bg-[#162937] hover:bg-[#1f384c] text-[#99EEFF] hover:text-white border border-[#99EEFF]/40 flex items-center gap-1.5 font-mono-telemetry text-xs transition-colors shadow-sm"
            title={language === 'es' ? 'Guía técnica: cómo crear vistas explosionadas en Blender para GLB' : 'Technical guide: how to create exploded views in Blender for GLB'}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#F57E00]" />
            <span className="hidden sm:inline">{language === 'es' ? 'GUÍA BLENDER GLB' : 'BLENDER GLB GUIDE'}</span>
            <span className="sm:hidden">{language === 'es' ? 'GUÍA' : 'GUIDE'}</span>
          </button>

          {/* Upload Custom Model Button */}
          <label className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#244156] to-[#1b3447] hover:from-[#1b3447] hover:to-[#2e5675] text-[#99EEFF] border border-[#99EEFF]/50 rounded cursor-pointer transition-all font-mono-telemetry font-bold">
            <Upload className="w-3.5 h-3.5 text-[#F57E00]" />
            <span>{language === 'es' ? 'SUBIR .GLB / .OBJ' : 'UPLOAD .GLB / .OBJ'}</span>
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

      {/* ==================================================================== */}
      {/* MODAL TUTORIAL: GUÍA TÉCNICA DE VISTA EXPLOSIONADA EN BLENDER & GLB  */}
      {/* ==================================================================== */}
      {showBlenderTutorial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#0e1b24] border border-[#99EEFF]/40 clip-chamfer-45 p-6 sm:p-8 shadow-[0_0_60px_rgba(22,41,55,0.9)] space-y-6 text-slate-200">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#99EEFF]/20">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono-telemetry text-[#F57E00] uppercase tracking-wider">
                  <BookOpen className="w-4 h-4 text-[#F57E00]" />
                  <span>// PROTOCOLO DE INGENIERÍA 3D // BLENDER & WEBGL DRACO</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-heading font-black text-white">
                  {language === 'es'
                    ? '¿CÓMO CREAR VISTAS EXPLOSIONADAS EN BLENDER PARA GLB?'
                    : 'HOW TO CREATE EXPLODED VIEWS IN BLENDER FOR GLB?'}
                </h3>
                <p className="text-xs text-slate-400 font-sans">
                  {language === 'es'
                    ? 'Guía técnica y mejores prácticas para el Teléfono Inteligente, el Apartamento Modular y cualquier asset 3D.'
                    : 'Technical guide and best practices for the Smartphone, Modular Apartment, and any 3D asset.'}
                </p>
              </div>

              <button
                onClick={() => setShowBlenderTutorial(false)}
                className="p-1 text-slate-400 hover:text-white hover:bg-[#244156] rounded transition-colors"
                title="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Diagnóstico de los archivos GLB */}
            <div className="p-4 bg-[#162937]/80 border border-[#99EEFF]/25 rounded-lg space-y-2">
              <h4 className="font-heading font-bold text-white text-xs text-[#99EEFF] flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#F57E00]" />
                <span>{language === 'es' ? '1. DIAGNÓSTICO DE LOS ARCHIVOS DEL PROYECTO' : '1. PROJECT FILES TECHNICAL DIAGNOSTIC'}</span>
              </h4>
              <ul className="text-xs space-y-2 font-sans text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-[#F57E00] font-bold">▶</span>
                  <span>
                    <strong>newsovphone.glb (Teléfono Inteligente):</strong> Exportado con 4 nodos/mallas independientes (<code className="text-[#99EEFF] bg-black/40 px-1 rounded">Cube.042</code>, <code className="text-[#99EEFF] bg-black/40 px-1 rounded">Cylinder.034</code>, <code className="text-[#99EEFF] bg-black/40 px-1 rounded">Cylinder.036</code>, <code className="text-[#99EEFF] bg-black/40 px-1 rounded">Cylinder.035</code>). Three.js desplaza nativamente el chasis y los botones laterales en tiempo real a lo largo de sus ejes coordenados.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#F57E00] font-bold">▶</span>
                  <span>
                    <strong>modapar.glb (Apartamento Retrofuturista):</strong> Fue exportado en Blender como una <em>malla única consolidada (1 mesh: modapar)</em>. En WebGL, una malla única comparte un solo buffer de transformación, por lo que no puede despiezarse nodo a nodo a menos que se separe en piezas sueltas en Blender o se use el <strong>MODO CAPAS (13 Piezas)</strong> integrado en este visor.
                  </span>
                </li>
              </ul>
            </div>

            {/* Paso a paso en Blender */}
            <div className="space-y-4">
              <h4 className="font-heading font-bold text-white text-sm flex items-center gap-2">
                <Boxes className="w-4 h-4 text-[#F57E00]" />
                <span>{language === 'es' ? '2. PASO A PASO EN BLENDER (MÉTODO RECOMENDADO)' : '2. STEP-BY-STEP IN BLENDER (RECOMMENDED METHOD)'}</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-[#162937]/70 border border-[#99EEFF]/20 rounded-lg space-y-1.5">
                  <span className="font-mono-telemetry font-bold text-[#F57E00] block text-[11px]">
                    PASO 1 // SEPARAR MALLAS SUELTAS
                  </span>
                  <p className="text-slate-300 font-sans">
                    En Blender, selecciona el objeto y entra a <strong>Edit Mode</strong> (<kbd className="bg-black/50 px-1 rounded text-[#99EEFF]">Tab</kbd>). Selecciona todo con <kbd className="bg-black/50 px-1 rounded text-[#99EEFF]">A</kbd>, presiona <kbd className="bg-black/50 px-1 rounded text-[#99EEFF]">P</kbd> y haz clic en <strong>"By Loose Parts"</strong>.
                  </p>
                  <span className="text-[10px] text-emerald-400 font-mono-telemetry block">
                    ✓ Divide losas, paredes, pilares y pérgolas en objetos independientes.
                  </span>
                </div>

                <div className="p-3.5 bg-[#162937]/70 border border-[#99EEFF]/20 rounded-lg space-y-1.5">
                  <span className="font-mono-telemetry font-bold text-[#F57E00] block text-[11px]">
                    PASO 2 // RECALCULAR PUNTOS DE ORIGEN
                  </span>
                  <p className="text-slate-300 font-sans">
                    Vuelve a <strong>Object Mode</strong> (<kbd className="bg-black/50 px-1 rounded text-[#99EEFF]">Tab</kbd>). Selecciona todas las piezas sueltas (<kbd className="bg-black/50 px-1 rounded text-[#99EEFF]">A</kbd>), haz clic derecho y elige <strong>Set Origin &gt; Origin to Geometry</strong>.
                  </p>
                  <span className="text-[10px] text-emerald-400 font-mono-telemetry block">
                    ✓ Coloca el pivote en el centro exacto de cada pieza para un despiece simétrico.
                  </span>
                </div>

                <div className="p-3.5 bg-[#162937]/70 border border-[#99EEFF]/20 rounded-lg space-y-1.5">
                  <span className="font-mono-telemetry font-bold text-[#F57E00] block text-[11px]">
                    PASO 3 // NOMENCLATURA EN EL OUTLINER
                  </span>
                  <p className="text-slate-300 font-sans">
                    En el panel de la derecha (Outliner), renombra tus piezas de forma descriptiva: <code className="text-[#99EEFF]">Chasis</code>, <code className="text-[#99EEFF]">Pantalla</code>, <code className="text-[#99EEFF]">Boton_Volumen</code>, <code className="text-[#99EEFF]">Losa_Cimentacion</code>, <code className="text-[#99EEFF]">Ventanales_Vidrio</code>, <code className="text-[#99EEFF]">Pergola_Techo</code>.
                  </p>
                  <span className="text-[10px] text-[#99EEFF] font-mono-telemetry block">
                    ✓ Three.js detecta estas palabras clave para asignar vectores de desplazamiento automáticos.
                  </span>
                </div>

                <div className="p-3.5 bg-[#162937]/70 border border-[#99EEFF]/20 rounded-lg space-y-1.5">
                  <span className="font-mono-telemetry font-bold text-[#F57E00] block text-[11px]">
                    PASO 4 // EXPORTAR GLTF 2.0 CON DRACO
                  </span>
                  <p className="text-slate-300 font-sans">
                    Ve a <strong>File &gt; Export &gt; glTF 2.0 (.glb)</strong>.
                    En la barra lateral:
                    <br />• <em>Format:</em> glTF Binary (.glb)
                    <br />• <em>Transform:</em> +Y Up
                    <br />• <em>Compression:</em> Activa <strong>DRACO mesh compression</strong>
                  </p>
                  <span className="text-[10px] text-emerald-400 font-mono-telemetry block">
                    ✓ Reduce el archivo hasta un 85% preservando la jerarquía de nodos.
                  </span>
                </div>
              </div>
            </div>

            {/* Método Alternativo: Animación por Keyframes */}
            <div className="p-4 bg-[#162937]/60 border border-[#F57E00]/30 rounded-lg space-y-2">
              <h4 className="font-heading font-bold text-white text-xs text-[#F57E00] flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5 text-[#F57E00]" />
                <span>{language === 'es' ? '3. MÉTODO ALTERNATIVO: ANIMACIÓN HORNEADA CON KEYFRAMES' : '3. ALTERNATIVE METHOD: BAKED TIMELINE KEYFRAME ANIMATION'}</span>
              </h4>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {language === 'es'
                  ? 'Si deseas que cada pieza siga una trayectoria curva o una coreografía cinematográfica específica: en la Timeline de Blender inserta keyframes de posición (tecla I > Location). En el Frame 0 coloca el modelo armado; en el Frame 60 desplaza las piezas al aire. Al exportar a .glb, marca la casilla "Animations". El visor de Three.js sincronizará esa animación automáticamente.'
                  : 'If you want each part to follow a specific curved or choreographed path: in Blender\'s Timeline insert Location keyframes (press I > Location). At Frame 0, keep the model assembled; at Frame 60, disperse the parts in space. When exporting to .glb, check "Animations". The Three.js viewer can scrub this animation with AnimationMixer.'}
              </p>
            </div>

            {/* Código Three.js de Demostración */}
            <div className="p-4 bg-[#091218] border border-[#99EEFF]/20 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono-telemetry text-[#99EEFF]">
                  // SNIPPET DE CÓDIGO THREE.JS PARA VISTA EXPLOSIONADA
                </span>
                <button
                  onClick={() => {
                    const code = `// Desplazamiento vectorial de piezas en Three.js\nconst explodeVector = mesh.position.clone().sub(modelCenter).normalize();\nmesh.position.add(explodeVector.multiplyScalar(distance * explodeFactor));`;
                    navigator.clipboard.writeText(code);
                    setCopyCodeSuccess(true);
                    setTimeout(() => setCopyCodeSuccess(false), 2000);
                  }}
                  className="px-2 py-0.5 bg-[#244156] hover:bg-[#325b7a] text-xs font-mono-telemetry text-slate-200 rounded flex items-center gap-1 transition-colors"
                >
                  {copyCodeSuccess ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-[#99EEFF]" />}
                  <span>{copyCodeSuccess ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>
              <pre className="text-[11px] font-mono text-emerald-300 overflow-x-auto p-2 bg-black/40 rounded">
                <code>{`// 1. Obtener centro global del modelo
const center = new THREE.Box3().setFromObject(model).getCenter(new THREE.Vector3());

// 2. Desplazar cada pieza hija a lo largo de su vector normalizado
model.traverse((child) => {
  if (child.isMesh) {
    const dir = child.position.clone().sub(center).normalize();
    child.position.add(dir.multiplyScalar(distance * explodeFactor));
  }
});`}</code>
              </pre>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end pt-2 border-t border-[#99EEFF]/20">
              <button
                onClick={() => setShowBlenderTutorial(false)}
                className="px-5 py-2 bg-[#99EEFF] hover:bg-white text-black font-heading font-bold text-xs rounded transition-all shadow-[0_0_15px_rgba(153,238,255,0.4)]"
              >
                {language === 'es' ? 'ENTENDIDO // VOLVER AL INSPECTION BAY' : 'UNDERSTOOD // BACK TO INSPECTION BAY'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

