# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

Angular 19ベースのくじ引きシステムアプリケーション。Material Design、NgRx、アニメーションライブラリを使用したインタラクティブなWebアプリケーション。

## 開発コマンド

### 基本コマンド
- **開発サーバー起動**: `npm start` または `ng serve` (http://localhost:4200)
- **ビルド**: `npm run build` または `ng build`
- **テスト実行**: `npm test` または `ng test`
- **ウォッチモード**: `npm run watch` (開発モードでの自動ビルド)

### コード生成
- **新規コンポーネント**: `ng generate component <component-name>`
- **新規サービス**: `ng generate service <service-name>`
- **その他のスキーマ**: `ng generate --help` で確認

## アーキテクチャと構造

### ルーティング構造
- `/home` - ホーム画面
- `/lottery` - くじ引き画面 
- `/admin` - 管理画面
- スタンドアロンコンポーネントによる遅延読み込みを採用

### 主要ディレクトリ
```
src/app/
├── components/     # 共通UIコンポーネント
│   ├── admin/     # 管理画面用コンポーネント
│   └── lottery/   # くじ引き用コンポーネント
├── models/        # TypeScriptインターフェース定義
├── pages/         # ページコンポーネント（ルーティング対象）
├── services/      # ビジネスロジックとデータ管理
└── app.routes.ts  # ルーティング設定
```

### 状態管理とデータフロー
- **LotteryService**: くじ引きロジックの中核サービス
  - RxJS BehaviorSubjectを使用した状態管理
  - LocalStorage/SessionStorageによるデータ永続化
  - 重み付けランダム抽選アルゴリズム実装

### データモデル
- **LotteryItem**: くじアイテム（レアリティ、重み付け、使用状態）
- **LotteryConfig**: くじ引き設定（最大回数、重複許可、アニメーション速度）
- **DrawResult**: 抽選結果
- **LotterySession**: セッション管理

## 技術スタック

### フロントエンド
- **Angular 19.2**: メインフレームワーク
- **Angular Material**: UIコンポーネントライブラリ
- **NgRx**: 状態管理（Store, Effects, Entity）
- **RxJS**: リアクティブプログラミング

### アニメーション・エフェクト
- **canvas-confetti**: 紙吹雪アニメーション
- **howler**: 音声エフェクト管理
- **hammerjs**: タッチジェスチャー対応

### スタイリング
- **SCSS**: スタイルシート言語
- コンポーネントデフォルトはSCSS設定

## TypeScript設定
- **strict mode**: 有効（厳密な型チェック）
- **Target**: ES2022
- **Module**: ES2022
- **Angular厳密モード**: テンプレート、インジェクション、インプットアクセス全て有効

## 注意事項
- スタンドアロンコンポーネントアーキテクチャを採用
- 日本語コメント使用（コード内のコメントは全て日本語で記述）
- Material Designガイドラインに準拠したUI設計