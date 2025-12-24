import { initPage } from '~/shared/utils/page-init';
import './style.css';

// Internationalization (i18n) - Inline translations
const translations = {
  en: {
    // Page
    pageTitle: 'Watch Ad - Doctorina',
    // Progress
    remaining: 'Remaining:',
    // Warnings
    watchToEnd: 'Please watch the video to the end without skipping',
    doNotSkip: 'Do not skip ahead! Video will restart.',
    keyboardDisabled: 'Keyboard controls are disabled',
    // Dialog
    confirmLeaveTitle: 'Are you sure you want to leave?',
    confirmLeaveText: 'The video is not finished yet. If you leave now, the ad view will not be counted.',
    stayAndWatch: 'Stay and watch',
    leaveAnyway: 'Leave anyway',
    // Completion
    thankYou: 'Thank you for watching!',
    sendingConfirmation: 'Sending confirmation...',
    confirmationSent: 'Confirmation sent successfully!',
    confirmationFailed: 'Failed to send confirmation. Please check your connection.',
    noSessionId: 'No session ID provided. Callback not sent.',
    closeAndReturn: 'Close and return',
    canCloseManually: 'You can now close this tab manually.',
    // Tooltips & Aria
    closeButtonLabel: 'Close',
    closeButtonTooltip: 'Close and return to app',
  },
  ru: {
    // Страница
    pageTitle: 'Просмотр рекламы - Doctorina',
    // Прогресс
    remaining: 'Осталось:',
    // Предупреждения
    watchToEnd: 'Пожалуйста, посмотрите видео до конца без пропусков',
    doNotSkip: 'Не перематывайте! Видео начнется сначала.',
    keyboardDisabled: 'Управление с клавиатуры отключено',
    // Диалог
    confirmLeaveTitle: 'Вы уверены, что хотите уйти?',
    confirmLeaveText: 'Видео еще не закончилось. Если вы уйдете сейчас, просмотр рекламы не будет засчитан.',
    stayAndWatch: 'Остаться и смотреть',
    leaveAnyway: 'Все равно уйти',
    // Завершение
    thankYou: 'Спасибо за просмотр!',
    sendingConfirmation: 'Отправка подтверждения...',
    confirmationSent: 'Подтверждение успешно отправлено!',
    confirmationFailed: 'Не удалось отправить подтверждение. Проверьте соединение.',
    noSessionId: 'ID сессии не указан. Подтверждение не отправлено.',
    closeAndReturn: 'Закрыть и вернуться',
    canCloseManually: 'Вы можете закрыть эту вкладку вручную.',
    // Подсказки и Aria
    closeButtonLabel: 'Закрыть',
    closeButtonTooltip: 'Закрыть и вернуться в приложение',
  },
  es: {
    // Página
    pageTitle: 'Ver anuncio - Doctorina',
    // Progreso
    remaining: 'Restante:',
    // Advertencias
    watchToEnd: 'Por favor, mira el vídeo hasta el final sin saltarlo',
    doNotSkip: '¡No adelantes! El vídeo se reiniciará.',
    keyboardDisabled: 'Los controles del teclado están deshabilitados',
    // Diálogo
    confirmLeaveTitle: '¿Estás seguro de que quieres salir?',
    confirmLeaveText: 'El vídeo aún no ha terminado. Si sales ahora, la visualización del anuncio no se contará.',
    stayAndWatch: 'Quedarse y ver',
    leaveAnyway: 'Salir de todos modos',
    // Finalización
    thankYou: '¡Gracias por ver!',
    sendingConfirmation: 'Enviando confirmación...',
    confirmationSent: '¡Confirmación enviada con éxito!',
    confirmationFailed: 'Error al enviar la confirmación. Comprueba tu conexión.',
    noSessionId: 'No se proporcionó ID de sesión. Confirmación no enviada.',
    closeAndReturn: 'Cerrar y volver',
    canCloseManually: 'Ahora puedes cerrar esta pestaña manualmente.',
    // Tooltips y Aria
    closeButtonLabel: 'Cerrar',
    closeButtonTooltip: 'Cerrar y volver a la aplicación',
  },
  de: {
    // Seite
    pageTitle: 'Werbung ansehen - Doctorina',
    // Fortschritt
    remaining: 'Verbleibend:',
    // Warnungen
    watchToEnd: 'Bitte schauen Sie das Video bis zum Ende ohne zu überspringen',
    doNotSkip: 'Nicht vorspulen! Video wird neu gestartet.',
    keyboardDisabled: 'Tastatursteuerung ist deaktiviert',
    // Dialog
    confirmLeaveTitle: 'Bist du sicher, dass du gehen möchtest?',
    confirmLeaveText: 'Das Video ist noch nicht zu Ende. Wenn Sie jetzt gehen, wird die Anzeige nicht gezählt.',
    stayAndWatch: 'Bleiben und ansehen',
    leaveAnyway: 'Trotzdem verlassen',
    // Abschluss
    thankYou: 'Vielen Dank fürs Ansehen!',
    sendingConfirmation: 'Bestätigung wird gesendet...',
    confirmationSent: 'Bestätigung erfolgreich gesendet!',
    confirmationFailed: 'Bestätigung konnte nicht gesendet werden. Überprüfen Sie Ihre Verbindung.',
    noSessionId: 'Keine Sitzungs-ID angegeben. Bestätigung nicht gesendet.',
    closeAndReturn: 'Schließen und zurückkehren',
    canCloseManually: 'Sie können diesen Tab jetzt manuell schließen.',
    // Tooltips und Aria
    closeButtonLabel: 'Schließen',
    closeButtonTooltip: 'Schließen und zur App zurückkehren',
  },
};

// Detect browser language with fallback to English
function detectLanguage(): keyof typeof translations {
  const browserLang = navigator.language.split('-')[0].toLowerCase();
  const supportedLanguages: (keyof typeof translations)[] = ['en', 'ru', 'es', 'de'];
  return supportedLanguages.includes(browserLang as any) ? (browserLang as keyof typeof translations) : 'en';
}

// Get current language and translations
const currentLang = detectLanguage();
const t = translations[currentLang];

// Update HTML lang attribute
document.documentElement.lang = currentLang;

initPage(t.pageTitle);

// Types for YouTube IFrame API
interface YTPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  getPlayerState: () => number;
  unMute: () => void;
  isMuted: () => boolean;
}

interface YTPlayerClass {
  new (
    elementId: string,
    config: {
      videoId: string;
      playerVars?: Record<string, number | string>;
      events?: {
        onReady?: (event: { target: YTPlayer }) => void;
        onStateChange?: (event: { target: YTPlayer; data: number }) => void;
      };
    }
  ): YTPlayer;
}

interface YTNamespace {
  Player: YTPlayerClass;
  PlayerState: {
    UNSTARTED: number;
    ENDED: number;
    PLAYING: number;
    PAUSED: number;
    BUFFERING: number;
    CUED: number;
  };
}

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: YTNamespace;
  }
}

// Configuration
const VIDEO_ID = '8fy94RQnnzw'; // https://www.youtube.com/watch?v=8fy94RQnnzw
const CALLBACK_URL = 'http://localhost:3000/callback';

// Get parameters from URL
const urlParams = new URLSearchParams(window.location.search);
const sessionId = urlParams.get('session');
const referrer = urlParams.get('referrer'); // 'web' or 'app'

// State management
let player: YTPlayer | null = null;
let maxWatchedTime = 0;
let isVideoCompleted = false;
let seekAttempts = 0;
let pauseCount = 0;
let wasTabActive = true;
let videoStartTime = Date.now();

// Metadata collection
const metadata = {
  userAgent: navigator.userAgent,
  platform: (navigator as any).userAgentData?.platform || navigator.platform || 'unknown',
  language: navigator.language,
  screenResolution: `${window.screen.width}x${window.screen.height}`,
  viewportSize: `${window.innerWidth}x${window.innerHeight}`,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  referrer: document.referrer || 'direct',
  deviceMemory: (navigator as any).deviceMemory || 'unknown',
  hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
};

// Initialize the page
const app = document.getElementById('app');
if (!app) throw new Error('App element not found');

app.innerHTML = `
  <div class="video-container">
    <button class="close-button" id="closeButton" aria-label="${t.closeButtonLabel}" title="${t.closeButtonTooltip}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
    <div id="player"></div>
    <div class="overlay" id="overlay">
      <div class="controls-info">
        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress-fill" id="progressFill"></div>
          </div>
          <div class="time-info">
            <span class="time-label">${t.remaining}</span>
            <span class="time-countdown" id="countdown">--:--</span>
          </div>
        </div>
      </div>
      <div class="warning-message" id="warningMessage">
        ${t.watchToEnd}
      </div>
    </div>
  </div>
  <div class="confirmation-dialog" id="confirmationDialog">
    <div class="dialog-content">
      <h3>${t.confirmLeaveTitle}</h3>
      <p>${t.confirmLeaveText}</p>
      <div class="dialog-buttons">
        <button class="dialog-button dialog-button-secondary" id="dialogStay" title="${t.stayAndWatch}">${t.stayAndWatch}</button>
        <button class="dialog-button dialog-button-danger" id="dialogLeave" title="${t.leaveAnyway}">${t.leaveAnyway}</button>
      </div>
    </div>
  </div>
  <div class="completion-screen" id="completionScreen">
    <div class="completion-content">
      <svg class="checkmark" viewBox="0 0 52 52">
        <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
        <path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
      </svg>
      <h2>${t.thankYou}</h2>
      <p id="completionMessage">${t.sendingConfirmation}</p>
      <button class="close-final-button" id="closeFinalButton" style="display: none;" title="${t.closeButtonTooltip}">${t.closeAndReturn}</button>
    </div>
  </div>
`;

// Load YouTube IFrame API
const tag = document.createElement('script');
tag.src = 'https://www.youtube.com/iframe_api';
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

// Initialize player when API is ready
window.onYouTubeIframeAPIReady = () => {
  player = new window.YT.Player('player', {
    videoId: VIDEO_ID,
    playerVars: {
      autoplay: 1,
      mute: 1, // Mute for autoplay to work in browsers
      controls: 0, // Hide controls
      disablekb: 1, // Disable keyboard controls from YouTube
      fs: 0, // Disable fullscreen
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
      iv_load_policy: 3,
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
    },
  });
};

function onPlayerReady(event: { target: YTPlayer }) {
  // Unmute after autoplay starts (was muted for autoplay policy)
  event.target.unMute();
  event.target.playVideo();
  startProgressTracking();
}

function onPlayerStateChange(event: { target: YTPlayer; data: number }) {
  const { YT } = window;

  if (event.data === YT.PlayerState.PAUSED) {
    pauseCount++;
  }

  if (event.data === YT.PlayerState.ENDED && !isVideoCompleted) {
    isVideoCompleted = true;
    onVideoComplete();
  }
}

function startProgressTracking() {
  setInterval(() => {
    if (!player || isVideoCompleted) return;

    const currentTime = player.getCurrentTime();
    const duration = player.getDuration();

    // Detect seek attempts (forward seeking)
    if (currentTime > maxWatchedTime + 1) {
      seekAttempts++;
      showWarning(t.doNotSkip);
      player.seekTo(maxWatchedTime, true);
      return;
    }

    // Update max watched time
    if (currentTime > maxWatchedTime) {
      maxWatchedTime = currentTime;
    }

    // Update UI
    updateProgress(currentTime, duration);

    // Check if video is completed (98% threshold to account for buffering)
    if (currentTime / duration > 0.98 && !isVideoCompleted) {
      isVideoCompleted = true;
      onVideoComplete();
    }
  }, 100);
}

function updateProgress(currentTime: number, duration: number) {
  const progressFill = document.getElementById('progressFill');
  const countdown = document.getElementById('countdown');

  if (!progressFill || !countdown) return;

  const percentage = (currentTime / duration) * 100;
  progressFill.style.width = `${percentage}%`;

  const remaining = duration - currentTime;
  const minutes = Math.floor(remaining / 60);
  const seconds = Math.floor(remaining % 60);
  countdown.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function showWarning(message: string) {
  const warningMessage = document.getElementById('warningMessage');
  if (!warningMessage) return;

  warningMessage.textContent = message;
  warningMessage.classList.add('show');

  setTimeout(() => {
    warningMessage.classList.remove('show');
  }, 3000);
}

async function onVideoComplete() {
  // Wait 1.5 seconds before showing completion screen for smoother UX
  await new Promise(resolve => setTimeout(resolve, 1500));

  const completionScreen = document.getElementById('completionScreen');
  const overlay = document.getElementById('overlay');
  const closeFinalButton = document.getElementById('closeFinalButton');
  const closeButton = document.getElementById('closeButton');

  if (completionScreen) completionScreen.classList.add('show');
  if (overlay) overlay.style.display = 'none';

  // Hide the X button in top-left corner
  if (closeButton) closeButton.classList.add('hidden');

  // Send callback if session exists
  if (sessionId) {
    await sendCallback();
  } else {
    const completionMessage = document.getElementById('completionMessage');
    if (completionMessage) {
      completionMessage.textContent = t.noSessionId;
    }
  }

  // Show close button after completion
  if (closeFinalButton) {
    closeFinalButton.style.display = 'block';
  }
}

async function sendCallback() {
  const completionMessage = document.getElementById('completionMessage');

  try {
    const watchDuration = (Date.now() - videoStartTime) / 1000; // in seconds

    const payload = {
      session: sessionId,
      videoId: VIDEO_ID,
      page: 'ads',
      videoUrl: `https://www.youtube.com/watch?v=${VIDEO_ID}`,
      completedAt: new Date().toISOString(),

      // Basic metadata
      userAgent: metadata.userAgent,
      platform: metadata.platform,
      language: metadata.language,

      // Extended metadata
      screenResolution: metadata.screenResolution,
      viewportSize: metadata.viewportSize,
      timezone: metadata.timezone,
      referrer: metadata.referrer,
      deviceMemory: metadata.deviceMemory,
      hardwareConcurrency: metadata.hardwareConcurrency,

      // Behavioral metadata
      watchDuration: Math.round(watchDuration),
      seekAttempts,
      pauseCount,
      wasTabActive,
      maxWatchedTime: Math.round(maxWatchedTime),
    };

    const response = await fetch(CALLBACK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      if (completionMessage) {
        completionMessage.textContent = t.confirmationSent;
      }
    } else {
      throw new Error(`Server responded with ${response.status}`);
    }
  } catch (error) {
    console.error('Failed to send callback:', error);
    if (completionMessage) {
      completionMessage.textContent = t.confirmationFailed;
    }
  }
}

// Manual keyboard controls
document.addEventListener('keydown', (e) => {
  if (isVideoCompleted || !player) return;

  const { YT } = window;
  const currentState = player.getPlayerState();

  // Handle pause/play with Space or K
  if (e.key === ' ' || e.key === 'k' || e.key === 'K') {
    e.preventDefault();
    e.stopPropagation();

    if (currentState === YT.PlayerState.PLAYING) {
      player.pauseVideo();
    } else if (currentState === YT.PlayerState.PAUSED) {
      player.playVideo();
    }
    return false;
  }

  // Block all other video control keys
  const blockedKeys = [
    'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
    'Home', 'End',
    'PageUp', 'PageDown',
    'j', 'l', 'm', 'f', 'c',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
  ];

  if (blockedKeys.includes(e.key) || blockedKeys.includes(e.code)) {
    e.preventDefault();
    e.stopPropagation();
    showWarning(t.keyboardDisabled);
    return false;
  }
});

// Prevent context menu on video
document.getElementById('player')?.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  return false;
});

// Track tab visibility and auto pause/resume
document.addEventListener('visibilitychange', () => {
  if (!player || isVideoCompleted) return;

  if (document.hidden) {
    // Tab lost focus - pause video
    wasTabActive = false;
    player.pauseVideo();
  } else {
    // Tab gained focus - resume video if it was playing
    const currentState = player.getPlayerState();
    const { YT } = window;

    // Resume only if paused (not ended or unstarted)
    if (currentState === YT.PlayerState.PAUSED) {
      player.playVideo();
    }
  }
});

// No beforeunload warning - we handle closing with custom dialog

// Close button handler
const closeButton = document.getElementById('closeButton');
closeButton?.addEventListener('click', handleCloseAttempt);

function handleCloseAttempt() {
  if (isVideoCompleted) {
    // Video completed - close immediately
    closeAndReturn();
  } else {
    // Video not completed - show confirmation dialog
    const confirmationDialog = document.getElementById('confirmationDialog');
    if (confirmationDialog) {
      confirmationDialog.classList.add('show');
    }
  }
}

// Dialog button handlers
const dialogStay = document.getElementById('dialogStay');
const dialogLeave = document.getElementById('dialogLeave');

dialogStay?.addEventListener('click', () => {
  const confirmationDialog = document.getElementById('confirmationDialog');
  if (confirmationDialog) {
    confirmationDialog.classList.remove('show');
  }
});

dialogLeave?.addEventListener('click', () => {
  closeAndReturn();
});

// Close and return logic
async function closeAndReturn() {
  try {
    if (referrer === 'web') {
      // Try to switch to web app tab
      await redirectToWebApp();
    } else if (referrer === 'app') {
      // Try to open mobile app
      await redirectToMobileApp();
    }
  } catch (error) {
    console.error('Failed to redirect:', error);
  }

  // Try to close the tab
  tryCloseTab();
}

async function redirectToWebApp() {
  try {
    // Try to focus existing app.doctorina.com tab
    // This is limited by browser security, but we can try opening it
    const webAppUrl = 'https://app.doctorina.com';

    // Open in same window to give focus
    window.location.href = webAppUrl;
  } catch (error) {
    console.error('Failed to redirect to web app:', error);
  }
}

async function redirectToMobileApp() {
  try {
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);

    if (isIOS) {
      // iOS Universal Link / Custom URL Scheme
      const universalLink = 'doctorina://';
      window.location.href = universalLink;

      // Fallback to App Store if app not installed (after timeout)
      setTimeout(() => {
        // If still here, app might not be installed
        console.log('iOS app might not be installed');
      }, 2000);
    } else if (isAndroid) {
      // Android App Link / Intent
      const intentUrl = 'intent://callback#Intent;' +
        'scheme=doctorina;' +
        'package=com.doctorina.app.android.production;' +
        'S.browser_fallback_url=https://play.google.com/store/apps/details?id=com.doctorina.app.android.production;' +
        'end';

      window.location.href = intentUrl;

      // Fallback
      setTimeout(() => {
        console.log('Android app might not be installed');
      }, 2000);
    } else {
      // Desktop or unknown platform - just try generic link
      window.location.href = 'doctorina://';
    }
  } catch (error) {
    console.error('Failed to redirect to mobile app:', error);
  }
}

function tryCloseTab() {
  try {
    // Try to close the window (will only work if opened via window.open)
    window.close();

    // Check if window is still open after close attempt
    setTimeout(() => {
      // If we're still here, window.close() didn't work
      // Only show message if video was completed
      if (isVideoCompleted) {
        const completionScreen = document.getElementById('completionScreen');
        const completionMessage = document.getElementById('completionMessage');

        if (completionScreen && !completionScreen.classList.contains('show')) {
          completionScreen.classList.add('show');
        }

        if (completionMessage) {
          completionMessage.textContent = t.canCloseManually;
        }

        // Hide the close button since we're showing the message
        const closeFinalButton = document.getElementById('closeFinalButton');
        if (closeFinalButton) {
          closeFinalButton.style.display = 'none';
        }
      }
    }, 100);
  } catch (error) {
    console.error('Failed to close tab:', error);
  }
}

// Final close button handler (after completion)
const closeFinalButton = document.getElementById('closeFinalButton');
closeFinalButton?.addEventListener('click', closeAndReturn);
