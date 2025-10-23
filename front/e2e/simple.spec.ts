import { test, expect } from '@playwright/test';

test.describe('Simple E2E Tests', () => {
  test('should load homepage and display basic content', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check if page has a title
    const title = await page.title();
    expect(title).toBeTruthy();
    
    // Check if basic content is visible
    await expect(page.getByText('Bem-vindo ao')).toBeVisible();
    await expect(page.getByText('SuperStats!')).toBeVisible();
  });

  test('should have working navigation links', async ({ page }) => {
    await page.goto('/');
    
    // Check if navigation links exist and are clickable
    const exploreLink = page.getByRole('link', { name: 'Explorar Agora' });
    const compareLink = page.getByRole('link', { name: 'Comparar Stats' });
    
    await expect(exploreLink).toBeVisible();
    await expect(compareLink).toBeVisible();
    
    // Test navigation (without checking specific URLs)
    await exploreLink.click();
    await page.waitForLoadState('networkidle');
    
    // Go back to homepage
    await page.goto('/');
    await compareLink.click();
    await page.waitForLoadState('networkidle');
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check if content is still accessible
    await expect(page.getByText('Bem-vindo ao')).toBeVisible();
    await expect(page.getByText('SuperStats!')).toBeVisible();
  });

  test('should handle basic user interactions', async ({ page }) => {
    await page.goto('/');
    
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    
    // Check if focus is working
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });
});
