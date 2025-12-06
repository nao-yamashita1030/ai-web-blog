/**
 * microCMSから取得した記事のコンテンツ形式を確認するスクリプト
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

async function checkBlogContent() {
  console.log("📊 記事のコンテンツ形式を確認します...\n");

  try {
    const data = await client.get({
      endpoint: "blogs",
      queries: {
        limit: 1,
        offset: 0,
      },
    });

    if (data.contents.length === 0) {
      console.log("⚠️  記事がありません");
      return;
    }

    const blog = data.contents[0];
    console.log(`📝 記事: ${blog.title}\n`);
    console.log("コンテンツの先頭100文字:");
    console.log(blog.content.substring(0, 100));
    console.log("\n");

    // HTMLかマークダウンかを判定
    const isHTML = /<[a-z][\s\S]*>/i.test(blog.content);
    console.log(`形式: ${isHTML ? "HTML" : "マークダウン"}\n`);

    // 改行の有無を確認
    const hasNewlines = blog.content.includes("\n");
    console.log(`改行あり: ${hasNewlines ? "はい" : "いいえ"}\n`);

    // マークダウン記法の有無を確認
    const hasMarkdown = /^#+\s|^\*\s|^-\s|```|`/m.test(blog.content);
    console.log(`マークダウン記法あり: ${hasMarkdown ? "はい" : "いいえ"}\n`);
  } catch (error: any) {
    console.error("❌ エラー:", error.message);
  }
}

checkBlogContent().catch(console.error);



