import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../../src/services/auth.service.js', () => ({
    register: vi.fn(),
    login: vi.fn(),
    logout: vi.fn(),
    getUserById: vi.fn(),
    refresh: vi.fn(),
    forgotPassword: vi.fn(),
    resetPassword: vi.fn(),
}));

vi.mock('../../../src/lib/redis.js', () => ({
    redis: {
        set: vi.fn(),
    },
}));

import * as authService from '../../../src/services/auth.service.js';
import * as authController from '../../../src/controllers/auth.controller.js';

describe('auth.controller', () => {
    let req, res, next;

    beforeEach(() => {
        vi.clearAllMocks();
        req = {
            body: {},
            cookies: {},
            headers: {},
            user: { id: 'u1', role: 'USER' },
        };
        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis(),
            cookie: vi.fn().mockReturnThis(),
            clearCookie: vi.fn().mockReturnThis(),
            redirect: vi.fn().mockReturnThis(),
        };
        next = vi.fn();
    });

    describe('register', () => {
        it('should return 400 if required fields are missing', async () => {
            req.body = { email: 'test@mail.com' };
            await authController.register(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({ success: false, message: 'All fields are required' })
            );
        });

        it('should call authService.register and return 201 on success', async () => {
            req.body = {
                email: 'test@mail.com',
                password: 'pass',
                name: 'Name',
                phone: '123',
                address: 'Hanoi',
            };
            authService.register.mockResolvedValue({ id: 'u1', email: 'test@mail.com', name: 'Name' });

            await authController.register(req, res, next);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: { id: 'u1', email: 'test@mail.com', name: 'Name' },
            });
        });
    });

    describe('login', () => {
        it('should set cookie and return accessToken on success', async () => {
            req.body = { email: 'test@mail.com', password: 'pass' };
            authService.login.mockResolvedValue({
                user: { id: 'u1', email: 'test@mail.com' },
                accessToken: 'access_123',
                refreshToken: 'refresh_123',
            });

            await authController.login(req, res, next);
            expect(res.cookie).toHaveBeenCalledWith('refreshToken', 'refresh_123', expect.any(Object));
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: {
                    user: { id: 'u1', email: 'test@mail.com' },
                    accessToken: 'access_123',
                },
            });
        });
    });

    describe('logout', () => {
        it('should clear refreshToken cookie and return 200', async () => {
            await authController.logout(req, res, next);
            expect(authService.logout).toHaveBeenCalledWith('u1');
            expect(res.clearCookie).toHaveBeenCalledWith('refreshToken');
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('getMe', () => {
        it('should return current user profile', async () => {
            authService.getUserById.mockResolvedValue({ id: 'u1', email: 'test@mail.com' });
            await authController.getMe(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: { user: { id: 'u1', email: 'test@mail.com' } },
            });
        });
    });

    describe('refresh', () => {
        it('should throw error if no refreshToken cookie exists', async () => {
            req.cookies = {};
            await authController.refresh(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(Error));
        });

        it('should return new accessToken if valid cookie exists', async () => {
            req.cookies = { refreshToken: 'valid_refresh' };
            authService.refresh.mockResolvedValue({ accessToken: 'new_access' });

            await authController.refresh(req, res, next);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: { accessToken: 'new_access' },
            });
        });
    });

    describe('forgotPassword', () => {
        it('should trigger forgotPassword service and return 200', async () => {
            req.body = { email: 'user@test.com' };
            await authController.forgotPassword(req, res, next);
            expect(authService.forgotPassword).toHaveBeenCalledWith('user@test.com');
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('resetPassword', () => {
        it('should trigger resetPassword service and return 200', async () => {
            req.body = { token: 'reset123', password: 'newpass' };
            await authController.resetPassword(req, res, next);
            expect(authService.resetPassword).toHaveBeenCalledWith('reset123', 'newpass');
            expect(res.status).toHaveBeenCalledWith(200);
        });
    });
});

