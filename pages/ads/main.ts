import { initPage } from '~/shared/utils/page-init';
import './style.css';

initPage('Ads - Doctorina');

const app = document.getElementById('app');
if (app) {
  // Get session_id from URL if present
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get('session_id');

  app.innerHTML = `
    <div class="container">
      <h1>Ads</h1>
      <p>Welcome to the Ads page!</p>
    </div>
  `;
}
