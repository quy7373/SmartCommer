import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { getCategories } from '../../api/categories';
import { getProducts } from '../../api/product';

export const ProductListPage = () => {
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState('');

    useEffect(() => {
        getCategories().then(data => {
            setCategories(data);
            const catId = searchParams.get('categoryId');
            if (catId) {
                setSelectedCategoryId(catId);
            } else if (data.length > 0) {
                setSelectedCategoryId(data[0].id);
            }
        }).catch(console.error);
    }, [searchParams]);

    useEffect(() => {
        if (!selectedCategoryId) return;
        getProducts(selectedCategoryId)
            .then(res => setProducts(res.data.data || []))
            .catch(err => console.error(err));
    }, [selectedCategoryId]);

    return (
        <div className="min-h-screen bg-[#FAF9F6] text-[#16211C]">
            <Header />
            <main className="max-w-7xl mx-auto px-6 py-16">
                {categories.length > 0 && (
                    <div className="flex gap-3 overflow-x-auto pb-4 mb-8">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategoryId(cat.id)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                    selectedCategoryId === cat.id
                                        ? 'bg-[#1F5D4E] text-white'
                                        : 'bg-white border border-[#DAD5C8] text-[#16211C] hover:border-[#1F5D4E]'
                                }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                )}
                {/* Products */}
                <section className="flex-1">
                    <h2 className="text-3xl font-semibold mb-8">Products</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
                        {products.map((p) => (
                            <div key={p.id} className="group cursor-pointer">
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
