import React, { useState, useEffect } from 'react';
import { Header } from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

export const ProductListPage = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch('/api/products')
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="min-h-screen bg-[#FAF9F6] text-[#16211C]">
            <Header />
            <main className="max-w-7xl mx-auto px-6 py-16 flex gap-8">
                {/* Filter Left */}
                <aside className="w-64 hidden md:block shrink-0">
                    <h3 className="font-semibold mb-4">Filters</h3>
                    <div className="space-y-2">
                        {['Lighting', 'Apparel', 'Kitchen', 'Audio', 'Watches', 'Furniture'].map(cat => (
                            <label key={cat} className="flex items-center gap-2 text-sm">
                                <input type="checkbox" className="rounded border-gray-300" />
                                {cat}
                            </label>
                        ))}
                    </div>
                </aside>

                {/* Products Right */}
                <section className="flex-1">
                    <h2 className="text-3xl font-semibold mb-8">Products</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
                        {products.map((p) => (
                            <div key={p._id} className="group cursor-pointer">
                                <div className="relative aspect-[4/5] rounded-md bg-gray-200 overflow-hidden"></div>
                                <p className="text-[11px] uppercase text-[#8A8577] mt-3">{p.category?.name}</p>
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
};
