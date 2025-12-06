# API詳細仕様: 記事一覧取得API

## 基本情報

- **API名**: 記事一覧取得API
- **エンドポイント**: `GET /api/v1/blog`
- **HTTPメソッド**: GET
- **バージョン**: v1
- **説明**: ブログ記事の一覧を取得するAPI

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

| パラメータ名 | 型 | 必須 | 説明 | デフォルト値 |
|------------|---|------|------|------------|
| limit | number | 任意 | 取得件数 | 10 |
| offset | number | 任意 | オフセット | 0 |
| orders | string | 任意 | ソート順（例: `-publishedAt`） | `-publishedAt` |
| filters | string | 任意 | フィルタ条件 | - |
| fields | string | 任意 | 取得するフィールド | - |
| depth | number | 任意 | 参照の深さ | 1 |

### リクエスト例

```bash
curl -X GET "https://{serviceDomain}.microcms.io/api/v1/blog?limit=10&offset=0&orders=-publishedAt" \
  -H "X-API-KEY: {API_KEY}"
```

## レスポンス

### 成功レスポンス

**ステータスコード**: 200

```json
{
  "contents": [
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
  ],
  "totalCount": 100,
  "limit": 10,
  "offset": 0
}
```

| フィールド名 | 型 | 説明 |
|------------|---|------|
| contents | array | 記事配列 |
| totalCount | number | 総件数 |
| limit | number | 取得件数 |
| offset | number | オフセット |

### エラーレスポンス

**ステータスコード**: 400 / 401 / 500

```json
{
  "message": "エラーメッセージ"
}
```

| エラーコード | ステータスコード | 説明 |
|------------|----------------|------|
| 400 | 400 | リクエストが不正 |
| 401 | 401 | 認証エラー |
| 500 | 500 | サーバーエラー |

## バリデーション

### 入力バリデーション

- `limit`: 1以上100以下
- `offset`: 0以上
- `orders`: 有効なフィールド名とソート順（`-`で降順）

### ビジネスルールバリデーション

- publishedAtが設定されている記事のみを取得（フィルタ条件で指定可能）

## 処理フロー

1. APIキーを検証
2. リクエストパラメータを検証
3. データベースから記事データを取得
4. フィルタ条件を適用
5. ソートを適用
6. ページネーションを適用
7. レスポンスを返す

## 使用例

### 例1: 基本的な記事一覧取得

```typescript
const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN!,
  apiKey: process.env.MICROCMS_API_KEY!,
});

const response = await client.get({
  endpoint: 'blog',
  queries: {
    limit: 10,
    orders: '-publishedAt',
  },
});
```

### 例2: カテゴリでフィルタ

```typescript
const response = await client.get({
  endpoint: 'blog',
  queries: {
    limit: 10,
    filters: 'category[equals]category-001',
    orders: '-publishedAt',
  },
});
```

## 注意事項

- ビルド時に全記事を取得する場合は、`limit`を大きく設定するか、複数回リクエストする
- `filters`パラメータを使用して、公開済み記事のみを取得することを推奨

## 関連API

- [記事詳細取得API](./get-blog-detail.md)
- [カテゴリ一覧取得API](./get-category-list.md)
- [タグ一覧取得API](./get-tag-list.md)




