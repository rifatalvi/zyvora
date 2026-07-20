'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Item } from '@/types';
import Link from 'next/link';
import {
  Receipt, CheckCircle2, CreditCard, Calendar, Hash,
  Home, ChevronRight, BookOpen, Clock, ExternalLink,
  DollarSign, TrendingUp,
} from 'lucide-react';

interface Booking {
  _id: string;
  itemId: Item;
  amount: number;
  stripeSessionId: string;
  status: string;
  createdAt: string;
}

interface MyBookingsResponse {
  success: boolean;
  bookings: Booking[];
}

export default function TransactionsPage() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const { data, isLoading, isError } = useQuery<MyBookingsResponse>({
    queryKey: ['my-bookings'],
    queryFn: async () => {
      const res = await api.get(`${process.env.NEXT_PUBLIC_API_URL}/bookings/my-bookings`);
      return res.data;
    },
    enabled: isAuthenticated,
  });

  if (isAuthLoading || (isAuthenticated && isLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <Receipt size={64} className="text-primary-900/50 mb-6" />
        <h2 className="text-3xl font-bold mb-4">Please log in</h2>
        <p className="text-muted mb-8">You need to be logged in to view your transaction history.</p>
        <Link href="/login" className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-3 rounded-xl font-bold transition-colors">
          Log In
        </Link>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 text-red-400">
        <h2 className="text-2xl font-bold mb-2">Error Loading Transactions</h2>
        <p>Failed to fetch your transaction history. Please try again later.</p>
      </div>
    );
  }

  const bookings = data?.bookings || [];
  const totalSpent = bookings.reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="min-h-screen pb-20">
      {/* ── Breadcrumb ─────────────────────────────────────────── */}
      <div className="bg-surface-2 border-b border-primary-900/20 pt-24 pb-6">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
            <Link href="/" className="hover:text-white flex items-center gap-1 transition-colors">
              <Home size={12} /> Home
            </Link>
            <ChevronRight size={12} className="text-primary-900/50" />
            <Link href="/my-bookings" className="hover:text-white transition-colors">My Bookings</Link>
            <ChevronRight size={12} className="text-primary-900/50" />
            <span className="text-primary-400">Transactions</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center">
              <Receipt size={28} className="text-accent-400" />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold text-white">Transaction History</h1>
              <p className="text-muted mt-1">View all your payment records and enrollment receipts.</p>
            </div>
          </div>
        </div>

        {/* ── Stats Cards ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-surface border border-primary-900/20 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <DollarSign size={22} className="text-green-400" />
            </div>
            <div>
              <p className="text-xs text-muted uppercase tracking-wider font-semibold">Total Spent</p>
              <p className="text-2xl font-extrabold text-white">${totalSpent.toFixed(2)}</p>
            </div>
          </div>
          <div className="bg-surface border border-primary-900/20 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
              <BookOpen size={22} className="text-primary-400" />
            </div>
            <div>
              <p className="text-xs text-muted uppercase tracking-wider font-semibold">Courses Purchased</p>
              <p className="text-2xl font-extrabold text-white">{bookings.length}</p>
            </div>
          </div>
          <div className="bg-surface border border-primary-900/20 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center">
              <TrendingUp size={22} className="text-accent-400" />
            </div>
            <div>
              <p className="text-xs text-muted uppercase tracking-wider font-semibold">Avg. per Course</p>
              <p className="text-2xl font-extrabold text-white">
                ${bookings.length > 0 ? (totalSpent / bookings.length).toFixed(2) : '0.00'}
              </p>
            </div>
          </div>
        </div>

        {/* ── Transaction Table ───────────────────────────────────── */}
        {bookings.length === 0 ? (
          <div className="bg-surface border border-primary-900/20 rounded-3xl p-16 text-center">
            <Receipt size={64} className="mx-auto text-primary-900/50 mb-6" />
            <h3 className="text-2xl font-bold text-white mb-2">No Transactions Yet</h3>
            <p className="text-muted mb-8 max-w-md mx-auto">
              You haven't made any purchases yet. Explore our catalog and enroll in a course!
            </p>
            <Link href="/explore" className="inline-flex bg-white text-black hover:bg-gray-200 px-8 py-3 rounded-xl font-bold transition-colors">
              Explore Courses
            </Link>
          </div>
        ) : (
          <div className="bg-surface border border-primary-900/20 rounded-2xl overflow-hidden">
            {/* Desktop Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-primary-900/20 bg-surface-2 text-xs font-semibold uppercase tracking-wider text-muted">
              <div className="col-span-4">Course</div>
              <div className="col-span-2">Amount</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-2">Details</div>
            </div>

            {/* Transaction Rows */}
            {bookings.map((booking, i) => (
              <div
                key={booking._id}
                className={`grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-surface-2/50 transition-colors ${i < bookings.length - 1 ? 'border-b border-primary-900/10' : ''
                  }`}
              >
                {/* Course */}
                <div className="col-span-4 flex items-center gap-3">
                  <img
                    src={booking.itemId.thumbnail}
                    alt={booking.itemId.title}
                    className="w-14 h-10 rounded-lg object-cover shrink-0 border border-primary-900/20"
                  />
                  <div className="min-w-0">
                    <Link
                      href={`/items/${booking.itemId._id}`}
                      className="font-semibold text-white hover:text-primary-400 transition-colors line-clamp-1 text-sm"
                    >
                      {booking.itemId.title}
                    </Link>
                    <p className="text-xs text-muted">{booking.itemId.category}</p>
                  </div>
                </div>

                {/* Amount */}
                <div className="col-span-2 flex items-center gap-2">
                  <CreditCard size={14} className="text-primary-400 hidden md:block" />
                  <span className="font-bold text-white">${booking.amount.toFixed(2)}</span>
                </div>

                {/* Status */}
                <div className="col-span-2">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${booking.status === 'completed'
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                      : booking.status === 'pending'
                        ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                    <CheckCircle2 size={12} />
                    {booking.status}
                  </span>
                </div>

                {/* Date */}
                <div className="col-span-2 flex items-center gap-2 text-sm text-muted">
                  <Calendar size={14} className="text-secondary-400 hidden md:block" />
                  {new Date(booking.createdAt).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric',
                  })}
                </div>

                {/* Details */}
                <div className="col-span-2">
                  <button
                    onClick={() => {
                      const el = document.getElementById(`detail-${booking._id}`);
                      if (el) el.classList.toggle('hidden');
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-400 hover:text-primary-300 transition-colors"
                  >
                    <ExternalLink size={12} /> View Details
                  </button>
                </div>

                {/* Expandable Detail Row */}
                <div
                  id={`detail-${booking._id}`}
                  className="hidden col-span-12 bg-surface-2/50 border border-primary-900/10 rounded-xl p-4 mt-2"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-muted mb-1 flex items-center gap-1">
                        <Hash size={12} /> Booking ID
                      </p>
                      <p className="font-mono text-xs text-white break-all">{booking._id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted mb-1 flex items-center gap-1">
                        <Hash size={12} /> Stripe Session ID
                      </p>
                      <p className="font-mono text-xs text-white break-all">{booking.stripeSessionId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted mb-1 flex items-center gap-1">
                        <Clock size={12} /> Full Date &amp; Time
                      </p>
                      <p className="text-white">
                        {new Date(booking.createdAt).toLocaleString('en-US', {
                          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted mb-1 flex items-center gap-1">
                        <BookOpen size={12} /> Course Details
                      </p>
                      <p className="text-white">{booking.itemId.difficulty} · {booking.itemId.duration}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
