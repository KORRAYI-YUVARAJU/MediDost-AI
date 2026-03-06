export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-top">
                    {/* Brand */}
                    <div className="footer-brand">
                        <a href="#" className="navbar-logo" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                            <div className="logo-mark">🩺</div>
                            <span className="logo-text">Medi<span>Dost</span> AI</span>
                        </a>
                        <p>
                            Transforming complex medical diagnostics into clear, compassionate,
                            multilingual explanations — powered by responsible AI.
                        </p>
                        <div className="footer-social">
                            <a href="#" className="social-icon" title="Twitter / X">𝕏</a>
                            <a href="#" className="social-icon" title="LinkedIn">in</a>
                            <a href="#" className="social-icon" title="GitHub">⌥</a>
                            <a href="#" className="social-icon" title="Instagram">◎</a>
                            <a href="#" className="social-icon" title="YouTube">▷</a>
                        </div>
                    </div>

                    {/* Product */}
                    <div className="footer-col">
                        <h4>Product</h4>
                        <ul>
                            <li><a href="#">Features</a></li>
                            <li><a href="#">Pricing</a></li>
                            <li><a href="#">API Docs</a></li>
                            <li><a href="#">Changelog</a></li>
                            <li><a href="#">Roadmap</a></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div className="footer-col">
                        <h4>Company</h4>
                        <ul>
                            <li><a href="#">About Us</a></li>
                            <li><a href="#">Blog</a></li>
                            <li><a href="#">Careers</a></li>
                            <li><a href="#">Press Kit</a></li>
                            <li><a href="#">Contact</a></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="footer-col">
                        <h4>Legal</h4>
                        <ul>
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Terms of Service</a></li>
                            <li><a href="#">HIPAA Compliance</a></li>
                            <li><a href="#">Cookie Policy</a></li>
                            <li><a href="#">Security</a></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="footer-bottom">
                    <p className="footer-copy">
                        © {new Date().getFullYear()} MediDost AI. All rights reserved.
                        &nbsp;·&nbsp; Made with ❤️ in India
                    </p>
                    <div className="footer-bottom-links">
                        <a href="#">Privacy</a>
                        <a href="#">Terms</a>
                        <a href="#">Accessibility</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
