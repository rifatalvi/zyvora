'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Eye, EyeOff, Zap, Mail, Lock, User as UserIcon,
  AlertCircle, GraduationCap, Briefcase, CheckCircle,
} from 'lucide-react';

type Role = 'learner' | 'provider';

const ROLES: { value: Role; label: string; desc: string; Icon: React.ElementType }[] = [
  { value: 'learner',  label: 'Learner',  desc: 'Discover courses & mentors', Icon: GraduationCap },
  { value: 'provider', label: 'Provider', desc: 'Teach & share expertise',     Icon: Briefcase },
];

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'learner' as Role });
  const [errors, setErrors] = useState<Partial<typeof form & { general: string }>>({});
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw]   = useState(false);

  const validate = () => {
    const e: typeof errors = {};
    if (!form.name.trim() || form.name.trim().length < 2)
      e.name = 'Name must be at least 2 characters';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.password || form.password.length < 6)
      e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword)
      e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    try {
      await register(form.name.trim(), form.email, form.password, form.role);
      router.push('/');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Registration failed. Please try again.';
      setErrors({ general: msg });
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = (() => {
    const pw = form.password;
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 6) score++;
    if (pw.length >= 10) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  })();

  const strengthColor = ['', '#ef4444', '#f97316', '#eab308', '#22c55e', '#10b981'][passwordStrength];
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][passwordStrength];

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4"
         style={{ background: 'var(--gradient-hero)' }}>

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-10 w-80 h-80 rounded-full opacity-15 blur-3xl animate-float"
             style={{ background: 'var(--color-secondary-600)' }} />
        <div className="absolute bottom-20 left-10 w-80 h-80 rounded-full opacity-15 blur-3xl animate-float delay-300"
             style={{ background: 'var(--color-primary-600)' }} />
      </div>

      <div className="w-full max-w-md relative animate-fade-in-up">
        <div className="glass-card p-8">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                 style={{ background: 'var(--gradient-brand)' }}>
              <Zap size={22} className="text-white" />
            </div>
            <span className="text-2xl font-bold">
              <span className="gradient-text">Zy</span><span className="text-white">vora</span>
            </span>
          </div>

          <h1 className="text-2xl font-bold text-center text-white mb-1">Create your account</h1>
          <p className="text-center text-sm mb-6" style={{ color: 'var(--color-muted)' }}>
            Join thousands of learners on Zyvora
          </p>

          {/* Role Selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {ROLES.map(({ value, label, desc, Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setForm(f => ({ ...f, role: value }))}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all duration-200 ${
                  form.role === value
                    ? 'border-[var(--color-primary-500)] bg-[rgba(99,102,241,0.12)]'
                    : 'border-[var(--color-border)] hover:border-[rgba(99,102,241,0.3)]'
                }`}
              >
                <Icon size={20} className={form.role === value ? 'text-[var(--color-primary-400)]' : 'text-[var(--color-muted)]'} />
                <span className={`text-xs font-semibold ${form.role === value ? 'text-white' : 'text-[var(--color-muted)]'}`}>{label}</span>
                <span className="text-[10px]" style={{ color: 'var(--color-muted)' }}>{desc}</span>
                {form.role === value && <CheckCircle size={12} className="text-[var(--color-primary-400)]" />}
              </button>
            ))}
          </div>

          {/* Error */}
          {errors.general && (
            <div className="flex items-center gap-2 p-3 rounded-xl mb-4 text-sm text-red-400"
                 style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <AlertCircle size={15} className="shrink-0" />
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Name */}
            <div>
              <label htmlFor="reg-name" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-muted)' }}>Full name</label>
              <div className="relative">
                <UserIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-muted)' }} />
                <input id="reg-name" type="text" autoComplete="name"
                  value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Alex Johnson"
                  className={`input-field pl-10 ${errors.name ? 'border-red-500/50' : ''}`} />
              </div>
              {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="reg-email" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-muted)' }}>Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-muted)' }} />
                <input id="reg-email" type="email" autoComplete="email"
                  value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="you@example.com"
                  className={`input-field pl-10 ${errors.email ? 'border-red-500/50' : ''}`} />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="reg-password" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-muted)' }}>Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-muted)' }} />
                <input id="reg-password" type={showPw ? 'text' : 'password'} autoComplete="new-password"
                  value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="Min. 6 characters"
                  className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-500/50' : ''}`} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-muted)' }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
              {/* Strength Bar */}
              {form.password && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex gap-1 flex-1">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
                           style={{ background: i <= passwordStrength ? strengthColor : 'var(--color-surface-2)' }} />
                    ))}
                  </div>
                  <span className="text-xs font-medium" style={{ color: strengthColor }}>{strengthLabel}</span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="reg-confirm" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-muted)' }}>Confirm password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-muted)' }} />
                <input id="reg-confirm" type={showPw ? 'text' : 'password'} autoComplete="new-password"
                  value={form.confirmPassword} onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                  placeholder="Repeat password"
                  className={`input-field pl-10 ${errors.confirmPassword ? 'border-red-500/50' : ''}`} />
              </div>
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-400">{errors.confirmPassword}</p>}
            </div>

            <button id="register-submit" type="submit" disabled={loading}
              className="btn-primary w-full justify-center py-3">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account…
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm" style={{ color: 'var(--color-muted)' }}>
            Already have an account?{' '}
            <Link href="/login" className="font-semibold" style={{ color: 'var(--color-primary-400)' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
