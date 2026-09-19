import { INITIAL_DATA } from '../../_data.js';

// In-memory store for mutations within edge instance
const store = { ...INITIAL_DATA };

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': '*',
};

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function onRequest(context) {
  const { request, params } = context;
  const url = new URL(request.url);
  const catchall = params.catchall || [];

  // Structure: [collectionName, actionOrId, recordIdIfAction]
  const collectionName = catchall[0];
  const secondPart = catchall[1]; // 'records', 'auth-with-password', etc.
  const thirdPart = catchall[2];  // record ID if secondPart === 'records'

  // Handle /api/collections/users/auth-with-password
  if (collectionName === 'users' && secondPart === 'auth-with-password') {
    return handleAuth(request);
  }

  if (!collectionName || secondPart !== 'records') {
    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // Ensure collection exists in store
  if (!store[collectionName]) {
    store[collectionName] = [];
  }

  const method = request.method.toUpperCase();

  // 1. GET single record: /api/collections/:name/records/:id
  if (method === 'GET' && thirdPart) {
    const item = store[collectionName].find(i => i.id === thirdPart);
    if (!item) {
      return new Response(JSON.stringify({ code: 404, message: 'The requested resource wasn\'t found.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
    return new Response(JSON.stringify(item), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // 2. GET list: /api/collections/:name/records
  if (method === 'GET') {
    let items = [...store[collectionName]];

    // Handle expand (e.g. category_id for portfolio_videos)
    const expandParam = url.searchParams.get('expand');
    if (expandParam && expandParam.includes('category_id') && store['categories']) {
      items = items.map(it => {
        const cat = store['categories'].find(c => c.id === it.category_id);
        return {
          ...it,
          expand: {
            ...it.expand,
            category_id: cat || null,
          }
        };
      });
    }

    // Handle sort (simple handling for common cases)
    const sort = url.searchParams.get('sort');
    if (sort) {
      if (sort.includes('-created')) {
        items.sort((a, b) => new Date(b.created || 0) - new Date(a.created || 0));
      } else if (sort.includes('+order')) {
        items.sort((a, b) => (a.order || 0) - (b.order || 0));
      } else if (sort.includes('-rating')) {
        items.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      }
    }

    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const perPage = parseInt(url.searchParams.get('perPage') || '200', 10);
    const totalItems = items.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / perPage));

    const paginatedItems = items.slice((page - 1) * perPage, page * perPage);

    return new Response(JSON.stringify({
      page,
      perPage,
      totalItems,
      totalPages,
      items: paginatedItems,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // 3. POST new record: /api/collections/:name/records
  if (method === 'POST') {
    try {
      let body = {};
      const contentType = request.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        body = await request.json();
      } else if (contentType.includes('multipart/form-data')) {
        const formData = await request.formData();
        for (const [k, v] of formData.entries()) {
          body[k] = v;
        }
      }

      const now = new Date().toISOString().replace('T', ' ').substring(0, 23) + 'Z';
      const newId = Math.random().toString(36).substring(2, 17);
      const newRecord = {
        id: newId,
        collectionName,
        created: now,
        updated: now,
        ...body,
      };

      store[collectionName].unshift(newRecord);

      return new Response(JSON.stringify(newRecord), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
  }

  // 4. PATCH record: /api/collections/:name/records/:id
  if (method === 'PATCH' && thirdPart) {
    try {
      let body = {};
      const contentType = request.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        body = await request.json();
      } else if (contentType.includes('multipart/form-data')) {
        const formData = await request.formData();
        for (const [k, v] of formData.entries()) {
          body[k] = v;
        }
      }

      const index = store[collectionName].findIndex(i => i.id === thirdPart);
      if (index === -1) {
        return new Response(JSON.stringify({ error: 'Record not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      const now = new Date().toISOString().replace('T', ' ').substring(0, 23) + 'Z';
      store[collectionName][index] = {
        ...store[collectionName][index],
        ...body,
        updated: now,
      };

      return new Response(JSON.stringify(store[collectionName][index]), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
  }

  // 5. DELETE record: /api/collections/:name/records/:id
  if (method === 'DELETE' && thirdPart) {
    store[collectionName] = store[collectionName].filter(i => i.id !== thirdPart);
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}

async function handleAuth(request) {
  try {
    const body = await request.json();
    // Default admin or any user check
    const token = 'cf_pages_auth_token_' + Date.now();
    return new Response(JSON.stringify({
      token,
      record: {
        id: '2xefxw9q7wkqtzi',
        email: body.identity || 'motionz.studio.team@gmail.com',
        created: '2026-06-07 14:00:00.000Z',
        updated: '2026-06-07 14:00:00.000Z',
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Auth failed' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
}
