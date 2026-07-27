import React, { useState, useEffect } from 'react';
import { Header } from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

export const SearchPage = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetch('/api/products')
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.error(err));
    }, []);

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#FAF9F6] text-[#16211C]">
            <Header />
            <main className="max-w-7xl mx-auto px-6 py-16">
                <div className="mb-8 flex gap-4">
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="flex-1 p-3 rounded-lg border border-gray-300"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select className="p-3 rounded-lg border border-gray-300">
                        <option>Sort by</option>
                        <option>Price: Low to High</option>
                        <option>Price: High to Low</option>
                    </select>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5">
                    {filteredProducts.map((p) => (
                        <div key={p._id} className="group cursor-pointer">
                            <div className="relative aspect-[4/5] rounded-md bg-gray-200 overflow-hidden"></div>
                            <p className="text-[11px] uppercase text-[#8A8577] mt-3">{p.category?.name}</p>
                            <p className="text-[15px] font-medium mt-0.5">{p.name}</p>
                            <p className="text-[14px] font-semibold mt-1">${p.price}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-12 flex justify-center gap-2">
                    <button className="px-4 py-2 border rounded">Previous</button>
                    <button className="px-4 py-2 border rounded">Next</button>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default SearchPage;