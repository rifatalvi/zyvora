import React from 'react';
import Link from 'next/link';
import { Star, Clock, User, ArrowRight } from 'lucide-react';
import { Item } from '@/types';

interface ItemCardProps {
  item: Item;
}

export default function ItemCard({ item }: ItemCardProps) {
  return (
    <div className="flex flex-col bg-surface/80 backdrop-blur-md border border-primary-900/30 rounded-2xl overflow-hidden hover:border-primary-500/40 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-300 h-full">
      {/* Image Container */}
      <div className="relative h-48 w-full overflow-hidden bg-surface-2 group">
        <img
          src={item.thumbnail}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-surface/90 text-primary-400 border border-primary-900/50 backdrop-blur-sm">
            {item.category}
          </span>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-surface/90 text-accent-400 border border-accent-600/30 backdrop-blur-sm">
            {item.type}
          </span>
        </div>
        <div className="absolute top-3 right-3 bg-surface/90 text-text font-bold px-2.5 py-1 rounded-lg border border-primary-900/50 backdrop-blur-sm text-sm shadow-lg">
          ${item.price.toFixed(2)}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Rating & Duration */}
        <div className="flex items-center justify-between mb-3 text-xs text-muted">
          <div className="flex items-center gap-1 bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded-full font-medium border border-yellow-500/20">
            <Star size={12} fill="currentColor" />
            <span>{item.averageRating.toFixed(1)}</span>
            <span className="opacity-70 ml-0.5">({item.totalReviews})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={13} className="text-primary-400" />
            <span>{item.duration}</span>
          </div>
        </div>

        {/* Title & Description */}
        <Link href={`/items/${item._id}`} className="block group mb-3">
          <h3 className="text-lg font-bold text-text group-hover:text-primary-400 transition-colors line-clamp-2 mb-2 leading-snug">
            {item.title}
          </h3>
          <p className="text-sm text-muted line-clamp-2 leading-relaxed">
            {item.shortDescription}
          </p>
        </Link>

        {/* Spacer to push footer down */}
        <div className="flex-1" />

        {/* Footer */}
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-primary-900/30">
          <div className="flex items-center gap-2">
            {item.instructorAvatar ? (
              <img
                src={item.instructorAvatar}
                alt={item.instructorName}
                className="w-7 h-7 rounded-full object-cover border border-primary-500/30"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-primary-900/50 flex items-center justify-center border border-primary-500/30">
                <User size={12} className="text-primary-400" />
              </div>
            )}
            <span className="text-xs font-medium text-muted truncate max-w-[100px]">
              {item.instructorName}
            </span>
          </div>
          
          <Link
            href={`/items/${item._id}`}
            className="flex items-center gap-1 text-xs font-semibold text-primary-400 hover:text-primary-300 transition-colors group"
          >
            Details
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export function ItemCardSkeleton() {
  return (
    <div className="flex flex-col bg-surface/40 border border-primary-900/10 rounded-2xl overflow-hidden h-[420px]">
      <div className="h-48 w-full skeleton" />
      <div className="p-5 flex flex-col flex-1 gap-4">
        <div className="flex justify-between">
          <div className="h-5 w-16 skeleton rounded-full" />
          <div className="h-5 w-20 skeleton rounded-full" />
        </div>
        <div className="h-6 w-full skeleton rounded-lg" />
        <div className="h-6 w-2/3 skeleton rounded-lg" />
        <div className="space-y-2 mt-2">
          <div className="h-4 w-full skeleton rounded" />
          <div className="h-4 w-5/6 skeleton rounded" />
        </div>
        <div className="flex-1" />
        <div className="flex justify-between items-center pt-4 border-t border-primary-900/10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full skeleton" />
            <div className="h-3 w-16 skeleton rounded" />
          </div>
          <div className="h-4 w-12 skeleton rounded" />
        </div>
      </div>
    </div>
  );
}
