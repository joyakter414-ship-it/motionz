const R2_BASE_URL = 'https://pub-dc2e74d5100540c98a1d252fa2cc7d0b.r2.dev';

export async function onRequest(context) {
  const { params } = context;
  let catchall = params.catchall || [];

  if (catchall[0] === 'api') {
    catchall = catchall.slice(1);
  }

  // Structure: [collectionId, recordId, filename]
  const collectionId = catchall[0];
  const recordId = catchall[1];
  const filename = catchall[2];

  if (!collectionId || !filename) {
    return new Response('File not found', { status: 404 });
  }

  // Files in R2 are stored at storage/<collectionId>/<filename>
  const targetUrl = `${R2_BASE_URL}/storage/${collectionId}/${filename}`;

  return Response.redirect(targetUrl, 302);
}
