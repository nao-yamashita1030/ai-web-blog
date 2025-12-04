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
  // HTMLタグが存在し、かつマークダウン記法が含まれていない場合はHTMLと判定
  const htmlRegex = /<[a-z][\s\S]*>/i;
  const hasMarkdownInTags = /<[^>]*>.*[#*`-]/.test(trimmed);
  return htmlRegex.test(trimmed) && !hasMarkdownInTags;
}

// HTMLタグ内のマークダウン記法を検出する関数
function hasMarkdownInHTML(str: string): boolean {
  if (!str || typeof str !== "string") return false;
  // HTMLタグ内にマークダウン記法が含まれているか確認
  return /<[^>]*>.*[#*`-]/.test(str);
}

export default function MarkdownContent({ content }: MarkdownContentProps) {
  const [sanitizedContent, setSanitizedContent] = useState<string>("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // クライアントサイドでDOMPurifyを使用してサニタイズ
    if (isHTML(content) && !hasMarkdownInHTML(content)) {
      setSanitizedContent(DOMPurify.sanitize(content));
    } else {
      setSanitizedContent(content);
    }
  }, [content]);

  // サーバーサイドレンダリング時は空のdivを返す
  if (!isClient) {
    return <div className="prose prose-lg max-w-none" />;
  }

  // HTMLタグ内にマークダウン記法が含まれている場合は、HTMLタグを除去してマークダウンとして処理
  if (hasMarkdownInHTML(content)) {
    // HTMLタグを除去してマークダウンとして処理
    const markdownContent = content
      .replace(/<[^>]+>/g, "") // HTMLタグを除去
      .replace(/&nbsp;/g, " ") // &nbsp;をスペースに変換
      .replace(/&amp;/g, "&") // &amp;を&に変換
      .replace(/&lt;/g, "<") // &lt;を<に変換
      .replace(/&gt;/g, ">") // &gt;を>に変換
      .trim();

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


