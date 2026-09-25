import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NotFoundPage from '../../pages/NotFoundPage';
import * as AuthContextModule from '../../context/AuthContext';

describe('NotFoundPage', () => {
    it('renders 404 message and link to home/login', () => {
        const mockLogout = vi.fn();
        vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
            logout: mockLogout,
        });

        render(
            <MemoryRouter>
                <NotFoundPage />
            </MemoryRouter>
        );

        expect(screen.getByText('404 - Page Not Found')).toBeInTheDocument();
        const homeLink = screen.getByText('Go back home');
        expect(homeLink).toBeInTheDocument();

        fireEvent.click(homeLink);
        expect(mockLogout).toHaveBeenCalled();
    });
});

