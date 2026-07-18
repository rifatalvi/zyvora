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
    if (!form.email)    e.email    = 'Email is required';
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
      const msg = err?.response?.data?.message || 'Login failed. Please try again.';
      setErrors({ general: msg });
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setForm({ email: 'demo@zyvora.ai', password: 'demo1234' });
    setErrors({});
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4"
         style={{ background: 'var(--gradient-hero)' }}>

      {/* Decorative blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20 blur-3xl animate-float"
             style={{ background: 'var(--color-primary-600)' }} />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-20 blur-3xl animate-float delay-400"
             style={{ background: 'var(--color-secondary-600)' }} />
      </div>

      <div className="w-full max-w-md relative animate-fade-in-up">
        {/* Card */}
        <div className="glass-card p-8">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                 style={{ background: 'var(--gradient-brand)' }}>
              <Zap size={22} className="text-white" />
            </div>
            <span className="text-2xl font-bold">
              <span className="gradient-text">Zy</span><span className="text-white">vora</span>
            </span>
          </div>

          <h1 className="text-2xl font-bold text-center text-white mb-1">Welcome back</h1>
          <p className="text-center text-sm mb-8" style={{ color: 'var(--color-muted)' }}>
            Sign in to continue your learning journey
          </p>

          {/* Demo Login Banner */}
          <button
            onClick={fillDemo}
            type="button"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl mb-6 text-sm font-medium transition-all duration-200"
            style={{
              background: 'rgba(99,102,241,0.12)',
              border: '1px dashed rgba(99,102,241,0.4)',
              color: 'var(--color-primary-400)',
            }}
          >
            <Sparkles size={15} />
            Use Demo Credentials
          </button>

          {/* Error */}
          {errors.general && (
            <div className="flex items-center gap-2 p-3 rounded-xl mb-5 text-sm text-red-400"
                 style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <AlertCircle size={15} className="shrink-0" />
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email */}
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-muted)' }}>
                Email address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--color-muted)' }} />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="you@example.com"
                  className={`input-field pl-10 ${errors.email ? 'border-red-500/50' : ''}`}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="login-password" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-muted)' }}>
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--color-muted)' }} />
                <input
                  id="login-password"
                  type={showPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-500/50' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--color-muted)' }}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
            </div>

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: 'var(--color-muted)' }}>
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-semibold" style={{ color: 'var(--color-primary-400)' }}>
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
