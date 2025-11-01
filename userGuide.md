# Hyper-Stack: Player's Guide

## Welcome to Hyper-Stack!

**Hyper-Stack** is a fast-paced 3D arcade game where you drop blocks onto a growing tower. The goal is simple: stack blocks with precision, build massive combos, and unlock Hyper Mode for incredible scores.

## Powered by Manus

This game is built with cutting-edge web technologies:

**Frontend:** React 19 + TypeScript + Tailwind CSS for responsive, modern UI
**3D Engine:** Three.js for stunning 3D graphics with real-time shadows and lighting
**Physics:** Cannon.js for realistic block collision and stacking physics
**Audio:** Web Audio API for dynamic sound synthesis and music
**Deployment:** Auto-scaling infrastructure with global CDN for instant loading

The result is a lightweight, high-performance game that runs smoothly on any device.

## Using Your Website

### Getting Started

1. **Load the Game:** Open the game in your browser. The green foundation block appears automatically.
2. **Watch the Block:** A colored block appears above the tower and oscillates side to side.
3. **Drop the Block:** Click your mouse, tap your screen, or press the Space bar to drop the block.
4. **Stack Blocks:** Each successful drop adds to your tower height.
5. **Build Combos:** Drop blocks with perfect alignment to build combo multipliers.

### Main Features

#### Score System
Your score increases based on how well you drop blocks:
- **Perfect Drop** (nearly perfect alignment) = 100 × (1 + combo) points
- **Good Drop** (acceptable alignment) = 50 × combo points
- **Missed Drop** (poor alignment) = 25 points
- **Height Milestones** (10, 25, 50, 100 blocks) = Bonus points

#### Combo Multiplier
Build a combo by dropping blocks with perfect alignment. Your combo multiplier increases with each perfect drop, multiplying your score exponentially. The combo resets if you miss a drop.

#### Hyper Mode
Achieve 5 consecutive perfect drops to unlock **Hyper Mode**! When activated:
- The screen flashes with a neon purple glow
- You earn 1000 bonus points
- Your score is doubled for the next 5 seconds
- A special synth sound plays to celebrate

#### Height Tracking
Your tower height increases with each block dropped. Reaching specific milestones (10, 25, 50, 100 blocks) grants bonus points and unlocks visual changes in difficulty.

### Controls

| Input | Action |
| :--- | :--- |
| **Mouse Click** | Drop the current block |
| **Spacebar / Enter** | Drop the current block |
| **Touch / Tap** | Drop the current block (mobile) |
| **Sound Button** | Toggle sound on/off |

### Game Over

When a block falls off the tower, the game ends. Your final score is displayed with:
- **Final Score:** Your total points earned
- **Height Reached:** How many blocks you stacked
- **Play Again Button:** Restart immediately

## Managing Your Website

### Settings & Controls

**Sound Control:** Click the speaker icon in the top-right corner to toggle sound effects and music on/off.

**Responsive Design:** The game automatically adjusts to your screen size. Play on desktop, tablet, or mobile—the experience adapts perfectly.

**Full-Screen Mode:** The game uses your entire browser window for maximum immersion.

## Tips for High Scores

1. **Aim for Perfect Drops:** Align blocks perfectly to build your combo multiplier. Perfect drops are worth much more than good drops.
2. **Maintain Your Combo:** Once you have a combo going, focus on keeping it alive. A single missed drop resets it to zero.
3. **Watch the Rhythm:** The block oscillates in a predictable pattern. Learn the timing and anticipate where it will be.
4. **Use Hyper Mode Strategically:** Once you unlock Hyper Mode, your next 5 seconds of drops are worth double points. Make them count!
5. **Stay Calm:** As difficulty increases, blocks move faster and shrink. Stay focused and don't rush.
6. **Practice:** The first few blocks are easy. Use them to warm up and get into the rhythm.

## Difficulty Progression

The game gets harder as you progress:

| Height | Changes |
| :--- | :--- |
| 0-10 | Blocks move slowly, large size |
| 10-25 | Blocks move faster, size decreases slightly |
| 25-50 | Blocks move even faster, size decreases more |
| 50+ | Blocks move very fast, size is minimal |

Every 10 successful drops, the block speed increases by 1%. This creates a smooth difficulty curve that keeps the game challenging and engaging.

## Scoring Breakdown

### Base Points
- Perfect Drop: 100 points
- Good Drop: 50 points
- Missed Drop: 25 points

### Combo Multiplier
Your combo multiplier applies to each drop:
- 1st Perfect Drop: 100 × 1 = 100 points
- 2nd Perfect Drop: 100 × 2 = 200 points
- 3rd Perfect Drop: 100 × 3 = 300 points
- 5th Perfect Drop: Unlocks Hyper Mode!

### Height Bonuses
- 10 Blocks: 200 bonus points
- 25 Blocks: 500 bonus points
- 50 Blocks: 1000 bonus points
- 100 Blocks: 2500 bonus points

### Hyper Mode Bonus
- Activation: 1000 points
- Duration: 5 seconds of doubled points

## Sound & Music

The game features dynamic audio:

**Sound Effects:**
- Perfect Drop: High-pitched chime (satisfying!)
- Good Drop: Soft thud
- Shave Sound: Sharp slice (when blocks are trimmed)
- Game Over: Deep gong
- Hyper Mode: Synth flourish

**Background Music:** Upbeat electronic loop that plays throughout the game

**Mute Button:** Click the speaker icon to toggle all sounds on/off.

## Frequently Asked Questions

**Q: How do I get a higher score?**
A: Focus on building combos with perfect drops. Each perfect drop multiplies your score, so maintaining a combo is key.

**Q: What happens when I miss a drop?**
A: Your combo resets to zero, and the overhang of your block is "shaved off," making the tower narrower and harder for future drops.

**Q: Can I pause the game?**
A: Currently, the game doesn't have a pause feature. Once you start, you're committed to the tower!

**Q: What's the maximum height I can reach?**
A: Theoretically unlimited! The game continues until a block falls off. Some players have reached 100+ blocks.

**Q: Does the game work on mobile?**
A: Yes! The game is fully responsive and works on phones and tablets. Use tap to drop blocks.

**Q: Can I play offline?**
A: Yes, once the game loads, it works completely offline. No internet connection required after initial load.

## Next Steps

Now that you understand the basics, jump into the game and start stacking! Here are some goals to aim for:

1. **First 10 Blocks:** Get comfortable with the controls and timing.
2. **First Combo:** Land 3 consecutive perfect drops.
3. **Hyper Mode:** Achieve 5 consecutive perfect drops to unlock Hyper Mode.
4. **50 Blocks:** Reach the 50-block milestone for 1000 bonus points.
5. **100 Blocks:** The ultimate challenge—can you reach 100?

**Good luck, and have fun stacking!** 🎮

---

*Hyper-Stack is designed for addictive, quick-play sessions. Perfect for killing time, competing with friends, or just enjoying some satisfying block-stacking action.*
