import { test, expect } from '@playwright/test';

test.describe('ナビゲーション', () => {
  test('ヘッダーが表示される', async ({ page }) => {
    await page.goto('/');
    const header = page.locator('header');
    await expect(header).toBeVisible();
  });

  test('フッターが表示される', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });

  test('404ページが表示される（存在しないページ）', async ({ page }) => {
    await page.goto('/nonexistent-page');
    // 404ページのコンテンツを確認
    await expect(page.locator('text=404')).toBeVisible();
    await expect(page.locator('text=ページが見つかりませんでした')).toBeVisible();
  });
});

