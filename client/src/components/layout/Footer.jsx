import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

const TagIcon = ({ className = '' }) => (
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

const Footer = () => {
    return (
        <footer className="bg-[#16211C] text-[#FAF9F6] pt-16 pb-8 px-6 lg:px-14 sc-body">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
                {/* Brand & Contact */}
                <div className="lg:col-span-2">
                    <div className="flex items-center gap-2 mb-6">
                        <TagIcon className="w-6 h-6 text-[#E8A33D]" />
                        <span className="sc-mono text-sm tracking-[0.2em] uppercase">Smart Commerce</span>
                    </div>
                    <p className="text-[#B9C4BC] mb-8 max-w-sm text-[15px] leading-relaxed">
                        Curating things worth living with. High-quality essentials for your modern lifestyle.
                    </p>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-[#B9C4BC] text-sm">
                            <MapPin size={18} className="text-[#E8A33D]" />
                            <span>123 Commerce St, Digital City, 54321</span>
                        </div>
                        <div className="flex items-center gap-3 text-[#B9C4BC] text-sm">
                            <Phone size={18} className="text-[#E8A33D]" />
                            <span>+1 (555) 000-1234</span>
                        </div>
                        <div className="flex items-center gap-3 text-[#B9C4BC] text-sm">
                            <Mail size={18} className="text-[#E8A33D]" />
                            <span>hello@smartcommerce.com</span>
                        </div>
                    </div>
                </div>

                {/* Company */}
                <div>
                    <h4 className="sc-mono text-[11px] tracking-[0.2em] uppercase text-[#6E7B73] mb-6">Company</h4>
                    <ul className="space-y-4 text-[14px]">
                        <li><Link to="/about" className="hover:text-[#E8A33D] transition-colors">About Us</Link></li>
                        <li><Link to="/careers" className="hover:text-[#E8A33D] transition-colors">Careers</Link></li>
                        <li><Link to="/store-locator" className="hover:text-[#E8A33D] transition-colors">Store Locator</Link></li>
                        <li><Link to="/journal" className="hover:text-[#E8A33D] transition-colors">Journal</Link></li>
                    </ul>
                </div>

                {/* Support & Policy */}
                <div>
                    <h4 className="sc-mono text-[11px] tracking-[0.2em] uppercase text-[#6E7B73] mb-6">Support</h4>
                    <ul className="space-y-4 text-[14px] mb-8">
                        <li><Link to="/help" className="hover:text-[#E8A33D] transition-colors">Help Center</Link></li>
                        <li><Link to="/shipping" className="hover:text-[#E8A33D] transition-colors">Shipping & Returns</Link></li>
                        <li><Link to="/track-order" className="hover:text-[#E8A33D] transition-colors">Track Order</Link></li>
                    </ul>
                    <h4 className="sc-mono text-[11px] tracking-[0.2em] uppercase text-[#6E7B73] mb-6">Policy</h4>
                    <ul className="space-y-4 text-[14px]">
                        <li><Link to="/privacy" className="hover:text-[#E8A33D] transition-colors">Privacy Policy</Link></li>
                        <li><Link to="/terms" className="hover:text-[#E8A33D] transition-colors">Terms of Service</Link></li>
                    </ul>
                </div>

                {/* Social */}
                <div>
                    <h4 className="sc-mono text-[11px] tracking-[0.2em] uppercase text-[#6E7B73] mb-6">Social</h4>
                    <div className="flex gap-5 mb-8">
                        <a href="#" className="hover:text-[#E8A33D] transition-colors"><FaFacebook size={20} /></a>
                        <a href="#" className="hover:text-[#E8A33D] transition-colors"><FaInstagram size={20} /></a>
                        <a href="#" className="hover:text-[#E8A33D] transition-colors"><FaTwitter size={20} /></a>
                    </div>
                    <p className="text-[13px] text-[#6E7B73] leading-relaxed">
                        Follow us for updates on new arrivals and exclusive offers.
                    </p>
                </div>
            </div>

            {/* Copyright */}
            <div className="max-w-7xl mx-auto pt-8 border-t border-[#2A3630] flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="sc-mono text-[10px] text-[#6E7B73] tracking-widest uppercase">
                    © 2026 Smart Commerce Co. All rights reserved.
                </p>
                <div className="flex gap-6 sc-mono text-[10px] text-[#6E7B73] tracking-widest uppercase">
                    <Link to="/privacy" className="hover:text-[#FAF9F6]">Privacy</Link>
                    <Link to="/terms" className="hover:text-[#FAF9F6]">Terms</Link>
                    <Link to="/cookies" className="hover:text-[#FAF9F6]">Cookies</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;