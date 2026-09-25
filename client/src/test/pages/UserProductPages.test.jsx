import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HomePage } from '../../pages/User/HomePage';
import { ProductListPage } from '../../pages/User/ProductListPage';
import { ProfilePage } from '../../pages/User/ProfilePage';
import { SearchPage } from '../../pages/User/SearchPage';
import LoginPage from '../../pages/LoginPage';
import RegisterPage from '../../pages/RegisterPage';

import * as categoriesApi from '../../api/categories';
import * as productApi from '../../api/product';
import * as AuthContextModule from '../../context/AuthContext';

vi.mock('../../api/categories', () => ({
    getCategories: vi.fn(),
}));

vi.mock('../../api/product', () => ({
    getFlashSales: vi.fn(),
    getBestSellerProducts: vi.fn(),
    getNewestProducts: vi.fn(),
    getRecommendedProducts: vi.fn(),
    getProducts: vi.fn(),
}));

describe('User Experience Pages', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
            user: { name: 'User 1', email: 'user@test.com' },
            logout: vi.fn(),
        });
    });

    describe('LoginPage & RegisterPage wrapper', () => {
        it('renders LoginPage wrapper', () => {
            render(
                <MemoryRouter>
                    <LoginPage />
                </MemoryRouter>
            );
            expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
        });

        it('renders RegisterPage wrapper', () => {
            render(
                <MemoryRouter>
                    <RegisterPage />
                </MemoryRouter>
            );
            expect(screen.getByRole('heading', { name: /create your account/i })).toBeInTheDocument();
        });
    });

    describe('HomePage', () => {
        it('fetches categories and featured products on mount', async () => {
            categoriesApi.getCategories.mockResolvedValue([
                { id: 'cat1', name: 'Electronics', icon: 'Tv' },
            ]);
            productApi.getFlashSales.mockResolvedValue({ data: [] });
            productApi.getBestSellerProducts.mockResolvedValue({ data: { data: [] } });
            productApi.getNewestProducts.mockResolvedValue({ data: { data: [] } });
            productApi.getRecommendedProducts.mockResolvedValue({ data: { data: [] } });

            render(
                <MemoryRouter>
                    <HomePage />
                </MemoryRouter>
            );

            expect(screen.getByText('Hero Banner')).toBeInTheDocument();

            await waitFor(() => {
                expect(screen.getByText('Electronics')).toBeInTheDocument();
            });
        });
    });

    describe('ProductListPage', () => {
        it('renders categories pills and products list', async () => {
            categoriesApi.getCategories.mockResolvedValue([
                { id: 'cat1', name: 'Mugs' },
            ]);
            productApi.getProducts.mockResolvedValue({
                data: {
                    data: [{ id: 'p1', name: 'Ceramic Mug', price: 15, category: { name: 'Mugs' } }],
                },
            });

            render(
                <MemoryRouter initialEntries={['/products?categoryId=cat1']}>
                    <ProductListPage />
                </MemoryRouter>
            );

            await waitFor(() => {
                expect(screen.getByRole('button', { name: 'Mugs' })).toBeInTheDocument();
                expect(screen.getByText('Ceramic Mug')).toBeInTheDocument();
                expect(screen.getByText('$15')).toBeInTheDocument();
            });
        });
    });

    describe('ProfilePage', () => {
        it('renders profile page with user profile sidebar', () => {
            render(
                <MemoryRouter>
                    <ProfilePage />
                </MemoryRouter>
            );

            expect(screen.getByRole('heading', { name: 'My Profile' })).toBeInTheDocument();
            expect(screen.getByText('Account')).toBeInTheDocument();
        });
    });

    describe('SearchPage', () => {
        it('renders search input and filters products by query', async () => {
            global.fetch = vi.fn().mockResolvedValue({
                json: vi.fn().mockResolvedValue([
                    { _id: '1', name: 'Wooden Desk', price: 199, category: { name: 'Office' } },
                    { _id: '2', name: 'Desk Lamp', price: 49, category: { name: 'Lighting' } },
                ]),
            });

            render(
                <MemoryRouter>
                    <SearchPage />
                </MemoryRouter>
            );

            const input = screen.getByPlaceholderText('Search products...');
            expect(input).toBeInTheDocument();

            await waitFor(() => {
                expect(screen.getByText('Wooden Desk')).toBeInTheDocument();
                expect(screen.getByText('Desk Lamp')).toBeInTheDocument();
            });

            // Filter for 'Desk Lamp'
            fireEvent.change(input, { target: { value: 'Lamp' } });

            expect(screen.queryByText('Wooden Desk')).not.toBeInTheDocument();
            expect(screen.getByText('Desk Lamp')).toBeInTheDocument();
        });
    });
});
