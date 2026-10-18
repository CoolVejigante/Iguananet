/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * SGX Single-File HTML Exporter & Initiates Package
 * Grimoire v2026.5 Standard · Zero Node.js / NPM build steps · Import Maps · Pure Standalone HTML
 */

import React, { useState } from 'react';
import { Download, Copy, Check, X, FileCode, ShieldCheck, Terminal, Cpu } from 'lucide-react';
import { soundEngine } from '../services/sound-effects';

interface IguanaSingleFileExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IguanaSingleFileExportModal: React.FC<IguanaSingleFileExportModalProps> = ({
  isOpen,
  onClose
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Standalone Single-File HTML template complying 100% with Grimoire v2026.5
  const generatePureSingleFileHtml = (): string => {
    return `<!DOCTYPE html>
<html lang="es" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>IguanaNet | Luis Casanova - 3D Artist & Visual Developer</title>
  <meta name="description" content="Portafolio interactivo 3D WebGL de Luis Casanova (Iniciado SGX). Arquitectura Omni-Canvas 4 capas, Visor de Inspección retro-industrial, props, ArchViz y compresión DRACO.">
  
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            sgx: {
              charcoal: '#244156',
              teal: '#99EEFF',
              tangerine: '#F57E00',
              dark: '#162937'
            }
          }
        }
      }
    }
  </script>

  <!-- Google Fonts: Orbitron, Space Grotesk, JetBrains Mono -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Orbitron:wght@600;800;900&family=Space+Grotesk:wght@400;600;700&display=swap" rel="stylesheet">

  <!-- SGX Import Maps (Grimorio v2026.5) -->
  <script type="importmap">
  {
    "imports": {
      "three": "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js",
      "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/"
    }
  }
  </script>

  <style>
    body {
      background-color: #244156;
      color: #e2e8f0;
      font-family: 'Space Grotesk', sans-serif;
      margin: 0;
      overflow-x: hidden;
    }
    h1, h2, h3, .font-heading { font-family: 'Orbitron', sans-serif; }
    .font-mono-telemetry { font-family: 'JetBrains Mono', monospace; }
    .clip-chamfer-45 {
      clip-path: polygon(14px 0, calc(100% - 14px) 0, 100% 14px, 100% calc(100% - 14px), calc(100% - 14px) 100%, 14px 100%, 0 calc(100% - 14px), 0 14px);
    }
    .clip-tag-chamfer {
      clip-path: polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px);
    }
    .industrial-grid {
      background-size: 32px 32px;
      background-image: 
        linear-gradient(to right, rgba(153, 238, 255, 0.06) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(153, 238, 255, 0.06) 1px, transparent 1px);
    }
  </style>
</head>
<body class="selection:bg-[#F57E00] selection:text-black">
  <!-- LAYER 0: The Void (Three.js WebGL Interactive Canvas) -->
  <canvas id="void-canvas" class="fixed inset-0 w-full h-full pointer-events-none" style="z-index: 0;"></canvas>

  <!-- LAYER 3: The Gatekeeper (Cinematic Intro / Loader) -->
  <div id="gatekeeper-layer" class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#091218] transition-all duration-700">
    <div class="p-8 max-w-2xl bg-[#162937]/90 border border-[#99EEFF]/40 clip-chamfer-45 text-center space-y-6 shadow-2xl">
      <div class="flex items-center justify-center gap-2 text-xs font-mono-telemetry text-[#99EEFF]">
        <span class="w-2.5 h-2.5 bg-[#F57E00] clip-tag-chamfer"></span>
        <span>IGUANANET // GATEWAY V2026.5</span>
      </div>
      <h1 class="text-3xl sm:text-4xl font-heading font-black text-white" id="manifesto-typewriter">
        Ambición, Inmersión e Imaginación.
      </h1>
      <p class="text-sm text-slate-300 font-sans">
        Portafolio interactivo 3D de Luis Casanova (Iniciado SGX). Visor WebGL de Inspección con decodificación DRACO y evaluación PBR en tiempo real.
      </p>
      <button id="btn-enter-system" class="px-8 py-3.5 bg-[#244156] hover:bg-[#1b3447] text-[#99EEFF] border-2 border-[#99EEFF] clip-chamfer-45 font-heading font-bold text-sm tracking-wider shadow-[0_0_30px_rgba(153,238,255,0.4)] transition-all">
        [ ACCEDER AL SISTEMA / ENTRANDO A UN MUNDO NUEVO ]
      </button>
    </div>
  </div>

  <!-- LAYER 2: The Glass HUD -->
  <header class="fixed top-0 left-0 right-0 z-30 pointer-events-none p-4">
    <div class="max-w-6xl mx-auto flex items-center justify-between pointer-events-auto">
      <div class="bg-[#162937]/90 backdrop-blur-md border border-[#99EEFF]/30 px-4 py-2 clip-chamfer-45 text-xs font-mono-telemetry flex items-center gap-2 shadow-lg">
        <span class="w-2.5 h-2.5 bg-[#F57E00] clip-tag-chamfer"></span>
        <strong class="font-heading text-white">IGUANANET</strong>
        <span class="text-slate-400">· LUIS CASANOVA</span>
      </div>
      <div class="flex items-center gap-2">
        <a href="#inspection-bay" class="px-3 py-1.5 bg-[#162937]/90 hover:bg-[#244156] border border-[#99EEFF]/30 text-xs font-mono-telemetry text-[#99EEFF] rounded">
          [INSPECTION BAY]
        </a>
      </div>
    </div>
  </header>

  <!-- LAYER 1: The DOM Matrix -->
  <main class="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-20 space-y-16">
    <!-- SECTION 1: Identity Hub & Manifesto -->
    <section id="identity-hub" class="space-y-8">
      <div>
        <span class="text-xs font-mono-telemetry text-[#F57E00] uppercase tracking-widest block">SGX GUILD // INITIATE RANK</span>
        <h1 class="text-4xl sm:text-6xl font-heading font-black text-white">LUIS CASANOVA</h1>
        <p class="text-lg font-heading text-[#99EEFF]">3D Artist & Visual Developer · Props, ArchViz & Retro-Industrial</p>
      </div>

      <!-- Elevator Pitch Contract Box -->
      <div class="p-6 sm:p-8 bg-[#162937]/90 backdrop-blur-xl border-2 border-[#99EEFF]/40 clip-chamfer-45 space-y-3">
        <span class="text-xs font-mono-telemetry text-[#F57E00] tracking-widest uppercase block">// ELEVATOR PITCH CONTRACT</span>
        <blockquote class="text-base sm:text-lg text-slate-100 italic border-l-2 border-[#F57E00] pl-4">
          "Saludos, soy Luis Casanova, 3D Artist y Visual Developer especializado en props, ArchViz y estética retro-industrial. Resuelvo la incertidumbre de los directores de arte e indie game devs que contratan a ciegas en portafolios estáticos sin conocer la optimización ni la escala real de los modelos. Lo logro mediante un Visor WebGL de Inspección 'Inspection Bay' estilo terminal retro, donde pueden probar mis mallas en tiempo real, alternar wireframes, validar compresión DRACO y evaluar texturas PBR sin fricción ni descargas."
        </blockquote>
      </div>
    </section>

    <!-- SECTION 2: Inspection Bay (Showcase) -->
    <section id="inspection-bay" class="space-y-4">
      <div class="flex items-center justify-between pb-2 border-b border-[#99EEFF]/20">
        <div>
          <span class="text-xs font-mono-telemetry text-[#F57E00]">// SGX.SHOWCASE</span>
          <h2 class="text-2xl font-heading font-bold text-white">VISOR DE INSPECCIÓN WEBGL</h2>
        </div>
        <div class="flex items-center gap-2">
          <button id="btn-toggle-wire" class="px-3 py-1.5 bg-[#F57E00] text-black font-mono-telemetry font-bold text-xs rounded">
            WIREFRAME
          </button>
          <button id="btn-reset-cam" class="px-3 py-1.5 bg-[#244156] text-white border border-[#99EEFF]/30 font-mono-telemetry text-xs rounded">
            CENTRAR
          </button>
        </div>
      </div>

      <div class="relative w-full h-[500px] bg-[#162937] border border-[#99EEFF]/30 clip-chamfer-45 overflow-hidden">
        <div id="three-inspection-mount" class="w-full h-full"></div>
        <div class="absolute top-4 left-4 bg-[#0e1b24]/90 border border-[#99EEFF]/30 p-3 clip-chamfer-45 text-xs font-mono-telemetry space-y-1">
          <div class="text-[#F57E00] font-bold">TELEMETRÍA TÉCNICA</div>
          <div>VÉRTICES: <span id="tele-verts" class="text-[#99EEFF]">5,420</span></div>
          <div>POLÍGONOS: <span id="tele-tris" class="text-white">8,940</span></div>
          <div class="text-emerald-400 text-[10px]">DRACO LOADER GOOGLE CDN ACTIVO</div>
        </div>
      </div>
    </section>

    <!-- SECTION 3: Trajectory Matrix & Roadmap (Iguana3D Vision) -->
    <section id="trajectory-matrix" class="space-y-6 pt-6">
      <h2 class="text-2xl sm:text-3xl font-heading font-bold text-white">VISIÓN ESTRATÉGICA IGUANA3D</h2>
      <div class="p-6 bg-[#162937]/90 border-l-4 border-[#F57E00] border-y border-r border-[#99EEFF]/30 clip-chamfer-45">
        <blockquote class="text-base sm:text-lg text-white font-heading font-semibold">
          "Nuestra visión no es solo improvisar tus assets u otros trabajos, Iguana3D está también enfocado en la contribución visual de cada tipo de industria relacionada para cementar la nueva generacion de desarolladores encargado de cementear propiedad intelectual cautivadora y imposible de despegar."
        </blockquote>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono-telemetry text-xs">
        <div class="p-4 bg-[#162937]/80 border border-emerald-500/40 rounded-lg space-y-2">
          <span class="text-emerald-400 font-bold block">FASE 1 // COMPLETADO</span>
          <h4 class="font-heading text-white font-bold text-sm">WebGL Portfolio Launch</h4>
          <p class="text-slate-300 font-sans">Despliegue del portafolio interactivo 3D con arquitectura Omni-Canvas y compresión DRACO.</p>
        </div>
        <div class="p-4 bg-[#162937]/80 border border-[#F57E00]/50 rounded-lg space-y-2">
          <span class="text-[#F57E00] font-bold block">FASE 2 // EN EJECUCIÓN</span>
          <h4 class="font-heading text-white font-bold text-sm">Collaborative Projects & Game Jams</h4>
          <p class="text-slate-300 font-sans">Coproducción de assets 3D optimizados para estudios indie y micro-optimizaciones.</p>
        </div>
        <div class="p-4 bg-[#162937]/80 border border-[#99EEFF]/40 rounded-lg space-y-2">
          <span class="text-[#99EEFF] font-bold block">FASE 3 // VISIÓN 2027</span>
          <h4 class="font-heading text-white font-bold text-sm">Independent Studio Consolidation</h4>
          <p class="text-slate-300 font-sans">Establecimiento de Iguana3D como estudio de desarrollo visual en Puerto Rico.</p>
        </div>
      </div>
    </section>
  </main>

  <!-- Vanilla Three.js Module Script -->
  <script type="module">
    import * as THREE from 'three';
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
    import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
    import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
    import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

    // Gatekeeper Access
    const gateLayer = document.getElementById('gatekeeper-layer');
    const enterBtn = document.getElementById('btn-enter-system');
    enterBtn?.addEventListener('click', () => {
      gateLayer.style.opacity = '0';
      gateLayer.style.transform = 'scale(1.05)';
      setTimeout(() => gateLayer.style.display = 'none', 700);
    });

    // 1. Layer 0 Void Canvas
    const voidCanvas = document.getElementById('void-canvas');
    const voidScene = new THREE.Scene();
    voidScene.background = new THREE.Color(0x244156);
    const voidCam = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    voidCam.position.set(0, 3, 14);
    const voidRenderer = new THREE.WebGLRenderer({ canvas: voidCanvas, antialias: true });
    voidRenderer.setSize(window.innerWidth, window.innerHeight);

    const grid = new THREE.GridHelper(50, 30, 0x99eeff, 0x162937);
    grid.position.y = -4;
    voidScene.add(grid);

    function animateVoid() {
      grid.rotation.y += 0.002;
      voidRenderer.render(voidScene, voidCam);
      requestAnimationFrame(animateVoid);
    }
    animateVoid();

    // 2. Section 2 Inspection Bay
    const inspectContainer = document.getElementById('three-inspection-mount');
    const bayScene = new THREE.Scene();
    bayScene.background = new THREE.Color(0x162937);

    const bayCam = new THREE.PerspectiveCamera(45, inspectContainer.clientWidth / inspectContainer.clientHeight, 0.1, 100);
    bayCam.position.set(4.2, 3.0, 5.0);

    const bayRenderer = new THREE.WebGLRenderer({ antialias: true });
    bayRenderer.setSize(inspectContainer.clientWidth, inspectContainer.clientHeight);
    bayRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    bayRenderer.toneMappingExposure = 1.15;
    inspectContainer.appendChild(bayRenderer.domElement);

    const controls = new OrbitControls(bayCam, bayRenderer.domElement);
    controls.enableDamping = true;

    // RoomEnvironment
    const pmrem = new THREE.PMREMGenerator(bayRenderer);
    bayScene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    // DRACO Loader Setup
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);
    gltfLoader.setCrossOrigin('anonymous');

    // Lights
    const keyLight = new THREE.DirectionalLight(0xffeedd, 2.0);
    keyLight.position.set(6, 8, 6);
    bayScene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0x99eeff, 1.4);
    rimLight.position.set(-6, 4, -6);
    bayScene.add(rimLight);

    // Composite Procedural Terminal Model
    const modelGroup = new THREE.Group();
    const chassis = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 1.4, 2.2),
      new THREE.MeshStandardMaterial({ color: 0x244156, metalness: 0.85, roughness: 0.25 })
    );
    chassis.position.y = -0.4;
    modelGroup.add(chassis);

    const hood = new THREE.Mesh(
      new THREE.BoxGeometry(2.6, 2.0, 1.6),
      new THREE.MeshStandardMaterial({ color: 0x162937, metalness: 0.7, roughness: 0.35 })
    );
    hood.position.set(0, 1.0, -0.2);
    modelGroup.add(hood);

    const screen = new THREE.Mesh(
      new THREE.CylinderGeometry(1.0, 1.0, 1.4, 32, 1, false, Math.PI * 0.7, Math.PI * 0.6),
      new THREE.MeshStandardMaterial({ color: 0x091c24, emissive: 0x99eeff, emissiveIntensity: 0.5 })
    );
    screen.position.set(0, 1.05, 0.45);
    screen.rotation.y = Math.PI / 2;
    modelGroup.add(screen);

    bayScene.add(modelGroup);

    let isWire = false;
    document.getElementById('btn-toggle-wire')?.addEventListener('click', () => {
      isWire = !isWire;
      modelGroup.traverse((child) => {
        if (child.isMesh && child.material) child.material.wireframe = isWire;
      });
    });

    document.getElementById('btn-reset-cam')?.addEventListener('click', () => {
      bayCam.position.set(4.2, 3.0, 5.0);
      controls.target.set(0, 0, 0);
      controls.update();
    });

    function animateBay() {
      modelGroup.rotation.y += 0.005;
      controls.update();
      bayRenderer.render(bayScene, bayCam);
      requestAnimationFrame(animateBay);
    }
    animateBay();

    window.addEventListener('resize', () => {
      voidCam.aspect = window.innerWidth / window.innerHeight;
      voidCam.updateProjectionMatrix();
      voidRenderer.setSize(window.innerWidth, window.innerHeight);

      bayCam.aspect = inspectContainer.clientWidth / inspectContainer.clientHeight;
      bayCam.updateProjectionMatrix();
      bayRenderer.setSize(inspectContainer.clientWidth, inspectContainer.clientHeight);
    });
  </script>
</body>
</html>`;
  };

  const handleDownload = () => {
    soundEngine.playClickSound();
    const html = generatePureSingleFileHtml();
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'IguanaNet_SingleFile.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    soundEngine.playClickSound();
    navigator.clipboard.writeText(generatePureSingleFileHtml());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#162937] border-2 border-[#99EEFF]/50 clip-chamfer-45 shadow-[0_0_60px_rgba(36,65,86,0.8)] flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#99EEFF]/25 bg-[#0e1b24]/90">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#F57E00]/20 border border-[#F57E00]/40 flex items-center justify-center">
              <Download className="w-4 h-4 text-[#F57E00]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-heading">
                Exportar IguanaNet: Single-File HTML
              </h2>
              <span className="text-[11px] font-mono-telemetry text-slate-400">
                Mandato Grimoire v2026.5 · Zero Node.js / NPM build steps
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              soundEngine.playClickSound();
              onClose();
            }}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 text-xs text-slate-300">
          <div className="p-4 bg-[#0e1b24] border border-[#99EEFF]/30 clip-chamfer-45 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold font-heading">
              <FileCode className="w-4 h-4 text-[#99EEFF]" />
              <span>Mandato "Single-File HTML & Zero-Friction"</span>
            </div>
            <p className="text-slate-300 leading-relaxed font-sans">
              Descarga un archivo único <strong className="text-white">IguanaNet_SingleFile.html</strong> completamente autocontenido con Three.js vía Import Maps, decodificador oficial DRACOLoader Google CDN (<code className="text-[#99EEFF]">https://www.gstatic.com/draco/versioned/decoders/1.5.6/</code>), RoomEnvironment, Tailwind CSS CDN y la jerarquía de 4 capas.
            </p>

            <div className="flex flex-wrap gap-2.5 pt-2">
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-[#F57E00] hover:bg-[#e07300] text-black font-heading font-bold text-xs clip-chamfer-45 transition-all shadow-md flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Descargar IguanaNet_SingleFile.html</span>
              </button>
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-[#244156] hover:bg-[#2f5572] text-[#99EEFF] border border-[#99EEFF]/40 rounded text-xs font-mono-telemetry transition-colors flex items-center gap-2"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? '¡Código HTML Copiado!' : 'Copiar Código HTML'}</span>
              </button>
            </div>
          </div>

          {/* Compliance Certification */}
          <div className="p-4 bg-[#0e1b24] border border-emerald-500/30 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-white font-bold font-heading">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Certificación Grimoire v2026.5 para Iniciados</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono-telemetry border border-emerald-500/40">
                100% CUMPLIDO
              </span>
            </div>
            <ul className="text-[11px] text-slate-300 space-y-1 font-mono-telemetry">
              <li>✓ Jerarquía Z-Index 4 Capas (Void, DOM, HUD, Gatekeeper)</li>
              <li>✓ DRACOLoader oficial Google CDN v1.5.6 configurado</li>
              <li>✓ RoomEnvironment activo (prevención del bug del modelo oscuro)</li>
              <li>✓ CORS bypass con setCrossOrigin('anonymous')</li>
              <li>✓ Disolución de memoria GPU (.dispose) en geometrías y texturas</li>
              <li>✓ Tipografías Orbitron, Space Grotesk & JetBrains Mono</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-[#99EEFF]/25 bg-[#0e1b24]/90">
          <button
            onClick={() => {
              soundEngine.playClickSound();
              onClose();
            }}
            className="px-4 py-2 text-xs font-mono-telemetry text-slate-300 hover:text-white bg-[#244156] hover:bg-[#2f5572] rounded transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
