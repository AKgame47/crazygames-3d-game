import * as THREE from 'three';

export interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
  size: number;
  color: THREE.Color;
}

export class ParticleSystem {
  private particles: Particle[] = [];
  private geometry: THREE.BufferGeometry;
  private material: THREE.PointsMaterial;
  private mesh: THREE.Points;
  private scene: THREE.Scene;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.geometry = new THREE.BufferGeometry();
    this.material = new THREE.PointsMaterial({
      size: 0.5,
      transparent: true,
      sizeAttenuation: true,
    });
    this.mesh = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  emit(
    position: THREE.Vector3,
    type: 'explosion' | 'hit' | 'skill' | 'heal',
    count: number = 20
  ) {
    const colors = {
      explosion: new THREE.Color('#ff6600'),
      hit: new THREE.Color('#ff0000'),
      skill: new THREE.Color('#00ffff'),
      heal: new THREE.Color('#00ff00'),
    };

    const color = colors[type];

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = 0.2 + Math.random() * 0.3;

      this.particles.push({
        position: position.clone(),
        velocity: new THREE.Vector3(
          Math.cos(angle) * speed,
          Math.random() * 0.3 + 0.2,
          Math.sin(angle) * speed
        ),
        life: 1,
        maxLife: 1,
        size: 1,
        color: color.clone(),
      });
    }
  }

  update(deltaTime: number = 0.016) {
    this.particles = this.particles.filter((p) => {
      p.life -= deltaTime;
      if (p.life <= 0) return false;

      p.position.add(p.velocity);
      p.velocity.y -= 0.01; // gravity
      p.size *= 0.98;

      return true;
    });

    this.updateGeometry();
  }

  private updateGeometry() {
    if (this.particles.length === 0) {
      this.geometry.dispose();
      this.geometry = new THREE.BufferGeometry();
      return;
    }

    const positions = new Float32Array(this.particles.length * 3);
    const colors = new Float32Array(this.particles.length * 3);
    const sizes = new Float32Array(this.particles.length);

    this.particles.forEach((p, i) => {
      positions[i * 3] = p.position.x;
      positions[i * 3 + 1] = p.position.y;
      positions[i * 3 + 2] = p.position.z;

      const alpha = p.life / p.maxLife;
      colors[i * 3] = p.color.r;
      colors[i * 3 + 1] = p.color.g;
      colors[i * 3 + 2] = p.color.b;

      sizes[i] = p.size * alpha;
    });

    this.geometry.dispose();
    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    this.material.size = 1;
    this.material.vertexColors = true;
    this.mesh.geometry = this.geometry;
  }

  dispose() {
    this.geometry.dispose();
    this.material.dispose();
    this.scene.remove(this.mesh);
  }
}

// Screen shake effect
export class ScreenShake {
  private intensity: number = 0;
  private duration: number = 0;
  private maxDuration: number = 0;

  trigger(intensity: number = 1, duration: number = 0.1) {
    this.intensity = intensity;
    this.duration = duration;
    this.maxDuration = duration;
  }

  update(deltaTime: number = 0.016): { x: number; y: number; z: number } {
    if (this.duration <= 0) {
      return { x: 0, y: 0, z: 0 };
    }

    this.duration -= deltaTime;
    const progress = this.duration / this.maxDuration;
    const currentIntensity = this.intensity * progress;

    return {
      x: (Math.random() - 0.5) * currentIntensity,
      y: (Math.random() - 0.5) * currentIntensity,
      z: (Math.random() - 0.5) * currentIntensity * 0.5,
    };
  }

  isActive(): boolean {
    return this.duration > 0;
  }
}

// Floating damage numbers
export interface DamageNumber {
  position: THREE.Vector3;
  text: string;
  life: number;
  maxLife: number;
}

export class DamageNumberSystem {
  private numbers: DamageNumber[] = [];

  emit(position: THREE.Vector3, damage: number) {
    this.numbers.push({
      position: position.clone(),
      text: `-${damage}`,
      life: 1,
      maxLife: 1,
    });
  }

  update(deltaTime: number = 0.016) {
    this.numbers = this.numbers.filter((n) => {
      n.life -= deltaTime;
      n.position.y += 0.1;
      return n.life > 0;
    });
  }

  getNumbers(): DamageNumber[] {
    return this.numbers;
  }

  clear() {
    this.numbers = [];
  }
}
