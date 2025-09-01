// くじのデータモデル
export interface LotteryItem {
  id: string;
  content: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  weight: number; // 重み付け（当選確率）
  isUsed: boolean;
  imageUrl?: string;
}

// くじ引き設定
export interface LotteryConfig {
  title: string;
  description: string;
  maxDraws: number; // 最大抽選回数
  allowDuplicates: boolean; // 重複当選を許可するか
  items: LotteryItem[];
  backgroundImage?: string;
  animationSpeed: 'slow' | 'normal' | 'fast';
}

// 抽選結果
export interface DrawResult {
  id: string;
  itemId: string;
  item: LotteryItem;
  timestamp: Date;
  userId?: string;
}

// セッション情報
export interface LotterySession {
  id: string;
  startTime: Date;
  endTime?: Date;
  draws: DrawResult[];
  remainingDraws: number;
}