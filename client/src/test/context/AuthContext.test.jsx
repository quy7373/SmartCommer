import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../context/AuthContext';

vi.mock('../../api/auth', () => ({
    getMe: vi.fn(),
    logout: vi.fn(),
}));

import * as authApi from '../../api/auth';

const TestConsumer = () => {
    const { user, login, logout, loading } = useAuth();
    return (
        <div>
            <div data-testid="loading">{loading ? 'loading' : 'not-loading'}</div>
            <div data-testid="user">{user ? user.name : 'no-user'}</div>
            <button onClick={() => login({ name: 'Alice' }, 'test_token')}>Login Alice</button>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

describe('AuthContext', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('should initialize with no user if localStorage is empty', () => {
        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        expect(screen.getByTestId('loading').textContent).toBe('not-loading');
        expect(screen.getByTestId('user').textContent).toBe('no-user');
    });

    it('should update user state and localStorage on login', () => {
        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        act(() => {
            screen.getByText('Login Alice').click();
        });

        expect(screen.getByTestId('user').textContent).toBe('Alice');
        expect(localStorage.getItem('user')).toContain('Alice');
        expect(localStorage.getItem('accessToken')).toBe('test_token');
    });

    it('should clear user state and localStorage on logout', async () => {
        authApi.logout.mockResolvedValue({});
        localStorage.setItem('user', JSON.stringify({ name: 'Alice' }));
        localStorage.setItem('accessToken', 'test_token');

        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        await act(async () => {
            screen.getByText('Logout').click();
        });

        expect(screen.getByTestId('user').textContent).toBe('no-user');
        expect(localStorage.getItem('user')).toBeNull();
        expect(localStorage.getItem('accessToken')).toBeNull();
    });

    it('should fetch user from API if localStorage has user', async () => {
        localStorage.setItem('user', JSON.stringify({ name: 'Bob' }));
        authApi.getMe.mockResolvedValue({
            data: { user: { name: 'Bob Refreshed' } },
        });

        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        await act(async () => { });

        expect(screen.getByTestId('user').textContent).toBe('Bob Refreshed');
    });

    it('should clear user if getMe fails', async () => {
        localStorage.setItem('user', JSON.stringify({ name: 'Bob' }));
        authApi.getMe.mockRejectedValue(new Error('Unauthorized'));

        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        await act(async () => { });

        expect(screen.getByTestId('user').textContent).toBe('no-user');
        expect(localStorage.getItem('user')).toBeNull();
    });
});

