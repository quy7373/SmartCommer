import { jest } from '@jest/globals';
import { errorHandler } from '../../src/middlewares/error.middleware.js';

describe('error.middleware (Jest Unit Test)', () => {
    it('returns status 500 and the error message as JSON', () => {
        const err = new Error('Database timeout');
        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const next = jest.fn();
        const spy = jest.spyOn(console, 'error').mockImplementation(() => { });

        errorHandler(err, req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Database timeout',
        });

        spy.mockRestore();
    });
});

