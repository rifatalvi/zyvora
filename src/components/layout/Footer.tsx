'use client';

import React from 'react';
import Link from 'next/link';
import { Zap, Share2, GitBranch, AtSign, Play, Mail, MapPin, Phone } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const footerLinks = {
  Platform: [
    { label: 'Explore Courses', href: '/explore' },
    { label: 'Find Mentors',    href: '/explore?type=mentorship' },
    { label: 'Add Course',      href: '/add-item' },
    { label: 'My Courses',      href: '/manage-items' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Contact',  href: '/contact' },
    { label: 'Blog',     href: '/blog' },
    { label: 'Careers',  href: '/about#careers' },
  ],
  Legal: [
    { label: 'Privacy Policy',  href: '/privacy' },
    { label: 'Terms of Service',href: '/terms' },
    { label: 'Cookie Policy',   href: '/privacy#cookies' },
  ],
};

const socials = [
  { Icon: Share2,    href: 'https://twitter.com', label: 'Twitter / X' },
  { Icon: GitBranch, href: 'https://github.com',  label: 'GitHub' },
  { Icon: AtSign,    href: 'https://linkedin.com',label: 'LinkedIn' },
  { Icon: Play,      href: 'https://youtube.com', label: 'YouTube' },
];

const contactItems = [
  { Icon: Mail,    text: 'hello@zyvora.ai' },
  { Icon: Phone,   text: '+1 (555) 000-0000' },
  { Icon: MapPin,  text: 'San Francisco, CA' },
];

export default function Footer() {
  const { user } = useAuth();
  
  const platformLinks = footerLinks.Platform.filter(
    link => user?.role === 'provider' || (link.href !== '/add-item' && link.href !== '/manage-items')
  );

  const displayLinks = {
    Platform: platformLinks,
    Company: footerLinks.Company,
    Legal: footerLinks.Legal,
  };

  return (
    <footer className="bg-surface border-t border-primary-900/20">

      {/* ── Main Footer Content ───────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">

          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center gradient-brand">
                <Zap size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold">
                <span className="gradient-text">Zy</span>
                <span className="text-text">vora</span>
              </span>
            </Link>

            <p className="text-sm text-muted leading-relaxed mb-6 max-w-xs">
              Zyvora is your AI-powered learning platform connecting ambitious learners
              with world-class mentors and skill-building resources.
            </p>

            {/* Contact */}
            <ul className="space-y-2.5 mb-6">
              {contactItems.map(({ Icon, text }) => (
                <li key={text} className="flex items-center gap-2.5 text-sm text-muted">
                  <Icon size={14} className="text-primary-400 shrink-0" />
                  {text}
                </li>
              ))}
            </ul>

            {/* Socials */}
            <div className="flex items-center gap-3">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-muted border border-primary-900/30 hover:border-primary-500/50 hover:text-primary-400 hover:bg-primary-500/10 transition-all duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(displayLinks).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-xs font-semibold text-white uppercase tracking-widest mb-5">
                {section}
              </h3>
              <ul className="space-y-3">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-muted hover:text-primary-400 transition-colors duration-200"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom Bar ───────────────────────────────────────── */}
      <div className="border-t border-primary-900/20">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} Zyvora. All rights reserved.
          </p>
          <p className="text-xs text-muted">
            Built with ❤️ using Next.js, TypeScript &amp; Gemini AI
          </p>
        </div>
      </div>
    </footer>
  );
}
