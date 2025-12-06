# デプロイ手順書

## Vercelへのデプロイ手順

### 1. 前提条件
- GitHubリポジトリにコードがプッシュされていること
- Vercelアカウントが作成されていること
- microCMSのサービスドメインとAPIキーが取得済みであること

### 2. Vercelでのプロジェクト作成

1. [Vercel](https://vercel.com)にログイン
2. 「Add New Project」をクリック
3. GitHubリポジトリを選択（`nao-yamashita1030/ai-web-blog`）
4. プロジェクト設定を確認：
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`（デフォルト）
   - **Build Command**: `npm run build`（デフォルト）
   - **Output Directory**: `.next`（デフォルト）
   - **Install Command**: `npm install`（デフォルト）

### 3. 環境変数の設定

Vercelのプロジェクト設定で、以下の環境変数を設定：

```
MICROCMS_SERVICE_DOMAIN=your-service-domain
MICROCMS_API_KEY=your-api-key
```

**設定手順：**
1. プロジェクトの「Settings」→「Environment Variables」を開く
2. 各環境変数を追加：
   - **Name**: `MICROCMS_SERVICE_DOMAIN`
   - **Value**: microCMSのサービスドメイン（例: `your-service`）
   - **Environment**: Production, Preview, Development すべてにチェック
3. 同様に`MICROCMS_API_KEY`も設定

### 4. デプロイの実行

1. 「Deploy」ボタンをクリック
2. ビルドが完了するまで待機（通常1-3分）
3. デプロイが完了したら、提供されたURLでアクセス

### 5. デプロイ後の確認

以下の項目を確認：

- [ ] トップページが正しく表示される
- [ ] 記事一覧が表示される
- [ ] 記事詳細ページが表示される
- [ ] 画像が正しく表示される
- [ ] マークダウンが正しくレンダリングされる
- [ ] 検索機能が動作する
- [ ] カテゴリ・タグページが動作する
- [ ] 404ページが正しく表示される

### 6. カスタムドメインの設定（オプション）

1. プロジェクトの「Settings」→「Domains」を開く
2. カスタムドメインを追加
3. DNS設定を更新（Vercelの指示に従う）

### 7. ロールバック手順

問題が発生した場合：

1. Vercelの「Deployments」ページを開く
2. 前の正常なデプロイを選択
3. 「⋯」メニューから「Promote to Production」を選択

### 8. 自動デプロイの設定

デフォルトで、以下の場合に自動デプロイされます：

- `main`ブランチへのプッシュ
- プルリクエストの作成（プレビューデプロイ）

### 9. トラブルシューティング

#### ビルドエラーが発生する場合
- 環境変数が正しく設定されているか確認
- ローカルで`npm run build`が成功するか確認
- Vercelのビルドログを確認

#### 環境変数が反映されない場合
- 環境変数の設定後、再デプロイが必要
- 環境（Production/Preview/Development）が正しく選択されているか確認

#### 画像が表示されない場合
- `next.config.js`の`images.remotePatterns`が正しく設定されているか確認
- microCMSの画像URLが正しいか確認

## デプロイチェックリスト

- [ ] GitHubにコードがプッシュされている
- [ ] Vercelでプロジェクトが作成されている
- [ ] 環境変数が設定されている
- [ ] デプロイが成功している
- [ ] 本番環境で動作確認が完了している
- [ ] パフォーマンステストが完了している



