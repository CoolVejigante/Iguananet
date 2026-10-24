/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Layer 1: The DOM Matrix (2D/UX Scrollytelling Container)
 * - Section 1: Identity Hub & Manifesto (Elevator Pitch, Previous Artworks, Retro-illuminated Social Links)
 * - Section 2: Inspection Bay (Interactive 3D WebGL Canvas)
 * - Section 3: Trajectory Matrix & Roadmap (Iguana3D Vision & Futuristic Gantt Timeline)
 *
 * All SGX Guild mentions and HTML download buttons removed per user instructions.
 */

import React, { useState } from 'react';
import {
  Layers,
  Box,
  Eye,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Calendar,
  Clock,
  Rocket,
  Compass,
  Cpu,
  Terminal,
  Activity,
  Award,
  Globe,
  Share2,
  Bookmark,
  Send
} from 'lucide-react';
import { soundEngine } from '../services/sound-effects';
import { IguanaInspectionBay, BuiltinModelId } from './IguanaInspectionBay';
import logoFull from '../assets/images/iguananetconcept-removebg-preview.png';

interface ArtworkProject {
  id: string;
  title: string;
  category: string;
  modelTarget: BuiltinModelId;
  specs: {
    triangles: string;
    textures: string;
    pbrType: string;
    compression: string;
  };
  description: string;
  tags: string[];
}

export const IguanaPortfolioMatrix: React.FC = () => {
  const [selectedInspectModel, setSelectedInspectModel] = useState<BuiltinModelId>('TERMINAL');

  const artworks: ArtworkProject[] = [
    {
      id: 'art-1',
      title: 'Consola Terminal Retro Iguana-1',
      category: 'Prop Retro-Industrial',
      modelTarget: 'TERMINAL',
      specs: {
        triangles: '7,640 Tris',
        textures: 'PBR 4K Roughness/Metal',
        pbrType: 'RoomEnvironment Studio',
        compression: 'DRACO v1.5.6 (Google CDN)'
      },
      description:
        'Estación de trabajo mainframe estilo retro-futurista con monitor curvo CRT, rejillas disipadoras de calor y bulbos de vacío con filamentos de tungsteno.',
      tags: ['Props', 'Retro-Industrial', 'Hard-Surface', 'DRACO']
    },
    {
      id: 'art-2',
      title: 'Dron de Reconocimiento Iguana-X',
      category: 'Vehículo Táctico Sci-Fi',
      modelTarget: 'DRONE',
      specs: {
        triangles: '9,850 Tris',
        textures: 'PBR Dual-Coat Anodizado',
        pbrType: 'Micro-facet Specular',
        compression: 'DRACO v1.5.6 (Google CDN)'
      },
      description:
        'Unidad orbital no tripulada para cartografía espacial. Cuatro puntales articulados con toberas vectoriales y domo óptico cian de alta sensibilidad.',
      tags: ['Game-Ready', 'Sci-Fi', 'Props', 'Rigged']
    },
    {
      id: 'art-3',
      title: 'Neo-San Juan Brutalist Habitat',
      category: 'ArchViz Modular Concept',
      modelTarget: 'ARCHVIZ',
      specs: {
        triangles: '6,880 Tris',
        textures: 'Concreto & Vidrio Dieléctrico',
        pbrType: 'Transmission 0.9 / ACES',
        compression: 'DRACO v1.5.6 (Google CDN)'
      },
      description:
        'Pabellón arquitectónico modular de observación costera con pórtico voladizo, ventanales panorámicos y lamas de sombreado solar en acero envejecido.',
      tags: ['ArchViz', 'Brutalismo', 'Modular', 'Ambientes']
    },
    {
      id: 'art-4',
      title: 'Celda de Contención Criogénica',
      category: 'Prop Pesado de Fusión',
      modelTarget: 'FUSION_CORE',
      specs: {
        triangles: '9,200 Tris',
        textures: 'Cobre C101 & Acero Damasco',
        pbrType: 'Emissive Plasma Core',
        compression: 'DRACO v1.5.6 (Google CDN)'
      },
      description:
        'Reactor de energía industrial con toroide magnético de confinamiento, mirilla de plasma y sellos de alta presión para entornos de juego AAA.',
      tags: ['Props', 'Industrial', 'Energía', 'VFX']
    }
  ];

  const handleInspectArtwork = (target: BuiltinModelId) => {
    soundEngine.playClickSound();
    setSelectedInspectModel(target);
    const bayEl = document.getElementById('inspection-bay');
    if (bayEl) {
      bayEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative z-10 w-full min-h-screen text-slate-100 flex flex-col pb-24 overflow-x-hidden">
      {/* SECTION 1: Identity Hub & Manifesto */}
      <section id="identity-hub" className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-16 space-y-12">
        {/* Title, Logo & Location Tags (Crossed out SGX Guild tag removed) */}
        <div className="flex flex-col space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 bg-[#F57E00]/20 border border-[#F57E00]/40 text-[#F57E00] text-xs font-mono-telemetry clip-tag-chamfer font-semibold">
              IGUANANET V2026.5
            </span>
            <span className="px-3 py-1 bg-[#162937] border border-[#99EEFF]/40 text-[#99EEFF] text-xs font-mono-telemetry clip-tag-chamfer font-semibold">
              IGUANA3D STUDIO
            </span>
            <span className="text-slate-400 font-mono-telemetry text-xs hidden sm:inline">
              // HUMACAO, PUERTO RICO
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-black tracking-tight text-white">
                LUIS CASANOVA
              </h1>
              <p className="text-lg sm:text-xl font-heading text-[#99EEFF] font-semibold tracking-wide mt-1">
                3D Artist & Visual Developer · Props, ArchViz & Retro-Industrial
              </p>
            </div>
            {/* Red circled area: iguananetconcept-removebg-preview */}
            <div className="flex items-center">
              <img
                src={logoFull}
                alt="IguanaNet Official Logo"
                className="h-14 sm:h-20 w-auto max-w-[280px] sm:max-w-[420px] object-contain filter drop-shadow-[0_0_18px_rgba(153,238,255,0.45)]"
              />
            </div>
          </div>
        </div>

        {/* Integrated Mandatory Elevator Pitch Box */}
        <div className="relative p-6 sm:p-8 bg-[#162937]/90 backdrop-blur-xl border-2 border-[#99EEFF]/40 clip-chamfer-45 shadow-[0_0_40px_rgba(36,65,86,0.6)]">

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#244156] border border-[#99EEFF]/40 flex items-center justify-center shrink-0 mt-1">
              <Terminal className="w-5 h-5 text-[#F57E00]" />
            </div>

            <div className="space-y-4">
              <span className="text-xs font-mono-telemetry text-[#F57E00] tracking-widest uppercase">
                // MANIFIESTO PROFESIONAL Y PROPUESTA DE VALOR
              </span>
              <blockquote className="text-base sm:text-lg text-slate-100 font-sans leading-relaxed border-l-2 border-[#F57E00] pl-4 italic">
                "Saludos, soy Luis Casanova, 3D Artist y Visual Developer especializado en props, ArchViz y diseño industrial y artístico. Resuelvo la incertidumbre de los directores de arte e indie game devs que contratan a ciegas sin conocer la optimización ni la escala real de los modelos. Logro mediante un visor WebGL de inspección 'Inspection Bay', donde pueden probar los assets tridimensionales en vivo, alternar wireframes, inspeccionar vértices y polígonos y evaluar texturas PBR sin fricción ni descargas. Y por eso es cósmicamente interesante."
              </blockquote>
            </div>
          </div>
        </div>

        {/* Retro-Illuminated Social & Credentials Links */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#99EEFF]/20">
            <span className="text-xs font-mono-telemetry text-[#99EEFF] uppercase tracking-wider">
              // RED DE CONECTIVIDAD & PORTAFOLIO EN VIVO
            </span>
            <span className="text-xs font-mono-telemetry text-slate-400">
              ENLACES RETRO-ILUMINADOS
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* ArtStation */}
            <a
              href="https://www.artstation.com"
              target="_blank"
              rel="noreferrer"
              className="group p-4 bg-[#162937]/80 hover:bg-[#1f384c] border border-[#99EEFF]/30 hover:border-[#99EEFF] clip-chamfer-45 transition-all duration-300 shadow-lg hover:shadow-[0_0_25px_rgba(153,238,255,0.35)] flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#0e1b24] border border-[#99EEFF]/40 rounded flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Globe className="w-5 h-5 text-[#99EEFF]" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-white text-sm group-hover:text-[#99EEFF] transition-colors">
                    ARTSTATION
                  </h4>
                  <span className="text-[11px] font-mono-telemetry text-slate-400">
                    Galería de Props 3D & ArchViz
                  </span>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-[#99EEFF] group-hover:translate-x-0.5 transition-transform" />
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="group p-4 bg-[#162937]/80 hover:bg-[#1f384c] border border-[#99EEFF]/30 hover:border-[#99EEFF] clip-chamfer-45 transition-all duration-300 shadow-lg hover:shadow-[0_0_25px_rgba(153,238,255,0.35)] flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#0e1b24] border border-[#99EEFF]/40 rounded flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Award className="w-5 h-5 text-[#99EEFF]" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-white text-sm group-hover:text-[#99EEFF] transition-colors">
                    LINKEDIN
                  </h4>
                  <span className="text-[11px] font-mono-telemetry text-slate-400">
                    Trayectoria & Producción
                  </span>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-[#99EEFF] group-hover:translate-x-0.5 transition-transform" />
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noreferrer"
              className="group p-4 bg-[#162937]/80 hover:bg-[#1f384c] border border-[#F57E00]/40 hover:border-[#F57E00] clip-chamfer-45 transition-all duration-300 shadow-lg hover:shadow-[0_0_25px_rgba(245,126,0,0.35)] flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#0e1b24] border border-[#F57E00]/40 rounded flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Sparkles className="w-5 h-5 text-[#F57E00]" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-white text-sm group-hover:text-[#F57E00] transition-colors">
                    INSTAGRAM
                  </h4>
                  <span className="text-[11px] font-mono-telemetry text-slate-400">
                    WIPs, Renders & Wireframes
                  </span>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-[#F57E00] group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>

        {/* Sub-section: Previous Artworks */}
        <div className="space-y-6 pt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-mono-telemetry text-[#F57E00] uppercase tracking-widest block">
                // CATÁLOGO DE PRODUCCIÓN
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white">
                OBRAS PREVIAS & PROPS RETRO-INDUSTRIALES
              </h2>
            </div>
            <span className="text-xs font-mono-telemetry text-slate-400">
              PRUEBA CADA MODELO EN VIVO EN EL INSPECTION BAY
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {artworks.map((art) => (
              <div
                key={art.id}
                className="p-5 sm:p-6 bg-[#162937]/90 border border-[#99EEFF]/25 hover:border-[#99EEFF] clip-chamfer-45 transition-all duration-300 space-y-4 shadow-xl group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-mono-telemetry text-[#99EEFF] uppercase">
                      {art.category}
                    </span>
                    <h3 className="text-lg font-heading font-bold text-white group-hover:text-[#99EEFF] transition-colors">
                      {art.title}
                    </h3>
                  </div>

                  <span className="px-2 py-0.5 text-[10px] font-mono-telemetry bg-[#244156] border border-[#99EEFF]/30 text-[#F57E00] rounded">
                    {art.specs.triangles}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {art.description}
                </p>

                {/* Technical Specs Grid */}
                <div className="p-3 bg-[#0e1b24]/80 border border-[#99EEFF]/15 rounded-lg grid grid-cols-2 gap-2 text-[11px] font-mono-telemetry">
                  <div>
                    <span className="text-slate-500 block text-[10px]">TEXTURAS:</span>
                    <span className="text-slate-200">{art.specs.textures}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">ILUMINACIÓN:</span>
                    <span className="text-slate-200">{art.specs.pbrType}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500 block text-[10px]">COMPRESIÓN:</span>
                    <span className="text-emerald-400">{art.specs.compression}</span>
                  </div>
                </div>

                {/* Action button: Test in Inspection Bay */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {art.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-[10px] bg-[#244156] text-slate-300 rounded font-mono-telemetry"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => handleInspectArtwork(art.modelTarget)}
                    className="px-3.5 py-1.5 bg-[#99EEFF] hover:bg-white text-black font-heading font-bold text-xs rounded flex items-center gap-1.5 transition-all shadow-md group-hover:shadow-[0_0_15px_rgba(153,238,255,0.6)]"
                  >
                    <Eye className="w-3.5 h-3.5 text-black" />
                    <span>Inspeccionar 3D</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2: Inspection Bay (Interactive 3D WebGL Canvas) */}
      <section className="w-full my-8">
        <IguanaInspectionBay
          initialModel={selectedInspectModel}
        />
      </section>

      {/* SECTION 3: Trajectory Matrix & Roadmap - Iguana3D Vision */}
      <section id="trajectory-matrix" className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-16 space-y-12">
        {/* Section Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#F57E00] clip-tag-chamfer" />
            <span className="text-xs font-mono-telemetry text-[#F57E00] uppercase tracking-widest font-semibold">
              SECCIÓN 3 // MATRIZ DE TRAYECTORIA & ROADMAP
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-black text-white">
            VISIÓN ESTRATÉGICA IGUANA3D
          </h2>
        </div>

        {/* Mandatory Mission Statement Quote */}
        <div className="p-6 sm:p-8 bg-[#162937]/90 backdrop-blur-xl border-l-4 border-[#F57E00] border-y border-r border-[#99EEFF]/20 clip-chamfer-45 shadow-xl space-y-3">
          <span className="text-xs font-mono-telemetry text-[#99EEFF] tracking-wider uppercase block">
            // DECLARACIÓN DE MISIÓN OFICIAL IGUANA3D
          </span>
          <blockquote className="text-base sm:text-xl font-heading text-white leading-relaxed font-semibold">
            "Nuestra visión no es solo improvisar tus assets u otros trabajos, Iguana3D está también enfocado en la contribución visual de cada tipo de industria relacionada para cementar la nueva generacion de desarolladores encargado de cementear propiedad intelectual cautivadora y imposible de despegar."
          </blockquote>
          <span className="text-xs font-mono-telemetry text-slate-400 block pt-1">
            — Luis Casanova, Fundador de Iguana3D & Desarrollador Visual 3D
          </span>
        </div>

        {/* Futuristic Gantt / Flowchart Timeline */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-[#99EEFF]/20 text-xs font-mono-telemetry text-slate-400">
            <span className="text-[#99EEFF]">CRONOGRAMA DE EXPANSIÓN TECNOLÓGICA & CREATIVA</span>
            <span>TIMELINE V2026-2027</span>
          </div>

          <div className="space-y-6">
            {/* Phase 1 */}
            <div className="relative p-6 bg-[#162937]/80 border-2 border-emerald-500/50 clip-chamfer-45 shadow-[0_0_25px_rgba(16,185,129,0.2)] space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-heading font-bold flex items-center justify-center text-xs">
                    01
                  </span>
                  <div>
                    <span className="text-[10px] font-mono-telemetry text-emerald-400 tracking-wider">
                      FASE 1 // DESPLIEGUE FUNDACIONAL
                    </span>
                    <h3 className="text-lg font-heading font-bold text-white">
                      WebGL Portfolio Launch (IguanaNet)
                    </h3>
                  </div>
                </div>

                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-xs font-mono-telemetry font-bold">
                  ✓ COMPLETADO & ACTIVO
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                Lanzamiento del portafolio interactivo 3D con la arquitectura Omni-Canvas de 4 capas. Integración de decodificador DRACO v1.5.6 vía Google CDN, mitigación total de CORS y visualización sin fricción.
              </p>

              {/* Gantt Milestone Bar */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-[11px] font-mono-telemetry text-slate-400">
                  <span>Hito: Visor WebGL + PBR RoomEnvironment</span>
                  <span className="text-emerald-400 font-bold">100% CUMPLIDO</span>
                </div>
                <div className="w-full h-2.5 bg-[#0e1b24] rounded-full overflow-hidden border border-emerald-500/30">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-[#99EEFF] w-full" />
                </div>
              </div>
            </div>

            {/* Phase 2 */}
            <div className="relative p-6 bg-[#162937]/80 border-2 border-[#F57E00]/60 clip-chamfer-45 shadow-[0_0_25px_rgba(245,126,0,0.2)] space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded bg-[#F57E00]/20 border border-[#F57E00]/40 text-[#F57E00] font-heading font-bold flex items-center justify-center text-xs">
                    02
                  </span>
                  <div>
                    <span className="text-[10px] font-mono-telemetry text-[#F57E00] tracking-wider">
                      FASE 2 // COLABORACIÓN & MOTOR INDIE
                    </span>
                    <h3 className="text-lg font-heading font-bold text-white">
                      Collaborative Projects & Game Jams
                    </h3>
                  </div>
                </div>

                <span className="px-3 py-1 bg-[#F57E00]/20 text-[#F57E00] border border-[#F57E00]/40 rounded-full text-xs font-mono-telemetry font-bold animate-pulse">
                  EN EJECUCIÓN // 2026
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                Coproducción de assets 3D optimizados para motores de videojuegos (Unreal Engine 5, Godot 4, Three.js) en colaboración con desarrolladores independientes y participación activa en game jams internacionales. Automatización del pipeline de compresión geométrica y micro-optimizaciones WebGL.
              </p>

              {/* Gantt Milestone Bar */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-[11px] font-mono-telemetry text-slate-400">
                  <span>Hito: Pipeline de Assets AAA + Alianzas Indie</span>
                  <span className="text-[#F57E00] font-bold">65% EN CURSO</span>
                </div>
                <div className="w-full h-2.5 bg-[#0e1b24] rounded-full overflow-hidden border border-[#F57E00]/30">
                  <div className="h-full bg-gradient-to-r from-[#F57E00] to-[#99EEFF] w-[65%]" />
                </div>
              </div>
            </div>

            {/* Phase 3 */}
            <div className="relative p-6 bg-[#162937]/80 border-2 border-[#99EEFF]/40 clip-chamfer-45 shadow-[0_0_25px_rgba(153,238,255,0.15)] space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded bg-[#99EEFF]/20 border border-[#99EEFF]/40 text-[#99EEFF] font-heading font-bold flex items-center justify-center text-xs">
                    03
                  </span>
                  <div>
                    <span className="text-[10px] font-mono-telemetry text-[#99EEFF] tracking-wider">
                      FASE 3 // CONSOLIDACIÓN INSTITUCIONAL
                    </span>
                    <h3 className="text-lg font-heading font-bold text-white">
                      Independent Studio Consolidation in Puerto Rico
                    </h3>
                  </div>
                </div>

                <span className="px-3 py-1 bg-[#244156] text-[#99EEFF] border border-[#99EEFF]/40 rounded-full text-xs font-mono-telemetry font-bold">
                  VISIÓN ESTRATÉGICA // 2027
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                Consolidación formal de Iguana3D como estudio independiente líder de desarrollo visual y producción de propiedad intelectual interactiva en Puerto Rico. Fomento y mentoría de la nueva generación de desarrolladores locales para crear franquicias cautivadoras e imposibles de despegar para el mercado global.
              </p>

              {/* Gantt Milestone Bar */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-[11px] font-mono-telemetry text-slate-400">
                  <span>Hito: Estudio de Desarrollo Visual Puerto Rico</span>
                  <span className="text-[#99EEFF] font-bold">PLANIFICACIÓN ACTIVA</span>
                </div>
                <div className="w-full h-2.5 bg-[#0e1b24] rounded-full overflow-hidden border border-[#99EEFF]/30">
                  <div className="h-full bg-gradient-to-r from-[#244156] to-[#99EEFF] w-[25%]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact & Collaboration Footer Box (Download button removed per user specification) */}
        <div className="p-6 bg-gradient-to-r from-[#162937] via-[#244156] to-[#162937] border border-[#99EEFF]/40 clip-chamfer-45 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-heading font-bold text-white text-base">
              ¿Listo para colaborar en tu próximo proyecto o producción 3D?
            </h4>
            <p className="text-xs text-slate-300 font-sans">
              Inspecciona los modelos en tiempo real en el Inspection Bay o conecta directamente a través de nuestras redes profesionales.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-[#99EEFF] hover:bg-white text-black font-heading font-bold text-xs rounded transition-all shadow-md flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Contactar en LinkedIn</span>
            </a>
            <a
              href="https://www.artstation.com"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-[#244156] hover:bg-[#1a3142] border border-[#99EEFF]/40 text-[#99EEFF] font-heading font-bold text-xs rounded transition-all flex items-center gap-2"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Ver en ArtStation</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
