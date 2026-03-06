'use client';
import { useEffect, useState, useRef } from 'react';
import { Application } from '@splinetool/runtime';

export default function Hero() {
    const [authPath, setAuthPath] = useState('/register');
    const canvasRef = useRef(null);

    useEffect(() => {
        const storedName = localStorage.getItem('medidost_user_name');
        if (storedName) {
            setAuthPath('/dashboard');
        }
    }, []);

    useEffect(() => {
        let app;
        if (canvasRef.current) {
            app = new Application(canvasRef.current);
            app.load('https://prod.spline.design/OoE1x9YThC2LChTy/scene.splinecode');
        }
        return () => {
            if (app) app.dispose();
        };
    }, []);

    return (
        <section className="hero">

            {/* ── Spline canvas: absolute full-size background ── */}
            <div className="hero-spline">
                <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
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
