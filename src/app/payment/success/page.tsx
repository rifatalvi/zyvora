'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, XCircle, BookOpen, CreditCard, Calendar, Hash, ArrowRight, Home, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

interface BookingDetails {
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
    difficulty: string;
    duration: string;
  };
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const [booking, setBooking] = useState<BookingDetails | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setStatus('error');
      setErrorMsg('No session ID found in the URL.');
      return;
    }

    const verifyPayment = async () => {
      try {
        const res = await api.patch('/bookings/success', {
          stripeSessionId: sessionId,
        });

        if (res.data.success) {
          setBooking(res.data.booking);
          setStatus('success');
        } else {
          setStatus('error');
          setErrorMsg(res.data.message || 'Failed to verify payment.');
        }
      } catch (error: any) {
        console.error('Payment verification error:', error);
        setStatus('error');
        setErrorMsg(error.response?.data?.message || 'Failed to communicate with the server.');
      }
    };

    verifyPayment();
  }, [sessionId]);

  return (
    <div className="min-h-screen pb-20">
      {/* ── Breadcrumb path ─────────────────────────────────────── */}
      <div className="bg-surface-2 border-b border-primary-900/20 pt-24 pb-6">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
            <Link href="/" className="hover:text-white flex items-center gap-1 transition-colors">
              <Home size={12} /> Home
            </Link>
            <ChevronRight size={12} className="text-primary-900/50" />
            <Link href="/explore" className="hover:text-white transition-colors">Explore</Link>
            <ChevronRight size={12} className="text-primary-900/50" />
            <Link href="/my-bookings" className="hover:text-white transition-colors">My Bookings</Link>
            <ChevronRight size={12} className="text-primary-900/50" />
            <span className="text-primary-400">Payment Success</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* ── Loading ─────────────────────────────────────────────── */}
        {status === 'loading' && (
          <div className="bg-surface border border-primary-900/20 p-14 rounded-3xl shadow-2xl text-center">
            <div className="w-16 h-16 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-2">Verifying Payment...</h2>
            <p className="text-muted">Please wait while we confirm your enrollment.</p>
          </div>
        )}

        {/* ── Success ─────────────────────────────────────────────── */}
        {status === 'success' && booking && (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-surface border border-green-500/20 p-10 rounded-3xl shadow-2xl text-center relative overflow-hidden">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent pointer-events-none" />
              <CheckCircle2 size={80} className="text-green-400 mx-auto mb-6" />
              <h1 className="text-4xl font-extrabold text-white mb-3">Payment Successful! 🎉</h1>
              <p className="text-lg text-muted max-w-md mx-auto">
                You're now enrolled! Your transaction is confirmed and the course is ready for you.
              </p>
            </div>

            {/* Course + Transaction Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Enrolled Course Card */}
              <div className="bg-surface border border-primary-900/20 rounded-2xl overflow-hidden">
                <div className="relative">
                  <img
                    src={booking.itemId.thumbnail}
                    alt={booking.itemId.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-3 left-3 text-xs font-bold bg-primary-600/90 text-white px-2 py-1 rounded-md">
                    {booking.itemId.category}
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen size={16} className="text-primary-400" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted">Enrolled Course</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 leading-tight">{booking.itemId.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-muted">
                    <span>{booking.itemId.difficulty}</span>
                    <span>·</span>
                    <span>{booking.itemId.duration}</span>
                  </div>
                  <Link
                    href={`/items/${booking.itemId._id}`}
                    className="mt-4 w-full inline-flex justify-center items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
                  >
                    Go to Course <ArrowRight size={16} />
                  </Link>
                </div>
              </div>

              {/* Transaction Details */}
              <div className="bg-surface border border-primary-900/20 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-5">
                  <CreditCard size={16} className="text-accent-400" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted">Transaction Details</span>
                </div>

                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0">
                      <CheckCircle2 size={14} className="text-green-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted">Status</p>
                      <p className="font-bold text-green-400 capitalize">{booking.status}</p>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center shrink-0">
                      <CreditCard size={14} className="text-primary-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted">Amount Paid</p>
                      <p className="font-bold text-white text-xl">${booking.amount.toFixed(2)}</p>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-secondary-500/10 border border-secondary-500/20 flex items-center justify-center shrink-0">
                      <Calendar size={14} className="text-secondary-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted">Purchase Date</p>
                      <p className="font-bold text-white">
                        {new Date(booking.createdAt).toLocaleDateString('en-US', {
                          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent-500/10 border border-accent-500/20 flex items-center justify-center shrink-0">
                      <Hash size={14} className="text-accent-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted">Stripe Session ID</p>
                      <p className="font-mono text-xs text-white break-all opacity-70">{booking.stripeSessionId}</p>
                    </div>
                  </li>

                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shrink-0">
                      <Hash size={14} className="text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted">Booking ID</p>
                      <p className="font-mono text-xs text-white break-all opacity-70">{booking._id}</p>
                    </div>
                  </li>
                </ul>

                <Link
                  href="/my-bookings"
                  className="mt-6 w-full inline-flex justify-center items-center gap-2 border border-primary-500/30 hover:bg-primary-500/10 text-primary-400 px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
                >
                  View All Bookings <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ── Error ───────────────────────────────────────────────── */}
        {status === 'error' && (
          <div className="bg-surface border border-red-500/20 p-14 rounded-3xl shadow-2xl text-center">
            <XCircle size={80} className="text-red-500 mx-auto mb-6" />
            <h2 className="text-3xl font-extrabold text-white mb-4">Verification Failed</h2>
            <p className="text-lg text-muted mb-8">{errorMsg}</p>
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 bg-surface-2 hover:bg-surface text-white border border-primary-900/30 px-8 py-4 rounded-xl font-bold transition-all"
            >
              Return to Explore
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
