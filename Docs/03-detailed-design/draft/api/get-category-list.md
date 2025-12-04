# API詳細仕様: カテゴリ一覧取得API

## 基本情報

- **API名**: カテゴリ一覧取得API
- **エンドポイント**: `GET /api/v1/category`
- **HTTPメソッド**: GET
- **バージョン**: v1
- **説明**: カテゴリの一覧を取得するAPI

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

#### クエリパラメータ

| パラメータ名 | 型 | 必須 | 説明 |
|------------|---|------|------|
| limit | number | 任意 | 取得件数 |
| offset | number | 任意 | オフセット |

### リクエスト例

```bash
curl -X GET "https://{serviceDomain}.microcms.io/api/v1/category" \
  -H "X-API-KEY: {API_KEY}"
```

## レスポンス

### 成功レスポンス

**ステータスコード**: 200

```json
{
  "contents": [
    {
      "id": "category-001",
      "name": "カテゴリ名",
      "slug": "category-slug",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "totalCount": 10,
  "limit": 10,
  "offset": 0
}
```

## 使用例

```typescript
const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN!,
  apiKey: process.env.MICROCMS_API_KEY!,
});

const categories = await client.get({
  endpoint: 'category',
});
```

## 関連API

- [記事一覧取得API](./get-blog-list.md)


