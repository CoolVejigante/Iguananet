/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * MÓDULO SGX.Synthesize: Los Magos del Futuro (The Apex Synthesis)
 * Grimorio Cap V, X, XV, XVI: Audio FFT Reactivity, Ubershaders & Live Performance Hotkeys
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Zap, Sparkles, Volume2, VolumeX, Maximize2, Pause, Play, Activity, Radio, Layers, Mic } from 'lucide-react';
import { soundEngine } from '../../services/sound-effects';

interface SynthesizeModuleProps {
  onOpenRemix: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const SynthesizeModule: React.FC<SynthesizeModuleProps> = ({ onOpenRemix, isMuted, onToggleMute }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [isFrozen, setIsFrozen] = useState<boolean>(false);
  const [activeUniverse, setActiveUniverse] = useState<number>(1);
  const [audioGain, setAudioGain] = useState<number>(1.4);
  const [isSynthPlaying, setIsSynthPlaying] = useState<boolean>(false);
  const [pulseActive, setPulseActive] = useState<boolean>(false);
  const [audioMeter, setAudioMeter] = useState({ bass: 0.1, mids: 0.1, highs: 0.1, peak: 0.1 });
  const [fps, setFps] = useState(60);

  const sceneState = useRef<{
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    renderer: THREE.WebGLRenderer | null;
    controls: OrbitControls | null;
    coreMesh: THREE.Mesh | null;
    wireframeHalo: THREE.Mesh | null;
    particlesMesh: THREE.Points | null;
    particlePositions: Float32Array | null;
    isFrozen: boolean;
    activeUniverse: number;
    pulseDecay: number;
    audioGain: number;
    frameCount: number;
    lastFpsUpdate: number;
  }>({
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    coreMesh: null,
    wireframeHalo: null,
    particlesMesh: null,
    particlePositions: null,
    isFrozen: false,
    activeUniverse: 1,
    pulseDecay: 0,
    audioGain: 1.4,
    frameCount: 0,
    lastFpsUpdate: performance.now()
  });

  // Sync state refs
  useEffect(() => {
    sceneState.current.isFrozen = isFrozen;
    sceneState.current.activeUniverse = activeUniverse;
    sceneState.current.audioGain = audioGain;
  }, [isFrozen, activeUniverse, audioGain]);

  // Trigger manual pulse (HotKey P - Grimoire Cap XVI)
  const triggerPulse = useCallback(() => {
    soundEngine.playPulseSound();
    sceneState.current.pulseDecay = 1.0;
    setPulseActive(true);
    setTimeout(() => setPulseActive(false), 200);
  }, []);

  // Toggle cyber synthesizer beat loop
  const toggleSynth = () => {
    const running = soundEngine.toggleCyberSynth();
    setIsSynthPlaying(running);
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);
    sceneState.current.scene = scene;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || (window.innerHeight - 110);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 2.5, 6.5);
    sceneState.current.camera = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);
    sceneState.current.renderer = renderer;

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

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    sceneState.current.controls = controls;

    // 2. Center Reactive Holographic Core
    const coreGeo = new THREE.IcosahedronGeometry(1.6, 2);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xfdcc0d,
      emissive: 0x32527b,
      emissiveIntensity: 0.4,
      metalness: 0.9,
      roughness: 0.2
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreMesh);
    sceneState.current.coreMesh = coreMesh;

    // Outer Resonant Wireframe Halo
    const haloGeo = new THREE.TorusGeometry(2.6, 0.08, 16, 64);
    const haloMat = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x00ffff,
      emissiveIntensity: 0.7,
      wireframe: true
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    haloMesh.rotation.x = Math.PI / 2.2;
    scene.add(haloMesh);
    sceneState.current.wireframeHalo = haloMesh;

    // 3. Audio-Reactive Particle Storm (Grimorio Cap X)
    const particleCount = 1200;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const radius = 2.8 + Math.random() * 4.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      positions[i * 3] = radius * Math.cos(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi);
      positions[i * 3 + 2] = radius * Math.cos(phi) * Math.sin(theta);
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    sceneState.current.particlePositions = positions;

    const particleMat = new THREE.PointsMaterial({
      color: 0x00ffff,
      size: 0.06,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    sceneState.current.particlesMesh = particles;

    // 4. Studio Key & Accent Lighting
    const dirLight1 = new THREE.DirectionalLight(0xfdcc0d, 1.4);
    dirLight1.position.set(5, 8, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x00ffff, 1.2);
    dirLight2.position.set(-5, -4, -5);
    scene.add(dirLight2);

    // Grid Floor
    const grid = new THREE.GridHelper(30, 30, 0xfdcc0d, 0x32527b);
    grid.position.y = -2.2;
    scene.add(grid);

    // 5. Keyboard shortcuts (Grimorio Cap XVI: Live Performance Controls)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['1', '2', '3', '4', '5', '6', '7', '8'].includes(e.key)) {
        const u = parseInt(e.key);
        setActiveUniverse(u);
        soundEngine.playClickSound();
      } else if (e.code === 'Space') {
        e.preventDefault();
        setIsFrozen((prev) => !prev);
        soundEngine.playClickSound();
      } else if (e.code === 'KeyP') {
        triggerPulse();
      } else if (e.code === 'KeyM') {
        onToggleMute();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // 6. Audio Reactive Render Loop (Grimorio Cap XV: Audio Routing Equation)
    let animId: number;
    const animate = (time: number) => {
      // FPS measurement
      sceneState.current.frameCount++;
      if (time - sceneState.current.lastFpsUpdate >= 1000) {
        setFps(sceneState.current.frameCount);
        sceneState.current.frameCount = 0;
        sceneState.current.lastFpsUpdate = time;
      }

      if (!sceneState.current.isFrozen) {
        // Read FFT from Web Audio API
        const audio = soundEngine.getAudioTelemetry();
        setAudioMeter(audio);

        const gain = sceneState.current.audioGain;
        const pulse = sceneState.current.pulseDecay;
        sceneState.current.pulseDecay = Math.max(0, sceneState.current.pulseDecay - 0.05);

        // Bass scale calculation: max(1.0, scale) to prevent polygon collapse (Grimorio Cap 3.2)
        const bassImpact = Math.max(0, audio.bass * 0.7 * gain) + pulse * 0.45;
        const scaleVal = 1.0 + bassImpact;

        if (coreMesh) {
          coreMesh.scale.set(scaleVal, scaleVal, scaleVal);
          coreMesh.rotation.y += 0.008 + audio.mids * 0.02;
          coreMesh.rotation.x += 0.005 + audio.highs * 0.015;

          // React to universe color
          const mat = coreMesh.material as THREE.MeshStandardMaterial;
          if (sceneState.current.activeUniverse % 2 === 0) {
            mat.color.setHex(0x00ffff);
          } else {
            mat.color.setHex(0xfdcc0d);
          }
        }

        if (haloMesh) {
          haloMesh.rotation.z += 0.012 + audio.bass * 0.02;
          const haloScale = 1.0 + audio.highs * 0.5 + pulse * 0.3;
          haloMesh.scale.set(haloScale, haloScale, haloScale);
        }

        if (particles) {
          particles.rotation.y += 0.003 + audio.mids * 0.008;
          particles.rotation.x = Math.sin(time * 0.0008) * 0.2;
        }

        controls.update();
      }

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [onToggleMute, triggerPulse]);

  return (
    <div className={`relative w-full h-full flex flex-col overflow-hidden bg-[#050505] ${pulseActive ? 'ring-2 ring-[#FDCC0D]' : ''}`}>
      {/* Top HUD Telemetry */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-4 pointer-events-none">
        <div className="flex items-center gap-4 bg-[#0a0f18]/85 backdrop-blur-md border border-[#FDCC0D]/40 px-4 py-2 rounded-lg pointer-events-auto">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FDCC0D] animate-ping" />
            <span className="text-xs font-semibold text-slate-300 font-heading">SYNTHESIZE.APEX</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="text-xs text-slate-400 font-mono-telemetry">
            <span>UNIVERSO: </span>
            <span className="text-[#00FFFF] font-bold">0{activeUniverse} / 08</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="text-xs text-slate-400 font-mono-telemetry flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-[#FDCC0D]" />
            <span>REACTIVIDAD FFT: </span>
            <span className="text-emerald-400 font-bold">{Math.round(audioGain * 100)}%</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="text-xs text-slate-400 font-mono-telemetry">
            <span>FPS: </span>
            <span className="text-emerald-400">{fps}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={triggerPulse}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#111a29]/90 hover:bg-[#1a283e] text-[#FDCC0D] border border-[#FDCC0D]/40 rounded-md transition-colors"
            title="Disparar pulso manual (Tecla P)"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Pulso (P)</span>
          </button>
          <button
            onClick={() => setIsFrozen(!isFrozen)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#111a29]/90 hover:bg-[#1a283e] text-slate-200 border border-[#32527B]/50 rounded-md transition-colors"
            title="Congelar simulación (Espacio)"
          >
            {isFrozen ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5 text-amber-400" />}
            <span>{isFrozen ? 'Reanudar' : 'Pausar'}</span>
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

      {/* Main 3D Viewport */}
      <div ref={mountRef} className="relative flex-1 w-full h-full min-h-[420px] cursor-grab active:cursor-grabbing select-none" />

      {/* Left Bottom Live FFT Audio Spectrum VU Meter (Grimorio Cap XV) */}
      <div className="absolute bottom-16 left-6 z-20 bg-[#0a0f18]/90 backdrop-blur-md border border-[#32527B]/40 p-3 rounded-lg text-xs pointer-events-auto w-64 shadow-xl">
        <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-[#32527B]/30">
          <div className="flex items-center gap-1.5 text-[#FDCC0D] font-bold font-heading text-[11px]">
            <Activity className="w-3.5 h-3.5" />
            <span>Analizador FFT Acústico</span>
          </div>
          <button
            onClick={toggleSynth}
            className={`px-2 py-0.5 rounded text-[10px] font-mono-telemetry transition-colors ${
              isSynthPlaying ? 'bg-[#00FFFF] text-black font-bold' : 'bg-white/10 text-slate-300 hover:bg-white/15'
            }`}
          >
            {isSynthPlaying ? 'BEAT ON' : 'BEAT OFF'}
          </button>
        </div>

        {/* 4 Bands: Bass (25-220Hz), Mids (220-2400Hz), Highs (2400-16kHz), Peak */}
        <div className="space-y-1.5 font-mono-telemetry text-[10px]">
          <div>
            <div className="flex justify-between text-slate-400 mb-0.5">
              <span>Graves (25-220Hz)</span>
              <span className="text-[#FDCC0D]">{Math.round(audioMeter.bass * 100)}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded overflow-hidden">
              <div className="h-full bg-[#FDCC0D] transition-all duration-75" style={{ width: `${audioMeter.bass * 100}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-400 mb-0.5">
              <span>Medios (220-2.4kHz)</span>
              <span className="text-[#00FFFF]">{Math.round(audioMeter.mids * 100)}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded overflow-hidden">
              <div className="h-full bg-[#00FFFF] transition-all duration-75" style={{ width: `${audioMeter.mids * 100}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-400 mb-0.5">
              <span>Agudos (2.4-16kHz)</span>
              <span className="text-[#B87333]">{Math.round(audioMeter.highs * 100)}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded overflow-hidden">
              <div className="h-full bg-[#B87333] transition-all duration-75" style={{ width: `${audioMeter.highs * 100}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar Controls */}
      <div className="z-10 bg-[#0a0f18] border-t border-[#32527B]/30 px-6 py-3 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Escena:</span>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <button
                key={num}
                onClick={() => {
                  setActiveUniverse(num);
                  soundEngine.playClickSound();
                }}
                className={`w-6 h-6 flex items-center justify-center rounded font-mono-telemetry transition-colors ${
                  activeUniverse === num ? 'bg-[#FDCC0D] text-black font-bold' : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {num}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Sensibilidad Audio:</span>
            <input
              type="range"
              min="0.5"
              max="3.0"
              step="0.1"
              value={audioGain}
              onChange={(e) => setAudioGain(parseFloat(e.target.value))}
              className="w-20 accent-[#FDCC0D]"
            />
          </div>
        </div>

        <div className="text-slate-400 text-[11px]">
          Hotkeys: <span className="font-mono-telemetry text-slate-200">1-8 (Escenas), Espacio (Pausa), P (Pulso), M (Mute)</span>
        </div>
      </div>
    </div>
  );
};
