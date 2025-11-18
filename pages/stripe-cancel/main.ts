import { initPage } from '~/shared/utils/page-init';
import './style.css';

initPage('Payment Cancelled - Doctorina');

const app = document.getElementById('app');
if (app) {
  app.innerHTML = `
    <div class="container">
      <div class="cancel-icon">✕</div>
      <h1>Payment Cancelled</h1>
      <p class="message">Your payment was cancelled. No charges have been made to your account.</p>
      <p class="sub-message">If you experienced any issues or have questions, please contact our support team.</p>
      <div class="actions">
        <a href="https://doctorina.com" class="btn btn-primary">Return to Home</a>
        <a href="mailto:support@doctorina.com" class="btn btn-secondary">Contact Support</a>
      </div>
    </div>
  `;
}
