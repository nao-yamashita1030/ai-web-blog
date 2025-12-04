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
  const htmlRegex = /<[a-z][\s\S]*>/i;
  return htmlRegex.test(str.trim());
}

export default function MarkdownContent({ content }: MarkdownContentProps) {
  const [sanitizedContent, setSanitizedContent] = useState<string>("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // クライアントサイドでDOMPurifyを使用してサニタイズ
    if (isHTML(content)) {
      setSanitizedContent(DOMPurify.sanitize(content));
    } else {
      setSanitizedContent(content);
    }
  }, [content]);

  // サーバーサイドレンダリング時は空のdivを返す
  if (!isClient) {
    return <div className="prose prose-lg max-w-none" />;
  }

  // HTMLの場合はサニタイズして表示、マークダウンの場合はreact-markdownで表示
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
          // コードブロックのスタイリング
          code: ({ node, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
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


