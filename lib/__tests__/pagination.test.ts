import { paginate, getPageNumbers } from '../pagination';

describe('pagination', () => {
  describe('paginate', () => {
    it('ページネーションが正しく動作する', () => {
      const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const result = paginate(items, 1, 5);
      expect(result.items).toEqual([1, 2, 3, 4, 5]);
      expect(result.totalPages).toBe(2);
    });

    it('2ページ目が正しく取得できる', () => {
      const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const result = paginate(items, 2, 5);
      expect(result.items).toEqual([6, 7, 8, 9, 10]);
      expect(result.totalPages).toBe(2);
    });

    it('最後のページが正しく取得できる', () => {
      const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
      const result = paginate(items, 3, 5);
      expect(result.items).toEqual([11]);
      expect(result.totalPages).toBe(3);
    });

    it('空の配列の場合、空の配列を返す', () => {
      const items: number[] = [];
      const result = paginate(items, 1, 5);
      expect(result.items).toEqual([]);
      expect(result.totalPages).toBe(0);
    });

    it('ページサイズがアイテム数より大きい場合、すべてのアイテムを返す', () => {
      const items = [1, 2, 3];
      const result = paginate(items, 1, 10);
      expect(result.items).toEqual([1, 2, 3]);
      expect(result.totalPages).toBe(1);
    });
  });

  describe('getPageNumbers', () => {
    it('総ページ数がmaxPages以下の場合、すべてのページ番号を返す', () => {
      const result = getPageNumbers(1, 5, 5);
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it('現在のページが3以下の場合、最初の4ページと最後のページを返す', () => {
      const result = getPageNumbers(2, 10, 5);
      expect(result).toEqual([1, 2, 3, 4, 10]);
    });

    it('現在のページが最後から2ページ以内の場合、最初のページと最後の4ページを返す', () => {
      const result = getPageNumbers(9, 10, 5);
      expect(result).toEqual([1, 7, 8, 9, 10]);
    });

    it('現在のページが中間の場合、最初のページ、現在の前後1ページ、最後のページを返す', () => {
      const result = getPageNumbers(5, 10, 5);
      expect(result).toEqual([1, 4, 5, 6, 10]);
    });

    it('デフォルトのmaxPagesが5の場合、正しく動作する', () => {
      const result = getPageNumbers(3, 10);
      expect(result).toEqual([1, 2, 3, 4, 10]);
    });
  });
});

