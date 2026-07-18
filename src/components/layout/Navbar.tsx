'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  BookOpen, Zap, Menu, X, LogOut, ChevronDown,
  LayoutDashboard, PlusCircle, List, Sparkles, GraduationCap,
} from 'lucide-react';

const publicRoutes = [
  { href: '/',        label: 'Home' },
  { href: '/explore', label: 'Explore' },
  { href: '/about',   label: 'About' },
];

const authRoutes = [
  { href: '/',             label: 'Home',       icon: <BookOpen   size={16} /> },
  { href: '/explore',      label: 'Explore',    icon: <Sparkles   size={16} /> },
  { href: '/items/add',    label: 'Add Course', icon: <PlusCircle size={16} /> },
  { href: '/items/manage', label: 'My Courses', icon: <List       size={16} /> },
  { href: '/about',        label: 'About',      icon: <GraduationCap size={16} /> },
];

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname    = usePathname();
  const router      = useRouter();
  const [scrolled,     setScrolled]     = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setDropdownOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  useEffect(() => { setMobileOpen(false); setDropdownOpen(false); }, [pathname]);

  const handleLogout = () => { logout(); router.push('/'); };
  const routes = isAuthenticated ? authRoutes : publicRoutes;
  const avatarFallback = user?.name?.charAt(0).toUpperCase() || 'U';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'py-3 backdrop-blur-xl bg-bg/95 border-b border-primary-900/50 shadow-2xl'
        : 'py-5 bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

        {/* ── Logo ───────────────────────────────────────────── */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center gradient-brand animate-[pulseGlow_2s_ease-in-out_infinite]">
            <Zap size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold">
            <span className="gradient-text">Zy</span>
            <span className="text-text">vora</span>
          </span>
        </Link>

        {/* ── Desktop Nav Links ───────────────────────────────── */}
        <div className="hidden md:flex items-center gap-7">
          {routes.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              className={`relative text-sm font-medium transition-colors duration-200 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:rounded-full after:bg-gradient-to-r after:from-primary-500 after:to-secondary-500 after:transition-all after:duration-300 ${
                pathname === r.href
                  ? 'text-primary-400 after:w-full'
                  : 'text-muted hover:text-text after:w-0 hover:after:w-full'
              }`}
            >
              {r.label}
            </Link>
          ))}
        </div>

        {/* ── Desktop Right Actions ───────────────────────────── */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-primary-500/10 transition-colors duration-200"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar} alt={user.name}
                    className="w-9 h-9 rounded-full object-cover border-2 border-primary-500/40"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm gradient-brand">
                    {avatarFallback}
                  </div>
                )}
                <span className="text-sm font-medium text-text">
                  {user?.name?.split(' ')[0]}
                </span>
                <ChevronDown
                  size={16}
                  className={`text-muted transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 top-12 w-52 bg-surface/95 backdrop-blur-xl border border-primary-900/30 rounded-2xl shadow-2xl py-2 animate-[fadeIn_0.2s_ease_forwards]">
                  <div className="px-4 py-2.5 border-b border-primary-900/20">
                    <p className="text-xs font-medium text-muted">Signed in as</p>
                    <p className="text-sm font-semibold text-text truncate">{user?.email}</p>
                  </div>
                  {[
                    { href: '/items/manage', label: 'My Courses',  Icon: LayoutDashboard },
                    { href: '/items/add',    label: 'Add Course',  Icon: PlusCircle },
                  ].map(({ href, label, Icon }) => (
                    <Link
                      key={href} href={href}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted hover:text-text hover:bg-primary-500/8 transition-colors"
                    >
                      <Icon size={15} /> {label}
                    </Link>
                  ))}
                  <div className="border-t border-primary-900/20 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-semibold text-primary-400 px-4 py-2 rounded-xl border border-primary-500/40 hover:bg-primary-500/10 hover:border-primary-500 transition-all duration-200"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="text-sm font-semibold text-white px-4 py-2 rounded-xl gradient-brand hover:opacity-90 hover:shadow-[0_0_24px_rgba(99,102,241,0.5)] transition-all duration-200"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* ── Mobile Toggle ───────────────────────────────────── */}
        <button
          className="md:hidden p-2 rounded-lg text-muted hover:text-white hover:bg-primary-500/10 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* ── Mobile Menu ───────────────────────────────────────── */}
      {mobileOpen && (
        <div className="md:hidden mt-2 mx-4 bg-surface/95 backdrop-blur-xl border border-primary-900/30 rounded-2xl py-3 animate-[fadeIn_0.2s_ease_forwards]">
          {routes.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                pathname === r.href
                  ? 'text-primary-400 bg-primary-500/8'
                  : 'text-muted hover:text-text'
              }`}
            >
              {'icon' in r && (r as { icon: React.ReactNode }).icon}
              {r.label}
            </Link>
          ))}
          <div className="border-t border-primary-900/20 mt-2 pt-3 px-4 flex flex-col gap-2">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-red-400 py-2"
              >
                <LogOut size={15} /> Sign Out
              </button>
            ) : (
              <>
                <Link href="/login"
                  className="text-center text-sm font-semibold text-primary-400 py-2.5 rounded-xl border border-primary-500/40 hover:bg-primary-500/10 transition-all">
                  Sign In
                </Link>
                <Link href="/register"
                  className="text-center text-sm font-semibold text-white py-2.5 rounded-xl gradient-brand hover:opacity-90 transition-all">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
