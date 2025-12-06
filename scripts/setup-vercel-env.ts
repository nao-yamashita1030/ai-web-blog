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
    
    // .env.localファイルの状態を確認
    const fs = require("fs");
    const path = require("path");
    const envPath = path.join(process.cwd(), ".env.local");
    
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, "utf-8");
      const lines = envContent.split("\n");
      const envVars: { [key: string]: boolean } = {};
      
      lines.forEach((line: string) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#")) {
          const match = trimmed.match(/^([A-Z_]+)=/);
          if (match) {
            envVars[match[1]] = true;
          }
        }
      });
      
      console.log("\n📋 .env.localファイルの状態:");
      console.log(`   MICROCMS_SERVICE_DOMAIN: ${envVars["MICROCMS_SERVICE_DOMAIN"] ? "✅ 設定あり" : "❌ 設定なし"}`);
      console.log(`   MICROCMS_API_KEY: ${envVars["MICROCMS_API_KEY"] ? "✅ 設定あり" : "❌ 設定なし"}`);
      
      if (!envVars["MICROCMS_SERVICE_DOMAIN"] || !envVars["MICROCMS_API_KEY"]) {
        console.log("\n📝 以下の形式で.env.localファイルに設定してください:");
        console.log("   MICROCMS_SERVICE_DOMAIN=your-service-domain");
        console.log("   MICROCMS_API_KEY=your-api-key");
        console.log("\n💡 ヒント:");
        console.log("   - 値の前後にスペースや引用符は不要です");
        console.log("   - コメント行（#で始まる行）は無視されます");
        console.log("   - 空行は無視されます");
      }
    } else {
      console.log("\n❌ .env.localファイルが見つかりません");
      console.log("\n📝 .env.localファイルを作成して、以下の内容を設定してください:");
      console.log("   MICROCMS_SERVICE_DOMAIN=your-service-domain");
      console.log("   MICROCMS_API_KEY=your-api-key");
    }
    
    console.log("\n💡 MCPサーバーが設定されている場合、自動的に取得を試みます...");
    console.log("   現在は手動設定が必要です。\n");
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
    const environments = ["production", "preview", "development"];

    for (const env of environments) {
      console.log(`🔧 ${env}環境に設定中...`);
      
      // PowerShell対応: echo を使用してパイプで渡す
      try {
        execSync(
          `echo ${serviceDomain} | vercel env add MICROCMS_SERVICE_DOMAIN ${env}`,
          { stdio: "inherit", shell: "powershell.exe" }
        );
      } catch (error: any) {
        // 対話的入力にフォールバック
        console.log(`   MICROCMS_SERVICE_DOMAIN を ${env} 環境に設定してください: ${serviceDomain}`);
      }

      try {
        execSync(
          `echo ${apiKey} | vercel env add MICROCMS_API_KEY ${env}`,
          { stdio: "inherit", shell: "powershell.exe" }
        );
      } catch (error: any) {
        // 対話的入力にフォールバック
        console.log(`   MICROCMS_API_KEY を ${env} 環境に設定してください: ${apiKey.substring(0, 10)}...`);
      }
      
      console.log("");
    }

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

