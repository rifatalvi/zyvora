'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { ItemCategory, ItemType, DifficultyLevel } from '@/types';
import { Loader2, Sparkles } from 'lucide-react';

const CATEGORIES: ItemCategory[] = [
  'Programming', 'Design', 'Data Science', 'Business', 
  'Marketing', 'Photography', 'Music', 'Personal Development', 
  'Language', 'Health & Fitness'
];

export default function ItemForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    fullDescription: '',
    category: 'Programming' as ItemCategory,
    type: 'course' as ItemType,
    difficulty: 'Beginner' as DifficultyLevel,
    price: '',
    thumbnail: '',
    tags: '',
    duration: '',
    language: 'English',
  });
  
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      // transform tags string to array
      const tagsArray = data.tags.split(',').map(t => t.trim()).filter(Boolean);
      const payload = {
        ...data,
        price: Number(data.price),
        tags: tagsArray,
      };
      const response = await api.post('/items', payload);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['myItems'] });
      router.push(`/items/${data.item._id}`);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || err.message || 'Something went wrong');
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    mutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-xl">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-gray-300">Title</label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
            placeholder="e.g. Advanced TypeScript Patterns"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-gray-300">Short Description</label>
          <input
            type="text"
            name="shortDescription"
            required
            value={formData.shortDescription}
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
            placeholder="A brief summary of your course"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-300">Full Description</label>
            <button
              type="button"
              onClick={async () => {
                if (!formData.title) {
                  setError('Please enter a title first so the AI knows what to write about.');
                  return;
                }
                try {
                  const res = await api.post('/ai/generate-content', {
                    title: formData.title,
                    shortDescription: formData.shortDescription,
                    category: formData.category,
                  });
                  setFormData(prev => ({ ...prev, fullDescription: res.data.data }));
                } catch (err: any) {
                  setError('Failed to generate AI content');
                }
              }}
              className="text-xs flex items-center gap-1 text-[var(--primary)] hover:text-[var(--secondary)] transition-colors bg-[var(--primary)]/10 px-2 py-1 rounded"
            >
              <Sparkles className="w-3 h-3" /> AI Generate
            </button>
          </div>
          <textarea
            name="fullDescription"
            required
            rows={5}
            value={formData.fullDescription}
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
            placeholder="Detailed description of what students will learn..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full bg-[#0a0a14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          >
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full bg-[#0a0a14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          >
            <option value="course">Course</option>
            <option value="mentorship">Mentorship</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Difficulty</label>
          <select
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            className="w-full bg-[#0a0a14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Price (USD)</label>
          <input
            type="number"
            name="price"
            required
            min="0"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
            placeholder="e.g. 49.99"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-gray-300">Thumbnail URL</label>
          <input
            type="url"
            name="thumbnail"
            required
            value={formData.thumbnail}
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Tags (comma separated)</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
            placeholder="react, typescript, frontend"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Duration</label>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
            placeholder="e.g. 10 hours, or 4 weeks"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-bold shadow-lg hover:shadow-[var(--primary)]/20 transition-all flex justify-center items-center gap-2 mt-8"
      >
        {mutation.isPending ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Creating...
          </>
        ) : (
          'Publish Item'
        )}
      </button>
    </form>
  );
}
