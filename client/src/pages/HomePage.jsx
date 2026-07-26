import React from 'react';
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { ArrowRight, Lamp, Shirt, Coffee, Headphones, Watch, Sofa } from 'lucide-react';

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
];

export const HomePage = () => (
    <div className="min-h-screen bg-[#FAF9F6] text-[#16211C]">
        <Header />
        <main className="max-w-7xl mx-auto px-6 py-16">
            <section className="mb-20">
                <h2 className="text-3xl font-semibold mb-8">Welcome back</h2>
                <div className="flex gap-4 overflow-x-auto pb-1">
                    {categories.map(({ name, icon: Icon }) => (
                        <button
                            key={name}
                            className="flex items-center gap-2.5 whitespace-nowrap px-5 py-3 rounded-full border border-[#DAD5C8] bg-white hover:border-[#1F5D4E] transition-colors text-[14px] font-medium"
                        >
                            <Icon size={16} />
                            {name}
                        </button>
                    ))}
                </div>
            </section>

            <section>
                <div className="flex items-end justify-between mb-8">
                    <h2 className="text-3xl font-semibold">Recommended for you</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    {products.map((p) => (
                        <div key={p.name} className="group cursor-pointer">
                            <div className={`relative aspect-[4/5] rounded-md bg-gradient-to-br ${p.tint} overflow-hidden`}></div>
                            <p className="text-[11px] uppercase text-[#8A8577] mt-3">{p.category}</p>
                            <p className="text-[15px] font-medium mt-0.5">{p.name}</p>
                            <p className="text-[14px] font-semibold mt-1">${p.price}</p>
                        </div>
                    ))}
                </div>
            </section>
        </main>
        <Footer />
    </div>
);