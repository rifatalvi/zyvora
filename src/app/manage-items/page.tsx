'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Item } from '@/types';
import { Loader2, Trash2, Edit, Plus } from 'lucide-react';
import Link from 'next/link';

export default function ManageItemsPage() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isAuthLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (user?.role === 'learner') {
        router.push('/');
      }
    }
  }, [isAuthLoading, isAuthenticated, user, router]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['myItems'],
    queryFn: async () => {
      const response = await api.get('/items/my');
      return response.data.items as Item[];
    },
    // Only run the query after auth has finished loading AND user is authenticated
    enabled: !isAuthLoading && isAuthenticated,
    retry: 1,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/items/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myItems'] });
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });

  if (isAuthLoading || !isAuthenticated || user?.role === 'learner') {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="w-10 h-10 text-[var(--primary)] animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]">
              Manage Items
            </h1>
            <p className="text-gray-400 mt-2">
              View and manage all your created courses and mentorships.
            </p>
          </div>

          <Link href="/add-item" className="px-6 py-3 bg-[var(--primary)] text-white font-semibold rounded-xl flex items-center gap-2 hover:bg-[var(--primary)]/90 transition-all shadow-[var(--primary)]/20 shadow-lg">
            <Plus className="w-5 h-5" />
            Create New
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-[var(--primary)] animate-spin" />
          </div>
        ) : error ? (
          <div className="text-red-400 p-6 bg-red-500/10 rounded-2xl border border-red-500/20 text-center space-y-3">
            <p>Failed to load items. Please try again later.</p>
            <p className="text-xs text-red-300/60">{(error as any)?.response?.data?.message || (error as any)?.message}</p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-sm transition-colors"
            >
              Retry
            </button>
          </div>
        ) : data?.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xl">
            <p className="text-gray-400 mb-6">You haven't created any items yet.</p>
            <Link href="/add-item" className="text-[var(--primary)] hover:underline font-medium">
              Start creating now &rarr;
            </Link>
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="p-6 text-gray-400 font-medium whitespace-nowrap">Title</th>
                    <th className="p-6 text-gray-400 font-medium whitespace-nowrap">Type</th>
                    <th className="p-6 text-gray-400 font-medium whitespace-nowrap">Category</th>
                    <th className="p-6 text-gray-400 font-medium whitespace-nowrap">Price</th>
                    <th className="p-6 text-gray-400 font-medium whitespace-nowrap">Rating</th>
                    <th className="p-6 text-gray-400 font-medium text-right whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {data?.map((item) => (
                    <tr key={item._id} className="hover:bg-white/5 transition-colors group">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="w-16 h-12 object-cover rounded-lg"
                          />
                          <Link href={`/items/${item._id}`} className="font-semibold text-white hover:text-[var(--primary)] transition-colors line-clamp-1">
                            {item.title}
                          </Link>
                        </div>
                      </td>
                      <td className="p-6 text-gray-300 capitalize">{item.type}</td>
                      <td className="p-6 text-gray-300">{item.category}</td>
                      <td className="p-6 text-[var(--accent)] font-medium">${item.price.toFixed(2)}</td>
                      <td className="p-6 text-gray-300">
                        {item.totalReviews > 0 ? (
                          <span>⭐ {item.averageRating} ({item.totalReviews})</span>
                        ) : (
                          <span className="text-gray-500">No reviews</span>
                        )}
                      </td>
                      <td className="p-6 text-right space-x-3">
                        <button
                          disabled
                          className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all"
                          title="Edit (Coming soon)"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this item?')) {
                              deleteMutation.mutate(item._id);
                            }
                          }}
                          disabled={deleteMutation.isPending}
                          className="p-2 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-all"
                        >
                          {deleteMutation.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
