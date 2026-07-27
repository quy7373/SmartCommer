import React from 'react';
import { Heart, Eye, ShoppingCart } from 'lucide-react';

export const ProductCard = ({ product, price, discount, sold, rating }) => {
    return (
        <div className="group bg-white p-4 rounded-[12px] shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="relative aspect-square rounded-[8px] overflow-hidden mb-3">
                <img src={product.thumbnail} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                {discount && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] px-2 py-1 rounded-full font-bold">
                        -{discount}%
                    </span>
                )}
                <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50"><Heart size={16} /></button>
                    <button className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50"><Eye size={16} /></button>
                </div>
            </div>
            <h3 className="text-[15px] font-medium text-[#16211C] truncate">{product.name}</h3>
            <div className="flex items-center gap-1 mt-1">
                <span className="text-yellow-400 text-[12px]">★</span>
                <span className="text-[12px] text-gray-500">{rating}</span>
                <span className="text-[12px] text-gray-400 ml-auto">{sold} sold</span>
            </div>
            <div className="flex items-center justify-between mt-3">
                <span className="text-[16px] font-bold text-red-600">${price}</span>
                <button className="p-2 bg-[#16211C] text-white rounded-full hover:bg-[#2D3A34] transition-colors">
                    <ShoppingCart size={16} />
                </button>
            </div>
        </div>
    );
};