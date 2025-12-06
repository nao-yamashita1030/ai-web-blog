/**
 * Vercel環境変数設定スクリプト（MCP経由）
 * MCP経由でmicroCMSの接続情報を取得してVercelに環境変数を設定します
 */

import { execSync } from "child_process";
import * as dotenv from "dotenv";

// .env.localファイルを読み込む
dotenv.config({ path: ".env.local" });

async function setupVercelEnvMCP() {
  console.log("🚀 Vercel環境変数設定を開始します（MCP経由）...\n");

  let serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;
  let apiKey = process.env.MICROCMS_API_KEY;

  // MCP経由で取得を試みる
  if (!serviceDomain || !apiKey) {
    console.log("💡 MCP経由でmicroCMSの接続情報を取得中...\n");
    
    // 注意: 実際のMCPサーバーへのアクセスはCursorの設定に依存します
    // ここでは、MCPサーバーが設定されている場合の処理を想定
    
    // MCPサーバーから取得する処理（実装はMCPサーバーの設定に依存）
    // 現在は、.env.localから読み込むか、手動入力が必要
    
    console.log("⚠️  MCPサーバーからの取得は現在サポートされていません");
    console.log("   以下のいずれかの方法で設定してください:\n");
    console.log("1. .env.localファイルに設定:");
    console.log("   MICROCMS_SERVICE_DOMAIN=your-service-domain");
    console.log("   MICROCMS_API_KEY=your-api-key\n");
    console.log("2. Vercelダッシュボードで手動設定:");
    console.log("   https://vercel.com → プロジェクト → Settings → Environment Variables\n");
    console.log("3. 対話的設定スクリプトを使用:");
    console.log("   npm run setup:vercel-env:interactive\n");
    
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
    return;
  }

  // Vercelにログインしているか確認
  try {
    execSync("vercel whoami", { stdio: "ignore" });
  } catch (error) {
    console.error("❌ Vercelにログインしていません");
    return;
  }

  console.log("✅ Vercel CLIとログイン状態を確認しました\n");

  // 環境変数の設定
  console.log("📝 Vercelに環境変数を設定します...\n");
  console.log("💡 各環境変数の入力が求められたら、値を入力してEnterを押してください\n");

  const environments = ["production", "preview", "development"];

  for (const env of environments) {
    try {
      console.log(`🔧 ${env}環境に設定中...`);
      
      // vercel env add は対話的に入力を受け付ける
      // PowerShellではパイプがうまく動作しないため、直接実行
      console.log(`   MICROCMS_SERVICE_DOMAIN を ${env} 環境に設定してください`);
      execSync(
        `vercel env add MICROCMS_SERVICE_DOMAIN ${env}`,
        { 
          stdio: "inherit",
          input: `${serviceDomain}\n`
        }
      );
      
      console.log(`   MICROCMS_API_KEY を ${env} 環境に設定してください`);
      execSync(
        `vercel env add MICROCMS_API_KEY ${env}`,
        { 
          stdio: "inherit",
          input: `${apiKey}\n`
        }
      );
      
      console.log(`✅ ${env}環境の設定が完了しました\n`);
    } catch (error: any) {
      console.error(`❌ ${env}環境の設定に失敗しました`);
      console.error(`   エラー: ${error.message}\n`);
    }
  }

  console.log("✨ 環境変数の設定が完了しました！");
  console.log("\n📋 確認方法:");
  console.log("   npm run check:vercel-link");
  console.log("\n📋 次のステップ:");
  console.log("   デプロイを実行（vercel --prod または GitHubにプッシュ）");
}

setupVercelEnvMCP().catch(console.error);



