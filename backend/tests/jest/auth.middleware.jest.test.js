import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';
import { authenticate, authorize } from '../../src/middlewares/auth.middleware.js';

describe('auth.middleware (Jest Unit Test)', () => {
    const SECRET = 'jest_secret_key_12345';
    beforeEach(() => {
        process.env.JWT_SECRET = SECRET;
    });

    describe('authenticate', () => {
        it('returns 401 when Authorization header is absent', () => {
            const req = { headers: {} };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const next = jest.fn();

            authenticate(req, res, next);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Unauthorized' });
            expect(next).not.toHaveBeenCalled();
        });

        it('authenticates valid Bearer token and attaches decoded user to req', () => {
            const token = jwt.sign({ id: 'u1', role: 'ADMIN' }, SECRET);
            const req = { headers: { authorization: `Bearer ${token}` } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const next = jest.fn();

            authenticate(req, res, next);
            expect(req.user.id).toBe('u1');
            expect(req.user.role).toBe('ADMIN');
            expect(next).toHaveBeenCalled();
        });
    });

    describe('authorize', () => {
        it('returns 403 when user role is not authorized', () => {
            const req = { user: { id: 'u1', role: 'USER' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const next = jest.fn();

            const guard = authorize(['ADMIN', 'OWNER']);
            guard(req, res, next);
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Forbidden' });
        });

        it('calls next when user role is in the allowed roles list', () => {
            const req = { user: { id: 'u1', role: 'OWNER' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const next = jest.fn();

            const guard = authorize(['ADMIN', 'OWNER']);
            guard(req, res, next);
            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
        });
    });
});

