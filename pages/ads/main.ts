import { initPage } from '~/shared/utils/page-init';
import './style.css';

initPage('Watch Ad - Doctorina');

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
const VIDEO_ID = 'Dyth2OnlD-o'; // https://www.youtube.com/watch?v=Dyth2OnlD-o
const CALLBACK_URL = 'http://localhost:3000/callback';

// Get session from URL
const urlParams = new URLSearchParams(window.location.search);
const sessionId = urlParams.get('session');

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
    <div id="player"></div>
    <div class="overlay" id="overlay">
      <div class="controls-info">
        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress-fill" id="progressFill"></div>
          </div>
          <div class="time-info">
            <span class="time-label">Remaining:</span>
            <span class="time-countdown" id="countdown">--:--</span>
          </div>
        </div>
      </div>
      <div class="warning-message" id="warningMessage">
        Please watch the video to the end without skipping
      </div>
    </div>
  </div>
  <div class="completion-screen" id="completionScreen">
    <div class="completion-content">
      <svg class="checkmark" viewBox="0 0 52 52">
        <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
        <path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
      </svg>
      <h2>Thank you for watching!</h2>
      <p id="completionMessage">Sending confirmation...</p>
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
      showWarning('Do not skip ahead! Video will restart.');
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
  const completionScreen = document.getElementById('completionScreen');
  const overlay = document.getElementById('overlay');

  if (completionScreen) completionScreen.classList.add('show');
  if (overlay) overlay.style.display = 'none';

  // Send callback if session exists
  if (sessionId) {
    await sendCallback();
  } else {
    const completionMessage = document.getElementById('completionMessage');
    if (completionMessage) {
      completionMessage.textContent = 'No session ID provided. Callback not sent.';
    }
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
        completionMessage.textContent = 'Confirmation sent successfully!';
      }
    } else {
      throw new Error(`Server responded with ${response.status}`);
    }
  } catch (error) {
    console.error('Failed to send callback:', error);
    if (completionMessage) {
      completionMessage.textContent = 'Failed to send confirmation. Please check your connection.';
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
    showWarning('Keyboard controls are disabled');
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

// Warn before leaving page
window.addEventListener('beforeunload', (e) => {
  if (!isVideoCompleted && maxWatchedTime > 0) {
    e.preventDefault();
    const message = 'Are you sure you want to leave? The video is not finished yet.';
    e.returnValue = message;
    return message;
  }
});
