# デプロイルール

このリポジトリでのデプロイ方法とルールについて説明します。

## 概要

このプロジェクトはVercelにデプロイされます。デプロイは自動化されており、GitHubへのプッシュで自動的にデプロイされます。

## デプロイ環境

- **本番環境**: Vercel Production
- **プレビュー環境**: Vercel Preview（プルリクエスト時に自動生成）
- **開発環境**: ローカル環境（`npm run dev`）

## デプロイ方法

### 方法1: 自動デプロイ（推奨）

GitHubの`main`ブランチにプッシュすると、自動的にVercelがビルド・デプロイを実行します。

```bash
git add .
git commit -m "feat: 新機能を追加"
git push origin main
```

**注意**: コミットメッセージは[コミットメッセージのルール](./commit-message.md)に従ってください。

### 方法2: Vercel CLIを使用した手動デプロイ

Vercel CLIを使用して手動でデプロイすることもできます。

```bash
# 本番環境にデプロイ
vercel --prod

# プレビュー環境にデプロイ
vercel
```

## デプロイ前の確認事項

デプロイ前に以下の確認を行ってください：

### 1. ローカルビルドの確認

```bash
npm run build
```

ビルドが成功することを確認してください。エラーがある場合は修正してからデプロイします。

### 2. 環境変数の確認

以下の環境変数が正しく設定されていることを確認してください：

- `MICROCMS_SERVICE_DOMAIN`: microCMSのサービスドメイン
- `MICROCMS_API_KEY`: microCMSのAPIキー

**確認方法**:

```bash
# ローカル環境変数の確認
cat .env.local

# Vercel環境変数の確認
vercel env ls
```

### 3. テストの実行（オプション）

可能な限り、テストを実行してからデプロイしてください：

```bash
npm test
npm run lint
```

## 環境変数の管理

### ローカル環境変数

`.env.local`ファイルに環境変数を設定します：

```env
MICROCMS_SERVICE_DOMAIN=your-service-domain
MICROCMS_API_KEY=your-api-key
```

**重要**: `.env.local`は`.gitignore`に含まれているため、Gitにコミットされません。

### Vercel環境変数の設定

#### 方法1: スクリプトを使用（推奨）

`.env.local`の環境変数をVercelに設定する場合：

```bash
npm run setup:vercel-env
```

このスクリプトは、`.env.local`の環境変数を読み取り、Vercel CLIを使用して環境変数を設定します。

**前提条件**:
- Vercel CLIがインストールされている（`npm install -g vercel`）
- Vercelにログインしている（`vercel login`）
- プロジェクトがリンクされている（`vercel link`）

#### 方法2: Vercelダッシュボードで手動設定

1. [Vercel](https://vercel.com)にログイン
2. プロジェクトを選択
3. 「Settings」→「Environment Variables」を開く
4. 環境変数を追加：
   - `MICROCMS_SERVICE_DOMAIN`
   - `MICROCMS_API_KEY`
5. 環境（Production, Preview, Development）を選択
6. 「Save」をクリック

#### 方法3: Vercel CLIで直接設定

```bash
# 環境変数を追加
echo "your-value" | vercel env add MICROCMS_SERVICE_DOMAIN production
echo "your-value" | vercel env add MICROCMS_API_KEY production

# 環境変数を確認
vercel env ls

# 環境変数を削除
vercel env rm MICROCMS_SERVICE_DOMAIN production --yes
```

## デプロイ後の確認

デプロイが完了したら、以下の項目を確認してください：

### 1. デプロイステータスの確認

Vercelのダッシュボードでデプロイが成功していることを確認します。

### 2. 本番環境での動作確認

以下の項目を確認します：

- [ ] トップページが正しく表示される
- [ ] 記事一覧が表示される
- [ ] 記事詳細ページが表示される
- [ ] 画像が正しく表示される
- [ ] マークダウンが正しくレンダリングされる
- [ ] 検索機能が動作する
- [ ] カテゴリ・タグページが動作する
- [ ] 404ページが正しく表示される

### 3. パフォーマンスの確認（オプション）

可能な限り、パフォーマンステストを実施してください：

```bash
# Lighthouse CLIを使用
npx --yes lighthouse https://your-site.vercel.app --only-categories=performance --output=json --output-path=./lighthouse-report.json
```

## ロールバック手順

問題が発生した場合、以下の手順でロールバックできます：

### 方法1: Vercelダッシュボードから

1. Vercelの「Deployments」ページを開く
2. 前の正常なデプロイを選択
3. 「⋯」メニューから「Promote to Production」を選択

### 方法2: Vercel CLIから

```bash
# デプロイ履歴を確認
vercel ls

# 特定のデプロイを本番環境にプロモート
vercel promote <deployment-url>
```

## デプロイチェックリスト

デプロイ前に以下のチェックリストを確認してください：

- [ ] ローカルで`npm run build`が成功する
- [ ] 環境変数が正しく設定されている（ローカル・Vercel）
- [ ] テストが成功する（可能な限り）
- [ ] リンターエラーがない（可能な限り）
- [ ] コミットメッセージが適切である
- [ ] 変更内容を確認した

デプロイ後：

- [ ] デプロイが成功している
- [ ] 本番環境で動作確認が完了している
- [ ] パフォーマンステストが完了している（可能な限り）

## トラブルシューティング

### ビルドエラーが発生する場合

1. **ローカルでビルドを確認**:
   ```bash
   npm run build
   ```

2. **エラーログを確認**:
   - Vercelのダッシュボードでビルドログを確認
   - エラーメッセージを確認して修正

3. **環境変数の確認**:
   ```bash
   vercel env ls
   ```

### 環境変数が反映されない場合

1. **環境変数の設定を確認**:
   ```bash
   vercel env ls
   ```

2. **再デプロイを実行**:
   環境変数を設定した後は、再デプロイが必要です。

3. **環境の確認**:
   環境変数が正しい環境（Production/Preview/Development）に設定されているか確認してください。

### 画像が表示されない場合

1. **`next.config.js`の確認**:
   `images.remotePatterns`が正しく設定されているか確認してください。

2. **microCMSの画像URLの確認**:
   microCMSの画像URLが正しいか確認してください。

### デプロイが遅い場合

1. **ビルド時間の確認**:
   Vercelのダッシュボードでビルド時間を確認してください。

2. **最適化の実施**:
   - 画像の最適化
   - コード分割の最適化
   - 未使用のコードの削除

## デプロイフロー

### 通常のデプロイフロー

```
1. コードを変更
2. ローカルでビルド確認（npm run build）
3. コミット・プッシュ（git push origin main）
4. Vercelが自動的にビルド・デプロイ
5. デプロイ完了を確認
6. 本番環境で動作確認
```

### 緊急時のデプロイフロー

```
1. 緊急修正を実施
2. 最小限のテストを実施
3. コミット・プッシュ
4. デプロイ完了を確認
5. 本番環境で動作確認
6. 必要に応じて追加の修正を実施
```

## デプロイのベストプラクティス

### 1. 小さな変更を頻繁にデプロイ

大きな変更を一度にデプロイするのではなく、小さな変更を頻繁にデプロイすることで、問題の特定が容易になります。

### 2. デプロイ前の確認

デプロイ前に必ずローカルでビルドを確認してください。

### 3. コミットメッセージの明確化

コミットメッセージは明確に記述し、何を変更したかが分かるようにしてください。

### 4. 環境変数の管理

環境変数は適切に管理し、機密情報が漏洩しないように注意してください。

### 5. ロールバック計画の準備

問題が発生した場合に備えて、ロールバック手順を理解しておいてください。

## 関連ドキュメント

- [デプロイ手順書](../Docs/DEPLOY.md) - 詳細なデプロイ手順
- [MCPデプロイガイド](../Docs/MCP-DEPLOY.md) - MCPを使ったデプロイ自動化
- [Vercel MCP設定ガイド](../Docs/VERCEL-MCP-SETUP.md) - Vercel MCP設定方法
- [コミットメッセージのルール](./commit-message.md) - コミットメッセージの書き方
- [フェーズ移行時のルール](./phase-transition.md) - フェーズ移行時のコミット・プッシュルール

## 参考資料

- [Vercel公式ドキュメント](https://vercel.com/docs)
- [Next.js公式ドキュメント](https://nextjs.org/docs)
- [microCMS公式ドキュメント](https://document.microcms.io/)



