import { initPage } from '~/shared/utils/page-init';
import './style.css';

initPage('Payment Successful - Doctorina');

const app = document.getElementById('app');
if (app) {
  // Get session_id from URL if present
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get('session_id');

  app.innerHTML = `
    <div class="container">
      <div class="success-icon">✓</div>
      <h1>Payment Successful!</h1>
      <p class="message">Thank you for your payment. Your transaction has been completed successfully.</p>
      ${sessionId ? `<p class="session-id">Session ID: ${sessionId}</p>` : ''}
      <div class="actions">
        <a href="https://doctorina.com" class="btn btn-primary">Return to Home</a>
      </div>
    </div>
  `;
}
