import { copyToClipboard } from '~/shared/utils/clipboard';
import { initPage } from '~/shared/utils/page-init';
import './style.css';

initPage('Links - Doctorina');

const app = document.getElementById('app');
if (app) {
  app.innerHTML = `
    <div class="container">
      <header>
        <h1>🔗 Doctorina Links</h1>
        <p class="subtitle">Fast and simple URL shortener</p>
      </header>

      <main>
        <form id="shorten-form">
          <div class="input-group">
            <input
              type="url"
              id="url-input"
              placeholder="Enter a long URL to shorten..."
              required
              autocomplete="off"
            />
            <button type="submit">Shorten</button>
          </div>
        </form>

        <div id="result" class="result hidden">
          <div class="short-url">
            <input type="text" id="short-url" readonly />
            <button id="copy-btn">Copy</button>
          </div>
          <p class="success-message">URL shortened successfully!</p>
        </div>
      </main>

      <footer>
        <p><a href="/">← Back to Home</a></p>
      </footer>
    </div>
  `;

  // Form handling
  const form = document.getElementById('shorten-form') as HTMLFormElement;
  const urlInput = document.getElementById('url-input') as HTMLInputElement;
  const result = document.getElementById('result') as HTMLDivElement;
  const shortUrlInput = document.getElementById('short-url') as HTMLInputElement;
  const copyBtn = document.getElementById('copy-btn') as HTMLButtonElement;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const longUrl = urlInput.value.trim();

    if (longUrl) {
      // Mock shortening - in real app, call API
      const shortCode = Math.random().toString(36).substring(2, 8);
      const shortUrl = `https://l.doctorina.com/${shortCode}`;

      shortUrlInput.value = shortUrl;
      result.classList.remove('hidden');
    }
  });

  copyBtn.addEventListener('click', () => {
    copyToClipboard(shortUrlInput.value);
    copyBtn.textContent = 'Copied!';
    setTimeout(() => {
      copyBtn.textContent = 'Copy';
    }, 2000);
  });
}
