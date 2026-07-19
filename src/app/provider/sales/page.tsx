'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import {
  TrendingUp, Users, DollarSign, BookOpen, Calendar,
  CreditCard, Search, ChevronRight, Home, ExternalLink
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

interface Buyer {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface ProviderSale {
  _id: string;
  amount: number;
  stripeSessionId: string;
  status: string;
  createdAt: string;
  itemId: {
    _id: string;
    title: string;
    thumbnail: string;
    category: string;
    price: number;
  };
  buyer: Buyer;
}

interface ProviderSalesResponse {
  success: boolean;
  sales: ProviderSale[];
}

export default function ProviderSalesPage() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading, isError } = useQuery<ProviderSalesResponse>({
    queryKey: ['provider-sales'],
    queryFn: async () => {
      const res = await api.get('/bookings/provider-sales');
      return res.data;
    },
    enabled: isAuthenticated && user?.role === 'provider',
  });

  if (isAuthLoading || (isAuthenticated && isLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'provider') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <TrendingUp size={64} className="text-primary-900/50 mb-6" />
        <h2 className="text-3xl font-bold mb-4">Access Denied</h2>
        <p className="text-muted mb-8">You need to be logged in as a provider to view sales history.</p>
        <Link href="/" className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-3 rounded-xl font-bold transition-colors">
          Return Home
        </Link>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 text-red-400">
        <h2 className="text-2xl font-bold mb-2">Error Loading Sales</h2>
        <p>Failed to fetch your sales history. Please try again later.</p>
      </div>
    );
  }

  const sales = data?.sales || [];
  
  // Filtering
  const filteredSales = sales.filter((sale) => 
    sale.buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.buyer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.itemId.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = sales.reduce((sum, s) => sum + s.amount, 0);
  const uniqueBuyers = new Set(sales.map(s => s.buyer._id)).size;

  // Process data for the chart (Group by Date)
  const chartDataMap: Record<string, number> = {};
  sales.forEach((s) => {
    const date = new Date(s.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    chartDataMap[date] = (chartDataMap[date] || 0) + s.amount;
  });

  const chartData = Object.keys(chartDataMap).map(date => ({
    date,
    revenue: chartDataMap[date]
  })).reverse(); // Assuming original is sorted newest first, we reverse for chronological order

  return (
    <div className="min-h-screen pb-20">
      {/* ── Breadcrumb ─────────────────────────────────────────── */}
      <div className="bg-surface-2 border-b border-primary-900/20 pt-24 pb-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
            <Link href="/" className="hover:text-white flex items-center gap-1 transition-colors">
              <Home size={12} /> Home
            </Link>
            <ChevronRight size={12} className="text-primary-900/50" />
            <Link href="/manage-items" className="hover:text-white transition-colors">Provider Dashboard</Link>
            <ChevronRight size={12} className="text-primary-900/50" />
            <span className="text-primary-400">Sales History</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <TrendingUp size={28} className="text-green-400" />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold text-white">Sales History</h1>
              <p className="text-muted mt-1">Track your course enrollments and revenue.</p>
            </div>
          </div>
        </div>

        {/* ── Stats Cards ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-surface border border-primary-900/20 rounded-2xl p-6 flex items-center gap-5">
            <div className="w-14 h-14 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <DollarSign size={24} className="text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted font-medium mb-1">Total Revenue</p>
              <p className="text-3xl font-extrabold text-white">${totalRevenue.toFixed(2)}</p>
            </div>
          </div>
          <div className="bg-surface border border-primary-900/20 rounded-2xl p-6 flex items-center gap-5">
            <div className="w-14 h-14 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
              <BookOpen size={24} className="text-primary-400" />
            </div>
            <div>
              <p className="text-sm text-muted font-medium mb-1">Total Sales</p>
              <p className="text-3xl font-extrabold text-white">{sales.length}</p>
            </div>
          </div>
          <div className="bg-surface border border-primary-900/20 rounded-2xl p-6 flex items-center gap-5">
            <div className="w-14 h-14 rounded-xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center">
              <Users size={24} className="text-accent-400" />
            </div>
            <div>
              <p className="text-sm text-muted font-medium mb-1">Unique Buyers</p>
              <p className="text-3xl font-extrabold text-white">{uniqueBuyers}</p>
            </div>
          </div>
        </div>

        {/* ── Revenue Chart ──────────────────────────────────────── */}
        {sales.length > 0 && (
          <div className="bg-surface border border-primary-900/20 rounded-2xl p-6 mb-10">
            <h2 className="text-xl font-bold text-white mb-6">Revenue Over Time</h2>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#ffffff50" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    dy={10}
                  />
                  <YAxis 
                    stroke="#ffffff50" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                    dx={-10}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111318', borderColor: '#ffffff20', borderRadius: '12px', color: '#fff' }}
                    itemStyle={{ color: '#22c55e', fontWeight: 'bold' }}
                    formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'Revenue']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#22c55e" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ── Search Bar ─────────────────────────────────────────── */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search by buyer name, email, or course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface border border-primary-900/30 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-muted focus:outline-none focus:border-primary-500 transition-colors"
            />
          </div>
        </div>

        {/* ── Sales Table ────────────────────────────────────────── */}
        {sales.length === 0 ? (
          <div className="bg-surface border border-primary-900/20 rounded-3xl p-16 text-center">
            <TrendingUp size={64} className="mx-auto text-primary-900/50 mb-6" />
            <h3 className="text-2xl font-bold text-white mb-2">No Sales Yet</h3>
            <p className="text-muted mb-8 max-w-md mx-auto">
              You haven't made any sales yet. Keep promoting your courses!
            </p>
          </div>
        ) : filteredSales.length === 0 ? (
          <div className="bg-surface border border-primary-900/20 rounded-3xl p-16 text-center">
            <p className="text-muted">No sales match your search query.</p>
          </div>
        ) : (
          <div className="bg-surface border border-primary-900/20 rounded-2xl overflow-hidden">
            {/* Desktop Table Header */}
            <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-4 border-b border-primary-900/20 bg-surface-2 text-xs font-semibold uppercase tracking-wider text-muted">
              <div className="col-span-4">Buyer</div>
              <div className="col-span-3">Course</div>
              <div className="col-span-2">Amount</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-1 text-right">Action</div>
            </div>

            {/* Sales Rows */}
            <div className="divide-y divide-primary-900/10">
              {filteredSales.map((sale) => (
                <div key={sale._id} className="grid grid-cols-1 lg:grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-surface-2/30 transition-colors">
                  
                  {/* Buyer */}
                  <div className="col-span-4 flex items-center gap-4">
                    {sale.buyer.avatar ? (
                      <img src={sale.buyer.avatar} alt={sale.buyer.name} className="w-10 h-10 rounded-full object-cover border border-primary-900/30" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary-900/30 border border-primary-500/20 flex items-center justify-center text-primary-400 font-bold text-sm shrink-0">
                        {sale.buyer.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold text-white truncate">{sale.buyer.name}</p>
                      <p className="text-xs text-muted truncate">{sale.buyer.email}</p>
                    </div>
                  </div>

                  {/* Course */}
                  <div className="col-span-3 flex items-center gap-3 mt-3 lg:mt-0">
                    <img src={sale.itemId.thumbnail} alt={sale.itemId.title} className="w-12 h-8 rounded border border-primary-900/20 object-cover hidden sm:block" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">{sale.itemId.title}</p>
                      <p className="text-xs text-muted truncate">{sale.itemId.category}</p>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="col-span-2 flex items-center gap-2 mt-2 lg:mt-0">
                    <span className="text-sm font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded">
                      +${sale.amount.toFixed(2)}
                    </span>
                  </div>

                  {/* Date */}
                  <div className="col-span-2 flex items-center gap-2 mt-2 lg:mt-0 text-sm text-muted">
                    <Calendar size={14} className="hidden lg:block text-secondary-400" />
                    {new Date(sale.createdAt).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric',
                    })}
                  </div>

                  {/* Action */}
                  <div className="col-span-1 flex justify-start lg:justify-end mt-3 lg:mt-0">
                    <button
                      onClick={() => {
                        const el = document.getElementById(`sale-detail-${sale._id}`);
                        if (el) el.classList.toggle('hidden');
                      }}
                      className="text-xs font-semibold text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1"
                    >
                      <ExternalLink size={14} /> Details
                    </button>
                  </div>

                  {/* Expandable Details */}
                  <div
                    id={`sale-detail-${sale._id}`}
                    className="hidden col-span-1 lg:col-span-12 bg-surface-2/50 border border-primary-900/10 rounded-xl p-5 mt-2"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
                      <div>
                        <p className="text-xs text-muted font-medium mb-1">Transaction ID</p>
                        <p className="font-mono text-xs text-white opacity-80 break-all">{sale._id}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted font-medium mb-1">Stripe Session</p>
                        <p className="font-mono text-xs text-white opacity-80 break-all">{sale.stripeSessionId}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted font-medium mb-1">Time</p>
                        <p className="text-white">
                          {new Date(sale.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
