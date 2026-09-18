/**
 * Cloudflare R2 configuration for serving static assets.
 * The R2_BASE_URL should point to the public R2 bucket URL.
 */
const R2_BASE_URL = import.meta.env.VITE_R2_BASE_URL || 'https://pub-dc2e74d5100540c98a1d252fa2cc7d0b.r2.dev';

/**
 * Get the full R2 URL for a given asset path.
 * @param {string} assetPath - The path within the R2 bucket
 * @returns {string} Full URL to the asset
 */
export function getR2Url(assetPath) {
  if (!assetPath) return '';
  if (assetPath.startsWith('http://') || assetPath.startsWith('https://')) return assetPath;
  return `${R2_BASE_URL.replace(/\/$/, '')}/${assetPath.replace(/^\//, '')}`;
}

/**
 * Static asset URLs stored in R2.
 */
export const R2_ASSETS = {
  logo: `${R2_BASE_URL}/static/logo.png`,
  favicon: `${R2_BASE_URL}/static/favicon.jpg`,
};

export default R2_BASE_URL;
