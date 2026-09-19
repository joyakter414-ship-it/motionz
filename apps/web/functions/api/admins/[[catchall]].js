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

export async function onRequest(context) {
  const { request, params } = context;
  const action = (params.catchall || [])[0];

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  const token = 'admin_cf_pages_token_' + Date.now();
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
