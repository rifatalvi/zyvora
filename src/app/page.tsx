'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { ItemsResponse } from '@/types';
import ItemCard, { ItemCardSkeleton } from '@/components/ItemCard';
import {
  ArrowRight, BrainCircuit, Sparkles, Target, Zap, CheckCircle2,
  Users, BookOpen, Trophy, Star, Quote, ArrowUpRight
} from 'lucide-react';

// ── Hero Section ───────────────────────────────────────────────
const Hero = () => (
  <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden min-h-[70vh] flex flex-col justify-center">
    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />
    <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary-600/20 blur-[120px] pointer-events-none animate-[float_6s_ease-in-out_infinite]" />
    <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-secondary-600/20 blur-[100px] pointer-events-none animate-[float_5s_ease-in-out_infinite_1s]" />

    <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-8 animate-[fadeInUp_0.6s_ease_forwards]">
        <Sparkles size={16} />
        <span>Powered by Gemini AI</span>
      </div>
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 animate-[fadeInUp_0.6s_ease_forwards_0.1s]">
        Master New Skills with <br className="hidden md:block" />
        <span className="gradient-text">AI-Guided Learning</span>
      </h1>
      <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed animate-[fadeInUp_0.6s_ease_forwards_0.2s]">
        Connect with world-class mentors and discover courses tailored to your goals. 
        Zyvora uses advanced AI to personalize your entire educational journey.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-[fadeInUp_0.6s_ease_forwards_0.3s]">
        <Link href="/explore" className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-white font-semibold gradient-brand hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] hover:-translate-y-1 transition-all duration-300">
          Start Exploring <ArrowRight size={18} />
        </Link>
        <Link href="/items/add" className="w-full sm:w-auto flex items-center justify-center px-8 py-4 rounded-xl text-text font-semibold bg-surface border border-primary-900/40 hover:bg-primary-500/10 hover:border-primary-500/50 transition-all duration-300">
          Become a Mentor
        </Link>
      </div>
    </div>
  </section>
);

// ── Features Section ───────────────────────────────────────────
const Features = () => {
  const features = [
    { icon: <BrainCircuit size={28} />, title: 'Smart AI Matching', desc: 'Our recommendation engine pairs you with the perfect courses based on your skills.' },
    { icon: <Target size={28} />, title: 'Personalized Paths', desc: 'Dynamic learning roadmaps that adapt as you progress and achieve your goals.' },
    { icon: <Zap size={28} />, title: 'AI Content Generation', desc: 'Mentors can generate high-quality course descriptions instantly using Gemini AI.' },
  ];

  return (
    <section className="py-24 bg-surface-2/50 border-y border-primary-900/20 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why choose <span className="gradient-text">Zyvora</span>?</h2>
          <p className="text-muted max-w-2xl mx-auto">Experience the next generation of online learning.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="bg-surface border border-primary-900/30 p-8 rounded-2xl hover:border-primary-500/50 hover:bg-primary-500/5 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{f.title}</h3>
              <p className="text-muted leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── Featured Items Section ─────────────────────────────────────
const FeaturedItems = () => {
  const { data, isLoading } = useQuery<ItemsResponse>({
    queryKey: ['featuredItems'],
    queryFn: async () => {
      const res = await api.get('/items?limit=4&sortBy=averageRating&order=desc');
      return res.data;
    }
  });

  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Top Rated <span className="gradient-text">Courses</span></h2>
            <p className="text-muted">Discover our highest-rated learning resources.</p>
          </div>
          <Link href="/explore" className="flex items-center gap-2 text-primary-400 font-semibold hover:text-primary-300 transition-colors group">
            View all courses <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <ItemCardSkeleton key={i} />)
          ) : data?.items && data.items.length > 0 ? (
            data.items.map(item => <ItemCard key={item._id} item={item} />)
          ) : (
            <p className="text-muted col-span-full py-12 text-center bg-surface border border-primary-900/20 rounded-2xl">
              No courses available right now.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

// ── Categories Section ─────────────────────────────────────────
const Categories = () => {
  const cats = ['Programming', 'Design', 'Data Science', 'Business', 'Marketing', 'Language'];
  return (
    <section className="py-24 bg-surface-2/30 border-y border-primary-900/10">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">Explore by <span className="gradient-text">Category</span></h2>
        <div className="flex flex-wrap justify-center gap-4">
          {cats.map(c => (
            <Link key={c} href={`/explore?category=${c}`}
              className="px-6 py-3 rounded-full bg-surface border border-primary-900/40 text-sm font-medium hover:bg-primary-500/10 hover:border-primary-500/50 hover:text-primary-400 transition-all duration-300 flex items-center gap-2">
              {c} <ArrowUpRight size={14} className="opacity-50" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── Stats Section ──────────────────────────────────────────────
const Stats = () => (
  <section className="py-20">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Active Learners', val: '50K+', icon: Users },
          { label: 'Expert Mentors',  val: '2K+',  icon: BookOpen },
          { label: 'Courses Added',   val: '10K+', icon: Trophy },
          { label: 'Success Stories', val: '99%',  icon: CheckCircle2 },
        ].map((s, i) => (
          <div key={i} className="bg-surface/50 border border-primary-900/20 p-8 rounded-2xl text-center">
            <s.icon size={32} className="text-primary-400 mx-auto mb-4 opacity-80" />
            <h4 className="text-3xl md:text-4xl font-extrabold text-white mb-2">{s.val}</h4>
            <p className="text-sm text-muted font-medium">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ── Testimonials Section ───────────────────────────────────────
const Testimonials = () => (
  <section className="py-24 bg-surface-2/40 border-t border-primary-900/10">
    <div className="max-w-7xl mx-auto px-6">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">What our <span className="gradient-text">learners say</span></h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { name: 'Sarah L.', role: 'Frontend Dev', text: 'The AI recommendations were spot on. I found a React course that exactly matched my skill level.' },
          { name: 'David M.', role: 'Data Scientist', text: 'Mentorship sessions on Zyvora accelerated my career transition. Highly recommended platform!' },
          { name: 'Emily R.', role: 'UX Designer', text: 'As a provider, the AI content generator saves me hours when drafting course curriculums.' },
        ].map((t, i) => (
          <div key={i} className="bg-surface border border-primary-900/30 p-8 rounded-2xl relative">
            <Quote size={40} className="absolute top-6 right-6 text-primary-900/40" />
            <div className="flex gap-1 text-yellow-500 mb-6">
              {[1,2,3,4,5].map(s => <Star key={s} size={16} fill="currentColor" />)}
            </div>
            <p className="text-muted leading-relaxed mb-6 italic">"{t.text}"</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-800 flex items-center justify-center font-bold text-white">
                {t.name[0]}
              </div>
              <div>
                <h5 className="font-bold text-sm text-text">{t.name}</h5>
                <p className="text-xs text-muted">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ── CTA Section ────────────────────────────────────────────────
const CTA = () => (
  <section className="py-24 relative overflow-hidden">
    <div className="absolute inset-0 bg-primary-900/20" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-primary-600/30 blur-[120px] rounded-full pointer-events-none" />
    <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
      <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Ready to accelerate your career?</h2>
      <p className="text-lg text-primary-100 mb-10 max-w-2xl mx-auto">
        Join Zyvora today. Discover AI-curated courses, connect with expert mentors, and unlock your true potential.
      </p>
      <Link href="/register" className="inline-flex items-center gap-2 px-10 py-5 rounded-xl text-white font-bold text-lg bg-white/10 border border-white/20 hover:bg-white/20 backdrop-blur-md transition-all duration-300">
        Create Free Account <ArrowRight size={20} />
      </Link>
    </div>
  </section>
);

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      <Hero />
      <Features />
      <FeaturedItems />
      <Categories />
      <Stats />
      <Testimonials />
      <CTA />
    </div>
  );
}
