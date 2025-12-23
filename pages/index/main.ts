import { initPage } from '~/shared/utils/page-init';
import './style.css';

initPage('Doctorina Pages');

const app = document.getElementById('app');
if (app) {
  app.innerHTML = `
    <div class="container">
      <header>
        <h1>Doctorina</h1>
        <p class="subtitle">Your AI-powered medical assistant</p>
      </header>

      <main>
        <p>Hello there!</p>
      </main>

      <footer>
        <p>&copy; ${new Date().getFullYear()} Doctorina AI</p>
      </footer>
    </div>
  `;
}
