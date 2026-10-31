/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Layer 1: The DOM Matrix (2D/UX Scrollytelling Container)
 * - Section 1: Inspection Bay (Interactive 3D WebGL Canvas)
 * - Section 2: Catálogo de Producción (Obras Previas & Props Retro-Industriales)
 * - Section 3: Identity Hub & Manifesto (Elevator Pitch, Previous Artworks, Retro-illuminated Social Links)
 * - Section 4: Trajectory Matrix & Roadmap (Iguana3D Vision & Futuristic Gantt Timeline)
 *
 * Full bilingual support (ES / EN) via useLanguage().
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
  Send,
  Mail
} from 'lucide-react';
import { soundEngine } from '../services/sound-effects';
import { useLanguage } from '../context/LanguageContext';
import { IguanaInspectionBay, BuiltinModelId } from './IguanaInspectionBay';
import logoFull from '../assets/images/iguananetconcept-removebg-preview.png';
import pcVRImg from '../assets/images/pcVR@2x@2x.jpg';
import busStopImg from '../assets/images/busStopRndr1@2x.jpg';
import intdorfinImg from '../assets/images/intdorfin.jpg';
import modaparfinalImg from '../assets/images/modaparfinal.png';
import iguanaModelImg from '../assets/images/iguana_model_3d.png';
import platoArqueologicoImg from '../assets/images/plato_arqueologico.png';
import telefonoInteligenteImg from '../assets/images/telefono_inteligente.png';

interface ArtworkProject {
  id: string;
  title: string;
  category: string;
  modelTarget: BuiltinModelId;
  image?: string;
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
  const { t, language } = useLanguage();
  const [selectedInspectModel, setSelectedInspectModel] = useState<BuiltinModelId>('TERMINAL');

  const artworks: ArtworkProject[] = [
    {
      id: 'art-1',
      title: t.catalog.artworks.art1.title,
      category: t.catalog.artworks.art1.category,
      modelTarget: 'TERMINAL',
      image: telefonoInteligenteImg,
      specs: {
        triangles: '1,712 Tris',
        textures: t.catalog.artworks.art1.textures,
        pbrType: t.catalog.artworks.art1.lighting,
        compression: 'DRACO v1.5.6 (Google CDN)'
      },
      description: t.catalog.artworks.art1.description,
      tags: ['Hardware', 'Smartphone', 'Retrofuturismo', 'Props', 'Industrial']
    },
    {
      id: 'art-2',
      title: t.catalog.artworks.art2.title,
      category: t.catalog.artworks.art2.category,
      modelTarget: 'DRONE',
      image: iguanaModelImg,
      specs: {
        triangles: '67,924 Tris',
        textures: t.catalog.artworks.art2.textures,
        pbrType: t.catalog.artworks.art2.lighting,
        compression: 'DRACO v1.5.6 (Google CDN)'
      },
      description: t.catalog.artworks.art2.description,
      tags: ['Iguana', 'Game-Ready', 'Sci-Fi', 'Props', 'Rigged']
    },
    {
      id: 'art-3',
      title: t.catalog.artworks.art3.title,
      category: t.catalog.artworks.art3.category,
      modelTarget: 'ARCHVIZ',
      image: platoArqueologicoImg,
      specs: {
        triangles: '256 Tris',
        textures: t.catalog.artworks.art3.textures,
        pbrType: t.catalog.artworks.art3.lighting,
        compression: 'DRACO v1.5.6 (Google CDN)'
      },
      description: t.catalog.artworks.art3.description,
      tags: ['Arqueología', 'Prop', 'Texturas-PBR', 'DRACO', 'Historia']
    },
    {
      id: 'art-4',
      title: t.catalog.artworks.art4.title,
      category: t.catalog.artworks.art4.category,
      modelTarget: 'FUSION_CORE',
      image: modaparfinalImg,
      specs: {
        triangles: '5,556 Tris',
        textures: t.catalog.artworks.art4.textures,
        pbrType: t.catalog.artworks.art4.lighting,
        compression: 'DRACO v1.5.6 (Google CDN)'
      },
      description: t.catalog.artworks.art4.description,
      tags: ['ArchViz', 'Retrofuturismo', 'Apartamento', 'Modular', 'Ambientes']
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
      {/* SECTION 1: Inspection Bay (Interactive 3D WebGL Canvas) */}
      <section className="w-full pt-16 sm:pt-20 pb-4">
        <IguanaInspectionBay
          initialModel={selectedInspectModel}
          onModelChange={setSelectedInspectModel}
        />
      </section>

      {/* SECTION 2: Catálogo de Producción (Obras Previas & Props) */}
      <section id="catalogo-produccion" className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-12 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[#99EEFF]/20">
          <div>
            <span className="text-xs font-mono-telemetry text-[#F57E00] uppercase tracking-widest block">
              {t.catalog.badge}
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white">
              {t.catalog.title}
            </h2>
          </div>
          <span className="text-xs font-mono-telemetry text-slate-400">
            {t.catalog.subtitle}
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

              {art.image && (
                <div className="relative w-full h-44 sm:h-52 overflow-hidden rounded-md border border-[#99EEFF]/25 group-hover:border-[#99EEFF]/60 transition-all bg-[#0e1b24]">
                  <img
                    src={art.image}
                    alt={art.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#162937]/80 via-transparent to-transparent pointer-events-none" />
                </div>
              )}

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {art.description}
              </p>

              {/* Technical Specs Grid */}
              <div className="p-3 bg-[#0e1b24]/80 border border-[#99EEFF]/15 rounded-lg grid grid-cols-2 gap-2 text-[11px] font-mono-telemetry">
                <div>
                  <span className="text-slate-500 block text-[10px]">{t.catalog.specsTextures}</span>
                  <span className="text-slate-200">{art.specs.textures}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">{t.catalog.specsLighting}</span>
                  <span className="text-slate-200">{art.specs.pbrType}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500 block text-[10px]">{t.catalog.specsCompression}</span>
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
                  <span>{t.catalog.inspectBtn}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: Nombre, Información, Manifiesto Profesional & Red de Conectividad */}
      <section id="identity-hub" className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-12 border-t border-[#99EEFF]/15">
        {/* Title, Logo & Location Tags */}
        <div className="flex flex-col space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 bg-[#F57E00]/20 border border-[#F57E00]/40 text-[#F57E00] text-xs font-mono-telemetry clip-tag-chamfer font-semibold">
              IGUANANET V2026.5
            </span>
            <span className="px-3 py-1 bg-[#162937] border border-[#99EEFF]/40 text-[#99EEFF] text-xs font-mono-telemetry clip-tag-chamfer font-semibold">
              IGUANA3D STUDIO
            </span>
            <span className="text-slate-400 font-mono-telemetry text-xs hidden sm:inline">
              {t.identityHub.location}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-black tracking-tight text-white">
                LUIS CASANOVA
              </h1>
              <p className="text-lg sm:text-xl font-heading text-[#99EEFF] font-semibold tracking-wide mt-1">
                {t.identityHub.role}
              </p>
            </div>
            {/* Logo */}
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
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-10 h-10 rounded-lg bg-[#244156] border border-[#99EEFF]/40 flex items-center justify-center shrink-0 mt-1">
                <Terminal className="w-5 h-5 text-[#F57E00]" />
              </div>

              <div className="space-y-4">
                <span className="text-xs font-mono-telemetry text-[#F57E00] tracking-widest uppercase">
                  {t.identityHub.manifestoBadge}
                </span>
                <blockquote className="text-base sm:text-lg text-slate-100 font-sans leading-relaxed border-l-2 border-[#F57E00] pl-4 italic">
                  {t.identityHub.manifestoText}
                </blockquote>
              </div>
            </div>

            {/* Iguana 3D Model Display Card */}
            <div className="w-full lg:w-72 xl:w-80 shrink-0 flex items-center justify-center p-3 bg-[#0e1b24]/80 border border-[#99EEFF]/30 rounded-lg clip-chamfer-45 overflow-hidden shadow-inner group">
              <img
                src={iguanaModelImg}
                alt="Iguana 3D Model"
                className="w-full h-auto max-h-48 object-contain filter drop-shadow-[0_0_15px_rgba(153,238,255,0.4)] group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>

        {/* Retro-Illuminated Social & Credentials Links */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#99EEFF]/20">
            <span className="text-xs font-mono-telemetry text-[#99EEFF] uppercase tracking-wider">
              {t.identityHub.connectivityBadge}
            </span>
            <span className="text-xs font-mono-telemetry text-slate-400">
              {t.identityHub.connectivitySub}
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
                    {t.identityHub.artstationSub}
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
                    {t.identityHub.linkedinSub}
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
                    {t.identityHub.instagramSub}
                  </span>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-[#F57E00] group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 4: Trajectory Matrix & Roadmap - Iguana3D Vision */}
      <section id="trajectory-matrix" className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-16 space-y-12">
        {/* Section Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#F57E00] clip-tag-chamfer" />
            <span className="text-xs font-mono-telemetry text-[#F57E00] uppercase tracking-widest font-semibold">
              {t.roadmap.badge}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-black text-white">
            {t.roadmap.title}
          </h2>
        </div>

        {/* Mandatory Mission Statement Quote */}
        <div className="p-6 sm:p-8 bg-[#162937]/90 backdrop-blur-xl border-l-4 border-[#F57E00] border-y border-r border-[#99EEFF]/20 clip-chamfer-45 shadow-xl space-y-3">
          <span className="text-xs font-mono-telemetry text-[#99EEFF] tracking-wider uppercase block">
            {t.roadmap.missionBadge}
          </span>
          <blockquote className="text-base sm:text-xl font-heading text-white leading-relaxed font-semibold">
            {t.roadmap.missionQuote}
          </blockquote>
          <span className="text-xs font-mono-telemetry text-slate-400 block pt-1">
            {t.roadmap.missionAuthor}
          </span>
        </div>

        {/* Futuristic Gantt / Flowchart Timeline */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-[#99EEFF]/20 text-xs font-mono-telemetry text-slate-400">
            <span className="text-[#99EEFF]">{t.roadmap.timelineTitle}</span>
            <span>{t.roadmap.timelineVersion}</span>
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
                      {t.roadmap.phase1.tag}
                    </span>
                    <h3 className="text-lg font-heading font-bold text-white">
                      {t.roadmap.phase1.title}
                    </h3>
                  </div>
                </div>

                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full text-xs font-mono-telemetry font-bold">
                  {t.roadmap.phase1.status}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {t.roadmap.phase1.description}
              </p>

              {/* Gantt Milestone Bar */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-[11px] font-mono-telemetry text-slate-400">
                  <span>{language === 'es' ? 'Hito: Visor WebGL + PBR RoomEnvironment' : 'Milestone: WebGL Viewer + PBR RoomEnvironment'}</span>
                  <span className="text-emerald-400 font-bold">{language === 'es' ? '100% CUMPLIDO' : '100% ACHIEVED'}</span>
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
                      {t.roadmap.phase2.tag}
                    </span>
                    <h3 className="text-lg font-heading font-bold text-white">
                      {t.roadmap.phase2.title}
                    </h3>
                  </div>
                </div>

                <span className="px-3 py-1 bg-[#F57E00]/20 text-[#F57E00] border border-[#F57E00]/40 rounded-full text-xs font-mono-telemetry font-bold animate-pulse">
                  {t.roadmap.phase2.status}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {t.roadmap.phase2.description}
              </p>

              {/* Gantt Milestone Bar */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-[11px] font-mono-telemetry text-slate-400">
                  <span>{language === 'es' ? 'Hito: Pipeline de Assets AAA + Alianzas Indie' : 'Milestone: AAA Asset Pipeline & Indie Alliances'}</span>
                  <span className="text-[#F57E00] font-bold">{language === 'es' ? '65% EN CURSO' : '65% IN PROGRESS'}</span>
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
                      {t.roadmap.phase3.tag}
                    </span>
                    <h3 className="text-lg font-heading font-bold text-white">
                      {t.roadmap.phase3.title}
                    </h3>
                  </div>
                </div>

                <span className="px-3 py-1 bg-[#244156] text-[#99EEFF] border border-[#99EEFF]/40 rounded-full text-xs font-mono-telemetry font-bold">
                  {t.roadmap.phase3.status}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {t.roadmap.phase3.description}
              </p>

              {/* Gantt Milestone Bar */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-[11px] font-mono-telemetry text-slate-400">
                  <span>{language === 'es' ? 'Hito: Estudio de Desarrollo Visual Puerto Rico' : 'Milestone: Puerto Rico Visual Development Studio'}</span>
                  <span className="text-[#99EEFF] font-bold">{language === 'es' ? 'PLANIFICACIÓN ACTIVA' : 'ACTIVE PLANNING'}</span>
                </div>
                <div className="w-full h-2.5 bg-[#0e1b24] rounded-full overflow-hidden border border-[#99EEFF]/30">
                  <div className="h-full bg-gradient-to-r from-[#244156] to-[#99EEFF] w-[25%]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact & Collaboration Footer Box */}
        <div className="p-6 bg-gradient-to-r from-[#162937] via-[#244156] to-[#162937] border border-[#99EEFF]/40 clip-chamfer-45 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-heading font-bold text-white text-base">
              {language === 'es'
                ? '¿Listo para colaborar en mis o tus próximos proyectos?'
                : 'Ready to collaborate on upcoming projects?'}
            </h4>
            <p className="text-xs text-slate-300 font-sans">
              {language === 'es'
                ? 'Inspecciona los modelos en tiempo real en el Inspection Bay o conecta directamente para cotizaciones y dirección artística.'
                : 'Inspect models live in the Inspection Bay or connect directly for quotes and artistic direction.'}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=luis.e.a.fontanez.casanova@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gradient-to-r from-[#EA4335] to-[#c5221f] hover:from-[#d93025] hover:to-[#b31412] text-white font-heading font-bold text-xs rounded transition-all shadow-[0_0_15px_rgba(234,67,53,0.4)] flex items-center gap-2"
              title="Redactar mensaje en Gmail a luis.e.a.fontanez.casanova@gmail.com"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{language === 'es' ? 'Redactar en Gmail' : 'Compose in Gmail'}</span>
            </a>
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-[#99EEFF] hover:bg-white text-black font-heading font-bold text-xs rounded transition-all shadow-md flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{language === 'es' ? 'LinkedIn' : 'LinkedIn'}</span>
            </a>
            <a
              href="https://www.artstation.com"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-[#244156] hover:bg-[#1a3142] border border-[#99EEFF]/40 text-[#99EEFF] font-heading font-bold text-xs rounded transition-all flex items-center gap-2"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language === 'es' ? 'ArtStation' : 'ArtStation'}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
