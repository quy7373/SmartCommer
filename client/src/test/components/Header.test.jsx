import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '../../components/layout/Header';
import * as AuthContextModule from '../../context/AuthContext';

describe('Header component', () => {
    it('renders logo and login button when user is not logged in', () => {
        vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
            user: null,
            logout: vi.fn(),
        });

        render(<Header />);

        expect(screen.getByText('Logo')).toBeInTheDocument();
        expect(screen.getByText('Login')).toBeInTheDocument();
        expect(screen.getByText('Benchmark')).toBeInTheDocument();
    });

    it('renders user initials and opens dropdown with profile and logout options', () => {
        const mockLogout = vi.fn();
        vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
            user: { name: 'John Doe', email: 'john@example.com' },
            logout: mockLogout,
        });

        render(<Header />);

        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('J')).toBeInTheDocument();

        // Dropdown is initially closed
        expect(screen.queryByText('Logout')).not.toBeInTheDocument();

        // Click user avatar area to toggle dropdown
        fireEvent.click(screen.getByText('John Doe'));

        // Profile and Logout should now be visible
        expect(screen.getByText('Profile')).toBeInTheDocument();
        const logoutBtn = screen.getByText('Logout');
        expect(logoutBtn).toBeInTheDocument();

        // Click logout
        fireEvent.click(logoutBtn);
        expect(mockLogout).toHaveBeenCalled();
    });
});

