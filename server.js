// Cloudflare KV Store bağlantısı
const TOKENS = KV_NAMESPACE;  // Burada TOKENS'i Cloudflare'da KV Store olarak ayarlamalısınız

// GET: /alltokens endpoint
async function handleGetRequest(request) {
  const tokens = await TOKENS.get('tokens', 'json');
  return new Response(JSON.stringify(tokens || { count: 0, tokens: [] }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

// POST: /savetoken endpoint
async function handlePostRequest(request) {
  const { jwt } = await request.json();
  if (!jwt) {
    return new Response('JWT token is required', { status: 400 });
  }

  const tokens = await TOKENS.get('tokens', 'json') || { count: 0, tokens: [] };
  tokens.tokens.push({ jwt, created_at: new Date().toISOString() });
  tokens.count = tokens.tokens.length;

  await TOKENS.put('tokens', JSON.stringify(tokens));

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

// Request handler
addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (url.pathname === '/alltokens' && event.request.method === 'GET') {
    event.respondWith(handleGetRequest(event.request));
  } else if (url.pathname === '/savetoken' && event.request.method === 'POST') {
    event.respondWith(handlePostRequest(event.request));
  } else {
    event.respondWith(new Response('Not Found', { status: 404 }));
  }
});
