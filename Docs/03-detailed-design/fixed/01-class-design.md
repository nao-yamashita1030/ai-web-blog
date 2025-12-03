# クラス設計

## 1.1 クラス図（コンポーネント構成）

```
┌─────────────────────────────────────┐
│  ページコンポーネント                │
│  - app/page.tsx (トップページ)       │
│  - app/posts/[id]/page.tsx           │
│  - app/category/[slug]/page.tsx      │
│  - app/tag/[slug]/page.tsx           │
│  - app/search/page.tsx               │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  レイアウトコンポーネント            │
│  - app/layout.tsx                    │
│  - components/Header.tsx            │
│  - components/Footer.tsx             │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  UIコンポーネント                    │
│  - components/ArticleCard.tsx       │
│  - components/ArticleList.tsx        │
│  - components/Pagination.tsx         │
│  - components/SearchBox.tsx         │
│  - components/MarkdownContent.tsx    │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  ビジネスロジック層                  │
│  - lib/microcms.ts (APIクライアント) │
│  - lib/search.ts (検索ロジック)      │
│  - lib/pagination.ts (ページネーション)│
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  型定義                              │
│  - types/blog.ts                    │
│  - types/category.ts                │
│  - types/tag.ts                     │
└─────────────────────────────────────┘
```

## 1.2 主要クラス設計

### 型定義（types/blog.ts）

#### Blog
- **責務**: ブログ記事の型定義
- **属性**:
  - `id: string` - 記事ID
  - `title: string` - タイトル
  - `content: string` - 本文（マークダウン）
  - `category: Category` - カテゴリ
  - `tags: Tag[]` - タグ配列
  - `eyecatch?: Image` - アイキャッチ画像
  - `publishedAt: string` - 公開日時
  - `createdAt: string` - 作成日時
  - `updatedAt: string` - 更新日時
- **メソッド**: なし（型定義のみ）
- **関係性**: Category, Tag, Imageと関連

#### Category
- **責務**: カテゴリの型定義
- **属性**:
  - `id: string` - カテゴリID
  - `name: string` - カテゴリ名
  - `slug: string` - スラッグ
- **メソッド**: なし（型定義のみ）
- **関係性**: Blogと1対多の関係

#### Tag
- **責務**: タグの型定義
- **属性**:
  - `id: string` - タグID
  - `name: string` - タグ名
  - `slug: string` - スラッグ
- **メソッド**: なし（型定義のみ）
- **関係性**: Blogと多対多の関係

### APIクライアント（lib/microcms.ts）

#### MicroCMSClient
- **責務**: microCMS APIとの通信を担当
- **属性**:
  - `apiKey: string` - APIキー（環境変数から取得）
  - `serviceDomain: string` - サービスドメイン（環境変数から取得）
- **メソッド**:
  - `getAllBlogs(limit?: number, offset?: number): Promise<Blog[]>` - 全記事取得
  - `getBlogById(id: string): Promise<Blog>` - 記事詳細取得
  - `getBlogsByCategory(categorySlug: string): Promise<Blog[]>` - カテゴリ別記事取得
  - `getBlogsByTag(tagSlug: string): Promise<Blog[]>` - タグ別記事取得
  - `getAllCategories(): Promise<Category[]>` - 全カテゴリ取得
  - `getAllTags(): Promise<Tag[]>` - 全タグ取得
- **関係性**: microCMS SDKを使用

### 検索ロジック（lib/search.ts）

#### SearchService
- **責務**: クライアントサイドでの検索機能を提供
- **属性**: なし（静的メソッドのみ）
- **メソッド**:
  - `searchBlogs(blogs: Blog[], query: string): Blog[]` - 記事検索
  - `filterByCategory(blogs: Blog[], categorySlug: string): Blog[]` - カテゴリフィルタ
  - `filterByTag(blogs: Blog[], tagSlug: string): Blog[]` - タグフィルタ
- **関係性**: Blog型を使用

### ページネーション（lib/pagination.ts）

#### PaginationService
- **責務**: ページネーション機能を提供
- **属性**: なし（静的メソッドのみ）
- **メソッド**:
  - `paginate<T>(items: T[], page: number, perPage: number): { items: T[], totalPages: number }` - ページネーション処理
  - `getPageNumbers(currentPage: number, totalPages: number, maxPages: number): number[]` - ページ番号配列生成
- **関係性**: 汎用的な型を使用

### コンポーネント

#### ArticleCard
- **責務**: 記事カードの表示
- **属性（Props）**:
  - `blog: Blog` - 表示する記事データ
- **メソッド**: なし（Reactコンポーネント）
- **関係性**: Blog型を使用

#### ArticleList
- **責務**: 記事一覧の表示
- **属性（Props）**:
  - `blogs: Blog[]` - 記事配列
  - `showPagination?: boolean` - ページネーション表示フラグ
- **メソッド**: なし（Reactコンポーネント）
- **関係性**: ArticleCard, Paginationコンポーネントを使用

#### Pagination
- **責務**: ページネーションUIの表示
- **属性（Props）**:
  - `currentPage: number` - 現在のページ
  - `totalPages: number` - 総ページ数
  - `onPageChange: (page: number) => void` - ページ変更ハンドラ
- **メソッド**: なし（Reactコンポーネント）
- **関係性**: なし

#### SearchBox
- **責務**: 検索ボックスの表示と入力処理
- **属性（Props）**:
  - `onSearch: (query: string) => void` - 検索実行ハンドラ
  - `placeholder?: string` - プレースホルダー
- **メソッド**: なし（Reactコンポーネント）
- **関係性**: なし

#### MarkdownContent
- **責務**: マークダウンコンテンツの表示
- **属性（Props）**:
  - `content: string` - マークダウン文字列
- **メソッド**: なし（Reactコンポーネント）
- **関係性**: react-markdownライブラリを使用

## 1.3 クラス間の関係

### 依存関係
- ページコンポーネント → レイアウトコンポーネント
- ページコンポーネント → UIコンポーネント
- UIコンポーネント → 型定義
- ビジネスロジック層 → 型定義
- ビジネスロジック層 → microCMS SDK

### データフロー
1. ページコンポーネントがMicroCMSClientを使用してデータ取得
2. 取得したデータをUIコンポーネントに渡す
3. UIコンポーネントがデータを表示

## 1.4 デザインパターン

### Repository パターン
- **使用箇所**: MicroCMSClient
- **理由**: データアクセス層を抽象化し、将来の変更に備える
- **実装方法**: microCMS APIへのアクセスをMicroCMSClientクラスに集約

### Service パターン
- **使用箇所**: SearchService, PaginationService
- **理由**: ビジネスロジックを分離し、再利用性を高める
- **実装方法**: 静的メソッドとして実装し、状態を持たない

### Component パターン
- **使用箇所**: すべてのReactコンポーネント
- **理由**: UIを再利用可能な部品として分割
- **実装方法**: Reactの関数コンポーネントとして実装

### Custom Hooks パターン
- **使用箇所**: データ取得や状態管理が必要なコンポーネント
- **理由**: ロジックの再利用と関心の分離
- **実装方法**: `useBlogs`, `useSearch`などのカスタムフックを作成

