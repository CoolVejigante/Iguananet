/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * SGX OMNI-CANVAS - Clean Modular Source Code Bank
 * These files represent the modular code structure for AI Studio remixes.
 */

export const SGX_CONFIG_JS = `/**
 * ========================================================
 * SGX OMNI-CANVAS: sgx-config.js (Panel de Control Central)
 * ========================================================
 * @philosophy: Los pilares NO son moldes rígidos. El creador puede
 * transformar su portafolio interactivo en lo que le dé la gana.
 * Consulta 'SGX_PILLARS_MANIFEST.md' para ver el scope completo de cada dominio.
 *
 * @active_pillar_options:
 * 'SPARK'      -> Los Interactores: Gamificación, físicas 2D/3D y retos de juego.
 * 'STAGE'      -> Los Showrunners: Escenarios transitables en 1ra persona y audio espacial.
 * 'SHOWCASE'   -> Los Arquitectos Virtuales: Maquetas 3D PBR, gemelos digitales y forja de texturas.
 * 'STORY'      -> Los Loremasters: Scrollytelling, novelas gráficas y narrativa con audio.
 * 'SYSTEM'     -> Los Code Weavers: Lógica pura, analíticas en tiempo real y cloud (Firestore).
 * 'SYNTHESIZE' -> Los Magos del Futuro: Convergencia multi-pilar (3D + VJ Audio FFT + telemetría).
 */

export const ACTIVE_PILLAR = 'SHOWCASE';

export const CREATOR_PROFILE = {
  authorName: 'Spatialgineers Creator',
  specialtyRole: 'Virtual Architect & Creative Technologist',
  projectTitle: 'Interactive Spatial Portfolio',
  contactEmail: 'creator@spatialgineers.com',
  socialLinks: {
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    artstation: 'https://artstation.com'
  }
};

export const SGX_SETTINGS = {
  appName: 'SGX Omni-Canvas Modular Portfolio',
  version: '2026.5',
  debugMode: false,
  showTelemetryHUD: true,
  audioReactive: true,
  targetFPS: 60,
  palette: {
    metallicBlue: '#32527B',
    metallicGold: '#FDCC0D',
    neonCyan: '#00FFFF',
    copper: '#B87333',
    deepVoid: '#050505'
  }
};
`;

export const SPARK_MODULE_JS = `/**
 * ========================================================
 * MÓDULO SGX.Spark: Los Interactores (The Arena - Geometry Dash Runner)
 * ========================================================
 * Side-Runner 2D con desplazamiento infinito, gravedad,
 * rotación angular de cubo y generación procedural de obstáculos.
 * Reto de Aprendizaje: Agregar portales de velocidad, portales de gravedad
 * invertida o multiplicadores de combo de saltos.
 */

export class SparkRunnerModule {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.worldOffset = 0;
    this.speed = 6.8;
    this.attempt = 1;
    this.isDead = false;

    // Jugador (Cubo Geométrico)
    this.player = {
      x: 140,
      y: 0,
      size: 32,
      vy: 0,
      isGrounded: true,
      angle: 0
    };

    this.gravity = 0.88;
    this.jumpForce = -13.6;
    this.floorY = canvasElement.height - 75;

    // Obstáculos (Picos, bloques y orbes)
    this.obstacles = [
      { type: 'SPIKE', x: 500, y: this.floorY - 30, w: 30, h: 30 },
      { type: 'DOUBLE_SPIKE', x: 800, y: this.floorY - 30, w: 60, h: 30 },
      { type: 'BLOCK', x: 1100, y: this.floorY - 50, w: 60, h: 50 },
      { type: 'ORB', x: 1400, y: this.floorY - 85, w: 34, h: 34 }
    ];

    this.init();
  }

  init() {
    this.player.y = this.floorY - this.player.size / 2;
    window.addEventListener('keydown', (e) => {
      if (['Space', 'ArrowUp'].includes(e.code)) {
        e.preventDefault();
        this.jump();
      }
    });
    this.canvas.addEventListener('pointerdown', () => this.jump());
    this.loop();
  }

  jump() {
    if (this.isDead) {
      this.reset();
      return;
    }
    if (this.player.isGrounded) {
      this.player.vy = this.jumpForce;
      this.player.isGrounded = false;
    }
  }

  reset() {
    this.isDead = false;
    this.attempt++;
    this.worldOffset = 0;
    this.player.y = this.floorY - this.player.size / 2;
    this.player.vy = 0;
    this.player.angle = 0;
    this.player.isGrounded = true;
  }

  update() {
    if (this.isDead) return;

    this.worldOffset += this.speed;
    this.player.vy += this.gravity;
    this.player.y += this.player.vy;

    // Rotación angular en el aire
    if (!this.player.isGrounded) {
      this.player.angle += 0.14;
    } else {
      const snap = Math.round(this.player.angle / (Math.PI / 2)) * (Math.PI / 2);
      this.player.angle += (snap - this.player.angle) * 0.35;
    }

    // Suelo
    const half = this.player.size / 2;
    if (this.player.y + half >= this.floorY) {
      this.player.y = this.floorY - half;
      this.player.vy = 0;
      this.player.isGrounded = true;
    }

    // Detección de colisión con obstáculos
    const currentX = this.player.x + this.worldOffset;
    for (const obs of this.obstacles) {
      if (
        currentX + half > obs.x &&
        currentX - half < obs.x + obs.w &&
        this.player.y + half > obs.y &&
        this.player.y - half < obs.y + obs.h
      ) {
        this.isDead = true;
        setTimeout(() => this.reset(), 500);
        break;
      }
    }
  }

  render() {
    this.ctx.fillStyle = '#050505';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Suelo
    this.ctx.strokeStyle = '#00FFFF';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(0, this.floorY, this.canvas.width, 1);

    // Obstáculos
    this.obstacles.forEach((obs) => {
      const screenX = obs.x - this.worldOffset;
      if (obs.type === 'SPIKE') {
        this.ctx.fillStyle = '#00FFFF';
        this.ctx.beginPath();
        this.ctx.moveTo(screenX, obs.y + obs.h);
        this.ctx.lineTo(screenX + obs.w / 2, obs.y);
        this.ctx.lineTo(screenX + obs.w, obs.y + obs.h);
        this.ctx.fill();
      }
    });

    // Jugador (Cubo)
    this.ctx.save();
    this.ctx.translate(this.player.x, this.player.y);
    this.ctx.rotate(this.player.angle);
    this.ctx.fillStyle = '#FDCC0D';
    this.ctx.fillRect(-16, -16, 32, 32);
    this.ctx.restore();
  }

  loop() {
    this.update();
    this.render();
    requestAnimationFrame(() => this.loop());
  }
}
`;

export const STAGE_MODULE_JS = `/**
 * ========================================================
 * MÓDULO SGX.Stage: Los Showrunners (The Void)
 * ========================================================
 * Entorno 3D transitable en primera persona con balizas
 * de audio espacial y disparadores en el DOM.
 * Reto de Aprendizaje: Importar escenario arquitectónico y
 * sincronizar balizas acústicas al movimiento del observador.
 */
import * as THREE from 'three';

export class StageModule {
  constructor(containerElement) {
    this.container = containerElement;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(65, containerElement.clientWidth / containerElement.clientHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    this.beacons = [];
    this.moveState = { forward: false, backward: false, left: false, right: false };
    this.camEuler = new THREE.Euler(0, 0, 0, 'YXZ');
    
    this.init();
  }

  init() {
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    this.camera.position.set(0, 1.7, 8);
    this.scene.fog = new THREE.FogExp2(0x050505, 0.035);

    // Suelo cuadriculado Holodeck
    const grid = new THREE.GridHelper(120, 60, 0xFDCC0D, 0x32527B);
    grid.position.y = 0;
    this.scene.add(grid);

    // Iluminación ambiental y puntual
    const amb = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(amb);

    // Balizas acústicas espaciales
    this.createBeacon('Alpha (Graves)', -10, 1.5, -12, 0xFDCC0D);
    this.createBeacon('Beta (Medios)', 12, 1.5, -8, 0x00FFFF);
    this.createBeacon('Gamma (Agudos)', 0, 1.5, -24, 0xB87333);

    this.animate();
  }

  createBeacon(name, x, y, z, colorHex) {
    const geo = new THREE.CylinderGeometry(0.5, 0.8, 3, 16);
    const mat = new THREE.MeshStandardMaterial({
      color: colorHex,
      emissive: colorHex,
      emissiveIntensity: 0.6,
      wireframe: true
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    this.scene.add(mesh);
    this.beacons.push({ name, mesh, x, z, color: colorHex });
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    
    // Rotar balizas
    this.beacons.forEach(b => {
      b.mesh.rotation.y += 0.015;
    });

    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.renderer.dispose();
  }
}
`;

export const SHOWCASE_MODULE_JS = `/**
 * ========================================================
 * MÓDULO SGX.Showcase: Los Arquitectos Virtuales (The Pedestal)
 * ========================================================
 * Visor 3D PBR con RoomEnvironment, OrbitControls y forja
 * de texturas en tiempo real.
 * Mitigación CORS: Lectura local vía FileReader Blob URLs.
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export class ShowcaseModule {
  constructor(container) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    
    this.init();
  }

  init() {
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.container.appendChild(this.renderer.domElement);

    this.camera.position.set(4, 2.5, 5);

    // Controles orbitales suaves
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;

    // RoomEnvironment oficial de Three.js (Evita el bug del 'Modelo Oscuro')
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    // Crear geometría de arquitectura cibernética base
    this.createModel();
    this.animate();
  }

  createModel() {
    const group = new THREE.Group();
    const geo = new THREE.TorusKnotGeometry(1.2, 0.38, 120, 24);
    this.material = new THREE.MeshStandardMaterial({
      color: 0xFDCC0D,
      metalness: 0.9,
      roughness: 0.18
    });
    this.mesh = new THREE.Mesh(geo, this.material);
    group.add(this.mesh);
    this.scene.add(group);
  }

  setMaterialFinish(preset) {
    if (preset === 'GOLD') {
      this.material.color.setHex(0xFDCC0D);
      this.material.metalness = 0.95;
      this.material.roughness = 0.15;
    } else if (preset === 'BLUE') {
      this.material.color.setHex(0x32527B);
      this.material.metalness = 0.85;
      this.material.roughness = 0.25;
    } else if (preset === 'CYAN') {
      this.material.color.setHex(0x00FFFF);
      this.material.metalness = 0.3;
      this.material.roughness = 0.1;
    }
  }

  /**
   * Carga de Modelo Local .GLB / .GLTF (Grimorio Cap II.1)
   */
  async loadLocalModel(file) {
    const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js');
    const buffer = await file.arrayBuffer();
    const loader = new GLTFLoader();
    loader.parse(buffer, '', (gltf) => {
      if (this.mesh) this.scene.remove(this.mesh);
      const box = new THREE.Box3().setFromObject(gltf.scene);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      gltf.scene.position.sub(center);
      const scale = 3.2 / Math.max(size.x, size.y, size.z);
      gltf.scene.scale.setScalar(scale);
      this.mesh = gltf.scene;
      this.scene.add(this.mesh);
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    if (this.mesh) this.mesh.rotation.y += 0.005;
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}
`;

export const STORY_MODULE_JS = `/**
 * ========================================================
 * MÓDULO SGX.Story: Los Loremasters (The Scroll)
 * ========================================================
 * Motor de Scrollytelling y narrativa visual con Parallax.
 * Reto de Aprendizaje: Inyectar arte y vincular la posición
 * del scroll para transicionar viñetas y texto fade-up.
 */

export class StoryModule {
  constructor(scrollContainer) {
    this.container = scrollContainer;
    this.init();
  }

  init() {
    this.container.addEventListener('scroll', () => {
      this.onScroll();
    });
  }

  onScroll() {
    const scrollTop = this.container.scrollTop;
    const maxScroll = this.container.scrollHeight - this.container.clientHeight;
    const progress = Math.min(1, Math.max(0, scrollTop / maxScroll));
    
    // Disparar evento para capas visuales
    document.querySelectorAll('[data-parallax]').forEach(el => {
      const speed = parseFloat(el.getAttribute('data-parallax') || '1');
      el.style.transform = \`translateY(\${scrollTop * speed * 0.1}px)\`;
    });
  }
}
`;

export const SYSTEM_MODULE_JS = `/**
 * ========================================================
 * MÓDULO SGX.System: Los Code Weavers (Portfolio Analytics Dashboard)
 * ========================================================
 * Colector de analíticas de visitantes de portafolio, cálculo
 * de interacciones en tiempo real y sincronización en la nube.
 * Reto de Aprendizaje: Conectar con Firebase Firestore para
 * almacenar visitas, clics en proyectos y descargas en vivo.
 */

export class PortfolioAnalyticsModule {
  constructor() {
    this.visitors = 18;
    this.totalInteractions = 1420;
    this.events = [];
    this.cloudLatency = 19;
  }

  trackEvent(category, label, meta = {}) {
    const event = {
      id: 'EV-' + Math.floor(100 + Math.random() * 900),
      timestamp: new Date().toLocaleTimeString(),
      category,
      label,
      device: navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop',
      latencyMs: this.cloudLatency,
      meta
    };

    this.events.unshift(event);
    this.totalInteractions++;
    if (this.events.length > 50) this.events.pop();

    console.log('[SGX.System] Telemetría registrada:', event);
    return event;
  }

  getMetricsSummary() {
    return {
      activeVisitors: this.visitors,
      totalInteractions: this.totalInteractions,
      cloudLatency: this.cloudLatency,
      engagementRate: '76.4%'
    };
  }
}
`;

export const SYNTHESIZE_MODULE_JS = `/**
 * ========================================================
 * MÓDULO SGX.Synthesize: Los Magos del Futuro (The Apex)
 * ========================================================
 * Unificación Enterprise: 3D Showcase + Audio FFT + Telemetría.
 * Atajos de teclado en vivo: 1-8 Escenas, Espacio Pausa, P Pulso,
 * M Silencio, F Modo Escenario.
 */
export class SynthesizeModule {
  constructor(canvas) {
    this.canvas = canvas;
    this.isFrozen = false;
    this.sceneIndex = 1;
  }

  triggerPulse() {
    console.log('[SGX.Synthesize] Pulso visual disparado (HotKey P)');
  }

  toggleFreeze() {
    this.isFrozen = !this.isFrozen;
  }

  setScene(index) {
    this.sceneIndex = index;
  }
}
`;
