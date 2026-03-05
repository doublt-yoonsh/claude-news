export async function onRequestPost(context) {
  const { request } = context;

  const body = await request.json();
  const { email, lang } = body;

  if (!email || !lang) {
    return new Response(JSON.stringify({ error: 'Missing email or lang' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const API_KEY = context.env.BREVO_API_KEY;
  const DOI_TEMPLATE_ID = 5;
  const REDIRECT_URL = `https://claude-news.today/subscribed/?lang=${lang}`;

  const listMap = { ko: 3, en: 4, ja: 5 };
  const listId = listMap[lang];
  if (!listId) {
    return new Response(JSON.stringify({ error: 'Invalid lang' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const res = await fetch('https://api.brevo.com/v3/contacts/doubleOptinConfirmation', {
    method: 'POST',
    headers: {
      'api-key': API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
      includeListIds: [listId],
      templateId: DOI_TEMPLATE_ID,
      redirectionUrl: REDIRECT_URL,
    }),
  });

  if (res.status === 204 || res.status === 201) {
    return new Response(JSON.stringify({ success: true }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const data = await res.json();

  if (data.code === 'duplicate_parameter') {
    return new Response(JSON.stringify({ error: { code: 'MEMBER_EXISTS_WITH_EMAIL_ADDRESS' } }), {
      status: 409,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify(data), {
    status: res.status,
    headers: { 'Content-Type': 'application/json' },
  });
}
