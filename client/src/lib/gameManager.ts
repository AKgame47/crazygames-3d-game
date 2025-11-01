import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { GameEngine } from './gameEngine';

export interface GameState {
  score: number;
  combo: number;
  height: number;
  isGameOver: boolean;
  hyperMode: boolean;
  dropsCount: number;
}

export class GameManager {
  engine: GameEngine;
  gameState: GameState;
  currentBlock: { mesh: THREE.Mesh; body: CANNON.Body } | null = null;
  currentBlockSize: { width: number; depth: number } = { width: 4, depth: 4 };
  blockColors: THREE.Color[] = [
    new THREE.Color(0xff0055),
    new THREE.Color(0x00ff88),
    new THREE.Color(0x00d4ff),
    new THREE.Color(0xffaa00),
    new THREE.Color(0xaa00ff),
    new THREE.Color(0xff0088),
  ];
  baseBlockSize: { width: number; depth: number } = { width: 8, depth: 8 };
  blockSpeed: number = 0.05;
  blockAmplitude: number = 6;
  blockTime: number = 0;
  isDropping: boolean = false;
  lastBlockY: number = 0;
  onGameStateChange: ((state: GameState) => void) | null = null;
  onGameOver: ((score: number) => void) | null = null;
  hyperModeTimeout: NodeJS.Timeout | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.engine = new GameEngine(canvas);
    this.gameState = {
      score: 0,
      combo: 0,
      height: 0,
      isGameOver: false,
      hyperMode: false,
      dropsCount: 0,
    };

    this.engine.createFoundation();
    this.spawnNewBlock();
  }

  spawnNewBlock(): void {
    // Remove previous block if exists
    if (this.currentBlock) {
      this.engine.scene.remove(this.currentBlock.mesh);
      this.engine.world.removeBody(this.currentBlock.body);
    }

    // Determine block size based on height (progressive difficulty)
    let blockWidth = this.baseBlockSize.width;
    let blockDepth = this.baseBlockSize.depth;

    if (this.gameState.height > 50) {
      blockWidth *= 0.7;
      blockDepth *= 0.7;
    } else if (this.gameState.height > 25) {
      blockWidth *= 0.85;
      blockDepth *= 0.85;
    }

    this.currentBlockSize = { width: blockWidth, depth: blockDepth };

    // Random color
    const color = this.blockColors[Math.floor(Math.random() * this.blockColors.length)];

    // Spawn block above the tower
    const spawnHeight = this.lastBlockY + 15;
    const position = new THREE.Vector3(0, spawnHeight, 0);

    this.currentBlock = this.engine.createBlock(blockWidth, 0.5, blockDepth, color, position);
    this.blockTime = 0;
    this.isDropping = false;
  }

  updateBlockMovement(deltaTime: number): void {
    if (!this.currentBlock || this.isDropping) return;

    // Horizontal oscillation with progressive speed increase
    this.blockTime += deltaTime;
    const xOffset = Math.sin(this.blockTime * this.blockSpeed) * this.blockAmplitude;
    this.currentBlock.mesh.position.x = xOffset;
    this.currentBlock.body.position.x = xOffset;
  }

  dropBlock(): void {
    if (!this.currentBlock || this.isDropping || this.gameState.isGameOver) return;

    this.isDropping = true;
    this.gameState.dropsCount++;

    // Increase speed every 10 drops (progressive difficulty)
    if (this.gameState.dropsCount % 10 === 0) {
      this.blockSpeed += 0.01;
    }

    // Apply gravity to the block
    this.currentBlock.body.velocity.y = 0;
    this.currentBlock.body.applyForce(
      new CANNON.Vec3(0, -30, 0),
      this.currentBlock.body.position
    );

    // Check collision after a delay
    setTimeout(() => {
      this.checkBlockPlacement();
    }, 500);
  }

  checkBlockPlacement(): void {
    if (!this.currentBlock) return;

    const blockX = this.currentBlock.body.position.x;
    const blockY = this.currentBlock.body.position.y;

    // Find the top block in the tower
    let topBlockIndex = -1;
    let topBlockY = -10;
    let topBlockWidth = 0;

    for (let i = this.engine.blocks.length - 1; i >= 0; i--) {
      const block = this.engine.blocks[i];
      if (block !== this.currentBlock.mesh && block.position.y > topBlockY) {
        topBlockY = block.position.y;
        topBlockIndex = i;
        topBlockWidth = block.scale.x * 4; // Get actual width
      }
    }

    if (topBlockIndex === -1) {
      // No blocks below, game over
      this.endGame();
      return;
    }

    const topBlock = this.engine.blocks[topBlockIndex];
    const topBlockX = topBlock.position.x;

    // Calculate overlap
    const perfectTolerance = 0.5; // Tolerance for perfect placement
    const goodTolerance = 1.5; // Tolerance for good placement
    const overlapX = Math.abs(blockX - topBlockX);
    const maxOverlapDistance = (this.currentBlockSize.width + topBlockWidth) / 2;

    if (overlapX > maxOverlapDistance) {
      // Block fell off - Game Over
      this.endGame();
      return;
    }

    // Determine drop quality
    const isPerfect = overlapX < perfectTolerance;
    const isGood = overlapX < goodTolerance;

    if (isPerfect) {
      // Perfect Drop - Maximum reward
      this.gameState.combo++;
      this.gameState.score += 100 * (1 + this.gameState.combo);

      // Check for Hyper Mode activation
      if (this.gameState.combo >= 5 && !this.gameState.hyperMode) {
        this.activateHyperMode();
      }
    } else if (isGood) {
      // Good Drop - Maintain some reward
      this.gameState.score += 50 * Math.max(1, this.gameState.combo);
    } else {
      // Missed Drop - Reset combo and shave blocks
      this.gameState.combo = 0;
      this.gameState.score += 25;

      // Shave the current block
      const overhang = maxOverlapDistance - overlapX;
      if (overhang > 0.1) {
        const newWidth = Math.max(0.5, this.currentBlockSize.width - overhang * 2);
        this.currentBlockSize.width = newWidth;
        this.currentBlock.mesh.scale.x = newWidth / 4; // Adjust scale
      }

      // Shave the top block as well
      if (overhang > 0.1) {
        const newTopWidth = Math.max(0.5, topBlockWidth - overhang * 2);
        topBlock.scale.x = newTopWidth / 4;
      }
    }

    // Update tower height
    this.lastBlockY = blockY;
    this.gameState.height++;

    // Height bonus milestones
    if (this.gameState.height === 10) {
      this.gameState.score += 200;
    } else if (this.gameState.height === 25) {
      this.gameState.score += 500;
    } else if (this.gameState.height === 50) {
      this.gameState.score += 1000;
    } else if (this.gameState.height === 100) {
      this.gameState.score += 2500;
    }

    this.notifyStateChange();
    this.spawnNewBlock();
  }

  activateHyperMode(): void {
    this.gameState.hyperMode = true;
    this.gameState.score += 1000; // Bonus for activating Hyper Mode

    // Visual feedback: change scene background
    this.engine.scene.background = new THREE.Color(0x1a0033);

    // Reset combo for next Hyper Mode
    if (this.hyperModeTimeout) {
      clearTimeout(this.hyperModeTimeout);
    }

    this.hyperModeTimeout = setTimeout(() => {
      this.gameState.combo = 0;
      this.gameState.hyperMode = false;
      this.engine.scene.background = new THREE.Color(0x0a0e27);
    }, 5000);
  }

  endGame(): void {
    this.gameState.isGameOver = true;
    if (this.onGameOver) {
      this.onGameOver(this.gameState.score);
    }
  }

  notifyStateChange(): void {
    if (this.onGameStateChange) {
      this.onGameStateChange(this.gameState);
    }
  }

  update(deltaTime: number): void {
    if (this.gameState.isGameOver) return;

    this.updateBlockMovement(deltaTime);
    this.engine.updatePhysics(deltaTime);
  }

  render(): void {
    this.engine.render();
  }

  reset(): void {
    // Clear timeout
    if (this.hyperModeTimeout) {
      clearTimeout(this.hyperModeTimeout);
    }

    // Clear all blocks and bodies
    for (let i = this.engine.blocks.length - 1; i >= 0; i--) {
      this.engine.scene.remove(this.engine.blocks[i]);
      this.engine.world.removeBody(this.engine.blockBodies[i]);
    }

    this.engine.blocks = [];
    this.engine.blockBodies = [];

    // Reset game state
    this.gameState = {
      score: 0,
      combo: 0,
      height: 0,
      isGameOver: false,
      hyperMode: false,
      dropsCount: 0,
    };

    this.lastBlockY = 0;
    this.blockSpeed = 0.05;
    this.blockTime = 0;
    this.isDropping = false;

    // Recreate foundation and spawn new block
    this.engine.createFoundation();
    this.spawnNewBlock();
    this.notifyStateChange();
  }

  dispose(): void {
    if (this.hyperModeTimeout) {
      clearTimeout(this.hyperModeTimeout);
    }
    this.engine.dispose();
  }
}
