import React, { useState } from 'react';
import { forgotPassword } from '../api/auth';
import { toast } from 'react-hot-toast';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

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

export const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await forgotPassword(email);
            toast.success('Password reset email sent');
        } catch (error) {
            toast.error('Failed to send email');
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
                        <h1 className="sc-display text-[32px] font-medium text-[#16211C]">Forgot password</h1>
                        <p className="text-[#6E7B73] mt-2 text-[15px]">Enter your email to receive a reset link.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="sc-mono block text-[11px] tracking-wide uppercase text-[#6E7B73] mb-1.5">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@email.com"
                                className="w-full border-0 border-b-2 border-[#DAD5C8] bg-transparent px-0.5 py-2.5 text-[15px] text-[#16211C] placeholder:text-[#A8A296] focus:border-[#1F5D4E] outline-none transition-colors"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="group w-full py-3.5 bg-[#16211C] text-[#FAF9F6] rounded-sm font-medium text-[15px] flex items-center justify-center gap-2 hover:bg-[#1F5D4E] transition-colors disabled:opacity-60"
                        >
                            {loading ? 'Sending…' : 'Send reset link'}
                            {!loading && <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />}
                        </button>

                        <p className="text-center text-[14px] text-[#6E7B73] pt-2">
                            <Link to="/login" className="font-semibold text-[#16211C] hover:text-[#1F5D4E]">Back to sign in</Link>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ForgotPasswordPage;