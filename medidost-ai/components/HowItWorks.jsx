export default function HowItWorks() {
    return (
        <section id="how" className="section container">
            <div className="section-head text-center" style={{ margin: '0 auto 60px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="section-label" style={{ background: 'rgba(59,158,255,0.08)', color: 'var(--cyan)' }}>
                    <span style={{ fontSize: '10px' }}>●</span> SIMPLE PROCESS
                </div>
                <h2 className="section-title">How MediDost AI Works</h2>
                <p className="section-sub" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    From uploading your report to getting a clear, actionable analysis in your preferred language — healthcare made simple.
                </p>
            </div>

            <div className="how-grid">
                {/* Step 1 */}
                <div className="how-step">
                    <div className="how-number">1</div>
                    <div className="how-icon">👤</div>
                    <h3 className="how-title">Quick Registration</h3>
                    <p className="how-desc">
                        Sign up securely to create your profile. We prioritise privacy — your data is processed locally and never shared.
                    </p>
                </div>

                {/* Step 2 */}
                <div className="how-step">
                    <div className="how-number">2</div>
                    <div className="how-icon">📄</div>
                    <h3 className="how-title">Upload Your Report</h3>
                    <p className="how-desc">
                        Drag and drop your PDF or image-based medical report directly into the dashboard. Our AI extracts the text instantly.
                    </p>
                </div>

                {/* Step 3 */}
                <div className="how-step">
                    <div className="how-number">3</div>
                    <div className="how-icon">🧠</div>
                    <h3 className="how-title">AI Analysis</h3>
                    <p className="how-desc">
                        MediDost scans and flags critical, borderline, and normal biomarkers. Complex terms are simplified instantly.
                    </p>
                </div>

                {/* Step 4 */}
                <div className="how-step">
                    <div className="how-number">4</div>
                    <div className="how-icon">💬</div>
                    <h3 className="how-title">Chat & Learn</h3>
                    <p className="how-desc">
                        Select your preferred language (Hindi, Telugu, etc.) and ask our AI assistant to explain your report or suggest next steps.
                    </p>
                </div>
            </div>
        </section>
    );
}
