import { test, expect } from '@playwright/test';

test.describe('Landing Page E2E', () => {
    test('should display landing page hero, header, and categories', async ({ page }) => {
        await page.goto('/');

        // Verify branding and Header elements
        await expect(page.locator('header')).toBeVisible();
        await expect(page.getByText('Smart Commerce', { exact: true })).toBeVisible();

        // Verify category pills
        await expect(page.getByRole('button', { name: 'Lighting' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Apparel' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Kitchen' })).toBeVisible();

        // Verify featured products
        await expect(page.getByText('Ash Table Lamp')).toBeVisible();

        // Verify navigation link to login
        const loginLink = page.getByRole('link', { name: 'Login' });
        await expect(loginLink).toBeVisible();
        await loginLink.click();
        await expect(page).toHaveURL(/.*login/);
    });
});

