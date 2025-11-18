/**
 * Initialize page metadata and analytics
 */
export function initPage(title: string): void {
  document.title = title;

  // Log page view
  console.log(`[Page Init] ${title} - ${new Date().toISOString()}`);

  // Add any common initialization logic here
  // e.g., analytics, error tracking, etc.
}

/**
 * Set page title
 */
export function setPageTitle(title: string): void {
  document.title = title;
}

/**
 * Get page metadata
 */
export function getPageMeta(): {
  title: string;
  url: string;
  timestamp: string;
} {
  return {
    title: document.title,
    url: window.location.href,
    timestamp: new Date().toISOString(),
  };
}
