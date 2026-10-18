/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * MÓDULO SGX.Stage: Los Showrunners (The Void)
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Compass, Sparkles, Volume2, Move, Eye, Radio, Zap } from 'lucide-react';
import { soundEngine } from '../../services/sound-effects';

interface StageModuleProps {
  onOpenRemix: () => void;
  isMuted: boolean;
}

interface BeaconInfo {
  name: string;
  x: number;
  z: number;
  color: string;
  freq: number;
  mesh: THREE.Mesh;
}

export const StageModule: React.FC<StageModuleProps> = ({ onOpenRemix, isMuted }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [camCoords, setCamCoords] = useState({ x: 0, y: 1.7, z: 8 });
  const [nearestBeacon, setNearestBeacon] = useState<{ name: string; dist: number }>({ name: 'Alpha', dist: 12 });
  const [activePreset, setActivePreset] = useState<string>('MANDO');
  const [fogDensity, setFogDensity] = useState(0.035);

  const sceneRef = useRef<{
    camera: THREE.PerspectiveCamera | null;
    beacons: BeaconInfo[];
    keys: { w: boolean; s: boolean; a: boolean; d: boolean; q: boolean; e: boolean };
    camPos: THREE.Vector3;
    camYaw: number;
    camPitch: number;
    isDragging: boolean;
    lastMouseX: number;
    lastMouseY: number;
  }>({
    camera: null,
    beacons: [],
    keys: { w: false, s: false, a: false, d: false, q: false, e: false },
    camPos: new THREE.Vector3(0, 1.7, 8),
    camYaw: 0,
    camPitch: 0,
    isDragging: false,
    lastMouseX: 0,
    lastMouseY: 0
  });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Three.js Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);
    scene.fog = new THREE.FogExp2(0x050505, fogDensity);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || (window.innerHeight - 110);

    const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 1000);
    camera.position.copy(sceneRef.current.camPos);
    sceneRef.current.camera = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

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

    // 2. Holodeck Infinite Grid Floor
    const gridHelper = new THREE.GridHelper(160, 80, 0xFDCC0D, 0x32527B);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // Subtle reflective circular podium at center
    const podiumGeo = new THREE.CylinderGeometry(8, 8, 0.2, 32);
    const podiumMat = new THREE.MeshStandardMaterial({
      color: 0x0a101a,
      roughness: 0.2,
      metalness: 0.8,
      wireframe: false
    });
    const podium = new THREE.Mesh(podiumGeo, podiumMat);
    podium.position.y = 0.1;
    scene.add(podium);

    // Perimeter boundary rings
    const ringGeo = new THREE.RingGeometry(24, 24.2, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00FFFF, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.05;
    scene.add(ring);

    // 3. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xFDCC0D, 0.8);
    dirLight.position.set(10, 20, 10);
    scene.add(dirLight);

    // 4. Create Spatial Audio Beacons
    const beacons: BeaconInfo[] = [];

    const createBeacon = (name: string, x: number, z: number, colorHex: number, colorStr: string, freq: number) => {
      const beaconGroup = new THREE.Group();
      
      // Core geometric pillar
      const geo = new THREE.OctahedronGeometry(1.2, 0);
      const mat = new THREE.MeshStandardMaterial({
        color: colorHex,
        emissive: colorHex,
        emissiveIntensity: 0.6,
        wireframe: true
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.y = 2.2;
      beaconGroup.add(mesh);

      // Base pedestal
      const baseGeo = new THREE.CylinderGeometry(0.8, 1.2, 1.2, 16);
      const baseMat = new THREE.MeshStandardMaterial({ color: 0x162032, metalness: 0.8, roughness: 0.3 });
      const baseMesh = new THREE.Mesh(baseGeo, baseMat);
      baseMesh.position.y = 0.6;
      beaconGroup.add(baseMesh);

      // Light glow
      const pLight = new THREE.PointLight(colorHex, 2, 18);
      pLight.position.y = 2.5;
      beaconGroup.add(pLight);

      beaconGroup.position.set(x, 0, z);
      scene.add(beaconGroup);

      beacons.push({ name, x, z, color: colorStr, freq, mesh });
    };

    createBeacon('Alpha (Graves)', -14, -14, 0xFDCC0D, '#FDCC0D', 140);
    createBeacon('Beta (Medios)', 14, -12, 0x00FFFF, '#00FFFF', 440);
    createBeacon('Gamma (Agudos)', 0, -28, 0xB87333, '#B87333', 880);
    sceneRef.current.beacons = beacons;

    // 5. Input Listeners
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['KeyW', 'ArrowUp'].includes(e.code)) sceneRef.current.keys.w = true;
      if (['KeyS', 'ArrowDown'].includes(e.code)) sceneRef.current.keys.s = true;
      if (['KeyA', 'ArrowLeft'].includes(e.code)) sceneRef.current.keys.a = true;
      if (['KeyD', 'ArrowRight'].includes(e.code)) sceneRef.current.keys.d = true;
      if (e.code === 'KeyE') sceneRef.current.keys.e = true; // Up
      if (e.code === 'KeyQ') sceneRef.current.keys.q = true; // Down
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['KeyW', 'ArrowUp'].includes(e.code)) sceneRef.current.keys.w = false;
      if (['KeyS', 'ArrowDown'].includes(e.code)) sceneRef.current.keys.s = false;
      if (['KeyA', 'ArrowLeft'].includes(e.code)) sceneRef.current.keys.a = false;
      if (['KeyD', 'ArrowRight'].includes(e.code)) sceneRef.current.keys.d = false;
      if (e.code === 'KeyE') sceneRef.current.keys.e = false;
      if (e.code === 'KeyQ') sceneRef.current.keys.q = false;
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) {
        sceneRef.current.isDragging = true;
        sceneRef.current.lastMouseX = e.clientX;
        sceneRef.current.lastMouseY = e.clientY;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (sceneRef.current.isDragging) {
        const deltaX = e.clientX - sceneRef.current.lastMouseX;
        const deltaY = e.clientY - sceneRef.current.lastMouseY;
        sceneRef.current.lastMouseX = e.clientX;
        sceneRef.current.lastMouseY = e.clientY;

        sceneRef.current.camYaw -= deltaX * 0.004;
        sceneRef.current.camPitch = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, sceneRef.current.camPitch - deltaY * 0.004));
      }
    };

    const handleMouseUp = () => {
      sceneRef.current.isDragging = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Audio spatial beacon pulse ticker (every 600ms)
    const audioInterval = window.setInterval(() => {
      if (isMuted) return;
      const camX = sceneRef.current.camPos.x;
      const camZ = sceneRef.current.camPos.z;

      // Find nearest beacon and emit spatial pulse
      let closestBeacon = beacons[0];
      let minD = 999;
      beacons.forEach(b => {
        const d = Math.sqrt((b.x - camX) ** 2 + (b.z - camZ) ** 2);
        if (d < minD) {
          minD = d;
          closestBeacon = b;
        }
      });

      setNearestBeacon({ name: closestBeacon.name, dist: Math.round(minD * 10) / 10 });
      soundEngine.playSpatialBeaconPulse(closestBeacon.x, closestBeacon.z, camX, camZ, closestBeacon.freq);
    }, 650);

    // 6. Animation Loop
    let animId: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      const dt = Math.min(0.05, (time - lastTime) / 1000);
      lastTime = time;

      // Camera rotation application
      camera.rotation.set(0, 0, 0);
      camera.rotation.y = sceneRef.current.camYaw;
      camera.rotation.x = sceneRef.current.camPitch;

      // WASD navigation vector
      const speed = 7.5 * dt;
      const forward = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), sceneRef.current.camYaw);
      const right = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), sceneRef.current.camYaw);

      if (sceneRef.current.keys.w) sceneRef.current.camPos.addScaledVector(forward, speed);
      if (sceneRef.current.keys.s) sceneRef.current.camPos.addScaledVector(forward, -speed);
      if (sceneRef.current.keys.d) sceneRef.current.camPos.addScaledVector(right, speed);
      if (sceneRef.current.keys.a) sceneRef.current.camPos.addScaledVector(right, -speed);
      if (sceneRef.current.keys.e) sceneRef.current.camPos.y += speed;
      if (sceneRef.current.keys.q) sceneRef.current.camPos.y = Math.max(0.6, sceneRef.current.camPos.y - speed);

      // Boundary clamp
      sceneRef.current.camPos.x = Math.max(-40, Math.min(40, sceneRef.current.camPos.x));
      sceneRef.current.camPos.z = Math.max(-40, Math.min(40, sceneRef.current.camPos.z));

      camera.position.copy(sceneRef.current.camPos);

      // Animate beacons
      beacons.forEach((b, idx) => {
        b.mesh.rotation.y += 0.02 * (idx + 1);
        b.mesh.rotation.x = Math.sin(time * 0.002 + idx) * 0.2;
      });

      renderer.render(scene, camera);
      setCamCoords({
        x: Math.round(sceneRef.current.camPos.x * 10) / 10,
        y: Math.round(sceneRef.current.camPos.y * 10) / 10,
        z: Math.round(sceneRef.current.camPos.z * 10) / 10
      });

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    // Resize handler
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
      clearInterval(audioInterval);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      
      // Cleanup WebGL (Grimorio Cap 2.4)
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [fogDensity, isMuted]);

  const setCameraPreset = (preset: string) => {
    setActivePreset(preset);
    soundEngine.playClickSound();
    if (preset === 'MANDO') {
      sceneRef.current.camPos.set(0, 1.7, 8);
      sceneRef.current.camYaw = 0;
      sceneRef.current.camPitch = 0;
    } else if (preset === 'ALPHA') {
      sceneRef.current.camPos.set(-11, 2.2, -10);
      sceneRef.current.camYaw = Math.PI / 4;
      sceneRef.current.camPitch = -0.1;
    } else if (preset === 'BETA') {
      sceneRef.current.camPos.set(11, 2.2, -8);
      sceneRef.current.camYaw = -Math.PI / 4;
      sceneRef.current.camPitch = -0.1;
    } else if (preset === 'DIRECTOR') {
      sceneRef.current.camPos.set(0, 22, 28);
      sceneRef.current.camYaw = 0;
      sceneRef.current.camPitch = -Math.PI / 4.5;
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-[#050505]">
      {/* Top HUD Telemetry */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-4 pointer-events-none">
        <div className="flex items-center gap-4 bg-[#0a0f18]/85 backdrop-blur-md border border-[#00FFFF]/40 px-4 py-2 rounded-lg pointer-events-auto">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00FFFF]" />
            <span className="text-xs font-semibold text-slate-300 font-heading">STAGE.VOID</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="text-xs text-slate-400 font-mono-telemetry">
            <span>POS: </span>
            <span className="text-[#00FFFF]">X:{camCoords.x} Y:{camCoords.y} Z:{camCoords.z}</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="text-xs text-slate-400">
            <span>BALIZA CERCANA: </span>
            <span className="text-[#FDCC0D] font-bold">{nearestBeacon.name}</span>
            <span className="text-slate-500 ml-1">({nearestBeacon.dist}m)</span>
          </div>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="flex items-center gap-1 bg-[#0a0f18]/85 p-1 rounded-lg border border-[#32527B]/40">
            <button
              onClick={() => setCameraPreset('MANDO')}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                activePreset === 'MANDO' ? 'bg-[#00FFFF] text-black font-semibold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Mando
            </button>
            <button
              onClick={() => setCameraPreset('ALPHA')}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                activePreset === 'ALPHA' ? 'bg-[#FDCC0D] text-black font-semibold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Baliza Alpha
            </button>
            <button
              onClick={() => setCameraPreset('BETA')}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                activePreset === 'BETA' ? 'bg-[#00FFFF] text-black font-semibold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Baliza Beta
            </button>
            <button
              onClick={() => setCameraPreset('DIRECTOR')}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                activePreset === 'DIRECTOR' ? 'bg-[#B87333] text-white font-semibold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Cenital
            </button>
          </div>

          <button
            onClick={onOpenRemix}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#00FFFF] hover:bg-[#00d0d0] text-black font-semibold rounded-md shadow-md transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Remix en AI Studio</span>
          </button>
        </div>
      </div>

      {/* 3D Viewport Mount */}
      <div ref={mountRef} className="relative flex-1 w-full h-full min-h-[420px] cursor-grab active:cursor-grabbing select-none" />

      {/* Reticle & Navigation Help Overlay */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-4 h-4 border border-[#00FFFF]/40 rounded-full flex items-center justify-center">
          <div className="w-1 h-1 bg-[#00FFFF] rounded-full" />
        </div>
      </div>

      {/* Interactive Beacon Distance Radiometer */}
      <div className="absolute bottom-4 right-4 max-w-sm z-20 bg-[#0a0f18]/90 backdrop-blur-md border border-[#00FFFF]/30 p-3 rounded-lg text-xs pointer-events-auto">
        <div className="flex items-center justify-between text-[#00FFFF] font-bold mb-1">
          <div className="flex items-center gap-1.5">
            <Radio className="w-4 h-4" />
            <span>Audio Espacial Reactivo</span>
          </div>
          <span className="text-[11px] font-mono-telemetry text-slate-400">Web Audio API</span>
        </div>
        <p className="text-slate-300 leading-relaxed text-[11px]">
          Acércate con WASD o arrastra con el ratón. Las 3 balizas calculan paneo estéreo y atenuación acústica en tiempo real.
        </p>
        <div className="mt-2.5 grid grid-cols-3 gap-1.5 text-center text-[10px] font-mono-telemetry">
          <div className="bg-[#FDCC0D]/10 border border-[#FDCC0D]/30 p-1 rounded text-[#FDCC0D]">
            α Alpha 140Hz
          </div>
          <div className="bg-[#00FFFF]/10 border border-[#00FFFF]/30 p-1 rounded text-[#00FFFF]">
            β Beta 440Hz
          </div>
          <div className="bg-[#B87333]/10 border border-[#B87333]/30 p-1 rounded text-[#B87333]">
            γ Gamma 880Hz
          </div>
        </div>
      </div>

      {/* Bottom Bar Controls */}
      <div className="z-10 bg-[#0a0f18] border-t border-[#32527B]/30 px-6 py-3 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6">
          <span className="text-slate-400">
            Navegación: <span className="text-slate-200 font-mono-telemetry">WASD / Arrastrar ratón</span> (Q: Bajar, E: Subir)
          </span>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Niebla Holodeck:</span>
            <input
              type="range"
              min="0.01"
              max="0.08"
              step="0.005"
              value={fogDensity}
              onChange={(e) => setFogDensity(parseFloat(e.target.value))}
              className="w-24 accent-[#00FFFF]"
            />
          </div>
        </div>

        <div className="text-slate-400 text-[11px]">
          Módulo: <span className="font-mono-telemetry text-slate-200">modules/stage-module.js</span>
        </div>
      </div>
    </div>
  );
};
