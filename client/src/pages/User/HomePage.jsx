import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFlashSales, getBestSellerProducts, getNewestProducts, getRecommendedProducts } from "../../api/product";
import { getCategories } from "../../api/categories";
import { Header } from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { ProductCard } from "../../components/common/ProductCard";
import * as LucideIcons from 'lucide-react';

export const HomePage = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('accessToken');
    const [flashSales, setFlashSales] = useState([]);
    const [bestSellers, setBestSellers] = useState([]);
    const [newest, setNewest] = useState([]);
    const [recommended, setRecommended] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        getCategories().then(setCategories).catch(console.error);
        getFlashSales()
            .then(res => setFlashSales(res.data))
            .catch(err => console.error(err));
        getBestSellerProducts()
            .then(res => setBestSellers(res.data.data))
            .catch(err => console.error(err));
        getNewestProducts()
            .then(res => setNewest(res.data.data))
            .catch(err => console.error(err));
        getRecommendedProducts(token)
            .then(res => setRecommended(res.data.data))
            .catch(err => console.error(err));
    }, [token]);

    return (
        <div className="min-h-screen bg-[#FAF9F6] text-[#16211C]">
            <Header />
            <main className="max-w-7xl mx-auto px-6 py-16">
                <section className="mb-20 h-96 bg-gray-200 rounded-2xl flex items-center justify-center">
                    <h1 className="text-4xl font-bold">Hero Banner</h1>
                </section>

                <section className="mb-20">
                    <h2 className="text-3xl font-semibold mb-8">Categories</h2>
                    <div className="flex gap-4 overflow-x-auto pb-1">
                        {categories.map((cat) => {
                            const Icon = LucideIcons[cat.icon] || LucideIcons.Tag;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => navigate(`/products?categoryId=${cat.id}`)}
                                    className="flex items-center gap-2.5 whitespace-nowrap px-5 py-3 rounded-full border border-[#DAD5C8] bg-white hover:border-[#1F5D4E] transition-colors text-[14px] font-medium"
                                >
                                    <Icon size={16} />
                                    {cat.name}
                                </button>
                            );
                        })}
                    </div>
                </section>

                <section className="mb-20">
                    <h2 className="text-3xl font-semibold mb-8">Flash Sale</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                        {flashSales.flatMap(fs => fs.products).map((item) => (
                            <ProductCard
                                key={item.id}
                                product={item.product}
                                price={item.price}
                                discount={20}
                                sold={120}
                                rating={4.8}
                            />
                        ))}
                    </div>
                </section>

                <section className="mb-20">
                    <h2 className="text-3xl font-semibold mb-8">Best Seller</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                        {bestSellers.map((item) => (
                            <ProductCard
                                key={item.id}
                                product={item}
                                price={item.basePrice}
                                sold={item.sold}
                                rating={item.rating}
                            />
                        ))}
                    </div>
                </section>

                <section className="mb-20">
                    <h2 className="text-3xl font-semibold mb-8">Newest</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                        {newest.map((item) => (
                            <ProductCard
                                key={item.id}
                                product={item}
                                price={item.basePrice}
                                sold={item.sold}
                                rating={item.rating}
                            />
                        ))}
                    </div>
                </section>

                {recommended.length > 0 && (
                    <section className="mb-20">
                        <div className="flex items-end justify-between mb-8">
                            <h2 className="text-3xl font-semibold">Recommended for you</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                            {recommended.map((item) => (
                                <ProductCard
                                    key={item.id}
                                    product={item}
                                    price={item.basePrice}
                                    sold={item.sold}
                                    rating={item.rating}
                                />
                            ))}
                        </div>
                    </section>
                )}

                <section className="mb-20 h-40 bg-gray-100 rounded-2xl flex items-center justify-center">
                    <h2 className="text-2xl font-semibold">Advertisement</h2>
                </section>
            </main>
            <Footer />
        </div>
    );
};