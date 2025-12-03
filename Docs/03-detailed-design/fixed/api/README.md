# API詳細仕様一覧

## 概要

このディレクトリには、microCMS APIの詳細仕様を管理します。

## API一覧

### 記事関連API

1. [記事一覧取得API](./get-blog-list.md)
   - エンドポイント: `GET /api/v1/blog`
   - 用途: 記事一覧の取得

2. [記事詳細取得API](./get-blog-detail.md)
   - エンドポイント: `GET /api/v1/blog/{contentId}`
   - 用途: 特定記事の取得

### カテゴリ関連API

3. [カテゴリ一覧取得API](./get-category-list.md)
   - エンドポイント: `GET /api/v1/category`
   - 用途: カテゴリ一覧の取得

### タグ関連API

4. [タグ一覧取得API](./get-tag-list.md)
   - エンドポイント: `GET /api/v1/tag`
   - 用途: タグ一覧の取得

## 認証

すべてのAPIはmicroCMSのAPIキー認証を使用します。

- **認証方式**: APIキー認証
- **ヘッダー**: `X-API-KEY: {API_KEY}`
- **APIキー管理**: 環境変数（`MICROCMS_API_KEY`）

## ベースURL

```
https://{serviceDomain}.microcms.io
```

## レスポンス形式

すべてのAPIはJSON形式でレスポンスを返します。

## エラーハンドリング

エラーが発生した場合、適切なHTTPステータスコードとエラーメッセージを返します。

- **400**: リクエストが不正
- **401**: 認証エラー
- **404**: リソースが見つからない
- **500**: サーバーエラー
