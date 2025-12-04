# microCMS MCP接続設定ガイド

## MCP（Model Context Protocol）とは

MCPは、AIツール（Cursor、Claude Desktopなど）と外部サービス（microCMSなど）を連携するためのプロトコルです。

## microCMS MCPサーバーのセットアップ

### 1. microCMS側の準備

1. microCMSの管理画面にログイン
2. 「設定」→「API設定」から以下を取得：
   - **サービスドメイン**: `https://[サービスドメイン].microcms.io` の `[サービスドメイン]` 部分
   - **APIキー**: APIキーを生成して取得

### 2. MCPサーバーのインストール（オプション）

microCMS MCPサーバーを使用する場合：

```bash
git clone https://github.com/burnworks/microcms-api-mcp-server
cd microcms-api-mcp-server
npm install
npm run build
```

### 3. CursorでのMCP設定

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

## 通常の環境変数設定（推奨）

MCPサーバーを使わない場合でも、`.env.local`ファイルで直接設定できます：

1. プロジェクトルートに`.env.local`ファイルを作成
2. 以下の内容を設定：

```env
MICROCMS_SERVICE_DOMAIN=your-service-domain
MICROCMS_API_KEY=your-api-key
```

## 接続確認

環境変数を設定後、以下のコマンドで接続を確認：

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開き、記事が表示されることを確認してください。

