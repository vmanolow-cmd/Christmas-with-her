// Качени снимки (Vercel Blob)
const { put, list, del } = require('@vercel/blob');
module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (!process.env.BLOB_READ_WRITE_TOKEN) return res.status(503).json({ error: 'off' });
  try {
    if (req.method === 'GET') {
      const out = []; let cursor;
      do { const r = await list({ prefix: 'photos/', cursor, limit: 1000 }); out.push(...r.blobs); cursor = r.hasMore ? r.cursor : undefined; } while (cursor);
      out.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
      return res.status(200).json(out.map(b => ({ url: b.url, t: b.uploadedAt })));
    }
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const buf = Buffer.from(String(body && body.data || ''), 'base64');
      if (buf.length < 100 || buf.length > 4 * 1024 * 1024 || buf[0] !== 0xff || buf[1] !== 0xd8) return res.status(400).json({ error: 'bad' });
      const b = await put(`photos/${Date.now()}.jpg`, buf, { access: 'public', contentType: 'image/jpeg', addRandomSuffix: true });
      return res.status(200).json({ url: b.url, t: new Date().toISOString() });
    }
    if (req.method === 'DELETE') {
      const u = String(req.query.u || '');
      if (!/^https:\/\/[a-z0-9]+\.public\.blob\.vercel-storage\.com\/photos\//.test(u)) return res.status(400).json({ error: 'bad' });
      await del(u);
      return res.status(200).json({ ok: 1 });
    }
    res.status(405).end();
  } catch (e) { res.status(500).json({ error: 'server' }); }
};
