/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Layer 0: The Void (Three.js / WebGL Interactive Background Canvas)
 * SGX Grimoire v2026.5 · Deep Charcoal Blue #244156 · Constellation Nodes · Industrial Grid
 */

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const IguanaVoidCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x244156);
    scene.fog = new THREE.FogExp2(0x162937, 0.025);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
    camera.position.set(0, 4, 18);
    camera.lookAt(0, 0, 0);

    // 2. High-performance WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: true,
      alpha: false
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    container.appendChild(renderer.domElement);

    // 3. Industrial Coordinate Grid Floor
    const gridHelper = new THREE.GridHelper(60, 40, 0x99eeff, 0x162937);
    gridHelper.position.y = -6;
    scene.add(gridHelper);

    // Second elevated grid ceiling
    const ceilingGrid = new THREE.GridHelper(60, 40, 0xf57e00, 0x162937);
    ceilingGrid.position.y = 14;
    scene.add(ceilingGrid);

    // 4. Floating Cyber Constellation (Instanced Geometry / Particles)
    const particleCount = 240;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const tealColor = new THREE.Color(0x99eeff);
    const tangerineColor = new THREE.Color(0xf57e00);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 50;
      positions[i3 + 1] = (Math.random() - 0.5) * 24;
      positions[i3 + 2] = (Math.random() - 0.5) * 40;

      const c = Math.random() > 0.35 ? tealColor : tangerineColor;
      colors[i3] = c.r;
      colors[i3 + 1] = c.g;
      colors[i3 + 2] = c.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Procedural glowing circular particle texture
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(0.3, 'rgba(153,238,255,0.8)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 32, 32);
    }
    const particleTexture = new THREE.CanvasTexture(canvas);
    particleTexture.colorSpace = THREE.SRGBColorSpace;

    const particleMat = new THREE.PointsMaterial({
      size: 0.65,
      map: particleTexture,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 5. Ambient and directional rim lighting
    const ambientLight = new THREE.AmbientLight(0x244156, 1.2);
    scene.add(ambientLight);

    const rimLight = new THREE.DirectionalLight(0x99eeff, 1.0);
    rimLight.position.set(10, 15, 10);
    scene.add(rimLight);

    const amberLight = new THREE.DirectionalLight(0xf57e00, 0.8);
    amberLight.position.set(-10, -5, -10);
    scene.add(amberLight);

    // Mouse parallax tracking
    let targetX = 0;
    let targetY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Scroll parallax tracking
    let scrollY = 0;
    const handleScroll = () => {
      scrollY = window.scrollY || document.documentElement.scrollTop;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 6. Animation loop with exponential damping (Zero GC)
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Gentle orbital drifts
      particles.rotation.y = elapsed * 0.04;
      particles.rotation.x = Math.sin(elapsed * 0.03) * 0.1;
      gridHelper.rotation.y = elapsed * 0.015;

      // Camera parallax damping
      camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX * 3, 2.5, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, 4 - targetY * 2 - scrollY * 0.003, 2.5, delta);
      camera.lookAt(0, -scrollY * 0.002, 0);

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);

    // Resize handling
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
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);

      particleGeo.dispose();
      particleMat.dispose();
      particleTexture.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
};
