import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LandingPage from '../../pages/LandingPage';
import * as AuthContextModule from '../../context/AuthContext';

describe('LandingPage', () => {
    it('renders hero title, categories, and products', () => {
        vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
            user: null,
            logout: vi.fn(),
        });

        render(
            <MemoryRouter>
                <LandingPage />
            </MemoryRouter>
        );

        expect(screen.getByText('Smart Commerce')).toBeInTheDocument();
        expect(screen.getAllByText('Lighting').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Apparel').length).toBeGreaterThan(0);
        expect(screen.getByText('Ash Table Lamp')).toBeInTheDocument();
    });
});
