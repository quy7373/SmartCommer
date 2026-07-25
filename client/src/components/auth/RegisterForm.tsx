import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { register as registerApi } from '../../api/auth';

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

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

export const RegisterForm = () => {
    const [showPass, setShowPass] = useState(false);
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: any) => {
        try {
            await registerApi(data);
            toast.success('Account created successfully!');
            navigate('/login');
        } catch (error) {
            toast.error('Registration failed. Please try again.');
            console.error('Register failed:', error);
        }
    };

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
                            Join the shelf
                            <br />
                            of good taste.
                        </p>
                        <p className="sc-body text-[#B9C4BC] mt-5 max-w-xs text-[15px] leading-relaxed">
                            Create an account for member pricing, order tracking, and a wishlist that follows you around.
                        </p>
                    </div>

                    <p className="sc-mono text-xs text-[#6E7B73] tracking-wide">© 2026 Smart Commerce Co.</p>

                    <div className="absolute -right-6 top-24 rotate-[8deg] bg-[#FAF9F6] text-[#16211C] sc-mono text-xs font-semibold px-3 py-1.5 rounded-sm shadow-lg flex items-center gap-1.5">
                        <TagIcon className="w-3.5 h-3.5" /> New in
                    </div>
                    <div className="absolute right-10 top-44 rotate-[-6deg] bg-[#E8A33D] text-[#4A2F0A] sc-mono text-xs font-semibold px-3 py-1.5 rounded-sm shadow-lg flex items-center gap-1.5">
                        <TagIcon className="w-3.5 h-3.5" /> Members save 10%
                    </div>
                </div>

                {/* Form panel */}
                <div className="flex-1 flex items-center justify-center px-6 py-16">
                    <div className="w-full max-w-sm">
                        <div className="mb-9">
                            <div className="lg:hidden flex items-center gap-2 mb-8">
                                <TagIcon className="w-5 h-5 text-[#1F5D4E]" />
                                <span className="sc-mono text-xs tracking-[0.2em] uppercase text-[#1F5D4E]">Smart Commerce</span>
                            </div>
                            <h1 className="sc-display text-[32px] font-medium text-[#16211C]">Create your account</h1>
                            <p className="text-[#6E7B73] mt-2 text-[15px]">Takes less than a minute to get started.</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            <div>
                                <label className="sc-mono block text-[11px] tracking-wide uppercase text-[#6E7B73] mb-1.5">Full name</label>
                                <input
                                    {...register('name')}
                                    placeholder="Jordan Lee"
                                    className="w-full border-0 border-b-2 border-[#DAD5C8] bg-transparent px-0.5 py-2.5 text-[15px] text-[#16211C] placeholder:text-[#A8A296] focus:border-[#1F5D4E] outline-none transition-colors"
                                />
                                {errors.name && <p className="text-[#C24A3D] text-xs mt-1.5">{errors.name.message as string}</p>}
                            </div>

                            <div>
                                <label className="sc-mono block text-[11px] tracking-wide uppercase text-[#6E7B73] mb-1.5">Email</label>
                                <input
                                    {...register('email')}
                                    type="email"
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

                            <div>
                                <label className="sc-mono block text-[11px] tracking-wide uppercase text-[#6E7B73] mb-1.5">Confirm password</label>
                                <input
                                    {...register('confirmPassword')}
                                    type={showPass ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    className="w-full border-0 border-b-2 border-[#DAD5C8] bg-transparent px-0.5 py-2.5 text-[15px] text-[#16211C] placeholder:text-[#A8A296] focus:border-[#1F5D4E] outline-none transition-colors"
                                />
                                {errors.confirmPassword && <p className="text-[#C24A3D] text-xs mt-1.5">{errors.confirmPassword.message as string}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="group w-full py-3.5 bg-[#16211C] text-[#FAF9F6] rounded-sm font-medium text-[15px] flex items-center justify-center gap-2 hover:bg-[#1F5D4E] transition-colors disabled:opacity-60 mt-2"
                            >
                                {isSubmitting ? 'Creating account…' : 'Create account'}
                                {!isSubmitting && <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />}
                            </button>

                            <p className="text-center text-[14px] text-[#6E7B73] pt-1">
                                Already have an account?{' '}
                                <a href="/login" className="font-semibold text-[#16211C] hover:text-[#1F5D4E]">Sign in</a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};