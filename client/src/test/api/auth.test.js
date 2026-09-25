import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockGet, mockPost } = vi.hoisted(() => ({
    mockGet: vi.fn(),
    mockPost: vi.fn(),
}));

vi.mock('axios', () => ({
    default: {
        create: vi.fn(() => ({
            get: mockGet,
            post: mockPost,
            interceptors: {
                request: { use: vi.fn() },
                response: { use: vi.fn() },
            },
        })),
    },
}));

import {
    login,
    register,
    getMe,
    logout,
    refresh,
    forgotPassword,
    resetPassword,
} from '../../api/auth.js';

describe('client api/auth.js', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('login sends credentials and returns data', async () => {
        mockPost.mockResolvedValue({ data: { accessToken: 'token_1' } });
        const res = await login({ email: 'a@b.com', password: 'pw' });
        expect(mockPost).toHaveBeenCalledWith('/auth/login', { email: 'a@b.com', password: 'pw' });
        expect(res).toEqual({ accessToken: 'token_1' });
    });

    it('register sends user data and returns data', async () => {
        mockPost.mockResolvedValue({ data: { id: 'u1' } });
        const res = await register({ name: 'User' });
        expect(mockPost).toHaveBeenCalledWith('/auth/register', { name: 'User' });
        expect(res).toEqual({ id: 'u1' });
    });

    it('getMe requests /auth/me and returns data', async () => {
        mockGet.mockResolvedValue({ data: { user: { name: 'User' } } });
        const res = await getMe();
        expect(mockGet).toHaveBeenCalledWith('/auth/me');
        expect(res).toEqual({ user: { name: 'User' } });
    });

    it('logout posts to /auth/logout', async () => {
        mockPost.mockResolvedValue({ data: { success: true } });
        const res = await logout();
        expect(mockPost).toHaveBeenCalledWith('/auth/logout');
        expect(res.success).toBe(true);
    });

    it('refresh posts to /auth/refresh', async () => {
        mockPost.mockResolvedValue({ data: { accessToken: 'new_token' } });
        const res = await refresh();
        expect(mockPost).toHaveBeenCalledWith('/auth/refresh');
        expect(res.accessToken).toBe('new_token');
    });

    it('forgotPassword posts email to /auth/forgot-password', async () => {
        mockPost.mockResolvedValue({ data: { success: true } });
        await forgotPassword('user@email.com');
        expect(mockPost).toHaveBeenCalledWith('/auth/forgot-password', { email: 'user@email.com' });
    });

    it('resetPassword posts token and password to /auth/reset-password', async () => {
        mockPost.mockResolvedValue({ data: { success: true } });
        await resetPassword('tok123', 'newpw');
        expect(mockPost).toHaveBeenCalledWith('/auth/reset-password', { token: 'tok123', password: 'newpw' });
    });
});

