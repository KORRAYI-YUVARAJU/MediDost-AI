'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import './dashboard.css';
import './analysis.css';

const AnatomyViewer = dynamic(() => import('@/components/AnatomyViewer'), { ssr: false });

const ORGAN_TABS = [
    { emoji: '🫀', label: 'Cardiovascular', zone: 'cardiovascular' },
    { emoji: '🫁', label: 'Renal', zone: 'renal' },
    { emoji: '🦴', label: 'Skeletal', zone: 'skeletal' },
];

/* ── Mock biomarker data (shown after upload) ── */
const BIOMARKERS = [
    { name: 'LDL Cholesterol', normal: '< 100', value: '168', unit: 'mg/dL', status: 'critical', zone: 'cardiovascular' },
    { name: 'Blood Pressure', normal: '< 120/80', value: '148/94', unit: 'mmHg', status: 'critical', zone: 'cardiovascular' },
    { name: 'Hemoglobin', normal: '13.5–17.5 (M) / 12–15.5 (F)', value: '10.8', unit: 'g/dL', status: 'borderline', zone: 'renal' },
    { name: 'Blood Glucose (Fasting)', normal: '70–100', value: '118', unit: 'mg/dL', status: 'borderline', zone: 'renal' },
    { name: 'Vitamin D (25-OH)', normal: '30–100', value: '14', unit: 'ng/mL', status: 'critical', zone: 'skeletal' },
    { name: 'TSH (Thyroid)', normal: '0.4–4.0', value: '2.4', unit: 'mIU/L', status: 'normal', zone: null },
    { name: 'Creatinine', normal: '0.7–1.3', value: '0.9', unit: 'mg/dL', status: 'normal', zone: 'renal' },
    { name: 'ALT (Liver Enzyme)', normal: '7–40', value: '52', unit: 'U/L', status: 'borderline', zone: null },
];

const STATUS = {
    critical: { color: '#ff5252', dim: 'rgba(255,82,82,0.12)', icon: '⊗', label: 'Critical' },
    borderline: { color: '#ffb74d', dim: 'rgba(255,183,77,0.12)', icon: '⚠', label: 'Borderline' },
    normal: { color: '#66bb6a', dim: 'rgba(102,187,106,0.12)', icon: '✓', label: 'Normal' },
};

const AI_RESPONSES = {
    'What does LDL mean?': '🩺 **LDL (Low-Density Lipoprotein)** is "bad cholesterol." Your LDL is **168 mg/dL** — significantly above the safe limit of 100.\n\n⚠️ This puts you at elevated risk for arterial plaque. Reduce saturated fats and consult a Cardiologist.',
    'How to lower BP?': '💊 Your BP is **148/94 mmHg** (Stage 1 Hypertension).\n\n• Reduce sodium (< 1500 mg/day)\n• Exercise 30 min/day, 5×/week\n• DASH diet: fruits, veggies, whole grains\n• Limit alcohol, quit smoking\n• Monitor daily — target < 120/80',
    'Explain in Hindi': '🙏 आपकी रिपोर्ट के अनुसार:\n\n🔴 **LDL कोलेस्ट्रॉल** 168 mg/dL — बहुत अधिक है (सामान्य < 100)\n🔴 **ब्लड प्रेशर** 148/94 — उच्च रक्तचाप\n🟡 **हीमोग्लोबिन** 10.8 — कम है, एनीमिया संभव\n🔴 **विटामिन D** 14 — बहुत कम, हड्डियों के लिए खतरनाक\n\nकृपया डॉक्टर से मिलें।',
    'What is hemoglobin?': '🩸 **Hemoglobin** carries oxygen in your blood. Your level is **10.8 g/dL** — below normal (13.5–17.5 for men).\n\n📊 This indicates mild **Anaemia**. Increase iron-rich foods (spinach, lentils, meat) and consider iron supplements with Vitamin C.',
    default: (q) => `🤖 Based on your report (Rahul_Lab_Report_Feb2026):\n\nYou asked: *"${q}"*\n\nYour report shows 3 critical findings. I recommend discussing LDL, Blood Pressure, and Vitamin D levels with your doctor. Shall I explain any specific biomarker?`,
};

const INITIAL_MESSAGES = [{
    id: 1, from: 'ai',
    text: 'Namaste! 🙏 I\'m your AI-MediDost — your personal health companion.\n\nUpload your lab report to get started. I\'ll explain every biomarker in simple, plain language — no medical jargon!\n\n💡 Available in Hindi, Telugu, Tamil, Bengali, and Marathi.',
}];

const POST_UPLOAD_MESSAGE = {
    id: 2, from: 'ai',
    text: '📊 **Report Analysis Complete!**\n\nI found **8 biomarkers** in your report:\n🔴 3 Critical · 🟡 3 Borderline · 🟢 2 Normal\n\n**Urgent:** Your LDL (168 mg/dL) and Vitamin D (14 ng/mL) need immediate attention. Click any biomarker on the left to learn more.',
};

export default function DashboardPage() {
    const [activeZone, setActiveZone] = useState('cardiovascular');
    const [messages, setMessages] = useState(INITIAL_MESSAGES);
    const [inputVal, setInputVal] = useState('');
    const [voiceOn, setVoiceOn] = useState(false);
    const [listening, setListening] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [refreshSpin, setRefreshSpin] = useState(false);
    const [uploadedName, setUploadedName] = useState(null);
    const [isAnalysing, setIsAnalysing] = useState(false);
    const [isAnalysed, setIsAnalysed] = useState(false);
    const [selectedBio, setSelectedBio] = useState(null);
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [language, setLanguage] = useState('English (English)');
    const [authUserName, setAuthUserName] = useState('');
    const router = useRouter();

    // Enforce User Authentication bounds on the dashboard
    useEffect(() => {
        const name = localStorage.getItem('medidost_user_name');
        if (!name) {
            router.push('/login');
        } else {
            setAuthUserName(name);
        }
    }, [router]);

    // DB session tracker
    const sessionIdRef = useRef('session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9));

    // Fix closure staleness for TTS trigger inside async loops
    const voiceOnRef = useRef(voiceOn);
    useEffect(() => { voiceOnRef.current = voiceOn; }, [voiceOn]);

    const triggerSpeech = useCallback((textToSpeak) => {
        if (!textToSpeak) return;
        const cleanText = textToSpeak
            .replace(/\*\*/g, '')
            .replace(/#/g, '')
            .replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')
            .trim();

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(cleanText);

        const voices = window.speechSynthesis.getVoices();
        let langCode = 'en-IN';
        if (language === 'Hindi') langCode = 'hi-IN';
        else if (language === 'Marathi') langCode = 'mr-IN';
        else if (language === 'Tamil') langCode = 'ta-IN';
        else if (language === 'Telugu') langCode = 'te-IN';
        else if (language === 'Bengali') langCode = 'bn-IN';

        utterance.lang = langCode;

        // Strictly try to find a voice that matches the selected language
        // This prevents the bug where an English voice tries to read Hindi text
        const baseLang = langCode.split('-')[0]; // 'hi', 'te', 'mr'

        let targetVoice = voices.find(v => v.lang === langCode);
        if (!targetVoice) {
            // Fallback to any voice that matches the base dialect (e.g., 'hi')
            targetVoice = voices.find(v => v.lang.startsWith(baseLang));
        }

        if (targetVoice) {
            utterance.voice = targetVoice;
        }

        window.speechSynthesis.speak(utterance);
    }, [language]);
    const fileInputRef = useRef(null);
    const chatEndRef = useRef(null);

    /* ── Panel resize state ── */
    const [leftW, setLeftW] = useState(260);   // px
    const [rightW, setRightW] = useState(320);   // px
    const LEFT_MIN = 180, LEFT_MAX = 420;
    const RIGHT_MIN = 240, RIGHT_MAX = 500;

    /* Generic resize-handle hook */
    const useResizeHandle = (setter, min, max, direction = 'right') => {
        const dragging = useRef(false);
        const startX = useRef(0);
        const startW = useRef(0);

        const onMouseDown = useCallback((e, currentW) => {
            e.preventDefault();
            dragging.current = true;
            startX.current = e.clientX;
            startW.current = currentW;
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';

            const onMove = (ev) => {
                if (!dragging.current) return;
                const delta = direction === 'right'
                    ? ev.clientX - startX.current
                    : startX.current - ev.clientX;
                setter(Math.min(max, Math.max(min, startW.current + delta)));
            };
            const onUp = () => {
                dragging.current = false;
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
                window.removeEventListener('mousemove', onMove);
                window.removeEventListener('mouseup', onUp);
            };
            window.addEventListener('mousemove', onMove);
            window.addEventListener('mouseup', onUp);
        }, [setter, min, max, direction]);

        return onMouseDown;
    };

    const onDragLeft = useResizeHandle(setLeftW, LEFT_MIN, LEFT_MAX, 'right');
    const onDragRight = useResizeHandle(setRightW, RIGHT_MIN, RIGHT_MAX, 'left');

    useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

    const sendMessage = async (text) => {
        if (!text.trim()) return;
        const userMsg = { id: Date.now(), from: 'user', text: text.trim() };
        setMessages(prev => [...prev, userMsg]);
        setInputVal('');
        setIsTyping(true);

        try {
            // Build report context string for Gemini if report is analysed
            const reportContext = isAnalysed
                ? `Patient report (${uploadedName}): ${BIOMARKERS.map(b =>
                    `${b.name}: ${b.value} ${b.unit} (${b.status})`
                ).join(', ')}`
                : null;

            // Only send the last 10 messages as history (keep token usage low)
            const recentHistory = messages.slice(-10).filter(m => m.from !== 'typing');

            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text.trim(),
                    history: recentHistory,
                    reportContext,
                    language,
                    sessionId: sessionIdRef.current,
                }),
            });

            if (!res.ok) throw new Error('API Error');
            if (!res.body) throw new Error('No stream body');

            const reader = res.body.getReader();
            const decoder = new TextDecoder();

            // Turn off the typing dots indicator once we start receiving the stream
            setIsTyping(false);

            // Create a stub message for the AI that we will update progressively
            const aiMsgId = Date.now() + 1;
            setMessages(prev => [...prev, { id: aiMsgId, from: 'ai', text: '' }]);

            let accumulatedText = '';

            // Consume stream chunks as they arrive
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunkText = decoder.decode(value, { stream: true });
                accumulatedText += chunkText;

                // Update the specific AI message in real-time
                setMessages(prev =>
                    prev.map(msg => msg.id === aiMsgId ? { ...msg, text: accumulatedText } : msg)
                );
            }

            // ── Voice Output Trigger ──
            if (voiceOnRef.current && accumulatedText) {
                triggerSpeech(accumulatedText);
            }
        } catch (err) {
            console.error('Chat error:', err);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                from: 'ai',
                text: '⚠️ Connection error. Please check your internet and try again.',
            }]);
            setIsTyping(false);
        }
    };

    const handleChip = (q) => { setInputVal(q); sendMessage(q); };

    const handleRefresh = () => {
        setRefreshSpin(true);
        setTimeout(() => { setMessages(isAnalysed ? [INITIAL_MESSAGES[0], POST_UPLOAD_MESSAGE] : INITIAL_MESSAGES); setRefreshSpin(false); }, 500);
    };

    const handleUpload = async (e) => {
        const file = e?.target?.files?.[0];
        if (!file) return;
        setUploadedName(file.name);
        setIsAnalysing(true);
        setIsAnalysed(false);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('Upload failed');

            setIsAnalysing(false);
            setIsAnalysed(true);
            setMessages(prev => [...prev, POST_UPLOAD_MESSAGE]);
        } catch (error) {
            console.error('OCR Upload Error:', error);
            alert('Failed to analyze and secure document.');
            setIsAnalysing(false);
        }
    };

    const handleBioClick = (bio) => {
        setSelectedBio(bio);
        if (bio.zone) setActiveZone(bio.zone);
        sendMessage(`Explain my ${bio.name} result of ${bio.value} ${bio.unit}`);
    };

    const handleVoice = () => {
        if (listening) { setListening(false); return; }
        setListening(true);
        setTimeout(() => { setListening(false); setInputVal('What does my cholesterol level mean?'); }, 2500);
    };

    const formatMsg = (text) =>
        text.split('\n').map((line, i) => (
            <span key={i}>
                {line.split(/\*\*(.*?)\*\*/g).map((part, j) =>
                    j % 2 === 1
                        ? <strong key={j} style={{ color: 'var(--cyan)' }}>{part}</strong>
                        : part
                )}
                {i < text.split('\n').length - 1 && <br />}
            </span>
        ));

    const criticalCount = BIOMARKERS.filter(b => b.status === 'critical').length;
    const borderlineCount = BIOMARKERS.filter(b => b.status === 'borderline').length;
    const normalCount = BIOMARKERS.filter(b => b.status === 'normal').length;
    const criticalItems = BIOMARKERS.filter(b => b.status === 'critical');

    return (
        <div className="app-shell">
            {/* ── Top Bar ── */}
            <header className="topbar">
                <div className="topbar-logo">
                    <div className="logo-icon">💊</div>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span className="logo-name">AI-Medi<span>Dost</span></span>
                            <span className="pro-badge">PRO</span>
                        </div>
                        <div className="logo-sub">Advanced Medical Report Analysis</div>
                    </div>
                </div>
                <div className="topbar-actions">
                    {isAnalysed && (
                        <div className="report-active-badge">
                            <span className="report-active-dot" />
                            Report Active
                        </div>
                    )}
                    <button className="theme-toggle" title="Toggle theme">☀</button>
                    <button className="btn-topbar ghost" onClick={() => router.push('/')} title="Back to Home">
                        🏠 Home
                    </button>
                    <button className="btn-topbar ghost" onClick={() => router.push('/profile')}>
                        <span style={{ marginRight: '6px' }}>👤</span> {authUserName || 'Profile'}
                    </button>
                    <button className="btn-topbar primary" onClick={() => fileInputRef.current?.click()}>
                        + Analyse Report
                    </button>
                </div>
            </header>

            <div className="app-body" style={{ display: 'flex' }}>
                {/* ── LEFT PANEL ── */}
                <aside className="left-panel" style={{ width: leftW, flexShrink: 0 }}>
                    <input ref={fileInputRef} type="file" accept=".pdf,.jpg,.png,.jpeg"
                        style={{ display: 'none' }} onChange={handleUpload} />

                    {/* Upload / Active file */}
                    {!isAnalysed && !isAnalysing ? (
                        <div>
                            <div className="panel-section-label">Upload Report</div>
                            <div className="upload-zone" onClick={() => fileInputRef.current?.click()}>
                                <div className="upload-icon">⬆</div>
                                <div className="upload-title">Upload PDF Report</div>
                                <div className="upload-sub">Drag &amp; drop or click to browse</div>
                                <div className="upload-tag">📄 PDF · JPG · PNG</div>
                            </div>
                            <div style={{ marginTop: '12px', fontSize: '0.65rem', color: 'var(--text-subtle)', textAlign: 'center', background: 'rgba(255,255,255,0.02)', padding: '8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.04)' }}>
                                🔒 <strong>Privacy Assured:</strong> All uploaded files are PII-encrypted safely and automatically purged from our servers within 3 months.
                            </div>
                        </div>
                    ) : isAnalysing ? (
                        <div className="analyse-progress-wrap">
                            <div className="panel-section-label">Upload Report</div>
                            <div className="analyse-file-card">
                                <div className="analyse-file-icon">📄</div>
                                <div>
                                    <div className="analyse-file-name">{uploadedName}</div>
                                    <div className="analyse-file-sub">Analysing with AI OCR…</div>
                                </div>
                            </div>
                            <div className="analyse-bar-track">
                                <div className="analyse-bar-fill" />
                            </div>
                            <div className="analyse-steps">
                                <span>Extracting text…</span>
                                <span className="analyse-steps-dot">●</span>
                                <span>Mapping biomarkers…</span>
                                <span className="analyse-steps-dot">●</span>
                                <span>AI analysis…</span>
                            </div>
                        </div>
                    ) : (
                        /* ── POST-ANALYSIS LEFT PANEL ── */
                        <>
                            {/* Active file card */}
                            <div>
                                <div className="panel-section-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    Upload Report
                                    <span style={{ color: '#66bb6a', fontSize: '0.6rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#66bb6a', display: 'inline-block', animation: 'statusPulse 2s infinite' }} />
                                        Active
                                    </span>
                                </div>
                                <div className="active-file-card" onClick={() => fileInputRef.current?.click()}>
                                    <div className="active-file-icon">📄</div>
                                    <div style={{ flex: 1, overflow: 'hidden' }}>
                                        <div className="active-file-name">{uploadedName || 'Rahul_Lab_Report.pdf'}</div>
                                        <div className="active-file-meta">8 biomarkers analyzed · 27 Feb 2026</div>
                                    </div>
                                    <button className="active-file-close" onClick={e => { e.stopPropagation(); setIsAnalysed(false); setUploadedName(null); }}>✕</button>
                                </div>
                            </div>

                            {/* Overview stat cards */}
                            <div>
                                <div className="panel-section-label">Overview</div>
                                <div className="overview-stats">
                                    <div className="stat-card critical">
                                        <span className="stat-icon">⊗</span>
                                        <span className="stat-num">{criticalCount}</span>
                                        <span className="stat-label">Critical</span>
                                    </div>
                                    <div className="stat-card borderline">
                                        <span className="stat-icon">⚠</span>
                                        <span className="stat-num">{borderlineCount}</span>
                                        <span className="stat-label">Borderline</span>
                                    </div>
                                    <div className="stat-card normal">
                                        <span className="stat-icon">↑</span>
                                        <span className="stat-num">{normalCount}</span>
                                        <span className="stat-label">Normal</span>
                                    </div>
                                </div>
                            </div>

                            {/* Lab Biomarkers list */}
                            <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                                <div className="panel-section-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    Lab Biomarkers
                                    <span style={{ color: 'var(--text-subtle)', fontSize: '0.65rem' }}>{BIOMARKERS.length}</span>
                                </div>
                                <div className="biomarker-list">
                                    {BIOMARKERS.map((bio) => {
                                        const s = STATUS[bio.status];
                                        const isSelected = selectedBio?.name === bio.name;
                                        return (
                                            <div
                                                key={bio.name}
                                                className={`biomarker-row ${isSelected ? 'selected' : ''}`}
                                                style={{ '--s-color': s.color, '--s-dim': s.dim }}
                                                onClick={() => handleBioClick(bio)}
                                            >
                                                <span className="bio-icon" style={{ color: s.color }}>{s.icon}</span>
                                                <div className="bio-info">
                                                    <div className="bio-name">{bio.name}</div>
                                                    <div className="bio-normal">Normal: {bio.normal}</div>
                                                </div>
                                                <div className="bio-value" style={{ color: s.color }}>
                                                    {bio.value}
                                                    <span className="bio-unit">{bio.unit}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Recent Files */}
                    {!isAnalysed && (
                        <div>
                            <div className="panel-section-label">Recent Files</div>
                            {[
                                { name: 'Rahul_Lab_Report_Feb2026', date: '27 Feb 2026', size: '2.4 MB' },
                                { name: 'BloodTest_Jan2026.pdf', date: '15 Jan 2026', size: '1.8 MB' },
                            ].map((f) => (
                                <div className={`file-item ${selectedDoc === f.name ? 'selected' : ''}`} key={f.name}
                                    onClick={() => { setSelectedDoc(f.name); setIsAnalysed(true); setUploadedName(f.name); setMessages([INITIAL_MESSAGES[0], POST_UPLOAD_MESSAGE]); }}>
                                    <div className="file-icon">📄</div>
                                    <div style={{ flex: 1, overflow: 'hidden' }}>
                                        <div className="file-name">{f.name}</div>
                                        <div className="file-meta">{f.date} · {f.size}</div>
                                    </div>
                                    <div className="file-time">🕐</div>
                                </div>
                            ))}
                        </div>
                    )}


                    <div className="privacy-note">
                        <span>🔒</span>
                        <span>Privacy First: Your health data is processed locally and never stored.</span>
                    </div>
                </aside>

                {/* ── LEFT drag handle ── */}
                <ResizeDivider onMouseDown={(e) => onDragLeft(e, leftW)} />

                {/* ── CENTER PANEL ── */}
                <main className="center-panel">
                    <div className="center-label">Medical Anatomy • 2D Annotated View</div>
                    <div className="spline-frame">
                        <AnatomyViewer activeZone={isAnalysed ? activeZone : 'default'} />
                    </div>

                    {/* CRITICAL METRICS overlay (post-analysis) */}
                    {isAnalysed && (
                        <div className="critical-metrics-panel">
                            <div className="cm-header">⚡ Critical Metrics</div>
                            {criticalItems.map((bio) => (
                                <div key={bio.name} className="cm-card" onClick={() => handleBioClick(bio)}>
                                    <span className="cm-dot" />
                                    <div>
                                        <div className="cm-name">{bio.name}</div>
                                        <div className="cm-val">{bio.value} {bio.unit}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                </main>

                {/* ── RIGHT drag handle ── */}
                <ResizeDivider onMouseDown={(e) => onDragRight(e, rightW)} />

                {/* ── RIGHT PANEL: Chat ── */}
                <aside className="right-panel" style={{ width: rightW, flexShrink: 0 }}>
                    <div className="chat-header">
                        <div className="chat-agent">
                            <div className="agent-avatar">💬</div>
                            <div>
                                <div className="agent-name">AI-MediDost Chat</div>
                                <div className="agent-status">
                                    <span className="status-dot" style={{ animation: 'statusPulse 2s infinite' }} />
                                    Active &amp; Ready
                                </div>
                            </div>
                        </div>
                        <button className={`chat-refresh ${refreshSpin ? 'spinning' : ''}`} onClick={handleRefresh} title="Clear chat">↺</button>
                    </div>

                    <div className="chat-messages">
                        {messages.map((msg) => (
                            <div key={msg.id} className="msg-bubble"
                                style={{ flexDirection: msg.from === 'user' ? 'row-reverse' : 'row', animation: 'slideUp 0.3s ease' }}>
                                {msg.from === 'ai' && <div className="msg-avatar">🤝</div>}
                                <div className="msg-content" style={{
                                    background: msg.from === 'user'
                                        ? 'linear-gradient(135deg,#3b9eff22,#7c5cfc22)'
                                        : 'var(--surface)',
                                    borderRadius: msg.from === 'user' ? '12px 4px 12px 12px' : '4px 12px 12px 12px',
                                    borderColor: msg.from === 'user' ? 'rgba(59,158,255,0.3)' : undefined,
                                }}>
                                    {formatMsg(msg.text)}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="msg-bubble">
                                <div className="msg-avatar">🤝</div>
                                <div className="msg-content" style={{ padding: '12px 16px' }}>
                                    <span style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                                        {[0, 1, 2].map(i => (
                                            <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--cyan)', animation: `statusPulse 1.2s ${i * 0.2}s infinite`, display: 'inline-block' }} />
                                        ))}
                                    </span>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {messages.length < 3 && (
                        <>
                            <div className="chat-divider"><span>✦ Get Started</span></div>
                            <div className="quick-chips">
                                {['What does LDL mean?', 'How to lower BP?', 'Explain in Hindi', 'What is hemoglobin?'].map((q) => (
                                    <div className="chip" key={q} onClick={() => handleChip(q)}>{q}</div>
                                ))}
                            </div>
                        </>
                    )}

                    <div className="chat-input-wrap">

                        {/* ── NLP Settings bar — language + voice, always visible ── */}
                        <div className="nlp-bar">
                            {/* Language selector */}
                            <div className="nlp-bar-item">
                                <span className="nlp-bar-icon">🌐</span>
                                <select
                                    className="nlp-lang-select"
                                    value={language}
                                    onChange={e => setLanguage(e.target.value)}
                                    title="Response language — affects AI replies & suggestions"
                                >
                                    <option value="English">EN</option>
                                    <option value="Hindi">हिन्दी</option>
                                    <option value="Telugu">తెలుగు</option>
                                    <option value="Tamil">தமிழ்</option>
                                    <option value="Bengali">বাংলা</option>
                                    <option value="Marathi">मराठी</option>
                                </select>
                            </div>

                            <div className="nlp-bar-sep" />

                            {/* Voice readout toggle */}
                            <button
                                className={`nlp-voice-btn ${voiceOn ? 'on' : ''}`}
                                onClick={() => setVoiceOn(v => {
                                    if (v) {
                                        window.speechSynthesis.cancel();
                                    } else {
                                        // Turning ON -> Read the last AI message instantly
                                        const lastAiMsg = messages.filter(m => m.from === 'ai').pop();
                                        if (lastAiMsg?.text) triggerSpeech(lastAiMsg.text);
                                    }
                                    return !v;
                                })}
                                title={voiceOn ? 'Voice readout ON — click to mute' : 'Voice readout OFF — click to enable'}
                            >
                                {voiceOn ? '🔊' : '🔇'}
                                <span>{voiceOn ? 'Voice On' : 'Voice Off'}</span>
                            </button>

                            <div className="nlp-bar-sep" />

                            {/* Active NLP context indicator */}
                            <div className="nlp-context-pill">
                                <span className="nlp-dot" />
                                {language !== 'English' ? `Replying in ${language}` : 'NLP Active'}
                            </div>
                        </div>

                        {/* ── Text input row ── */}
                        <div className="chat-input-box">
                            <input type="text" placeholder="Ask me about your health..."
                                value={inputVal} onChange={e => setInputVal(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && sendMessage(
                                    language !== 'English' ? `[Reply in ${language}] ${inputVal}` : inputVal
                                )} />
                            <button className={`chat-input-btn ${listening ? 'listening' : ''}`} onClick={handleVoice}
                                title={listening ? 'Listening...' : 'Voice input'}>{listening ? '🔴' : '🎤'}</button>
                            <button className="chat-send-btn" onClick={() => sendMessage(
                                language !== 'English' ? `[Reply in ${language}] ${inputVal}` : inputVal
                            )} title="Send">➤</button>
                        </div>
                    </div>

                    <div className="chat-disclaimer">
                        <span className="disclaimer-icon">⚠</span>
                        <span><strong>Medical Disclaimer:</strong> AI-MediDost provides educational information only. Always consult a qualified healthcare provider.</span>
                    </div>
                </aside>
            </div>
        </div>
    );
}

/* ── Resize Divider ─────────────────────────────────────────────── */
function ResizeDivider({ onMouseDown }) {
    const [hov, setHov] = useState(false);
    return (
        <div
            onMouseDown={onMouseDown}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                width: 6,
                flexShrink: 0,
                cursor: 'col-resize',
                background: 'transparent',
                position: 'relative',
                zIndex: 30,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s',
            }}
        >
            {/* Visual line that brightens on hover */}
            <div style={{
                width: 2,
                height: '100%',
                borderRadius: 99,
                background: hov
                    ? 'rgba(34, 211, 238, 0.55)'
                    : 'rgba(255, 255, 255, 0.07)',
                transition: 'background 0.2s',
                boxShadow: hov ? '0 0 8px rgba(34,211,238,0.4)' : 'none',
            }} />

            {/* Drag grip dots — visible on hover */}
            {hov && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                    pointerEvents: 'none',
                }}>
                    {[0, 1, 2, 3, 4].map(i => (
                        <div key={i} style={{
                            width: 4, height: 4,
                            borderRadius: '50%',
                            background: '#22d3ee',
                            opacity: 0.9,
                        }} />
                    ))}
                </div>
            )}
        </div>
    );
}
