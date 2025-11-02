import { soundManager } from './soundManager';

export interface Skill {
  id: string;
  name: string;
  description: string;
  cooldown: number;
  damage: number;
  range: number;
  duration: number;
  unlockedAtMode: 'noob' | 'pro' | 'god' | 'psycho' | 'ultimate';
  effect: (position: any, targets: any[]) => void;
}

export class SkillSystem {
  private static instance: SkillSystem;
  private skills: Map<string, Skill> = new Map();
  private activeCooldowns: Map<string, number> = new Map();

  private constructor() {
    this.initializeSkills();
  }

  static getInstance(): SkillSystem {
    if (!SkillSystem.instance) {
      SkillSystem.instance = new SkillSystem();
    }
    return SkillSystem.instance;
  }

  private initializeSkills() {
    // Basic Attack
    this.skills.set('basicAttack', {
      id: 'basicAttack',
      name: 'Basic Attack',
      description: 'Standard melee attack',
      cooldown: 500,
      damage: 10,
      range: 3,
      duration: 0,
      unlockedAtMode: 'noob',
      effect: () => {
        soundManager.playAttackSound();
      },
    });

    // Speed Boost (Noob Mode Reward)
    this.skills.set('speedBoost', {
      id: 'speedBoost',
      name: 'Speed Boost',
      description: 'Temporarily increase movement speed by 50%',
      cooldown: 5000,
      damage: 0,
      range: 0,
      duration: 5000,
      unlockedAtMode: 'noob',
      effect: () => {
        soundManager.playSkillActivationSound();
      },
    });

    // Double Jump (Pro Mode Reward)
    this.skills.set('doubleJump', {
      id: 'doubleJump',
      name: 'Double Jump',
      description: 'Jump twice in the air',
      cooldown: 3000,
      damage: 0,
      range: 0,
      duration: 0,
      unlockedAtMode: 'pro',
      effect: () => {
        soundManager.playSkillActivationSound();
      },
    });

    // Energy Slash (God Mode Reward)
    this.skills.set('energySlash', {
      id: 'energySlash',
      name: 'Energy Slash',
      description: 'Powerful slash dealing 30 damage in a cone',
      cooldown: 4000,
      damage: 30,
      range: 5,
      duration: 0,
      unlockedAtMode: 'god',
      effect: () => {
        soundManager.playAttackSound();
        soundManager.playSkillActivationSound();
      },
    });

    // Time Freeze (Psycho Mode Reward)
    this.skills.set('timeFreeze', {
      id: 'timeFreeze',
      name: 'Time Freeze',
      description: 'Freeze all enemies for 3 seconds',
      cooldown: 8000,
      damage: 0,
      range: 50,
      duration: 3000,
      unlockedAtMode: 'psycho',
      effect: () => {
        soundManager.playSkillActivationSound();
      },
    });

    // Shadow Skill (Ultimate Mode Reward)
    this.skills.set('shadowSkill', {
      id: 'shadowSkill',
      name: 'Shadow Clone',
      description: 'Create a shadow clone that fights alongside you',
      cooldown: 10000,
      damage: 15,
      range: 0,
      duration: 8000,
      unlockedAtMode: 'ultimate',
      effect: () => {
        soundManager.playSkillActivationSound();
      },
    });

    // Whirlwind Attack (Advanced)
    this.skills.set('whirlwind', {
      id: 'whirlwind',
      name: 'Whirlwind Attack',
      description: 'Spin rapidly, hitting all nearby enemies',
      cooldown: 6000,
      damage: 20,
      range: 4,
      duration: 1000,
      unlockedAtMode: 'pro',
      effect: () => {
        soundManager.playAttackSound();
      },
    });

    // Dash (Pro Mode)
    this.skills.set('dash', {
      id: 'dash',
      name: 'Dash',
      description: 'Quickly dash forward to evade attacks',
      cooldown: 2000,
      damage: 0,
      range: 0,
      duration: 0,
      unlockedAtMode: 'pro',
      effect: () => {
        soundManager.playUISound('click');
      },
    });

    // Fireball (God Mode)
    this.skills.set('fireball', {
      id: 'fireball',
      name: 'Fireball',
      description: 'Throw a fireball dealing 25 damage in an area',
      cooldown: 5000,
      damage: 25,
      range: 10,
      duration: 0,
      unlockedAtMode: 'god',
      effect: () => {
        soundManager.playAttackSound();
        soundManager.playSkillActivationSound();
      },
    });

    // Berserk (Ultimate Mode)
    this.skills.set('berserk', {
      id: 'berserk',
      name: 'Berserk Mode',
      description: 'Enter berserk mode, dealing 2x damage for 5 seconds',
      cooldown: 12000,
      damage: 0,
      range: 0,
      duration: 5000,
      unlockedAtMode: 'ultimate',
      effect: () => {
        soundManager.playSkillActivationSound();
      },
    });
  }

  getSkill(skillId: string): Skill | undefined {
    return this.skills.get(skillId);
  }

  getAllSkills(): Skill[] {
    return Array.from(this.skills.values());
  }

  getSkillsByMode(mode: 'noob' | 'pro' | 'god' | 'psycho' | 'ultimate'): Skill[] {
    return Array.from(this.skills.values()).filter(
      (skill) => {
        const modes = ['noob', 'pro', 'god', 'psycho', 'ultimate'];
        const modeIndex = modes.indexOf(mode);
        const skillModeIndex = modes.indexOf(skill.unlockedAtMode);
        return skillModeIndex <= modeIndex;
      }
    );
  }

  canUseSkill(skillId: string): boolean {
    const cooldownEnd = this.activeCooldowns.get(skillId);
    if (!cooldownEnd) return true;
    return Date.now() >= cooldownEnd;
  }

  useSkill(skillId: string): boolean {
    const skill = this.getSkill(skillId);
    if (!skill) return false;

    if (!this.canUseSkill(skillId)) return false;

    skill.effect(null, []);
    this.activeCooldowns.set(skillId, Date.now() + skill.cooldown);
    return true;
  }

  getSkillCooldownRemaining(skillId: string): number {
    const cooldownEnd = this.activeCooldowns.get(skillId);
    if (!cooldownEnd) return 0;

    const remaining = cooldownEnd - Date.now();
    return Math.max(0, remaining);
  }

  getSkillCooldownPercentage(skillId: string): number {
    const skill = this.getSkill(skillId);
    if (!skill) return 0;

    const remaining = this.getSkillCooldownRemaining(skillId);
    return (remaining / skill.cooldown) * 100;
  }

  resetCooldown(skillId: string): void {
    this.activeCooldowns.delete(skillId);
  }

  resetAllCooldowns(): void {
    this.activeCooldowns.clear();
  }
}

export const skillSystem = SkillSystem.getInstance();
