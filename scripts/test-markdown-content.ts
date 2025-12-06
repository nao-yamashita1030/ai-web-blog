/**
 * MarkdownContentコンポーネントの処理ロジックをテストするスクリプト
 */

// HTMLかマークダウンかを判定する関数
function isHTML(str: string): boolean {
  if (!str || typeof str !== "string") return false;
  const trimmed = str.trim();
  const htmlRegex = /<[a-z][\s\S]*>/i;
  return htmlRegex.test(trimmed);
}

// HTMLタグ内にマークダウン記法が含まれているか確認
function hasMarkdownInHTML(str: string): boolean {
  if (!str || typeof str !== "string") return false;
  return /<[^>]*>.*[#*`-]/.test(str) || /<p>.*#/.test(str) || /<p>.*\*/.test(str);
}

// HTMLタグを除去してマークダウンに変換
function extractMarkdownFromHTML(html: string): string {
  if (!html || typeof html !== "string") return "";
  
  try {
    let markdown = html.replace(/<[^>]+>/g, "\n");
    markdown = markdown
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
    markdown = markdown.replace(/\n{3,}/g, "\n\n");
    return markdown.trim();
  } catch (error) {
    console.error("Error extracting markdown from HTML:", error);
    return html;
  }
}

// テストケース
const testCases = [
  {
    name: "HTMLタグ内にマークダウン記法が含まれている場合",
    content: "<p># Web開発のベストプラクティス この記事では、Web開発におけるベストプラクティスを紹介します。 ## コード品質 - **コードレビュー**: チームでコードをレビュー</p>",
  },
  {
    name: "純粋なHTMLの場合",
    content: "<p>これは通常のHTMLコンテンツです。</p><p>複数の段落があります。</p>",
  },
  {
    name: "純粋なマークダウンの場合",
    content: "# タイトル\n\nこれはマークダウンコンテンツです。\n\n## サブタイトル",
  },
];

console.log("📝 MarkdownContentコンポーネントの処理ロジックをテストします...\n");

testCases.forEach((testCase, index) => {
  console.log(`\n[テストケース ${index + 1}] ${testCase.name}`);
  console.log(`入力: ${testCase.content.substring(0, 100)}...`);
  
  const isHTMLResult = isHTML(testCase.content);
  const hasMarkdownResult = hasMarkdownInHTML(testCase.content);
  
  console.log(`  - isHTML: ${isHTMLResult}`);
  console.log(`  - hasMarkdownInHTML: ${hasMarkdownResult}`);
  
  if (hasMarkdownResult) {
    const extracted = extractMarkdownFromHTML(testCase.content);
    console.log(`  - 抽出されたマークダウン: ${extracted.substring(0, 100)}...`);
  }
});



