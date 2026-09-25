import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import * as AuthContextModule from '../../context/AuthContext';

describe('ProtectedRoute component', () => {
    it('should show loading when auth is loading', () => {
        vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
            user: null,
            loading: true,
        });

        render(
            <MemoryRouter>
                <ProtectedRoute>
                    <div>Secret Content</div>
                </ProtectedRoute>
            </MemoryRouter>
        );

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should redirect to /login when user is not authenticated', () => {
        vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
            user: null,
            loading: false,
        });

        render(
            <MemoryRouter initialEntries={['/secret']}>
                <Routes>
                    <Route
                        path="/secret"
                        element={
                            <ProtectedRoute>
                                <div>Secret Content</div>
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/login" element={<div>Login Page</div>} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText('Login Page')).toBeInTheDocument();
    });

    it('should redirect to /404 when user does not have required role', () => {
        vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
            user: { role: 'USER' },
            loading: false,
        });

        render(
            <MemoryRouter initialEntries={['/admin']}>
                <Routes>
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute allowedRoles={['ADMIN']}>
                                <div>Admin Panel</div>
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/404" element={<div>Not Found Page</div>} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText('Not Found Page')).toBeInTheDocument();
    });

    it('should render children when user is authorized', () => {
        vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
            user: { role: 'ADMIN' },
            loading: false,
        });

        render(
            <MemoryRouter initialEntries={['/admin']}>
                <ProtectedRoute allowedRoles={['ADMIN']}>
                    <div>Admin Panel Content</div>
                </ProtectedRoute>
            </MemoryRouter>
        );

        expect(screen.getByText('Admin Panel Content')).toBeInTheDocument();
    });
});

