import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DrawResult } from '../../../models/lottery.model';

@Component({
  selector: 'app-result-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './result-dialog.component.html',
  styleUrl: './result-dialog.component.scss'
})
export class ResultDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ResultDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public result: DrawResult
  ) {}

  getRarityClass(): string {
    return `rarity-${this.result.item.rarity}`;
  }

  getRarityLabel(): string {
    switch (this.result.item.rarity) {
      case 'legendary':
        return 'レジェンダリー';
      case 'epic':
        return 'エピック';
      case 'rare':
        return 'レア';
      default:
        return 'コモン';
    }
  }

  getRarityIcon(): string {
    switch (this.result.item.rarity) {
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

  share(): void {
    const text = `くじ引きで「${this.result.item.content}」が当たりました！🎉`;
    
    if (navigator.share) {
      navigator.share({
        title: 'くじ引き結果',
        text: text,
        url: window.location.href
      });
    } else {
      // フォールバック: クリップボードにコピー
      navigator.clipboard.writeText(text);
      alert('結果をクリップボードにコピーしました！');
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}