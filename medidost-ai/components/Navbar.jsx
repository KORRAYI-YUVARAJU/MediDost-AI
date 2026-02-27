'use client';
import { useEffect, useState } from 'react';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [authUserName, setAuthUserName] = useState(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', onScroll);

        // Check active session
        const storedName = localStorage.getItem('medidost_user_name');
        if (storedName) {
            setAuthUserName(storedName);
        }

        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="container navbar-inner">
                {/* Logo */}
                <a href="#" className="navbar-logo">
                    <div className="logo-mark">🩺</div>
                    <span className="logo-text">Medi<span>Dost</span> AI</span>
                </a>

                {/* Nav links */}
                <ul className="navbar-links">
                    <li><a href="/#features">Features</a></li>
                    <li><a href="/#how">How it works</a></li>
                    <li><a href="/#privacy">Privacy</a></li>
                    <li><a href="/#about">About</a></li>
                </ul>

                {/* CTA */}
                <div className="navbar-actions">
                    {authUserName ? (
                        <>
                            <a href="/profile" className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>👤</span> {authUserName}
                            </a>
                            <a href="/dashboard" className="btn-primary">Dashboard →</a>
                        </>
                    ) : (
                        <>
                            <a href="/login" className="btn-ghost">Sign In</a>
                            <a href="/register" className="btn-primary">Get Started →</a>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
