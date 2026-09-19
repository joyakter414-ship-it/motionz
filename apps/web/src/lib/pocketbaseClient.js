import Pocketbase from 'pocketbase';

// In production on Cloudflare Pages, use same-origin root (PocketBase SDK automatically appends /api)
const POCKETBASE_API_URL = import.meta.env.VITE_POCKETBASE_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:8090');

const pocketbaseClient = new Pocketbase(POCKETBASE_API_URL);

export default pocketbaseClient;

export { pocketbaseClient };
