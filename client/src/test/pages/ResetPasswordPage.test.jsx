import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ResetPasswordPage from '../../pages/ResetPasswordPage';
import * as authApi from '../../api/auth';
import { toast } from 'react-hot-toast';

vi.mock('../../api/auth', () => ({
    resetPassword: vi.fn(),
}));

vi.mock('react-hot-toast', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

describe('ResetPasswordPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('submits token from url params and new password', async () => {
        authApi.resetPassword.mockResolvedValue({ success: true });

        render(
            <MemoryRouter initialEntries={['/reset-password/sample_token_123']}>
                <Routes>
                    <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByRole('heading', { name: 'Reset password' })).toBeInTheDocument();
        const input = screen.getByPlaceholderText('••••••••');
        const submitBtn = screen.getByRole('button', { name: /reset password/i });

        fireEvent.change(input, { target: { value: 'brandNewPassword123' } });
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(authApi.resetPassword).toHaveBeenCalledWith('sample_token_123', 'brandNewPassword123');
            expect(toast.success).toHaveBeenCalledWith('Password reset successful');
        });
    });

    it('shows error toast on reset password failure', async () => {
        authApi.resetPassword.mockRejectedValue(new Error('Expired token'));

        render(
            <MemoryRouter initialEntries={['/reset-password/expired_token']}>
                <Routes>
                    <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                </Routes>
            </MemoryRouter>
        );

        const input = screen.getByPlaceholderText('••••••••');
        const submitBtn = screen.getByRole('button', { name: /reset password/i });

        fireEvent.change(input, { target: { value: 'anyPassword' } });
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Failed to reset password');
        });
    });
});
