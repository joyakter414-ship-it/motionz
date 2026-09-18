import Pocketbase from 'pocketbase';

// In production, VITE_POCKETBASE_URL should point to the PocketBase server
// In development, use the proxy configured in vite.config.js
const POCKETBASE_API_URL = import.meta.env.VITE_POCKETBASE_URL || '/api';

const pocketbaseClient = new Pocketbase(POCKETBASE_API_URL);

export default pocketbaseClient;

export { pocketbaseClient };
