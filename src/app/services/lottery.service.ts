import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LotteryItem, LotteryConfig, DrawResult, LotterySession } from '../models/lottery.model';

@Injectable({
  providedIn: 'root'
})
export class LotteryService {
  private config$ = new BehaviorSubject<LotteryConfig | null>(null);
  private session$ = new BehaviorSubject<LotterySession | null>(null);
  private drawHistory$ = new BehaviorSubject<DrawResult[]>([]);
  
  constructor() {
    this.loadConfig();
    this.initSession();
  }

  // 設定を取得
  getConfig(): Observable<LotteryConfig | null> {
    return this.config$.asObservable();
  }

  // セッション情報を取得
  getSession(): Observable<LotterySession | null> {
    return this.session$.asObservable();
  }

  // 抽選履歴を取得
  getDrawHistory(): Observable<DrawResult[]> {
    return this.drawHistory$.asObservable();
  }

  // 設定を読み込み
  private loadConfig(): void {
    const savedConfig = localStorage.getItem('lotteryConfig');
    if (savedConfig) {
      this.config$.next(JSON.parse(savedConfig));
    } else {
      // デフォルト設定
      const defaultConfig: LotteryConfig = {
        title: '社員交流会',
        description: '学生と社員の交流を深めるくじ引き',
        maxDraws: 20,
        allowDuplicates: false,
        animationSpeed: 'normal',
        items: this.generateDefaultItems()
      };
      this.config$.next(defaultConfig);
      this.saveConfig(defaultConfig);
    }
  }

  // デフォルトのくじアイテムを生成
  private generateDefaultItems(): LotteryItem[] {
    const items: LotteryItem[] = [];
    
    // レジェンダリー（1%）
    items.push({
      id: 'leg-1',
      content: '特別賞：豪華ディナー券',
      rarity: 'legendary',
      weight: 1,
      isUsed: false
    });

    // エピック（5%）
    for (let i = 1; i <= 2; i++) {
      items.push({
        id: `epic-${i}`,
        content: `準特別賞：ギフトカード${i}`,
        rarity: 'epic',
        weight: 5,
        isUsed: false
      });
    }

    // レア（20%）
    for (let i = 1; i <= 2; i++) {
      items.push({
        id: `rare-${i}`,
        content: `特別賞：QUOカード${i}`,
        rarity: 'rare',
        weight: 20,
        isUsed: false
      });
    }

    // コモン（74%）
    for (let i = 1; i <= 2; i++) {
      items.push({
        id: `common-${i}`,
        content: `参加賞：お菓子セット${i}`,
        rarity: 'common',
        weight: 74,
        isUsed: false
      });
    }

    return items;
  }

  // セッションを初期化
  private initSession(): void {
    const savedSession = sessionStorage.getItem('lotterySession');
    if (savedSession) {
      this.session$.next(JSON.parse(savedSession));
    } else {
      const config = this.config$.value;
      if (config) {
        const newSession: LotterySession = {
          id: this.generateId(),
          startTime: new Date(),
          draws: [],
          remainingDraws: config.maxDraws
        };
        this.session$.next(newSession);
        this.saveSession(newSession);
      }
    }
  }

  // くじを引く
  draw(): DrawResult | null {
    const config = this.config$.value;
    const session = this.session$.value;

    if (!config || !session || session.remainingDraws <= 0) {
      return null;
    }

    // 使用可能なアイテムを取得
    const availableItems = config.allowDuplicates 
      ? config.items 
      : config.items.filter(item => !item.isUsed);

    if (availableItems.length === 0) {
      return null;
    }

    // 重み付け抽選
    const selectedItem = this.weightedRandom(availableItems);
    
    if (!selectedItem) {
      return null;
    }

    // 結果を作成
    const result: DrawResult = {
      id: this.generateId(),
      itemId: selectedItem.id,
      item: { ...selectedItem },
      timestamp: new Date()
    };

    // アイテムを使用済みにする
    if (!config.allowDuplicates) {
      const itemIndex = config.items.findIndex(item => item.id === selectedItem.id);
      if (itemIndex >= 0) {
        config.items[itemIndex].isUsed = true;
      }
    }

    // セッションを更新
    session.draws.push(result);
    session.remainingDraws--;
    
    // 履歴を更新
    const history = this.drawHistory$.value;
    history.push(result);
    this.drawHistory$.next([...history]);

    // 保存
    this.saveConfig(config);
    this.saveSession(session);

    return result;
  }

  // 重み付けランダム選択
  private weightedRandom(items: LotteryItem[]): LotteryItem | null {
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;

    for (const item of items) {
      random -= item.weight;
      if (random <= 0) {
        return item;
      }
    }

    return items[items.length - 1];
  }

  // 設定を更新
  updateConfig(config: LotteryConfig): void {
    this.config$.next(config);
    this.saveConfig(config);
  }

  // セッションをリセット
  resetSession(): void {
    const config = this.config$.value;
    if (config) {
      // アイテムの使用状態をリセット
      config.items.forEach(item => item.isUsed = false);
      this.saveConfig(config);

      // 新しいセッションを作成
      const newSession: LotterySession = {
        id: this.generateId(),
        startTime: new Date(),
        draws: [],
        remainingDraws: config.maxDraws
      };
      this.session$.next(newSession);
      this.saveSession(newSession);
      
      // 履歴をクリア
      this.drawHistory$.next([]);
    }
  }

  // 設定を保存
  private saveConfig(config: LotteryConfig): void {
    localStorage.setItem('lotteryConfig', JSON.stringify(config));
  }

  // セッションを保存
  private saveSession(session: LotterySession): void {
    sessionStorage.setItem('lotterySession', JSON.stringify(session));
  }

  // IDを生成
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // 残りのくじ数を取得
  getRemainingItems(): number {
    const config = this.config$.value;
    if (!config) return 0;
    
    return config.allowDuplicates 
      ? config.items.length 
      : config.items.filter(item => !item.isUsed).length;
  }
}