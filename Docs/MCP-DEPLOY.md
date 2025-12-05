# MCPを使ったデプロイ自動化ガイド

## 概要

MCP（Model Context Protocol）を使用して、microCMSの接続情報を取得し、Vercelへのデプロイを自動化する方法を説明します。

## MCPとは

MCPは、AIツール（Cursor、Claude Desktopなど）と外部サービス（microCMS、Vercelなど）を連携するためのプロトコルです。

## セットアップ手順

### 1. MCPサーバーの設定

#### microCMS MCPサーバーの設定

Cursorの設定ファイル（通常は `~/.cursor/mcp.json` または類似の場所）に以下を追加：

```json
{
  "mcpServers": {
    "microcms": {
      "command": "node",
      "args": [
        "/path/to/microcms-api-mcp-server/dist/index.js"
      ],
      "env": {
        "MICROCMS_API_KEY": "your-api-key-here",
        "MICROCMS_BASE_URL": "https://your-service.microcms.io"
      }
    }
  }
}
```

#### Vercel MCPサーバーの設定（オプション）

Vercel MCPサーバーが利用可能な場合：

```json
{
  "mcpServers": {
    "vercel": {
      "command": "node",
      "args": [
        "/path/to/vercel-mcp-server/dist/index.js"
      ],
      "env": {
        "VERCEL_TOKEN": "your-vercel-token"
      }
    }
  }
}
```

### 2. 環境変数の自動取得

MCPサーバーが設定されている場合、以下のスクリプトで自動的に環境変数を取得できます：

```bash
npm run setup:microcms-env
```

このスクリプトは、MCP経由でmicroCMSの接続情報を取得し、`.env.local`ファイルを作成します。

### 3. Vercelへの環境変数設定

#### 方法1: スクリプトを使用（推奨）

```bash
npm run setup:vercel-env
```

このスクリプトは、`.env.local`の環境変数を読み取り、Vercel CLIを使用して環境変数を設定します。

**前提条件:**
- Vercel CLIがインストールされている（`npm install -g vercel`）
- Vercelにログインしている（`vercel login`）

#### 方法2: Vercelダッシュボードで手動設定

1. Vercelのダッシュボードを開く
2. プロジェクトの「Settings」→「Environment Variables」を開く
3. 以下の環境変数を追加：
   - `MICROCMS_SERVICE_DOMAIN`
   - `MICROCMS_API_KEY`

### 4. デプロイの実行

#### 方法1: GitHubにプッシュ（自動デプロイ）

```bash
git push origin main
```

Vercelが自動的にビルド・デプロイを実行します。

#### 方法2: Vercel CLIを使用

```bash
vercel --prod
```

## MCPを使った自動化のメリット

1. **環境変数の自動取得**: MCP経由でmicroCMSの接続情報を自動取得
2. **設定の一貫性**: 開発環境と本番環境で同じ設定を使用
3. **手作業の削減**: 環境変数の手動設定が不要
4. **エラーの削減**: 設定ミスを防止

## トラブルシューティング

### MCPサーバーに接続できない

- Cursorの設定ファイルが正しいか確認
- MCPサーバーが正しくインストールされているか確認
- 環境変数が正しく設定されているか確認

### Vercel CLIでエラーが発生する

- Vercel CLIが最新バージョンか確認（`vercel --version`）
- Vercelにログインしているか確認（`vercel whoami`）
- プロジェクトが正しくリンクされているか確認（`vercel link`）

### 環境変数が反映されない

- 環境変数の設定後、再デプロイが必要
- 環境（Production/Preview/Development）が正しく選択されているか確認
- Vercelのダッシュボードで環境変数を確認

## 参考資料

- [microCMS MCP設定ガイド](./microcms-mcp-setup.md)
- [デプロイ手順書](./DEPLOY.md)
- [MCP公式ドキュメント](https://modelcontextprotocol.io/)

