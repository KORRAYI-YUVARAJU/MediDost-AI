'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import '../auth.css';

/* Load spline client-only — same scene as the hero */
const Spline = dynamic(() => import('@splinetool/react-spline'), {
    ssr: false,
    loading: () => <div style={{ position: 'absolute', inset: 0, background: '#030712' }} />,
});

export default function LoginPage() {
    const [flipped, setFlipped] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Login state
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // Register state
    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');

    const router = useRouter();

    const flip = () => setFlipped(f => !f);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: loginEmail, password: loginPassword })
            });
            const data = await res.json();
            if (res.ok) {
                // Save basic session context, routing to dashboard
                localStorage.setItem('medidost_user_name', data.user.name);
                localStorage.setItem('medidost_user_email', data.user.email);
                router.push('/dashboard');
            } else {
                alert(data.error);
                setIsLoading(false);
            }
        } catch (error) {
            alert('Failed to connect to server.');
            setIsLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: regName, email: regEmail, password: regPassword })
            });
            const data = await res.json();
            if (res.ok) {
                alert('Registration successful! Check your email or login directly.');
                setFlipped(false); // Flip back to login side
                setIsLoading(false);
            } else {
                alert(data.error);
                setIsLoading(false);
            }
        } catch (error) {
            alert('Failed to connect to server.');
            setIsLoading(false);
        }
    };

    const handleGoogleAuth = () => {
        setIsLoading(true);
        // During a hackathon without a real Google Cloud Client ID configured,
        // we simulate the Google OAuth popup and login success flow.
        setTimeout(() => {
            localStorage.setItem('medidost_user_name', 'Google User');
            localStorage.setItem('medidost_user_email', 'google.user@example.com');
            router.push('/dashboard');
        }, 1200);
    };

    return (
        <div className="auth-container">

            {/* ── Full-screen Spline background (motion trails scene) ── */}
            <div className="auth-spline-bg">
                <Spline
                    scene="https://prod.spline.design/qw3R67SM2DvAGBtS/scene.splinecode"
                    style={{ width: '100%', height: '100%' }}
                />
            </div>

            {/* ── 10% black overlay ── */}
            <div className="auth-overlay" />

            <a href="/" className="auth-back">
                <span style={{ fontSize: '18px' }}>←</span> Back to Home
            </a>

            {/* ── 3-D flip scene ── */}
            <div className={`flip-scene ${flipped ? 'is-flipped' : ''}`}>
                <div className="flip-card">

                    {/* ────────── FRONT: Login ────────── */}
                    <div className="flip-face flip-front">
                        <div className="auth-header">
                            <div className="logo-mark" style={{ margin: '0 auto 20px' }}>🩺</div>
                            <h2>Welcome Back</h2>
                            <p>Sign in to access your health dashboard</p>
                        </div>

                        <form onSubmit={handleLogin} className="auth-form">
                            <div className="form-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={loginEmail}
                                    onChange={e => setLoginEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <label>Password</label>
                                    <a href="#" className="auth-link" style={{ fontSize: '0.78rem', fontWeight: 500 }}>Forgot?</a>
                                </div>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={loginPassword}
                                    onChange={e => setLoginPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <button type="submit" className="btn-primary auth-submit" disabled={isLoading}>
                                {isLoading ? 'Signing In…' : 'Sign In →'}
                            </button>

                            <div className="auth-divider">
                                <span>or continue with</span>
                            </div>

                            <button type="button" className="btn-google" onClick={handleGoogleAuth} disabled={isLoading}>
                                <svg width="20" height="20" viewBox="0 0 48 48">
                                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                                    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                                    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                                    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                                </svg>
                                {isLoading ? 'Connecting…' : 'Sign in with Google'}
                            </button>
                        </form>

                        <div className="auth-footer">
                            Don&apos;t have an account?{' '}
                            <button type="button" className="auth-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit' }} onClick={flip}>
                                Create one
                            </button>
                        </div>
                    </div>

                    {/* ────────── BACK: Register ────────── */}
                    <div className="flip-face flip-back">
                        <div className="auth-header">
                            <div className="logo-mark" style={{ margin: '0 auto 20px' }}>🩺</div>
                            <h2>Create Account</h2>
                            <p>Join AI-MediDost and take control of your health</p>
                        </div>

                        <form onSubmit={handleRegister} className="auth-form">
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    placeholder="Rahul Sharma"
                                    value={regName}
                                    onChange={e => setRegName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    placeholder="you@email.com"
                                    value={regEmail}
                                    onChange={e => setRegEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    placeholder="Min. 8 characters"
                                    value={regPassword}
                                    onChange={e => setRegPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)' }}>
                                By signing up you agree to our{' '}
                                <a href="#" className="auth-link">Terms</a> &amp;{' '}
                                <a href="#" className="auth-link">Privacy Policy</a>.
                            </div>

                            <button type="submit" className="btn-primary auth-submit" disabled={isLoading}>
                                {isLoading ? 'Creating Account…' : 'Get Started →'}
                            </button>

                            <div className="auth-divider">
                                <span>or register with</span>
                            </div>

                            <button type="button" className="btn-google" onClick={handleGoogleAuth} disabled={isLoading}>
                                <svg width="20" height="20" viewBox="0 0 48 48">
                                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                                    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                                    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                                    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                                </svg>
                                {isLoading ? 'Connecting…' : 'Sign up with Google'}
                            </button>
                        </form>

                        <div className="auth-footer">
                            Already have an account?{' '}
                            <button type="button" className="auth-link" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit' }} onClick={flip}>
                                Sign in
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
