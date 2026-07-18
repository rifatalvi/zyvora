'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  BookOpen, Zap, Menu, X, User, LogOut, ChevronDown,
  LayoutDashboard, PlusCircle, List, Sparkles, GraduationCap,
} from 'lucide-react';

const publicRoutes = [
  { href: '/',        label: 'Home' },
  { href: '/explore', label: 'Explore' },
  { href: '/about',   label: 'About' },
];

const authRoutes = [
  { href: '/',              label: 'Home',         icon: <BookOpen size={16} /> },
  { href: '/explore',       label: 'Explore',      icon: <Sparkles size={16} /> },
  { href: '/items/add',     label: 'Add Course',   icon: <PlusCircle size={16} /> },
  { href: '/items/manage',  label: 'My Courses',   icon: <List size={16} /> },
  { href: '/about',         label: 'About',        icon: <GraduationCap size={16} /> },
];

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const router   = useRouter();
  const [scrolled,     setScrolled]     = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const routes = isAuthenticated ? authRoutes : publicRoutes;

  const avatarFallback = user?.name?.charAt(0).toUpperCase() || 'U';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'py-3 backdrop-blur-xl bg-[rgba(10,10,20,0.95)] border-b border-[rgba(99,102,241,0.2)] shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="section-container flex items-center justify-between">
        {/* ── Logo ───────────────────────────────────────────── */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center animate-pulse-glow"
               style={{ background: 'var(--gradient-brand)' }}>
            <Zap size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold font-plus-jakarta">
            <span className="gradient-text">Zy</span>
            <span className="text-white">vora</span>
          </span>
        </Link>

        {/* ── Desktop Nav Links ───────────────────────────────── */}
        <div className="hidden md:flex items-center gap-6">
          {routes.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              className={`nav-link ${pathname === r.href ? 'active' : ''}`}
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
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-[rgba(99,102,241,0.1)] transition-colors duration-200"
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover border-2 border-[rgba(99,102,241,0.4)]" />
                ) : (
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
                       style={{ background: 'var(--gradient-brand)' }}>
                    {avatarFallback}
                  </div>
                )}
                <span className="text-sm font-medium text-[var(--color-text)]">
                  {user?.name?.split(' ')[0]}
                </span>
                <ChevronDown size={16} className={`text-[var(--color-muted)] transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-12 w-52 glass-card shadow-[var(--shadow-card)] py-2 animate-fade-in">
                  <div className="px-4 py-2 border-b border-[var(--color-border)]">
                    <p className="text-xs font-medium text-[var(--color-muted)]">Signed in as</p>
                    <p className="text-sm font-semibold text-[var(--color-text)] truncate">{user?.email}</p>
                  </div>
                  <Link href="/items/manage" className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[rgba(99,102,241,0.08)] transition-colors">
                    <LayoutDashboard size={15} /> My Courses
                  </Link>
                  <Link href="/items/add" className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[rgba(99,102,241,0.08)] transition-colors">
                    <PlusCircle size={15} /> Add Course
                  </Link>
                  <div className="border-t border-[var(--color-border)] mt-1 pt-1">
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
              <Link href="/login" className="btn-secondary text-sm py-2 px-4">Sign In</Link>
              <Link href="/register" className="btn-primary text-sm py-2 px-4">Get Started</Link>
            </>
          )}
        </div>

        {/* ── Mobile Toggle ───────────────────────────────────── */}
        <button
          className="md:hidden p-2 rounded-lg text-[var(--color-muted)] hover:text-white hover:bg-[rgba(99,102,241,0.1)] transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* ── Mobile Menu ───────────────────────────────────────── */}
      {mobileOpen && (
        <div className="md:hidden mt-2 mx-4 glass-card py-4 animate-fade-in">
          {routes.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                pathname === r.href
                  ? 'text-[var(--color-primary-400)] bg-[rgba(99,102,241,0.08)]'
                  : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              {'icon' in r && (r as { icon: React.ReactNode; href: string; label: string }).icon}
              {r.label}
            </Link>
          ))}
          <div className="border-t border-[var(--color-border)] mt-2 pt-3 px-4 flex flex-col gap-2">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-red-400 py-2"
              >
                <LogOut size={15} /> Sign Out
              </button>
            ) : (
              <>
                <Link href="/login"    className="btn-secondary text-center text-sm">Sign In</Link>
                <Link href="/register" className="btn-primary  text-center text-sm">Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
