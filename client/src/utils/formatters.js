/**
 * Format a number with commas: 1234 → "1,234"
 */
export function formatNumber(num) {
  return num?.toLocaleString() ?? '0';
}

/**
 * Format a date to a friendly string.
 */
export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format relative time: "2 hours ago", "just now", etc.
 */
export function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return formatDate(date);
}

/**
 * Generate a UUID v4 for idempotency keys.
 */
export function generateId() {
  return crypto.randomUUID();
}

/**
 * Clamp a value between min and max.
 */
export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
