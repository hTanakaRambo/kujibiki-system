import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { Subscription } from 'rxjs';
import { LotteryService } from '../../services/lottery.service';
import { AnimationService } from '../../services/animation.service';
import { LotteryConfig, DrawResult } from '../../models/lottery.model';
import { ResultDialogComponent } from '../../components/lottery/result-dialog/result-dialog.component';

@Component({
  selector: 'app-lottery',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatCardModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './lottery.component.html',
  styleUrl: './lottery.component.scss',
  animations: [
    trigger('flip', [
      state('default', style({
        transform: 'rotateY(0)'
      })),
      state('flipped', style({
        transform: 'rotateY(180deg)'
      })),
      transition('default => flipped', [
        animate('600ms ease-in')
      ]),
      transition('flipped => default', [
        animate('600ms ease-out')
      ])
    ]),
    trigger('shake', [
      transition('* => *', [
        animate('500ms', keyframes([
          style({ transform: 'translateX(0)', offset: 0 }),
          style({ transform: 'translateX(-10px)', offset: 0.25 }),
          style({ transform: 'translateX(10px)', offset: 0.5 }),
          style({ transform: 'translateX(-10px)', offset: 0.75 }),
          style({ transform: 'translateX(0)', offset: 1 })
        ]))
      ])
    ]),
    trigger('pulse', [
      state('normal', style({
        transform: 'scale(1)'
      })),
      state('pulsing', style({
        transform: 'scale(1.05)'
      })),
      transition('normal <=> pulsing', [
        animate('300ms ease-in-out')
      ])
    ])
  ]
})
export class LotteryComponent implements OnInit, OnDestroy {
  config: LotteryConfig | null = null;
  panels: LotteryPanel[] = [];
  isDrawing = false;
  selectedPanelIndex: number | null = null;
  animationState = 'default';
  shakeState = 0;
  private subscription?: Subscription;
  private rouletteInterval?: any;

  constructor(
    private lotteryService: LotteryService,
    private animationService: AnimationService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscription = this.lotteryService.getConfig().subscribe(config => {
      if (config) {
        this.config = config;
        this.initializePanels();
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    if (this.rouletteInterval) {
      clearInterval(this.rouletteInterval);
    }
  }

  private initializePanels(): void {
    // くじの登録枚数分のパネルを作成
    const panelCount = this.config?.items?.length || 0;
    this.panels = [];
    
    for (let i = 0; i < panelCount; i++) {
      this.panels.push({
        id: i,
        isFlipped: false,
        isSelected: false,
        isPulsing: false,
        content: '?'
      });
    }
  }

  onPanelClick(index: number): void {
    if (this.isDrawing || this.panels[index].isFlipped) {
      return;
    }

    this.startDrawing(index);
  }

  private startDrawing(index: number): void {
    this.isDrawing = true;
    this.selectedPanelIndex = index;
    
    // ルーレット演出開始
    this.startRouletteAnimation();
    
    // アニメーション時間後に結果を表示
    const duration = this.animationService.getAnimationDuration();
    
    setTimeout(() => {
      this.stopRouletteAnimation();
      this.revealResult(index);
    }, duration);
  }

  private startRouletteAnimation(): void {
    this.shakeState++;
    
    let currentIndex = 0;
    this.rouletteInterval = setInterval(() => {
      // 前のパネルのハイライトを解除
      this.panels.forEach(panel => {
        panel.isSelected = false;
        panel.isPulsing = false;
      });
      
      // 次のパネルをハイライト
      this.panels[currentIndex].isSelected = true;
      this.panels[currentIndex].isPulsing = true;
      
      currentIndex = (currentIndex + 1) % this.panels.length;
    }, 100);
  }

  private stopRouletteAnimation(): void {
    if (this.rouletteInterval) {
      clearInterval(this.rouletteInterval);
      this.rouletteInterval = null;
    }
    
    
    // すべてのパネルのハイライトを解除
    this.panels.forEach(panel => {
      panel.isSelected = false;
      panel.isPulsing = false;
    });
  }

  private revealResult(index: number): void {
    const result = this.lotteryService.draw();
    
    if (!result) {
      alert('くじが残っていません');
      this.isDrawing = false;
      return;
    }

    // パネルをフリップ
    this.panels[index].isFlipped = true;
    this.panels[index].content = this.getEmojiForRarity(result.item.rarity);
    
    // 紙吹雪
    this.animationService.showRarityConfetti(result.item.rarity);
    
    // 結果ダイアログを表示
    setTimeout(() => {
      this.showResultDialog(result);
    }, 600);
    
    this.isDrawing = false;
  }

  private getEmojiForRarity(rarity: string): string {
    switch (rarity) {
      case 'legendary':
        return '👑';
      case 'epic':
        return '💎';
      case 'rare':
        return '⭐';
      default:
        return '🎁';
    }
  }

  private showResultDialog(result: DrawResult): void {
    const dialogRef = this.dialog.open(ResultDialogComponent, {
      data: result,
      width: '500px',
      panelClass: 'result-dialog'
    });

    dialogRef.afterClosed().subscribe(() => {
      // 必要に応じて処理
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }


  getRemainingCount(): number {
    return this.lotteryService.getRemainingItems();
  }
}

interface LotteryPanel {
  id: number;
  isFlipped: boolean;
  isSelected: boolean;
  isPulsing: boolean;
  content: string;
}