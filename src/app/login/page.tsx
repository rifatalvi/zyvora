'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { authClient, signIn } from '@/lib/auth-client';
import { Eye, EyeOff, Zap, Mail, Lock, AlertCircle, Sparkles } from 'lucide-react';

export default function LoginPage() {


  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

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
      const { error } = await authClient.signIn.email({
        email: form.email,
        password: form.password,
      });
      if (error) throw new Error(error.message || 'Login failed');
      window.location.href = '/';
    } catch (err: any) {
      setErrors({ general: err?.message || err?.response?.data?.message || 'Login failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => setForm({ email: 'demo@zyvora.ai', password: 'demo1234' });

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrors({});
    try {
      const { data, error } = await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/',
      });
      if (error) throw new Error(error.message || 'Google sign in failed');
    } catch (err: any) {
      setErrors({ general: err?.message || 'Google sign in failed.' });
      setLoading(false);
    }
  };

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

          {/* Google button */}
          <button
            onClick={handleGoogleSignIn}
            type="button"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl mb-4 text-sm font-medium text-white bg-white/5 border border-primary-900/30 hover:bg-white/10 transition-all duration-200"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          <div className="relative flex items-center mb-4">
            <div className="flex-grow border-t border-primary-900/30"></div>
            <span className="flex-shrink-0 mx-4 text-xs text-muted">or</span>
            <div className="flex-grow border-t border-primary-900/30"></div>
          </div>

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
                  className={`w-full pl-10 pr-4 py-3 rounded-xl bg-surface-2/80 border text-text text-sm placeholder:text-muted outline-none transition-all duration-200 focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 ${errors.email ? 'border-red-500/50' : 'border-primary-900/30'
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
                  className={`w-full pl-10 pr-10 py-3 rounded-xl bg-surface-2/80 border text-text text-sm placeholder:text-muted outline-none transition-all duration-200 focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 ${errors.password ? 'border-red-500/50' : 'border-primary-900/30'
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
