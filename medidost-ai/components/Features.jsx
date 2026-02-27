const categories = [
    {
        label: 'Core AI Features',
        features: [
            {
                icon: '🧬',
                color: 'cyan',
                badge: 'NLP · LLM',
                title: 'Intelligent Jargon Extraction',
                desc: 'Automatically identifies complex clinical terms and translates them into simple, everyday language anyone can understand.',
            },
            {
                icon: '🌐',
                color: 'violet',
                badge: '10+ Languages',
                title: 'Multilingual Support',
                desc: 'Instant conversion of report summaries into 10+ regional languages — Hindi, Telugu, Tamil, Bengali, Marathi and more.',
            },
            {
                icon: '💬',
                color: 'emerald',
                badge: 'Empathy-First',
                title: 'Empathetic Summarization',
                desc: 'A "Human-in-the-loop" feel that provides a 2-line TL;DR to reduce patient anxiety and deliver clarity with care.',
            },
            {
                icon: '🛡️',
                color: 'rose',
                badge: 'Safety Layer',
                title: 'Responsible AI Guardrails',
                desc: 'Built-in safety layers ensure the AI explains data without giving unverified medical prescriptions or diagnoses.',
            },
        ],
    },
    {
        label: 'Interactive & Visual Features',
        features: [
            {
                icon: '🫀',
                color: 'violet',
                badge: '3D · Spline',
                title: 'Spline-Powered 3D Model',
                desc: 'An interactive human anatomy model that physically maps out where the lab markers are affecting the body in real time.',
            },
            {
                icon: '🌡️',
                color: 'rose',
                badge: 'Visual AI',
                title: 'Heat-Zone Mapping',
                desc: 'Visual color-coding (Red/Yellow/Green) on the 3D anatomy model based on whether test results are out of healthy range.',
            },
            {
                icon: '📊',
                color: 'cyan',
                badge: 'React · UI',
                title: 'Responsive Dashboard',
                desc: 'A clean, stress-free UI designed for high-stress medical contexts — optimised for both mobile and desktop.',
            },
        ],
    },
    {
        label: 'Privacy & Security',
        features: [
            {
                icon: '🔒',
                color: 'emerald',
                badge: 'Privacy-First',
                title: 'Automated PII Scrubber',
                desc: 'A privacy-first layer that automatically redacts names, addresses, and IDs before any data reaches the AI model.',
            },
            {
                icon: '👤',
                color: 'amber',
                badge: 'Ghost Profile',
                title: 'Anonymized Processing',
                desc: 'Your health data is analyzed as a "ghost profile" — maintaining 100% patient confidentiality end-to-end.',
            },
            {
                icon: '📷',
                color: 'cyan',
                badge: 'Vision AI',
                title: 'OCR Integration',
                desc: 'High-accuracy extraction of data from both digital PDFs and physical photos of medical reports via camera.',
            },
        ],
    },
    {
        label: 'Functional Workflow',
        features: [
            {
                icon: '📤',
                color: 'violet',
                badge: 'Instant',
                title: 'Direct Upload & Scan',
                desc: 'Seamless drag-and-drop or camera-based input for instant report analysis — no technical knowledge required.',
            },
            {
                icon: '🧭',
                color: 'emerald',
                badge: 'Guidance',
                title: 'Actionable Next Steps',
                desc: 'Provides clear guidance on which specialist to consult next — like "See a Nutritionist" — based on your actual results.',
            },
            {
                icon: '🔤',
                color: 'rose',
                badge: 'One-Click',
                title: 'One-Click Language Toggle',
                desc: 'Instantly flip between English and your mother tongue within the dashboard without losing any context or data.',
            },
        ],
    },
];

export default function Features() {
    return (
        <section className="section" id="features">
            <div className="container">
                <div className="section-head">
                    <div className="section-label" style={{ background: 'var(--cyan-dim)', color: 'var(--cyan)', border: '1px solid rgba(34,211,238,0.2)' }}>
                        ✦ Full Feature Set
                    </div>
                    <h2 className="section-title">
                        Everything you need to<br />
                        <span className="gradient-text">understand your health</span>
                    </h2>
                    <p className="section-sub">
                        From AI-powered simplification to 3D anatomy mapping — MediDost AI
                        bridges the gap between complex reports and real understanding.
                    </p>
                </div>

                {categories.map((cat) => (
                    <div className="feature-category" key={cat.label}>
                        <div className="fc-header">
                            <span className="fc-label">{cat.label}</span>
                            <div className="fc-line" />
                        </div>
                        <div className="features-grid">
                            {cat.features.map((f) => (
                                <div className={`feature-card ${f.color}`} key={f.title}>
                                    <div className="feature-card-badge">{f.badge}</div>
                                    <div className="feature-icon">{f.icon}</div>
                                    <div className="feature-title">{f.title}</div>
                                    <p className="feature-desc">{f.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
