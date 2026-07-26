import React from 'react';

const AdminDashboard = () => (
    <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 shadow rounded">Users</div>
            <div className="bg-white p-4 shadow rounded">Products</div>
            <div className="bg-white p-4 shadow rounded">Analytics</div>
        </div>
    </div>
);

export default AdminDashboard;