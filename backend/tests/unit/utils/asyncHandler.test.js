import { describe, it, expect, vi } from 'vitest';
import { asyncHandler } from '../../../src/utils/asyncHandler.js';

describe('asyncHandler util', () => {
    it('should call the wrapped async function with req, res, next', async () => {
        const req = {};
        const res = {};
        const next = vi.fn();
        const fn = vi.fn().mockResolvedValue('ok');

        const handler = asyncHandler(fn);
        await handler(req, res, next);

        expect(fn).toHaveBeenCalledWith(req, res, next);
        expect(next).not.toHaveBeenCalled();
    });

    it('should catch errors and pass them to next()', async () => {
        const req = {};
        const res = {};
        const next = vi.fn();
        const error = new Error('Test error');
        const fn = vi.fn().mockRejectedValue(error);

        const handler = asyncHandler(fn);
        await handler(req, res, next);

        expect(fn).toHaveBeenCalledWith(req, res, next);
        expect(next).toHaveBeenCalledWith(error);
    });
});

