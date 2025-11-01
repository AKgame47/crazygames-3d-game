export class InputController {
  onDrop: (() => void) | null = null;
  onPause: (() => void) | null = null;

  constructor() {
    this.setupEventListeners();
  }

  setupEventListeners(): void {
    // Mouse click
    window.addEventListener('click', () => {
      if (this.onDrop) {
        this.onDrop();
      }
    });

    // Keyboard input
    window.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.code === 'Space' || event.code === 'Enter') {
        event.preventDefault();
        if (this.onDrop) {
          this.onDrop();
        }
      } else if (event.code === 'Escape') {
        if (this.onPause) {
          this.onPause();
        }
      }
    });

    // Touch input
    window.addEventListener('touchstart', () => {
      if (this.onDrop) {
        this.onDrop();
      }
    });
  }

  dispose(): void {
    // Clean up event listeners if needed
  }
}
