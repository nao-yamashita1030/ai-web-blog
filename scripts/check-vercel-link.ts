/**
 * Vercelリンク状態確認スクリプト
 * vercel linkが正しく設定されているか確認します
 */

import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

async function checkVercelLink() {
  console.log("🔍 Vercelリンク状態を確認します...\n");

  // 1. Vercel CLIの確認
  try {
    const version = execSync("vercel --version", { encoding: "utf-8" }).trim();
    console.log(`✅ Vercel CLI: ${version}`);
  } catch (error) {
    console.error("❌ Vercel CLIがインストールされていません");
    console.error("   npm install -g vercel でインストールしてください");
    return;
  }

  // 2. ログイン状態の確認
  try {
    const whoami = execSync("vercel whoami", { encoding: "utf-8" }).trim();
    console.log(`✅ ログインユーザー: ${whoami}`);
  } catch (error) {
    console.error("❌ Vercelにログインしていません");
    console.error("   vercel login でログインしてください");
    return;
  }

  // 3. .vercelディレクトリの確認
  const vercelDir = path.join(process.cwd(), ".vercel");
  if (fs.existsSync(vercelDir)) {
    console.log("✅ .vercelディレクトリが存在します");

    // project.jsonの確認
    const projectJsonPath = path.join(vercelDir, "project.json");
    if (fs.existsSync(projectJsonPath)) {
      try {
        const projectJson = JSON.parse(
          fs.readFileSync(projectJsonPath, "utf-8")
        );
        console.log(`   - プロジェクト名: ${projectJson.projectName}`);
        console.log(`   - プロジェクトID: ${projectJson.projectId}`);
        console.log(`   - 組織ID: ${projectJson.orgId}`);
      } catch (error) {
        console.error("   ⚠️  project.jsonの読み込みに失敗しました");
      }
    } else {
      console.error("   ❌ project.jsonが見つかりません");
    }
  } else {
    console.error("❌ .vercelディレクトリが見つかりません");
    console.error("   vercel link を実行してください");
    return;
  }

  // 4. プロジェクトの確認
  try {
    const lsOutput = execSync("vercel ls", { encoding: "utf-8" });
    console.log("\n✅ プロジェクトがリンクされています");
    console.log("\n📋 デプロイメント一覧:");
    console.log(lsOutput);
  } catch (error: any) {
    console.error("❌ プロジェクトの確認に失敗しました");
    console.error(`   エラー: ${error.message}`);
  }

  // 5. 環境変数の確認
  try {
    const envOutput = execSync("vercel env ls", { encoding: "utf-8" });
    console.log("\n📋 環境変数一覧:");
    console.log(envOutput);

    // 必要な環境変数が設定されているか確認
    if (envOutput.includes("MICROCMS_SERVICE_DOMAIN")) {
      console.log("✅ MICROCMS_SERVICE_DOMAIN が設定されています");
    } else {
      console.log("⚠️  MICROCMS_SERVICE_DOMAIN が設定されていません");
      console.log("   npm run setup:vercel-env を実行してください");
    }

    if (envOutput.includes("MICROCMS_API_KEY")) {
      console.log("✅ MICROCMS_API_KEY が設定されています");
    } else {
      console.log("⚠️  MICROCMS_API_KEY が設定されていません");
      console.log("   npm run setup:vercel-env を実行してください");
    }
  } catch (error: any) {
    console.error("❌ 環境変数の確認に失敗しました");
    console.error(`   エラー: ${error.message}`);
  }

  console.log("\n✨ 確認完了");
}

checkVercelLink().catch(console.error);



