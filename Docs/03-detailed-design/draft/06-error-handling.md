# エラーハンドリング詳細

## 6.1 エラーコード定義

### エラーコード体系
- **ビルド時エラー**: B001〜B099
- **実行時エラー**: R001〜R099
- **APIエラー**: A001〜A099
- **検証エラー**: V001〜V099

### エラーコード一覧

| エラーコード | エラーメッセージ | 説明 | 対処方法 |
|------------|----------------|------|---------|
| B001 | Failed to connect to microCMS API | microCMS APIへの接続失敗 | APIキーとサービスドメインを確認 |
| B002 | Failed to fetch blog data | 記事データの取得失敗 | API接続とデータ構造を確認 |
| B003 | Failed to fetch category data | カテゴリデータの取得失敗 | API接続とデータ構造を確認 |
| B004 | Failed to fetch tag data | タグデータの取得失敗 | API接続とデータ構造を確認 |
| B005 | Build process failed | ビルドプロセスの失敗 | エラーログを確認 |
| R001 | Page not found | ページが見つからない | 404ページを表示 |
| R002 | Article not found | 記事が見つからない | 404ページを表示 |
| R003 | Category not found | カテゴリが見つからない | 404ページを表示 |
| R004 | Tag not found | タグが見つからない | 404ページを表示 |
| A001 | API connection error | API接続エラー | ネットワークとAPIキーを確認 |
| A002 | API response error | APIレスポンスエラー | APIレスポンス形式を確認 |
| V001 | Invalid search query | 無効な検索クエリ | 検索クエリを再入力 |
| V002 | Search query too long | 検索クエリが長すぎる | 検索クエリを短くする |

## 6.2 エラー処理詳細

### ビルド時エラー

#### B001: microCMS API接続エラー

##### 発生条件
- microCMS APIへの接続が失敗
- ネットワークエラー
- APIキーが無効

##### エラーコード
- B001

##### 処理内容
1. エラーログを出力
2. ビルドを失敗させる
3. エラーメッセージを表示

##### ユーザーへの通知
- ビルドログにエラーメッセージを表示
- Vercelのビルドログで確認可能

##### ログ出力
```
[ERROR] B001: Failed to connect to microCMS API
  - Service Domain: {serviceDomain}
  - Error: {errorMessage}
  - Timestamp: {timestamp}
```

#### B002: 記事データ取得エラー

##### 発生条件
- microCMS APIから記事データを取得できない
- レスポンスの形式が不正

##### エラーコード
- B002

##### 処理内容
1. エラーログを出力
2. ビルドを失敗させる
3. エラーメッセージを表示

##### ユーザーへの通知
- ビルドログにエラーメッセージを表示

##### ログ出力
```
[ERROR] B002: Failed to fetch blog data
  - API Endpoint: /api/v1/blog
  - Error: {errorMessage}
  - Timestamp: {timestamp}
```

### 実行時エラー

#### R001: ページが見つからない

##### 発生条件
- 存在しないURLにアクセス
- 削除されたページにアクセス

##### エラーコード
- R001

##### 処理内容
1. カスタム404ページを表示
2. トップページへのリンクを表示

##### ユーザーへの通知
- "ページが見つかりませんでした" を表示

##### ログ出力
```
[WARN] R001: Page not found
  - URL: {requestedUrl}
  - Timestamp: {timestamp}
```

#### R002: 記事が見つからない

##### 発生条件
- 存在しない記事IDにアクセス
- 削除された記事にアクセス

##### エラーコード
- R002

##### 処理内容
1. カスタム404ページを表示
2. 記事一覧へのリンクを表示

##### ユーザーへの通知
- "記事が見つかりませんでした" を表示

##### ログ出力
```
[WARN] R002: Article not found
  - Article ID: {articleId}
  - URL: {requestedUrl}
  - Timestamp: {timestamp}
```

### APIエラー

#### A001: API接続エラー

##### 発生条件
- microCMS APIへの接続が失敗
- タイムアウト

##### エラーコード
- A001

##### 処理内容
1. エラーメッセージを表示
2. リトライ処理（必要に応じて）

##### ユーザーへの通知
- "データの取得に失敗しました。しばらくしてから再度お試しください。" を表示

##### ログ出力
```
[ERROR] A001: API connection error
  - Endpoint: {apiEndpoint}
  - Error: {errorMessage}
  - Timestamp: {timestamp}
```

### 検証エラー

#### V001: 無効な検索クエリ

##### 発生条件
- 検索クエリが空
- 検索クエリに不正な文字が含まれる

##### エラーコード
- V001

##### 処理内容
1. エラーメッセージを表示
2. 検索ボックスをクリア

##### ユーザーへの通知
- "検索キーワードを入力してください" または "不正な文字が含まれています" を表示

##### ログ出力
```
[WARN] V001: Invalid search query
  - Query: {searchQuery}
  - Timestamp: {timestamp}
```

## 6.3 ログ詳細設計

### ログレベル
- **ERROR**: エラー（ビルド失敗、API接続エラー等）
- **WARN**: 警告（404エラー、検証エラー等）
- **INFO**: 情報（ビルド開始、データ取得成功等）
- **DEBUG**: デバッグ（詳細な処理ログ）

### ログ出力項目
- **タイムスタンプ**: エラー発生時刻
- **ログレベル**: ERROR, WARN, INFO, DEBUG
- **エラーコード**: エラーコード
- **エラーメッセージ**: エラーメッセージ
- **コンテキスト情報**: URL、パラメータ、ユーザー情報等

### ログフォーマット
```
[LEVEL] CODE: Message
  - Context1: {value1}
  - Context2: {value2}
  - Timestamp: {timestamp}
```

### ログ保存期間
- **ビルドログ**: Vercelのビルドログで確認（保存期間はVercelの設定に依存）
- **実行時ログ**: Vercelのログ機能で確認（保存期間はVercelの設定に依存）
- **エラートラッキング**: 必要に応じてSentry等のサービスを導入（将来検討）

