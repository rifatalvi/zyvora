'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Item } from '@/types';
import ItemCard, { ItemCardSkeleton } from './ItemCard';
import { Sparkles, XCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function RecommendedItems() {
  const { isAuthenticated } = useAuth();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['recommendations'],
    queryFn: async () => {
      const res = await api.get('/api/ai/recommendations');
      return res.data.recommendedItems as Item[];
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 10, // cache for 10 minutes
  });

  if (!isAuthenticated) return null;

  if (isError) {
    return (
      <div className="mb-10 p-6 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400">
        <XCircle size={20} /> Failed to load AI recommendations.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
          <h2 className="text-xl font-bold">AI Recommendations for You</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <ItemCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) return null;

  return (
    <div className="mb-12">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
          AI Recommendations for You
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map(item => (
          <ItemCard key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
}
