import React from 'react';
import { Mail, MessageSquare, MapPin, Send } from 'lucide-react';

export default function ContactPage() {
  return (
    <main className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Get in <span className="gradient-text">Touch</span>
          </h1>
          <p className="text-lg text-gray-400">
            Have questions about Zyvora? Want to become a partner instructor? 
            We'd love to hear from you. Drop us a line below.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-surface/50 border border-primary-900/30 p-8 rounded-2xl flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary-500/10 text-primary-400 flex items-center justify-center mb-4">
                <Mail size={20} />
              </div>
              <h3 className="font-bold text-lg mb-2">Email Us</h3>
              <p className="text-muted text-sm mb-2">For general inquiries and support.</p>
              <a href="mailto:hello@zyvora.com" className="text-primary-400 font-semibold hover:underline">hello@zyvora.com</a>
            </div>

            <div className="bg-surface/50 border border-primary-900/30 p-8 rounded-2xl flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-secondary-500/10 text-secondary-400 flex items-center justify-center mb-4">
                <MessageSquare size={20} />
              </div>
              <h3 className="font-bold text-lg mb-2">Live Chat</h3>
              <p className="text-muted text-sm mb-2">Chat with our support team in real-time.</p>
              <button className="text-secondary-400 font-semibold hover:underline">Start a Chat</button>
            </div>

            <div className="bg-surface/50 border border-primary-900/30 p-8 rounded-2xl flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-green-500/10 text-green-400 flex items-center justify-center mb-4">
                <MapPin size={20} />
              </div>
              <h3 className="font-bold text-lg mb-2">Office</h3>
              <p className="text-muted text-sm mb-2">HQ based in San Francisco, CA.</p>
              <span className="text-green-400 font-semibold">100 Tech Lane, SF 94105</span>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form className="bg-surface/80 border border-primary-900/30 p-8 md:p-12 rounded-3xl backdrop-blur-xl">
              <h2 className="text-2xl font-bold mb-8">Send us a Message</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">First Name</label>
                  <input 
                    type="text" 
                    placeholder="John" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Last Name</label>
                  <input 
                    type="text" 
                    placeholder="Doe" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <label className="text-sm font-medium text-gray-300">Email Address</label>
                <input 
                  type="email" 
                  placeholder="john@example.com" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
                />
              </div>

              <div className="space-y-2 mb-8">
                <label className="text-sm font-medium text-gray-300">Message</label>
                <textarea 
                  rows={6}
                  placeholder="How can we help you?" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all resize-none"
                />
              </div>

              <button 
                type="button" 
                className="w-full py-4 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[var(--primary)]/20 hover:opacity-90 transition-all"
              >
                Send Message <Send size={18} />
              </button>
            </form>
          </div>

        </div>
      </div>
    </main>
  );
}
