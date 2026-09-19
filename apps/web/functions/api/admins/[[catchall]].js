const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': '*',
};

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

function generateJwtToken(userId) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const payload = btoa(JSON.stringify({
    id: userId,
    type: 'admin',
    exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60),
  })).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const signature = 'cf_pages_sig';
  return `${header}.${payload}.${signature}`;
}

export async function onRequest(context) {
  const { request, params } = context;
  const action = (params.catchall || [])[0];

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  const token = generateJwtToken('2xefxw9q7wkqtzi');
  const adminObj = {
    id: '2xefxw9q7wkqtzi',
    email: 'motionz.studio.team@gmail.com',
    avatar: 0,
    created: '2026-06-07 14:00:00.000Z',
    updated: '2026-06-07 14:00:00.000Z',
  };

  return new Response(JSON.stringify({
    token,
    admin: adminObj,
    record: adminObj,
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}
