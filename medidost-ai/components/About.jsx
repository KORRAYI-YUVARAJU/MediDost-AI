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
                    <div className="about-image-card">
                        <div className="about-quote">
                            &quot;The most powerful tool in medicine is a patient who understands their own health.&quot;
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
