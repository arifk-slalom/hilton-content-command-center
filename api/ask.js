// Vercel serverless function: proxies the prototype's AI calls to the Claude API.
// Set ANTHROPIC_API_KEY in Vercel → Project → Settings → Environment Variables.
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ isError: true, text: 'POST only' });
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return res.status(500).json({ isError: true, text: 'Missing ANTHROPIC_API_KEY' });

  const { prompt = '', data = [] } = req.body || {};
  const parts = (Array.isArray(data) ? data : [data])
    .map((d, i) => `data[${i}]:\n${typeof d === 'string' ? d : JSON.stringify(d)}`);
  const content = `${prompt}\n\n${parts.join('\n\n')}`.slice(0, 12000); // basic abuse guard

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({
        model: process.env.CLAUDE_MODEL || 'claude-haiku-5-5',
        max_tokens: 900,
        messages: [{ role: 'user', content }],
      }),
    });
    const j = await r.json();
    if (!r.ok) return res.status(502).json({ isError: true, text: j?.error?.message || 'Upstream error' });
    const text = (j.content || []).filter(b => b.type === 'text').map(b => b.text).join('');
    return res.status(200).json({ text });
  } catch (e) {
    return res.status(500).json({ isError: true, text: String(e) });
  }
}
