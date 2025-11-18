import { initPage } from '~/shared/utils/page-init';
import './style.css';

initPage('Doctorina Pages');

const app = document.getElementById('app');
if (app) {
  app.innerHTML = `
    <div class="container">
      <header>
        <h1>🏥 Doctorina Pages</h1>
        <p class="subtitle">Lightweight pages for Doctorina organization</p>
      </header>

      <main>
        <section class="pages-list">
          <h2>Available Pages</h2>
          <ul>
            <li><a href="/tools.html">🔧 Tools - Utility Tools</a></li>
          </ul>
        </section>
      </main>

      <footer>
        <p>&copy; ${new Date().getFullYear()} Doctorina AI</p>
      </footer>
    </div>
  `;
}
