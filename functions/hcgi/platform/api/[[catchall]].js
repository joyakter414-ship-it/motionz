export async function onRequest(context) {
  const { request, params } = context;
  const url = new URL(request.url);
  const catchall = (params.catchall || []).join('/');

  // Rewrite /hcgi/platform/api/... to /api/...
  const newUrl = new URL(request.url);
  newUrl.pathname = `/api/${catchall}`;

  return context.env ? context.next(new Request(newUrl.toString(), request)) : Response.redirect(newUrl.toString(), 307);
}
