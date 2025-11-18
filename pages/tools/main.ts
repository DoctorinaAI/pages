import { initPage } from '~/shared/utils/page-init';
import './style.css';

initPage('Tools - Doctorina');

const app = document.getElementById('app');
if (app) {
  app.innerHTML = `
    <div class="container">
      <header>
        <h1>🔧 Doctorina Tools</h1>
        <p class="subtitle">Useful utilities and tools</p>
      </header>

      <main>
        <div class="tools-grid">
          <div class="tool-card">
            <div class="tool-icon">📝</div>
            <h3>Text Formatter</h3>
            <p>Format and transform text</p>
          </div>

          <div class="tool-card">
            <div class="tool-icon">🔐</div>
            <h3>Hash Generator</h3>
            <p>Generate MD5, SHA hashes</p>
          </div>

          <div class="tool-card">
            <div class="tool-icon">🎨</div>
            <h3>Color Picker</h3>
            <p>Pick and convert colors</p>
          </div>

          <div class="tool-card">
            <div class="tool-icon">📏</div>
            <h3>Unit Converter</h3>
            <p>Convert various units</p>
          </div>
        </div>
      </main>

      <footer>
        <p><a href="/">← Back to Home</a></p>
      </footer>
    </div>
  `;
}
