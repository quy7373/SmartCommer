import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Footer from '../../components/layout/Footer';

describe('Footer component', () => {
    it('renders brand name and contact details', () => {
        render(
            <MemoryRouter>
                <Footer />
            </MemoryRouter>
        );

        expect(screen.getByText('Smart Commerce')).toBeInTheDocument();
        expect(screen.getByText(/hello@smartcommerce.com/i)).toBeInTheDocument();
        expect(screen.getByText(/123 Commerce St/i)).toBeInTheDocument();
    });

    it('renders navigation columns and copyright notice', () => {
        render(
            <MemoryRouter>
                <Footer />
            </MemoryRouter>
        );

        expect(screen.getByText('Company')).toBeInTheDocument();
        expect(screen.getByText('Policy')).toBeInTheDocument();
        expect(screen.getByText('Support')).toBeInTheDocument();
        expect(screen.getByText('Social')).toBeInTheDocument();
        expect(screen.getByText(/All rights reserved/i)).toBeInTheDocument();
    });
});
