/**
 * microCMSから取得できる記事数を確認するスクリプト
 */

import { createClient } from "microcms-js-sdk";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;
const apiKey = process.env.MICROCMS_API_KEY;

if (!serviceDomain || !apiKey) {
  console.error("❌ 環境変数が設定されていません");
  process.exit(1);
}

const client = createClient({
  serviceDomain,
  apiKey,
});

async function checkBlogCount() {
  console.log("📊 記事数の確認を開始します...\n");

  try {
    // 制限なしで取得
    const data = await client.get({
      endpoint: "blogs",
      queries: {
        limit: 100,
        offset: 0,
        orders: "-publishedAt",
      },
    });

    console.log(`✅ 取得成功`);
    console.log(`   取得件数: ${data.contents.length}件`);
    console.log(`   総件数: ${data.totalCount}件\n`);

    if (data.contents.length > 0) {
      console.log("📝 取得した記事一覧:");
      data.contents.forEach((blog: any, index: number) => {
        console.log(`   ${index + 1}. ${blog.title}`);
        console.log(`      ID: ${blog.id}`);
        console.log(`      公開日時: ${blog.publishedAt || "未設定"}`);
        console.log("");
      });
    } else {
      console.log("⚠️  記事が取得できませんでした");
    }
  } catch (error: any) {
    console.error("❌ エラー:", error.message);
    if (error.response) {
      console.error("   ステータス:", error.response.status);
      console.error("   レスポンス:", JSON.stringify(error.response.data, null, 2));
    }
  }
}

checkBlogCount().catch(console.error);

