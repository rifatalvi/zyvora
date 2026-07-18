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

  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '', role: 'learner' as Role,
  });
  const [errors, setErrors] = useState<Partial<typeof form & { general: string }>>({});
  const [loading, setLoading] = useState(false);
  const [showPw,  setShowPw]  = useState(false);

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
      setErrors({ general: err?.response?.data?.message || 'Registration failed.' });
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = (() => {
    const pw = form.password;
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 6)  score++;
    if (pw.length >= 10) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  })();

  const strengthColors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-emerald-500'];
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  const strengthTextColors = ['', 'text-red-400', 'text-orange-400', 'text-yellow-400', 'text-green-400', 'text-emerald-400'];

  const inputClass = (field?: string) =>
    `w-full py-3 rounded-xl bg-surface-2/80 border text-text text-sm placeholder:text-muted outline-none transition-all duration-200 focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 ${
      field ? 'border-red-500/50' : 'border-primary-900/30'
    }`;

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 gradient-hero relative overflow-hidden">

      {/* Blobs */}
      <div className="absolute top-20 right-10 w-80 h-80 rounded-full bg-secondary-600/15 blur-3xl pointer-events-none animate-[float_4s_ease-in-out_infinite]" />
      <div className="absolute bottom-20 left-10 w-80 h-80 rounded-full bg-primary-600/15 blur-3xl pointer-events-none animate-[float_4s_ease-in-out_infinite_0.3s]" />

      <div className="w-full max-w-md relative z-10 animate-[fadeInUp_0.6s_ease_forwards]">
        <div className="bg-surface/80 backdrop-blur-2xl border border-primary-900/20 rounded-2xl p-8 shadow-2xl">

          {/* Logo */}
          <div className="flex items-center justify-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center gradient-brand">
              <Zap size={22} className="text-white" />
            </div>
            <span className="text-2xl font-bold">
              <span className="gradient-text">Zy</span>
              <span className="text-text">vora</span>
            </span>
          </div>

          <h1 className="text-2xl font-bold text-center text-white mb-1">Create your account</h1>
          <p className="text-center text-sm text-muted mb-6">Join thousands of learners on Zyvora</p>

          {/* Role Selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {ROLES.map(({ value, label, desc, Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setForm(f => ({ ...f, role: value }))}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all duration-200 ${
                  form.role === value
                    ? 'border-primary-500 bg-primary-500/12'
                    : 'border-primary-900/30 hover:border-primary-500/30 hover:bg-primary-500/5'
                }`}
              >
                <Icon size={20} className={form.role === value ? 'text-primary-400' : 'text-muted'} />
                <span className={`text-xs font-semibold ${form.role === value ? 'text-white' : 'text-muted'}`}>
                  {label}
                </span>
                <span className="text-[10px] text-muted">{desc}</span>
                {form.role === value && <CheckCircle size={12} className="text-primary-400" />}
              </button>
            ))}
          </div>

          {/* Error */}
          {errors.general && (
            <div className="flex items-center gap-2 p-3 rounded-xl mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20">
              <AlertCircle size={15} className="shrink-0" />
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>

            {/* Name */}
            <div>
              <label htmlFor="reg-name" className="block text-sm font-medium text-muted mb-1.5">Full name</label>
              <div className="relative">
                <UserIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                <input
                  id="reg-name" type="text" autoComplete="name"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Alex Johnson"
                  className={`${inputClass(errors.name)} pl-10`}
                />
              </div>
              {errors.name && <p className="mt-1.5 text-xs text-red-400">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="reg-email" className="block text-sm font-medium text-muted mb-1.5">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                <input
                  id="reg-email" type="email" autoComplete="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="you@example.com"
                  className={`${inputClass(errors.email)} pl-10`}
                />
              </div>
              {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="reg-password" className="block text-sm font-medium text-muted mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                <input
                  id="reg-password" type={showPw ? 'text' : 'password'} autoComplete="new-password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="Min. 6 characters"
                  className={`${inputClass(errors.password)} pl-10 pr-10`}
                />
                <button
                  type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text transition-colors"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-xs text-red-400">{errors.password}</p>}

              {/* Strength Bar */}
              {form.password && (
                <div className="mt-2.5 flex items-center gap-2">
                  <div className="flex gap-1 flex-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i <= passwordStrength ? strengthColors[passwordStrength] : 'bg-surface-2'
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`text-xs font-medium ${strengthTextColors[passwordStrength]}`}>
                    {strengthLabels[passwordStrength]}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="reg-confirm" className="block text-sm font-medium text-muted mb-1.5">Confirm password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                <input
                  id="reg-confirm" type={showPw ? 'text' : 'password'} autoComplete="new-password"
                  value={form.confirmPassword}
                  onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                  placeholder="Repeat password"
                  className={`${inputClass(errors.confirmPassword)} pl-10`}
                />
              </div>
              {errors.confirmPassword && <p className="mt-1.5 text-xs text-red-400">{errors.confirmPassword}</p>}
            </div>

            {/* Submit */}
            <button
              id="register-submit"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white gradient-brand hover:opacity-90 hover:shadow-[0_0_24px_rgba(99,102,241,0.4)] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account…
                </>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-muted">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-primary-400 hover:text-primary-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
