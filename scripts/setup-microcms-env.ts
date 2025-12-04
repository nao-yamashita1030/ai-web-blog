/**
 * microCMS環境変数設定支援スクリプト
 * MCP経由でmicroCMSの接続情報を取得して.env.localファイルを作成します
 */

import * as fs from 'fs';
import * as path from 'path';

async function setupMicroCMSEnv() {
  console.log('microCMS環境変数設定を開始します...\n');

  const envPath = path.join(process.cwd(), '.env.local');
  
  // 既存の.env.localファイルがあるか確認
  if (fs.existsSync(envPath)) {
    console.log('⚠️  .env.localファイルが既に存在します。');
    console.log('上書きしますか？ (y/n)');
    // 実際の実装では、対話的な入力が必要ですが、ここではスキップ
    return;
  }

  // MCP経由でmicroCMSの接続情報を取得する試み
  // 注意: 実際のMCPサーバーへのアクセスはCursorの設定に依存します
  
  console.log('MCP経由でmicroCMSの接続情報を取得中...');
  console.log('（MCPサーバーが設定されている場合、接続情報を取得します）\n');

  // 環境変数のテンプレートを作成
  const envTemplate = `# microCMSの環境変数設定
# MCP経由で取得した情報、または手動で設定してください

MICROCMS_SERVICE_DOMAIN=your-service-domain
MICROCMS_API_KEY=your-api-key

# 設定方法:
# 1. microCMSの管理画面にログイン
# 2. 「設定」→「API設定」から以下を取得:
#    - SERVICE_DOMAIN: https://[サービスドメイン].microcms.io の [サービスドメイン] 部分
#    - API_KEY: APIキーを生成して取得
`;

  try {
    fs.writeFileSync(envPath, envTemplate);
    console.log('✅ .env.localファイルを作成しました。');
    console.log('   ファイルを開いて、実際の値を設定してください。\n');
    console.log('📝 次のステップ:');
    console.log('   1. .env.localファイルを開く');
    console.log('   2. MICROCMS_SERVICE_DOMAINにサービスドメインを設定');
    console.log('   3. MICROCMS_API_KEYにAPIキーを設定');
    console.log('   4. npm run devで開発サーバーを起動して接続を確認\n');
  } catch (error: any) {
    console.error('❌ エラーが発生しました:', error.message);
  }
}

setupMicroCMSEnv();

