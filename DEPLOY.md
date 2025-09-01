# Vercelへのデプロイ手順

## 前提条件
- GitHubアカウント
- Vercelアカウント（GitHubでサインイン可能）
- このリポジトリがGitHubにプッシュされていること

## デプロイ手順

### 1. Vercelアカウントの準備
1. [Vercel](https://vercel.com)にアクセス
2. GitHubアカウントでサインイン

### 2. プロジェクトのインポート
1. Vercelダッシュボードで「Add New > Project」をクリック
2. GitHubリポジトリ一覧から `kujibiki-system` を選択
3. 「Import」をクリック

### 3. プロジェクト設定
以下の設定が自動的に検出されます（vercel.jsonにより）：
- **Framework Preset**: Angular
- **Build Command**: `npm run build`
- **Output Directory**: `dist/kujibiki-system/browser`

### 4. 環境変数の設定（必要に応じて）
Environment Variables セクションで以下を設定可能：
- `NODE_ENV`: production（デフォルト）
- その他、`.env.example`を参照

### 5. デプロイ実行
「Deploy」ボタンをクリックしてデプロイを開始

## デプロイ後の確認事項

### URLの確認
- デプロイ完了後、以下のURLが発行されます：
  - Production: `https://[プロジェクト名].vercel.app`
  - Preview（各ブランチ）: `https://[プロジェクト名]-[ブランチ名].vercel.app`

### 動作確認
1. トップページ（/home）の表示
2. くじ引き画面（/lottery）への遷移
3. 管理画面（/admin）への遷移
4. リロード時のルーティング動作

## 継続的デプロイ

### 自動デプロイ
- `main`ブランチへのプッシュで自動的に本番環境にデプロイ
- その他のブランチへのプッシュでプレビュー環境にデプロイ

### 手動デプロイ
```bash
# Vercel CLIを使用する場合
npm i -g vercel
vercel

# プロダクションデプロイ
vercel --prod
```

## トラブルシューティング

### ビルドエラーが発生する場合
1. ローカルでビルドを確認：
   ```bash
   npm run build
   ```
2. Node.jsバージョンを確認（18.x以上推奨）

### ルーティングが機能しない場合
- `vercel.json`の`rewrites`設定を確認
- SPAのフォールバック設定が正しいか確認

### 環境変数が反映されない場合
1. Vercelダッシュボードで環境変数を設定
2. 再デプロイを実行

## カスタムドメインの設定

1. Vercelダッシュボード > Settings > Domains
2. カスタムドメインを追加
3. DNSレコードを設定：
   - Aレコード: `76.76.21.21`
   - CNAMEレコード: `cname.vercel-dns.com`

## パフォーマンス最適化

### 推奨設定（vercel.jsonに設定済み）
- 静的アセットのキャッシュ設定
- セキュリティヘッダーの設定
- gzip/brotli圧縮（自動）

### 監視とアナリティクス
- Vercel Analytics（有料プラン）
- Web Vitals監視
- リアルタイムログ

## その他の注意事項

- **ビルドサイズ制限**: 最大100MB
- **関数タイムアウト**: 10秒（Hobbyプラン）
- **帯域幅制限**: 100GB/月（Hobbyプラン）

詳細は[Vercel公式ドキュメント](https://vercel.com/docs)を参照してください。