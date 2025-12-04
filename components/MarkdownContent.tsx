"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import DOMPurify from "dompurify";

type MarkdownContentProps = {
  content: string;
};

// HTMLかマークダウンかを判定する関数
function isHTML(str: string): boolean {
  if (!str || typeof str !== "string") return false;
  const trimmed = str.trim();
  // HTMLタグが存在するか確認
  const htmlRegex = /<[a-z][\s\S]*>/i;
  return htmlRegex.test(trimmed);
}

// HTMLタグ内にマークダウン記法が含まれているか確認
function hasMarkdownInHTML(str: string): boolean {
  if (!str || typeof str !== "string") return false;
  // HTMLタグ内にマークダウン記法（#, *, `, -, ##, ###など）が含まれているか確認
  return /<[^>]*>.*[#*`-]/.test(str) || /<p>.*#/.test(str) || /<p>.*\*/.test(str);
}

// HTMLタグを除去してマークダウンに変換
function extractMarkdownFromHTML(html: string): string {
  if (!html || typeof html !== "string") return "";
  
  try {
    // HTMLタグを除去（閉じタグの前に改行を追加）
    let markdown = html
      .replace(/<\/p>/gi, "\n\n")
      .replace(/<\/div>/gi, "\n\n")
      .replace(/<\/h[1-6]>/gi, "\n\n")
      .replace(/<\/li>/gi, "\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, "");
    
    // HTMLエンティティを変換
    markdown = markdown
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&#x27;/g, "'")
      .replace(/&#x2F;/g, "/");
    
    // マークダウン記法の前に改行を追加（必要に応じて）
    // 注意: **（太字）や*（強調）を壊さないように注意
    // まず、見出し記法（#）の前に改行を追加
    markdown = markdown
      .replace(/([^\n])(#{1,3})([^#\s\n])/g, "$1\n$2$3") // #, ##, ###の前に改行
      // リスト項目の-の前に改行（ただし、**の後や数字の後は除く）
      .replace(/([^\n\*])\s+-\s+([^\s-])/g, "$1\n- $2")
      // リスト項目の*の前に改行（ただし、**の一部は除く）
      .replace(/([^\n\*])\s+\*\s+([^\s\*])/g, "$1\n* $2");
    
    // 連続する改行を整理（最大2つまで）
    markdown = markdown.replace(/\n{3,}/g, "\n\n");
    
    // 先頭と末尾の不要な改行を削除
    return markdown.trim();
  } catch (error) {
    console.error("Error extracting markdown from HTML:", error);
    return html;
  }
}

export default function MarkdownContent({ content }: MarkdownContentProps) {
  const [sanitizedContent, setSanitizedContent] = useState<string>("");
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    setError(null);
    
    try {
      // クライアントサイドでDOMPurifyを使用してサニタイズ
      if (isHTML(content) && !hasMarkdownInHTML(content)) {
        setSanitizedContent(DOMPurify.sanitize(content));
      } else {
        setSanitizedContent(content);
      }
    } catch (err) {
      console.error("Error processing content:", err);
      setError("コンテンツの処理中にエラーが発生しました");
      setSanitizedContent(content);
    }
  }, [content]);

  // サーバーサイドレンダリング時は空のdivを返す
  if (!isClient) {
    return <div className="prose prose-lg max-w-none" />;
  }

  // エラーが発生した場合は元のコンテンツを表示
  if (error) {
    return (
      <div className="prose prose-lg max-w-none">
        <p className="text-red-600">{error}</p>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    );
  }

  // HTMLタグ内にマークダウン記法が含まれている場合は、HTMLタグを除去してマークダウンとして処理
  if (hasMarkdownInHTML(content)) {
    const markdownContent = extractMarkdownFromHTML(content);
    
    return (
      <div className="prose prose-lg max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code: ({ node, className, children, ...props }) => {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {markdownContent}
        </ReactMarkdown>
      </div>
    );
  }

  // 純粋なHTMLの場合はサニタイズして表示
  if (isHTML(content)) {
    return (
      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: sanitizedContent || content }}
      />
    );
  }

  // マークダウンの場合はreact-markdownで表示
  return (
    <div className="prose prose-lg max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code: ({ node, className, children, ...props }) => {
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}


