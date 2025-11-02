import * as THREE from 'three';
import { soundManager } from './soundManager';

export interface CombatEntity {
  position: THREE.Vector3;
  health: number;
  maxHealth: number;
  damage: number;
  attackRange: number;
  attackCooldown: number;
  lastAttackTime: number;
}

export class CombatSystem {
  private static instance: CombatSystem;
  private attackRadius = 3;
  private damageMultipliers: Record<string, number> = {
    noob: 1,
    pro: 1.2,
    god: 1.5,
    psycho: 1.8,
    ultimate: 2,
  };

  private constructor() {}

  static getInstance(): CombatSystem {
    if (!CombatSystem.instance) {
      CombatSystem.instance = new CombatSystem();
    }
    return CombatSystem.instance;
  }

  /**
   * Check if an attack hits a target
   */
  checkHit(
    attacker: CombatEntity,
    target: CombatEntity,
    difficulty: string = 'noob'
  ): boolean {
    const distance = attacker.position.distanceTo(target.position);
    return distance <= attacker.attackRange;
  }

  /**
   * Calculate damage with modifiers
   */
  calculateDamage(
    baseDamage: number,
    difficulty: string = 'noob',
    criticalHit: boolean = false
  ): number {
    const multiplier = this.damageMultipliers[difficulty] || 1;
    const damage = baseDamage * multiplier;
    return criticalHit ? damage * 1.5 : damage;
  }

  /**
   * Apply damage to entity
   */
  applyDamage(entity: CombatEntity, damage: number): number {
    const actualDamage = Math.min(damage, entity.health);
    entity.health -= actualDamage;
    soundManager.playHitSound(actualDamage > 15 ? 'heavy' : actualDamage > 8 ? 'medium' : 'light');
    return actualDamage;
  }

  /**
   * Check if attack is available (cooldown)
   */
  canAttack(entity: CombatEntity): boolean {
    return Date.now() - entity.lastAttackTime >= entity.attackCooldown;
  }

  /**
   * Register an attack
   */
  registerAttack(entity: CombatEntity): void {
    entity.lastAttackTime = Date.now();
    soundManager.playAttackSound();
  }

  /**
   * Check collision between two spheres
   */
  checkCollision(pos1: THREE.Vector3, pos2: THREE.Vector3, radius1: number, radius2: number): boolean {
    const distance = pos1.distanceTo(pos2);
    return distance < radius1 + radius2;
  }

  /**
   * Get all entities in attack range
   */
  getEntitiesInRange(
    position: THREE.Vector3,
    entities: CombatEntity[],
    range: number
  ): CombatEntity[] {
    return entities.filter((entity) => position.distanceTo(entity.position) <= range);
  }

  /**
   * Apply area damage (for special abilities)
   */
  applyAreaDamage(
    center: THREE.Vector3,
    radius: number,
    damage: number,
    targets: CombatEntity[]
  ): CombatEntity[] {
    const hitTargets: CombatEntity[] = [];

    targets.forEach((target) => {
      const distance = center.distanceTo(target.position);
      if (distance <= radius) {
        const damageReduction = 1 - distance / radius;
        const actualDamage = damage * damageReduction;
        this.applyDamage(target, actualDamage);
        hitTargets.push(target);
      }
    });

    return hitTargets;
  }

  /**
   * Knockback effect
   */
  applyKnockback(entity: CombatEntity, source: THREE.Vector3, force: number): THREE.Vector3 {
    const direction = new THREE.Vector3().subVectors(entity.position, source).normalize();
    return direction.multiplyScalar(force);
  }

  /**
   * Heal entity
   */
  heal(entity: CombatEntity, amount: number): number {
    const actualHeal = Math.min(amount, entity.maxHealth - entity.health);
    entity.health += actualHeal;
    return actualHeal;
  }

  /**
   * Check if entity is alive
   */
  isAlive(entity: CombatEntity): boolean {
    return entity.health > 0;
  }

  /**
   * Get health percentage
   */
  getHealthPercentage(entity: CombatEntity): number {
    return (entity.health / entity.maxHealth) * 100;
  }

  /**
   * Critical hit chance based on difficulty
   */
  rollCriticalHit(difficulty: string = 'noob'): boolean {
    const critChance = {
      noob: 0.05,
      pro: 0.1,
      god: 0.15,
      psycho: 0.2,
      ultimate: 0.25,
    };

    const chance = critChance[difficulty as keyof typeof critChance] || 0.05;
    return Math.random() < chance;
  }
}

export const combatSystem = CombatSystem.getInstance();
