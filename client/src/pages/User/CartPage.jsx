import React from 'react';

const CartPage = () => {
    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Cart</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="bg-white p-4 shadow rounded">
                        <h2 className="font-semibold mb-4">Items</h2>
                        {/* Cart items list here */}
                        <p>Cart is empty.</p>
                    </div>
                </div>
                <div className="bg-white p-4 shadow rounded h-fit">
                    <h2 className="font-semibold mb-4">Summary</h2>
                    <div className="space-y-2 mb-4">
                        <div className="flex justify-between"><span>Subtotal</span><span>$0.00</span></div>
                        <div className="flex justify-between font-bold"><span>Total</span><span>$0.00</span></div>
                    </div>
                    <div className="mb-4">
                        <input type="text" placeholder="Coupon code" className="border p-2 w-full mb-2" />
                        <button className="bg-gray-800 text-white w-full py-2">Apply Coupon</button>
                    </div>
                    <button className="bg-blue-600 text-white w-full py-2 font-bold">Checkout</button>
                </div>
            </div>
        </div>
    );
};

export default CartPage;