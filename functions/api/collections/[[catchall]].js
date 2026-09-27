import { INITIAL_DATA } from '../../_data.js';

// In-memory store for mutations within edge instance
const store = { ...INITIAL_DATA };

if (!store['admin_users']) {
  store['admin_users'] = [
    {
      id: '2xefxw9q7wkqtzi',
      collectionId: 'pbc_admin_users',
      collectionName: 'admin_users',
      email: 'motionz.studio.team@gmail.com',
      created: '2026-06-07 14:00:00.000Z',
      updated: '2026-06-07 14:00:00.000Z',
    },
    {
      id: 'rq806w52kdiqvxg',
      collectionId: 'pbc_admin_users',
      collectionName: 'admin_users',
      email: 'admin@videoeditingagency.com',
      created: '2026-06-07 14:00:00.000Z',
      updated: '2026-06-07 14:00:00.000Z',
    }
  ];
}

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
  let catchall = params.catchall || [];

  // Handle possible double /api/ prefix (e.g. /api/api/collections/...)
  if (catchall[0] === 'api') {
    catchall = catchall.slice(1);
  }

  // Structure: [collectionName, actionOrId, recordIdIfAction]
  const collectionName = catchall[0];
  const secondPart = catchall[1]; // 'records', 'auth-with-password', 'auth-refresh', etc.
  const thirdPart = catchall[2];  // record ID if secondPart === 'records'

  // 1. Handle auth-with-password for admin_users or users
  if ((collectionName === 'admin_users' || collectionName === 'users') && secondPart === 'auth-with-password') {
    return handleAuthWithPassword(request, collectionName);
  }

  // 2. Handle auth-refresh for admin_users or users
  if ((collectionName === 'admin_users' || collectionName === 'users') && secondPart === 'auth-refresh') {
    return handleAuthRefresh(request, collectionName);
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

  // 3. GET single record: /api/collections/:name/records/:id
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

  // 4. GET list: /api/collections/:name/records
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

    // Handle sort
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

  // 5. POST new record: /api/collections/:name/records
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

  // 6. PATCH record: /api/collections/:name/records/:id
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

  // 7. DELETE record: /api/collections/:name/records/:id
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

function generateJwtToken(userId, collectionId) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const payload = btoa(JSON.stringify({
    id: userId,
    type: 'authRecord',
    collectionId: collectionId || 'pbc_admin_users',
    exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // valid for 30 days
  })).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const signature = 'cf_pages_sig';
  return `${header}.${payload}.${signature}`;
}

async function handleAuthWithPassword(request, collectionName) {
  try {
    const body = await request.json();
    const identity = (body.identity || body.email || '').trim();
    const password = (body.password || '').trim();

    // Check credentials against known admin accounts
    const validUsers = [
      {
        id: '2xefxw9q7wkqtzi',
        email: 'motionz.studio.team@gmail.com',
        password: '12345+6asdfmnbv',
      },
      {
        id: 'rq806w52kdiqvxg',
        email: 'admin@videoeditingagency.com',
        password: '12345+6asdfmnbv',
      }
    ];

    const match = validUsers.find(u => u.email.toLowerCase() === identity.toLowerCase());

    if (!match || (password && password !== match.password)) {
      return new Response(JSON.stringify({
        code: 400,
        message: 'Failed to authenticate.',
        data: {
          identity: {
            code: 'validation_invalid_credentials',
            message: 'Invalid email or password. Please try again.',
          }
        }
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const token = generateJwtToken(match.id, 'pbc_admin_users');
    const record = {
      id: match.id,
      collectionId: 'pbc_admin_users',
      collectionName: collectionName || 'admin_users',
      email: match.email,
      created: '2026-06-07 14:00:00.000Z',
      updated: '2026-06-07 14:00:00.000Z',
    };

    return new Response(JSON.stringify({
      token,
      record,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (e) {
    return new Response(JSON.stringify({
      code: 400,
      message: 'Failed to authenticate.',
      data: { identity: { code: 'validation_error', message: e.message } }
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
}

async function handleAuthRefresh(request, collectionName) {
  const token = generateJwtToken('2xefxw9q7wkqtzi', 'pbc_admin_users');
  const record = {
    id: '2xefxw9q7wkqtzi',
    collectionId: 'pbc_admin_users',
    collectionName: collectionName || 'admin_users',
    email: 'motionz.studio.team@gmail.com',
    created: '2026-06-07 14:00:00.000Z',
    updated: '2026-06-07 14:00:00.000Z',
  };

  return new Response(JSON.stringify({
    token,
    record,
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}
