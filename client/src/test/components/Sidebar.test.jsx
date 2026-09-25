import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import UserProfileSidebar from '../../components/layout/UserProfileSidebar';
import * as categoriesApi from '../../api/categories';

vi.mock('../../api/categories', () => ({
    getCategories: vi.fn(),
}));

describe('Sidebar Components', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Sidebar', () => {
        it('fetches and renders categories and subcategories', async () => {
            categoriesApi.getCategories.mockResolvedValue([
                {
                    id: 'c1',
                    name: 'Fashion',
                    children: [{ id: 'sub1', name: 'Shirts' }],
                },
            ]);

            render(<Sidebar />);

            expect(screen.getByText(/Danh mục sản phẩm/i)).toBeInTheDocument();

            await waitFor(() => {
                expect(screen.getByText('Fashion')).toBeInTheDocument();
                expect(screen.getByText('Shirts')).toBeInTheDocument();
            });
        });
    });

    describe('UserProfileSidebar', () => {
        it('renders account navigation links', () => {
            render(
                <MemoryRouter initialEntries={['/user/profile']}>
                    <UserProfileSidebar />
                </MemoryRouter>
            );

            expect(screen.getByText('Account')).toBeInTheDocument();
            expect(screen.getByText('Profile')).toBeInTheDocument();
            expect(screen.getByText('Orders')).toBeInTheDocument();
            expect(screen.getByText('Wishlist')).toBeInTheDocument();
            expect(screen.getByText('Address')).toBeInTheDocument();
            expect(screen.getByText('Reviews')).toBeInTheDocument();
        });
    });
});

