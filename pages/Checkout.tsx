import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export const Checkout: React.FC = () => {
    const { items, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'cod' | 'mpesa'>('mpesa');
    const [mpesaPhone, setMpesaPhone] = useState('');

    const handleMpesaPayment = async () => {
        // TILL NUMBER PLACEHOLDER
        // const TILL_NUMBER = process.env.VITE_MPESA_TILL_NUMBER || '123456';

        try {
            // Simulated Daraja STK Push API call
            console.log(`Initiating Daraja STK Push to ${mpesaPhone} for KES ${cartTotal}`);
            // await api.payments.darajaStkPush({ phone: mpesaPhone, amount: cartTotal, tillNumber: TILL_NUMBER });
            return true;
        } catch (error) {
            console.error("M-Pesa payment failed", error);
            return false;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (paymentMethod === 'mpesa') {
                const mpesaSuccess = await handleMpesaPayment();
                if (!mpesaSuccess) {
                    alert("M-Pesa payment failed. Please try again or use Cash on Delivery.");
                    setLoading(false);
                    return;
                }
                alert("Please check your phone to complete the M-Pesa payment.");
                // Usually we'd poll for payment success here before creating the order,
                // but for demo purposes, we proceed to create the order.
            }

            await api.orders.create({
                userId: 'guest',
                customerName: 'Guest User',
                items: items,
                total: cartTotal,
                paymentMethod: paymentMethod
            });
            clearCart();
            alert("Order placed successfully! In a real app, you would receive an email.");
            navigate('/');
        } catch (e) {
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

                    <div className="border-t pt-6 mt-6">
                        <h2 className="text-xl font-medium mb-4">Payment Method</h2>
                        <div className="space-y-3 mb-6">
                            <label className="flex items-center space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
                                <input
                                    type="radio"
                                    name="payment_method"
                                    value="mpesa"
                                    checked={paymentMethod === 'mpesa'}
                                    onChange={() => setPaymentMethod('mpesa')}
                                    className="h-4 w-4 text-medical-600 focus:ring-medical-500"
                                />
                                <div className="flex-1 flex justify-between">
                                    <span className="font-medium text-gray-900">Lipa na M-Pesa</span>
                                    {paymentMethod === 'mpesa' && (
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/1/15/M-PESA_LOGO-01.svg" alt="M-Pesa" className="h-6" />
                                    )}
                                </div>
                            </label>

                            {paymentMethod === 'mpesa' && (
                                <div className="pl-8 pb-4 animate-fade-in">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">M-Pesa Phone Number (e.g., 0712345678 or 2547...)</label>
                                    <input
                                        type="text"
                                        placeholder="07XX XXX XXX or 2547XX XXX XXX"
                                        required={paymentMethod === 'mpesa'}
                                        value={mpesaPhone}
                                        onChange={(e) => setMpesaPhone(e.target.value)}
                                        className="border p-2 rounded w-full focus:outline-none focus:ring-1 focus:ring-medical-500 border-gray-300"
                                    />
                                    <p className="text-xs text-gray-500 mt-2">Ready for adding till number in code. STK push will be sent to this number.</p>
                                </div>
                            )}

                            <label className="flex items-center space-x-3 cursor-pointer p-3 border rounded-lg hover:bg-gray-50">
                                <input
                                    type="radio"
                                    name="payment_method"
                                    value="cod"
                                    checked={paymentMethod === 'cod'}
                                    onChange={() => setPaymentMethod('cod')}
                                    className="h-4 w-4 text-medical-600 focus:ring-medical-500"
                                />
                                <span className="font-medium text-gray-900">Cash on Delivery</span>
                            </label>
                        </div>

                        <div className="flex justify-between text-lg font-bold mb-4 bg-gray-50 p-4 rounded-lg">
                            <span>Total Amount</span>
                            <span className="text-medical-600">KES {cartTotal.toLocaleString()}</span>
                        </div>
                        <Button type="submit" size="lg" className="w-full h-14 text-lg" isLoading={loading}>
                            {paymentMethod === 'mpesa' ? 'Pay with M-Pesa & Order' : 'Confirm Order'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};