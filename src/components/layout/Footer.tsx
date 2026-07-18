'use client';

import React from 'react';
import Link from 'next/link';
import { Zap, Share2, GitBranch, AtSign, Play, Mail, MapPin, Phone } from 'lucide-react';

const footerLinks = {
  Platform: [
    { label: 'Explore Courses', href: '/explore' },
    { label: 'Find Mentors',    href: '/explore?type=mentorship' },
    { label: 'Add Course',      href: '/items/add' },
    { label: 'My Courses',      href: '/items/manage' },
  ],
  Company: [
    { label: 'About Us',    href: '/about' },
    { label: 'Contact',     href: '/contact' },
    { label: 'Blog',        href: '/blog' },
    { label: 'Careers',     href: '/about#careers' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy',   href: '/privacy#cookies' },
  ],
};

const socials = [
  { Icon: Share2,    href: 'https://twitter.com', label: 'Twitter / X' },
  { Icon: GitBranch, href: 'https://github.com',  label: 'GitHub' },
  { Icon: AtSign,    href: 'https://linkedin.com',label: 'LinkedIn' },
  { Icon: Play,      href: 'https://youtube.com', label: 'YouTube' },
];

export default function Footer() {
  return (
    <footer style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)' }}>
      {/* ── Main Footer ──────────────────────────────────────── */}
      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Col */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                   style={{ background: 'var(--gradient-brand)' }}>
                <Zap size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold">
                <span className="gradient-text">Zy</span>
                <span className="text-white">vora</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--color-muted)' }}>
              Zyvora is your AI-powered learning platform connecting ambitious learners 
              with world-class mentors and skill-building resources.
            </p>

            {/* Contact Info */}
            <div className="space-y-2 mb-6">
              {[
                { Icon: Mail,    text: 'hello@zyvora.ai' },
                { Icon: Phone,   text: '+1 (555) 000-0000' },
                { Icon: MapPin,  text: 'San Francisco, CA' },
              ].map(({ Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-muted)' }}>
                  <Icon size={14} style={{ color: 'var(--color-primary-400)' }} />
                  {text}
                </div>
              ))}
            </div>

            {/* Socials */}
            <div className="flex items-center gap-3">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200"
                  style={{ border: '1px solid var(--color-border)', color: 'var(--color-muted)' }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(99,102,241,0.5)';
                    (e.currentTarget as HTMLElement).style.color = 'var(--color-primary-400)';
                    (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.1)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)';
                    (e.currentTarget as HTMLElement).style.color = 'var(--color-muted)';
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                  }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">{section}</h3>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm transition-colors duration-200"
                      style={{ color: 'var(--color-muted)' }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-primary-400)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-muted)')}
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
      <div style={{ borderTop: '1px solid var(--color-border)' }}>
        <div className="section-container py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
            © {new Date().getFullYear()} Zyvora. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
            Built with ❤️ using Next.js, TypeScript & Gemini AI
          </p>
        </div>
      </div>
    </footer>
  );
}
