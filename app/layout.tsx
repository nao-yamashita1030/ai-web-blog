import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "個人ブログサイト",
  description: "個人の考えや経験を共有するブログサイト",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}

