import React from 'react';

const CheckoutPage = () => {
    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Checkout</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-4 shadow rounded">
                        <h2 className="font-semibold mb-4">Address</h2>
                        <input type="text" placeholder="Shipping Address" className="border p-2 w-full" />
                    </div>
                    <div className="bg-white p-4 shadow rounded">
                        <h2 className="font-semibold mb-4">Payment</h2>
                        <select className="border p-2 w-full">
                            <option>Credit Card</option>
                            <option>PayPal</option>
                        </select>
                    </div>
                </div>
                <div className="bg-white p-4 shadow rounded h-fit">
                    <h2 className="font-semibold mb-4">Summary</h2>
                    <div className="space-y-2 mb-4">
                        <div className="flex justify-between"><span>Subtotal</span><span>$0.00</span></div>
                        <div className="flex justify-between font-bold"><span>Total</span><span>$0.00</span></div>
                    </div>
                    <button className="bg-green-600 text-white w-full py-2 font-bold">Place Order</button>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;