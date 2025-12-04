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
  const htmlRegex = /<[a-z][\s\S]*>/i;
  return htmlRegex.test(str);
}

export default function MarkdownContent({ content }: MarkdownContentProps) {
  const [sanitizedContent, setSanitizedContent] = useState<string>("");

  useEffect(() => {
    // クライアントサイドでDOMPurifyを使用してサニタイズ
    if (isHTML(content)) {
      setSanitizedContent(DOMPurify.sanitize(content));
    } else {
      setSanitizedContent(content);
    }
  }, [content]);

  // HTMLの場合はサニタイズして表示、マークダウンの場合はreact-markdownで表示
  if (isHTML(content)) {
    return (
      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: sanitizedContent || content }}
      />
    );
  }

  return (
    <div className="prose prose-lg max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}


