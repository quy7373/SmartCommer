import React from 'react';
import { ArrowRight, ShoppingBag, Search, Lamp, Shirt, Coffee, Headphones, Watch, Sofa } from 'lucide-react';

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

const categories = [
    { name: 'Lighting', icon: Lamp },
    { name: 'Apparel', icon: Shirt },
    { name: 'Kitchen', icon: Coffee },
    { name: 'Audio', icon: Headphones },
    { name: 'Watches', icon: Watch },
    { name: 'Furniture', icon: Sofa },
];

const products = [
    { name: 'Ash Table Lamp', category: 'Lighting', price: '68.00', tint: 'from-[#E8DCC8] to-[#D9C4A0]' },
    { name: 'Everyday Wool Coat', category: 'Apparel', price: '214.00', tint: 'from-[#DCE3DA] to-[#B7C6B4]' },
    { name: 'Pour-Over Kit', category: 'Kitchen', price: '46.00', tint: 'from-[#E9D9CE] to-[#D3AF95]' },
    { name: 'Field Headphones', category: 'Audio', price: '129.00', tint: 'from-[#DDE0DC] to-[#B9BFB4]' },
    { name: 'Quarry Ceramic Vase', category: 'Kitchen', price: '58.00', tint: 'from-[#E4DED0] to-[#C9BC9C]' },
    { name: 'Oak Side Table', category: 'Furniture', price: '188.00', tint: 'from-[#E6DACB] to-[#CBA97E]' },
    { name: 'Minimal Wrist Watch', category: 'Watches', price: '95.00', tint: 'from-[#DEDCD6] to-[#B4B0A4]' },
    { name: 'Linen Weekend Bag', category: 'Apparel', price: '142.00', tint: 'from-[#E7DFD2] to-[#CBB98F]' },
];

const PriceTag = ({ price, className = '' }: { price: string; className?: string }) => (
    <div
        className={`sc-mono inline-flex items-center gap-1.5 bg-[#FAF9F6] text-[#16211C] text-[13px] font-semibold px-2.5 py-1 rounded-sm shadow-md ${className}`}
    >
        <TagIcon className="w-3 h-3 text-[#1F5D4E]" />${price}
    </div>
);

const LandingPage: React.FC = () => {
    return (
        <div className="sc-body min-h-screen bg-[#FAF9F6] text-[#16211C]">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
                .sc-display { font-family: 'Fraunces', serif; }
                .sc-body { font-family: 'Inter', sans-serif; }
                .sc-mono { font-family: 'IBM Plex Mono', monospace; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { scrollbar-width: none; }
            `}</style>

            {/* Nav */}
            <header className="border-b border-[#E4DFD3] sticky top-0 bg-[#FAF9F6]/95 backdrop-blur z-20">
                <div className="max-w-7xl mx-auto px-6 h-[76px] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <TagIcon className="w-6 h-6 text-[#1F5D4E]" />
                        <span className="sc-display text-xl font-semibold">Smart Commerce</span>
                    </div>
                    <nav className="hidden md:flex items-center gap-8 text-[14px] font-medium text-[#4A544D]">
                        <a href="#" className="hover:text-[#16211C]">Shop</a>
                        <a href="#categories" className="hover:text-[#16211C]">Categories</a>
                        <a href="#" className="hover:text-[#16211C]">About</a>
                    </nav>
                    <div className="flex items-center gap-5">
                        <Search size={19} className="text-[#4A544D] hidden sm:block cursor-pointer hover:text-[#16211C]" />
                        <div className="relative">
                            <ShoppingBag size={19} className="text-[#4A544D] cursor-pointer hover:text-[#16211C]" />
                            <span className="absolute -top-2 -right-2 bg-[#E8A33D] text-[#4A2F0A] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">3</span>
                        </div>
                        <a href="/login" className="hidden sm:block text-[14px] font-medium text-[#4A544D] hover:text-[#16211C]">Sign in</a>
                        <a href="/register" className="text-[14px] font-medium bg-[#16211C] text-[#FAF9F6] px-4 py-2 rounded-sm hover:bg-[#1F5D4E] transition-colors">Sign up</a>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <section className="max-w-7xl mx-auto px-6 pt-16 pb-20 grid md:grid-cols-2 gap-12 items-center">
                <div>
                    <p className="sc-mono text-[12px] tracking-[0.18em] uppercase text-[#1F5D4E] mb-5">Curated goods, honest prices</p>
                    <h1 className="sc-display text-5xl md:text-[56px] leading-[1.08] font-semibold">
                        Things worth
                        <br />
                        living with.
                    </h1>
                    <p className="text-[#4A544D] text-[17px] mt-6 max-w-md leading-relaxed">
                        A small, well-lit shelf of objects for the home, chosen for how they wear in, not just how they photograph.
                    </p>
                    <div className="flex items-center gap-6 mt-9">
                        <button className="group flex items-center gap-2 bg-[#E8A33D] text-[#4A2F0A] px-6 py-3.5 rounded-sm font-semibold text-[15px] hover:bg-[#DB9328] transition-colors">
                            Shop the edit
                            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                        </button>
                        <a href="#categories" className="text-[15px] font-medium text-[#16211C] hover:text-[#1F5D4E] underline underline-offset-4">Browse categories</a>
                    </div>
                </div>

                <div className="relative h-[380px] hidden md:block">
                    <div className="absolute right-6 top-0 w-56 h-64 rounded-md bg-gradient-to-br from-[#E4DED0] to-[#C9BC9C] shadow-xl rotate-2" />
                    <PriceTag price="68.00" className="absolute right-2 top-6 rotate-[6deg]" />

                    <div className="absolute left-0 top-24 w-52 h-56 rounded-md bg-gradient-to-br from-[#DCE3DA] to-[#B7C6B4] shadow-xl -rotate-3" />
                    <PriceTag price="214.00" className="absolute left-40 top-16 -rotate-3" />

                    <div className="absolute left-24 bottom-0 w-48 h-44 rounded-md bg-gradient-to-br from-[#E9D9CE] to-[#D3AF95] shadow-xl rotate-1" />
                    <PriceTag price="46.00" className="absolute left-24 bottom-40 rotate-2" />
                </div>
            </section>

            {/* Categories shelf */}
            <section id="categories" className="border-t border-b border-[#E4DFD3]">
                <div className="max-w-7xl mx-auto px-6 py-10">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="sc-display text-xl font-semibold">Shop the shelf</h2>
                        <span className="sc-mono text-[12px] text-[#6E7B73]">{categories.length} departments</span>
                    </div>
                    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1">
                        {categories.map(({ name, icon: Icon }) => (
                            <button
                                key={name}
                                className="flex items-center gap-2.5 whitespace-nowrap px-5 py-3 rounded-full border border-[#DAD5C8] bg-white hover:border-[#1F5D4E] hover:text-[#1F5D4E] transition-colors text-[14px] font-medium"
                            >
                                <Icon size={16} />
                                {name}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Best sellers */}
            <section className="max-w-7xl mx-auto px-6 py-16">
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <p className="sc-mono text-[12px] tracking-[0.18em] uppercase text-[#1F5D4E] mb-2">Most reordered</p>
                        <h2 className="sc-display text-3xl font-semibold">Best sellers</h2>
                    </div>
                    <a href="#" className="text-[14px] font-medium text-[#16211C] hover:text-[#1F5D4E] hidden sm:flex items-center gap-1">
                        View all <ArrowRight size={14} />
                    </a>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    {products.map((p) => (
                        <div key={p.name} className="group cursor-pointer">
                            <div className={`relative aspect-[4/5] rounded-md bg-gradient-to-br ${p.tint} overflow-hidden`}>
                                <PriceTag price={p.price} className="absolute bottom-3 right-3 rotate-[-3deg] group-hover:rotate-0 transition-transform" />
                            </div>
                            <p className="sc-mono text-[11px] tracking-wide uppercase text-[#8A8577] mt-3">{p.category}</p>
                            <p className="text-[15px] font-medium mt-0.5">{p.name}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-[#E4DFD3] bg-[#16211C] text-[#B9C4BC]">
                <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-4 gap-10">
                    <div>
                        <div className="flex items-center gap-2 text-[#FAF9F6] mb-3">
                            <TagIcon className="w-5 h-5 text-[#E8A33D]" />
                            <span className="sc-display text-lg font-semibold">Smart Commerce</span>
                        </div>
                        <p className="text-[13px] leading-relaxed max-w-xs">A small shelf of things worth living with, shipped from a warehouse that smells faintly of cedar.</p>
                    </div>
                    <div>
                        <p className="sc-mono text-[11px] tracking-wide uppercase text-[#6E7B73] mb-3">Shop</p>
                        <ul className="space-y-2 text-[13px]">
                            <li><a href="#" className="hover:text-[#FAF9F6]">Best sellers</a></li>
                            <li><a href="#" className="hover:text-[#FAF9F6]">New arrivals</a></li>
                            <li><a href="#" className="hover:text-[#FAF9F6]">Sale</a></li>
                        </ul>
                    </div>
                    <div>
                        <p className="sc-mono text-[11px] tracking-wide uppercase text-[#6E7B73] mb-3">Company</p>
                        <ul className="space-y-2 text-[13px]">
                            <li><a href="#" className="hover:text-[#FAF9F6]">About</a></li>
                            <li><a href="#" className="hover:text-[#FAF9F6]">Careers</a></li>
                            <li><a href="#" className="hover:text-[#FAF9F6]">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <p className="sc-mono text-[11px] tracking-wide uppercase text-[#6E7B73] mb-3">Support</p>
                        <ul className="space-y-2 text-[13px]">
                            <li><a href="#" className="hover:text-[#FAF9F6]">Shipping</a></li>
                            <li><a href="#" className="hover:text-[#FAF9F6]">Returns</a></li>
                            <li><a href="#" className="hover:text-[#FAF9F6]">FAQ</a></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-[#2A362F] px-6 py-5 text-center sc-mono text-[11px] text-[#6E7B73]">
                    © 2026 Smart Commerce Co. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;