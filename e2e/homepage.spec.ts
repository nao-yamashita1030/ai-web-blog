import { test, expect } from '@playwright/test';

test.describe('ホームページ', () => {
  test('ページが正しく表示される', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/個人ブログサイト/);
  });

  test('記事一覧が表示される', async ({ page }) => {
    await page.goto('/');
    // ページが読み込まれるまで待機
    await page.waitForLoadState('networkidle');
    // 記事カードまたは「記事がありません」メッセージが表示されることを確認
    const hasArticles = await page.locator('article').count() > 0;
    const hasNoArticlesMessage = await page.locator('text=記事がありません').count() > 0;
    expect(hasArticles || hasNoArticlesMessage).toBe(true);
  });

  test('記事詳細ページに遷移できる', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // 記事が存在する場合のみテストを実行
    const articleCount = await page.locator('article').count();
    if (articleCount > 0) {
      const firstArticle = page.locator('article').first();
      const articleLink = firstArticle.locator('a').first();
      await articleLink.click();
      
      // 記事詳細ページに遷移したことを確認
      await expect(page).toHaveURL(/\/posts\//);
    } else {
      // 記事がない場合はスキップ
      test.skip();
    }
  });
});

