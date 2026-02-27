export default function Privacy() {
    return (
        <section id="privacy" className="section container">
            <div className="section-head text-center" style={{ margin: '0 auto 60px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="section-label" style={{ background: 'rgba(52,211,153,0.08)', color: 'var(--emerald)' }}>
                    <span style={{ fontSize: '10px' }}>●</span> STRICTLY CONFIDENTIAL
                </div>
                <h2 className="section-title">Your Data Stays Yours</h2>
                <p className="section-sub" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    Medical information is highly sensitive. We built MediDost AI from the ground up to ensure your data never leaves your control.
                </p>
            </div>

            <div className="privacy-grid">
                <div className="privacy-card">
                    <div className="privacy-icon">🛡️</div>
                    <h3 className="privacy-title">Local Processing</h3>
                    <p className="privacy-desc">
                        Whenever possible, OCR and text extraction occur directly in your browser. Your raw reports are never permanently uploaded to our servers.
                    </p>
                </div>
                <div className="privacy-card">
                    <div className="privacy-icon">🗑️</div>
                    <h3 className="privacy-title">Zero Data Retention</h3>
                    <p className="privacy-desc">
                        As soon as your session ends or you close the browser, all uploaded files, extracted text, and chat logs are immediately and permanently erased.
                    </p>
                </div>
                <div className="privacy-card">
                    <div className="privacy-icon">🔒</div>
                    <h3 className="privacy-title">End-to-End Encryption</h3>
                    <p className="privacy-desc">
                        Data that must be sent to AI models for processing is encrypted in transit using bank-level AES-256 encryption.
                    </p>
                </div>
                <div className="privacy-card">
                    <div className="privacy-icon">🚫</div>
                    <h3 className="privacy-title">No Third-Party Sharing</h3>
                    <p className="privacy-desc">
                        We do not sell, share, or rent your health data to advertisers, insurance companies, or any other third parties. Period.
                    </p>
                </div>
            </div>
        </section>
    );
}
