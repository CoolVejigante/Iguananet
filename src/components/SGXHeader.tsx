/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * SGX Top Bar Contract (Strict 3-Zone Architecture)
 */

import React from 'react';
import { PillarId, PILLARS } from '../config/sgx-config';
import { Volume2, VolumeX, Sparkles, BookOpen, Download, Terminal, Maximize2, Compass } from 'lucide-react';
import { soundEngine } from '../services/sound-effects';

interface SGXHeaderProps {
  activePillar: PillarId;
  onSelectPillar: (pillar: PillarId) => void;
  onOpenRemixLab: () => void;
  onOpenGrimoire: () => void;
  onOpenExport: () => void;
  onOpenScopeModal: () => void;
  onToggleStageMode: () => void;
  isStageMode: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const SGXHeader: React.FC<SGXHeaderProps> = ({
  activePillar,
  onSelectPillar,
  onOpenRemixLab,
  onOpenGrimoire,
  onOpenExport,
  onOpenScopeModal,
  onToggleStageMode,
  isStageMode,
  isMuted,
  onToggleMute
}) => {
  if (isStageMode) {
    // Stage mode (Grimorio Cap XVI: Hotkey F - Minimalist Floating Restorer)
    return (
      <div className="fixed top-3 right-4 z-50">
        <button
          onClick={onToggleStageMode}
          className="px-3 py-1.5 text-xs bg-[#0a0f18]/90 text-slate-300 hover:text-white border border-[#32527B]/60 rounded-md backdrop-blur-md shadow-xl transition-all"
        >
          Salir de Modo Escenario (F)
        </button>
      </div>
    );
  }

  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3.5 bg-[#070b12]/95 border-b border-[#32527B]/40 backdrop-blur-md z-40 shrink-0">
      {/* Zone 1: Single text element wordmark in display face (Orbitron) */}
      <div className="flex items-center gap-3 shrink-0">
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            soundEngine.playClickSound();
          }}
          className="text-lg font-black tracking-widest text-white font-heading hover:text-[#FDCC0D] transition-colors whitespace-nowrap"
        >
          SGX OMNI-CANVAS
        </a>
        <span className="hidden sm:inline-block text-[11px] font-mono-telemetry text-slate-400">
          v2026.5
        </span>
      </div>

      {/* Zone 2: 4-5 concise single-line text navigation links */}
      <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-slate-400">
        {/* Pillar Switcher dropdown / links */}
        <div className="flex items-center gap-1.5 p-1 bg-[#0d1422] rounded-lg border border-[#32527B]/40">
          {(Object.keys(PILLARS) as PillarId[]).map((pId) => {
            const p = PILLARS[pId];
            const isSelected = activePillar === pId;
            return (
              <button
                key={pId}
                onClick={() => {
                  soundEngine.playPillarSwitchSound();
                  onSelectPillar(pId);
                }}
                className={`px-2.5 py-1 text-xs rounded transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#32527B] text-[#FDCC0D] font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title={p.tagline}
              >
                {p.name.replace('SGX.', '')}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => {
            soundEngine.playClickSound();
            onOpenScopeModal();
          }}
          className="hover:text-[#FDCC0D] transition-colors whitespace-nowrap flex items-center gap-1 text-slate-300"
          title="Ver alcance y especificaciones para Gemini"
        >
          <Compass className="w-3.5 h-3.5 text-[#FDCC0D]" />
          <span>Alcance & IA</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playClickSound();
            onOpenRemixLab();
          }}
          className="hover:text-[#00FFFF] transition-colors whitespace-nowrap flex items-center gap-1 text-slate-300"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#00FFFF]" />
          <span>El Arte del Remix</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playClickSound();
            onOpenGrimoire();
          }}
          className="hover:text-slate-200 transition-colors whitespace-nowrap flex items-center gap-1 text-slate-300"
        >
          <BookOpen className="w-3.5 h-3.5 text-slate-400" />
          <span>Grimorio SGX</span>
        </button>

        <button
          onClick={() => {
            soundEngine.playClickSound();
            onOpenExport();
          }}
          className="hover:text-slate-200 transition-colors whitespace-nowrap flex items-center gap-1 text-slate-400"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Exportar Baseline</span>
        </button>
      </nav>

      {/* Zone 3: 1 primary action button + audio toggle */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onToggleMute}
          className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          title={isMuted ? 'Activar Sonido (M)' : 'Silenciar Sonido (M)'}
          aria-label={isMuted ? 'Activar Sonido' : 'Silenciar Sonido'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-[#FDCC0D]" />}
        </button>

        <button
          onClick={onToggleStageMode}
          className="hidden sm:flex p-1.5 rounded text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          title="Modo Escenario Inmersivo (Tecla F)"
          aria-label="Modo Escenario"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            soundEngine.playPulseSound();
            onOpenRemixLab();
          }}
          className="px-4 py-2 text-xs font-semibold text-black bg-[#FDCC0D] hover:bg-[#e5b800] rounded-lg transition-colors whitespace-nowrap shadow-md font-heading"
        >
          Remix en AI Studio
        </button>
      </div>
    </header>
  );
};
