import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CartPage from '../../pages/User/CartPage';
import CheckoutPage from '../../pages/User/CheckoutPage';

describe('User Shopping Pages', () => {
    describe('CartPage', () => {
        it('renders cart title, empty state, and summary', () => {
            render(<CartPage />);

            expect(screen.getByText('Cart')).toBeInTheDocument();
            expect(screen.getByText('Cart is empty.')).toBeInTheDocument();
            expect(screen.getByText('Summary')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Coupon code')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Checkout' })).toBeInTheDocument();
        });
    });

    describe('CheckoutPage', () => {
        it('renders checkout address, payment options, and place order button', () => {
            render(<CheckoutPage />);

            expect(screen.getByText('Checkout')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Shipping Address')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Place Order' })).toBeInTheDocument();
            expect(screen.getByText('Credit Card')).toBeInTheDocument();
        });
    });
});

