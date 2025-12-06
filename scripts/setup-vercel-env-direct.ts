/**
 * Vercel環境変数直接設定スクリプト
 * status.mdから取得した情報を使用してVercelに環境変数を設定します
 */

import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

async function setupVercelEnvDirect() {
  console.log("🚀 Vercel環境変数設定を開始します...\n");

  // status.mdからサービスドメインを取得
  const statusPath = path.join(process.cwd(), "Docs", "status.md");
  let serviceDomain = "";

  if (fs.existsSync(statusPath)) {
    const statusContent = fs.readFileSync(statusPath, "utf-8");
    const urlMatch = statusContent.match(/https:\/\/([^.]+)\.microcms\.io/);
    
    if (urlMatch) {
      serviceDomain = urlMatch[1];
      console.log(`✅ サービスドメインを取得: ${serviceDomain}`);
    }
  }

  if (!serviceDomain) {
    console.error("❌ サービスドメインを取得できませんでした");
    console.error("   status.mdにmicroCMSのURLが記載されているか確認してください");
    return;
  }

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
  console.log("💡 以下のコマンドを実行してください:\n");

  const environments = ["production", "preview", "development"];

  for (const env of environments) {
    console.log(`🔧 ${env}環境:`);
    console.log(`   vercel env add MICROCMS_SERVICE_DOMAIN ${env}`);
    console.log(`   値: ${serviceDomain}`);
    console.log(`   「Mark as sensitive?」→ N\n`);
    console.log(`   vercel env add MICROCMS_API_KEY ${env}`);
    console.log(`   値: [APIキーを入力]`);
    console.log(`   「Mark as sensitive?」→ y\n`);
  }

  console.log("💡 または、以下のコマンドを一括で実行できます:\n");
  console.log(`vercel env add MICROCMS_SERVICE_DOMAIN production`);
  console.log(`   → ${serviceDomain} を入力`);
  console.log(`   → N を入力\n`);
  console.log(`vercel env add MICROCMS_API_KEY production`);
  console.log(`   → [APIキー] を入力`);
  console.log(`   → y を入力\n`);
}

setupVercelEnvDirect().catch(console.error);



