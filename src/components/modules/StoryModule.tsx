/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * MÓDULO SGX.Story: Los Loremasters (The Scroll)
 */

import React, { useState, useRef, useEffect } from 'react';
import { BookOpen, Sparkles, Volume2, VolumeX, Compass, ChevronDown, Feather, Zap } from 'lucide-react';
import { soundEngine } from '../../services/sound-effects';

interface StoryModuleProps {
  onOpenRemix: () => void;
  isMuted: boolean;
}

export const StoryModule: React.FC<StoryModuleProps> = ({ onOpenRemix, isMuted }) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeChapter, setActiveChapter] = useState(1);
  const [ambientAudioOn, setAmbientAudioOn] = useState(false);

  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const maxScroll = el.scrollHeight - el.clientHeight;
    if (maxScroll <= 0) return;
    const progress = Math.min(1, Math.max(0, el.scrollTop / maxScroll));
    setScrollProgress(progress);

    if (progress < 0.33) {
      setActiveChapter(1);
    } else if (progress < 0.66) {
      setActiveChapter(2);
    } else {
      setActiveChapter(3);
    }
  };

  const toggleAmbient = () => {
    const next = !ambientAudioOn;
    setAmbientAudioOn(next);
    soundEngine.playClickSound();
  };

  const jumpToChapter = (chapterNum: number) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    soundEngine.playClickSound();
    const target = (el.scrollHeight - el.clientHeight) * ((chapterNum - 1) / 2);
    el.scrollTo({ top: target, behavior: 'smooth' });
  };

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-[#050505]">
      {/* Top HUD Telemetry */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-4 pointer-events-none">
        <div className="flex items-center gap-4 bg-[#0a0f18]/85 backdrop-blur-md border border-[#B87333]/40 px-4 py-2 rounded-lg pointer-events-auto">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#B87333]" />
            <span className="text-xs font-semibold text-slate-300 font-heading">STORY.SCROLL</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="text-xs text-slate-400">
            <span>CAPÍTULO: </span>
            <span className="font-mono-telemetry font-bold text-[#FDCC0D]">0{activeChapter} / 03</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="text-xs text-slate-400 font-mono-telemetry">
            <span>PROGRESO: </span>
            <span className="text-[#00FFFF] font-bold">{Math.round(scrollProgress * 100)}%</span>
          </div>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="flex items-center gap-1 bg-[#0a0f18]/85 p-1 rounded-lg border border-[#32527B]/40">
            <button
              onClick={() => jumpToChapter(1)}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                activeChapter === 1 ? 'bg-[#B87333] text-white font-semibold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Cap 01
            </button>
            <button
              onClick={() => jumpToChapter(2)}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                activeChapter === 2 ? 'bg-[#B87333] text-white font-semibold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Cap 02
            </button>
            <button
              onClick={() => jumpToChapter(3)}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                activeChapter === 3 ? 'bg-[#B87333] text-white font-semibold' : 'text-slate-300 hover:text-white'
              }`}
            >
              Cap 03
            </button>
          </div>

          <button
            onClick={onOpenRemix}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#B87333] hover:bg-[#d4853b] text-white font-semibold rounded-md shadow-md transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Remix en AI Studio</span>
          </button>
        </div>
      </div>

      {/* Reading Progress Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-slate-900 z-30">
        <div
          className="h-full bg-gradient-to-r from-[#B87333] via-[#FDCC0D] to-[#00FFFF] transition-all duration-75"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* Main Scrollytelling Viewport */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="relative flex-1 w-full h-full overflow-y-auto overflow-x-hidden scroll-smooth"
      >
        {/* CHAPTER 1 */}
        <section className="relative min-h-[90vh] flex flex-col justify-center px-8 md:px-20 py-28 border-b border-[#32527B]/20">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25 filter blur-[1px] pointer-events-none transition-transform duration-300"
            style={{
              backgroundImage: `url('/src/assets/images/sgx_story_lore_myth_1791517783823.jpg')`,
              transform: `translateY(${scrollProgress * 60}px) scale(1.05)`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-[#050505]" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="flex items-center gap-3 text-xs text-[#B87333] font-semibold tracking-wider font-heading">
              <span>01. EL DESPERTAR DEL ARQUITECTO</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400">GENESIS MATRIX</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold text-white font-heading leading-tight tracking-tight">
              De espectadores pasivos a <span className="text-[#FDCC0D]">arquitectos de realidades</span>.
            </h1>

            <p className="text-base md:text-lg text-slate-300 leading-relaxed font-light">
              En el ecosistema SGX de Spatialgineers, el código no es un trámite sintáctico, sino la arcilla cuántica con la que moldeamos experiencias espaciales. Aquí ningún Initiate empieza desde una hoja en blanco; arrancan sobre una zapata de alto rendimiento diseñada para ser alterada, mutada y pulida junto a la Inteligencia Artificial Generativa.
            </p>

            <div className="p-4 bg-[#0a0f18]/80 border-l-2 border-[#B87333] rounded-r-lg max-w-xl text-xs text-slate-400">
              <span className="text-[#FDCC0D] font-bold block mb-1">MANDATO DE LOREMASTER:</span>
              "La narrativa no es texto colocado sobre una pantalla; es el ritmo con el que el usuario respira dentro de tu universo virtual."
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 pt-4">
              <ChevronDown className="w-4 h-4 animate-bounce text-[#B87333]" />
              <span>Desliza para avanzar en la crónica</span>
            </div>
          </div>
        </section>

        {/* CHAPTER 2 */}
        <section className="relative min-h-[90vh] flex flex-col justify-center px-8 md:px-20 py-28 border-b border-[#32527B]/20">
          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="flex items-center gap-3 text-xs text-[#00FFFF] font-semibold tracking-wider font-heading">
              <span>02. LOS SEIS PILARES DE LA REALIDAD</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400">EL ARSENAL SGX</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white font-heading leading-tight">
              La sinfonía de las <span className="text-[#00FFFF]">seis magias técnicas</span>.
            </h2>

            <p className="text-base text-slate-300 leading-relaxed font-light">
              Cada módulo del Omni-Canvas encarna una disciplina sagrada. <strong className="text-[#FDCC0D]">Spark</strong> gobierna el juego y la cinemática; <strong className="text-[#00FFFF]">Stage</strong> esculpe la acústica espacial en primera persona; <strong className="text-[#4A7AB7]">Showcase</strong> forja gemelos digitales fotorrealistas; <strong className="text-[#B87333]">Story</strong> custodia el scrollytelling humano; <strong className="text-[#32527B]">System</strong> domina la telemetría en vivo; y <strong className="text-[#FDCC0D]">Synthesize</strong> orquesta la convergencia monumental.
            </p>

            {/* Pillar Grid Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 bg-[#0a0f18]/90 border border-[#32527B]/30 rounded-lg">
                <span className="text-[#FDCC0D] font-bold text-xs block font-heading">SGX.Spark</span>
                <span className="text-slate-400 text-xs">Físicas 2D, colisiones, multiplicadores de combo y game loop a 60 FPS.</span>
              </div>
              <div className="p-3.5 bg-[#0a0f18]/90 border border-[#32527B]/30 rounded-lg">
                <span className="text-[#00FFFF] font-bold text-xs block font-heading">SGX.Stage</span>
                <span className="text-slate-400 text-xs">Entornos transitables en 1ra persona y balizas de audio espacial.</span>
              </div>
              <div className="p-3.5 bg-[#0a0f18]/90 border border-[#32527B]/30 rounded-lg">
                <span className="text-[#32527B] text-[#4A7AB7] font-bold text-xs block font-heading">SGX.Showcase</span>
                <span className="text-slate-400 text-xs">Visor PBR RoomEnvironment y forja de texturas con decodificación Blob local.</span>
              </div>
              <div className="p-3.5 bg-[#0a0f18]/90 border border-[#32527B]/30 rounded-lg">
                <span className="text-[#B87333] font-bold text-xs block font-heading">SGX.Synthesize</span>
                <span className="text-slate-400 text-xs">Unificación Enterprise de 3D, telemetría y ubershaders VJ reactivos.</span>
              </div>
            </div>
          </div>
        </section>

        {/* CHAPTER 3 */}
        <section className="relative min-h-[90vh] flex flex-col justify-center px-8 md:px-20 py-28">
          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="flex items-center gap-3 text-xs text-[#FDCC0D] font-semibold tracking-wider font-heading">
              <span>03. LA FORJA DEL REMIX</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400">CIRUGÍA EN AI STUDIO</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white font-heading leading-tight">
              Aislar. Contextualizar. <span className="text-[#FDCC0D]">Mutar con precisión quirúrgica</span>.
            </h2>

            <p className="text-base text-slate-300 leading-relaxed font-light">
              El mayor error de quien empieza con IA es pedirle "hazme un portafolio web". Eso engendra código monolítico y frágil. Nuestra metodología The Remix exige aislar un solo módulo, dotar a la IA del contexto estricto de <code className="text-[#00FFFF] font-mono-telemetry">sgx-config.js</code> y formular una mutación atómica.
            </p>

            <div className="p-5 bg-gradient-to-r from-[#162032] to-[#0a0f18] border border-[#FDCC0D]/40 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-[#FDCC0D] font-bold text-xs font-heading">
                <Zap className="w-4 h-4" />
                <span>RETO DE APRENDIZAJE: SGX.STORY</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                Inyecta tus propias ilustraciones conceptuales o cómics en <code className="text-[#00FFFF] font-mono-telemetry">story-module.js</code> y programa eventos donde el texto aparezca con un efecto 'fade-up' dinámico al entrar en pantalla.
              </p>
              <button
                onClick={onOpenRemix}
                className="px-4 py-2 bg-[#FDCC0D] hover:bg-[#e5b800] text-black font-semibold text-xs rounded transition-colors shadow-lg"
              >
                Abrir Prompt Quirúrgico en Remix Lab
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Bottom Bar Controls */}
      <div className="z-10 bg-[#0a0f18] border-t border-[#32527B]/30 px-6 py-3 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-6">
          <span className="text-slate-400">
            Modo: <span className="text-slate-200">Parallax Scrollytelling Cinemático</span>
          </span>
          <button
            onClick={toggleAmbient}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors ${
              ambientAudioOn ? 'bg-[#B87333] text-white font-semibold' : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            {ambientAudioOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{ambientAudioOn ? 'Drone Acústico Activo' : 'Activar Drone Sonora'}</span>
          </button>
        </div>

        <div className="text-slate-400 text-[11px]">
          Módulo: <span className="font-mono-telemetry text-slate-200">modules/story-module.js</span>
        </div>
      </div>
    </div>
  );
};
