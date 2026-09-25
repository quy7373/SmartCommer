import { describe, it, expect, vi } from 'vitest';
import { errorHandler } from '../../../src/middlewares/error.middleware.js';

describe('error.middleware', () => {
    it('should return 500 status and error message', () => {
        const err = new Error('Something went wrong');
        const req = {};
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };
        const next = vi.fn();
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        errorHandler(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Something went wrong',
        });
        consoleSpy.mockRestore();
    });

    it('should use fallback message if error.message is not present', () => {
        const err = {};
        const req = {};
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };
        const next = vi.fn();
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        errorHandler(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Something went wrong',
        });
        consoleSpy.mockRestore();
    });
});

