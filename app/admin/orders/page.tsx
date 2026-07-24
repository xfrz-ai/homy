"use client"

import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';

interface Order {
  id: number;
  status: string;
  total_price: number;
  shipping_name: string;
  created_at: string;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setOrders(data as Order[]);
    }
    setLoading(false);
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price).replace(/\s/g, '');
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case 'paid':
      case 'success':
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>Paid</span>;
      case 'pending':
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Pending</span>;
      default:
        return <span className={`${baseClasses} bg-slate-100 text-slate-800`}>{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight text-slate-900 leading-none mb-2">Orders Management</h1>
          <p className="text-sm text-slate-500">Manage and track customer orders</p>
        </div>
      </div>

      <div className="rounded-[2rem] bg-white p-6 md:p-8 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-slate-900">All Orders List</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500">
                <th className="pb-4 font-medium px-4">ID</th>
                <th className="pb-4 font-medium px-4">Customer</th>
                <th className="pb-4 font-medium px-4">Date</th>
                <th className="pb-4 font-medium px-4">Total</th>
                <th className="pb-4 font-medium px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-500">Loading orders...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-500">No orders found.</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-b border-slate-50/80 hover:bg-slate-50/50 transition-colors group">
                    <td className="py-4 px-4 font-semibold text-slate-900">#{order.id}</td>
                    <td className="py-4 px-4 font-medium text-slate-700">{order.shipping_name}</td>
                    <td className="py-4 px-4 font-medium text-slate-700">{formatDate(order.created_at)}</td>
                    <td className="py-4 px-4 font-medium text-slate-700">{formatPrice(order.total_price)}</td>
                    <td className="py-4 px-4">
                      {getStatusBadge(order.status)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
