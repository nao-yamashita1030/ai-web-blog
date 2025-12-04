import { searchBlogs, filterByCategory, filterByTag } from '../search';
import type { Blog } from '@/types/blog';

describe('search', () => {
  const mockBlogs: Blog[] = [
    {
      id: '1',
      title: 'React入門',
      content: 'Reactの基本的な使い方を学びます',
      category: {
        id: 'cat-1',
        name: 'Technology',
        slug: 'technology',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
      tags: [
        {
          id: 'tag-1',
          name: 'React',
          slug: 'react',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ],
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: '2',
      title: 'Next.jsの使い方',
      content: 'Next.jsでブログを作成します',
      category: {
        id: 'cat-1',
        name: 'Technology',
        slug: 'technology',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
      tags: [
        {
          id: 'tag-2',
          name: 'Next.js',
          slug: 'nextjs',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ],
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
    {
      id: '3',
      title: 'デザインの基礎',
      content: 'デザインの基本的な考え方を学びます',
      category: {
        id: 'cat-2',
        name: 'Design',
        slug: 'design',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
  ];

  describe('searchBlogs', () => {
    it('タイトルで検索できる', () => {
      const result = searchBlogs(mockBlogs, 'React');
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('React入門');
    });

    it('コンテンツで検索できる', () => {
      const result = searchBlogs(mockBlogs, '基本的');
      expect(result).toHaveLength(2);
    });

    it('カテゴリで検索できる', () => {
      const result = searchBlogs(mockBlogs, 'Technology');
      expect(result).toHaveLength(2);
    });

    it('タグで検索できる', () => {
      const result = searchBlogs(mockBlogs, 'Next.js');
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Next.jsの使い方');
    });

    it('大文字小文字を区別しない', () => {
      const result = searchBlogs(mockBlogs, 'react');
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('React入門');
    });

    it('空のクエリの場合、空の配列を返す', () => {
      const result = searchBlogs(mockBlogs, '');
      expect(result).toEqual([]);
    });

    it('空白のみのクエリの場合、空の配列を返す', () => {
      const result = searchBlogs(mockBlogs, '   ');
      expect(result).toEqual([]);
    });

    it('一致する記事がない場合、空の配列を返す', () => {
      const result = searchBlogs(mockBlogs, '存在しないキーワード');
      expect(result).toEqual([]);
    });
  });

  describe('filterByCategory', () => {
    it('カテゴリスラッグでフィルタリングできる', () => {
      const result = filterByCategory(mockBlogs, 'technology');
      expect(result).toHaveLength(2);
      expect(result.every((blog) => blog.category?.slug === 'technology')).toBe(true);
    });

    it('一致するカテゴリがない場合、空の配列を返す', () => {
      const result = filterByCategory(mockBlogs, 'nonexistent');
      expect(result).toEqual([]);
    });

    it('カテゴリが存在しない記事は除外される', () => {
      const blogsWithoutCategory: Blog[] = [
        {
          id: '4',
          title: 'カテゴリなし',
          content: 'テスト',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ];
      const result = filterByCategory(blogsWithoutCategory, 'technology');
      expect(result).toEqual([]);
    });
  });

  describe('filterByTag', () => {
    it('タグスラッグでフィルタリングできる', () => {
      const result = filterByTag(mockBlogs, 'react');
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('React入門');
    });

    it('一致するタグがない場合、空の配列を返す', () => {
      const result = filterByTag(mockBlogs, 'nonexistent');
      expect(result).toEqual([]);
    });

    it('タグが存在しない記事は除外される', () => {
      const blogsWithoutTags: Blog[] = [
        {
          id: '4',
          title: 'タグなし',
          content: 'テスト',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ];
      const result = filterByTag(blogsWithoutTags, 'react');
      expect(result).toEqual([]);
    });
  });
});

