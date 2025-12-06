/**
 * Vercel環境変数設定スクリプト（status.mdから情報を取得）
 * status.mdに記載されているmicroCMSのURLから情報を取得してVercelに環境変数を設定します
 */

import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

// .env.localファイルを読み込む
dotenv.config({ path: ".env.local" });

async function setupVercelEnvFromStatus() {
  console.log("🚀 Vercel環境変数設定を開始します...\n");

  let serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;
  let apiKey = process.env.MICROCMS_API_KEY;

  // .env.localから取得を試みる
  if (!serviceDomain || !apiKey) {
    console.log("💡 status.mdから情報を取得中...\n");
    
    // status.mdからmicroCMSのURLを取得
    const statusPath = path.join(process.cwd(), "Docs", "status.md");
    if (fs.existsSync(statusPath)) {
      const statusContent = fs.readFileSync(statusPath, "utf-8");
      const urlMatch = statusContent.match(/https:\/\/([^.]+)\.microcms\.io/);
      
      if (urlMatch) {
        const extractedDomain = urlMatch[1];
        console.log(`✅ status.mdからサービスドメインを取得: ${extractedDomain}`);
        console.log("⚠️  APIキーは手動で設定する必要があります\n");
        
        console.log("📝 以下の方法で環境変数を設定してください:\n");
        console.log("方法1: .env.localファイルに設定");
        console.log(`   MICROCMS_SERVICE_DOMAIN=${extractedDomain}`);
        console.log("   MICROCMS_API_KEY=your-api-key\n");
        console.log("方法2: Vercelダッシュボードで手動設定");
        console.log("   https://vercel.com → プロジェクト → Settings → Environment Variables\n");
        console.log("方法3: Vercel CLIで対話的に設定");
        console.log("   vercel env add MICROCMS_SERVICE_DOMAIN production");
        console.log("   vercel env add MICROCMS_API_KEY production\n");
        
        return;
      }
    }
    
    console.log("❌ status.mdから情報を取得できませんでした");
    console.log("   手動で環境変数を設定してください\n");
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
  console.log("💡 「Mark as sensitive?」と聞かれたら、y を入力してください\n");

  const environments = ["production", "preview", "development"];

  for (const env of environments) {
    try {
      console.log(`🔧 ${env}環境に設定中...`);
      console.log(`   MICROCMS_SERVICE_DOMAIN を ${env} 環境に設定してください`);
      console.log(`   値: ${serviceDomain}`);
      console.log(`   「Mark as sensitive?」→ N を入力`);
      
      // PowerShellでパイプを使用
      execSync(
        `echo "${serviceDomain}" | vercel env add MICROCMS_SERVICE_DOMAIN ${env}`,
        { stdio: "inherit", shell: "powershell.exe" }
      );
      
      console.log(`   MICROCMS_API_KEY を ${env} 環境に設定してください`);
      console.log(`   値: ${apiKey.substring(0, 10)}...`);
      console.log(`   「Mark as sensitive?」→ y を入力`);
      
      execSync(
        `echo "${apiKey}" | vercel env add MICROCMS_API_KEY ${env}`,
        { stdio: "inherit", shell: "powershell.exe" }
      );
      
      console.log(`✅ ${env}環境の設定が完了しました\n`);
    } catch (error: any) {
      console.error(`❌ ${env}環境の設定に失敗しました`);
      console.error(`   エラー: ${error.message}`);
      console.error(`   手動で設定してください: vercel env add MICROCMS_SERVICE_DOMAIN ${env}\n`);
    }
  }

  console.log("✨ 環境変数の設定が完了しました！");
  console.log("\n📋 確認方法:");
  console.log("   npm run check:vercel-link");
}

setupVercelEnvFromStatus().catch(console.error);



