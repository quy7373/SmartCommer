import React, { useState, useEffect } from 'react';
import { getCategories } from '../../api/categories';

const Sidebar = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (err) {
                console.error('Error fetching categories:', err);
            }
        };
        fetchCategories();
    }, []);

    const renderCategory = (category) => (
        <div key={category.id} className="mb-2">
            <div className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 cursor-pointer">
                <span className="flex items-center gap-3">
                    <span>{category.icon || '○'}</span> {category.name}
                </span>
                {category.children?.length > 0 && <span>›</span>}
            </div>
            {category.children?.length > 0 && (
                <div className="pl-8">
                    {category.children.map(child => (
                        <a key={child.id} href={`/category/${child.id}`} className="block py-1 text-xs text-gray-500 hover:text-orange-600">
                            {child.name}
                        </a>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <aside className="w-64 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-3 border-b border-gray-100 font-semibold text-gray-700 flex items-center gap-2">
                <span>☰</span> Danh mục sản phẩm
            </div>
            <nav className="py-2">
                {categories.map(renderCategory)}
            </nav>
        </aside>
    );
};

export default Sidebar;