'use client';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import Privacy from '@/components/Privacy';
import About from '@/components/About';
import Footer from '@/components/Footer';

export default function Home() {
  const [authPath, setAuthPath] = useState('/register');

  useEffect(() => {
    const storedName = localStorage.getItem('medidost_user_name');
    if (storedName) {
      setAuthPath('/dashboard');
    }
  }, []);

  return (
    <>
      <Navbar />
      <Hero />

      {/* Section divider */}
      <div className="section-divider" />

      <HowItWorks />

      <div className="section-divider" />

      <Privacy />

      <div className="section-divider" />

      <About />

      <div className="section-divider" />

      <Features />

      {/* CTA Banner */}
      <div className="container">
        <div className="cta-banner">
          <h2 className="cta-title">
            Ready to understand your{' '}
            <span className="gradient-text">health report?</span>
          </h2>
          <p className="cta-sub">
            Upload your report now — get a plain-language summary in seconds,
            in your language, with full privacy guaranteed.
          </p>
          <div className="cta-actions">
            <a href={authPath} className="btn-hero-primary">
              Analyse My Report for Free →
            </a>
            <a href="#" className="btn-hero-ghost">
              View Demo ↗
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
