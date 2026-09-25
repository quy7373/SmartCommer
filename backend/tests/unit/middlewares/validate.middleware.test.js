import { describe, it, expect, vi } from 'vitest';
import { z } from 'zod';
import { validate } from '../../../src/middlewares/validate.middleware.js';

describe('validate.middleware', () => {
    const testSchema = z.object({
        body: z.object({
            name: z.string().min(3, 'Name too short'),
        }),
    });

    it('should call next if data matches schema', async () => {
        const req = {
            body: { name: 'SmartE' },
            query: {},
            params: {},
        };
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };
        const next = vi.fn();

        const middleware = validate(testSchema);
        await middleware(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });

    it('should return 400 with first error message if validation fails', async () => {
        const req = {
            body: { name: 'a' },
            query: {},
            params: {},
        };
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };
        const next = vi.fn();

        const middleware = validate(testSchema);
        await middleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Name too short',
        });
        expect(next).not.toHaveBeenCalled();
    });
});

