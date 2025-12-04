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
    // HTMLタグを除去
    let markdown = html.replace(/<[^>]+>/g, "\n");
    
    // HTMLエンティティを変換
    markdown = markdown
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
    
    // 連続する改行を整理（最大2つまで）
    markdown = markdown.replace(/\n{3,}/g, "\n\n");
    
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


