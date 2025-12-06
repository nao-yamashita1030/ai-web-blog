/**
 * Vercel環境変数対話的設定スクリプト
 * 対話的に環境変数を入力してVercelに設定します
 */

import { execSync } from "child_process";
import * as readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function setupVercelEnvInteractive() {
  console.log("🚀 Vercel環境変数対話的設定を開始します...\n");

  // Vercel CLIの確認
  try {
    execSync("vercel --version", { stdio: "ignore" });
  } catch (error) {
    console.error("❌ Vercel CLIがインストールされていません");
    console.error("以下のコマンドでインストールしてください:");
    console.error("   npm install -g vercel");
    rl.close();
    return;
  }

  // Vercelにログインしているか確認
  try {
    execSync("vercel whoami", { stdio: "ignore" });
  } catch (error) {
    console.error("❌ Vercelにログインしていません");
    console.error("以下のコマンドでログインしてください:");
    console.error("   vercel login");
    rl.close();
    return;
  }

  console.log("✅ Vercel CLIとログイン状態を確認しました\n");

  // 環境変数の入力
  console.log("📝 環境変数を入力してください:\n");

  const serviceDomain = await question("MICROCMS_SERVICE_DOMAIN: ");
  const apiKey = await question("MICROCMS_API_KEY: ");

  if (!serviceDomain || !apiKey) {
    console.error("\n❌ 環境変数が入力されていません");
    rl.close();
    return;
  }

  console.log("\n📝 Vercelに環境変数を設定します...\n");

  const environments = ["production", "preview", "development"];

  for (const env of environments) {
    try {
      console.log(`🔧 ${env}環境に設定中...`);
      
      // PowerShellでは <<< が使えないので、echo を使用
      execSync(
        `echo ${serviceDomain} | vercel env add MICROCMS_SERVICE_DOMAIN ${env}`,
        { stdio: "inherit", shell: "powershell.exe" }
      );
      
      execSync(
        `echo ${apiKey} | vercel env add MICROCMS_API_KEY ${env}`,
        { stdio: "inherit", shell: "powershell.exe" }
      );
    } catch (error: any) {
      console.error(`❌ ${env}環境の設定に失敗しました`);
      console.error(`   エラー: ${error.message}`);
    }
  }

  console.log("\n✅ 環境変数の設定が完了しました！");
  console.log("\n📋 次のステップ:");
  console.log("1. Vercelのダッシュボードで環境変数を確認");
  console.log("2. デプロイを実行（vercel --prod または GitHubにプッシュ）");

  rl.close();
}

setupVercelEnvInteractive().catch(console.error);



