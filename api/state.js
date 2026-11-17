// Споделено състояние на сайта (Upstash Redis през REST, без зависимости)
const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOK = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const KEY = 'venito:state:v1';
const MAPS = ['fav', 'plan', 'rfav', 'ofav'];
const LISTS = { outfits: 60, notes: 200, slots: 80 };
const empty = () => ({ fav: {}, plan: {}, rfav: {}, ofav: {}, outfits: [], notes: [], slots: [], log: [], v: 0 });
const cut = (s, n) => String(s ?? '').slice(0, n);

async function load() {
  const r = await fetch(`${URL_}/get/${KEY}`, { headers: { Authorization: `Bearer ${TOK}` } });
  const j = await r.json();
  return j.result ? { ...empty(), ...JSON.parse(j.result) } : empty();
}
async function save(st) {
  await fetch(`${URL_}/set/${KEY}`, { method: 'POST', headers: { Authorization: `Bearer ${TOK}` }, body: JSON.stringify(st) });
}
function cleanItem(list, it) {
  const o = { id: cut(it.id, 40) };
  if (list === 'outfits') Object.assign(o, { title: cut(it.title, 80), when: cut(it.when, 60), cat: ['x', 'd', 'h'].includes(it.cat) ? it.cat : 'd', colors: (Array.isArray(it.colors) ? it.colors : []).slice(0, 4).map(c => [cut(c[0], 9), cut(c[1], 20)]), desc: cut(it.desc, 700), link: cut(it.link, 300), hidden: !!it.hidden });
  if (list === 'notes') Object.assign(o, { text: cut(it.text, 500), done: !!it.done });
  if (list === 'slots') Object.assign(o, { day: Math.max(0, Math.min(2, +it.day || 0)), time: cut(it.time, 8), title: cut(it.title, 80), desc: cut(it.desc, 300) });
  return o;
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!URL_ || !TOK) return res.status(503).json({ error: 'no-store' });
  try {
    if (req.method === 'GET') return res.status(200).json(await load());
    if (req.method !== 'POST') return res.status(405).end();
    const b = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const st = await load();
    const who = cut(b.who, 20) || 'Някой';
    const now = Date.now();
    if (b.op === 'map' && MAPS.includes(b.kind) && b.val && typeof b.val === 'object') {
      const m = {}; Object.keys(b.val).slice(0, 80).forEach(k => { if (b.val[k]) m[cut(k, 40)] = 1; });
      st[b.kind] = m;
    } else if (b.op === 'upsert' && LISTS[b.list] && b.item) {
      const it = cleanItem(b.list, b.item); if (!it.id) return res.status(400).json({ error: 'id' });
      const L = st[b.list]; const i = L.findIndex(x => x.id === it.id);
      if (i >= 0) L[i] = { ...L[i], ...it, by: L[i].by || who, ed: who, t: now }; else { if (L.length >= LISTS[b.list]) return res.status(400).json({ error: 'full' }); L.push({ ...it, by: who, t: now }); }
    } else if (b.op === 'remove' && LISTS[b.list]) {
      st[b.list] = st[b.list].filter(x => x.id !== cut(b.id, 40));
    } else return res.status(400).json({ error: 'op' });
    if (b.msg) { st.log.unshift({ t: now, who, txt: cut(b.msg, 160) }); st.log = st.log.slice(0, 120); }
    st.v = (st.v || 0) + 1;
    await save(st);
    return res.status(200).json(st);
  } catch (e) {
    return res.status(500).json({ error: 'server' });
  }
}
