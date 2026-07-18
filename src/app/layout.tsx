import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/Providers';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: { default: 'Zyvora — AI-Powered Learning Platform', template: '%s | Zyvora' },
  description:
    'Zyvora connects ambitious learners with world-class courses and mentors, powered by cutting-edge AI to personalize your learning journey.',
  keywords: ['online learning', 'mentorship', 'AI education', 'skill development', 'courses'],
  authors: [{ name: 'Zyvora Team' }],
  openGraph: {
    type: 'website',
    siteName: 'Zyvora',
    title: 'Zyvora — AI-Powered Learning Platform',
    description: 'Personalized AI-driven learning journeys for the modern professional.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex flex-col min-h-screen" style={{ background: 'var(--color-bg)' }}>
        <Providers>
          <Navbar />
          <main className="flex-1 pt-20">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
