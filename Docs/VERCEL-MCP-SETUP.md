# Vercel MCP設定ガイド

## 概要

VercelのMCP（Model Context Protocol）サーバーを設定する方法を説明します。

## 注意事項

**重要**: 現在、Vercelの公式MCPサーバーは存在しない可能性があります。代わりに、Vercel CLIを使用して環境変数を設定する方法を推奨します。

## 設定方法

### 方法1: Vercel CLIを使用（推奨）

Vercel CLIを使用して環境変数を設定する方法です。MCPサーバーは不要です。

#### 1. Vercel CLIのインストール

```bash
npm install -g vercel
```

#### 2. Vercelにログイン

```bash
vercel login
```

#### 3. プロジェクトをリンク

```bash
vercel link
```

#### 4. 環境変数の設定

プロジェクトで以下のコマンドを実行：

```bash
npm run setup:vercel-env
```

このスクリプトは、`.env.local`の環境変数を読み取り、Vercel CLIを使用して環境変数を設定します。

### 方法2: Cursorの設定ファイルに追加（MCPサーバーが存在する場合）

もしVercelのMCPサーバーが利用可能な場合、Cursorの設定ファイルに追加できます。

#### 1. Cursorの設定ファイルの場所

**Windowsの場合:**
```
%APPDATA%\Cursor\User\globalStorage\saoudrizwan.claude-dev\settings\cline_mcp_settings.json
```

または

```
C:\Users\<ユーザー名>\AppData\Roaming\Cursor\User\globalStorage\saoudrizwan.claude-dev\settings\cline_mcp_settings.json
```

**macOSの場合:**
```
~/Library/Application Support/Cursor/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json
```

**Linuxの場合:**
```
~/.config/Cursor/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json
```

#### 2. Vercelトークンの取得

1. [Vercel](https://vercel.com)にログイン
2. 「Settings」→「Tokens」を開く
3. 「Create Token」をクリック
4. トークン名を入力（例: `MCP Token`）
5. トークンをコピー（一度しか表示されないので注意）

#### 3. 設定ファイルの編集

設定ファイルを開き、以下の内容を追加：

```json
{
  "mcpServers": {
    "vercel": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-vercel"
      ],
      "env": {
        "VERCEL_TOKEN": "your-vercel-token-here",
        "VERCEL_TEAM_ID": "your-team-id-here"
      }
    }
  }
}
```

**注意**: `@modelcontextprotocol/server-vercel`が存在するかどうかは確認が必要です。存在しない場合は、別のMCPサーバーを使用するか、方法1を推奨します。

#### 4. Cursorの再起動

設定ファイルを編集した後、Cursorを再起動してください。

### 方法3: 手動で環境変数を設定

MCPサーバーを使用しない場合、Vercelのダッシュボードで手動で環境変数を設定できます。

1. [Vercel](https://vercel.com)にログイン
2. プロジェクトを選択
3. 「Settings」→「Environment Variables」を開く
4. 以下の環境変数を追加：
   - `MICROCMS_SERVICE_DOMAIN`
   - `MICROCMS_API_KEY`
5. 環境（Production, Preview, Development）を選択
6. 「Save」をクリック

## 推奨される方法

**推奨**: 方法1（Vercel CLIを使用）を推奨します。

理由：
- MCPサーバーのインストールが不要
- 設定が簡単
- 公式のVercel CLIを使用するため、信頼性が高い

## 確認方法

### Vercel CLIで環境変数を確認

```bash
vercel env ls
```

### Vercelダッシュボードで確認

1. Vercelのダッシュボードを開く
2. プロジェクトの「Settings」→「Environment Variables」を開く
3. 設定した環境変数が表示されることを確認

## トラブルシューティング

### 設定ファイルが見つからない

- Cursorの設定ファイルの場所が異なる可能性があります
- Cursorの設定を開き、「MCP」や「Model Context Protocol」で検索してください

### Vercelトークンが無効

- トークンが期限切れになっていないか確認
- 新しいトークンを生成して再設定

### MCPサーバーに接続できない

- MCPサーバーのパッケージが正しくインストールされているか確認
- 環境変数が正しく設定されているか確認
- Cursorを再起動

## 参考資料

- [Vercel CLI公式ドキュメント](https://vercel.com/docs/cli)
- [MCP公式ドキュメント](https://modelcontextprotocol.io/)
- [デプロイ手順書](./DEPLOY.md)
- [MCPデプロイガイド](./MCP-DEPLOY.md)

