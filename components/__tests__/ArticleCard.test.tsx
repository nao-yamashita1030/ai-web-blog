import { render, screen } from '@testing-library/react';
import ArticleCard from '../ArticleCard';
import type { Blog } from '@/types/blog';

// Next.jsのImageコンポーネントをモック
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Next.jsのLinkコンポーネントをモック
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  },
}));

describe('ArticleCard', () => {
  const mockBlog: Blog = {
    id: 'test-id',
    title: 'Test Article Title',
    content: 'Test content',
    publishedAt: '2024-01-01T00:00:00.000Z',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  };

  it('記事のタイトルが表示される', () => {
    render(<ArticleCard blog={mockBlog} />);
    expect(screen.getByText('Test Article Title')).toBeInTheDocument();
  });

  it('公開日が表示される', () => {
    render(<ArticleCard blog={mockBlog} />);
    expect(screen.getByText('2024年1月1日')).toBeInTheDocument();
  });

  it('カテゴリが表示される（存在する場合）', () => {
    const blogWithCategory: Blog = {
      ...mockBlog,
      category: {
        id: 'cat-1',
        name: 'Technology',
        slug: 'technology',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      },
    };
    render(<ArticleCard blog={blogWithCategory} />);
    expect(screen.getByText('Technology')).toBeInTheDocument();
  });

  it('タグが表示される（存在する場合）', () => {
    const blogWithTags: Blog = {
      ...mockBlog,
      tags: [
        {
          id: 'tag-1',
          name: 'React',
          slug: 'react',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: 'tag-2',
          name: 'Next.js',
          slug: 'nextjs',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ],
    };
    render(<ArticleCard blog={blogWithTags} />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Next.js')).toBeInTheDocument();
  });

  it('アイキャッチ画像が表示される（存在する場合）', () => {
    const blogWithEyecatch: Blog = {
      ...mockBlog,
      eyecatch: {
        url: 'https://example.com/image.jpg',
        width: 800,
        height: 600,
      },
    };
    render(<ArticleCard blog={blogWithEyecatch} />);
    const image = screen.getByAltText('Test Article Title');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('リンクが正しく設定されている', () => {
    render(<ArticleCard blog={mockBlog} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/posts/test-id');
  });

  it('公開日が存在しない場合、公開日が表示されない', () => {
    const blogWithoutDate: Blog = {
      ...mockBlog,
      publishedAt: undefined,
    };
    render(<ArticleCard blog={blogWithoutDate} />);
    expect(screen.queryByText('2024年1月1日')).not.toBeInTheDocument();
  });
});



