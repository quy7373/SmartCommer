import { describe, it, expect, vi, beforeEach } from 'vitest';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

vi.mock('../../../src/lib/prisma.js', () => ({
    prisma: {
        user: {
            create: vi.fn(),
            findUnique: vi.fn(),
            findFirst: vi.fn(),
            update: vi.fn(),
        },
    },
}));

vi.mock('../../../src/lib/redis.js', () => ({
    redis: {
        set: vi.fn(),
        get: vi.fn(),
        del: vi.fn(),
    },
}));

vi.mock('nodemailer', () => ({
    default: {
        createTransport: vi.fn(() => ({
            sendMail: vi.fn().mockResolvedValue({ messageId: '123' }),
        })),
    },
}));

import { prisma } from '../../../src/lib/prisma.js';
import { redis } from '../../../src/lib/redis.js';
import * as authService from '../../../src/services/auth.service.js';

describe('auth.service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.JWT_SECRET = 'test_access_secret';
        process.env.JWT_REFRESH_SECRET = 'test_refresh_secret';
        process.env.CLIENT_URL = 'http://localhost:5173';
        process.env.EMAIL_USER = 'test@example.com';
        process.env.EMAIL_PASS = 'pass123';
    });

    describe('register', () => {
        it('should hash password and create a user with address', async () => {
            const mockUser = {
                id: 'u1',
                email: 'test@domain.com',
                name: 'John Doe',
                role: 'USER',
            };
            prisma.user.create.mockResolvedValue(mockUser);

            const result = await authService.register(
                'test@domain.com',
                'secret123',
                'John Doe',
                '0123456789',
                { province: 'HN', district: 'CG', ward: 'MD', detail: '123 Str' }
            );

            expect(prisma.user.create).toHaveBeenCalled();
            const createArg = prisma.user.create.mock.calls[0][0];
            expect(createArg.data.email).toBe('test@domain.com');
            expect(createArg.data.name).toBe('John Doe');
            expect(createArg.data.role).toBe('USER');
            expect(result).toEqual(mockUser);
        });

        it('should handle address as string fallback', async () => {
            prisma.user.create.mockResolvedValue({ id: 'u2' });
            await authService.register('test2@domain.com', 'p', 'Name', '099', 'Simple Address');
            const createArg = prisma.user.create.mock.calls[0][0];
            expect(createArg.data.addresses.create[0].detail).toBe('Simple Address');
        });
    });

    describe('login', () => {
        it('should throw error if user not found', async () => {
            prisma.user.findUnique.mockResolvedValue(null);

            await expect(authService.login('notfound@mail.com', 'pw')).rejects.toThrow('Invalid credentials');
        });

        it('should throw error if password does not match', async () => {
            const hashed = await bcrypt.hash('correct_password', 10);
            prisma.user.findUnique.mockResolvedValue({
                id: 'u1',
                email: 'test@mail.com',
                password: hashed,
            });

            await expect(authService.login('test@mail.com', 'wrong_password')).rejects.toThrow('Invalid credentials');
        });

        it('should return user, accessToken and refreshToken on valid credentials', async () => {
            const hashed = await bcrypt.hash('mypassword', 10);
            prisma.user.findUnique.mockResolvedValue({
                id: 'u1',
                email: 'test@mail.com',
                password: hashed,
                name: 'Test User',
                role: 'USER',
            });
            redis.set.mockResolvedValue('OK');

            const result = await authService.login('test@mail.com', 'mypassword');

            expect(result.user).toEqual({
                id: 'u1',
                email: 'test@mail.com',
                name: 'Test User',
                role: 'USER',
            });
            expect(result.accessToken).toBeDefined();
            expect(result.refreshToken).toBeDefined();
            expect(redis.set).toHaveBeenCalledWith(
                'refreshToken:u1',
                result.refreshToken,
                { EX: 30 * 24 * 60 * 60 }
            );
        });
    });

    describe('logout', () => {
        it('should delete refresh token from redis', async () => {
            await authService.logout('user123');
            expect(redis.del).toHaveBeenCalledWith('refreshToken:user123');
        });
    });

    describe('refresh', () => {
        it('should throw error if token is invalid or storedToken does not match', async () => {
            const token = jwt.sign({ id: 'u1' }, process.env.JWT_REFRESH_SECRET);
            redis.get.mockResolvedValue('different_token');

            await expect(authService.refresh(token)).rejects.toThrow('Invalid refresh token');
        });

        it('should return new accessToken on valid refresh token', async () => {
            const token = jwt.sign({ id: 'u1' }, process.env.JWT_REFRESH_SECRET);
            redis.get.mockResolvedValue(token);
            prisma.user.findUnique.mockResolvedValue({ id: 'u1', role: 'USER' });

            const result = await authService.refresh(token);
            expect(result.accessToken).toBeDefined();
            const decoded = jwt.verify(result.accessToken, process.env.JWT_SECRET);
            expect(decoded.id).toBe('u1');
            expect(decoded.role).toBe('USER');
        });
    });

    describe('getUserById', () => {
        it('should throw error if user not found', async () => {
            prisma.user.findUnique.mockResolvedValue(null);
            await expect(authService.getUserById('nonexistent')).rejects.toThrow('User not found');
        });

        it('should return user info without sensitive fields', async () => {
            prisma.user.findUnique.mockResolvedValue({
                id: 'u1',
                email: 'user@test.com',
                name: 'User',
                role: 'USER',
                password: 'hash',
            });

            const result = await authService.getUserById('u1');
            expect(result).toEqual({
                id: 'u1',
                email: 'user@test.com',
                name: 'User',
                role: 'USER',
            });
        });
    });

    describe('forgotPassword', () => {
        it('should throw error if user does not exist', async () => {
            prisma.user.findUnique.mockResolvedValue(null);
            await expect(authService.forgotPassword('nobody@mail.com')).rejects.toThrow('User not found');
        });

        it('should set reset token in DB and send email', async () => {
            prisma.user.findUnique.mockResolvedValue({ id: 'u1', email: 'user@test.com' });
            prisma.user.update.mockResolvedValue({});

            await authService.forgotPassword('user@test.com');

            expect(prisma.user.update).toHaveBeenCalled();
            const updateCall = prisma.user.update.mock.calls[0][0];
            expect(updateCall.data.resetPasswordToken).toBeDefined();
            expect(updateCall.data.resetPasswordExpires).toBeInstanceOf(Date);
        });
    });

    describe('resetPassword', () => {
        it('should throw error if token is invalid or expired', async () => {
            prisma.user.findFirst.mockResolvedValue(null);
            await expect(authService.resetPassword('bad_token', 'newpass123')).rejects.toThrow('Invalid or expired token');
        });

        it('should hash new password, clear token and update user', async () => {
            prisma.user.findFirst.mockResolvedValue({ id: 'u1' });
            prisma.user.update.mockResolvedValue({});

            await authService.resetPassword('valid_token', 'newpass123');

            expect(prisma.user.update).toHaveBeenCalled();
            const updateCall = prisma.user.update.mock.calls[0][0];
            expect(updateCall.data.resetPasswordToken).toBeNull();
            expect(updateCall.data.resetPasswordExpires).toBeNull();
            expect(updateCall.data.password).toBeDefined();
        });
    });
});

