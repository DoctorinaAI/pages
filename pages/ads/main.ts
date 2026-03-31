// TODO(plugfox):
// [ ] Display ads from list of videos instead of single video ID, e.g. multiple youtube shorts
// [x] Close this iframe / webview automatically after all videos are watched rather than showing "You can close manually" message
// [x] Fix Firebase Hosting cache issues, when index.html tries to load old script-abc123.ts.js files after new deploys
// [x] Auto start YouTube video (muted for reliable autoplay)

import { initPage } from '~/shared/utils/page-init';
import './style.css';

// Internationalization (i18n) - Inline translations
const translations = {
    en: {
        // Language: English
        lang: 'en',
        // Page
        pageTitle: 'Doctorina | Watch Ad',
        // Progress
        remaining: 'Remaining:',
        // Warnings
        watchToEnd: 'Please watch the video to the end without skipping',
        doNotSkip: 'Do not skip ahead! Video will restart.',
        keyboardDisabled: 'Keyboard controls are disabled',
        // Loading
        loadingVideo: 'Loading video...',
        videoLoadError: 'Failed to load video. Please refresh the page.',
        // Tooltips & Aria
        videoPlayerLabel: 'Advertisement video player',
        progressBarLabel: 'Video progress',
        // Audio controls
        unmuteVideo: 'Tap to enable sound',
        volumeLabel: 'Volume',
        muteButton: 'Mute',
        unmuteButton: 'Unmute',
    },
    ru: {
        // Язык: Русский
        lang: 'ru',
        // Страница
        pageTitle: 'Doctorina | Просмотр рекламы',
        // Прогресс
        remaining: 'Осталось:',
        // Предупреждения
        watchToEnd: 'Пожалуйста, посмотрите видео до конца без пропусков',
        doNotSkip: 'Не перематывайте! Видео начнется сначала.',
        keyboardDisabled: 'Управление с клавиатуры отключено',
        // Загрузка
        loadingVideo: 'Загрузка видео...',
        videoLoadError: 'Не удалось загрузить видео. Пожалуйста, обновите страницу.',
        // Подсказки и Aria
        videoPlayerLabel: 'Видеоплеер рекламы',
        progressBarLabel: 'Прогресс видео',
        // Управление звуком
        unmuteVideo: 'Нажмите для включения звука',
        volumeLabel: 'Громкость',
        muteButton: 'Выключить звук',
        unmuteButton: 'Включить звук',
    },
    es: {
        // Idioma: Español
        lang: 'es',
        // Página
        pageTitle: 'Doctorina | Ver anuncio',
        // Progreso
        remaining: 'Restante:',
        // Advertencias
        watchToEnd: 'Por favor, mira el vídeo hasta el final sin saltarlo',
        doNotSkip: '¡No adelantes! El vídeo se reiniciará.',
        keyboardDisabled: 'Los controles del teclado están deshabilitados',
        // Carga
        loadingVideo: 'Cargando vídeo...',
        videoLoadError: 'Error al cargar el vídeo. Por favor, actualiza la página.',
        // Tooltips y Aria
        videoPlayerLabel: 'Reproductor de vídeo publicitario',
        progressBarLabel: 'Progreso del vídeo',
        // Controles de audio
        unmuteVideo: 'Toca para activar el sonido',
        volumeLabel: 'Volumen',
        muteButton: 'Silenciar',
        unmuteButton: 'Activar sonido',
    },
    de: {
        // Sprache: Deutsch
        lang: 'de',
        // Seite
        pageTitle: 'Doctorina | Werbung ansehen',
        // Fortschritt
        remaining: 'Verbleibend:',
        // Warnungen
        watchToEnd: 'Bitte schauen Sie das Video bis zum Ende ohne zu überspringen',
        doNotSkip: 'Nicht vorspulen! Video wird neu gestartet.',
        keyboardDisabled: 'Tastatursteuerung ist deaktiviert',
        // Laden
        loadingVideo: 'Video wird geladen...',
        videoLoadError: 'Video konnte nicht geladen werden. Bitte aktualisieren Sie die Seite.',
        // Tooltips und Aria
        videoPlayerLabel: 'Werbevideoplayer',
        progressBarLabel: 'Videofortschritt',
        // Audiosteuerung
        unmuteVideo: 'Tippen Sie, um den Ton zu aktivieren',
        volumeLabel: 'Lautstärke',
        muteButton: 'Stumm schalten',
        unmuteButton: 'Ton aktivieren',
    },
};

// Detect browser language with fallback to English
function detectLanguage(): keyof typeof translations {
    const browserLang = navigator.language.split('-')[0].toLowerCase();
    const supportedLanguages: (keyof typeof translations)[] = ['en', 'ru', 'es', 'de'];
    return supportedLanguages.includes(browserLang as keyof typeof translations) ? (browserLang as keyof typeof translations) : 'en';
}

// Detect iOS devices
function isIOSDevice(): boolean {
    const userAgent = navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); // iPad on iOS 13+
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
    new(
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
const VIDEO_ID = urlParams.get('v') || urlParams.get('video') || import.meta.env.VITE_DEFAULT_VIDEO_ID || 'oE0DHbq-CJQ';

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
const videoStartTime = Date.now();
let fullscreenCount = 0;
let callbackSent = false;

// Advanced analytics tracking
let totalPauseDuration = 0;
let lastPauseTime = 0;
let volumeChanges = 0;
let lastVolume = 100;
let savedVolumeBeforeMute = 100; // Save volume before muting
let tabSwitchCount = 0;
let playerErrorCount = 0;
let bufferingEvents = 0;
let lastBufferingTime = 0;
let totalBufferingDuration = 0;

// Analytics milestones
const milestones = [0.25, 0.5, 0.75];
const reachedMilestones = new Set<number>();

// PostMessage helper for iframe/WebView communication
function sendPostMessage(event: string, data: Record<string, unknown> = {}) {
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
    platform: (navigator as unknown as { userAgentData?: { platform?: string } }).userAgentData?.platform || navigator.platform || 'unknown',
    language: navigator.language,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    viewportSize: `${window.innerWidth}x${window.innerHeight}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    referrer: document.referrer || 'direct',
    deviceMemory: (navigator as unknown as { deviceMemory?: number }).deviceMemory || 'unknown',
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
    <div id="player"></div>

    <!-- Unmute Button Overlay -->
    <div class="unmute-overlay" id="unmuteOverlay">
      <button class="unmute-button" id="unmuteButton" aria-label="${t.unmuteButton}">
        <svg class="unmute-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M11 5L6 9H2v6h4l5 4V5z"/>
          <path d="M15.54 8.46a5 5 0 010 7.07"/>
          <path d="M19.07 4.93a10 10 0 010 14.14"/>
        </svg>
        <span class="unmute-text">${t.unmuteVideo}</span>
      </button>
    </div>

    <div class="overlay" id="overlay">
      <div class="controls-info">
        <div class="progress-container" role="region" aria-label="${t.progressBarLabel}">
          <div class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
            <div class="progress-fill" id="progressFill"></div>
          </div>
          <div class="controls-row">
            <!-- Volume Control (Left Side) -->
            <div class="volume-control" id="volumeControl">
              <button class="volume-button" id="volumeButton" aria-label="${t.muteButton}">
                <svg class="volume-icon volume-icon-high" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 5L6 9H2v6h4l5 4V5z"/>
                  <path d="M15.54 8.46a5 5 0 010 7.07"/>
                  <path d="M19.07 4.93a10 10 0 010 14.14"/>
                </svg>
                <svg class="volume-icon volume-icon-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: none;">
                  <path d="M11 5L6 9H2v6h4l5 4V5z"/>
                  <line x1="23" y1="9" x2="17" y2="15"/>
                  <line x1="17" y1="9" x2="23" y2="15"/>
                </svg>
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value="100"
                class="volume-slider"
                id="volumeSlider"
                aria-label="${t.volumeLabel}"
              />
              <span class="volume-percentage" id="volumePercentage">100%</span>
            </div>

            <!-- Time Info (Right Side) -->
            <div class="time-info">
              <span class="time-label">${t.remaining}</span>
              <span class="time-countdown" id="countdown" aria-live="polite">--:--</span>
              <span class="time-separator">·</span>
              <span class="progress-percentage" id="progressPercentage" aria-live="polite">0%</span>
            </div>
          </div>
        </div>
      </div>
      <div class="warning-message" id="warningMessage" role="alert" aria-live="assertive">
        ${t.watchToEnd}
      </div>
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

    // Start playing (muted for reliable autoplay)
    event.target.playVideo();
    startProgressTracking();

    // Initialize audio controls
    initializeAudioControls();

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

// ===== AUDIO CONTROLS =====

function initializeAudioControls() {
    if (!player) return;

    const isIOS = isIOSDevice();
    const unmuteOverlay = document.getElementById('unmuteOverlay');
    const unmuteButton = document.getElementById('unmuteButton');
    const volumeControl = document.getElementById('volumeControl');
    const volumeButton = document.getElementById('volumeButton');
    const volumeSlider = document.getElementById('volumeSlider') as HTMLInputElement;
    const volumePercentage = document.getElementById('volumePercentage');
    const volumeIconHigh = document.querySelector('.volume-icon-high') as HTMLElement;
    const volumeIconMuted = document.querySelector('.volume-icon-muted') as HTMLElement;

    // Hide volume controls on iOS (YouTube API doesn't support volume control on iOS)
    if (isIOS && volumeControl) {
        volumeControl.style.display = 'none';
        console.log('iOS detected - volume controls hidden (not supported by YouTube API)');
    }

    // Unmute button click handler
    const handleUnmuteClick = (e: MouseEvent | TouchEvent) => {
        // Prevent event from bubbling up and affecting video player
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        if (!player) return;

        // Unmute and set volume (with safety checks for iOS)
        try {
            if (typeof player.unMute === 'function') {
                player.unMute();
            }
            if (typeof player.setVolume === 'function') {
                player.setVolume(100);
            }
        } catch (error) {
            console.warn('Error unmuting video:', error);
        }

        // Hide unmute overlay
        unmuteOverlay?.classList.add('hidden');

        // Update volume slider (only if not iOS)
        if (!isIOS) {
            if (volumeSlider) {
                volumeSlider.value = '100';
            }
            if (volumePercentage) {
                volumePercentage.textContent = '100%';
            }
            updateVolumeIcon(100);
        }

        // Track unmute event
        volumeChanges++;
        sendPostMessage('video-unmuted', {
            current_time: player.getCurrentTime(),
            volume: isIOS ? 'N/A (iOS)' : 100,
        });

        console.log('Video unmuted' + (isIOS ? ' (iOS - volume control unavailable)' : ', volume set to 100%'));
    };

    // Add click handler for unmute button (both click and touch events)
    unmuteButton?.addEventListener('click', handleUnmuteClick, true);
    unmuteButton?.addEventListener('touchend', handleUnmuteClick, true);

    // Prevent clicks on overlay itself from reaching video player
    unmuteOverlay?.addEventListener('mousedown', (e) => {
        e.stopPropagation();
    }, true);
    unmuteOverlay?.addEventListener('touchstart', (e) => {
        e.stopPropagation();
    }, true);

    // Volume button (mute/unmute toggle) - Skip on iOS
    if (!isIOS) {
        volumeButton?.addEventListener('click', () => {
            if (!player) return;

            try {
                const currentVolume = typeof player.getVolume === 'function' ? player.getVolume() : 100;
                const isMuted = typeof player.isMuted === 'function' ? player.isMuted() : false;

                if (currentVolume === 0 || isMuted) {
                    // Unmute - restore previous volume
                    const volumeToRestore = savedVolumeBeforeMute > 0 ? savedVolumeBeforeMute : 100;

                    if (typeof player.unMute === 'function') {
                        player.unMute();
                    }
                    if (typeof player.setVolume === 'function') {
                        player.setVolume(volumeToRestore);
                    }

                    if (volumeSlider) {
                        volumeSlider.value = volumeToRestore.toString();
                    }
                    if (volumePercentage) {
                        volumePercentage.textContent = `${volumeToRestore}%`;
                    }

                    updateVolumeIcon(volumeToRestore);

                    sendPostMessage('volume-unmuted', {
                        current_time: player.getCurrentTime(),
                        volume: volumeToRestore,
                    });

                    console.log(`Unmuted - Volume restored to: ${volumeToRestore}%`);
                } else {
                    // Mute - save current volume first
                    savedVolumeBeforeMute = currentVolume;

                    if (typeof player.setVolume === 'function') {
                        player.setVolume(0);
                    }

                    if (volumeSlider) {
                        volumeSlider.value = '0';
                    }
                    if (volumePercentage) {
                        volumePercentage.textContent = '0%';
                    }

                    updateVolumeIcon(0);

                    sendPostMessage('volume-muted', {
                        current_time: player.getCurrentTime(),
                        saved_volume: savedVolumeBeforeMute,
                    });

                    console.log(`Muted - Saved volume: ${savedVolumeBeforeMute}%`);
                }

                volumeChanges++;
            } catch (error) {
                console.warn('Error toggling mute:', error);
            }
        });
    }

    // Volume slider change handler - Skip on iOS
    if (!isIOS) {
        volumeSlider?.addEventListener('input', (e) => {
            if (!player) return;

            try {
                const target = e.target as HTMLInputElement;
                const volume = parseInt(target.value, 10);

                // Set volume
                if (typeof player.setVolume === 'function') {
                    player.setVolume(volume);
                }

                // Unmute if muted and volume > 0
                const isMuted = typeof player.isMuted === 'function' ? player.isMuted() : false;
                if (isMuted && volume > 0 && typeof player.unMute === 'function') {
                    player.unMute();
                }

                // Save volume for unmute (only if > 0)
                if (volume > 0) {
                    savedVolumeBeforeMute = volume;
                }

                // Update percentage display
                if (volumePercentage) {
                    volumePercentage.textContent = `${volume}%`;
                }

                // Update volume icon
                updateVolumeIcon(volume);

                // Track volume changes (only significant changes)
                if (Math.abs(volume - lastVolume) > 5) {
                    volumeChanges++;
                    lastVolume = volume;

                    sendPostMessage('volume-changed', {
                        current_time: player.getCurrentTime(),
                        volume,
                    });
                }
            } catch (error) {
                console.warn('Error changing volume:', error);
            }
        });
    }

    // Update volume icon based on current volume
    function updateVolumeIcon(volume: number) {
        if (!volumeIconHigh || !volumeIconMuted) return;

        if (volume === 0) {
            volumeIconHigh.style.display = 'none';
            volumeIconMuted.style.display = 'block';
        } else {
            volumeIconHigh.style.display = 'block';
            volumeIconMuted.style.display = 'none';
        }
    }

    // Initial state: show unmute overlay since video starts muted
    if (unmuteOverlay) {
        unmuteOverlay.classList.remove('hidden');
    }

    console.log('Audio controls initialized');
}

async function onVideoComplete() {
    sendPostMessage('video-complete', {
        ...buildCallbackPayload(),
    });

    // Send callback if session exists
    if (sessionId) {
        await sendCallback();
    }

    // Wait a short pause before auto-closing
    await new Promise(resolve => setTimeout(resolve, 500));

    // Automatically close and return without user interaction
    closeAndReturn();
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

    // Mute/Unmute with M key - Skip on iOS
    if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        e.stopPropagation();

        // iOS doesn't support volume control via YouTube API
        if (isIOSDevice()) {
            console.log('Volume control not available on iOS');
            return false;
        }

        try {
            const volumeSlider = document.getElementById('volumeSlider') as HTMLInputElement;
            const volumePercentage = document.getElementById('volumePercentage');
            const currentVolume = typeof player.getVolume === 'function' ? player.getVolume() : 100;
            const isMuted = typeof player.isMuted === 'function' ? player.isMuted() : false;

            if (currentVolume === 0 || isMuted) {
                // Unmute - restore previous volume
                const volumeToRestore = savedVolumeBeforeMute > 0 ? savedVolumeBeforeMute : 100;

                if (typeof player.unMute === 'function') {
                    player.unMute();
                }
                if (typeof player.setVolume === 'function') {
                    player.setVolume(volumeToRestore);
                }

                if (volumeSlider) {
                    volumeSlider.value = volumeToRestore.toString();
                }
                if (volumePercentage) {
                    volumePercentage.textContent = `${volumeToRestore}%`;
                }

                updateVolumeIconState(volumeToRestore);
                console.log(`Unmuted - Volume restored to: ${volumeToRestore}%`);
            } else {
                // Mute - save current volume first
                savedVolumeBeforeMute = currentVolume;

                if (typeof player.setVolume === 'function') {
                    player.setVolume(0);
                }

                if (volumeSlider) {
                    volumeSlider.value = '0';
                }
                if (volumePercentage) {
                    volumePercentage.textContent = '0%';
                }

                updateVolumeIconState(0);
                console.log(`Muted - Saved volume: ${savedVolumeBeforeMute}%`);
            }

            volumeChanges++;
        } catch (error) {
            console.warn('Error toggling mute with keyboard:', error);
        }

        return false;
    }

    // Volume control with arrow up/down - Skip on iOS
    if (e.key === 'ArrowUp') {
        e.preventDefault();
        e.stopPropagation();

        // iOS doesn't support volume control via YouTube API
        if (isIOSDevice()) {
            console.log('Volume control not available on iOS');
            return false;
        }

        try {
            const volumeSlider = document.getElementById('volumeSlider') as HTMLInputElement;
            const volumePercentage = document.getElementById('volumePercentage');
            const currentVolume = typeof player.getVolume === 'function' ? player.getVolume() : 100;
            const newVolume = Math.min(100, currentVolume + 10);

            if (typeof player.setVolume === 'function') {
                player.setVolume(newVolume);
            }

            // Unmute if muted and volume > 0
            const isMuted = typeof player.isMuted === 'function' ? player.isMuted() : false;
            if (isMuted && newVolume > 0 && typeof player.unMute === 'function') {
                player.unMute();
            }

            // Save volume for unmute (only if > 0)
            if (newVolume > 0) {
                savedVolumeBeforeMute = newVolume;
            }

            if (volumeSlider) {
                volumeSlider.value = newVolume.toString();
            }
            if (volumePercentage) {
                volumePercentage.textContent = `${newVolume}%`;
            }

            updateVolumeIconState(newVolume);

            if (Math.abs(newVolume - lastVolume) > 5) {
                volumeChanges++;
                lastVolume = newVolume;
            }
            console.log(`Volume: ${newVolume}%`);
        } catch (error) {
            console.warn('Error changing volume with keyboard:', error);
        }

        return false;
    }

    if (e.key === 'ArrowDown') {
        e.preventDefault();
        e.stopPropagation();

        // iOS doesn't support volume control via YouTube API
        if (isIOSDevice()) {
            console.log('Volume control not available on iOS');
            return false;
        }

        try {
            const volumeSlider = document.getElementById('volumeSlider') as HTMLInputElement;
            const volumePercentage = document.getElementById('volumePercentage');
            const currentVolume = typeof player.getVolume === 'function' ? player.getVolume() : 100;
            const newVolume = Math.max(0, currentVolume - 10);

            if (typeof player.setVolume === 'function') {
                player.setVolume(newVolume);
            }

            // Save volume for unmute (only if > 0)
            if (newVolume > 0) {
                savedVolumeBeforeMute = newVolume;
            }

            if (volumeSlider) {
                volumeSlider.value = newVolume.toString();
            }
            if (volumePercentage) {
                volumePercentage.textContent = `${newVolume}%`;
            }

            updateVolumeIconState(newVolume);

            if (Math.abs(newVolume - lastVolume) > 5) {
                volumeChanges++;
                lastVolume = newVolume;
            }
            console.log(`Volume: ${newVolume}%`);
        } catch (error) {
            console.warn('Error changing volume with keyboard:', error);
        }

        return false;
    }

    // Block all other video control keys
    const blockedKeys = [
        'ArrowLeft', 'ArrowRight',
        'Home', 'End',
        'PageUp', 'PageDown',
        'j', 'l', 'f', 'c',
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    ];

    if (blockedKeys.includes(e.key) || blockedKeys.includes(e.code)) {
        e.preventDefault();
        e.stopPropagation();
        showWarning(t.keyboardDisabled);
        return false;
    }
});

// Helper function to update volume icon state (for keyboard controls)
function updateVolumeIconState(volume: number) {
    const volumeIconHigh = document.querySelector('.volume-icon-high') as HTMLElement;
    const volumeIconMuted = document.querySelector('.volume-icon-muted') as HTMLElement;

    if (!volumeIconHigh || !volumeIconMuted) return;

    if (volume === 0) {
        volumeIconHigh.style.display = 'none';
        volumeIconMuted.style.display = 'block';
    } else {
        volumeIconHigh.style.display = 'block';
        volumeIconMuted.style.display = 'none';
    }
}

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

// No beforeunload warning and no manual close button

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
    //tryCloseTab();
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

