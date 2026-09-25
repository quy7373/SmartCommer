import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AdminDashboard from '../../pages/Admin/AdminDashboard';
import AdminUsers from '../../pages/Admin/AdminUsers';
import AdminProducts from '../../pages/Admin/AdminProducts';
import AdminCategories from '../../pages/Admin/AdminCategories';
import AdminCoupons from '../../pages/Admin/AdminCoupons';
import AdminAnalytics from '../../pages/Admin/AdminAnalytics';

import OwnerDashboard from '../../pages/Owner/OwnerDashboard';
import OwnerOrders from '../../pages/Owner/OwnerOrders';
import OwnerProducts from '../../pages/Owner/OwnerProducts';
import OwnerCategories from '../../pages/Owner/OwnerCategories';
import OwnerCustomers from '../../pages/Owner/OwnerCustomers';
import OwnerAnalytics from '../../pages/Owner/OwnerAnalytics';

describe('Admin and Owner Management Pages', () => {
    describe('Admin Pages', () => {
        it('renders AdminDashboard', () => {
            render(<AdminDashboard />);
            expect(screen.getByRole('heading', { name: 'Admin Dashboard' })).toBeInTheDocument();
        });

        it('renders AdminUsers', () => {
            render(<AdminUsers />);
            expect(screen.getByRole('heading', { name: 'Users' })).toBeInTheDocument();
        });

        it('renders AdminProducts', () => {
            render(<AdminProducts />);
            expect(screen.getByRole('heading', { name: 'Products' })).toBeInTheDocument();
        });

        it('renders AdminCategories', () => {
            render(<AdminCategories />);
            expect(screen.getByRole('heading', { name: 'Categories' })).toBeInTheDocument();
        });

        it('renders AdminCoupons', () => {
            render(<AdminCoupons />);
            expect(screen.getByRole('heading', { name: 'Coupons' })).toBeInTheDocument();
        });

        it('renders AdminAnalytics', () => {
            render(<AdminAnalytics />);
            expect(screen.getByRole('heading', { name: 'Analytics' })).toBeInTheDocument();
        });
    });

    describe('Owner Pages', () => {
        it('renders OwnerDashboard', () => {
            render(<OwnerDashboard />);
            expect(screen.getByRole('heading', { name: 'Owner Dashboard' })).toBeInTheDocument();
        });

        it('renders OwnerOrders', () => {
            render(<OwnerOrders />);
            expect(screen.getByRole('heading', { name: 'Orders' })).toBeInTheDocument();
        });

        it('renders OwnerProducts', () => {
            render(<OwnerProducts />);
            expect(screen.getByRole('heading', { name: 'Products' })).toBeInTheDocument();
        });

        it('renders OwnerCategories', () => {
            render(<OwnerCategories />);
            expect(screen.getByRole('heading', { name: 'Categories' })).toBeInTheDocument();
        });

        it('renders OwnerCustomers', () => {
            render(<OwnerCustomers />);
            expect(screen.getByRole('heading', { name: 'Customers' })).toBeInTheDocument();
        });

        it('renders OwnerAnalytics', () => {
            render(<OwnerAnalytics />);
            expect(screen.getByRole('heading', { name: 'Analytics' })).toBeInTheDocument();
        });
    });
});

