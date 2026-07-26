import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';
import { redis } from '../lib/redis.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

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

export const forgotPassword = async (email) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('User not found');

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetExpires = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.user.update({
        where: { id: user.id },
        data: {
            resetPasswordToken: resetTokenHash,
            resetPasswordExpires: resetExpires
        }
    });

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Password Reset Request',
        text: `You requested a password reset. Click here to reset: ${resetUrl}`
    });
};

export const resetPassword = async (token, password) => {
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const user = await prisma.user.findFirst({
        where: {
            resetPasswordToken: resetTokenHash,
            resetPasswordExpires: { gt: new Date() }
        }
    });

    if (!user) throw new Error('Invalid or expired token');

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
        where: { id: user.id },
        data: {
            password: hashedPassword,
            resetPasswordToken: null,
            resetPasswordExpires: null
        }
    });
};
