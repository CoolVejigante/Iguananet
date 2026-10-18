/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * SGX OMNI-CANVAS | Spatialgineers LLC
 * Panel Central de Configuración (Baseline Template)
 */

export type PillarId = 'SPARK' | 'STAGE' | 'SHOWCASE' | 'STORY' | 'SYSTEM' | 'SYNTHESIZE';

export interface PillarMetadata {
  id: PillarId;
  name: string;
  codename: string;
  archetype: string;
  tagline: string;
  accentColor: string;
  moduleFile: string;
  iconName: string;
  scopeDescription: string;
  creativePossibilities: string[];
  challenge: string;
  promptExample: string;
}

export const PILLARS: Record<PillarId, PillarMetadata> = {
  SPARK: {
    id: 'SPARK',
    name: 'SGX.Spark',
    codename: 'The Arena',
    archetype: 'Los Interactores',
    tagline: 'Gamificación, mecánicas interactivas, sistemas de físicas y retos de reflejos.',
    accentColor: '#FDCC0D',
    moduleFile: 'spark-module.js',
    iconName: 'Gamepad2',
    scopeDescription: 'Dominio de juegos, simulación física 2D/3D, bucles de gameplay, control de inputs y reglas lúdicas. La demo es un runner, pero el creador puede transformarlo en cualquier tipo de juego web o puzzle interactivo.',
    creativePossibilities: [
      'Videojuego web completo (Runner, Roguelike, Puzle, Arcade)',
      'Simulador físico de partículas o gravedad cósmica',
      'Portafolio gamificado donde se desbloquean proyectos con llaves'
    ],
    challenge: 'Modificar la generación de obstáculos, cambiar las leyes gravitatorias o sustituir completamente la lógica por un juego propio.',
    promptExample: 'Gemini, en spark-module.js quiero reemplazar el runner por un simulador espacial top-down donde controlo una nave con inercia y recolecto energía estelar.'
  },
  STAGE: {
    id: 'STAGE',
    name: 'SGX.Stage',
    codename: 'The Void',
    archetype: 'Los Showrunners',
    tagline: 'Espacios escénicos transitables, eventos en vivo y audio espacial reactivo.',
    accentColor: '#00FFFF',
    moduleFile: 'stage-module.js',
    iconName: 'Compass',
    scopeDescription: 'Dominio de espacios escénicos inmersivos en 1ra persona, acústica espacial 3D reactiva a la posición del espectador y eventos virtuales en vivo. No está limitado a una cuadrícula; puede ser un mundo completo.',
    creativePossibilities: [
      'Galería de arte virtual o museo explorable en 1ra persona',
      'Escenario para conciertos o sets virtuales con iluminación robótica',
      'Experiencia teatral interactiva donde cada sala es un proyecto'
    ],
    challenge: 'Importar un escenario arquitectónico personalizado, colocar balizas de audio reactivas y diseñar la coreografía espacial.',
    promptExample: 'Gemini, en stage-module.js quiero transformar este espacio en un templo submarino oscuro con luces volumétricas que reaccionen a la distancia de la cámara.'
  },
  SHOWCASE: {
    id: 'SHOWCASE',
    name: 'SGX.Showcase',
    codename: 'The Pedestal',
    archetype: 'Los Arquitectos Virtuales',
    tagline: 'Arquitectura virtual, gemelos digitales, entornos fotorrealistas PBR y forja de texturas.',
    accentColor: '#32527B',
    moduleFile: 'showcase-module.js',
    iconName: 'Box',
    scopeDescription: 'Dominio de gemelos digitales, maquetas 3D interactivas, visualizadores de productos o edificios y configuradores de materiales fotorealistas (PBR). El creador puede cargar sus propios GLB sin bloqueos de CORS.',
    creativePossibilities: [
      'Portafolio fotorrealista de edificios, pabellones o diseño de interiores',
      'Showroom interactivo de diseño industrial, moda digital o vehículos',
      'Visualizador científico de ingeniería aeroespacial con despiece'
    ],
    challenge: 'Cargar modelos .glb mediante decodificación Blob local e integrar configuradores de texturas y cámaras orbitales.',
    promptExample: 'Gemini, en showcase-module.js añade una interfaz para que el usuario pueda alternar entre vista exterior e interior de mi modelo arquitectónico .glb.'
  },
  STORY: {
    id: 'STORY',
    name: 'SGX.Story',
    codename: 'The Scroll',
    archetype: 'Los Loremasters',
    tagline: 'Narrativa humana y cultural inmersiva, novelas visuales y scrollytelling cinemático.',
    accentColor: '#B87333',
    moduleFile: 'story-module.js',
    iconName: 'BookOpen',
    scopeDescription: 'Dominio de narrativa visual, diseño sonoro ambiental y scrollytelling donde las acciones y el avance de lectura del espectador revelan arte, viñetas y tipografía coreografiada en 60 FPS.',
    creativePossibilities: [
      'Manifiesto de carrera o biografía profesional interactiva',
      'Novela gráfica o cómic digital con viñetas que cobran vida',
      'Documental interactivo de impacto cultural con audio ambiental'
    ],
    challenge: 'Programar eventos donde las ilustraciones, el diseño sonoro y el texto aparezcan dinámicamente con el scroll del usuario.',
    promptExample: 'Gemini, en story-module.js reemplaza los textos base por los 4 capítulos de mi viaje como diseñador, revelando bocetos en parallax al avanzar.'
  },
  SYSTEM: {
    id: 'SYSTEM',
    name: 'SGX.System',
    codename: 'The Console',
    archetype: 'Los Code Weavers',
    tagline: 'Lógica pura, analíticas en tiempo real, cloud (Firestore) y herramientas de fabricación.',
    accentColor: '#4A7AB7',
    moduleFile: 'system-module.js',
    iconName: 'Terminal',
    scopeDescription: 'Dominio de arquitecturas de datos, telemetría de visitantes en tiempo real, integraciones con IA y herramientas de computación o manufactura. El creador puede monitorear su portafolio o desplegar herramientas de software.',
    creativePossibilities: [
      'Dashboard en tiempo real de analíticas y telemetría de portafolio',
      'Consola de control interactiva para APIs o modelos de inteligencia artificial',
      'Herramienta de diseño generativo algorítmico o slicing para impresión 3D'
    ],
    challenge: 'Conectar recolección de eventos de visitantes, calcular métricas de retención o integrar Firebase Firestore en tiempo real.',
    promptExample: 'Gemini, en system-module.js conecta un mapa de calor que registre en qué partes del portafolio interactúan más los visitantes.'
  },
  SYNTHESIZE: {
    id: 'SYNTHESIZE',
    name: 'SGX.Synthesize',
    codename: 'The Apex',
    archetype: 'Los Magos del Futuro',
    tagline: 'Ecosistemas Enterprise que unifican pilares: 3D + Audio FFT + Telemetría + VJ Show.',
    accentColor: '#FDCC0D',
    moduleFile: 'synthesize-module.js',
    iconName: 'Zap',
    scopeDescription: 'Dominio de convergencia masiva: une 2 o más disciplinas en una experiencia unificada. Audio FFT en tiempo real modulando shaders GLSL, geometrías 3D vivas y controles de performance en vivo para eventos.',
    creativePossibilities: [
      'Visualizador para shows de música electrónica reactivo al micrófono',
      'Experiencia web experimental que fusiona minijuegos, maquetas 3D y telemetría',
      'Instalación artística digital controlada con teclado y sintetizador'
    ],
    challenge: 'Cruzar el análisis de frecuencias de audio con la geometría 3D y programar atajos globales de teclado para directos.',
    promptExample: 'Gemini, en synthesize-module.js haz que las frecuencias agudas dispersen una tormenta de partículas doradas mientras los graves deforman la malla central.'
  }
};

export interface SGXConfig {
  activePillar: PillarId;
  debugMode: boolean;
  showHUD: boolean;
  audioMuted: boolean;
  audioVolume: number;
  audioReactive: boolean;
  stageMode: boolean; // Full immersion mode (Grimorio Cap XVI: tecla F)
  performanceMode: 'HIGH' | 'BALANCED' | 'BATTERY_SAVER';
}

export const DEFAULT_CONFIG: SGXConfig = {
  activePillar: 'SHOWCASE',
  debugMode: false,
  showHUD: true,
  audioMuted: false,
  audioVolume: 0.65,
  audioReactive: true,
  stageMode: false,
  performanceMode: 'HIGH'
};
