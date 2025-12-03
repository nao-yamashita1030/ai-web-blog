# API詳細仕様: 記事詳細取得API

## 基本情報

- **API名**: 記事詳細取得API
- **エンドポイント**: `GET /api/v1/blog/{contentId}`
- **HTTPメソッド**: GET
- **バージョン**: v1
- **説明**: 指定されたIDの記事詳細を取得するAPI

## 認証・認可

- **認証要件**: 必須
- **認可要件**: APIキー認証
- **権限**: 読み取り権限

## リクエスト

### リクエストヘッダー

```
X-API-KEY: {API_KEY}
```

### リクエストパラメータ

#### パスパラメータ

| パラメータ名 | 型 | 必須 | 説明 |
|------------|---|------|------|
| contentId | string | 必須 | 記事ID |

#### クエリパラメータ

| パラメータ名 | 型 | 必須 | 説明 |
|------------|---|------|------|
| fields | string | 任意 | 取得するフィールド |
| depth | number | 任意 | 参照の深さ |

### リクエスト例

```bash
curl -X GET "https://{serviceDomain}.microcms.io/api/v1/blog/article-001" \
  -H "X-API-KEY: {API_KEY}"
```

## レスポンス

### 成功レスポンス

**ステータスコード**: 200

```json
{
  "id": "article-001",
  "title": "記事タイトル",
  "content": "記事本文（マークダウン）",
  "category": {
    "id": "category-001",
    "name": "カテゴリ名",
    "slug": "category-slug"
  },
  "tags": [
    {
      "id": "tag-001",
      "name": "タグ名",
      "slug": "tag-slug"
    }
  ],
  "eyecatch": {
    "url": "https://example.com/image.jpg",
    "width": 1200,
    "height": 630
  },
  "publishedAt": "2024-01-01T00:00:00.000Z",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### エラーレスポンス

**ステータスコード**: 401 / 404 / 500

```json
{
  "message": "エラーメッセージ"
}
```

| エラーコード | ステータスコード | 説明 |
|------------|----------------|------|
| 401 | 401 | 認証エラー |
| 404 | 404 | 記事が見つからない |
| 500 | 500 | サーバーエラー |

## 処理フロー

1. APIキーを検証
2. 記事IDでデータベースから記事を取得
3. 記事が存在しない場合は404エラーを返す
4. レスポンスを返す

## 使用例

```typescript
const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN!,
  apiKey: process.env.MICROCMS_API_KEY!,
});

const article = await client.get({
  endpoint: 'blog',
  contentId: 'article-001',
});
```

## 関連API

- [記事一覧取得API](./get-blog-list.md)

