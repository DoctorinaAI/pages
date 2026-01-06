import { initPage } from '~/shared/utils/page-init';
import './style.css';

// Internationalization (i18n) - Inline translations
const translations = {
  en: {
    // Language: English
    lang: 'en',
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
    // Loading
    loadingVideo: 'Loading video...',
    videoLoadError: 'Failed to load video. Please refresh the page.',
    // Tooltips & Aria
    closeButtonLabel: 'Close',
    closeButtonTooltip: 'Close and return to app',
    videoPlayerLabel: 'Advertisement video player',
    progressBarLabel: 'Video progress',
  },
  ru: {
    // Язык: Русский
    lang: 'ru',
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
    // Загрузка
    loadingVideo: 'Загрузка видео...',
    videoLoadError: 'Не удалось загрузить видео. Пожалуйста, обновите страницу.',
    // Подсказки и Aria
    closeButtonLabel: 'Закрыть',
    closeButtonTooltip: 'Закрыть и вернуться в приложение',
    videoPlayerLabel: 'Видеоплеер рекламы',
    progressBarLabel: 'Прогресс видео',
  },
  es: {
    // Idioma: Español
    lang: 'es',
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
    // Carga
    loadingVideo: 'Cargando vídeo...',
    videoLoadError: 'Error al cargar el vídeo. Por favor, actualiza la página.',
    // Tooltips y Aria
    closeButtonLabel: 'Cerrar',
    closeButtonTooltip: 'Cerrar y volver a la aplicación',
    videoPlayerLabel: 'Reproductor de vídeo publicitario',
    progressBarLabel: 'Progreso del vídeo',
  },
  de: {
    // Sprache: Deutsch
    lang: 'de',
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
    // Laden
    loadingVideo: 'Video wird geladen...',
    videoLoadError: 'Video konnte nicht geladen werden. Bitte aktualisieren Sie die Seite.',
    // Tooltips und Aria
    closeButtonLabel: 'Schließen',
    closeButtonTooltip: 'Schließen und zur App zurückkehren',
    videoPlayerLabel: 'Werbevideoplayer',
    progressBarLabel: 'Videofortschritt',
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
  setVolume: (volume: number) => void;
  getVolume: () => number;
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
        onError?: (event: { target: YTPlayer; data: number }) => void;
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

// Configuration from ENV and URL params
const urlParams = new URLSearchParams(window.location.search);
const VIDEO_ID = urlParams.get('v') || urlParams.get('video') || import.meta.env.VITE_DEFAULT_VIDEO_ID || '8fy94RQnnzw';

// Normalize and validate callback URL
function normalizeCallbackUrl(url: string | null): string {
  if (!url) {
    return import.meta.env.VITE_CALLBACK_URL || 'https://live.api.doctorina.com/v1/chats/events/ads-completed';
  }

  // Decode URL if encoded
  try {
    url = decodeURIComponent(url);
  } catch (e) {
    console.error('Failed to decode callback URL:', e);
  }

  // Validate URL starts with http:// or https://
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    console.error('Invalid callback URL (must start with http:// or https://):', url);
    return import.meta.env.VITE_CALLBACK_URL || 'https://live.api.doctorina.com/v1/chats/events/ads-completed';
  }

  // Additional validation: check if it's a valid URL
  try {
    new URL(url);
    return url;
  } catch (e) {
    console.error('Invalid callback URL format:', e);
    return import.meta.env.VITE_CALLBACK_URL || 'https://live.api.doctorina.com/v1/chats/events/ads-completed';
  }
}

const CALLBACK_URL = normalizeCallbackUrl(urlParams.get('c') || urlParams.get('callback'));
const MAX_CALLBACK_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

// Get parameters from URL
const sessionId = urlParams.get('s') || urlParams.get('session');
const referrer = urlParams.get('r') || urlParams.get('referrer'); // 'web' or 'app'
const locale = urlParams.get('l') || urlParams.get('lang') || navigator.language?.split('-')[0].toLowerCase() || 'en';

// State management
let player: YTPlayer | null = null;
let maxWatchedTime = 0;
let isVideoCompleted = false;
let seekAttempts = 0;
let pauseCount = 0;
let wasTabActive = true;
let videoStartTime = Date.now();
let fullscreenCount = 0;
let callbackSent = false;

// Advanced analytics tracking
let totalPauseDuration = 0;
let lastPauseTime = 0;
let volumeChanges = 0;
let lastVolume = 100;
let tabSwitchCount = 0;
let playerErrorCount = 0;
let bufferingEvents = 0;
let lastBufferingTime = 0;
let totalBufferingDuration = 0;

// Analytics milestones
const milestones = [0.25, 0.5, 0.75];
const reachedMilestones = new Set<number>();

// PostMessage helper for iframe/WebView communication
function sendPostMessage(event: string, data: Record<string, any> = {}) {
  const message = {
    event,
    timestamp: new Date().toISOString(),
    ...data,
  };

  // Send to parent window (for iframe)
  if (window.parent && window.parent !== window) {
    window.parent.postMessage(message, '*');
  }

  // Send to opener (for popup/new tab)
  if (window.opener) {
    window.opener.postMessage(message, '*');
  }

  // For WebView - also post to current window
  window.postMessage(message, window.location.origin);

  console.log('PostMessage:', event, data);
}

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

// Send page loaded event
sendPostMessage('page-loaded', {
  video_id: VIDEO_ID,
  session: sessionId,
  referrer,
  language: currentLang,
});

// Initialize the page
const app = document.getElementById('app');
if (!app) throw new Error('App element not found');

app.innerHTML = `
  <div class="loading-screen" id="loadingScreen" aria-live="polite" aria-busy="true">
    <div class="loading-spinner"></div>
    <p>${t.loadingVideo}</p>
  </div>
  <div class="video-container" role="region" aria-label="${t.videoPlayerLabel}">
    /* <button class="close-button" id="closeButton" aria-label="${t.closeButtonLabel}" title="${t.closeButtonTooltip}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button> */
    <div id="player"></div>
    <div class="overlay" id="overlay">
      <div class="controls-info">
        <div class="progress-container" role="region" aria-label="${t.progressBarLabel}">
          <div class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
            <div class="progress-fill" id="progressFill"></div>
          </div>
          <div class="time-info">
            <span class="time-label">${t.remaining}</span>
            <span class="time-countdown" id="countdown" aria-live="polite">--:--</span>
            <span class="time-separator">·</span>
            <span class="progress-percentage" id="progressPercentage" aria-live="polite">0%</span>
          </div>
        </div>
      </div>
      <div class="warning-message" id="warningMessage" role="alert" aria-live="assertive">
        ${t.watchToEnd}
      </div>
    </div>
  </div>
  <div class="confirmation-dialog" id="confirmationDialog" role="dialog" aria-modal="true" aria-labelledby="dialogTitle">
    <div class="dialog-content">
      <h3 id="dialogTitle">${t.confirmLeaveTitle}</h3>
      <p>${t.confirmLeaveText}</p>
      <div class="dialog-buttons">
        <button class="dialog-button dialog-button-secondary" id="dialogStay" title="${t.stayAndWatch}">${t.stayAndWatch}</button>
        <button class="dialog-button dialog-button-danger" id="dialogLeave" title="${t.leaveAnyway}">${t.leaveAnyway}</button>
      </div>
    </div>
  </div>
  <div class="completion-screen" id="completionScreen" role="status" aria-live="polite">
    <div class="completion-content">
      <svg class="checkmark" viewBox="0 0 52 52" aria-hidden="true">
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
      onError: onPlayerError,
    },
  });
};

function onPlayerReady(event: { target: YTPlayer }) {
  // Hide loading screen
  const loadingScreen = document.getElementById('loadingScreen');
  if (loadingScreen) {
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
      loadingScreen.style.display = 'none';
    }, 300);
  }

  // Send player ready event
  sendPostMessage('player-ready', {
    video_id: VIDEO_ID,
    duration: event.target.getDuration(),
  });

  // Unmute and start playing
  event.target.unMute();
  event.target.playVideo();
  startProgressTracking();

  // Ensure video actually starts playing with retry mechanism
  const ensurePlayback = (retryCount = 0, maxRetries = 3) => {
    setTimeout(() => {
      if (!player || isVideoCompleted) return;

      const { YT } = window;
      const currentState = player.getPlayerState();

      // If video is not playing, try to start it
      if (currentState !== YT.PlayerState.PLAYING && currentState !== YT.PlayerState.BUFFERING) {
        console.log(`Retry autoplay attempt ${retryCount + 1}/${maxRetries}`);
        player.playVideo();

        // Retry if we haven't exceeded max retries
        if (retryCount < maxRetries - 1) {
          ensurePlayback(retryCount + 1, maxRetries);
        }
      }
    }, 500 + retryCount * 500); // Increasing delay: 500ms, 1000ms, 1500ms
  };

  ensurePlayback();
}

function onPlayerStateChange(event: { target: YTPlayer; data: number }) {
  const { YT } = window;

  if (event.data === YT.PlayerState.PAUSED) {
    pauseCount++;
    lastPauseTime = Date.now();
    sendPostMessage('video-paused', {
      current_time: event.target.getCurrentTime(),
      pause_count: pauseCount,
    });
  }

  if (event.data === YT.PlayerState.PLAYING) {
    // Calculate pause duration if coming from pause
    if (lastPauseTime > 0) {
      totalPauseDuration += (Date.now() - lastPauseTime) / 1000;
      lastPauseTime = 0;
    }
    // End buffering tracking if was buffering
    if (lastBufferingTime > 0) {
      totalBufferingDuration += (Date.now() - lastBufferingTime) / 1000;
      lastBufferingTime = 0;
    }
    sendPostMessage('video-playing', {
      current_time: event.target.getCurrentTime(),
    });
  }

  if (event.data === YT.PlayerState.BUFFERING) {
    bufferingEvents++;
    lastBufferingTime = Date.now();
    sendPostMessage('video-buffering', {
      current_time: event.target.getCurrentTime(),
      buffering_events: bufferingEvents,
    });
  }

  if (event.data === YT.PlayerState.ENDED && !isVideoCompleted) {
    isVideoCompleted = true;
    sendPostMessage('video-ended', {
      duration: event.target.getDuration(),
      watch_duration: (Date.now() - videoStartTime) / 1000,
    });
    onVideoComplete();
  }
}

function onPlayerError(event: { target: YTPlayer; data: number }) {
  playerErrorCount++;
  console.error('YouTube Player Error:', event.data);

  sendPostMessage('video-error', {
    error_code: event.data,
    player_error_count: playerErrorCount,
  });

  const loadingScreen = document.getElementById('loadingScreen');
  if (loadingScreen) {
    loadingScreen.innerHTML = `
      <div class="error-icon">⚠️</div>
      <p>${t.videoLoadError}</p>
    `;
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
      sendPostMessage('seek-attempt-blocked', {
        attempted_time: currentTime,
        max_watched_time: maxWatchedTime,
        seek_attempts: seekAttempts,
      });
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
  const progressPercentage = document.getElementById('progressPercentage');
  const progressBar = document.querySelector('.progress-bar');

  if (!progressFill || !countdown) return;

  const percentage = (currentTime / duration) * 100;
  progressFill.style.width = `${percentage}%`;

  // Update ARIA attributes
  if (progressBar) {
    progressBar.setAttribute('aria-valuenow', Math.round(percentage).toString());
  }

  const remaining = duration - currentTime;
  const minutes = Math.floor(remaining / 60);
  const seconds = Math.floor(remaining % 60);
  countdown.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  // Update percentage display
  if (progressPercentage) {
    progressPercentage.textContent = `${Math.round(percentage)}%`;
  }

  // Track analytics milestones
  const progress = currentTime / duration;
  milestones.forEach((milestone) => {
    if (progress >= milestone && !reachedMilestones.has(milestone)) {
      reachedMilestones.add(milestone);
      console.log(`Milestone reached: ${milestone * 100}%`);
      sendPostMessage('milestone-reached', {
        milestone: milestone * 100,
        current_time: currentTime,
        duration,
      });
    }
  });
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
  sendPostMessage('video-complete', {
    ...buildCallbackPayload(),
  });

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
  }

  /* if (!sessionId) {
    const completionMessage = document.getElementById('completionMessage');
    if (completionMessage) {
      completionMessage.textContent = t.noSessionId;
    }
  } */

  // Show close button after completion
  if (closeFinalButton) {
    closeFinalButton.style.display = 'block';
  }
}

// Build callback payload
function buildCallbackPayload() {
  const watchDuration = (Date.now() - videoStartTime) / 1000; // in seconds
  return {
    session: sessionId,
    video_id: VIDEO_ID,
    page: 'ads',
    video_url: `https://www.youtube.com/watch?v=${VIDEO_ID}`,
    completed_at: new Date().toISOString(),

    // Basic metadata
    user_agent: metadata.userAgent,
    platform: metadata.platform,
    language: metadata.language,

    // Extended metadata
    screen_resolution: metadata.screenResolution,
    viewport_size: metadata.viewportSize,
    timezone: metadata.timezone,
    referrer: metadata.referrer,
    device_memory: metadata.deviceMemory,
    hardware_concurrency: metadata.hardwareConcurrency,

    // Behavioral metadata
    watch_duration: Math.round(watchDuration),
    seek_attempts: seekAttempts,
    pause_count: pauseCount,
    was_tab_active: wasTabActive,
    max_watched_time: Math.round(maxWatchedTime),
    fullscreen_count: fullscreenCount,

    // Advanced engagement metrics
    total_pause_duration: Math.round(totalPauseDuration),
    average_pause_duration: pauseCount > 0 ? Math.round(totalPauseDuration / pauseCount) : 0,
    volume_changes: volumeChanges,
    tab_switch_count: tabSwitchCount,
    player_error_count: playerErrorCount,
    buffering_events: bufferingEvents,
    total_buffering_duration: Math.round(totalBufferingDuration),

    // Quality metrics
    engagement_rate: Math.round((maxWatchedTime / (player?.getDuration() || 1)) * 100),
    completion_quality: seekAttempts === 0 && pauseCount <= 2 ? 'high' : pauseCount <= 5 ? 'medium' : 'low',
    viewer_behavior: tabSwitchCount === 0 ? 'focused' : tabSwitchCount <= 2 ? 'normal' : 'distracted',

    // Network quality indicators
    connection_quality: bufferingEvents === 0 ? 'excellent' : bufferingEvents <= 2 ? 'good' : bufferingEvents <= 5 ? 'fair' : 'poor',
    buffering_ratio: Math.round((totalBufferingDuration / watchDuration) * 100),

    // Analytics milestones
    milestones_reached: Array.from(reachedMilestones),
    milestones_completion_rate: (reachedMilestones.size / milestones.length) * 100,
  };
}

async function sendCallback() {
  // Rate limiting: prevent duplicate sends
  if (callbackSent) {
    console.warn('Callback already sent, skipping duplicate request');
    return;
  }

  const completionMessage = document.getElementById('completionMessage');

  // Retry mechanism with exponential backoff
  for (let attempt = 1; attempt <= MAX_CALLBACK_RETRIES; attempt++) {
    try {
      const payload = buildCallbackPayload();
      const response = await fetch(CALLBACK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': locale,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        callbackSent = true;
        if (completionMessage) {
          completionMessage.textContent = t.confirmationSent;
        }
        console.log('Callback sent successfully');
        sendPostMessage('callback-success', {
            session: sessionId,
            attempt,
        });
        return; // Success, exit retry loop
      } else {
        throw new Error(`Server responded with ${response.status}`);
      }
    } catch (error) {
      console.error(`Callback attempt ${attempt}/${MAX_CALLBACK_RETRIES} failed:`, error);

      if (attempt === MAX_CALLBACK_RETRIES) {
        // Final attempt failed
        if (completionMessage) {
          completionMessage.textContent = t.confirmationFailed;
        }
        sendPostMessage('callback-failed', {
          session: sessionId,
          error: error instanceof Error ? error.message : 'Unknown error',
          attempts: MAX_CALLBACK_RETRIES,
        });
      } else {
        // Wait before retrying (exponential backoff)
        const delay = RETRY_DELAY_MS * attempt;
        console.log(`Retrying in ${delay}ms...`);
        sendPostMessage('callback-retry', {
          session: sessionId,
          attempt,
          next_delay: delay,
        });
        await new Promise(resolve => setTimeout(resolve, delay));
      }
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

  // Volume control with arrow up/down
  if (e.key === 'ArrowUp') {
    e.preventDefault();
    e.stopPropagation();
    const currentVolume = player.getVolume();
    const newVolume = Math.min(100, currentVolume + 10);
    player.setVolume(newVolume);
    if (Math.abs(newVolume - lastVolume) > 5) {
      volumeChanges++;
      lastVolume = newVolume;
    }
    console.log(`Volume: ${newVolume}%`);
    return false;
  }

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    e.stopPropagation();
    const currentVolume = player.getVolume();
    const newVolume = Math.max(0, currentVolume - 10);
    player.setVolume(newVolume);
    if (Math.abs(newVolume - lastVolume) > 5) {
      volumeChanges++;
      lastVolume = newVolume;
    }
    console.log(`Volume: ${newVolume}%`);
    return false;
  }

  // Block all other video control keys
  const blockedKeys = [
    'ArrowLeft', 'ArrowRight',
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

// Block Picture-in-Picture
document.addEventListener('enterpictureinpicture', (e) => {
  e.preventDefault();
  if (document.pictureInPictureElement) {
    document.exitPictureInPicture().catch((err) => {
      console.error('Failed to exit PiP:', err);
    });
  }
});

// Track fullscreen changes
document.addEventListener('fullscreenchange', () => {
  if (document.fullscreenElement) {
    fullscreenCount++;
    console.log(`Fullscreen entered (count: ${fullscreenCount})`);
  }
});

// Track tab visibility and auto pause/resume
document.addEventListener('visibilitychange', () => {
  if (!player || isVideoCompleted) return;

  if (document.hidden) {
    // Tab lost focus - pause video
    tabSwitchCount++;
    wasTabActive = false;
    player.pauseVideo();
    sendPostMessage('tab-hidden', {
      tab_switch_count: tabSwitchCount,
      current_time: player.getCurrentTime(),
    });
  } else {
    // Tab gained focus - resume video if it was playing
    const currentState = player.getPlayerState();
    const { YT } = window;

    sendPostMessage('tab-visible', {
      current_time: player.getCurrentTime(),
    });

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
    sendPostMessage('close-attempt', {
      is_completed: true,
    });
    closeAndReturn();
  } else {
    // Video not completed - show confirmation dialog
    sendPostMessage('close-attempt', {
      is_completed: false,
      current_time: player?.getCurrentTime(),
      duration: player?.getDuration(),
    });
    const confirmationDialog = document.getElementById('confirmationDialog');
    if (confirmationDialog) {
      confirmationDialog.classList.add('show');
      // Focus first button for accessibility
      const dialogStay = document.getElementById('dialogStay');
      if (dialogStay) {
        setTimeout(() => dialogStay.focus(), 100);
      }
    }
  }
}

// Dialog button handlers
const dialogStay = document.getElementById('dialogStay');
const dialogLeave = document.getElementById('dialogLeave');

dialogStay?.addEventListener('click', () => {
  sendPostMessage('dialog-stay', {
    current_time: player?.getCurrentTime(),
  });
  const confirmationDialog = document.getElementById('confirmationDialog');
  if (confirmationDialog) {
    confirmationDialog.classList.remove('show');
  }
});

dialogLeave?.addEventListener('click', () => {
  sendPostMessage('dialog-leave', {
    current_time: player?.getCurrentTime(),
    duration: player?.getDuration(),
  });
  closeAndReturn();
});

// Keyboard navigation for dialog
document.addEventListener('keydown', (e) => {
  const confirmationDialog = document.getElementById('confirmationDialog');
  if (confirmationDialog && confirmationDialog.classList.contains('show')) {
    if (e.key === 'Escape') {
      confirmationDialog.classList.remove('show');
    }
    // Tab trap within dialog
    if (e.key === 'Tab') {
      const focusableElements = confirmationDialog.querySelectorAll('button');
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }
});

// Close and return logic
async function closeAndReturn() {
  sendPostMessage('closing', {
    referrer,
    is_completed: isVideoCompleted,
  });

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
