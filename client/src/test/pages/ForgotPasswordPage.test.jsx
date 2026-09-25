import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ForgotPasswordPage from '../../pages/ForgotPasswordPage';
import * as authApi from '../../api/auth';
import { toast } from 'react-hot-toast';

vi.mock('../../api/auth', () => ({
    forgotPassword: vi.fn(),
}));

vi.mock('react-hot-toast', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

describe('ForgotPasswordPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders form inputs and handles successful submission', async () => {
        authApi.forgotPassword.mockResolvedValue({ success: true });

        render(
            <MemoryRouter>
                <ForgotPasswordPage />
            </MemoryRouter>
        );

        expect(screen.getByText('Forgot password')).toBeInTheDocument();
        const input = screen.getByPlaceholderText('name@email.com');
        const submitBtn = screen.getByRole('button', { name: /send reset link/i });

        fireEvent.change(input, { target: { value: 'user@example.com' } });
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(authApi.forgotPassword).toHaveBeenCalledWith('user@example.com');
            expect(toast.success).toHaveBeenCalledWith('Password reset email sent');
        });
    });

    it('shows error toast when forgotPassword fails', async () => {
        authApi.forgotPassword.mockRejectedValue(new Error('Network error'));

        render(
            <MemoryRouter>
                <ForgotPasswordPage />
            </MemoryRouter>
        );

        const input = screen.getByPlaceholderText('name@email.com');
        const submitBtn = screen.getByRole('button', { name: /send reset link/i });

        fireEvent.change(input, { target: { value: 'fail@example.com' } });
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Failed to send email');
        });
    });
});

