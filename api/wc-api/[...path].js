/**
 * Proxy same-origin para la API en Render (evita CORS en el navegador).
 * Ruta: /api/wc-api/{endpoint} → https://wc-api-u378.onrender.com/wc-api/api/v1/{endpoint}
 */
const RENDER_API_BASE = 'https://wc-api-u378.onrender.com/wc-api/api/v1';

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const pathParts = req.query.path;
  const pathStr = Array.isArray(pathParts) ? pathParts.join('/') : String(pathParts || '');

  const target = new URL(`${RENDER_API_BASE}/${pathStr}`);

  Object.entries(req.query).forEach(([key, value]) => {
    if (key === 'path') return;
    if (Array.isArray(value)) {
      value.forEach(v => target.searchParams.append(key, v));
    } else if (value != null) {
      target.searchParams.set(key, value);
    }
  });

  try {
    const upstream = await fetch(target.toString(), {
      method: req.method,
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(6000)
    });

    const body = req.method === 'HEAD' ? null : await upstream.text();

    res.status(upstream.status);
    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json');
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');

    if (body !== null) {
      return res.send(body);
    }
    return res.end();
  } catch (err) {
    return res.status(502).json({
      error: 'API proxy error',
      message: err.message || 'Upstream unavailable'
    });
  }
}
