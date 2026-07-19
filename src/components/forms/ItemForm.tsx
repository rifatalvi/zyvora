'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { ItemCategory, ItemType, DifficultyLevel } from '@/types';
import { Loader2, Sparkles, UploadCloud, ImagePlus, X } from 'lucide-react';

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
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, {
        method: 'POST',
        body: uploadData,
      });
      const data = await response.json();

      if (data.success) {
        setFormData(prev => ({ ...prev, thumbnail: data.data.url }));
      } else {
        setError(data.error?.message || 'Failed to upload image');
      }
    } catch (err) {
      setError('Error uploading image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents clicking the upload box underneath
    setFormData(prev => ({ ...prev, thumbnail: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    mutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto bg-[#0a0a14]/60 p-8 sm:p-10 rounded-3xl border border-white/10 backdrop-blur-2xl shadow-2xl">

      {/* Header Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Create New Item</h2>
        <p className="text-gray-400 text-sm">Fill in the details below to publish your course or mentorship.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-center gap-3">
          <X className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-7">

        {/* --- PREMIUM IMAGE UPLOAD ZONE --- */}
        <div className="space-y-3 md:col-span-2">
          <label className="text-sm font-semibold text-gray-300">Thumbnail Image</label>

          <div
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={`relative w-full h-64 rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center overflow-hidden cursor-pointer group
              ${formData.thumbnail ? 'border-transparent' : 'border-white/20 hover:border-[var(--primary)] hover:bg-white/[0.02] bg-[#0a0a14]'}
              ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />

            {formData.thumbnail ? (
              <>
                <img
                  src={formData.thumbnail}
                  alt="Thumbnail preview"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Hover Overlay for replacing/removing image */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                  <span className="bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 hover:bg-white/20 transition-colors">
                    <ImagePlus className="w-4 h-4" /> Change
                  </span>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="bg-red-500/20 text-red-400 p-2 rounded-lg hover:bg-red-500/40 hover:text-red-300 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center space-y-4 p-6">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto group-hover:bg-[var(--primary)]/10 transition-colors duration-300">
                  {isUploading ? (
                    <Loader2 className="w-8 h-8 text-[var(--primary)] animate-spin" />
                  ) : (
                    <UploadCloud className="w-8 h-8 text-gray-400 group-hover:text-[var(--primary)] transition-colors duration-300" />
                  )}
                </div>
                <div>
                  <p className="text-base font-medium text-gray-300">
                    {isUploading ? 'Uploading to ImgBB...' : 'Click or drag image to upload'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --- FORM INPUTS --- */}
        <div className="space-y-3 md:col-span-2">
          <label className="text-sm font-semibold text-gray-300">Title</label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full bg-[#0a0a14] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
            placeholder="e.g. Advanced TypeScript Patterns"
          />
        </div>

        <div className="space-y-3 md:col-span-2">
          <label className="text-sm font-semibold text-gray-300">Short Description</label>
          <input
            type="text"
            name="shortDescription"
            required
            value={formData.shortDescription}
            onChange={handleChange}
            className="w-full bg-[#0a0a14] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
            placeholder="A brief summary of your course"
          />
        </div>

        <div className="space-y-3 md:col-span-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-gray-300">Full Description</label>
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
              className="text-xs flex items-center gap-1.5 text-[var(--primary)] hover:text-white transition-colors bg-[var(--primary)]/10 hover:bg-[var(--primary)]/20 px-3 py-1.5 rounded-md font-medium"
            >
              <Sparkles className="w-3.5 h-3.5" /> AI Generate
            </button>
          </div>
          <textarea
            name="fullDescription"
            required
            rows={5}
            value={formData.fullDescription}
            onChange={handleChange}
            className="w-full bg-[#0a0a14] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all resize-y"
            placeholder="Detailed description of what students will learn..."
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-300">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full bg-[#0a0a14] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all appearance-none cursor-pointer"
          >
            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-300">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full bg-[#0a0a14] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all appearance-none cursor-pointer"
          >
            <option value="course">Course</option>
            <option value="mentorship">Mentorship</option>
          </select>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-300">Difficulty</label>
          <select
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            className="w-full bg-[#0a0a14] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all appearance-none cursor-pointer"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-300">Price (USD)</label>
          <input
            type="number"
            name="price"
            required
            min="0"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            className="w-full bg-[#0a0a14] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
            placeholder="0.00"
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-300">Tags</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="w-full bg-[#0a0a14] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
            placeholder="react, typescript, frontend (comma separated)"
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-semibold text-gray-300">Duration</label>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="w-full bg-[#0a0a14] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
            placeholder="e.g. 10 hours, 4 weeks"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={mutation.isPending || isUploading}
        className="w-full py-4 mt-10 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-bold text-lg shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.5)] transform hover:-translate-y-0.5 transition-all duration-300 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
      >
        {mutation.isPending ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Publishing Item...
          </>
        ) : (
          'Publish Item'
        )}
      </button>
    </form>
  );
}