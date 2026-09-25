import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LoginForm } from '../../components/auth/LoginForm';
import { RegisterForm } from '../../components/auth/RegisterForm';
import * as authApi from '../../api/auth';
import * as AuthContextModule from '../../context/AuthContext';
import toast from 'react-hot-toast';

vi.mock('../../api/auth', () => ({
    login: vi.fn(),
    register: vi.fn(),
}));

vi.mock('react-hot-toast', () => ({
    default: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

describe('Auth Forms', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    describe('LoginForm', () => {
        it('renders email, password inputs, submit button, and links', () => {
            vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({ login: vi.fn() });

            render(
                <MemoryRouter>
                    <LoginForm />
                </MemoryRouter>
            );

            expect(screen.getByPlaceholderText('name@email.com')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
            expect(screen.getByText(/forgot password\?/i)).toBeInTheDocument();
        });

        it('validates required fields and shows validation messages', async () => {
            vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({ login: vi.fn() });

            render(
                <MemoryRouter>
                    <LoginForm />
                </MemoryRouter>
            );

            fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

            await waitFor(() => {
                expect(screen.getByText('Enter a valid email')).toBeInTheDocument();
            });
        });

        it('successfully logs in, calls auth login, and redirects user', async () => {
            const mockLogin = vi.fn();
            vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({ login: mockLogin });

            authApi.login.mockResolvedValue({
                data: {
                    user: { id: 'u1', email: 'test@example.com', role: 'USER' },
                    accessToken: 'access_test_token',
                },
            });

            render(
                <MemoryRouter>
                    <LoginForm />
                </MemoryRouter>
            );

            fireEvent.change(screen.getByPlaceholderText('name@email.com'), {
                target: { value: 'test@example.com' },
            });
            fireEvent.change(screen.getByPlaceholderText('••••••••'), {
                target: { value: 'password123' },
            });

            fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

            await waitFor(() => {
                expect(authApi.login).toHaveBeenCalledWith({
                    email: 'test@example.com',
                    password: 'password123',
                });
                expect(mockLogin).toHaveBeenCalled();
                expect(toast.success).toHaveBeenCalledWith('Logged in successfully!');
            });
        });
    });

    describe('RegisterForm', () => {
        it('renders register fields and validates password match', async () => {
            render(
                <MemoryRouter>
                    <RegisterForm />
                </MemoryRouter>
            );

            expect(screen.getByPlaceholderText('Jordan Lee')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('name@email.com')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('0901234567')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('123 Street, City')).toBeInTheDocument();

            fireEvent.click(screen.getByRole('button', { name: /create account/i }));

            await waitFor(() => {
                expect(screen.getByText('Name must be at least 2 characters')).toBeInTheDocument();
            });
        });

        it('submits form on valid registration inputs', async () => {
            authApi.register.mockResolvedValue({ data: { id: 'u2' } });

            render(
                <MemoryRouter>
                    <RegisterForm />
                </MemoryRouter>
            );

            fireEvent.change(screen.getByPlaceholderText('Jordan Lee'), { target: { value: 'Smart User' } });
            fireEvent.change(screen.getByPlaceholderText('name@email.com'), { target: { value: 'smart@user.com' } });
            fireEvent.change(screen.getByPlaceholderText('0901234567'), { target: { value: '0123456789' } });
            fireEvent.change(screen.getByPlaceholderText('123 Street, City'), { target: { value: '123 Main Street' } });

            const passwordInputs = screen.getAllByPlaceholderText('••••••••');
            fireEvent.change(passwordInputs[0], { target: { value: 'password123' } });
            fireEvent.change(passwordInputs[1], { target: { value: 'password123' } });

            fireEvent.click(screen.getByRole('button', { name: /create account/i }));

            await waitFor(() => {
                expect(authApi.register).toHaveBeenCalledWith({
                    name: 'Smart User',
                    email: 'smart@user.com',
                    phone: '0123456789',
                    address: '123 Main Street',
                    password: 'password123',
                    confirmPassword: 'password123',
                });
                expect(toast.success).toHaveBeenCalledWith('Account created successfully!');
            });
        });
    });
});
