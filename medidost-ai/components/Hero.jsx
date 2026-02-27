'use client';
import { useEffect, useState } from 'react';
import Spline from '@splinetool/react-spline';

export default function Hero() {
    const [authPath, setAuthPath] = useState('/register');

    useEffect(() => {
        const storedName = localStorage.getItem('medidost_user_name');
        if (storedName) {
            setAuthPath('/dashboard');
        }
    }, []);
    return (
        <section className="hero">

            {/* ── Spline canvas: absolute full-size background ── */}
            <div className="hero-spline">
                <Spline
                    scene="https://prod.spline.design/OoE1x9YThC2LChTy/scene.splinecode"
                    width={1920}
                    height={1080}
                />
            </div>

            {/* ── Gradient overlay so text stays readable ── */}
            <div className="hero-overlay" />

            {/* ── Text content: overlaid on top ── */}
            <div className="hero-content">
                <div className="hero-badge fade-up">
                    <span className="hero-badge-dot">✦</span>
                    AI-Powered · Privacy-First · Multilingual
                </div>

                <h1 className="hero-title fade-up fade-up-d1">
                    Your Medical<br />
                    Reports,{' '}
                    <span className="gradient-text">Explained</span><br />
                    Simply.
                </h1>

                <p className="hero-sub fade-up fade-up-d2">
                    MediDost AI turns complex clinical jargon into clear, compassionate
                    language — in your mother tongue. No more anxiety. Just clarity.
                </p>

                <div className="hero-actions fade-up fade-up-d3">
                    <a href={authPath} className="btn-hero-primary">
                        Analyse My Report →
                    </a>
                    <a href="#features" className="btn-hero-ghost">
                        See Features ↓
                    </a>
                </div>

                <div className="hero-stats fade-up fade-up-d4">
                    <div>
                        <div className="hero-stat-num">10+</div>
                        <div className="hero-stat-label">Languages</div>
                    </div>
                    <div>
                        <div className="hero-stat-num">99%</div>
                        <div className="hero-stat-label">OCR Accuracy</div>
                    </div>
                    <div>
                        <div className="hero-stat-num">100%</div>
                        <div className="hero-stat-label">Confidential</div>
                    </div>
                </div>
            </div>

        </section>
    );
}
