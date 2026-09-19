import Pocketbase from 'pocketbase';

// In production on Cloudflare Pages, use same-origin /api so it works on any domain (motionz.pages.dev, motionz.pro, www.motionz.pro)
const POCKETBASE_API_URL = import.meta.env.VITE_POCKETBASE_URL || (typeof window !== 'undefined' ? `${window.location.origin}/api` : 'http://localhost:8090');

const pocketbaseClient = new Pocketbase(POCKETBASE_API_URL);

export default pocketbaseClient;

export { pocketbaseClient };
