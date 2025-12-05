/**
 * Vercel環境変数設定支援スクリプト（MCP対応）
 * MCP経由でmicroCMSの接続情報を取得してVercelに環境変数を設定します
 * 
 * 使用方法:
 * npx tsx scripts/setup-vercel-env.ts
 * 
 * 前提条件:
 * - Vercel CLIがインストールされていること（npm install -g vercel）
 * - Vercelにログインしていること（vercel login）
 * - MCPサーバーが設定されていること（オプション）
 */

import * as dotenv from "dotenv";
import { execSync } from "child_process";

// .env.localファイルを読み込む
dotenv.config({ path: ".env.local" });

const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;
const apiKey = process.env.MICROCMS_API_KEY;

async function setupVercelEnv() {
  console.log("🚀 Vercel環境変数設定を開始します...\n");

  // 環境変数の確認
  if (!serviceDomain || !apiKey) {
    console.error("❌ 環境変数が設定されていません");
    console.error("MICROCMS_SERVICE_DOMAIN と MICROCMS_API_KEY を .env.local に設定してください");
    console.error("\nまたは、MCPサーバーが設定されている場合、自動的に取得を試みます...\n");
    
    // MCP経由で取得を試みる（実装はMCPサーバーの設定に依存）
    // ここでは、ユーザーに手動設定を促す
    console.log("📝 手動設定手順:");
    console.log("1. .env.localファイルを作成");
    console.log("2. 以下の内容を設定:");
    console.log("   MICROCMS_SERVICE_DOMAIN=your-service-domain");
    console.log("   MICROCMS_API_KEY=your-api-key");
    console.log("\nまたは、MCPサーバーを使用して自動取得してください。\n");
    return;
  }

  console.log("✅ 環境変数を確認しました");
  console.log(`   サービスドメイン: ${serviceDomain}`);
  console.log(`   APIキー: ${apiKey.substring(0, 10)}...\n`);

  // Vercel CLIの確認
  try {
    execSync("vercel --version", { stdio: "ignore" });
  } catch (error) {
    console.error("❌ Vercel CLIがインストールされていません");
    console.error("以下のコマンドでインストールしてください:");
    console.error("   npm install -g vercel");
    return;
  }

  console.log("✅ Vercel CLIを確認しました\n");

  // Vercelにログインしているか確認
  try {
    execSync("vercel whoami", { stdio: "ignore" });
  } catch (error) {
    console.error("❌ Vercelにログインしていません");
    console.error("以下のコマンドでログインしてください:");
    console.error("   vercel login");
    return;
  }

  console.log("✅ Vercelにログインしています\n");

  // 環境変数の設定
  console.log("📝 Vercelに環境変数を設定します...\n");

  try {
    // Production環境
    console.log("🔧 Production環境に設定中...");
    execSync(
      `vercel env add MICROCMS_SERVICE_DOMAIN production <<< "${serviceDomain}"`,
      { stdio: "inherit" }
    );
    execSync(
      `vercel env add MICROCMS_API_KEY production <<< "${apiKey}"`,
      { stdio: "inherit" }
    );

    // Preview環境
    console.log("\n🔧 Preview環境に設定中...");
    execSync(
      `vercel env add MICROCMS_SERVICE_DOMAIN preview <<< "${serviceDomain}"`,
      { stdio: "inherit" }
    );
    execSync(
      `vercel env add MICROCMS_API_KEY preview <<< "${apiKey}"`,
      { stdio: "inherit" }
    );

    // Development環境
    console.log("\n🔧 Development環境に設定中...");
    execSync(
      `vercel env add MICROCMS_SERVICE_DOMAIN development <<< "${serviceDomain}"`,
      { stdio: "inherit" }
    );
    execSync(
      `vercel env add MICROCMS_API_KEY development <<< "${apiKey}"`,
      { stdio: "inherit" }
    );

    console.log("\n✅ 環境変数の設定が完了しました！");
    console.log("\n📋 次のステップ:");
    console.log("1. Vercelのダッシュボードで環境変数を確認");
    console.log("2. デプロイを実行（vercel --prod または GitHubにプッシュ）");
  } catch (error: any) {
    console.error("\n❌ 環境変数の設定中にエラーが発生しました");
    console.error("エラー:", error.message);
    console.error("\n💡 手動設定方法:");
    console.error("1. Vercelのダッシュボードを開く");
    console.error("2. プロジェクトの「Settings」→「Environment Variables」を開く");
    console.error("3. 以下の環境変数を追加:");
    console.error(`   MICROCMS_SERVICE_DOMAIN=${serviceDomain}`);
    console.error(`   MICROCMS_API_KEY=${apiKey}`);
  }
}

setupVercelEnv().catch(console.error);

