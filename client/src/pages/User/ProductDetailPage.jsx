import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

export const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        fetch(`/api/products/${id}`)
            .then(res => res.json())
            .then(data => setProduct(data))
            .catch(err => console.error(err));
    }, [id]);

    if (!product) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-[#FAF9F6] text-[#16211C]">
            <Header />
            <main className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid md:grid-cols-2 gap-12">
                    {/* Gallery */}
                    <div className="aspect-square bg-gray-200 rounded-2xl"></div>

                    {/* Information & Buy Box */}
                    <div className="space-y-6">
                        <h1 className="text-4xl font-bold">{product.name}</h1>
                        <p className="text-2xl font-semibold">${product.price}</p>

                        {/* Variant */}
                        <div>
                            <h4 className="font-medium mb-2">Select Variant</h4>
                            <div className="flex gap-2">
                                {['S', 'M', 'L'].map(v => (
                                    <button key={v} className="px-4 py-2 border rounded-md">{v}</button>
                                ))}
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h4 className="font-medium mb-2">Description</h4>
                            <p className="text-gray-600">{product.description}</p>
                        </div>

                        <button className="w-full bg-[#16211C] text-white py-4 rounded-lg font-semibold">Add to Cart</button>
                    </div>
                </div>

                {/* Review & Related */}
                <section className="mt-20">
                    <h3 className="text-2xl font-semibold mb-8">Reviews</h3>
                    <div className="h-40 bg-gray-100 rounded-xl"></div>
                </section>

                <section className="mt-20">
                    <h3 className="text-2xl font-semibold mb-8">Related Products</h3>
                    <div className="grid grid-cols-4 gap-5">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="aspect-[4/5] bg-gray-200 rounded-md"></div>
                        ))}
                    </div>
                </section>
            </main>

            {/* Sticky Buy Box */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 md:hidden">
                <button className="w-full bg-[#16211C] text-white py-3 rounded-lg font-semibold">Add to Cart - ${product.price}</button>
            </div>
            <Footer />
        </div>
    );
};