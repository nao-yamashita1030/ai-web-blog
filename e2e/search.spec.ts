import { test, expect } from '@playwright/test';

test.describe('検索機能', () => {
  test('検索ボックスが表示される', async ({ page }) => {
    await page.goto('/');
    const searchBox = page.locator('input[placeholder*="記事を検索"]');
    await expect(searchBox).toBeVisible();
  });

  test('検索が実行できる', async ({ page }) => {
    await page.goto('/');
    const searchBox = page.locator('input[placeholder*="記事を検索"]');
    await searchBox.fill('テスト');
    await searchBox.press('Enter');
    
    // 検索結果ページに遷移したことを確認
    await expect(page).toHaveURL(/\/search/);
  });
});

