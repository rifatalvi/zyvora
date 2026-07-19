'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Item } from '@/types';
import ItemCard from '@/components/ItemCard';
import { Star, Clock, User, CheckCircle2, ChevronRight, MessageSquare, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

interface DetailsResponse {
  success: boolean;
  item: Item;
  related: Item[];
}

export default function ItemDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const { user } = useAuth();

  const { data, isLoading, isError } = useQuery<DetailsResponse>({
    queryKey: ['item', id],
    queryFn: async () => {
      const res = await api.get(`/items/${id}`);
      return res.data;
    }
  });

  const [isEnrolling, setIsEnrolling] = React.useState(false);

  const handleEnroll = async () => {
    if (!data?.item) return;
    try {
      setIsEnrolling(true);
      const res = await fetch('/api/checkout_sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: data.item._id, email: user?.email }),
      });
      const result = await res.json();
      
      if (result.url) {
        window.location.href = result.url;
      } else {
        console.error('Checkout error:', result.error);
        alert('Failed to start checkout process.');
      }
    } catch (error) {
      console.error('Enrollment error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsEnrolling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 flex justify-center">
        <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (isError || !data?.item) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-2xl font-bold text-red-400 mb-2">Item not found</h2>
        <p className="text-muted">The resource you're looking for doesn't exist or has been removed.</p>
        <Link href="/explore" className="mt-6 inline-block text-primary-400 hover:underline">
          Back to Explore
        </Link>
      </div>
    );
  }

  const { item, related } = data;


  return (
    <div className="pb-24">
      {/* ── Header ────────────────────────────────────────────── */}
      <div className="bg-surface-2 border-b border-primary-900/20 pt-12 pb-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-12 items-start">
          {/* Left: Thumbnail */}
          <div className="w-full lg:w-[45%] shrink-0">
            <div className="relative rounded-2xl overflow-hidden border border-primary-900/30 shadow-2xl">
              <img src={item.thumbnail} alt={item.title} className="w-full h-auto aspect-video object-cover" />
            </div>
            
            {/* Gallery (if any) */}
            {item.images && item.images.length > 0 && (
              <div className="flex gap-4 mt-4 overflow-x-auto pb-2">
                {item.images.map((img, i) => (
                  <img key={i} src={img} alt={`Gallery ${i+1}`} className="w-24 h-16 rounded-lg object-cover border border-primary-900/30 shrink-0" />
                ))}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div className="w-full lg:flex-1">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-4">
              <Link href="/explore" className="text-muted hover:text-white">Explore</Link>
              <ChevronRight size={14} className="text-primary-900/50" />
              <Link href={`/explore?category=${item.category}`} className="text-primary-400 hover:text-primary-300">{item.category}</Link>
              <ChevronRight size={14} className="text-primary-900/50" />
              <span className="text-muted">{item.type}</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
              {item.title}
            </h1>
            <p className="text-lg text-muted mb-8 leading-relaxed">
              {item.shortDescription}
            </p>

            <div className="flex flex-wrap items-center gap-6 mb-8 text-sm">
              <div className="flex items-center gap-2 bg-yellow-500/10 text-yellow-500 px-3 py-1.5 rounded-full font-bold border border-yellow-500/20">
                <Star size={16} fill="currentColor" />
                {item.averageRating.toFixed(1)} <span className="opacity-70 text-xs">({item.totalReviews} reviews)</span>
              </div>
              <div className="flex items-center gap-2 text-muted">
                <Clock size={16} className="text-primary-400" />
                <span>{item.duration}</span>
              </div>
              <div className="flex items-center gap-2 text-muted">
                <CheckCircle2 size={16} className="text-accent-400" />
                <span>{item.difficulty}</span>
              </div>
              <div className="flex items-center gap-2 text-muted">
                <User size={16} className="text-secondary-400" />
                <span>{item.totalEnrolled} enrolled</span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <span className="text-4xl font-extrabold text-white">${item.price.toFixed(2)}</span>
              <button 
                onClick={handleEnroll}
                disabled={isEnrolling}
                className="flex-1 max-w-[200px] py-4 rounded-xl text-white font-bold gradient-brand hover:shadow-[0_0_24px_rgba(99,102,241,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {isEnrolling ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Redirecting...
                  </>
                ) : 'Enroll Now'}
              </button>
            </div>
            
            {item.aiGenerated && (
              <p className="mt-4 text-xs text-primary-400 flex items-center gap-1 opacity-80">
                <Sparkles size={12} /> This course was generated with the help of Zyvora AI.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Content & Instructor ──────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left: Main Details */}
        <div className="lg:col-span-2 space-y-12">
          <section>
            <h2 className="text-2xl font-bold mb-6">About this {item.type}</h2>
            <div className="prose prose-invert max-w-none text-muted leading-relaxed whitespace-pre-wrap">
              {item.fullDescription}
            </div>
          </section>

          {/* Reviews */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <MessageSquare size={24} className="text-primary-400" />
              Student Reviews
            </h2>
            {item.reviews.length === 0 ? (
              <p className="text-muted italic bg-surface p-6 rounded-xl border border-primary-900/20">No reviews yet.</p>
            ) : (
              <div className="space-y-4">
                {item.reviews.map(r => (
                  <div key={r._id} className="bg-surface p-6 rounded-2xl border border-primary-900/20">
                    <div className="flex items-center gap-3 mb-4">
                      {r.userAvatar ? (
                        <img src={r.userAvatar} alt={r.userName} className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary-800 flex items-center justify-center font-bold text-white">
                          {r.userName[0]}
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-text">{r.userName}</h4>
                        <div className="flex text-yellow-500 gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={12} fill={i < r.rating ? "currentColor" : "transparent"} className={i < r.rating ? "" : "text-muted"} />
                          ))}
                        </div>
                      </div>
                      <span className="ml-auto text-xs text-muted">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-muted text-sm leading-relaxed">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right: Instructor & Details */}
        <div className="space-y-8">
          <div className="bg-surface border border-primary-900/20 rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-4 border-b border-primary-900/20 pb-4">Instructor</h3>
            <div className="flex items-center gap-4 mb-4">
              {item.instructorAvatar ? (
                <img src={item.instructorAvatar} alt={item.instructorName} className="w-16 h-16 rounded-full object-cover border-2 border-primary-500/30" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-primary-900/50 flex items-center justify-center border-2 border-primary-500/30">
                  <User size={24} className="text-primary-400" />
                </div>
              )}
              <div>
                <h4 className="font-bold text-lg text-text">{item.instructorName}</h4>
                <p className="text-sm text-muted">Zyvora Provider</p>
              </div>
            </div>
            {/* Instructor bio would go here if we populated it in the backend endpoint */}
            <Link href="#" className="inline-block mt-2 text-sm text-primary-400 hover:underline">View Profile</Link>
          </div>

          <div className="bg-surface border border-primary-900/20 rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-4 border-b border-primary-900/20 pb-4">Details</h3>
            <ul className="space-y-3 text-sm text-muted">
              <li className="flex justify-between"><span>Language:</span> <span className="text-white font-medium">{item.language}</span></li>
              <li className="flex justify-between"><span>Duration:</span> <span className="text-white font-medium">{item.duration}</span></li>
              <li className="flex justify-between"><span>Last Updated:</span> <span className="text-white font-medium">{new Date(item.updatedAt).toLocaleDateString()}</span></li>
            </ul>
            
            {item.tags && item.tags.length > 0 && (
              <div className="mt-6">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-3">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-md bg-surface-2 border border-primary-900/20 text-xs text-muted">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Related Items ─────────────────────────────────────── */}
      {related && related.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 py-12 border-t border-primary-900/20">
          <h2 className="text-2xl font-bold mb-8">More from <span className="gradient-text">{item.category}</span></h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map(r => (
              <ItemCard key={r._id} item={r as any} /> 
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
