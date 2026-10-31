/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Layer 3: The Gatekeeper (Interactive Cinematic Loader / Welcome Screen)
 * - Initial Language Selection Screen before loading the sequential animation
 * - Terminal Scanlines · Typewriter Manifesto · Neon Tactical Access
 * - All SGX Guild mentions removed per user instructions
 */

import React, { useState, useEffect } from 'react';
import { Terminal, Shield, Zap, ChevronRight, Globe, Check } from 'lucide-react';
import { soundEngine } from '../services/sound-effects';
import { useLanguage, Language, translationsMap } from '../context/LanguageContext';
import logoCompact from '../assets/images/iguananetconcept-removebg-preview2.png';

interface IguanaGatekeeperProps {
  onEnter: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const IguanaGatekeeper: React.FC<IguanaGatekeeperProps> = ({ onEnter, isMuted, onToggleMute }) => {
  const { language, setLanguage, t } = useLanguage();

  // Screen phase: 'LANGUAGE_SELECT' | 'BOOT_SEQUENCE'
  const [screenPhase, setScreenPhase] = useState<'LANGUAGE_SELECT' | 'BOOT_SEQUENCE'>('LANGUAGE_SELECT');
  const [typedText, setTypedText] = useState('');
  const [bootStep, setBootStep] = useState(0);
  const [isWarping, setIsWarping] = useState(false);

  const fullManifesto = t.gatekeeper.manifestoTypewriter;

  // Handler when user selects language before sequential animation starts
  const handleSelectLanguage = (selectedLang: Language) => {
    soundEngine.playPillarSwitchSound();
    setLanguage(selectedLang);
    setBootStep(0);
    setTypedText('');
    setScreenPhase('BOOT_SEQUENCE');
  };

  // Run sequential animation once BOOT_SEQUENCE phase begins
  useEffect(() => {
    if (screenPhase !== 'BOOT_SEQUENCE') return;

    setBootStep(0);
    const timer1 = setTimeout(() => setBootStep(1), 350);
    const timer2 = setTimeout(() => setBootStep(2), 750);
    const timer3 = setTimeout(() => setBootStep(3), 1150);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [screenPhase, language]);

  // Typewriter effect for the manifesto in the chosen language
  useEffect(() => {
    if (screenPhase !== 'BOOT_SEQUENCE' || bootStep < 3) return;

    let index = 0;
    setTypedText('');
    const targetText = t.gatekeeper.manifestoTypewriter;

    const interval = setInterval(() => {
      if (index <= targetText.length) {
        setTypedText(targetText.slice(0, index));
        if (index > 0 && index % 2 === 0) {
          soundEngine.playTypewriterKeySound();
        }
        index++;
      } else {
        clearInterval(interval);
      }
    }, 60);

    return () => clearInterval(interval);
  }, [screenPhase, bootStep, language, t.gatekeeper.manifestoTypewriter]);

  const handleAccess = () => {
    soundEngine.playGateAccessSound();
    setIsWarping(true);
    setTimeout(() => {
      onEnter();
    }, 850);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#091218] text-slate-100 overflow-hidden transition-all duration-700 ${
        isWarping ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Industrial CRT scanline effect */}
      <div className="absolute inset-0 pointer-events-none industrial-grid opacity-30" />
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="w-full h-24 bg-gradient-to-b from-transparent via-[#99EEFF]/10 to-transparent animate-crt-scan" />
      </div>

      {/* Radial vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_40%,rgba(9,18,24,0.92)_90%)]" />

      {/* Main Terminal Gate Container */}
      <div className="relative z-10 w-full max-w-3xl mx-4 p-6 sm:p-10 bg-[#162937]/95 backdrop-blur-xl border border-[#99EEFF]/30 clip-chamfer-45 shadow-[0_0_60px_rgba(36,65,86,0.8)] flex flex-col space-y-6">
        {/* Top Terminal Status Header */}
        <div className="flex flex-wrap items-center justify-between pb-4 border-b border-[#99EEFF]/20 text-xs gap-3">
          <div className="flex items-center gap-3">
            <img
              src={logoCompact}
              alt="IguanaNet Logo"
              className="h-8 sm:h-9 w-auto object-contain filter drop-shadow-[0_0_8px_rgba(153,238,255,0.4)]"
            />
            <span className="text-slate-500 hidden sm:inline">|</span>
            <span className="text-[#F57E00] font-mono-telemetry hidden sm:inline text-[11px]">
              IGUANA3D ARCHITECTURE
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono-telemetry text-[11px] text-slate-400">
            <span className="px-2 py-0.5 rounded bg-[#244156] border border-[#99EEFF]/30 text-[#99EEFF] hidden sm:inline">
              {t.gatekeeper.artistBadge}
            </span>
            <button
              onClick={onToggleMute}
              className="text-slate-400 hover:text-white transition-colors"
              title="Audio Toggle"
            >
              {isMuted ? t.gatekeeper.audioOff : t.gatekeeper.audioOn}
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* PHASE 1: PRE-BOOT LANGUAGE SELECTION SCREEN                     */}
        {/* ============================================================== */}
        {screenPhase === 'LANGUAGE_SELECT' ? (
          <div className="py-4 space-y-6 animate-fadeIn">
            {/* Terminal Title */}
            <div className="space-y-2 text-center">
              <div className="flex items-center justify-center gap-2 text-xs font-mono-telemetry text-[#F57E00] uppercase tracking-widest">
                <Globe className="w-4 h-4 text-[#F57E00]" />
                <span>{t.gatekeeper.langSelectHeader}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-wide">
                {t.gatekeeper.langSelectTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto font-sans leading-relaxed">
                {t.gatekeeper.langSelectSubtitle}
              </p>
            </div>

            {/* Language Selection Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Option 1: Español */}
              <button
                onClick={() => handleSelectLanguage('es')}
                className={`group relative p-5 bg-[#0e1b24]/90 hover:bg-[#162a39] border-2 ${
                  language === 'es' ? 'border-[#99EEFF] shadow-[0_0_25px_rgba(153,238,255,0.4)]' : 'border-[#99EEFF]/30'
                } hover:border-[#99EEFF] clip-chamfer-45 text-left transition-all duration-300 transform hover:-translate-y-0.5`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 bg-[#F57E00] clip-tag-chamfer" />
                      <span className="font-heading font-black text-lg text-white group-hover:text-[#99EEFF] transition-colors">
                        [ ES ] ESPAÑOL
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-sans">
                      {translationsMap.es.gatekeeper.spanishSubtitle}
                    </p>
                    <span className="inline-block text-[10px] font-mono-telemetry text-[#99EEFF] pt-1">
                      &gt; Cargar protocolo en español
                    </span>
                  </div>
                  {language === 'es' && (
                    <div className="w-6 h-6 rounded-full bg-[#99EEFF]/20 border border-[#99EEFF] flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-[#99EEFF]" />
                    </div>
                  )}
                </div>
              </button>

              {/* Option 2: English */}
              <button
                onClick={() => handleSelectLanguage('en')}
                className={`group relative p-5 bg-[#0e1b24]/90 hover:bg-[#162a39] border-2 ${
                  language === 'en' ? 'border-[#99EEFF] shadow-[0_0_25px_rgba(153,238,255,0.4)]' : 'border-[#99EEFF]/30'
                } hover:border-[#99EEFF] clip-chamfer-45 text-left transition-all duration-300 transform hover:-translate-y-0.5`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 bg-[#99EEFF] clip-tag-chamfer" />
                      <span className="font-heading font-black text-lg text-white group-hover:text-[#99EEFF] transition-colors">
                        [ EN ] ENGLISH
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-sans">
                      {translationsMap.en.gatekeeper.englishSubtitle}
                    </p>
                    <span className="inline-block text-[10px] font-mono-telemetry text-[#99EEFF] pt-1">
                      &gt; Load international English protocol
                    </span>
                  </div>
                  {language === 'en' && (
                    <div className="w-6 h-6 rounded-full bg-[#99EEFF]/20 border border-[#99EEFF] flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-[#99EEFF]" />
                    </div>
                  )}
                </div>
              </button>
            </div>

            <div className="pt-2 text-center">
              <span className="text-[11px] font-mono-telemetry text-slate-400">
                // Podrás alternar entre idiomas en cualquier momento desde la barra superior
              </span>
            </div>
          </div>
        ) : (
          /* ============================================================== */
          /* PHASE 2: SEQUENTIAL BOOT ANIMATION & MANIFESTO ACCESS           */
          /* ============================================================== */
          <>
            {/* Diagnostic Boot Logs */}
            <div className="bg-[#0e1b24]/90 border border-[#99EEFF]/20 p-4 font-mono-telemetry text-xs space-y-1.5 text-slate-300">
              <div className="flex items-center gap-2 text-slate-400">
                <span className="text-[#99EEFF]">&gt;</span>
                <span>{t.gatekeeper.bootSeq1}</span>
                <span className="text-emerald-400 text-[10px] ml-auto">[OK]</span>
              </div>

              {bootStep >= 1 && (
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="text-[#99EEFF]">&gt;</span>
                  <span>{t.gatekeeper.bootSeq2}</span>
                  <span className="text-emerald-400 text-[10px] ml-auto">[ACTIVE]</span>
                </div>
              )}

              {bootStep >= 2 && (
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="text-[#99EEFF]">&gt;</span>
                  <span>{t.gatekeeper.bootSeq3}</span>
                  <span className="text-[#F57E00] text-[10px] ml-auto">[CALIBRATED]</span>
                </div>
              )}

              {bootStep >= 3 && (
                <div className="flex items-center gap-2 text-[#99EEFF]">
                  <span className="text-[#F57E00]">&gt;</span>
                  <span>{t.gatekeeper.bootSeq4}</span>
                  <span className="text-emerald-400 text-[10px] ml-auto">[SYNCHRONIZED]</span>
                </div>
              )}
            </div>

            {/* Centerpiece Manifesto with Typewriter */}
            <div className="py-4 sm:py-6 flex flex-col items-center justify-center text-center space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-widest font-mono-telemetry text-[#F57E00]">
                  {t.gatekeeper.manifestoLabel}
                </span>
                <button
                  onClick={() => {
                    soundEngine.playClickSound();
                    setScreenPhase('LANGUAGE_SELECT');
                  }}
                  className="text-[10px] font-mono-telemetry text-slate-400 hover:text-[#99EEFF] underline transition-colors ml-2"
                >
                  [{language.toUpperCase()} · Cambiar / Change]
                </button>
              </div>

              <h1 className="text-2xl sm:text-4xl font-heading font-black tracking-wide text-white min-h-[52px] sm:min-h-[64px] flex items-center justify-center">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#99EEFF] to-[#F57E00]">
                  {typedText}
                </span>
                <span className="inline-block w-2 sm:w-3 h-6 sm:h-9 ml-1 bg-[#F57E00] animate-terminal-cursor" />
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed font-sans">
                {t.gatekeeper.manifestoSubtitle}
              </p>
            </div>

            {/* Tactical Access Button */}
            <div className="pt-2 flex flex-col items-center justify-center space-y-3">
              <button
                onClick={handleAccess}
                className={`group relative px-6 sm:px-10 py-3.5 sm:py-4 bg-gradient-to-r from-[#244156] via-[#162937] to-[#244156] hover:from-[#1b3243] hover:to-[#2e526d] text-[#99EEFF] border-2 border-[#99EEFF] clip-chamfer-45 font-heading font-bold text-sm sm:text-base tracking-widest shadow-[0_0_30px_rgba(153,238,255,0.4)] hover:shadow-[0_0_50px_rgba(153,238,255,0.7)] transition-all duration-300 transform active:scale-95 ${
                  isWarping ? 'animate-pulse' : ''
                }`}
              >
                <div className="absolute inset-0 bg-[#99EEFF]/10 opacity-0 group-hover:opacity-100 transition-opacity clip-chamfer-45" />
                <span className="relative z-10 flex items-center gap-3">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-[#F57E00] group-hover:rotate-12 transition-transform" />
                  <span>{t.gatekeeper.accessBtn}</span>
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#99EEFF] group-hover:translate-x-1 transition-transform" />
                </span>
              </button>

              <div className="flex items-center gap-4 text-[11px] font-mono-telemetry text-slate-400">
                <span className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-emerald-400" />
                  <span>{t.gatekeeper.zeroFriction}</span>
                </span>
                <span>·</span>
                <span className="text-[#99EEFF]">DRACO v1.5.6</span>
                <span>·</span>
                <span className="hidden sm:inline">{t.gatekeeper.stageHotkey}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
