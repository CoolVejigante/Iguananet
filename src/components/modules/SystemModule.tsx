/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * MÓDULO SGX.System: Los Code Weavers (The Console - Portfolio Analytics & Telemetry Dashboard)
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  MousePointerClick,
  TrendingUp,
  Cloud,
  Sparkles,
  Download,
  Trash2,
  Play,
  Pause,
  PlusCircle,
  Eye,
  Activity,
  Box,
  Gamepad2,
  FileText,
  Compass
} from 'lucide-react';
import { soundEngine } from '../../services/sound-effects';

interface SystemModuleProps {
  onOpenRemix: () => void;
  isMuted: boolean;
}

interface PortfolioEvent {
  id: string;
  time: string;
  category: '3D_SHOWCASE' | 'SPARK_GAME' | 'STAGE_AUDIO' | 'STORY_SCROLL' | 'CV_DOWNLOAD' | 'NEW_VISITOR';
  label: string;
  device: string;
  country: string;
  latencyMs: number;
}

export const SystemModule: React.FC<SystemModuleProps> = ({ onOpenRemix }) => {
  const [activeVisitors, setActiveVisitors] = useState<number>(18);
  const [totalInteractions, setTotalInteractions] = useState<number>(1428);
  const [cloudLatency, setCloudLatency] = useState<number>(19);
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(true);
  const [events, setEvents] = useState<PortfolioEvent[]>([]);
  const [timeSeries, setTimeSeries] = useState<number[]>([24, 38, 42, 35, 50, 62, 58, 71, 65, 84, 92, 88, 96, 104, 118]);

  // Initial event seed
  useEffect(() => {
    const seed: PortfolioEvent[] = [
      {
        id: 'EV-842',
        time: new Date(Date.now() - 4000).toLocaleTimeString(),
        category: '3D_SHOWCASE',
        label: 'Giro orbital 360° en Pabellón SGX',
        device: 'Desktop Chrome · macOS',
        country: 'EE.UU. (San Francisco)',
        latencyMs: 18
      },
      {
        id: 'EV-841',
        time: new Date(Date.now() - 8000).toLocaleTimeString(),
        category: 'SPARK_GAME',
        label: 'Intento #4 completado en Geometry Runner (78%)',
        device: 'Mobile Safari · iOS',
        country: 'España (Madrid)',
        latencyMs: 22
      },
      {
        id: 'EV-840',
        time: new Date(Date.now() - 14000).toLocaleTimeString(),
        category: 'NEW_VISITOR',
        label: 'Sesión iniciada desde enlace directo de portafolio',
        device: 'Desktop Edge · Windows',
        country: 'México (CDMX)',
        latencyMs: 16
      },
      {
        id: 'EV-839',
        time: new Date(Date.now() - 20000).toLocaleTimeString(),
        category: 'CV_DOWNLOAD',
        label: 'Descarga de dossier técnico de arquitectura',
        device: 'Laptop Firefox · Ubuntu',
        country: 'Alemania (Berlín)',
        latencyMs: 25
      }
    ];
    setEvents(seed);
  }, []);

  // Periodic automatic event ingestion
  useEffect(() => {
    if (!isLiveStreaming) return;

    const interval = setInterval(() => {
      // Fluctuate latency and visitors slightly
      const newLat = Math.round(16 + Math.random() * 12);
      setCloudLatency(newLat);
      setActiveVisitors((prev) => Math.max(12, prev + (Math.random() > 0.5 ? 1 : -1)));
      setTotalInteractions((prev) => prev + 1);

      // Random synthetic event
      const sampleCategories: { cat: PortfolioEvent['category']; label: string; dev: string; loc: string }[] = [
        { cat: '3D_SHOWCASE', label: 'Cambio de textura a Acero Damasco en Showcase', dev: 'Desktop Chrome · Windows', loc: 'Canadá (Toronto)' },
        { cat: 'SPARK_GAME', label: 'Salto exitoso en orbe gravitacional de Spark', dev: 'Mobile Safari · iPhone', loc: 'Colombia (Bogotá)' },
        { cat: 'STAGE_AUDIO', label: 'Baliza Beta 440Hz activada en 1ra persona', dev: 'Desktop Chrome · macOS', loc: 'Reino Unido (Londres)' },
        { cat: 'STORY_SCROLL', label: 'Capítulo 02 completado en narrativa Parallax', dev: 'Tablet Chrome · iPadOS', loc: 'Argentina (Buenos Aires)' },
        { cat: 'NEW_VISITOR', label: 'Nuevo visitante explorando proyectos del gremio', dev: 'Desktop Safari · macOS', loc: 'Japón (Tokio)' }
      ];

      const chosen = sampleCategories[Math.floor(Math.random() * sampleCategories.length)];
      const newEvent: PortfolioEvent = {
        id: `EV-${Math.floor(100 + Math.random() * 900)}`,
        time: new Date().toLocaleTimeString(),
        category: chosen.cat,
        label: chosen.label,
        device: chosen.dev,
        country: chosen.loc,
        latencyMs: newLat
      };

      setEvents((prev) => [newEvent, ...prev.slice(0, 24)]);

      // Push to time-series chart
      setTimeSeries((prev) => [...prev.slice(1), Math.round(prev[prev.length - 1] + (Math.random() * 14 - 6))]);
    }, 3200);

    return () => clearInterval(interval);
  }, [isLiveStreaming]);

  // Manually simulate custom event
  const simulateEvent = (type: PortfolioEvent['category']) => {
    soundEngine.playClickSound();
    const eventLabels: Record<PortfolioEvent['category'], string> = {
      '3D_SHOWCASE': 'Inspección orbital 3D de maqueta interactiva',
      'SPARK_GAME': 'Partida completada en Geometry Dash Runner',
      'STAGE_AUDIO': 'Paseo en 1ra persona con audio espacial reactivo',
      'STORY_SCROLL': 'Lectura completa de crónica en Scrollytelling',
      'CV_DOWNLOAD': 'Descarga de CV / Contacto empresarial',
      'NEW_VISITOR': 'Visitante único detectado en portafolio'
    };

    const newEv: PortfolioEvent = {
      id: `EV-${Math.floor(100 + Math.random() * 900)}`,
      time: new Date().toLocaleTimeString(),
      category: type,
      label: eventLabels[type],
      device: 'Prueba Manual · AI Studio Browser',
      country: 'Sesión Local (Developer)',
      latencyMs: cloudLatency
    };

    setEvents((prev) => [newEv, ...prev.slice(0, 24)]);
    setTotalInteractions((prev) => prev + 1);
    if (type === 'NEW_VISITOR') setActiveVisitors((prev) => prev + 1);
  };

  // Export telemetries as JSON
  const handleExportData = () => {
    soundEngine.playClickSound();
    const payload = {
      exportedAt: new Date().toISOString(),
      analyticsSummary: {
        activeVisitors,
        totalInteractions,
        engagementRate: '76.4%',
        cloudLatencyMs: cloudLatency
      },
      events
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-telemetry-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearBuffer = () => {
    soundEngine.playClickSound();
    setEvents([]);
  };

  const getCategoryIcon = (cat: PortfolioEvent['category']) => {
    switch (cat) {
      case '3D_SHOWCASE': return <Box className="w-3.5 h-3.5 text-[#00FFFF] shrink-0" />;
      case 'SPARK_GAME': return <Gamepad2 className="w-3.5 h-3.5 text-[#FDCC0D] shrink-0" />;
      case 'STAGE_AUDIO': return <Compass className="w-3.5 h-3.5 text-[#4A7AB7] shrink-0" />;
      case 'STORY_SCROLL': return <Eye className="w-3.5 h-3.5 text-[#B87333] shrink-0" />;
      case 'CV_DOWNLOAD': return <FileText className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
      case 'NEW_VISITOR': return <Users className="w-3.5 h-3.5 text-[#FDCC0D] shrink-0" />;
    }
  };

  // SVG Chart path calculation
  const chartPath = useMemo(() => {
    const maxVal = Math.max(...timeSeries, 140);
    const minVal = Math.min(...timeSeries, 10);
    const w = 480;
    const h = 110;
    const padding = 10;

    const points = timeSeries.map((val, idx) => {
      const x = padding + (idx / (timeSeries.length - 1)) * (w - padding * 2);
      const y = h - padding - ((val - minVal) / (maxVal - minVal)) * (h - padding * 2);
      return `${x},${y}`;
    });

    return `M ${points.join(' L ')}`;
  }, [timeSeries]);

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-[#050505]">
      {/* Top HUD Telemetry Header */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="flex items-center gap-3 bg-[#0a0f18]/90 backdrop-blur-md border border-[#32527B]/40 px-3.5 py-2 rounded-lg pointer-events-auto shadow-lg max-w-full overflow-x-auto">
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#00FFFF]" />
            <span className="text-xs font-bold text-slate-200 font-heading whitespace-nowrap">
              SYSTEM.DASHBOARD
            </span>
          </div>
          <span className="text-slate-600 shrink-0">·</span>
          <div className="text-xs text-slate-400 font-mono-telemetry shrink-0 flex items-center gap-1.5 whitespace-nowrap">
            <Cloud className="w-3.5 h-3.5 text-[#FDCC0D]" />
            <span>CLOUD SYNC: </span>
            <span className="text-[#00FFFF] font-bold">ONLINE ({cloudLatency}ms)</span>
          </div>
          <span className="text-slate-600 shrink-0">·</span>
          <div className="text-xs text-slate-400 font-mono-telemetry shrink-0 whitespace-nowrap">
            <span>EVENTOS ACTIVOS: </span>
            <span className="text-emerald-400 font-bold">{events.length}</span>
          </div>
        </div>

        {/* Dashboard Actions */}
        <div className="flex items-center gap-2 pointer-events-auto shrink-0">
          <button
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors whitespace-nowrap ${
              isLiveStreaming
                ? 'bg-[#111a29]/90 border-[#32527B]/50 text-slate-200 hover:bg-[#1a283e]'
                : 'bg-amber-500/20 border-amber-400 text-amber-300'
            }`}
          >
            {isLiveStreaming ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{isLiveStreaming ? 'Pausar Flujo' : 'Reanudar'}</span>
          </button>

          <button
            onClick={handleExportData}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#111a29]/90 hover:bg-[#1a283e] text-slate-200 border border-[#32527B]/50 rounded-md transition-colors whitespace-nowrap"
            title="Exportar datos en formato JSON"
          >
            <Download className="w-3.5 h-3.5 text-[#00FFFF]" />
            <span>Exportar JSON</span>
          </button>

          <button
            onClick={onOpenRemix}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#00FFFF] hover:bg-[#00d0d0] text-black font-semibold rounded-md shadow-md transition-colors whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Remix en AI Studio</span>
          </button>
        </div>
      </div>

      {/* Main Dashboard Scrollable Content */}
      <div className="relative flex-1 w-full h-full pt-16 pb-12 px-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Top 4 Primary KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* KPI 1: Active Visitors */}
            <div className="p-4 bg-[#0a0f18]/90 border border-[#32527B]/40 rounded-xl flex flex-col justify-between shadow-md">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium font-heading">Visitantes en Vivo</span>
                <Users className="w-4 h-4 text-[#FDCC0D]" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono-telemetry text-white">{activeVisitors}</span>
                <span className="text-[11px] text-emerald-400 font-mono-telemetry">+14% vs última hora</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-2 truncate">
                Dispositivos explorando tu portafolio en tiempo real
              </span>
            </div>

            {/* KPI 2: Total Interactions */}
            <div className="p-4 bg-[#0a0f18]/90 border border-[#32527B]/40 rounded-xl flex flex-col justify-between shadow-md">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium font-heading">Total Interacciones</span>
                <MousePointerClick className="w-4 h-4 text-[#00FFFF]" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono-telemetry text-[#00FFFF]">
                  {totalInteractions.toLocaleString()}
                </span>
                <span className="text-[11px] text-slate-400 font-mono-telemetry">clics y eventos</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-2 truncate">
                Giros 3D, saltos en runner, descargas y navegación
              </span>
            </div>

            {/* KPI 3: Engagement Rate */}
            <div className="p-4 bg-[#0a0f18]/90 border border-[#32527B]/40 rounded-xl flex flex-col justify-between shadow-md">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium font-heading">Tasa de Exploración</span>
                <TrendingUp className="w-4 h-4 text-[#FDCC0D]" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono-telemetry text-[#FDCC0D]">76.4%</span>
                <span className="text-[11px] text-emerald-400 font-mono-telemetry">Alta retención</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-2 truncate">
                Tiempo promedio de sesión: 3m 42s
              </span>
            </div>

            {/* KPI 4: Cloud Latency */}
            <div className="p-4 bg-[#0a0f18]/90 border border-[#32527B]/40 rounded-xl flex flex-col justify-between shadow-md">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium font-heading">Latencia Cloud Sync</span>
                <Activity className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono-telemetry text-emerald-400">{cloudLatency} ms</span>
                <span className="text-[11px] text-slate-400 font-mono-telemetry">Edge Firestore</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-2 truncate">
                Sincronización instantánea de telemetría sin cuellos de botella
              </span>
            </div>
          </div>

          {/* 2-Column Split: Ingestion Chart & Event Breakdown (Left) vs Live Event Feed (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[460px]">
            {/* Left 7 Columns: Time Series Chart & Event Breakdown */}
            <div className="lg:col-span-7 space-y-6">
              {/* Ingestion Time-Series Line Chart */}
              <div className="p-4 bg-[#0a0f18]/90 border border-[#32527B]/40 rounded-xl shadow-md">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#32527B]/30">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#00FFFF]" />
                    <span className="text-xs font-bold font-heading text-white">
                      Curva de Ingestión de Eventos en Tiempo Real
                    </span>
                  </div>
                  <span className="text-[11px] font-mono-telemetry text-slate-400">
                    Últimos 15 intervalos
                  </span>
                </div>

                <div className="w-full h-32 bg-[#050505] rounded-lg border border-[#32527B]/30 p-2 flex items-center justify-center overflow-hidden">
                  <svg viewBox="0 0 480 110" className="w-full h-full preserve-3d">
                    {/* Horizontal grid guide lines */}
                    <line x1="10" y1="20" x2="470" y2="20" stroke="rgba(50, 82, 123, 0.2)" strokeDasharray="4 4" />
                    <line x1="10" y1="55" x2="470" y2="55" stroke="rgba(50, 82, 123, 0.2)" strokeDasharray="4 4" />
                    <line x1="10" y1="90" x2="470" y2="90" stroke="rgba(50, 82, 123, 0.2)" strokeDasharray="4 4" />

                    {/* Gradient Fill under path */}
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00FFFF" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#00FFFF" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Main Line Path */}
                    <path d={chartPath} fill="none" stroke="#00FFFF" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 font-mono-telemetry">
                  <span>-15 min</span>
                  <span className="text-[#FDCC0D]">Picos de actividad: 118 ops/m</span>
                  <span>Ahora</span>
                </div>
              </div>

              {/* Event Distribution Breakdown & Quick Simulator */}
              <div className="p-4 bg-[#0a0f18]/90 border border-[#32527B]/40 rounded-xl shadow-md space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#32527B]/30">
                  <span className="text-xs font-bold font-heading text-white">
                    Desglose de Interés de Visitantes en Portafolio
                  </span>
                  <span className="text-[11px] font-mono-telemetry text-slate-400">100% Total</span>
                </div>

                {/* Progress bars of user interactions */}
                <div className="space-y-2.5 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span className="flex items-center gap-1.5">
                        <Box className="w-3.5 h-3.5 text-[#00FFFF]" />
                        <span>Visor de Arquitectura 3D (Showcase)</span>
                      </span>
                      <span className="font-mono-telemetry font-bold text-[#00FFFF]">38%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-[#00FFFF]" style={{ width: '38%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span className="flex items-center gap-1.5">
                        <Gamepad2 className="w-3.5 h-3.5 text-[#FDCC0D]" />
                        <span>Juegos & Físicas (Spark Runner)</span>
                      </span>
                      <span className="font-mono-telemetry font-bold text-[#FDCC0D]">28%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-[#FDCC0D]" style={{ width: '28%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Descarga de CV & Dossier Técnico</span>
                      </span>
                      <span className="font-mono-telemetry font-bold text-emerald-400">18%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400" style={{ width: '18%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span className="flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-[#B87333]" />
                        <span>Narrativa Scrollytelling (Story)</span>
                      </span>
                      <span className="font-mono-telemetry font-bold text-[#B87333]">16%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-[#B87333]" style={{ width: '16%' }} />
                    </div>
                  </div>
                </div>

                {/* Quick Interactive Event Simulator Bar */}
                <div className="pt-3 border-t border-[#32527B]/30">
                  <span className="text-[11px] font-semibold text-slate-400 block mb-2 font-heading">
                    Simular Telemetría Inmediata:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => simulateEvent('NEW_VISITOR')}
                      className="px-2.5 py-1 text-xs bg-white/5 hover:bg-white/10 text-slate-200 border border-[#32527B]/40 rounded transition-colors flex items-center gap-1"
                    >
                      <PlusCircle className="w-3.5 h-3.5 text-[#FDCC0D]" />
                      <span>+ Visitante</span>
                    </button>
                    <button
                      onClick={() => simulateEvent('3D_SHOWCASE')}
                      className="px-2.5 py-1 text-xs bg-white/5 hover:bg-white/10 text-slate-200 border border-[#32527B]/40 rounded transition-colors flex items-center gap-1"
                    >
                      <Box className="w-3.5 h-3.5 text-[#00FFFF]" />
                      <span>Giro 3D</span>
                    </button>
                    <button
                      onClick={() => simulateEvent('CV_DOWNLOAD')}
                      className="px-2.5 py-1 text-xs bg-white/5 hover:bg-white/10 text-slate-200 border border-[#32527B]/40 rounded transition-colors flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Descarga CV</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Live Event Feed Table */}
            <div className="lg:col-span-5 bg-[#0a0f18]/90 border border-[#32527B]/40 rounded-xl p-4 flex flex-col shadow-md">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#32527B]/30">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-bold font-heading text-white">
                    Registro de Eventos en Tiempo Real
                  </span>
                </div>
                <button
                  onClick={clearBuffer}
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  title="Limpiar registro"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Scrollable Event Feed */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 font-mono-telemetry text-xs min-h-[300px]">
                {events.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-slate-500 text-xs py-12">
                    Buffer vacío. Haz clic en "Simular" para generar eventos.
                  </div>
                ) : (
                  events.map((ev) => (
                    <div
                      key={ev.id}
                      className="p-2.5 rounded bg-[#050505]/80 border border-[#32527B]/30 flex flex-col gap-1 transition-all hover:border-[#00FFFF]/40"
                    >
                      <div className="flex items-center justify-between text-[11px] gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          {getCategoryIcon(ev.category)}
                          <span className="text-slate-200 font-bold truncate">{ev.label}</span>
                        </div>
                        <span className="text-slate-500 shrink-0 text-[10px]">{ev.time}</span>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-white/5 gap-2">
                        <span className="truncate">{ev.device}</span>
                        <span className="text-[#00FFFF] shrink-0">{ev.latencyMs}ms</span>
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        Origen: {ev.country}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar Drawer */}
      <div className="z-10 bg-[#0a0f18] border-t border-[#32527B]/30 px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
        <div className="flex items-center gap-4 text-slate-400">
          <span>Propósito: <strong className="text-slate-200">Recolección & Visualización de Datos de Portafolio</strong></span>
          <span className="text-slate-600">·</span>
          <span>Sincronización: <strong className="text-emerald-400">Firestore Ready</strong></span>
        </div>

        <div className="text-slate-400 text-[11px] truncate">
          Módulo: <span className="font-mono-telemetry text-slate-200">modules/system-module.js</span>
        </div>
      </div>
    </div>
  );
};
