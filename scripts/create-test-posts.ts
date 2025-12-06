/**
 * microCMSにテスト記事を5件追加するスクリプト
 * 
 * 使用方法:
 * npx tsx scripts/create-test-posts.ts
 * 
 * 注意: 書き込み用のAPIキーが必要です
 */

import { createClient } from "microcms-js-sdk";
import * as dotenv from "dotenv";

// .env.localファイルを読み込む
dotenv.config({ path: ".env.local" });

const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;
const apiKey = process.env.MICROCMS_API_KEY;

if (!serviceDomain || !apiKey) {
  console.error("❌ 環境変数が設定されていません");
  console.error("MICROCMS_SERVICE_DOMAIN と MICROCMS_API_KEY を .env.local に設定してください");
  process.exit(1);
}

const client = createClient({
  serviceDomain,
  apiKey,
});

// テスト記事のデータ
const testPosts = [
  {
    title: "Next.jsとmicroCMSでブログサイトを構築する方法",
    content: `
# Next.jsとmicroCMSでブログサイトを構築する方法

この記事では、Next.jsとmicroCMSを使用してブログサイトを構築する方法を説明します。

## はじめに

Next.jsはReactベースのフレームワークで、SSG（Static Site Generation）やSSR（Server-Side Rendering）に対応しています。
microCMSはヘッドレスCMSで、コンテンツ管理を簡単に行えます。

## セットアップ

まず、Next.jsプロジェクトを作成します。

\`\`\`bash
npx create-next-app@latest my-blog
\`\`\`

次に、microCMS SDKをインストールします。

\`\`\`bash
npm install microcms-js-sdk
\`\`\`

## まとめ

Next.jsとmicroCMSを組み合わせることで、高速で使いやすいブログサイトを構築できます。
    `.trim(),
    publishedAt: new Date("2024-12-01").toISOString(),
  },
  {
    title: "TypeScriptで型安全な開発を始めよう",
    content: `
# TypeScriptで型安全な開発を始めよう

TypeScriptは、JavaScriptに型システムを追加したプログラミング言語です。

## TypeScriptのメリット

- **型安全性**: コンパイル時にエラーを検出
- **IDEサポート**: 自動補完やリファクタリングが容易
- **大規模開発**: チーム開発で特に有効

## 基本的な使い方

\`\`\`typescript
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}
\`\`\`

## まとめ

TypeScriptを使うことで、より安全で保守しやすいコードを書くことができます。
    `.trim(),
    publishedAt: new Date("2024-12-02").toISOString(),
  },
  {
    title: "Tailwind CSSでモダンなUIを実装する",
    content: `
# Tailwind CSSでモダンなUIを実装する

Tailwind CSSは、ユーティリティファーストのCSSフレームワークです。

## Tailwind CSSの特徴

- **ユーティリティクラス**: 細かいスタイルをクラスで指定
- **カスタマイズ性**: 設定ファイルで自由にカスタマイズ
- **パフォーマンス**: 使用していないスタイルは自動的に削除

## 使用例

\`\`\`html
<button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
  クリック
</button>
\`\`\`

## まとめ

Tailwind CSSを使うことで、素早く美しいUIを実装できます。
    `.trim(),
    publishedAt: new Date("2024-12-03").toISOString(),
  },
  {
    title: "VercelでNext.jsアプリをデプロイする",
    content: `
# VercelでNext.jsアプリをデプロイする

Vercelは、Next.jsアプリケーションのデプロイに最適化されたプラットフォームです。

## Vercelの特徴

- **自動デプロイ**: Gitにプッシュするだけで自動デプロイ
- **プレビュー**: プルリクエストごとにプレビュー環境を生成
- **高速**: グローバルCDNで高速配信

## デプロイ手順

1. GitHubリポジトリにプッシュ
2. Vercelでプロジェクトをインポート
3. 環境変数を設定
4. デプロイ完了

## まとめ

Vercelを使うことで、簡単にNext.jsアプリをデプロイできます。
    `.trim(),
    publishedAt: new Date("2024-12-04").toISOString(),
  },
  {
    title: "Web開発のベストプラクティス",
    content: `
# Web開発のベストプラクティス

この記事では、Web開発におけるベストプラクティスを紹介します。

## コード品質

- **コードレビュー**: チームでコードをレビュー
- **テスト**: 単体テスト、結合テストを実施
- **ドキュメント**: コードにコメントを追加

## パフォーマンス

- **画像最適化**: 適切な形式とサイズを使用
- **コード分割**: 必要なコードのみを読み込む
- **キャッシュ**: 適切にキャッシュを活用

## セキュリティ

- **HTTPS**: 常にHTTPSを使用
- **入力検証**: ユーザー入力を検証
- **依存関係**: 定期的に依存関係を更新

## まとめ

これらのベストプラクティスを守ることで、高品質なWebアプリケーションを開発できます。
    `.trim(),
    publishedAt: new Date("2024-12-05").toISOString(),
  },
];

async function createTestPosts() {
  console.log("📝 テスト記事の作成を開始します...\n");

  const endpoint = "blogs"; // エンドポイント名を確認してください

  for (let i = 0; i < testPosts.length; i++) {
    const post = testPosts[i];
    try {
      console.log(`[${i + 1}/${testPosts.length}] 記事を作成中: "${post.title}"`);
      
      // 注意: microCMSの管理APIは通常、書き込み用のAPIキーが必要です
      // このスクリプトは読み取り専用のAPIキーでは動作しない可能性があります
      const result = await client.create({
        endpoint,
        content: {
          title: post.title,
          content: post.content,
          publishedAt: post.publishedAt,
        },
      });

      console.log(`✅ 作成成功: ${result.id}\n`);
    } catch (error: any) {
      console.error(`❌ 作成失敗: ${error.message}`);
      if (error.response?.status === 401) {
        console.error("   書き込み用のAPIキーが必要です");
      }
      console.log("");
    }
  }

  console.log("✨ テスト記事の作成が完了しました");
}

createTestPosts().catch(console.error);



