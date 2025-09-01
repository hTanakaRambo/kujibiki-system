import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LotteryService } from '../../services/lottery.service';
import { LotteryConfig, LotterySession } from '../../models/lottery.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatCardModule,
    MatBadgeModule,
    MatTooltipModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  config$: Observable<LotteryConfig | null>;
  session$: Observable<LotterySession | null>;
  remainingItems: number = 0;

  constructor(
    private lotteryService: LotteryService,
    private router: Router
  ) {
    this.config$ = this.lotteryService.getConfig();
    this.session$ = this.lotteryService.getSession();
  }

  ngOnInit(): void {
    this.updateRemainingItems();
    
    // セッション変更を監視
    this.session$.subscribe(() => {
      this.updateRemainingItems();
    });
  }

  private updateRemainingItems(): void {
    this.remainingItems = this.lotteryService.getRemainingItems();
  }

  startLottery(): void {
    this.router.navigate(['/lottery']);
  }

  goToAdmin(): void {
    this.router.navigate(['/admin']);
  }


  resetSession(): void {
    if (confirm('現在のセッションをリセットしてもよろしいですか？')) {
      this.lotteryService.resetSession();
      this.updateRemainingItems();
    }
  }
}