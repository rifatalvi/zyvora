import React from 'react';
import { Target, Users, Zap, Shield, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const stats = [
    { label: 'Active Users', value: '10K+' },
    { label: 'Courses Created', value: '500+' },
    { label: 'Mentors Available', value: '250+' },
    { label: 'Countries Reached', value: '120+' },
  ];

  const values = [
    {
      icon: <Target className="w-6 h-6 text-blue-400" />,
      title: 'Mission-Driven',
      description: 'We believe education should be accessible, practical, and community-driven. Our goal is to empower learners worldwide.'
    },
    {
      icon: <Users className="w-6 h-6 text-green-400" />,
      title: 'Community First',
      description: 'Zyvora is built on the strength of its community. Mentors and learners collaborate to achieve greatness together.'
    },
    {
      icon: <Shield className="w-6 h-6 text-purple-400" />,
      title: 'Quality Assured',
      description: 'We maintain high standards for our content through community reviews and AI-assisted quality checks.'
    },
    {
      icon: <Sparkles className="w-6 h-6 text-yellow-400" />,
      title: 'AI-Powered',
      description: 'We leverage cutting-edge AI to personalize recommendations and help instructors create better content faster.'
    },
  ];

  return (
    <main className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-sm font-semibold mb-6 border border-[var(--primary)]/20">
            <Zap size={16} /> Empowering the Future
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Redefining <span className="gradient-text">Education</span> for the Modern World
          </h1>
          <p className="text-lg text-gray-400 leading-relaxed">
            Zyvora is an AI-powered educational platform connecting passionate mentors with eager learners. 
            We provide the tools, the community, and the intelligence to accelerate your growth.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-2xl text-center backdrop-blur-sm hover:bg-white/10 transition-colors">
              <div className="text-4xl font-bold gradient-text mb-2">{stat.value}</div>
              <div className="text-sm text-gray-400 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Story Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Our Story</h2>
            <p className="text-gray-300 leading-relaxed">
              Founded in 2026, Zyvora started with a simple idea: the traditional educational model is too slow and disconnected from real-world skills.
            </p>
            <p className="text-gray-300 leading-relaxed">
              By combining peer-to-peer mentorship, project-based learning, and advanced AI models (like Google Gemini), we've created an ecosystem where knowledge flows freely and adapts instantly to industry changes.
            </p>
            <div className="pt-4">
              <Link href="/explore" className="text-[var(--primary)] font-semibold hover:text-[var(--secondary)] flex items-center gap-2 transition-colors">
                Explore our courses &rarr;
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] opacity-30 blur-2xl rounded-full"></div>
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop" 
              alt="Team collaboration" 
              className="relative rounded-2xl border border-white/10 shadow-2xl object-cover h-[400px] w-full"
            />
          </div>
        </div>

        {/* Values Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">The principles that guide every decision we make at Zyvora.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, i) => (
            <div key={i} className="bg-surface/50 border border-primary-900/30 p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                {value.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
