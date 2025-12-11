import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export const Checkout: React.FC = () => {
    const { items, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.orders.create({
                userId: 'guest',
                customerName: 'Guest User',
                items: items,
                total: cartTotal
            });
            clearCart();
            alert("Order placed successfully! In a real app, you would receive an email.");
            navigate('/');
        } catch(e) {
            alert("Failed to place order.");
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) return <div className="p-8 text-center">Your cart is empty.</div>;

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>
            <div className="bg-white p-6 rounded-lg shadow border">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <h2 className="text-xl font-medium mb-4">Shipping Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" placeholder="Full Name" required className="border p-2 rounded w-full" />
                            <input type="email" placeholder="Email Address" required className="border p-2 rounded w-full" />
                            <input type="text" placeholder="Phone Number" required className="border p-2 rounded w-full" />
                            <input type="text" placeholder="City / Town" required className="border p-2 rounded w-full" />
                            <input type="text" placeholder="Delivery Address" required className="md:col-span-2 border p-2 rounded w-full" />
                        </div>
                    </div>
                    
                    <div className="border-t pt-6">
                        <div className="flex justify-between text-lg font-bold mb-4">
                            <span>Total</span>
                            <span>KES {cartTotal.toLocaleString()}</span>
                        </div>
                        <Button type="submit" size="lg" className="w-full" isLoading={loading}>
                            Confirm Order
                        </Button>
                        <p className="text-xs text-gray-500 mt-2 text-center">Payment is Cash on Delivery or M-Pesa upon delivery.</p>
                    </div>
                </form>
            </div>
        </div>
    );
};