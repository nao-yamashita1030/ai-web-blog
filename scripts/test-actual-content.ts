/**
 * 実際のmicroCMSコンテンツを取得してテストするスクリプト
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

// HTMLタグを除去してマークダウンに変換
function extractMarkdownFromHTML(html: string): string {
  if (!html || typeof html !== "string") return "";
  
  try {
    let markdown = html
      .replace(/<\/p>/gi, "\n\n")
      .replace(/<\/div>/gi, "\n\n")
      .replace(/<\/h[1-6]>/gi, "\n\n")
      .replace(/<\/li>/gi, "\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, "");
    
    markdown = markdown
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&#x27;/g, "'")
      .replace(/&#x2F;/g, "/");
    
    markdown = markdown
      .replace(/([^\n])#([^#\s])/g, "$1\n#$2")
      .replace(/([^\n])##([^#\s])/g, "$1\n##$2")
      .replace(/([^\n])###([^#\s])/g, "$1\n###$2")
      .replace(/([^\n])-([^\s-])/g, "$1\n-$2")
      .replace(/([^\n])\*([^\s*])/g, "$1\n*$2");
    
    markdown = markdown.replace(/\n{3,}/g, "\n\n");
    return markdown.trim();
  } catch (error) {
    console.error("Error extracting markdown from HTML:", error);
    return html;
  }
}

async function testActualContent() {
  console.log("📝 実際のコンテンツをテストします...\n");

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
    console.log("元のコンテンツ（最初の200文字）:");
    console.log(blog.content.substring(0, 200));
    console.log("\n");

    const extracted = extractMarkdownFromHTML(blog.content);
    console.log("抽出されたマークダウン（最初の200文字）:");
    console.log(extracted.substring(0, 200));
    console.log("\n");

    // 改行の数を確認
    const originalNewlines = (blog.content.match(/\n/g) || []).length;
    const extractedNewlines = (extracted.match(/\n/g) || []).length;
    console.log(`元のコンテンツの改行数: ${originalNewlines}`);
    console.log(`抽出後の改行数: ${extractedNewlines}`);
  } catch (error: any) {
    console.error("❌ エラー:", error.message);
  }
}

testActualContent().catch(console.error);



