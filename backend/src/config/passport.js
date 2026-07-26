import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { prisma } from '../lib/prisma.js';

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/api/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await prisma.user.findUnique({ where: { googleId: profile.id } });
                if (!user) {
                    user = await prisma.user.findUnique({ where: { email: profile.emails[0].value } });
                    if (user) {
                        user = await prisma.user.update({
                            where: { id: user.id },
                            data: { googleId: profile.id, provider: 'GOOGLE' },
                        });
                    } else {
                        user = await prisma.user.create({
                            data: {
                                email: profile.emails[0].value,
                                name: profile.displayName,
                                googleId: profile.id,
                                provider: 'GOOGLE',
                                isVerified: true,
                            },
                        });
                    }
                }
                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

passport.use(
    new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
            callbackURL: '/api/auth/facebook/callback',
            profileFields: ['id', 'displayName', 'emails'],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await prisma.user.findUnique({ where: { facebookId: profile.id } });
                if (!user) {
                    const email = profile.emails ? profile.emails[0].value : null;
                    if (email) {
                        user = await prisma.user.findUnique({ where: { email } });
                        if (user) {
                            user = await prisma.user.update({
                                where: { id: user.id },
                                data: { facebookId: profile.id, provider: 'FACEBOOK' },
                            });
                        }
                    }
                    if (!user) {
                        user = await prisma.user.create({
                            data: {
                                email: email || `fb_${profile.id}@example.com`,
                                name: profile.displayName,
                                facebookId: profile.id,
                                provider: 'FACEBOOK',
                                isVerified: true,
                            },
                        });
                    }
                }
                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

export default passport;