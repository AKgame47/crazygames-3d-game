import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export class GameEngine {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  world: CANNON.World;
  blocks: THREE.Mesh[] = [];
  blockBodies: CANNON.Body[] = [];
  towerHeight: number = 0;
  isGameRunning: boolean = false;
  animationId: number | null = null;

  constructor(canvas: HTMLCanvasElement) {
    // Initialize Three.js Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0e27);
    this.scene.fog = new THREE.Fog(0x0a0e27, 100, 200);

    // Initialize Camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 15, 25);
    this.camera.lookAt(0, 0, 0);

    // Initialize Renderer
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;

    // Initialize Physics World
    this.world = new CANNON.World();
    this.world.gravity.set(0, -20, 0);
    this.world.defaultContactMaterial.friction = 0.3;

    // Setup Lighting
    this.setupLighting();

    // Handle Window Resize
    window.addEventListener('resize', () => this.onWindowResize());
  }

  setupLighting(): void {
    // Ambient Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    // Directional Light (Sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -30;
    directionalLight.shadow.camera.right = 30;
    directionalLight.shadow.camera.top = 30;
    directionalLight.shadow.camera.bottom = -30;
    this.scene.add(directionalLight);

    // Point Light for Accent
    const pointLight = new THREE.PointLight(0xff00ff, 0.5, 100);
    pointLight.position.set(-15, 10, 15);
    this.scene.add(pointLight);
  }

  createBlock(
    width: number,
    height: number,
    depth: number,
    color: THREE.Color,
    position: THREE.Vector3
  ): { mesh: THREE.Mesh; body: CANNON.Body } {
    // Create Three.js Mesh
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshStandardMaterial({
      color: color,
      metalness: 0.3,
      roughness: 0.4,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.position.copy(position);

    // Create Physics Body
    const shape = new CANNON.Box(
      new CANNON.Vec3(width / 2, height / 2, depth / 2)
    );
    const body = new CANNON.Body({
      mass: 1,
      shape: shape,
      linearDamping: 0.3,
      angularDamping: 0.3,
    });
    body.position.set(position.x, position.y, position.z);

    this.scene.add(mesh);
    this.world.addBody(body);

    this.blocks.push(mesh);
    this.blockBodies.push(body);

    return { mesh, body };
  }

  createFoundation(): void {
    // Create a stable base for the tower
    const foundationWidth = 8;
    const foundationHeight = 0.5;
    const foundationDepth = 8;

    const geometry = new THREE.BoxGeometry(
      foundationWidth,
      foundationHeight,
      foundationDepth
    );
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x00ff88),
      metalness: 0.5,
      roughness: 0.3,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.position.set(0, -0.5, 0);

    // Create Static Physics Body
    const shape = new CANNON.Box(
      new CANNON.Vec3(foundationWidth / 2, foundationHeight / 2, foundationDepth / 2)
    );
    const body = new CANNON.Body({
      mass: 0, // Static body
      shape: shape,
    });
    body.position.set(0, -0.5, 0);

    this.scene.add(mesh);
    this.world.addBody(body);

    this.blocks.push(mesh);
    this.blockBodies.push(body);
  }

  updatePhysics(deltaTime: number): void {
    this.world.step(1 / 60, deltaTime, 3);

    // Sync Three.js meshes with physics bodies
    for (let i = 0; i < this.blocks.length; i++) {
      const mesh = this.blocks[i];
      const body = this.blockBodies[i];

      if (body.mass > 0) {
        // Dynamic body
        mesh.position.copy(body.position as any);
        mesh.quaternion.copy(body.quaternion as any);
      }
    }
  }

  onWindowResize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  render(): void {
    this.renderer.render(this.scene, this.camera);
  }

  dispose(): void {
    this.renderer.dispose();
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
    }
  }
}
