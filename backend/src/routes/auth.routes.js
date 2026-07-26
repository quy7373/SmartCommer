import { Router } from 'express';
import { register, login, logout, refresh, getMe, googleCallback, facebookCallback } from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import passport from '../config/passport.js';
import { registerSchema, loginSchema } from '../validators/auth.validator.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);

router.post('/refresh', refresh);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL}/login` }), googleCallback);

router.get('/facebook', passport.authenticate('facebook', { scope: ['public_profile', 'email'] }));
router.get('/facebook/callback', passport.authenticate('facebook', { session: false, failureRedirect: `${process.env.CLIENT_URL}/login` }), facebookCallback);

export default router;
