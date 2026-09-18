import Pocketbase from 'pocketbase';

// In production, VITE_POCKETBASE_URL can point to custom server or defaults to live backend
const POCKETBASE_API_URL = import.meta.env.VITE_POCKETBASE_URL || 'https://www.motionz.pro/hcgi/platform';

const pocketbaseClient = new Pocketbase(POCKETBASE_API_URL);

export default pocketbaseClient;

export { pocketbaseClient };
