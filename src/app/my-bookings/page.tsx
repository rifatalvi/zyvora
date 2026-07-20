'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Item } from '@/types';
import ItemCard from '@/components/ItemCard';
import Link from 'next/link';
import { BookOpen, Receipt } from 'lucide-react';

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

export default function MyBookingsPage() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const { data, isLoading, isError } = useQuery<MyBookingsResponse>({
    queryKey: ['my-bookings'],
    queryFn: async () => {
      const res = await api.get(`/bookings/my-bookings`);
      return res.data;
    },
    enabled: isAuthenticated,
  });

  if (isAuthLoading || (isAuthenticated && isLoading)) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-3xl font-bold mb-4">Please log in</h2>
        <p className="text-muted mb-8">You need to be logged in to view your bookings.</p>
        <Link href="/login" className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-3 rounded-xl font-bold">
          Log In
        </Link>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 text-red-400">
        <h2 className="text-2xl font-bold mb-2">Error Loading Bookings</h2>
        <p>Failed to fetch your booking history. Please try again later.</p>
      </div>
    );
  }

  const bookings = data?.bookings || [];

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 min-h-screen">
      <div className="flex items-center gap-4 mb-12">
        <div className="w-14 h-14 rounded-2xl bg-primary-900/30 flex items-center justify-center border border-primary-500/20">
          <BookOpen size={28} className="text-primary-400" />
        </div>
        <div>
          <h1 className="text-4xl font-extrabold text-white">My Bookings</h1>
          <p className="text-muted mt-1">Manage your enrolled courses and view transaction history.</p>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-surface border border-primary-900/20 rounded-3xl p-16 text-center">
          <Receipt size={64} className="mx-auto text-primary-900/50 mb-6" />
          <h3 className="text-2xl font-bold text-white mb-2">No Bookings Yet</h3>
          <p className="text-muted mb-8 max-w-md mx-auto">
            You haven't enrolled in any courses yet. Start exploring our catalog to upskill today!
          </p>
          <Link href="/explore" className="inline-flex bg-white text-black hover:bg-gray-200 px-8 py-3 rounded-xl font-bold transition-colors">
            Explore Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Courses List */}
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-2xl font-bold border-b border-primary-900/20 pb-4">Enrolled Courses</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {bookings.map((booking) => (
                <ItemCard key={booking._id} item={booking.itemId} />
              ))}
            </div>
          </div>

          {/* Transaction History */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold border-b border-primary-900/20 pb-4">Transaction History</h2>
            <div className="bg-surface rounded-2xl border border-primary-900/20 overflow-hidden">
              <ul className="divide-y divide-primary-900/20">
                {bookings.map((booking) => (
                  <li key={booking._id} className="p-5 hover:bg-surface-2 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-white line-clamp-1 flex-1 pr-4">{booking.itemId.title}</span>
                      <span className="font-bold text-accent-400 whitespace-nowrap">${booking.amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-muted">
                      <span>{new Date(booking.createdAt).toLocaleDateString()}</span>
                      <span className="bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full capitalize">
                        {booking.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
