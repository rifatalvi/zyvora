'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { ItemsResponse } from '@/types';
import ItemCard, { ItemCardSkeleton } from '@/components/ItemCard';
import RecommendedItems from '@/components/RecommendedItems';
import { Search, Filter, SlidersHorizontal, X } from 'lucide-react';

const CATEGORIES = ['All', 'Programming', 'Design', 'Data Science', 'Business', 'Marketing', 'Language'];
const TYPES = ['All', 'course', 'mentorship'];
const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced'];

function ExploreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL state sync
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [type, setType] = useState(searchParams.get('type') || 'All');
  const [difficulty, setDifficulty] = useState(searchParams.get('difficulty') || 'All');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  const [showFilters, setShowFilters] = useState(false);

  // Debounced search trigger
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Update URL on filter change
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (category !== 'All') params.set('category', category);
    if (type !== 'All') params.set('type', type);
    if (difficulty !== 'All') params.set('difficulty', difficulty);
    if (page > 1) params.set('page', page.toString());

    router.replace(`/explore?${params.toString()}`, { scroll: false });
  }, [debouncedSearch, category, type, difficulty, page, router]);

  // Fetch Data
  const { data, isLoading, isError } = useQuery<ItemsResponse>({
    queryKey: ['items', debouncedSearch, category, type, difficulty, page],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (debouncedSearch) params.append('search', debouncedSearch);
      if (category !== 'All') params.append('category', category);
      if (type !== 'All') params.append('type', type);
      if (difficulty !== 'All') params.append('difficulty', difficulty);
      params.append('page', page.toString());
      params.append('limit', '12');

      const res = await api.get(`${process.env.NEXT_PUBLIC_API_URL}/items?${params.toString()}`);
      return res.data;
    },
    placeholderData: (prev) => prev,
  });

  const clearFilters = () => {
    setSearch('');
    setCategory('All');
    setType('All');
    setDifficulty('All');
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Explore <span className="gradient-text">Resources</span></h1>
          <p className="text-muted">Find the perfect course or mentor for your next skill.</p>
        </div>

        <div className="w-full md:w-auto flex items-center gap-3">
          <div className="relative flex-1 md:w-80">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search courses, tags..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-11 pr-4 py-3 bg-surface border border-primary-900/30 rounded-xl text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-white">
                <X size={16} />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden p-3 bg-surface border border-primary-900/30 rounded-xl text-muted"
          >
            <SlidersHorizontal size={20} />
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className={`lg:w-64 shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-surface/50 border border-primary-900/20 rounded-2xl p-6 sticky top-28">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold flex items-center gap-2"><Filter size={18} className="text-primary-400" /> Filters</h3>
              <button onClick={clearFilters} className="text-xs text-muted hover:text-primary-400 transition-colors">Clear all</button>
            </div>

            {/* Type Filter */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold mb-3 text-white/80">Resource Type</h4>
              <div className="flex flex-col gap-2">
                {TYPES.map(t => (
                  <label key={t} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio" name="type" value={t}
                      checked={type === t}
                      onChange={() => { setType(t); setPage(1); }}
                      className="w-4 h-4 text-primary-500 bg-surface-2 border-primary-900/50 rounded focus:ring-primary-500/50"
                    />
                    <span className={`text-sm capitalize transition-colors ${type === t ? 'text-white' : 'text-muted group-hover:text-white/80'}`}>
                      {t}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold mb-3 text-white/80">Category</h4>
              <div className="flex flex-col gap-2">
                {CATEGORIES.map(c => (
                  <label key={c} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio" name="category" value={c}
                      checked={category === c}
                      onChange={() => { setCategory(c); setPage(1); }}
                      className="w-4 h-4 text-primary-500 bg-surface-2 border-primary-900/50 rounded focus:ring-primary-500/50"
                    />
                    <span className={`text-sm transition-colors ${category === c ? 'text-white' : 'text-muted group-hover:text-white/80'}`}>
                      {c}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div>
              <h4 className="text-sm font-semibold mb-3 text-white/80">Difficulty</h4>
              <div className="flex flex-col gap-2">
                {DIFFICULTIES.map(d => (
                  <label key={d} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio" name="difficulty" value={d}
                      checked={difficulty === d}
                      onChange={() => { setDifficulty(d); setPage(1); }}
                      className="w-4 h-4 text-primary-500 bg-surface-2 border-primary-900/50 rounded focus:ring-primary-500/50"
                    />
                    <span className={`text-sm transition-colors ${difficulty === d ? 'text-white' : 'text-muted group-hover:text-white/80'}`}>
                      {d}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Grid */}
        <div className="flex-1">
          {/* AI Recommendations */}
          {search === '' && category === 'All' && <RecommendedItems />}

          {/* Results Info */}
          <div className="mb-6 text-sm text-muted">
            {isLoading ? 'Loading...' : `Showing ${data?.items.length || 0} of ${data?.pagination?.total || 0} results`}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => <ItemCardSkeleton key={i} />)
            ) : isError ? (
              <div className="col-span-full py-12 text-center text-red-400 bg-red-500/10 border border-red-500/20 rounded-2xl">
                Failed to load items. Please try again.
              </div>
            ) : data?.items.length === 0 ? (
              <div className="col-span-full py-20 text-center bg-surface/50 border border-primary-900/20 rounded-2xl">
                <Search size={40} className="mx-auto text-muted mb-4 opacity-50" />
                <h3 className="text-xl font-bold mb-2">No results found</h3>
                <p className="text-muted mb-6">Try adjusting your filters or search query.</p>
                <button onClick={clearFilters} className="px-6 py-2 rounded-lg border border-primary-900/50 text-sm hover:bg-surface-2 transition-colors">
                  Clear Filters
                </button>
              </div>
            ) : (
              data?.items.map(item => <ItemCard key={item._id} item={item} />)
            )}
          </div>

          {/* Pagination */}
          {data?.pagination && data.pagination.totalPages > 1 && (
            <div className="mt-12 flex justify-center items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={!data.pagination.hasPrevPage}
                className="px-4 py-2 rounded-lg bg-surface border border-primary-900/30 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-500/10 transition-colors"
              >
                Previous
              </button>
              <div className="px-4 py-2 text-sm text-muted">
                Page {data.pagination.page} of {data.pagination.totalPages}
              </div>
              <button
                onClick={() => setPage(p => Math.min(data.pagination.totalPages, p + 1))}
                disabled={!data.pagination.hasNextPage}
                className="px-4 py-2 rounded-lg bg-surface border border-primary-900/30 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-500/10 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <React.Suspense fallback={<div className="p-12 text-center text-muted">Loading explore...</div>}>
      <ExploreContent />
    </React.Suspense>
  );
}
