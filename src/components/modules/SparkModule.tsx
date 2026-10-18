/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * MÓDULO SGX.Spark: Los Interactores (The Arena - Geometry Dash Style Endless Runner)
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { RotateCcw, Sparkles, Zap, Trophy, Play, FastForward, Shield, ArrowUp } from 'lucide-react';
import { soundEngine } from '../../services/sound-effects';

interface SparkModuleProps {
  onOpenRemix: () => void;
  isMuted: boolean;
}

interface Obstacle {
  id: number;
  type: 'SPIKE' | 'DOUBLE_SPIKE' | 'BLOCK' | 'PLATFORM' | 'ORB' | 'PAD';
  x: number;
  y: number;
  w: number;
  h: number;
  color?: string;
  activated?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  rotation: number;
  vRot: number;
}

export const SparkModule: React.FC<SparkModuleProps> = ({ onOpenRemix, isMuted }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // High-level telemetry state
  const [attempt, setAttempt] = useState(1);
  const [distancePercent, setDistancePercent] = useState(0);
  const [bestDistance, setBestDistance] = useState(0);
  const [jumpsCount, setJumpsCount] = useState(0);
  const [speedMultiplier, setSpeedMultiplier] = useState<1 | 1.5 | 2>(1);
  const [gameState, setGameState] = useState<'PLAYING' | 'CRASHED'>('PLAYING');
  const [fps, setFps] = useState(60);

  // Game Engine State in ref to guarantee 60fps consistency without React re-render lag
  const game = useRef({
    state: 'PLAYING' as 'PLAYING' | 'CRASHED',
    attempt: 1,
    bestPercent: 0,
    speedMultiplier: 1,
    baseSpeed: 6.8,
    worldOffset: 0,
    levelLength: 12000, // Distance to reach 100%
    player: {
      x: 140,
      y: 0,
      size: 32,
      vy: 0,
      isGrounded: false,
      angle: 0,
      targetAngle: 0,
      trail: [] as { x: number; y: number; alpha: number; angle: number }[]
    },
    gravity: 0.88,
    jumpForce: -13.6,
    floorY: 0,
    obstacles: [] as Obstacle[],
    nextObstacleId: 1,
    particles: [] as Particle[],
    lastSpawnX: 400,
    jumpsCount: 0,
    frameCount: 0,
    lastFpsUpdate: performance.now()
  });

  // Sync speed multiplier to ref
  useEffect(() => {
    game.current.speedMultiplier = speedMultiplier;
  }, [speedMultiplier]);

  // Generate procedural track obstacles
  const generateTrack = useCallback((startY: number) => {
    const obstacles: Obstacle[] = [];
    let curX = 500;
    let id = 1;

    // Pattern segments generator
    while (curX < game.current.levelLength + 800) {
      const pattern = Math.floor(Math.random() * 6);
      const gap = 240 + Math.random() * 200;

      if (pattern === 0) {
        // Single Spike
        obstacles.push({
          id: id++,
          type: 'SPIKE',
          x: curX,
          y: startY - 30,
          w: 30,
          h: 30,
          color: '#00FFFF'
        });
        curX += 40;
      } else if (pattern === 1) {
        // Double Spike
        obstacles.push({
          id: id++,
          type: 'DOUBLE_SPIKE',
          x: curX,
          y: startY - 30,
          w: 60,
          h: 30,
          color: '#FDCC0D'
        });
        curX += 70;
      } else if (pattern === 2) {
        // Platform block with spike on top or after
        obstacles.push({
          id: id++,
          type: 'BLOCK',
          x: curX,
          y: startY - 50,
          w: 60,
          h: 50,
          color: '#32527B'
        });
        curX += 80;
        obstacles.push({
          id: id++,
          type: 'SPIKE',
          x: curX,
          y: startY - 30,
          w: 30,
          h: 30,
          color: '#00FFFF'
        });
        curX += 40;
      } else if (pattern === 3) {
        // Elevated Platform bridge
        obstacles.push({
          id: id++,
          type: 'PLATFORM',
          x: curX,
          y: startY - 60,
          w: 140,
          h: 22,
          color: '#4A7AB7'
        });
        // Jump Orb in the air
        obstacles.push({
          id: id++,
          type: 'ORB',
          x: curX + 220,
          y: startY - 95,
          w: 34,
          h: 34,
          color: '#FDCC0D'
        });
        // Spike beneath orb
        obstacles.push({
          id: id++,
          type: 'DOUBLE_SPIKE',
          x: curX + 210,
          y: startY - 30,
          w: 60,
          h: 30,
          color: '#00FFFF'
        });
        curX += 340;
      } else if (pattern === 4) {
        // Jump Pad launching cube high
        obstacles.push({
          id: id++,
          type: 'PAD',
          x: curX,
          y: startY - 14,
          w: 42,
          h: 14,
          color: '#FDCC0D'
        });
        // Tall wall after pad that requires pad jump
        obstacles.push({
          id: id++,
          type: 'BLOCK',
          x: curX + 160,
          y: startY - 120,
          w: 40,
          h: 120,
          color: '#32527B'
        });
        curX += 260;
      } else {
        // High Orb leap over triple spikes
        obstacles.push({
          id: id++,
          type: 'ORB',
          x: curX + 70,
          y: startY - 80,
          w: 34,
          h: 34,
          color: '#FDCC0D'
        });
        obstacles.push({
          id: id++,
          type: 'SPIKE',
          x: curX + 40,
          y: startY - 30,
          w: 30,
          h: 30,
          color: '#00FFFF'
        });
        obstacles.push({
          id: id++,
          type: 'SPIKE',
          x: curX + 70,
          y: startY - 30,
          w: 30,
          h: 30,
          color: '#00FFFF'
        });
        curX += 140;
      }

      curX += gap;
    }

    return obstacles;
  }, []);

  // Jump trigger action
  const handleJump = useCallback(() => {
    const p = game.current.player;
    if (game.current.state === 'CRASHED') {
      // Restart on tap if crashed
      restartGame();
      return;
    }

    // 1. Check if near an active jump orb
    let hitOrb = false;
    const currentX = p.x + game.current.worldOffset;
    const py = p.y;
    for (const obs of game.current.obstacles) {
      if (obs.type === 'ORB' && !obs.activated) {
        const dx = currentX - (obs.x + obs.w / 2);
        const dy = py - (obs.y + obs.h / 2);
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 56) {
          // Trigger Orb mid-air leap!
          obs.activated = true;
          p.vy = game.current.jumpForce * 1.05;
          p.isGrounded = false;
          hitOrb = true;
          soundEngine.playArcadeRingSound();

          // Burst particles around orb
          for (let i = 0; i < 14; i++) {
            const ang = Math.random() * Math.PI * 2;
            const spd = 2 + Math.random() * 4;
            game.current.particles.push({
              x: obs.x - game.current.worldOffset + obs.w / 2,
              y: obs.y + obs.h / 2,
              vx: Math.cos(ang) * spd,
              vy: Math.sin(ang) * spd,
              size: 3 + Math.random() * 3,
              color: '#FDCC0D',
              alpha: 1.0,
              rotation: 0,
              vRot: 0.1
            });
          }
          break;
        }
      }
    }

    // 2. Normal Ground jump
    if (!hitOrb && p.isGrounded) {
      p.vy = game.current.jumpForce;
      p.isGrounded = false;
      soundEngine.playArcadeJumpSound();
      game.current.jumpsCount++;
      setJumpsCount(game.current.jumpsCount);

      // Dust particles under cube
      for (let i = 0; i < 6; i++) {
        game.current.particles.push({
          x: p.x - 10 + Math.random() * 20,
          y: p.y + p.size / 2,
          vx: (Math.random() - 0.5) * 3 - 2,
          vy: -Math.random() * 2,
          size: 2 + Math.random() * 3,
          color: '#FDCC0D',
          alpha: 0.8,
          rotation: 0,
          vRot: 0
        });
      }
    }
  }, []);

  // Crash and Shatter sequence
  const crashPlayer = useCallback(() => {
    if (game.current.state === 'CRASHED') return;
    game.current.state = 'CRASHED';
    setGameState('CRASHED');
    soundEngine.playArcadeCrashSound();

    const p = game.current.player;

    // Shatter cube into 24 golden & cyan cyber shards
    for (let i = 0; i < 24; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2.5 + Math.random() * 7;
      game.current.particles.push({
        x: p.x,
        y: p.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        size: 3 + Math.random() * 5,
        color: i % 2 === 0 ? '#FDCC0D' : '#00FFFF',
        alpha: 1.0,
        rotation: Math.random() * Math.PI,
        vRot: (Math.random() - 0.5) * 0.3
      });
    }

    // Auto quick-restart after 0.55s
    setTimeout(() => {
      restartGame();
    }, 550);
  }, []);

  // Restart level
  const restartGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    game.current.state = 'PLAYING';
    setGameState('PLAYING');
    game.current.attempt++;
    setAttempt(game.current.attempt);

    game.current.worldOffset = 0;
    const floorY = canvas.height - 75;
    game.current.player.y = floorY - game.current.player.size / 2;
    game.current.player.vy = 0;
    game.current.player.angle = 0;
    game.current.player.isGrounded = true;
    game.current.player.trail = [];
    game.current.particles = [];

    // Regenerate track
    game.current.obstacles = generateTrack(floorY);
    setDistancePercent(0);
  }, [generateTrack]);

  // Main Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      if (!canvas || !canvas.parentElement) return;
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;

      const floorY = canvas.height - 75;
      game.current.floorY = floorY;
      game.current.player.y = floorY - game.current.player.size / 2;
      game.current.obstacles = generateTrack(floorY);
    };

    resize();
    window.addEventListener('resize', resize);

    // Prevent default keyboard scrolling on arrows & space
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['Space', 'ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        handleJump();
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });

    // Game loop @ 60 FPS
    const loop = (time: number) => {
      // FPS Calculation
      game.current.frameCount++;
      if (time - game.current.lastFpsUpdate >= 1000) {
        setFps(game.current.frameCount);
        game.current.frameCount = 0;
        game.current.lastFpsUpdate = time;
      }

      const w = canvas.width;
      const h = canvas.height;
      const floorY = game.current.floorY;
      const p = game.current.player;
      const speed = game.current.baseSpeed * game.current.speedMultiplier;

      // 1. UPDATE GAME STATE
      if (game.current.state === 'PLAYING') {
        // Advance world
        game.current.worldOffset += speed;

        // Progress percentage calculation
        const percent = Math.min(100, Math.floor((game.current.worldOffset / game.current.levelLength) * 100));
        setDistancePercent(percent);
        if (percent > game.current.bestPercent) {
          game.current.bestPercent = percent;
          setBestDistance(percent);
        }

        // Win check loop
        if (game.current.worldOffset >= game.current.levelLength) {
          // Completed level! Reset with confetti
          game.current.worldOffset = 0;
        }

        // Apply Gravity
        p.vy += game.current.gravity;
        p.y += p.vy;

        // Mid-air Rotation (Geometry Dash cube rotation effect)
        if (!p.isGrounded) {
          p.angle += 0.14 * game.current.speedMultiplier;
        } else {
          // Snap flush to the nearest 90 degrees (Math.PI / 2)
          const targetSnap = Math.round(p.angle / (Math.PI / 2)) * (Math.PI / 2);
          p.angle += (targetSnap - p.angle) * 0.35;
        }

        // Ground Collision
        const half = p.size / 2;
        if (p.y + half >= floorY) {
          p.y = floorY - half;
          p.vy = 0;
          p.isGrounded = true;
        } else {
          p.isGrounded = false;
        }

        // Obstacles & Platform Collision Check
        const currentWorldX = p.x + game.current.worldOffset;
        const playerLeft = currentWorldX - half;
        const playerRight = currentWorldX + half;
        const playerTop = p.y - half;
        const playerBottom = p.y + half;

        for (const obs of game.current.obstacles) {
          // Skip if far ahead or behind screen
          if (obs.x > currentWorldX + w || obs.x + obs.w < currentWorldX - 100) continue;

          // Check Jump Pad trigger
          if (obs.type === 'PAD') {
            if (
              playerRight > obs.x &&
              playerLeft < obs.x + obs.w &&
              playerBottom >= obs.y &&
              playerBottom <= obs.y + obs.h + 12
            ) {
              p.vy = game.current.jumpForce * 1.35; // Launch cube into air!
              p.isGrounded = false;
              soundEngine.playArcadeRingSound();
              continue;
            }
          }

          // Check Platform / Block collision
          if (obs.type === 'BLOCK' || obs.type === 'PLATFORM') {
            // Horizontal overlap
            const overlapX = playerRight > obs.x + 6 && playerLeft < obs.x + obs.w - 6;
            // Land on top (vertical down landing)
            if (overlapX && playerBottom >= obs.y && playerBottom <= obs.y + 16 && p.vy >= 0) {
              p.y = obs.y - half;
              p.vy = 0;
              p.isGrounded = true;
            } else if (
              playerRight > obs.x + 4 &&
              playerLeft < obs.x + obs.w - 4 &&
              playerBottom > obs.y + 8 &&
              playerTop < obs.y + obs.h - 4
            ) {
              // Frontal or inner crash into block side
              crashPlayer();
              break;
            }
          }

          // Check Spike Collision (Triangle geometry hit test)
          if (obs.type === 'SPIKE' || obs.type === 'DOUBLE_SPIKE') {
            if (
              playerRight > obs.x + 6 &&
              playerLeft < obs.x + obs.w - 6 &&
              playerBottom > obs.y + 6 &&
              playerTop < obs.y + obs.h
            ) {
              crashPlayer();
              break;
            }
          }
        }

        // Add to kinetic motion trail
        p.trail.push({ x: p.x, y: p.y, alpha: 0.8, angle: p.angle });
        if (p.trail.length > 12) p.trail.shift();
      }

      // Update Particles
      for (let i = game.current.particles.length - 1; i >= 0; i--) {
        const pt = game.current.particles[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.vy += 0.2; // particle gravity
        pt.rotation += pt.vRot;
        pt.alpha -= 0.035;
        if (pt.alpha <= 0) game.current.particles.splice(i, 1);
      }

      // 2. RENDER PASS
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, w, h);

      // Parallax Background Grid
      const bgStep = 40;
      const bgOffset = (game.current.worldOffset * 0.3) % bgStep;
      ctx.strokeStyle = 'rgba(50, 82, 123, 0.15)';
      ctx.lineWidth = 1;

      for (let bx = -bgOffset; bx < w; bx += bgStep) {
        ctx.beginPath();
        ctx.moveTo(bx, 0);
        ctx.lineTo(bx, floorY);
        ctx.stroke();
      }
      for (let by = 0; by < floorY; by += bgStep) {
        ctx.beginPath();
        ctx.moveTo(0, by);
        ctx.lineTo(w, by);
        ctx.stroke();
      }

      // Glowing Hazard Floor Line
      ctx.strokeStyle = '#00FFFF';
      ctx.lineWidth = 3;
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#00FFFF';
      ctx.beginPath();
      ctx.moveTo(0, floorY);
      ctx.lineTo(w, floorY);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Solid Cyber Floor under baseline
      ctx.fillStyle = '#0a0f18';
      ctx.fillRect(0, floorY, w, h - floorY);

      // Floor decorative chevron tiles
      const floorTileStep = 24;
      const floorTileOffset = game.current.worldOffset % floorTileStep;
      ctx.strokeStyle = 'rgba(253, 204, 13, 0.25)';
      ctx.lineWidth = 1;
      for (let fx = -floorTileOffset; fx < w; fx += floorTileStep) {
        ctx.beginPath();
        ctx.moveTo(fx, floorY);
        ctx.lineTo(fx + 12, h);
        ctx.stroke();
      }

      // RENDER OBSTACLES (Shifted by worldOffset)
      game.current.obstacles.forEach((obs) => {
        const screenX = obs.x - game.current.worldOffset;
        if (screenX + obs.w < -20 || screenX > w + 20) return;

        if (obs.type === 'SPIKE') {
          // Sharp Cyber Triangle Spike
          ctx.save();
          ctx.shadowBlur = 10;
          ctx.shadowColor = obs.color || '#00FFFF';
          ctx.fillStyle = obs.color || '#00FFFF';
          ctx.beginPath();
          ctx.moveTo(screenX, obs.y + obs.h);
          ctx.lineTo(screenX + obs.w / 2, obs.y);
          ctx.lineTo(screenX + obs.w, obs.y + obs.h);
          ctx.closePath();
          ctx.fill();

          // Inner dark core
          ctx.fillStyle = '#050505';
          ctx.beginPath();
          ctx.moveTo(screenX + 5, obs.y + obs.h - 2);
          ctx.lineTo(screenX + obs.w / 2, obs.y + 8);
          ctx.lineTo(screenX + obs.w - 5, obs.y + obs.h - 2);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        } else if (obs.type === 'DOUBLE_SPIKE') {
          // Pair of Spikes
          for (let s = 0; s < 2; s++) {
            const sx = screenX + s * 30;
            ctx.save();
            ctx.shadowBlur = 10;
            ctx.shadowColor = obs.color || '#FDCC0D';
            ctx.fillStyle = obs.color || '#FDCC0D';
            ctx.beginPath();
            ctx.moveTo(sx, obs.y + obs.h);
            ctx.lineTo(sx + 15, obs.y);
            ctx.lineTo(sx + 30, obs.y + obs.h);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = '#050505';
            ctx.beginPath();
            ctx.moveTo(sx + 5, obs.y + obs.h - 2);
            ctx.lineTo(sx + 15, obs.y + 8);
            ctx.lineTo(sx + 25, obs.y + obs.h - 2);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
          }
        } else if (obs.type === 'BLOCK' || obs.type === 'PLATFORM') {
          // Cyber Platform Block with chamfer border
          ctx.save();
          ctx.fillStyle = '#111a29';
          ctx.fillRect(screenX, obs.y, obs.w, obs.h);

          ctx.strokeStyle = obs.color || '#32527B';
          ctx.lineWidth = 2;
          ctx.strokeRect(screenX, obs.y, obs.w, obs.h);

          // Grid line pattern on block face
          ctx.strokeStyle = 'rgba(0, 255, 255, 0.2)';
          ctx.strokeRect(screenX + 4, obs.y + 4, obs.w - 8, obs.h - 8);
          ctx.restore();
        } else if (obs.type === 'ORB') {
          // Glowing Jump Ring Orb
          ctx.save();
          ctx.shadowBlur = 14;
          ctx.shadowColor = '#FDCC0D';
          ctx.strokeStyle = '#FDCC0D';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(screenX + obs.w / 2, obs.y + obs.h / 2, obs.w / 2, 0, Math.PI * 2);
          ctx.stroke();

          // Pulsing inner center
          ctx.fillStyle = obs.activated ? '#4A7AB7' : '#FFFFFF';
          ctx.beginPath();
          ctx.arc(screenX + obs.w / 2, obs.y + obs.h / 2, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else if (obs.type === 'PAD') {
          // Jump Pad Launch arrow
          ctx.save();
          ctx.fillStyle = '#FDCC0D';
          ctx.fillRect(screenX, obs.y, obs.w, obs.h);

          // Arrow pointing up
          ctx.fillStyle = '#050505';
          ctx.beginPath();
          ctx.moveTo(screenX + obs.w / 2, obs.y + 2);
          ctx.lineTo(screenX + obs.w - 8, obs.y + obs.h - 2);
          ctx.lineTo(screenX + 8, obs.y + obs.h - 2);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
      });

      // RENDER PARTICLES
      game.current.particles.forEach((pt) => {
        ctx.save();
        ctx.translate(pt.x, pt.y);
        ctx.rotate(pt.rotation);
        ctx.fillStyle = pt.color;
        ctx.globalAlpha = Math.max(0, pt.alpha);
        ctx.fillRect(-pt.size / 2, -pt.size / 2, pt.size, pt.size);
        ctx.restore();
      });

      // RENDER PLAYER (If not crashed)
      if (game.current.state === 'PLAYING') {
        // Kinetic Trail behind cube
        p.trail.forEach((t, idx) => {
          const factor = idx / p.trail.length;
          ctx.save();
          ctx.translate(t.x, t.y);
          ctx.rotate(t.angle);
          ctx.fillStyle = `rgba(253, 204, 13, ${factor * 0.28})`;
          const trailSize = p.size * (0.4 + factor * 0.6);
          ctx.fillRect(-trailSize / 2, -trailSize / 2, trailSize, trailSize);
          ctx.restore();
        });

        // The Cyber Runner Cube (Geometry Dash style)
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);

        ctx.shadowBlur = 18;
        ctx.shadowColor = '#FDCC0D';

        // Outer Yellow Cube
        ctx.fillStyle = '#FDCC0D';
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);

        // Dark Outline
        ctx.strokeStyle = '#050505';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(-p.size / 2, -p.size / 2, p.size, p.size);

        // Inner Cyber Face / Eye Reactor
        ctx.fillStyle = '#050505';
        ctx.fillRect(-p.size / 4, -p.size / 4, p.size / 2, p.size / 2);

        ctx.fillStyle = '#00FFFF';
        ctx.fillRect(-p.size / 8, -p.size / 8, p.size / 4, p.size / 4);

        ctx.restore();
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [crashPlayer, generateTrack, handleJump, restartGame]);

  return (
    <div
      className="relative w-full h-full flex flex-col overflow-hidden bg-[#050505]"
      style={{ touchAction: 'none', overscrollBehavior: 'none', userSelect: 'none' }}
    >
      {/* Top HUD Telemetry Header */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="flex items-center gap-3 bg-[#0a0f18]/90 backdrop-blur-md border border-[#32527B]/40 px-3.5 py-2 rounded-lg pointer-events-auto shadow-lg max-w-full overflow-x-auto">
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#FDCC0D]" />
            <span className="text-xs font-bold text-slate-200 font-heading whitespace-nowrap">
              SPARK.RUNNER
            </span>
          </div>
          <span className="text-slate-600 shrink-0">·</span>
          <div className="text-xs text-slate-400 font-mono-telemetry shrink-0 whitespace-nowrap">
            <span>INTENTO: </span>
            <span className="font-bold text-[#FDCC0D]">{attempt}</span>
          </div>
          <span className="text-slate-600 shrink-0">·</span>
          <div className="text-xs text-slate-400 font-mono-telemetry shrink-0 whitespace-nowrap">
            <span>PROGRESO: </span>
            <span className="font-bold text-[#00FFFF] text-sm">{distancePercent}%</span>
          </div>
          <span className="text-slate-600 shrink-0">·</span>
          <div className="text-xs text-slate-400 font-mono-telemetry shrink-0 flex items-center gap-1 whitespace-nowrap">
            <Trophy className="w-3.5 h-3.5 text-[#FDCC0D]" />
            <span>RÉCORD: </span>
            <span className="text-emerald-400 font-bold">{bestDistance}%</span>
          </div>
          <span className="text-slate-600 shrink-0">·</span>
          <div className="text-xs text-slate-500 font-mono-telemetry shrink-0">
            <span>FPS: {fps}</span>
          </div>
        </div>

        {/* Speed Selector & Action Buttons */}
        <div className="flex items-center gap-2 pointer-events-auto shrink-0">
          <div className="flex items-center gap-1 bg-[#0a0f18]/90 p-1 rounded-lg border border-[#32527B]/40 text-xs">
            {([1, 1.5, 2] as const).map((spd) => (
              <button
                key={spd}
                onClick={() => {
                  soundEngine.playClickSound();
                  setSpeedMultiplier(spd);
                }}
                className={`px-2 py-1 rounded font-mono-telemetry transition-colors ${
                  speedMultiplier === spd
                    ? 'bg-[#FDCC0D] text-black font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          <button
            onClick={restartGame}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#111a29]/90 hover:bg-[#1a283e] text-slate-200 border border-[#32527B]/50 rounded-md transition-colors whitespace-nowrap"
            title="Reiniciar intento"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#FDCC0D]" />
            <span>Reiniciar</span>
          </button>

          <button
            onClick={onOpenRemix}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#FDCC0D] hover:bg-[#e5b800] text-black font-semibold rounded-md shadow-md transition-colors whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Remix en AI Studio</span>
          </button>
        </div>
      </div>

      {/* Main Runner Canvas (Click or Tap to Jump) */}
      <div
        className="relative flex-1 w-full h-full min-h-[420px] cursor-pointer"
        onPointerDown={(e) => {
          e.preventDefault();
          handleJump();
        }}
        style={{ touchAction: 'none' }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block"
          style={{ touchAction: 'none' }}
        />

        {/* Level Progress Bar along top */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-900 z-10">
          <div
            className="h-full bg-gradient-to-r from-[#FDCC0D] via-[#00FFFF] to-emerald-400 transition-all duration-75"
            style={{ width: `${distancePercent}%` }}
          />
        </div>

        {/* Crash Message Notification */}
        {gameState === 'CRASHED' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs pointer-events-none">
            <div className="bg-[#0a0f18]/95 border border-rose-500/60 p-4 rounded-xl text-center shadow-2xl animate-pulse">
              <span className="text-rose-400 font-bold font-heading text-lg block mb-1">
                ¡IMPACTO CRÍTICO!
              </span>
              <span className="text-xs text-slate-300 font-mono-telemetry">
                Reiniciando en 0.5s · Pulsa Espacio o Toca para reintentar
              </span>
            </div>
          </div>
        )}

        {/* Tap to Jump Helper Badge */}
        <div className="absolute bottom-4 left-4 z-20 bg-[#0a0f18]/85 backdrop-blur-md border border-[#32527B]/40 px-3 py-2 rounded-lg text-xs pointer-events-none flex items-center gap-2 max-w-sm">
          <div className="w-6 h-6 rounded bg-[#FDCC0D]/20 border border-[#FDCC0D] flex items-center justify-center text-[#FDCC0D] font-bold shrink-0">
            <ArrowUp className="w-3.5 h-3.5" />
          </div>
          <span className="text-slate-300 text-[11px] leading-snug">
            Presiona <strong>Espacio</strong>, <strong>Flecha Arriba</strong> o <strong>Toca la pantalla</strong> para saltar obstáculos y activar orbes en el aire.
          </span>
        </div>
      </div>

      {/* Bottom Bar Drawer */}
      <div className="z-10 bg-[#0a0f18] border-t border-[#32527B]/30 px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
        <div className="flex items-center gap-4 text-slate-400">
          <span>Modo: <strong className="text-slate-200">Side-Runner Geométrico</strong></span>
          <span className="text-slate-600">·</span>
          <span>Saltos: <span className="text-[#00FFFF] font-mono-telemetry font-bold">{jumpsCount}</span></span>
        </div>

        <div className="text-slate-400 text-[11px] truncate">
          Módulo: <span className="font-mono-telemetry text-slate-200">modules/spark-module.js</span>
        </div>
      </div>
    </div>
  );
};
