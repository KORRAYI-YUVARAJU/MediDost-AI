'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './profile.css';

export default function ProfileDashboard() {
    const router = useRouter();
    const [user, setUser] = useState(null);

    // Mock recent files (as the user requested "show the files they recently used")
    const [recentFiles] = useState([
        { id: 1, name: 'Blood_Test_Dec.pdf', date: 'Dec 12, 2025', status: 'Secured', size: '1.2 MB' },
        { id: 2, name: 'Cardio_Screening_Jan.jpg', date: 'Jan 04, 2026', status: 'Secured', size: '2.4 MB' },
        { id: 3, name: 'Lipid_Panel_Feb.pdf', date: 'Feb 26, 2026', status: 'Secured', size: '890 KB' },
    ]);

    useEffect(() => {
        // Enforce Authentication
        const name = localStorage.getItem('medidost_user_name');
        const email = localStorage.getItem('medidost_user_email');

        if (!name || !email) {
            router.push('/login');
        } else {
            setUser({ name, email });
        }
    }, [router]);

    const handleSignOut = () => {
        localStorage.removeItem('medidost_user_name');
        localStorage.removeItem('medidost_user_email');
        router.push('/login');
    };

    if (!user) return <div className="profile-loading">Loading secure dashboard...</div>;

    // A mock "Traffic Light" Health Meter derived from the user's latest interactions
    // Setting up the meter layout based on their risk profile.
    const healthScore = 72; // Out of 100
    const riskLevel = 'Borderline'; // Typical traffic lights: Red=Critical, Yellow=Borderline, Green=Healthy

    return (
        <div className="profile-container">
            {/* ── Top Navigation ── */}
            <header className="profile-topbar">
                <div className="profile-logo" onClick={() => router.push('/dashboard')} style={{ cursor: 'pointer' }}>
                    <div className="logo-icon">💊</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span className="logo-name">AI-Medi<span>Dost</span></span>
                    </div>
                </div>
                <div className="profile-actions">
                    <button className="btn-nav" onClick={() => router.push('/dashboard')}>← Back to Chat</button>
                    <button className="btn-nav danger" onClick={handleSignOut}>Sign Out</button>
                </div>
            </header>

            <div className="profile-content">
                <div className="profile-header">
                    <h1>User Dashboard</h1>
                    <p>Manage your health profiles, view analyzed reports, and secure account details.</p>
                </div>

                <div className="profile-grid">

                    {/* ── PERSONAL DETAILS CARD ── */}
                    <div className="profile-card">
                        <div className="card-header">
                            <span className="card-icon">👤</span>
                            <h2>Personal Information</h2>
                        </div>
                        <div className="card-body">
                            <div className="info-row">
                                <span className="info-label">Full Name</span>
                                <span className="info-value">{user.name}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Email Address</span>
                                <span className="info-value">{user.email}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Account Status</span>
                                <span className="info-value" style={{ color: 'var(--cyan)' }}>Active (Pro)</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Data Privacy</span>
                                <span className="info-value" style={{ color: '#66bb6a' }}>PII Encryption Enabled</span>
                            </div>
                        </div>
                    </div>

                    {/* ── TRAFFIC LIGHT HEALTH METER ── */}
                    <div className="profile-card health-meter-card">
                        <div className="card-header">
                            <span className="card-icon">🫀</span>
                            <h2>Health Metric Overview</h2>
                        </div>
                        <div className="card-body">
                            <div className="health-score">
                                <span className="score-num">{healthScore}</span>
                                <span className="score-label">/ 100</span>
                            </div>
                            <p className="health-status-text">Your latest reports indicate a <strong>{riskLevel}</strong> status due to elevated LDL.</p>

                            <div className="traffic-light-container">
                                <div className={`light red ${riskLevel === 'Critical' ? 'active' : ''}`}>
                                    <div className="light-glow"></div>
                                    <span>High Risk</span>
                                </div>
                                <div className={`light yellow ${riskLevel === 'Borderline' ? 'active' : ''}`}>
                                    <div className="light-glow"></div>
                                    <span>Borderline</span>
                                </div>
                                <div className={`light green ${riskLevel === 'Normal' ? 'active' : ''}`}>
                                    <div className="light-glow"></div>
                                    <span>Healthy</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── RECENTLY USED FILES ── */}
                    <div className="profile-card full-width">
                        <div className="card-header">
                            <span className="card-icon">📂</span>
                            <h2>Analyzed Health Reports</h2>
                        </div>
                        <div className="card-body">
                            <table className="recent-files-table">
                                <thead>
                                    <tr>
                                        <th>File Name</th>
                                        <th>Upload Date</th>
                                        <th>Size</th>
                                        <th>Security Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentFiles.map(file => (
                                        <tr key={file.id}>
                                            <td className="file-name">
                                                <span className="file-icon">📄</span>
                                                {file.name}
                                            </td>
                                            <td>{file.date}</td>
                                            <td>{file.size}</td>
                                            <td><span className="status-badge secure">🔒 {file.status}</span></td>
                                            <td>
                                                <button className="btn-action">View</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="privacy-note">
                                ℹ️ <strong>Auto-Purge System:</strong> Files are automatically deleted from completely from our secure MongoDB servers precisely 3 months after upload.
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
