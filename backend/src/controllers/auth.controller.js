import * as authService from '../services/auth.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import jwt from 'jsonwebtoken';
import { redis } from '../lib/redis.js';

export const register = asyncHandler(async (req, res) => {
    const { email, password, name, phone, address } = req.body;
    if (!email || !password || !name || !phone || !address) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    const user = await authService.register(email, password, name, phone, address);
    res.status(201).json({ success: true, data: { id: user.id, email: user.email, name: user.name } });
});

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await authService.login(email, password);
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
    res.status(200).json({ success: true, data: { user, accessToken } });
});

export const logout = asyncHandler(async (req, res) => {
    await authService.logout(req.user.id);
    res.clearCookie('refreshToken');
    res.status(200).json({ success: true, message: 'Logged out' });
});

export const getMe = asyncHandler(async (req, res) => {
    const user = await authService.getUserById(req.user.id);
    res.status(200).json({ success: true, data: { user } });
});

export const refresh = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) throw new Error('No refresh token');
    const { accessToken } = await authService.refresh(refreshToken);
    res.status(200).json({ success: true, data: { accessToken } });
});

export const googleCallback = asyncHandler(async (req, res) => {
    const user = req.user;
    const accessToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
    await redis.set(`refreshToken:${user.id}`, refreshToken, { EX: 30 * 24 * 60 * 60 });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${accessToken}`);
});

export const facebookCallback = asyncHandler(async (req, res) => {
    const user = req.user;
    const accessToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
    await redis.set(`refreshToken:${user.id}`, refreshToken, { EX: 30 * 24 * 60 * 60 });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${accessToken}`);
});

export const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    await authService.forgotPassword(email);
    res.status(200).json({ success: true, message: 'Password reset email sent' });
});

export const resetPassword = asyncHandler(async (req, res) => {
    const { token, password } = req.body;
    await authService.resetPassword(token, password);
    res.status(200).json({ success: true, message: 'Password reset successful' });
});
