/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * IguanaNet Internationalization & Language Context
 * Provides seamless English (EN) and Spanish (ES) localization.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { soundEngine } from '../services/sound-effects';

export type Language = 'es' | 'en';

export interface Translations {
  // Gatekeeper (Intro Terminal & Pre-boot)
  gatekeeper: {
    langSelectHeader: string;
    langSelectTitle: string;
    langSelectSubtitle: string;
    spanishTitle: string;
    spanishSubtitle: string;
    englishTitle: string;
    englishSubtitle: string;
    bootSeq1: string;
    bootSeq2: string;
    bootSeq3: string;
    bootSeq4: string;
    manifestoLabel: string;
    manifestoTypewriter: string;
    manifestoSubtitle: string;
    accessBtn: string;
    zeroFriction: string;
    stageHotkey: string;
    audioOn: string;
    audioOff: string;
    artistBadge: string;
    switchLangTooltip: string;
  };
  // Glass HUD (Top Navigation Bar)
  hud: {
    roleSubtitle: string;
    navInspectionBay: string;
    navCatalog: string;
    navManifesto: string;
    navRoadmap: string;
    introGate: string;
    introGateTooltip: string;
    audioTooltipOn: string;
    audioTooltipOff: string;
    stageTooltipExit: string;
    stageTooltipEnter: string;
    langToggleTooltip: string;
  };
  // Inspection Bay (3D WebGL Viewer)
  inspectionBay: {
    badge: string;
    title: string;
    subtitle: string;
    tabs: {
      terminal: string;
      drone: string;
      archviz: string;
      fusionCore: string;
      upload: string;
    };
    controlsTitle: string;
    wireframe: string;
    autoRotate: string;
    resetCam: string;
    exposure: string;
    telemetryTitle: string;
    vertices: string;
    triangles: string;
    drawCalls: string;
    dracoStatus: string;
    dracoValue: string;
    currentAsset: string;
    activeBadge: string;
    dragDropPrompt: string;
    orBrowse: string;
    loadingModel: string;
    modelDescriptions: {
      terminal: {
        title: string;
        category: string;
        description: string;
      };
      drone: {
        title: string;
        category: string;
        description: string;
      };
      archviz: {
        title: string;
        category: string;
        description: string;
      };
      fusionCore: {
        title: string;
        category: string;
        description: string;
      };
    };
  };
  // Production Catalog
  catalog: {
    badge: string;
    title: string;
    subtitle: string;
    inspectBtn: string;
    specsTextures: string;
    specsLighting: string;
    specsCompression: string;
    artworks: {
      art1: {
        title: string;
        category: string;
        description: string;
        textures: string;
        lighting: string;
      };
      art2: {
        title: string;
        category: string;
        description: string;
        textures: string;
        lighting: string;
      };
      art3: {
        title: string;
        category: string;
        description: string;
        textures: string;
        lighting: string;
      };
      art4: {
        title: string;
        category: string;
        description: string;
        textures: string;
        lighting: string;
      };
    };
  };
  // Identity Hub & Manifesto
  identityHub: {
    location: string;
    role: string;
    manifestoBadge: string;
    manifestoText: string;
    connectivityBadge: string;
    connectivitySub: string;
    artstationSub: string;
    linkedinSub: string;
    instagramSub: string;
  };
  // Collaboration & Contact
  collaboration: {
    title: string;
    gmailButton: string;
    gmailTooltip: string;
  };
  // Roadmap & Trajectory
  roadmap: {
    badge: string;
    title: string;
    missionBadge: string;
    missionQuote: string;
    missionAuthor: string;
    timelineTitle: string;
    timelineVersion: string;
    phase1: {
      tag: string;
      title: string;
      status: string;
      description: string;
    };
    phase2: {
      tag: string;
      title: string;
      status: string;
      description: string;
    };
    phase3: {
      tag: string;
      title: string;
      status: string;
      description: string;
    };
    footerStatus: string;
  };
}

export const translationsMap: Record<Language, Translations> = {
  es: {
    gatekeeper: {
      langSelectHeader: '// PROTOCOLO REGIONAL // REGIONAL PROTOCOL',
      langSelectTitle: 'SELECCIONE IDIOMA DEL SISTEMA',
      langSelectSubtitle: 'Elija el idioma del sitio antes de cargar la animación secuencial y el motor 3D WebGL.',
      spanishTitle: 'ESPAÑOL',
      spanishSubtitle: 'Castellano · Protocolo Primario',
      englishTitle: 'ENGLISH',
      englishSubtitle: 'International English Protocol',
      bootSeq1: 'BOOT_SEQUENCE: PROTOCOLO OMNI-CANVAS 3D',
      bootSeq2: 'WEBGL 2.0 & MOTOR THREE.JS R186 INICIALIZADOS',
      bootSeq3: 'DRACO LOADER v1.5.6 (GOOGLE CDN) & ROOM ENVIRONMENT',
      bootSeq4: 'JERARQUÍA DE 4 CAPAS MONTADA: VOID / DOM / HUD / GATEKEEPER',
      manifestoLabel: '// MANIFIESTO FUNDACIONAL',
      manifestoTypewriter: 'Ambición, Inmersión e Imaginación.',
      manifestoSubtitle: 'Portafolio interactivo 3D de alta fidelidad en tiempo real',
      accessBtn: '[ ACCEDER AL SISTEMA / ENTRANDO A UN MUNDO NUEVO ]',
      zeroFriction: 'Zero-Friction WebGL',
      stageHotkey: 'Presiona [F] para Modo Escenario',
      audioOn: 'AUDIO: ON',
      audioOff: 'AUDIO: OFF',
      artistBadge: 'LUIS CASANOVA · 3D ARTIST',
      switchLangTooltip: 'Cambiar a Inglés'
    },
    hud: {
      roleSubtitle: '3D Artist & Visual Dev',
      navInspectionBay: '[01 // INSPECTION BAY]',
      navCatalog: '[02 // CATÁLOGO 3D]',
      navManifesto: '[03 // MANIFIESTO & BIO]',
      navRoadmap: '[04 // ROADMAP]',
      introGate: 'Intro Gate',
      introGateTooltip: 'Volver a la Terminal de Acceso',
      audioTooltipOn: 'Silenciar Audio [M]',
      audioTooltipOff: 'Reanudar Audio [M]',
      stageTooltipExit: 'Salir de Modo Escenario [F]',
      stageTooltipEnter: 'Modo Escenario Completo [F]',
      langToggleTooltip: 'Alternar idioma (ES / EN)'
    },
    inspectionBay: {
      badge: '// VISOR 3D WEBGL DE ALTA FIDELIDAD',
      title: 'INSPECTION BAY // EVALUACIÓN DE ASSETS',
      subtitle: 'Prueba mallas interactivas, inspecciona topología PBR y carga tus propios archivos .GLB/.OBJ sin fricción.',
      tabs: {
        terminal: 'Teléfono Inteligente',
        drone: 'Iguana',
        archviz: 'Plato Arqueológico',
        fusionCore: 'Apartamento Retrofuturista',
        upload: 'Subir .GLB/.OBJ'
      },
      controlsTitle: '// CONTROLES DE VISUALIZACIÓN',
      wireframe: 'Malla / Wireframe',
      autoRotate: 'Rotación Auto',
      resetCam: 'Reiniciar Cámara',
      exposure: 'Exposición / Luz',
      telemetryTitle: '// TELEMETRÍA EN TIEMPO REAL',
      vertices: 'VÉRTICES',
      triangles: 'TRIÁNGULOS',
      drawCalls: 'LLAMADAS DRAW',
      dracoStatus: 'ESTADO DRACO',
      dracoValue: 'OPTIMIZADO (DRACO v1.5.6)',
      currentAsset: 'ASSET EN INSPECCIÓN:',
      activeBadge: 'ACTIVO',
      dragDropPrompt: 'Arrastra tu archivo .GLB, .GLTF o .OBJ aquí',
      orBrowse: 'o haz clic para explorar en tu equipo',
      loadingModel: 'Cargando modelo 3D y decodificando DRACO...',
      modelDescriptions: {
        terminal: {
          title: 'Teléfono Inteligente',
          category: 'Dispositivo Móvil & Hardware Retrofuturista',
          description: 'Smartphone modular retrofuturista modelado a mano en Blender con acabado negro titanio, pantalla táctil y botones laterales.'
        },
        drone: {
          title: 'Iguana',
          category: 'Mascota Cibernética & Escultura 3D',
          description: 'Escultura emblemática de la Iguana modelada a mano en Blender con cresta bioluminiscente y topología anatómica en tiempo real.'
        },
        archviz: {
          title: 'Plato Arqueológico',
          category: 'Patrimonio Cultural & Arqueología',
          description: 'Reconstrucción arqueológica de plato ceremonial con iconografía ancestral, pátina porosa y compresión DRACO aplicada en Blender.'
        },
        fusionCore: {
          title: 'Apartamento Retrofuturista',
          category: 'ArchViz Modular Concept',
          description: 'Concepto de apartamento modular con arquitectura retrofuturista, grandes ventanales y compresión DRACO v1.5.6.'
        }
      }
    },
    catalog: {
      badge: '// CATÁLOGO DE PRODUCCIÓN',
      title: 'OBRAS PREVIAS & PROPS RETRO-INDUSTRIALES',
      subtitle: 'PRUEBA CADA MODELO EN VIVO EN EL INSPECTION BAY SUPERIOR',
      inspectBtn: 'Inspeccionar 3D',
      specsTextures: 'TEXTURAS:',
      specsLighting: 'ILUMINACIÓN:',
      specsCompression: 'COMPRESIÓN:',
      artworks: {
        art1: {
          title: 'Telefono Inteligente',
          category: 'Dispositivo Móvil & Hardware Retrofuturista',
          description: 'Concepto de teléfono inteligente retrofuturista con chasis modular biselado, acabado negro mate, botones metálicos laterales y display táctil de alta definición.',
          textures: 'PBR Titanio Negro & Biseles',
          lighting: 'Micro-facet Specular / PBR'
        },
        art2: {
          title: 'Iguana',
          category: 'Mascota & Escultura 3D',
          description: 'Mascota emblemática cibernética Iguana con cresta bioluminiscente, escamas metálicas facetadas y estructura anatómica optimizada en tiempo real.',
          textures: 'PBR Dual-Coat Anodizado',
          lighting: 'Micro-facet Specular'
        },
        art3: {
          title: 'Plato Arqueológico',
          category: 'Patrimonio Cultural & Arqueología',
          description: 'Reconstrucción tridimensional de plato ceremonial arqueológico con iconografía tallada, textura cerámica porosa y pátina de desgaste milenario.',
          textures: 'Cerámica Ancestral & Arcilla',
          lighting: 'Micro-facet Roughness / PBR'
        },
        art4: {
          title: 'Concepto de Apartamento Retrofuturista',
          category: 'ArchViz Modular Concept',
          description: 'Pabellón habitacional y concepto de apartamento modular retrofuturista con pórticos voladizos, ventanales panorámicos y estética brutalista contemporánea.',
          textures: 'Concreto & Vidrio Dieléctrico',
          lighting: 'Transmission 0.9 / ACES'
        }
      }
    },
    identityHub: {
      location: '// HUMACAO, PUERTO RICO',
      role: '3D Artist & Visual Developer · Props, ArchViz & Retro-Industrial',
      manifestoBadge: '// MANIFIESTO PROFESIONAL Y PROPUESTA DE VALOR',
      manifestoText: '"Saludos, soy Luis Casanova, 3D Artist y Visual Developer especializado en props, ArchViz y diseño industrial y artístico. Resuelvo la incertidumbre de los directores de arte e indie game devs que contratan a ciegas sin conocer la optimización ni la escala real de los modelos. Logro mediante un visor WebGL de inspección \'Inspection Bay\', donde pueden probar los assets tridimensionales en vivo, alternar wireframes, inspeccionar vértices y polígonos y evaluar texturas PBR sin fricción ni descargas. Y por eso es cósmicamente interesante."',
      connectivityBadge: '// RED DE CONECTIVIDAD & PORTAFOLIO EN VIVO',
      connectivitySub: 'ENLACES RETRO-ILUMINADOS',
      artstationSub: 'Galería de Props 3D & ArchViz',
      linkedinSub: 'Trayectoria & Producción',
      instagramSub: 'WIPs, Renders & Wireframes'
    },
    collaboration: {
      title: '¿Listo para colaborar en mis o tus próximos proyectos?',
      gmailButton: 'Redactar en Gmail',
      gmailTooltip: 'Enviar correo a luis.e.a.fontanez.casanova@gmail.com'
    },
    roadmap: {
      badge: 'SECCIÓN 3 // MATRIZ DE TRAYECTORIA & ROADMAP',
      title: 'VISIÓN ESTRATÉGICA IGUANA3D',
      missionBadge: '// DECLARACIÓN DE MISIÓN OFICIAL IGUANA3D',
      missionQuote: '"Nuestra visión no es solo improvisar tus assets u otros trabajos, Iguana3D está también enfocado en la contribución visual de cada tipo de industria relacionada para cementar la nueva generacion de desarolladores encargado de cementear propiedad intelectual cautivadora y imposible de despegar."',
      missionAuthor: '— Luis Casanova, Fundador de Iguana3D & Desarrollador Visual 3D',
      timelineTitle: 'CRONOGRAMA DE EXPANSIÓN TECNOLÓGICA & CREATIVA',
      timelineVersion: 'TIMELINE V2026-2027',
      phase1: {
        tag: 'FASE 1 // DESPLIEGUE FUNDACIONAL',
        title: 'WebGL Portfolio Launch (IguanaNet)',
        status: '✓ COMPLETADO & ACTIVO',
        description: 'Despliegue de la arquitectura de 4 capas: The Void (Three.js), DOM Matrix (Scrollytelling), Glass HUD (Telemetría viva) y Gatekeeper.'
      },
      phase2: {
        tag: 'FASE 2 // EN DESARROLLO',
        title: 'Expansión de Librería de Props & Assets DRACO',
        status: 'EN PROGRESO (Q2 2026)',
        description: 'Integración de colecciones de props sci-fi y retro-industriales con compresión geométrica DRACO v1.5.6 lista para motores de juegos como Unreal Engine 5 y Unity.'
      },
      phase3: {
        tag: 'FASE 3 // HORIZONTE 2027',
        title: 'Pipeline Interactivo de ArchViz & Configuración PBR',
        status: 'PLANIFICADO',
        description: 'Entornos habitacionales inmersivos de renderizado en tiempo real, shaders de iluminación global e interactividad espacial multiusuario.'
      },
      footerStatus: 'SISTEMA OPERATIVO // WEBGL 2.0 ONLINE // HUMACAO, PR'
    }
  },
  en: {
    gatekeeper: {
      langSelectHeader: '// REGIONAL PROTOCOL // SELECT LANGUAGE',
      langSelectTitle: 'SELECT SYSTEM LANGUAGE',
      langSelectSubtitle: 'Select your language before loading the sequential boot sequence and 3D WebGL engine.',
      spanishTitle: 'ESPAÑOL',
      spanishSubtitle: 'Spanish · Primary Protocol',
      englishTitle: 'ENGLISH',
      englishSubtitle: 'International English Protocol',
      bootSeq1: 'BOOT_SEQUENCE: 3D OMNI-CANVAS PROTOCOL',
      bootSeq2: 'WEBGL 2.0 & THREE.JS R186 ENGINE INITIALIZED',
      bootSeq3: 'DRACO LOADER v1.5.6 (GOOGLE CDN) & ROOM ENVIRONMENT',
      bootSeq4: '4-LAYER HIERARCHY MOUNTED: VOID / DOM / HUD / GATEKEEPER',
      manifestoLabel: '// FOUNDATIONAL MANIFESTO',
      manifestoTypewriter: 'Ambition, Immersion and Imagination.',
      manifestoSubtitle: 'Real-time high-fidelity 3D interactive portfolio',
      accessBtn: '[ ACCESS SYSTEM / ENTERING A NEW WORLD ]',
      zeroFriction: 'Zero-Friction WebGL',
      stageHotkey: 'Press [F] for Stage Mode',
      audioOn: 'AUDIO: ON',
      audioOff: 'AUDIO: OFF',
      artistBadge: 'LUIS CASANOVA · 3D ARTIST',
      switchLangTooltip: 'Cambiar a Español'
    },
    hud: {
      roleSubtitle: '3D Artist & Visual Dev',
      navInspectionBay: '[01 // INSPECTION BAY]',
      navCatalog: '[02 // 3D CATALOG]',
      navManifesto: '[03 // MANIFESTO & BIO]',
      navRoadmap: '[04 // ROADMAP]',
      introGate: 'Intro Gate',
      introGateTooltip: 'Return to Access Terminal',
      audioTooltipOn: 'Mute Audio [M]',
      audioTooltipOff: 'Unmute Audio [M]',
      stageTooltipExit: 'Exit Stage Mode [F]',
      stageTooltipEnter: 'Fullscreen Stage Mode [F]',
      langToggleTooltip: 'Toggle language (ES / EN)'
    },
    inspectionBay: {
      badge: '// HIGH-FIDELITY WEBGL 3D VIEWER',
      title: 'INSPECTION BAY // ASSET EVALUATION',
      subtitle: 'Test interactive meshes, inspect PBR topology, and upload custom .GLB/.OBJ files with zero friction.',
      tabs: {
        terminal: 'Smartphone',
        drone: 'Iguana',
        archviz: 'Archaeological Plate',
        fusionCore: 'Retrofuturistic Apartment',
        upload: 'Upload .GLB/.OBJ'
      },
      controlsTitle: '// DISPLAY CONTROLS',
      wireframe: 'Wireframe Mesh',
      autoRotate: 'Auto Rotation',
      resetCam: 'Reset Camera',
      exposure: 'Exposure / Light',
      telemetryTitle: '// REAL-TIME TELEMETRY',
      vertices: 'VERTICES',
      triangles: 'TRIANGLES',
      drawCalls: 'DRAW CALLS',
      dracoStatus: 'DRACO STATUS',
      dracoValue: 'OPTIMIZED (DRACO v1.5.6)',
      currentAsset: 'ACTIVE ASSET:',
      activeBadge: 'ACTIVE',
      dragDropPrompt: 'Drag & drop your .GLB, .GLTF, or .OBJ file here',
      orBrowse: 'or click to browse your files',
      loadingModel: 'Loading 3D model and decoding DRACO...',
      modelDescriptions: {
        terminal: {
          title: 'Smartphone',
          category: 'Mobile Device & Retrofuturistic Hardware',
          description: 'Retrofuturistic modular smartphone hand-crafted in Blender with black titanium finish, touchscreen, and lateral buttons.'
        },
        drone: {
          title: 'Iguana',
          category: 'Cybernetic Mascot & 3D Sculpture',
          description: 'Signature cybernetic Iguana sculpture hand-crafted in Blender with bioluminescent crest and real-time anatomical topology.'
        },
        archviz: {
          title: 'Archaeological Plate',
          category: 'Cultural Heritage & Archaeology',
          description: 'Archaeological reconstruction of ceremonial plate with ancestral iconography, porous clay patina, and DRACO compression applied in Blender.'
        },
        fusionCore: {
          title: 'Retrofuturistic Apartment',
          category: 'Modular ArchViz Concept',
          description: 'Modular apartment concept featuring retrofuturistic architecture, sweeping panoramic windows, and DRACO v1.5.6 compression.'
        }
      }
    },
    catalog: {
      badge: '// PRODUCTION CATALOG',
      title: 'PREVIOUS WORKS & RETRO-INDUSTRIAL PROPS',
      subtitle: 'TEST EACH MODEL LIVE IN THE INSPECTION BAY ABOVE',
      inspectBtn: 'Inspect 3D',
      specsTextures: 'TEXTURES:',
      specsLighting: 'LIGHTING:',
      specsCompression: 'COMPRESSION:',
      artworks: {
        art1: {
          title: 'Smartphone',
          category: 'Mobile Device & Retrofuturistic Hardware',
          description: 'Retrofuturistic smartphone concept featuring beveled modular chassis, matte black finish, lateral metallic buttons, and high-definition touch display.',
          textures: 'PBR Black Titanium & Bevels',
          lighting: 'Micro-facet Specular / PBR'
        },
        art2: {
          title: 'Iguana',
          category: 'Mascot & 3D Sculpture',
          description: 'Emblematic cybernetic Iguana mascot featuring bioluminescent crest, faceted metallic scales, and real-time optimized anatomical structure.',
          textures: 'PBR Anodized Dual-Coat',
          lighting: 'Micro-facet Specular'
        },
        art3: {
          title: 'Archaeological Plate',
          category: 'Cultural Heritage & Archaeology',
          description: 'Three-dimensional reconstruction of a ceremonial archaeological plate with carved iconography, porous ceramic texture, and millennial patina.',
          textures: 'Ancestral Ceramic & Clay',
          lighting: 'Micro-facet Roughness / PBR'
        },
        art4: {
          title: 'Retrofuturistic Apartment Concept',
          category: 'Modular ArchViz Concept',
          description: 'Residential pavilion and retrofuturistic modular apartment concept with cantilevered porticos, panoramic windows, and contemporary brutalist aesthetics.',
          textures: 'Concrete & Dielectric Glass',
          lighting: 'Transmission 0.9 / ACES'
        }
      }
    },
    identityHub: {
      location: '// HUMACAO, PUERTO RICO',
      role: '3D Artist & Visual Developer · Props, ArchViz & Retro-Industrial',
      manifestoBadge: '// PROFESSIONAL MANIFESTO & VALUE PROPOSITION',
      manifestoText: '"Greetings, I am Luis Casanova, 3D Artist and Visual Developer specializing in props, ArchViz, and industrial & artistic design. I resolve the uncertainty of art directors and indie game devs who hire blindly without knowing the true optimization or scale of 3D models. I achieve this through an interactive WebGL \'Inspection Bay\' viewer, where they can test 3D assets live, toggle wireframes, inspect vertices and polygons, and evaluate PBR textures with zero friction or downloads. And that makes it cosmically captivating."',
      connectivityBadge: '// CONNECTIVITY NETWORK & LIVE PORTFOLIO',
      connectivitySub: 'RETRO-ILLUMINATED LINKS',
      artstationSub: '3D Props & ArchViz Gallery',
      linkedinSub: 'Career Trajectory & Production',
      instagramSub: 'WIPs, Renders & Wireframes'
    },
    collaboration: {
      title: 'Ready to collaborate on upcoming projects?',
      gmailButton: 'Compose in Gmail',
      gmailTooltip: 'Send email to luis.e.a.fontanez.casanova@gmail.com'
    },
    roadmap: {
      badge: 'SECTION 3 // TRAJECTORY MATRIX & ROADMAP',
      title: 'IGUANA3D STRATEGIC VISION',
      missionBadge: '// OFFICIAL IGUANA3D MISSION STATEMENT',
      missionQuote: '"Our vision is not merely to improvise your assets or other projects; Iguana3D is equally focused on making visual contributions across every related industry to cement the next generation of developers tasked with establishing captivating, unforgettable intellectual property."',
      missionAuthor: '— Luis Casanova, Founder of Iguana3D & 3D Visual Developer',
      timelineTitle: 'TECHNOLOGICAL & CREATIVE EXPANSION TIMELINE',
      timelineVersion: 'TIMELINE V2026-2027',
      phase1: {
        tag: 'PHASE 1 // FOUNDATIONAL DEPLOYMENT',
        title: 'WebGL Portfolio Launch (IguanaNet)',
        status: '✓ COMPLETED & ACTIVE',
        description: 'Deployment of 4-layer architecture: The Void (Three.js), DOM Matrix (Scrollytelling), Glass HUD (Live Telemetry), and Gatekeeper.'
      },
      phase2: {
        tag: 'PHASE 2 // IN DEVELOPMENT',
        title: 'DRACO Props & Asset Library Expansion',
        status: 'IN PROGRESS (Q2 2026)',
        description: 'Integration of sci-fi and retro-industrial prop collections with DRACO v1.5.6 geometry compression ready for game engines like Unreal Engine 5 and Unity.'
      },
      phase3: {
        tag: 'PHASE 3 // 2027 HORIZON',
        title: 'Interactive ArchViz Pipeline & PBR Configurator',
        status: 'PLANNED',
        description: 'Real-time immersive architectural environments, global illumination shaders, and spatial multi-user interactivity.'
      },
      footerStatus: 'SYSTEM OPERATIONAL // WEBGL 2.0 ONLINE // HUMACAO, PR'
    }
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'iguananet_site_language';

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'es' || saved === 'en') {
        return saved;
      }
    }
    return 'es';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, lang);
    }
  };

  const toggleLanguage = () => {
    const nextLang: Language = language === 'es' ? 'en' : 'es';
    soundEngine.playClickSound();
    setLanguage(nextLang);
  };

  const t = translationsMap[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
