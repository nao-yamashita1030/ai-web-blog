# 個人ブログサイト

Next.js + microCMS + Vercelで構築する個人ブログサイトです。

## 技術スタック

- **フレームワーク**: Next.js 14.x (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **CMS**: microCMS
- **デプロイ**: Vercel

## セットアップ

### 1. 依存関係のインストール

\`\`\`bash
npm install
\`\`\`

### 2. 環境変数の設定

\`.env.local\`ファイルを作成し、以下の環境変数を設定してください：

\`\`\`
MICROCMS_SERVICE_DOMAIN=your-service-domain
MICROCMS_API_KEY=your-api-key
\`\`\`

### 3. 開発サーバーの起動

\`\`\`bash
npm run dev
\`\`\`

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて確認してください。

## プロジェクト構造

\`\`\`
.
├── app/              # Next.js App Router
├── components/       # Reactコンポーネント
├── lib/              # ユーティリティ関数
├── types/            # TypeScript型定義
└── Docs/             # 設計ドキュメント
\`\`\`

## デプロイ

### 通常のデプロイ方法

Vercelにデプロイする場合：

1. GitHubリポジトリにプッシュ
2. Vercelでプロジェクトをインポート
3. 環境変数を設定
4. デプロイ

詳細は [デプロイ手順書](./Docs/DEPLOY.md) を参照してください。

### MCPを使った自動デプロイ（推奨）

MCP（Model Context Protocol）を使用してデプロイを自動化できます：

1. **環境変数の自動取得**:
   ```bash
   npm run setup:microcms-env
   ```

2. **Vercelへの環境変数設定**:
   ```bash
   npm run setup:vercel-env
   ```

3. **デプロイ**:
   ```bash
   git push origin main
   ```

詳細は [MCP-DEPLOY.md](./Docs/MCP-DEPLOY.md) を参照してください。

## ドキュメント

設計ドキュメントは \`Docs/\` ディレクトリにあります。

- 要件定義: \`Docs/01-requirements/fixed/requirements.md\`
- 基本設計: \`Docs/02-basic-design/fixed/basic-design.md\`
- 詳細設計: \`Docs/03-detailed-design/fixed/\`
