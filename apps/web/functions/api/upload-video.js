export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    },
  });
}

export async function onRequestPost(context) {
  try {
    const bucket = context.env.VIDEOS_BUCKET;
    if (!bucket) {
      return new Response(JSON.stringify({ error: 'R2 bucket not bound' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    const contentType = context.request.headers.get('content-type') || '';
    let file = null;
    let filename = '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await context.request.formData();
      file = formData.get('file') || formData.get('video');
      if (file && typeof file !== 'string') {
        filename = file.name;
      }
    } else {
      // Direct stream
      const url = new URL(context.request.url);
      filename = url.searchParams.get('filename') || `video_${Date.now()}.webm`;
      file = context.request.body;
    }

    if (!file) {
      return new Response(JSON.stringify({ error: 'No video file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    // Clean filename and make unique
    const safeName = (filename || `video_${Date.now()}.webm`).replace(/[^a-zA-Z0-9._-]/g, '_');
    const key = `motionz/videos/${Date.now()}_${safeName}`;
    const fileMime = (file.type && file.type !== 'application/octet-stream') ? file.type : 'video/webm';

    // Stream directly into Cloudflare R2
    const fileBody = typeof file.stream === 'function' ? file.stream() : file;
    await bucket.put(key, fileBody, {
      httpMetadata: {
        contentType: fileMime,
      },
    });

    const publicUrl = `https://pub-78c336ff5be0419da423b98c4be32928.r2.dev/${key}`;

    return new Response(JSON.stringify({
      success: true,
      url: publicUrl,
      key: key,
      filename: safeName,
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: error.message || 'Upload failed',
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}
