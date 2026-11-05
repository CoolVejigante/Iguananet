/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Layer 2: The Glass HUD (Industrial UI, Navigation & Floating Telemetry)
 * Features the official IguanaNet Logo ("in." & Cyber Iguana mascot)
 * Includes persistent bilingual language switcher (ES / EN) in the top bar.
 */

import React from 'react';
import {
  Terminal,
  Volume2,
  VolumeX,
  Eye,
  Maximize2,
  Minimize2,
  Globe
} from 'lucide-react';
import { soundEngine } from '../services/sound-effects';
import { useLanguage } from '../context/LanguageContext';
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
  const { language, setLanguage, t } = useLanguage();

  const scrollTo = (id: string) => {
    soundEngine.playClickSound();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSetLang = (newLang: 'es' | 'en') => {
    if (language !== newLang) {
      soundEngine.playClickSound();
      setLanguage(newLang);
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
              {t.hud.roleSubtitle}
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
              <span>{t.hud.navInspectionBay}</span>
            </button>
            <span className="text-slate-600">/</span>
            <button
              onClick={() => scrollTo('catalogo-produccion')}
              className="px-3 py-1.5 rounded hover:bg-[#244156] text-slate-300 hover:text-[#99EEFF] transition-colors"
            >
              {t.hud.navCatalog}
            </button>
            <span className="text-slate-600">/</span>
            <button
              onClick={() => scrollTo('identity-hub')}
              className="px-3 py-1.5 rounded hover:bg-[#244156] text-slate-300 hover:text-[#99EEFF] transition-colors"
            >
              {t.hud.navManifesto}
            </button>
            <span className="text-slate-600">/</span>
            <button
              onClick={() => scrollTo('trajectory-matrix')}
              className="px-3 py-1.5 rounded hover:bg-[#244156] text-slate-300 hover:text-[#99EEFF] transition-colors"
            >
              {t.hud.navRoadmap}
            </button>
          </nav>
        )}

        {/* Tactical Controls & Top Bar Language Switcher */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Main Bar Bilingual Switcher: [ ES | EN ] */}
          <div
            className="flex items-center bg-[#162937]/95 hover:bg-[#1a3142] border border-[#99EEFF]/40 rounded p-1 shadow-md font-mono-telemetry text-xs transition-all"
            title={t.hud.langToggleTooltip}
          >
            <Globe className="w-3.5 h-3.5 text-[#99EEFF] mr-1 hidden sm:inline" />
            <button
              onClick={() => handleSetLang('es')}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                language === 'es'
                  ? 'bg-[#99EEFF] text-black shadow-[0_0_10px_rgba(153,238,255,0.6)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ES
            </button>
            <span className="text-slate-600 px-0.5">/</span>
            <button
              onClick={() => handleSetLang('en')}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                language === 'en'
                  ? 'bg-[#99EEFF] text-black shadow-[0_0_10px_rgba(153,238,255,0.6)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
          </div>

          {/* Re-open Gatekeeper Intro */}
          <button
            onClick={() => {
              soundEngine.playClickSound();
              onOpenGatekeeper();
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-[#162937]/90 hover:bg-[#244156] border border-[#99EEFF]/30 rounded text-xs font-mono-telemetry text-slate-200 transition-colors"
            title={t.hud.introGateTooltip}
          >
            <Terminal className="w-3.5 h-3.5 text-[#99EEFF]" />
            <span>{t.hud.introGate}</span>
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
            title={isMuted ? t.hud.audioTooltipOff : t.hud.audioTooltipOn}
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
            title={isStageMode ? t.hud.stageTooltipExit : t.hud.stageTooltipEnter}
          >
            {isStageMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
