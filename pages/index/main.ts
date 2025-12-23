import { initPage } from '~/shared/utils/page-init';
import './style.css';

initPage('Doctorina - AI-Powered Health Diagnostics');

const app = document.getElementById('app');
if (app) {
  app.innerHTML = `
    <div class="hero">
      <div class="container">
        <header class="hero-header">
          <div class="logo-section">
            <div class="logo-icon">🏥</div>
            <h1 class="brand-name">Doctorina</h1>
          </div>
          <p class="tagline">AI-Powered Medical Consultation</p>
          <p class="subtitle">Founded and tested by real doctors. Accessible globally, 24/7.</p>
        </header>

        <section class="features">
          <ul class="feature-list">
            <li>⚡ Instant diagnostics - no waiting rooms</li>
            <li>🔒 100% encrypted and confidential</li>
            <li>👨‍⚕️ Reviewed by over 30 doctors daily</li>
            <li>🌍 Available globally, 24/7</li>
            <li>📋 Personalized medical history</li>
            <li>🗣️ Text, photos, videos, voice messages</li>
          </ul>
        </section>

        <section class="cta-section">
          <h2>Get Started Today</h2>
          <p class="cta-description">Choose your preferred platform</p>

          <div class="download-links">
            <a href="https://app.doctorina.com/" class="download-btn primary" target="_blank" rel="noopener noreferrer">
              <span class="btn-icon">🌐</span>
              <span class="btn-content">
                <span class="btn-label">Open</span>
                <span class="btn-title">Web App</span>
              </span>
            </a>

            <a href="https://apps.apple.com/us/app/doctorina-health/id6743122346" class="download-btn apple" target="_blank" rel="noopener noreferrer">
              <span class="btn-icon">🍎</span>
              <span class="btn-content">
                <span class="btn-label">Download on</span>
                <span class="btn-title">App Store</span>
              </span>
            </a>

            <a href="https://play.google.com/store/apps/details?id=com.doctorina.app.android.production" class="download-btn google" target="_blank" rel="noopener noreferrer">
              <span class="btn-icon">📱</span>
              <span class="btn-content">
                <span class="btn-label">Get it on</span>
                <span class="btn-title">Google Play</span>
              </span>
            </a>

            <a href="https://t.me/ask_doctorina_bot" class="download-btn telegram" target="_blank" rel="noopener noreferrer">
              <span class="btn-icon">✈️</span>
              <span class="btn-content">
                <span class="btn-label">Chat on</span>
                <span class="btn-title">Telegram</span>
              </span>
            </a>
          </div>
        </section>

        <footer class="footer">
          <p>&copy; ${new Date().getFullYear()} Doctorina AI. All rights reserved.</p>
          <p class="footer-note">Providing equitable healthcare access worldwide</p>
        </footer>
      </div>
    </div>
  `;
}
