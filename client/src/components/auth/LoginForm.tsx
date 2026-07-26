import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { login as loginApi } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';

const loginSchema = z.object({
    email: z.string().email('Enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Small retail price-tag glyph used as the brand's signature motif.
const TagIcon = ({ className = '' }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
        <path
            d="M20 12.5 12.9 19.6a2 2 0 0 1-2.83 0L4.4 13.93a2 2 0 0 1 0-2.83L11.5 4h6a2.5 2.5 0 0 1 2.5 2.5v6Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
        />
        <circle cx="15.5" cy="8.5" r="1.25" fill="currentColor" />
    </svg>
);

export const LoginForm = () => {
    const [showPass, setShowPass] = useState(false);
    const navigate = useNavigate();
    const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const auth = useAuth() as any;
    const login = auth?.login || (() => { });
    const onSubmit = async (data: any) => {
        const rememberMe = (document.querySelector('input[type="checkbox"]') as HTMLInputElement)?.checked;
        if (rememberMe) {
            localStorage.setItem('rememberedEmail', data.email);
        } else {
            localStorage.removeItem('rememberedEmail');
        }
        try {
            const response = await loginApi(data);
            const user = response.data.user;
            login(user, response.data.accessToken);
            toast.success('Logged in successfully!');
            const role = user.role.toLowerCase();
            if (role === 'admin') {
                navigate('/admin');
            } else if (role === 'owner') {
                navigate('/owner');
            } else {
                navigate('/');
            }
        } catch (error) {
            toast.error('Login failed. Please check your credentials.');
            console.error('Login failed:', error);
        }
    };

    React.useEffect(() => {
        const savedEmail = localStorage.getItem('rememberedEmail');
        if (savedEmail) {
            setValue('email', savedEmail);
            const checkbox = document.querySelector('input[type="checkbox"]') as HTMLInputElement;
            if (checkbox) checkbox.checked = true;
        }
    }, [setValue]);

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
                .sc-display { font-family: 'Fraunces', serif; }
                .sc-body { font-family: 'Inter', sans-serif; }
                .sc-mono { font-family: 'IBM Plex Mono', monospace; }
            `}</style>
            <div className="sc-body min-h-screen w-full flex bg-[#FAF9F6]">
                {/* Brand panel */}
                <div className="hidden lg:flex lg:w-[42%] relative bg-[#16211C] text-[#FAF9F6] px-14 py-16 flex-col justify-between overflow-hidden">
                    <div className="flex items-center gap-2">
                        <TagIcon className="w-6 h-6 text-[#E8A33D]" />
                        <span className="sc-mono text-sm tracking-[0.2em] uppercase">Smart Commerce</span>
                    </div>

                    <div className="relative z-10">
                        <p className="sc-display text-4xl leading-[1.15] font-medium">
                            Things worth
                            <br />
                            living with.
                        </p>
                        <p className="sc-body text-[#B9C4BC] mt-5 max-w-xs text-[15px] leading-relaxed">
                            Sign in to track orders, save favorites, and check out faster next time.
                        </p>
                    </div>

                    <p className="sc-mono text-xs text-[#6E7B73] tracking-wide">© 2026 Smart Commerce Co.</p>

                    {/* Floating price tags, decorative */}
                    <div className="absolute -right-6 top-24 rotate-[8deg] bg-[#FAF9F6] text-[#16211C] sc-mono text-xs font-semibold px-3 py-1.5 rounded-sm shadow-lg flex items-center gap-1.5">
                        <TagIcon className="w-3.5 h-3.5" /> $68.00
                    </div>
                    <div className="absolute right-10 top-44 rotate-[-6deg] bg-[#E8A33D] text-[#4A2F0A] sc-mono text-xs font-semibold px-3 py-1.5 rounded-sm shadow-lg flex items-center gap-1.5">
                        <TagIcon className="w-3.5 h-3.5" /> −20%
                    </div>
                </div>

                {/* Form panel */}
                <div className="flex-1 flex items-center justify-center px-6 py-16">
                    <div className="w-full max-w-sm">
                        <div className="mb-10">
                            <div className="lg:hidden flex items-center gap-2 mb-8">
                                <TagIcon className="w-5 h-5 text-[#1F5D4E]" />
                                <span className="sc-mono text-xs tracking-[0.2em] uppercase text-[#1F5D4E]">Smart Commerce</span>
                            </div>
                            <h1 className="sc-display text-[32px] font-medium text-[#16211C]">Sign in</h1>
                            <p className="text-[#6E7B73] mt-2 text-[15px]">Welcome back. Your cart is right where you left it.</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div>
                                <label className="sc-mono block text-[11px] tracking-wide uppercase text-[#6E7B73] mb-1.5">Email</label>
                                <input
                                    {...register('email')}
                                    type="email"
                                    autoComplete="email"
                                    placeholder="name@email.com"
                                    className="w-full border-0 border-b-2 border-[#DAD5C8] bg-transparent px-0.5 py-2.5 text-[15px] text-[#16211C] placeholder:text-[#A8A296] focus:border-[#1F5D4E] outline-none transition-colors"
                                />
                                {errors.email && <p className="text-[#C24A3D] text-xs mt-1.5">{errors.email.message as string}</p>}
                            </div>

                            <div>
                                <label className="sc-mono block text-[11px] tracking-wide uppercase text-[#6E7B73] mb-1.5">Password</label>
                                <div className="relative">
                                    <input
                                        {...register('password')}
                                        type={showPass ? 'text' : 'password'}
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                        className="w-full border-0 border-b-2 border-[#DAD5C8] bg-transparent px-0.5 py-2.5 pr-8 text-[15px] text-[#16211C] placeholder:text-[#A8A296] focus:border-[#1F5D4E] outline-none transition-colors"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPass(!showPass)}
                                        className="absolute right-0 top-2.5 text-[#6E7B73] hover:text-[#16211C] transition-colors"
                                        aria-label={showPass ? 'Hide password' : 'Show password'}
                                    >
                                        {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-[#C24A3D] text-xs mt-1.5">{errors.password.message as string}</p>}
                            </div>

                            <div className="flex items-center justify-between text-[13px] pt-1">
                                <label className="flex items-center gap-2 text-[#4A544D] cursor-pointer">
                                    <input type="checkbox" className="accent-[#1F5D4E] w-3.5 h-3.5" />
                                    Remember me
                                </label>
                                <Link to="/forgot-password" title="Forgot password?" className="text-[#1F5D4E] font-medium hover:underline">Forgot password?</Link>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="group w-full py-3.5 bg-[#16211C] text-[#FAF9F6] rounded-sm font-medium text-[15px] flex items-center justify-center gap-2 hover:bg-[#1F5D4E] transition-colors disabled:opacity-60"
                            >
                                {isSubmitting ? 'Signing in…' : 'Sign in'}
                                {!isSubmitting && <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />}
                            </button>

                            <div className="relative py-2">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-[#DAD5C8]"></div>
                                </div>
                                <div className="relative flex justify-center text-[11px] uppercase tracking-widest">
                                    <span className="bg-[#FAF9F6] px-3 text-[#A8A296]">Or continue with</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => window.location.href = `${(import.meta as any).env.VITE_API_URL}/auth/google`}
                                    className="w-full py-3 border-2 border-[#DAD5C8] text-[#16211C] rounded-sm font-medium text-[14px] flex items-center justify-center gap-2 hover:bg-[#F0EEE9] transition-colors"
                                >
                                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                    Google
                                </button>
                                <button
                                    type="button"
                                    onClick={() => window.location.href = `${(import.meta as any).env.VITE_API_URL}/auth/facebook`}
                                    className="w-full py-3 border-2 border-[#DAD5C8] text-[#16211C] rounded-sm font-medium text-[14px] flex items-center justify-center gap-2 hover:bg-[#F0EEE9] transition-colors"
                                >
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#1877F2">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                    Facebook
                                </button>
                            </div>

                            <p className="text-center text-[14px] text-[#6E7B73] pt-2">
                                New to Smart Commerce?{' '}
                                <a href="/register" className="font-semibold text-[#16211C] hover:text-[#1F5D4E]">Create an account</a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};