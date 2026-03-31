const STYLE_ID = 'dchat-styles';

const CSS = `
.dchat-box {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  padding: 16px;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  box-sizing: border-box;
}

.dchat-box *,
.dchat-box *::before,
.dchat-box *::after {
  box-sizing: border-box;
}

.dchat-textarea {
  flex: 1 1 auto;
  min-height: 44px;
  max-height: 180px;
  padding: 10px 12px;
  border: 0;
  outline: 0;
  font-size: 16px;
  line-height: 1.4;
  resize: none;
  background: transparent;
  color: #1a1a1a;
  font-family: inherit;
  overflow-y: auto;
}

.dchat-textarea:focus {
  outline: none;
  box-shadow: none;
}

.dchat-textarea::placeholder {
  color: rgba(0, 0, 0, 0.4);
}

.dchat-btn {
  flex: 0 0 auto;
  width: 44px;
  height: 44px;
  border: 0;
  cursor: pointer;
  border-radius: 50%;
  background: #25D366;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease, transform 0.1s ease, opacity 0.15s ease;
  padding: 0;
  -webkit-tap-highlight-color: transparent;
}

.dchat-btn:hover:not(:disabled) {
  background: #1fb855;
}

.dchat-btn:disabled {
  opacity: 0.4;
  cursor: default;
  transform: none;
}

.dchat-btn[title] {
  position: relative;
}

.dchat-btn:active:not(:disabled) {
  transform: scale(0.94);
}

.dchat-btn svg {
  width: 20px;
  height: 20px;
  fill: currentColor;
}

@media (max-width: 767px) {
  .dchat-box {
    padding: 12px;
    border-radius: 16px;
    gap: 10px;
  }

  .dchat-textarea {
    font-size: 16px;
    padding: 8px 10px;
    min-height: 40px;
  }

  .dchat-btn {
    width: 40px;
    height: 40px;
  }
}
`;

export function injectStyles(): void {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = CSS;
  document.head.appendChild(style);
}
