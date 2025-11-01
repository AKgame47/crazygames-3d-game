import * as THREE from 'three';

export class ParticleSystem {
  scene: THREE.Scene;
  particles: THREE.Points[] = [];

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  // Create a burst of particles for perfect drops
  createPerfectDropBurst(position: THREE.Vector3): void {
    const particleCount = 20;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 2;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xffff00,
      size: 0.3,
      sizeAttenuation: true,
      transparent: true,
      opacity: 1,
    });

    const particles = new THREE.Points(geometry, material);
    particles.position.copy(position);
    this.scene.add(particles);

    // Animate particles
    const startTime = Date.now();
    const duration = 500; // 500ms

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / duration;

      if (progress < 1) {
        // Move particles outward and fade out
        const positions = geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          positions[i * 3] += (Math.random() - 0.5) * 0.1;
          positions[i * 3 + 1] += (Math.random() - 0.5) * 0.1;
          positions[i * 3 + 2] += (Math.random() - 0.5) * 0.1;
        }
        geometry.attributes.position.needsUpdate = true;

        // Fade out
        (material as any).opacity = 1 - progress;

        requestAnimationFrame(animate);
      } else {
        // Remove particles
        this.scene.remove(particles);
        geometry.dispose();
        material.dispose();
      }
    };

    animate();
  }

  // Create a shattering effect for shaved blocks
  createShatterEffect(position: THREE.Vector3, color: THREE.Color): void {
    const shardCount = 15;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(shardCount * 3);

    for (let i = 0; i < shardCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 1;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 1;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: color,
      size: 0.5,
      sizeAttenuation: true,
      transparent: true,
      opacity: 1,
    });

    const shards = new THREE.Points(geometry, material);
    shards.position.copy(position);
    this.scene.add(shards);

    // Animate shards falling and fading
    const startTime = Date.now();
    const duration = 800; // 800ms

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / duration;

      if (progress < 1) {
        // Apply gravity and spread
        const positions = geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < shardCount; i++) {
          positions[i * 3] += (Math.random() - 0.5) * 0.2;
          positions[i * 3 + 1] -= 0.05; // Gravity
          positions[i * 3 + 2] += (Math.random() - 0.5) * 0.2;
        }
        geometry.attributes.position.needsUpdate = true;

        // Fade out
        (material as any).opacity = 1 - progress;

        requestAnimationFrame(animate);
      } else {
        // Remove shards
        this.scene.remove(shards);
        geometry.dispose();
        material.dispose();
      }
    };

    animate();
  }

  // Create a neon glow effect for Hyper Mode
  createHyperModeGlow(): void {
    // This could be enhanced with post-processing effects
    // For now, we'll rely on the scene background color change
  }

  dispose(): void {
    this.particles.forEach((particle) => {
      this.scene.remove(particle);
    });
    this.particles = [];
  }
}
