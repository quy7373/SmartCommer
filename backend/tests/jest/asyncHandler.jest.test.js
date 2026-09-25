import { jest } from '@jest/globals';
import { asyncHandler } from '../../src/utils/asyncHandler.js';

describe('asyncHandler (Jest Unit Test)', () => {
    it('executes the async handler function', async () => {
        const req = {};
        const res = {};
        const next = jest.fn();
        const fn = jest.fn().mockResolvedValue('success');

        const handler = asyncHandler(fn);
        await handler(req, res, next);

        expect(fn).toHaveBeenCalledWith(req, res, next);
        expect(next).not.toHaveBeenCalled();
    });

    it('catches asynchronous rejection and passes error to next()', async () => {
        const req = {};
        const res = {};
        const next = jest.fn();
        const err = new Error('Async failure');
        const fn = jest.fn().mockRejectedValue(err);

        const handler = asyncHandler(fn);
        await handler(req, res, next);

        expect(fn).toHaveBeenCalledWith(req, res, next);
        expect(next).toHaveBeenCalledWith(err);
    });
});

