import React from 'react';

const OwnerDashboard = () => (
    <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Owner Dashboard</h1>
        <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 shadow rounded">Orders</div>
            <div className="bg-white p-4 shadow rounded">Products</div>
            <div className="bg-white p-4 shadow rounded">Analytics</div>
        </div>
    </div>
);

export default OwnerDashboard;