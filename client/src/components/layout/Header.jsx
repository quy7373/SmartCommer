import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LayoutGrid, Heart, ShoppingCart, Bell, User } from 'lucide-react';

export const Header = () => {
    const { user, logout } = useAuth() || {};
    const [isOpen, setIsOpen] = useState(false);
    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E4DFD3]">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <div className="text-2xl font-bold text-[#16211C]">Logo</div>
                <div className="flex-1 mx-8">
                    <input type="text" placeholder="Search..." className="w-full bg-transparent border-b border-[#DAD5C8] focus:border-[#1F5D4E] outline-none py-1 text-[#16211C] placeholder-[#A8A296]" />
                </div>
                <nav className="flex gap-6 text-[#4A544D] items-center">
                    <a href="/categories" className="hover:text-[#16211C]"><LayoutGrid size={20} /></a>
                    <a href="/wishlist" className="hover:text-[#16211C]"><Heart size={20} /></a>
                    <a href="/cart" className="hover:text-[#16211C]"><ShoppingCart size={20} /></a>
                    <a href="/notifications" className="hover:text-[#16211C]"><Bell size={20} /></a>
                    {user ? (
                        <div className="relative">
                            <div
                                className="flex items-center gap-1 cursor-pointer hover:text-[#16211C]"
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                <div className="w-6 h-6 rounded-full bg-[#E4DFD3] flex items-center justify-center text-xs text-[#16211C]">
                                    {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
                                </div>
                                <span>{user.name || user.email.split('@')[0]}</span>
                            </div>
                            {isOpen && (
                                <div className="absolute right-0 mt-2 w-32 bg-white border border-[#E4DFD3] rounded-sm shadow-lg py-1 z-50">
                                    <a href="/profile" className="block px-4 py-2 text-sm hover:bg-[#F9F8F5]">Profile</a>
                                    <button
                                        onClick={logout}
                                        className="block w-full text-left px-4 py-2 text-sm hover:bg-[#F9F8F5]"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <a href="/login" className="hover:text-[#16211C]">Login</a>
                    )}
                </nav>
            </div>
        </header>
    );
};
