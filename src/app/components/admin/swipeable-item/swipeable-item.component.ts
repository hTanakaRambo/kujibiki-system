import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-swipeable-item',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './swipeable-item.component.html',
  styleUrl: './swipeable-item.component.scss',
  animations: [
    trigger('slideOut', [
      transition(':leave', [
        animate('300ms ease-out', style({
          transform: 'translateX(-100%)',
          opacity: 0
        }))
      ])
    ]),
    trigger('swipe', [
      state('default', style({
        transform: 'translateX(0)'
      })),
      state('swiped', style({
        transform: 'translateX({{offset}}px)'
      }), { params: { offset: 0 } }),
      transition('default <=> swiped', animate('200ms ease-out'))
    ])
  ]
})
export class SwipeableItemComponent implements AfterViewInit {
  @Input() showDeleteButton = true;
  @Output() delete = new EventEmitter<void>();
  @ViewChild('swipeContainer', { static: false }) swipeContainer!: ElementRef;
  
  swipeState = 'default';
  swipeOffset = 0;
  isDeleting = false;
  private startX = 0;
  private currentX = 0;
  private threshold = 80; // スワイプの閾値

  ngAfterViewInit(): void {
    this.setupTouchEvents();
  }

  private setupTouchEvents(): void {
    const element = this.swipeContainer.nativeElement;
    
    // タッチイベント
    element.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: true });
    element.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
    element.addEventListener('touchend', this.onTouchEnd.bind(this));
    
    // マウスイベント（デバッグ用）
    element.addEventListener('mousedown', this.onMouseDown.bind(this));
  }

  private onTouchStart(event: TouchEvent): void {
    this.startX = event.touches[0].clientX;
    this.currentX = this.startX;
  }

  private onTouchMove(event: TouchEvent): void {
    event.preventDefault();
    this.currentX = event.touches[0].clientX;
    const deltaX = this.currentX - this.startX;
    
    // 左スワイプのみ許可
    if (deltaX < 0 && deltaX > -200) {
      this.swipeOffset = deltaX;
      this.swipeState = 'swiped';
    }
  }

  private onTouchEnd(): void {
    const deltaX = this.currentX - this.startX;
    
    if (deltaX < -this.threshold) {
      // 削除ボタンを表示
      this.swipeOffset = -100;
      this.swipeState = 'swiped';
    } else {
      // 元に戻す
      this.swipeOffset = 0;
      this.swipeState = 'default';
    }
  }

  private onMouseDown(event: MouseEvent): void {
    this.startX = event.clientX;
    this.currentX = this.startX;
    
    const onMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      this.currentX = e.clientX;
      const deltaX = this.currentX - this.startX;
      
      if (deltaX < 0 && deltaX > -200) {
        this.swipeOffset = deltaX;
        this.swipeState = 'swiped';
      }
    };
    
    const onMouseUp = () => {
      const deltaX = this.currentX - this.startX;
      
      if (deltaX < -this.threshold) {
        this.swipeOffset = -100;
        this.swipeState = 'swiped';
      } else {
        this.swipeOffset = 0;
        this.swipeState = 'default';
      }
      
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  onDelete(): void {
    this.isDeleting = true;
    setTimeout(() => {
      this.delete.emit();
    }, 300);
  }

  reset(): void {
    this.swipeOffset = 0;
    this.swipeState = 'default';
  }
}