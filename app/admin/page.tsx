"use client"

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Package, ShoppingCart, Users, DollarSign, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Fetch products count
        const { count: productsCount } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });

        // Fetch orders count & total revenue
        const { data: orders } = await supabase
          .from('orders')
          .select('total_price')
          .eq('status', 'paid');
          
        const revenue = orders?.reduce((acc, order) => acc + (order.total_price || 0), 0) || 0;
        
        // Fetch users count
        const { count: usersCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        setStats({
          products: productsCount || 0,
          orders: orders?.length || 0,
          users: usersCount || 0,
          revenue
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price).replace(/\s/g, '');
  };

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight text-slate-900 leading-none mb-2">Dashboard Overview</h1>
          <p className="text-sm text-slate-500">Track your store performance and achieve your financial goals</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center px-4 py-2.5 bg-white border border-slate-200 rounded-full text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            Export
          </button>
          <button className="flex items-center px-4 py-2.5 bg-slate-900 rounded-full text-sm font-medium text-white shadow-sm hover:bg-slate-800 transition-colors">
            <Plus className="mr-2 h-4 w-4" />
            New Report
          </button>
        </div>
      </div>
      
      {/* Metrics Unified Container */}
      <div className="bg-white rounded-[2rem] p-8 shadow-sm flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-100">
        
        {/* Metric 1 */}
        <div className="flex-1 p-4 md:px-6 flex flex-col justify-center">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center mr-4">
              <DollarSign className="h-5 w-5 text-pink-600" />
            </div>
            <span className="text-[15px] font-medium text-slate-700">Total Revenue</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-3xl font-bold text-slate-900">{formatPrice(stats.revenue)}</span>
            <span className="text-sm font-medium text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center">
              +12.5% <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
            </span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="flex-1 p-4 md:px-6 flex flex-col justify-center">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-4">
              <ShoppingCart className="h-5 w-5 text-purple-600" />
            </div>
            <span className="text-[15px] font-medium text-slate-700">Total Orders</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-3xl font-bold text-slate-900">{stats.orders}</span>
            <span className="text-sm font-medium text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center">
              +5.2% <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
            </span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="flex-1 p-4 md:px-6 flex flex-col justify-center">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-4">
              <Package className="h-5 w-5 text-yellow-600" />
            </div>
            <span className="text-[15px] font-medium text-slate-700">Active Products</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-3xl font-bold text-slate-900">{stats.products}</span>
            <span className="text-sm font-medium text-red-500 bg-red-50 px-2 py-0.5 rounded-full flex items-center">
              -1.2% <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
            </span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="flex-1 p-4 md:px-6 flex flex-col justify-center">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-[15px] font-medium text-slate-700">Total Users</span>
          </div>
          <div className="flex items-baseline gap-4">
            <span className="text-3xl font-bold text-slate-900">{stats.users}</span>
            <span className="text-sm font-medium text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center">
              +18.4% <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
