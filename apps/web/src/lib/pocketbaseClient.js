import Pocketbase from 'pocketbase';
import { INITIAL_DATA } from './initialData.js';

// In production on Cloudflare Pages, use same-origin root (PocketBase SDK automatically appends /api)
const POCKETBASE_API_URL = import.meta.env.VITE_POCKETBASE_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:8090');

const pocketbaseClient = new Pocketbase(POCKETBASE_API_URL);

const R2_BASE = 'https://pub-dc2e74d5100540c98a1d252fa2cc7d0b.r2.dev';

// Ensure all assets/images/videos seamlessly resolve to Cloudflare R2 bucket
pocketbaseClient.files.getUrl = function (record, filename, queryParams) {
  if (!record || !filename) return '';
  if (typeof filename === 'string' && (filename.startsWith('http://') || filename.startsWith('https://'))) {
    return filename;
  }
  const collectionId = record.collectionId || record.collectionName || 'pbc_default';
  return `${R2_BASE}/storage/${collectionId}/${filename}`;
};

// Helper for localStorage caching & fallback
function getStoredList(collectionName) {
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(`pb_cache_${collectionName}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
  }
  const seed = INITIAL_DATA[collectionName];
  if (Array.isArray(seed)) {
    return JSON.parse(JSON.stringify(seed));
  }
  return [];
}

function setStoredList(collectionName, list) {
  if (typeof window !== 'undefined' && Array.isArray(list)) {
    try {
      localStorage.setItem(`pb_cache_${collectionName}`, JSON.stringify(list));
    } catch (e) {}
  }
}

function enrichRecord(collectionName, item) {
  if (!item) return item;
  const cloned = { ...item };
  if (collectionName === 'portfolio_videos') {
    if (!cloned.expand) cloned.expand = {};
    if (!cloned.expand.category_id && cloned.category_id) {
      const categories = getStoredList('categories');
      const cat = categories.find(c => c.id === cloned.category_id);
      cloned.expand.category_id = cat || { id: cloned.category_id, name: cloned.category || 'General' };
    }
  }
  return cloned;
}

function sortRecords(records, sortParam) {
  if (!sortParam || !Array.isArray(records)) return records;
  const isDesc = sortParam.startsWith('-');
  const field = sortParam.replace(/^[+-]/, '');
  return [...records].sort((a, b) => {
    let valA = a[field] ?? '';
    let valB = b[field] ?? '';
    if (typeof valA === 'number' && typeof valB === 'number') {
      return isDesc ? valB - valA : valA - valB;
    }
    valA = String(valA).toLowerCase();
    valB = String(valB).toLowerCase();
    return isDesc ? valB.localeCompare(valA) : valA.localeCompare(valB);
  });
}

const originalCollection = pocketbaseClient.collection.bind(pocketbaseClient);

pocketbaseClient.collection = function (collectionName) {
  const col = originalCollection(collectionName);
  const origGetFullList = col.getFullList.bind(col);
  const origGetList = col.getList.bind(col);
  const origGetFirstListItem = col.getFirstListItem.bind(col);
  const origGetOne = col.getOne.bind(col);
  const origCreate = col.create.bind(col);
  const origUpdate = col.update.bind(col);
  const origDelete = col.delete.bind(col);

  col.getFullList = async function (options = {}) {
    try {
      const result = await origGetFullList(options);
      if (Array.isArray(result) && result.length > 0) {
        setStoredList(collectionName, result);
        return result.map(i => enrichRecord(collectionName, i));
      }
    } catch (err) {
      // Fall through to fallback
    }
    let fallback = getStoredList(collectionName);
    if (options.sort) {
      fallback = sortRecords(fallback, options.sort);
    }
    return fallback.map(i => enrichRecord(collectionName, i));
  };

  col.getList = async function (page = 1, perPage = 30, options = {}) {
    try {
      const result = await origGetList(page, perPage, options);
      if (result && Array.isArray(result.items) && result.items.length > 0) {
        return {
          ...result,
          items: result.items.map(i => enrichRecord(collectionName, i))
        };
      }
    } catch (err) {
      // Fall through to fallback
    }
    let fallback = getStoredList(collectionName);
    if (options.sort) {
      fallback = sortRecords(fallback, options.sort);
    }
    const totalItems = fallback.length;
    const totalPages = Math.ceil(totalItems / perPage) || 1;
    const start = (page - 1) * perPage;
    const items = fallback.slice(start, start + perPage).map(i => enrichRecord(collectionName, i));
    return {
      page,
      perPage,
      totalItems,
      totalPages,
      items
    };
  };

  col.getFirstListItem = async function (filter = '', options = {}) {
    try {
      const result = await origGetFirstListItem(filter, options);
      if (result) return enrichRecord(collectionName, result);
    } catch (err) {
      // Fall through to fallback
    }
    const fallback = getStoredList(collectionName);
    if (fallback.length > 0) {
      return enrichRecord(collectionName, fallback[0]);
    }
    throw new Error(`Record not found in ${collectionName}`);
  };

  col.getOne = async function (id, options = {}) {
    try {
      const result = await origGetOne(id, options);
      if (result) return enrichRecord(collectionName, result);
    } catch (err) {
      // Fall through to fallback
    }
    const fallback = getStoredList(collectionName);
    const item = fallback.find(i => i.id === id);
    if (item) return enrichRecord(collectionName, item);
    throw new Error(`Record ${id} not found in ${collectionName}`);
  };

  col.create = async function (data, options = {}) {
    let created = null;
    try {
      created = await origCreate(data, options);
    } catch (err) {
      const id = 'loc_' + Math.random().toString(36).substring(2, 15);
      created = {
        id,
        collectionName,
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        ...(data instanceof FormData ? Object.fromEntries(data.entries()) : data)
      };
    }
    if (created) {
      const list = getStoredList(collectionName);
      list.unshift(created);
      setStoredList(collectionName, list);
    }
    return enrichRecord(collectionName, created);
  };

  col.update = async function (id, data, options = {}) {
    let updated = null;
    try {
      updated = await origUpdate(id, data, options);
    } catch (err) {
      const list = getStoredList(collectionName);
      const index = list.findIndex(i => i.id === id);
      const dataObj = data instanceof FormData ? Object.fromEntries(data.entries()) : data;
      if (index !== -1) {
        list[index] = { ...list[index], ...dataObj, updated: new Date().toISOString() };
        updated = list[index];
        setStoredList(collectionName, list);
      }
    }
    if (updated) {
      const list = getStoredList(collectionName);
      const idx = list.findIndex(i => i.id === id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...updated };
        setStoredList(collectionName, list);
      }
    }
    return enrichRecord(collectionName, updated || { id, ...data });
  };

  col.delete = async function (id, options = {}) {
    try {
      await origDelete(id, options);
    } catch (err) {
      // Fall through to local delete
    }
    const list = getStoredList(collectionName).filter(i => i.id !== id);
    setStoredList(collectionName, list);
    return true;
  };

  return col;
};

export default pocketbaseClient;
export { pocketbaseClient };
