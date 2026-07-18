'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, Zap, Mail, Lock, AlertCircle, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [form,    setForm]    = useState({ email: '', password: '' });
  const [errors,  setErrors]  = useState<{ email?: string; password?: string; general?: string }>({});
  const [loading, setLoading] = useState(false);
  const [showPw,  setShowPw]  = useState(false);

  const validate = () => {
    const e: typeof errors = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email address';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    try {
      await login(form.email, form.password);
      router.push('/');
    } catch (err: any) {
      setErrors({ general: err?.response?.data?.message || 'Login failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => setForm({ email: 'demo@zyvora.ai', password: 'demo1234' });

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 gradient-hero relative overflow-hidden">

      {/* Decorative blobs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-primary-600/20 blur-3xl pointer-events-none animate-[float_4s_ease-in-out_infinite]" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-secondary-600/20 blur-3xl pointer-events-none animate-[float_4s_ease-in-out_infinite_0.4s]" />

      <div className="w-full max-w-md relative z-10 animate-[fadeInUp_0.6s_ease_forwards]">

        {/* Card */}
        <div className="bg-surface/80 backdrop-blur-2xl border border-primary-900/20 rounded-2xl p-8 shadow-2xl">

          {/* Logo */}
          <div className="flex items-center justify-center gap-2.5 mb-8">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center gradient-brand">
              <Zap size={22} className="text-white" />
            </div>
            <span className="text-2xl font-bold">
              <span className="gradient-text">Zy</span>
              <span className="text-text">vora</span>
            </span>
          </div>

          <h1 className="text-2xl font-bold text-center text-white mb-1">Welcome back</h1>
          <p className="text-center text-sm text-muted mb-8">
            Sign in to continue your learning journey
          </p>

          {/* Demo button */}
          <button
            onClick={fillDemo}
            type="button"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl mb-6 text-sm font-medium text-primary-400 bg-primary-500/10 border border-dashed border-primary-500/40 hover:bg-primary-500/20 hover:border-primary-500/60 transition-all duration-200"
          >
            <Sparkles size={15} />
            Use Demo Credentials
          </button>

          {/* General error */}
          {errors.general && (
            <div className="flex items-center gap-2 p-3 rounded-xl mb-5 text-sm text-red-400 bg-red-500/10 border border-red-500/20">
              <AlertCircle size={15} className="shrink-0" />
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>

            {/* Email */}
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-muted mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl bg-surface-2/80 border text-text text-sm placeholder:text-muted outline-none transition-all duration-200 focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 ${
                    errors.email ? 'border-red-500/50' : 'border-primary-900/30'
                  }`}
                />
              </div>
              {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-muted mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                <input
                  id="login-password"
                  type={showPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-3 rounded-xl bg-surface-2/80 border text-text text-sm placeholder:text-muted outline-none transition-all duration-200 focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 ${
                    errors.password ? 'border-red-500/50' : 'border-primary-900/30'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-xs text-red-400">{errors.password}</p>}
            </div>

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white gradient-brand hover:opacity-90 hover:shadow-[0_0_24px_rgba(99,102,241,0.4)] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-semibold text-primary-400 hover:text-primary-300 transition-colors">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
