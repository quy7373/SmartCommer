import { registerSchema, loginSchema } from '../../src/validators/auth.validator.js';

describe('auth.validator (Jest Unit Test)', () => {
    describe('registerSchema', () => {
        it('validates correct email and password', async () => {
            const valid = {
                body: {
                    email: 'jest.test@example.com',
                    password: 'password123',
                },
            };
            const result = await registerSchema.parseAsync(valid);
            expect(result.body.email).toBe('jest.test@example.com');
        });

        it('rejects invalid email formats', async () => {
            const invalid = {
                body: {
                    email: 'not-an-email',
                    password: 'password123',
                },
            };
            await expect(registerSchema.parseAsync(invalid)).rejects.toThrow();
        });

        it('rejects short passwords under 6 characters', async () => {
            const invalid = {
                body: {
                    email: 'test@example.com',
                    password: '123',
                },
            };
            await expect(registerSchema.parseAsync(invalid)).rejects.toThrow();
        });
    });

    describe('loginSchema', () => {
        it('accepts valid credentials', async () => {
            const valid = {
                body: {
                    email: 'login@test.com',
                    password: 'securePassword',
                },
            };
            const result = await loginSchema.parseAsync(valid);
            expect(result.body.email).toBe('login@test.com');
        });
    });
});

