import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { ProductDetailPage } from '../../pages/User/ProductDetailPage';
import AuthCallback from '../../pages/AuthCallback';
import * as AuthContextModule from '../../context/AuthContext';

vi.mock('axios', () => {
    const mockAxios = {
        get: vi.fn(),
        post: vi.fn(),
        defaults: {
            headers: {
                common: {},
            },
        },
        create: vi.fn(() => ({
            get: vi.fn(),
            post: vi.fn(),
            interceptors: {
                request: { use: vi.fn() },
                response: { use: vi.fn() },
            },
        })),
    };
    return {
        default: mockAxios,
        ...mockAxios,
    };
});

describe('ProductDetailPage and AuthCallback', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
            user: { name: 'User 1' },
            login: vi.fn(),
        });
    });

    describe('ProductDetailPage', () => {
        it('fetches and displays product details and variant options', async () => {
            global.fetch = vi.fn().mockResolvedValue({
                json: vi.fn().mockResolvedValue({
                    id: 'prod123',
                    name: 'Leather Weekend Bag',
                    price: 250,
                    description: 'Handmade Italian leather travel bag.',
                }),
            });

            render(
                <MemoryRouter initialEntries={['/products/prod123']}>
                    <Routes>
                        <Route path="/products/:id" element={<ProductDetailPage />} />
                    </Routes>
                </MemoryRouter>
            );

            expect(screen.getByText('Loading...')).toBeInTheDocument();

            await waitFor(() => {
                expect(screen.getByRole('heading', { name: 'Leather Weekend Bag' })).toBeInTheDocument();
                expect(screen.getByText('Handmade Italian leather travel bag.')).toBeInTheDocument();
                expect(screen.getByText('S')).toBeInTheDocument();
                expect(screen.getByText('M')).toBeInTheDocument();
                expect(screen.getByText('L')).toBeInTheDocument();
                expect(screen.getByRole('button', { name: 'Add to Cart' })).toBeInTheDocument();
            });
        });
    });

    describe('AuthCallback', () => {
        it('redirects to /login if no token in search params', () => {
            render(
                <MemoryRouter initialEntries={['/auth/callback']}>
                    <Routes>
                        <Route path="/auth/callback" element={<AuthCallback />} />
                        <Route path="/login" element={<div>Redirected to Login</div>} />
                    </Routes>
                </MemoryRouter>
            );

            expect(screen.getByText('Redirected to Login')).toBeInTheDocument();
        });

        it('saves token, fetches user profile and redirects to home', async () => {
            const mockLogin = vi.fn();
            vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
                login: mockLogin,
            });

            axios.get.mockResolvedValue({
                data: {
                    data: {
                        user: { id: 'u1', name: 'OAuth User' },
                    },
                },
            });

            render(
                <MemoryRouter initialEntries={['/auth/callback?token=oauth_token_val']}>
                    <Routes>
                        <Route path="/auth/callback" element={<AuthCallback />} />
                        <Route path="/" element={<div>Home Page Destination</div>} />
                    </Routes>
                </MemoryRouter>
            );

            await waitFor(() => {
                expect(localStorage.getItem('accessToken')).toBe('oauth_token_val');
                expect(mockLogin).toHaveBeenCalledWith({ id: 'u1', name: 'OAuth User' });
                expect(screen.getByText('Home Page Destination')).toBeInTheDocument();
            });
        });
    });
});

