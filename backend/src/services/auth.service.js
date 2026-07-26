import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';
import { redis } from '../lib/redis.js';

export const register = async (email, password, name, phone, address) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
            phone,
            role: 'USER',
            addresses: {
                create: [
                    {
                        receiver: name,
                        phone: phone,
                        province: address.province || 'N/A',
                        district: address.district || 'N/A',
                        ward: address.ward || 'N/A',
                        detail: address.detail || address,
                        isDefault: true
                    }
                ]
            }
        },
    });
};

export const login = async (email, password) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error('Invalid credentials');
    }
    const accessToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
    await redis.set(`refreshToken:${user.id}`, refreshToken, { EX: 30 * 24 * 60 * 60 });
    return { user: { id: user.id, email: user.email, name: user.name, role: user.role }, accessToken, refreshToken };
};

export const logout = async (userId) => {
    await redis.del(`refreshToken:${userId}`);
};

export const refresh = async (token) => {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const storedToken = await redis.get(`refreshToken:${decoded.id}`);
    if (token !== storedToken) throw new Error('Invalid refresh token');
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    const accessToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
    return { accessToken };
};

export const getUserById = async (userId) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');
    return { id: user.id, email: user.email, name: user.name, role: user.role };
};
