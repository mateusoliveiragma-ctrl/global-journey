export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { name, email } = req.body || {};
  if (!email) return res.status(400).json({ error: 'E-mail obrigatório' });
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.WELCOME_FROM_EMAIL;
  if (!apiKey || !from) return res.status(503).json({ error: 'Serviço de e-mail não configurado' });
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to: [email],
      subject: 'Bem-vindo ao Global Journey ✈️',
      html: `<div style="font-family:Arial,sans-serif;line-height:1.6"><h1>Bem-vindo, ${escapeHtml(name || 'Viajante')}!</h1><p>Sua jornada no Global Journey começou.</p><p>Acesse sua conta para planejar viagens, consultar sua bagagem e acompanhar suas preferências.</p><p>Boa viagem!<br><strong>Global Journey</strong></p></div>`
    })
  });
  const data = await response.json();
  if (!response.ok) return res.status(response.status).json(data);
  return res.status(200).json({ ok: true });
}
function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
}
