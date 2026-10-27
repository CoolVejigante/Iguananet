/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Layer 2: The Glass HUD (Industrial UI, Navigation & Floating Telemetry)
 * Features the official IguanaNet Logo ("in." & Cyber Iguana mascot)
 * All SGX Guild mentions and HTML download button removed per user specification
 */

import React from 'react';
import {
  Terminal,
  Volume2,
  VolumeX,
  Eye,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { soundEngine } from '../services/sound-effects';
import logoCompact from '../assets/images/iguananetconcept-removebg-preview2.png';

interface IguanaGlassHUDProps {
  isMuted: boolean;
  onToggleMute: () => void;
  isStageMode: boolean;
  onToggleStageMode: () => void;
  onOpenGatekeeper: () => void;
}

export const IguanaGlassHUD: React.FC<IguanaGlassHUDProps> = ({
  isMuted,
  onToggleMute,
  isStageMode,
  onToggleStageMode,
  onOpenGatekeeper
}) => {
  const scrollTo = (id: string) => {
    soundEngine.playClickSound();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-30 pointer-events-none select-none">
      {/* Top Glass Navigation Bar */}
      <div className="mx-auto px-4 sm:px-6 py-3 max-w-7xl flex items-center justify-between gap-3">
        {/* Official IguanaNet Logo */}
        <div
          onClick={() => scrollTo('inspection-bay')}
          className="flex items-center gap-3 bg-[#162937]/90 hover:bg-[#1a3142] backdrop-blur-md border border-[#99EEFF]/30 px-3 py-1.5 clip-chamfer-45 pointer-events-auto shadow-lg transition-all cursor-pointer group"
          title="IguanaNet - Luis Casanova Portfolio"
        >
          <img
            src={logoCompact}
            alt="IguanaNet Logo"
            className="h-8 sm:h-9 w-auto object-contain filter drop-shadow-[0_0_10px_rgba(153,238,255,0.4)]"
          />
          <div className="hidden sm:flex flex-col border-l border-[#99EEFF]/20 pl-2.5">
            <span className="font-heading font-black text-white text-xs tracking-wider group-hover:text-[#99EEFF] transition-colors">
              LUIS CASANOVA
            </span>
            <span className="text-[10px] font-mono-telemetry text-slate-400">
              3D Artist & Visual Dev
            </span>
          </div>
        </div>

        {/* Section Navigation Tabs (Hidden in Stage Mode) */}
        {!isStageMode && (
          <nav className="hidden md:flex items-center gap-1 bg-[#162937]/90 backdrop-blur-md border border-[#99EEFF]/30 p-1 clip-chamfer-45 pointer-events-auto shadow-lg text-xs font-mono-telemetry">
            <button
              onClick={() => scrollTo('inspection-bay')}
              className="px-3 py-1.5 rounded hover:bg-[#244156] text-[#99EEFF] hover:text-white transition-colors flex items-center gap-1 font-bold"
            >
              <Eye className="w-3.5 h-3.5 text-[#F57E00]" />
              <span>[01 // INSPECTION BAY]</span>
            </button>
            <span className="text-slate-600">/</span>
            <button
              onClick={() => scrollTo('catalogo-produccion')}
              className="px-3 py-1.5 rounded hover:bg-[#244156] text-slate-300 hover:text-[#99EEFF] transition-colors"
            >
              [02 // CATÁLOGO 3D]
            </button>
            <span className="text-slate-600">/</span>
            <button
              onClick={() => scrollTo('identity-hub')}
              className="px-3 py-1.5 rounded hover:bg-[#244156] text-slate-300 hover:text-[#99EEFF] transition-colors"
            >
              [03 // MANIFIESTO & BIO]
            </button>
            <span className="text-slate-600">/</span>
            <button
              onClick={() => scrollTo('trajectory-matrix')}
              className="px-3 py-1.5 rounded hover:bg-[#244156] text-slate-300 hover:text-[#99EEFF] transition-colors"
            >
              [04 // ROADMAP]
            </button>
          </nav>
        )}

        {/* Tactical Controls (Download button removed per user specification) */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Re-open Gatekeeper Intro */}
          <button
            onClick={() => {
              soundEngine.playClickSound();
              onOpenGatekeeper();
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-[#162937]/90 hover:bg-[#244156] border border-[#99EEFF]/30 rounded text-xs font-mono-telemetry text-slate-200 transition-colors"
            title="Volver a la Terminal de Acceso"
          >
            <Terminal className="w-3.5 h-3.5 text-[#99EEFF]" />
            <span>Intro Gate</span>
          </button>

          {/* Audio Mute/Unmute */}
          <button
            onClick={() => {
              onToggleMute();
              soundEngine.playClickSound();
            }}
            className={`p-2 bg-[#162937]/90 hover:bg-[#244156] border border-[#99EEFF]/30 rounded transition-colors ${
              isMuted ? 'text-slate-500' : 'text-[#99EEFF]'
            }`}
            title={isMuted ? 'Reanudar Audio [M]' : 'Silenciar Audio [M]'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Stage Mode Toggle */}
          <button
            onClick={() => {
              soundEngine.playClickSound();
              onToggleStageMode();
            }}
            className={`p-2 bg-[#162937]/90 hover:bg-[#244156] border border-[#99EEFF]/30 rounded transition-colors ${
              isStageMode ? 'text-[#F57E00] border-[#F57E00]' : 'text-slate-300'
            }`}
            title={isStageMode ? 'Salir de Modo Escenario [F]' : 'Modo Escenario Completo [F]'}
          >
            {isStageMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
