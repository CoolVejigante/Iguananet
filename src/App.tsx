/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * IGUANANET | Luis Casanova
 * Interactive 3D Web Portfolio · 4-Layer Z-Index Architecture
 *
 * Layer 0: The Void (Three.js WebGL Interactive Canvas)
 * Layer 1: The DOM Matrix (2D/UX Scrollytelling, Elevator Pitch, Artworks & Trajectory)
 * Layer 2: The Glass HUD (Industrial UI, Navigation, Telemetry & Official IguanaNet Logo)
 * Layer 3: The Gatekeeper (Cinematic Intro Terminal, Typewriter Manifesto & Neon Tactical Access)
 */

import React, { useState, useEffect, useCallback } from 'react';
import { soundEngine } from './services/sound-effects';
import { LanguageProvider } from './context/LanguageContext';
import { IguanaVoidCanvas } from './components/IguanaVoidCanvas';
import { IguanaPortfolioMatrix } from './components/IguanaPortfolioMatrix';
import { IguanaGlassHUD } from './components/IguanaGlassHUD';
import { IguanaGatekeeper } from './components/IguanaGatekeeper';

function AppContent() {
  const [showGatekeeper, setShowGatekeeper] = useState<boolean>(true);
  const [isStageMode, setIsStageMode] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Toggle Mute
  const handleToggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      soundEngine.setMute(next);
      return next;
    });
  }, []);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      // Hotkey F: Stage Mode (Full screen immersion)
      if (e.code === 'KeyF') {
        e.preventDefault();
        setIsStageMode((prev) => !prev);
        soundEngine.playClickSound();
      }
      // Hotkey M: Mute
      else if (e.code === 'KeyM') {
        e.preventDefault();
        handleToggleMute();
      }
      // Hotkey Esc: Exit Stage mode
      else if (e.code === 'Escape') {
        if (isStageMode) setIsStageMode(false);
      }
      // Numeric Keys 1-3: Quick section jump
      else if (['1', '2', '3'].includes(e.key) && !e.ctrlKey && !e.metaKey) {
        soundEngine.playPillarSwitchSound();
        const targets = ['inspection-bay', 'catalogo-produccion', 'identity-hub', 'trajectory-matrix'];
        const targetId = targets[parseInt(e.key) - 1];
        if (targetId) {
          const el = document.getElementById(targetId);
          el?.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [handleToggleMute, isStageMode]);

  return (
    <div className="relative w-full min-h-screen bg-[#244156] text-slate-100 overflow-x-hidden select-none">
      {/* LAYER 0: The Void (Three.js WebGL Interactive Canvas) */}
      <IguanaVoidCanvas />

      {/* LAYER 2: The Glass HUD (Industrial UI & Floating Telemetry) */}
      <IguanaGlassHUD
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        isStageMode={isStageMode}
        onToggleStageMode={() => setIsStageMode(!isStageMode)}
        onOpenGatekeeper={() => setShowGatekeeper(true)}
      />

      {/* LAYER 1: The DOM Matrix (2D/UX Scrollytelling Container) */}
      <IguanaPortfolioMatrix />

      {/* LAYER 3: The Gatekeeper (Cinematic Intro Terminal, Language Selector & Manifesto) */}
      {showGatekeeper && (
        <IguanaGatekeeper
          onEnter={() => setShowGatekeeper(false)}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
