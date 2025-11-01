# Game Concept: Hyper-Stack

This document outlines the concept, mechanics, and technical plan for **Hyper-Stack**, a unique, highly addictive 3D HTML5 game designed to meet and exceed CrazyGames' publishing standards.

## 1. Core Concept

| Attribute | Description |
| :--- | :--- |
| **Title** | **Hyper-Stack** |
| **Genre** | **3D Physics-Based Stacker / Precision Arcade** |
| **Short Description** | A fast-paced, addictive 3D arcade game where players must precisely drop geometric blocks onto a moving, unstable tower to achieve massive combo scores and unlock "Hyper" mode. |
| **Addictiveness Factor** | **High.** The core loop is a test of timing and precision, offering immediate feedback, a satisfying "perfect drop" mechanic, and a high-risk, high-reward combo system that encourages "just one more try." |
| **CrazyGames Compliance** | **100% Original, Lightweight, Engaging within 10 seconds, Fully Functional on Desktop/Mobile, Polished UI/UX.** |

## 2. Gameplay Loop Design

The game is built around a simple, yet challenging core loop:

1.  **The Drop:** A new, randomly-shaped 3D block (cube, cylinder, prism, etc.) appears above the screen, moving horizontally back and forth.
2.  **The Stack:** The player taps/clicks/presses a key to drop the block onto the existing tower.
3.  **Precision Check:**
    *   **Perfect Drop (Combo):** If the block is dropped perfectly aligned with the block below it, the block below is "shaved" to the size of the new block, and the player earns a combo multiplier. The tower becomes smaller, increasing the difficulty.
    *   **Good Drop:** If the block is dropped mostly aligned, it lands safely, but no combo is earned.
    *   **Missed Drop (Tower Shave):** If the block is dropped with a significant overhang, the overhanging part is "shaved" off, reducing the size of the tower base for all subsequent drops.
4.  **Game Over:** The game ends when a dropped block falls off the tower entirely (due to poor placement or tower instability).
5.  **Reward/Replay:** The final score is calculated based on the height of the stack and the highest combo achieved. A quick "Play Again" button is prominently displayed.

### Progressive Difficulty

Difficulty is ramped up dynamically:

*   **Speed:** The horizontal speed of the dropping block increases every 10 successful drops.
*   **Block Shape:** More complex, asymmetrical block shapes are introduced as the stack grows.
*   **Tower Stability:** After a certain height (e.g., 50 blocks), the tower base begins to subtly sway or rotate, introducing a physics challenge.

### Reward and Combo Mechanics

| Mechanic | Trigger | Reward |
| :--- | :--- | :--- |
| **Perfect Drop** | Dropping a block with near-perfect alignment. | Score multiplier (x2, x3, x4...), "Hyper" energy gain, satisfying sound effect. |
| **Hyper Mode** | Achieving 5 consecutive Perfect Drops. | The tower temporarily stops moving, and all blocks dropped in this mode are worth double points. The visual style shifts to vibrant neon. |
| **Height Bonus** | Reaching specific height milestones (e.g., 10, 25, 50, 100 blocks). | Large one-time score bonus, achievement unlock (if implemented). |

## 3. Art and Sound Style

### Art Style: Low-Poly / Vibrant Minimalist

*   **3D Aesthetic:** Clean, low-poly geometry for all blocks and the environment. This ensures a lightweight, fast-loading game.
*   **Color Palette:** Vibrant, contrasting colors. Each block type has a distinct, bright color. The background is a dark, subtle gradient to make the blocks pop.
*   **Visual Feedback:** Use particle effects for visual polish:
    *   **Perfect Drop:** A burst of small, glowing particles emanates from the point of contact.
    *   **Shave:** The shaved-off piece shatters into smaller, falling fragments.
    *   **Hyper Mode:** The entire scene is bathed in a neon glow.

### Sound Design

*   **Music:** Upbeat, driving electronic/synthwave track that increases in tempo as the combo multiplier rises.
*   **Sound Effects (Crucial for addictiveness):**
    *   **Perfect Drop:** A sharp, high-pitched, satisfying "chime" or "click."
    *   **Good Drop:** A soft, low-frequency "thud."
    *   **Shave:** A quick, sharp "slice" sound.
    *   **Game Over:** A deep, resonant "gong" or "crash."
    *   **Hyper Mode Activation:** A short, energetic synth flourish.

## 4. Technical Plan and Code Logic Structure

### Technology Stack

*   **3D Engine:** **Three.js** (Lightweight, widely supported, excellent performance for simple geometry).
*   **Physics:** **Cannon.js** (A simple, performant 3D physics engine for collision detection and stability simulation).
*   **Audio:** **Howler.js** (Simple, reliable library for cross-browser audio management).
*   **Language:** Pure JavaScript (ES6+), HTML5, CSS3.

### Basic Code Logic Structure

The game will be structured using a modular approach:

```
/src
    /js
        game.js           // Main game loop, state management, initialization
        sceneManager.js   // Handles Three.js scene, camera, lighting
        blockManager.js   // Handles block generation, movement, and destruction
        physics.js        // Handles Cannon.js integration and collision logic
        ui.js             // Manages score display, menus, and UI elements
        audio.js          // Manages Howler.js for music and sound effects
    /css
        style.css         // Responsive and minimal styling
    index.html            // Game entry point
```

### Core Logic Pseudocode

```
function updateGameLoop() {
    // 1. Update Block Position
    currentBlock.position.x = oscillate(time, speed);

    // 2. Check for Drop Input
    if (input.isDropPressed) {
        // Stop horizontal movement
        currentBlock.isMoving = false;
        // Apply gravity via Cannon.js
        physics.applyGravity(currentBlock);

        // 3. Wait for Block to Settle
        // On collision/settle:
        let overlap = checkOverlap(currentBlock, topBlock);

        if (overlap.isPerfect) {
            // Perfect Drop Logic
            score.addCombo();
            topBlock.resize(currentBlock.size); // Shave the old block
            // Add Hyper Energy
        } else if (overlap.isGood) {
            // Good Drop Logic
            score.resetCombo();
        } else {
            // Missed Drop Logic
            // Check if block fell off -> Game Over
            if (overlap.isOffEdge) {
                gameOver();
            } else {
                currentBlock.resize(overlap.size); // Shave the new block
                topBlock.resize(overlap.size); // Shave the old block
                score.resetCombo();
            }
        }

        // 4. Generate Next Block
        blockManager.generateNextBlock();
    }

    // 5. Update Physics and Render
    physics.update();
    renderer.render(scene, camera);
}
```

## 5. Ad Integration Points

Ad integration will be non-disruptive, as per CrazyGames' requirements:

1.  **Pre-Game Load:** A loading screen ad (if required by the publisher).
2.  **Game Over Screen:** A banner ad or interstitial ad displayed only after the player clicks "Play Again" or "View Leaderboard."
3.  **Reward Doubler (Optional):** A rewarded video ad option to double the final score before it's submitted to the leaderboard.

This concept provides a solid foundation for a highly engaging, performant, and publishable 3D HTML5 game. The next steps will focus on project initialization and core mechanic development.
