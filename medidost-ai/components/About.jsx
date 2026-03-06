export default function About() {
    return (
        <section id="about" className="section container">
            <div className="about-wrap">
                <div className="about-content">
                    <div className="section-label" style={{ background: 'rgba(167, 139, 250, 0.08)', color: 'var(--violet)' }}>
                        <span style={{ fontSize: '10px' }}>●</span> OUR MISSION
                    </div>
                    <h2 className="section-title">Democratising Medical Knowledge</h2>
                    <p className="about-desc">
                        Medical reports are notoriously difficult to decipher. Countless patients face anxiety and confusion after receiving lab results, often waiting days to see a specialist who can explain what the numbers mean.
                    </p>
                    <p className="about-desc">
                        <strong>AI-MediDost</strong> was built to bridge this gap. We leverage advanced Artificial Intelligence to translate complex medical terminology into clear, accessible language — in your native tongue.
                    </p>
                    <p className="about-desc">
                        Our goal isn't to replace doctors, but to empower you as a patient. When you understand your health metrics, you can ask better questions and make informed decisions. Clarity over anxiety.
                    </p>

                    <div className="about-stats">
                        <div className="about-stat">
                            <div className="astat-num">Zero</div>
                            <div className="astat-label">Medical Jargon</div>
                        </div>
                        <div className="about-stat">
                            <div className="astat-num">Multilingual</div>
                            <div className="astat-label">Support</div>
                        </div>
                    </div>
                </div>

                <div className="about-image-wrap">
                    <div className="about-image-glow" />
                    <div className="about-image-card" style={{ padding: 0, overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                        <div className="sketchfab-embed-wrapper" style={{ width: '100%', height: '100%', minHeight: '400px', flex: 1 }}>
                            <iframe
                                title="Animated Full Human Body Anatomy"
                                frameBorder="0"
                                allowFullScreen
                                mozallowfullscreen="true"
                                webkitallowfullscreen="true"
                                allow="autoplay; fullscreen; xr-spatial-tracking"
                                xr-spatial-tracking="true"
                                execution-while-out-of-viewport="true"
                                execution-while-not-rendered="true"
                                web-share="true"
                                src="https://sketchfab.com/models/9b0b079953b840bc9a13f524b60041e4/embed?autospin=1&autostart=1&camera=0&transparent=1&ui_hint=0&ui_theme=dark&dnt=1"
                                style={{ width: '100%', height: '100%' }}
                            ></iframe>
                        </div>
                        <div className="about-quote" style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', zIndex: 10, background: 'rgba(3, 7, 18, 0.7)', backdropFilter: 'blur(10px)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            &quot;The most powerful tool in medicine is a patient who understands their own health.&quot;
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
