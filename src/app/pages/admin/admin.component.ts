import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LotteryService } from '../../services/lottery.service';
import { AnimationService } from '../../services/animation.service';
import { LotteryConfig, LotteryItem } from '../../models/lottery.model';
import { Observable } from 'rxjs';
import { SwipeableItemComponent } from '../../components/admin/swipeable-item/swipeable-item.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatTabsModule,
    MatExpansionModule,
    MatSnackBarModule,
    SwipeableItemComponent
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  config$: Observable<LotteryConfig | null>;
  currentConfig: LotteryConfig | null = null;
  
  newItem: Partial<LotteryItem> = {
    content: '',
    rarity: 'common',
    weight: 50
  };

  constructor(
    private lotteryService: LotteryService,
    private animationService: AnimationService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.config$ = this.lotteryService.getConfig();
  }

  ngOnInit(): void {
    this.config$.subscribe(config => {
      if (config) {
        this.currentConfig = { ...config };
      }
    });
  }

  saveSettings(): void {
    if (this.currentConfig) {
      this.lotteryService.updateConfig(this.currentConfig);
      this.snackBar.open('設定を保存しました', '閉じる', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
    }
  }

  addItem(): void {
    if (this.currentConfig && this.newItem.content?.trim()) {
      const item: LotteryItem = {
        id: Date.now().toString(),
        content: this.newItem.content,
        rarity: this.newItem.rarity as 'common' | 'rare' | 'epic' | 'legendary',
        weight: this.newItem.weight || 50,
        isUsed: false
      };
      
      this.currentConfig.items.push(item);
      this.newItem = { content: '', rarity: 'common', weight: 50 };
    }
  }

  removeItem(index: number): void {
    if (this.currentConfig) {
      const removedItem = this.currentConfig.items[index];
      this.currentConfig.items.splice(index, 1);
      
      this.snackBar.open(`「${removedItem.content}」を削除しました`, '元に戻す', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      }).onAction().subscribe(() => {
        // 元に戻す処理
        if (this.currentConfig) {
          this.currentConfig.items.splice(index, 0, removedItem);
        }
      });
    }
  }

  exportData(): void {
    const data = JSON.stringify(this.currentConfig, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lottery-config.json';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  importData(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        try {
          const config = JSON.parse(e.target.result);
          this.currentConfig = config;
          alert('データをインポートしました');
        } catch (error) {
          alert('無効なファイル形式です');
        }
      };
      reader.readAsText(file);
    }
  }

  resetAll(): void {
    if (confirm('すべての設定をリセットしてもよろしいですか？')) {
      localStorage.removeItem('lotteryConfig');
      sessionStorage.removeItem('lotterySession');
      location.reload();
    }
  }

  testAnimation(): void {
    this.animationService.showConfetti();
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  getRarityLabel(rarity: string): string {
    switch (rarity) {
      case 'legendary': return 'レジェンダリー';
      case 'epic': return 'エピック';
      case 'rare': return 'レア';
      default: return 'コモン';
    }
  }


  setAnimationSpeed(speed: 'slow' | 'normal' | 'fast'): void {
    this.animationService.setAnimationSpeed(speed);
  }


  getAnimationSpeed(): 'slow' | 'normal' | 'fast' {
    return this.animationService.getAnimationSpeed();
  }

  isMobile(): boolean {
    return window.innerWidth <= 768 || 
           ('ontouchstart' in window) || 
           (navigator.maxTouchPoints > 0);
  }
}