import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const UserProfileSidebar = () => {
    const location = useLocation();
    const links = [
        { name: 'Profile', path: '/user/profile' },
        { name: 'Orders', path: '/user/orders' },
        { name: 'Wishlist', path: '/user/wishlist' },
        { name: 'Address', path: '/user/address' },
        { name: 'Reviews', path: '/user/reviews' },
    ];

    return (
        <aside className="w-64 bg-white border border-gray-200 rounded-lg shadow-sm p-4">
            <h2 className="font-semibold text-gray-700 mb-4">Account</h2>
            <nav className="flex flex-col gap-2">
                {links.map((link) => (
                    <Link
                        key={link.path}
                        to={link.path}
                        className={`px-4 py-2 rounded-md text-sm ${location.pathname === link.path
                                ? 'bg-orange-50 text-orange-600 font-medium'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        {link.name}
                    </Link>
                ))}
            </nav>
        </aside>
    );
};

export default UserProfileSidebar;