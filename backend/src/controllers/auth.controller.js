import * as authService from '../services/auth.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const register = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await authService.register(email, password);
    res.status(201).json({ success: true, data: { id: user.id, email: user.email } });
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

export const refresh = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) throw new Error('No refresh token');
    const { accessToken } = await authService.refresh(refreshToken);
    res.status(200).json({ success: true, data: { accessToken } });
});
