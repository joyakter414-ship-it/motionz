/**
 * Cloudflare R2 configuration for serving static assets.
 * The R2_BASE_URL should point to the public R2 bucket URL.
 */
const R2_BASE_URL = import.meta.env.VITE_R2_BASE_URL || '';

/**
 * Get the full R2 URL for a given asset path.
 * @param {string} assetPath - The path within the R2 bucket
 * @returns {string} Full URL to the asset
 */
export function getR2Url(assetPath) {
  if (!R2_BASE_URL) return assetPath;
  return `${R2_BASE_URL.replace(/\/$/, '')}/${assetPath.replace(/^\//, '')}`;
}

/**
 * Static asset URLs stored in R2.
 */
export const R2_ASSETS = {
  logo: R2_BASE_URL ? `${R2_BASE_URL}/static/logo.png` : 'https://horizons-cdn.hostinger.com/c4703616-8e78-4387-bee2-053e8aa3b166/305769d2d030ada0f7dc9e75f5221df3.png',
  favicon: R2_BASE_URL ? `${R2_BASE_URL}/static/favicon.jpg` : 'https://horizons-cdn.hostinger.com/c4703616-8e78-4387-bee2-053e8aa3b166/cf991eec4983bee7da1e8eb367923296.jpg',
};

export default R2_BASE_URL;
