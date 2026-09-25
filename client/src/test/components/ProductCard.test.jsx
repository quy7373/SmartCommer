import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProductCard } from '../../components/common/ProductCard';

describe('ProductCard component', () => {
    const mockProduct = {
        name: 'Wireless Ergonomic Keyboard',
        thumbnail: 'https://example.com/keyboard.jpg',
    };

    it('renders product details with price and rating', () => {
        render(
            <ProductCard
                product={mockProduct}
                price="89.99"
                rating="4.8"
                sold="120"
                discount="15"
            />
        );

        expect(screen.getByText('Wireless Ergonomic Keyboard')).toBeInTheDocument();
        expect(screen.getByText('$89.99')).toBeInTheDocument();
        expect(screen.getByText('4.8')).toBeInTheDocument();
        expect(screen.getByText('120 sold')).toBeInTheDocument();
        expect(screen.getByText('-15%')).toBeInTheDocument();
        expect(screen.getByRole('img')).toHaveAttribute('src', 'https://example.com/keyboard.jpg');
    });

    it('renders without discount tag when discount is omitted', () => {
        render(
            <ProductCard
                product={mockProduct}
                price="99.00"
                rating="5.0"
                sold="45"
            />
        );

        expect(screen.getByText('Wireless Ergonomic Keyboard')).toBeInTheDocument();
        expect(screen.getByText('$99.00')).toBeInTheDocument();
        expect(screen.queryByText(/-\d+%/)).not.toBeInTheDocument();
    });
});

