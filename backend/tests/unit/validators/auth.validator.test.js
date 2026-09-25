import { describe, it, expect } from 'vitest';
import { registerSchema, loginSchema } from '../../../src/validators/auth.validator.js';

describe('auth.validator', () => {
    describe('registerSchema', () => {
        it('should pass for valid email and password (>= 6 chars)', async () => {
            const validData = {
                body: {
                    email: 'test@example.com',
                    password: 'password123',
                },
            };
            const result = await registerSchema.parseAsync(validData);
            expect(result.body.email).toBe('test@example.com');
        });

        it('should fail if email is invalid', async () => {
            const invalidData = {
                body: {
                    email: 'invalid-email',
                    password: 'password123',
                },
            };
            await expect(registerSchema.parseAsync(invalidData)).rejects.toThrow();
        });

        it('should fail if password is less than 6 chars', async () => {
            const invalidData = {
                body: {
                    email: 'test@example.com',
                    password: '123',
                },
            };
            await expect(registerSchema.parseAsync(invalidData)).rejects.toThrow();
        });
    });

    describe('loginSchema', () => {
        it('should pass for valid login credentials', async () => {
            const validData = {
                body: {
                    email: 'user@test.com',
                    password: 'securepassword',
                },
            };
            const result = await loginSchema.parseAsync(validData);
            expect(result.body.email).toBe('user@test.com');
        });

        it('should fail for missing email or short password', async () => {
            const invalidData = {
                body: {
                    email: 'not-an-email',
                    password: '12',
                },
            };
            await expect(loginSchema.parseAsync(invalidData)).rejects.toThrow();
        });
    });
});

