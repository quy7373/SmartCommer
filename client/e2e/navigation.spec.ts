import { test, expect } from '@playwright/test';

test.describe('Navigation and Protected Route Guards E2E', () => {
    test('Unauthenticated user is redirected to /login when accessing protected routes', async ({ page }) => {
        // Access protected cart route
        await page.goto('/cart');
        await expect(page).toHaveURL(/.*login/);

        // Access protected profile route
        await page.goto('/profile');
        await expect(page).toHaveURL(/.*login/);

        // Access protected checkout route
        await page.goto('/checkout');
        await expect(page).toHaveURL(/.*login/);
    });

    test('Non-existent route redirects to 404 page', async ({ page }) => {
        await page.goto('/this-route-does-not-exist');
        await expect(page.getByText('404 - Page Not Found')).toBeVisible();

        const goHome = page.getByRole('link', { name: 'Go back home' });
        await expect(goHome).toBeVisible();
    });

    test('Benchmark suite page is accessible publicly', async ({ page }) => {
        await page.goto('/benchmark');
        await expect(page.getByText(/Benchmark/i).first()).toBeVisible();
    });
});

