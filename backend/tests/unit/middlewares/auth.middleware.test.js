import { describe, it, expect, vi, beforeEach } from 'vitest';
import jwt from 'jsonwebtoken';
import { authenticate, authorize } from '../../../src/middlewares/auth.middleware.js';

describe('auth.middleware', () => {
    const originalEnv = process.env.JWT_SECRET;
    beforeEach(() => {
        process.env.JWT_SECRET = 'test_jwt_secret_key';
    });

    describe('authenticate', () => {
        it('should return 401 if authorization header is missing', () => {
            const req = { headers: {} };
            const res = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn(),
            };
            const next = vi.fn();

            authenticate(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Unauthorized' });
            expect(next).not.toHaveBeenCalled();
        });

        it('should return 401 if authorization header does not start with Bearer', () => {
            const req = { headers: { authorization: 'Basic 12345' } };
            const res = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn(),
            };
            const next = vi.fn();

            authenticate(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Unauthorized' });
            expect(next).not.toHaveBeenCalled();
        });

        it('should return 401 if token is invalid or expired', () => {
            const req = { headers: { authorization: 'Bearer invalid.token.value' } };
            const res = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn(),
            };
            const next = vi.fn();

            authenticate(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Invalid token' });
            expect(next).not.toHaveBeenCalled();
        });

        it('should attach user payload to req and call next if token is valid', () => {
            const payload = { id: 'user123', role: 'USER' };
            const token = jwt.sign(payload, process.env.JWT_SECRET);
            const req = { headers: { authorization: `Bearer ${token}` } };
            const res = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn(),
            };
            const next = vi.fn();

            authenticate(req, res, next);

            expect(req.user).toBeDefined();
            expect(req.user.id).toBe(payload.id);
            expect(req.user.role).toBe(payload.role);
            expect(next).toHaveBeenCalled();
        });
    });

    describe('authorize', () => {
        it('should return 403 if req.user role is not in the allowed roles list', () => {
            const req = { user: { id: 'u1', role: 'USER' } };
            const res = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn(),
            };
            const next = vi.fn();

            const middleware = authorize(['ADMIN', 'OWNER']);
            middleware(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Forbidden' });
            expect(next).not.toHaveBeenCalled();
        });

        it('should call next if req.user role is allowed', () => {
            const req = { user: { id: 'u1', role: 'ADMIN' } };
            const res = {
                status: vi.fn().mockReturnThis(),
                json: vi.fn(),
            };
            const next = vi.fn();

            const middleware = authorize(['ADMIN', 'OWNER']);
            middleware(req, res, next);

            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
        });
    });
});

