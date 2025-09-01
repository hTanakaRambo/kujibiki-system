import { Injectable } from '@angular/core';
import confetti from 'canvas-confetti';

@Injectable({
  providedIn: 'root'
})
export class AnimationService {
  private animationSpeed: 'slow' | 'normal' | 'fast' = 'normal';

  constructor() {
    this.loadSettings();
  }

  private loadSettings(): void {
    const savedSpeed = localStorage.getItem('animationSpeed');
    if (savedSpeed) {
      this.animationSpeed = savedSpeed as 'slow' | 'normal' | 'fast';
    }
  }

  setAnimationSpeed(speed: 'slow' | 'normal' | 'fast'): void {
    this.animationSpeed = speed;
    localStorage.setItem('animationSpeed', speed);
  }

  getAnimationSpeed(): 'slow' | 'normal' | 'fast' {
    return this.animationSpeed;
  }

  getAnimationDuration(): number {
    switch (this.animationSpeed) {
      case 'slow':
        return 5000;
      case 'fast':
        return 2000;
      default:
        return 3000;
    }
  }

  // 紙吹雪エフェクト（基本）
  showConfetti(): void {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  }

  // レア度別の紙吹雪エフェクト
  showRarityConfetti(rarity: 'common' | 'rare' | 'epic' | 'legendary'): void {
    switch (rarity) {
      case 'legendary':
        this.showLegendaryConfetti();
        break;
      case 'epic':
        this.showEpicConfetti();
        break;
      case 'rare':
        this.showRareConfetti();
        break;
      default:
        this.showCommonConfetti();
    }
  }

  private showCommonConfetti(): void {
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#b3e5fc', '#81d4fa', '#4fc3f7']
    });
  }

  private showRareConfetti(): void {
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#ce93d8', '#ba68c8', '#ab47bc']
    });
  }

  private showEpicConfetti(): void {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 }
    };

    function fire(particleRatio: number, opts: any) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
        colors: ['#ffd54f', '#ffca28', '#ffc107']
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }

  private showLegendaryConfetti(): void {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const colors = ['#ff6b6b', '#ffd700', '#ff1744', '#f50057'];

    (function frame() {
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 7,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    }());

    // 中央から大量の金色の紙吹雪
    confetti({
      particleCount: 300,
      spread: 180,
      origin: { y: 0.5 },
      colors: ['#ffd700', '#ffed4e', '#fff59d'],
      scalar: 1.5
    });
  }

  // 花火エフェクト
  showFireworks(): void {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 200 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount: particleCount,
        origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 },
        colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'],
        scalar: randomInRange(0.4, 1)
      });
    }, 250);
  }

  // スター効果
  showStars(): void {
    const defaults = {
      spread: 360,
      ticks: 100,
      gravity: 0,
      decay: 0.94,
      startVelocity: 30,
      shapes: ['star'],
      colors: ['#FFE400', '#FFBD00', '#E89400', '#FFCA6C', '#FDFFB8']
    };

    function shoot() {
      confetti({
        ...defaults,
        particleCount: 40,
        scalar: 1.2,
        shapes: ['star']
      });

      confetti({
        ...defaults,
        particleCount: 20,
        scalar: 0.75,
        shapes: ['circle']
      });
    }

    setTimeout(shoot, 0);
    setTimeout(shoot, 100);
    setTimeout(shoot, 200);
  }

  // カスタムエフェクト
  showCustomConfetti(options: any): void {
    confetti(options);
  }
}