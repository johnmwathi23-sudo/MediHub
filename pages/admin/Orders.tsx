import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Order, OrderStatus } from '../../types';

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const load = async () => {
        const data = await api.orders.getAll();
        setOrders(data);
    };
    load();
  }, []);

  const handleStatusChange = async (id: string, status: OrderStatus) => {
      await api.orders.updateStatus(id, status);
      const data = await api.orders.getAll();
      setOrders(data);
  };

  return (
    <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Order Management</h1>
        <div className="bg-white shadow overflow-hidden rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                        <tr key={order.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customerName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">KES {order.total.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                    ${order.status === OrderStatus.DELIVERED ? 'bg-green-100 text-green-800' : 
                                      order.status === OrderStatus.PENDING ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {order.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <select 
                                    value={order.status}
                                    onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                                    className="border rounded text-xs p-1"
                                >
                                    {Object.values(OrderStatus).map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </td>
                        </tr>
                    ))}
                    {orders.length === 0 && (
                        <tr>
                            <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">No orders found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
  );
};