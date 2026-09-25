import { test, expect } from '@playwright/test';

test.describe('Authentication Flows E2E', () => {
    test('Login page validation and links', async ({ page }) => {
        await page.goto('/login');

        // Check title and inputs
        await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
        const emailInput = page.getByPlaceholder('name@email.com');
        const passwordInput = page.getByPlaceholder('••••••••');
        const submitButton = page.getByRole('button', { name: /sign in/i });

        await expect(emailInput).toBeVisible();
        await expect(passwordInput).toBeVisible();

        // Submit empty form to trigger validation
        await submitButton.click();
        await expect(page.getByText('Enter a valid email')).toBeVisible();

        // Navigate to Forgot Password
        await page.getByRole('link', { name: /forgot password\?/i }).click();
        await expect(page).toHaveURL(/.*forgot-password/);
    });

    test('Register page form rendering and navigation back to login', async ({ page }) => {
        await page.goto('/register');

        await expect(page.getByRole('heading', { name: /create your account/i })).toBeVisible();
        await expect(page.getByPlaceholder('Jordan Lee')).toBeVisible();
        await expect(page.getByPlaceholder('0901234567')).toBeVisible();

        // Link back to login
        const loginLink = page.getByRole('link', { name: /sign in/i });
        await loginLink.click();
        await expect(page).toHaveURL(/.*login/);
    });

    test('Forgot password flow', async ({ page }) => {
        await page.goto('/forgot-password');

        await expect(page.getByRole('heading', { name: 'Forgot password' })).toBeVisible();
        const emailInput = page.getByPlaceholder('name@email.com');
        await emailInput.fill('user@example.com');

        const sendButton = page.getByRole('button', { name: /send reset link/i });
        await expect(sendButton).toBeVisible();
    });
});

