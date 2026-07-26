import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { resetPassword } from '../api/auth';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';

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

export const ResetPasswordPage = () => {
    const { token } = useParams<{ token: string }>();
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;
        setLoading(true);
        try {
            await resetPassword(token, password);
            toast.success('Password reset successful');
            navigate('/login');
        } catch (error) {
            toast.error('Failed to reset password');
        } finally {
            setLoading(false);
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
            <div className="sc-body min-h-screen w-full flex bg-[#FAF9F6] items-center justify-center px-6">
                <div className="w-full max-w-sm">
                    <div className="mb-10">
                        <div className="flex items-center gap-2 mb-8">
                            <TagIcon className="w-5 h-5 text-[#1F5D4E]" />
                            <span className="sc-mono text-xs tracking-[0.2em] uppercase text-[#1F5D4E]">Smart Commerce</span>
                        </div>
                        <h1 className="sc-display text-[32px] font-medium text-[#16211C]">Reset password</h1>
                        <p className="text-[#6E7B73] mt-2 text-[15px]">Enter your new password below.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="sc-mono block text-[11px] tracking-wide uppercase text-[#6E7B73] mb-1.5">New Password</label>
                            <div className="relative">
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full border-0 border-b-2 border-[#DAD5C8] bg-transparent px-0.5 py-2.5 pr-8 text-[15px] text-[#16211C] placeholder:text-[#A8A296] focus:border-[#1F5D4E] outline-none transition-colors"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    className="absolute right-0 top-2.5 text-[#6E7B73] hover:text-[#16211C] transition-colors"
                                >
                                    {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="group w-full py-3.5 bg-[#16211C] text-[#FAF9F6] rounded-sm font-medium text-[15px] flex items-center justify-center gap-2 hover:bg-[#1F5D4E] transition-colors disabled:opacity-60"
                        >
                            {loading ? 'Resetting…' : 'Reset password'}
                            {!loading && <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ResetPasswordPage;