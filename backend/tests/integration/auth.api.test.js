import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';

vi.mock('../../src/services/auth.service.js', () => ({
    register: vi.fn(),
    login: vi.fn(),
    logout: vi.fn(),
    getUserById: vi.fn(),
    refresh: vi.fn(),
    forgotPassword: vi.fn(),
    resetPassword: vi.fn(),
}));

import * as authService from '../../src/services/auth.service.js';
import app from '../../src/app.js';

describe('Auth API Integration Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.JWT_SECRET = 'integration_test_jwt_secret';
    });

    describe('POST /api/auth/register', () => {
        it('should return 400 when validation fails (invalid email)', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'invalid-email',
                    password: '123',
                });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it('should return 400 when missing required fields (name, phone, address)', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'valid@example.com',
                    password: 'password123',
                });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('All fields are required');
        });

        it('should register successfully and return 201', async () => {
            authService.register.mockResolvedValue({
                id: 'new_user_1',
                email: 'test@smarte.com',
                name: 'Smart User',
            });

            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'test@smarte.com',
                    password: 'password123',
                    name: 'Smart User',
                    phone: '0987654321',
                    address: '123 Main St',
                });

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.id).toBe('new_user_1');
        });
    });

    describe('POST /api/auth/login', () => {
        it('should return 400 when body does not match schema', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({ email: 'bad' });

            expect(res.status).toBe(400);
        });

        it('should return 200, set refreshToken cookie, and return accessToken on valid login', async () => {
            authService.login.mockResolvedValue({
                user: { id: 'u1', email: 'test@smarte.com', role: 'USER' },
                accessToken: 'access_mock_token',
                refreshToken: 'refresh_mock_token',
            });

            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@smarte.com',
                    password: 'password123',
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.accessToken).toBe('access_mock_token');
            expect(res.headers['set-cookie']).toBeDefined();
        });
    });

    describe('GET /api/auth/me', () => {
        it('should return 401 when authorization header is missing', async () => {
            const res = await request(app).get('/api/auth/me');
            expect(res.status).toBe(401);
            expect(res.body.message).toBe('Unauthorized');
        });

        it('should return 200 with user data when valid bearer token is sent', async () => {
            const token = jwt.sign({ id: 'u1', role: 'USER' }, process.env.JWT_SECRET);
            authService.getUserById.mockResolvedValue({
                id: 'u1',
                email: 'test@smarte.com',
                name: 'Smart User',
                role: 'USER',
            });

            const res = await request(app)
                .get('/api/auth/me')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.user.email).toBe('test@smarte.com');
        });
    });

    describe('POST /api/auth/logout', () => {
        it('should clear cookie and return 200 when authenticated', async () => {
            const token = jwt.sign({ id: 'u1', role: 'USER' }, process.env.JWT_SECRET);
            authService.logout.mockResolvedValue();

            const res = await request(app)
                .post('/api/auth/logout')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Logged out');
        });
    });

    describe('POST /api/auth/forgot-password & reset-password', () => {
        it('should return 200 on forgot-password request', async () => {
            authService.forgotPassword.mockResolvedValue();

            const res = await request(app)
                .post('/api/auth/forgot-password')
                .send({ email: 'test@smarte.com' });

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Password reset email sent');
        });

        it('should return 200 on valid reset-password request', async () => {
            authService.resetPassword.mockResolvedValue();

            const res = await request(app)
                .post('/api/auth/reset-password')
                .send({ token: 'reset_hash_token', password: 'newSecurePassword' });

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Password reset successful');
        });
    });
});

