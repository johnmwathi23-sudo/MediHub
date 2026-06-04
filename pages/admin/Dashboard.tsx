import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { AnalyticsData, OrderStatus } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { DollarSign, ShoppingBag, Users, AlertTriangle } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const Dashboard: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await api.analytics.getDashboardData();
      setData(result);
    };
    fetchData();
  }, []);

  if (!data) return <div className="p-8">Loading Analytics...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5 flex items-center">
            <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                <dd className="text-lg font-medium text-gray-900">KES {data.totalSales.toLocaleString()}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5 flex items-center">
            <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                <dd className="text-lg font-medium text-gray-900">{data.totalOrders}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5 flex items-center">
            <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Customers</dt>
                <dd className="text-lg font-medium text-gray-900">{data.totalCustomers}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5 flex items-center">
            <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Low Stock Items</dt>
                <dd className="text-lg font-medium text-gray-900">{data.lowStockCount}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
         <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Overview</h3>
            <div className="h-64">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#0ea5e9" />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Sales by Category</h3>
            <div className="h-64">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {data.categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Orders</h3>
        </div>
        <ul className="divide-y divide-gray-200">
           {data.recentOrders.length === 0 ? (
               <li className="p-4 text-gray-500 text-center">No orders yet.</li>
           ) : (
             data.recentOrders.map((order) => (
                 <li key={order.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                    <div>
                        <p className="text-sm font-medium text-medical-600">{order.id}</p>
                        <p className="text-sm text-gray-500">{order.customerName}</p>
                    </div>
                    <div className="text-right">
                         <p className="text-sm font-bold">KES {order.total.toLocaleString()}</p>
                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                             order.status === OrderStatus.DELIVERED ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                         }`}>
                             {order.status}
                         </span>
                    </div>
                 </li>
             ))
           )}
        </ul>
      </div>
    </div>
  );
};