// Thin client for the WhatsApp Business Cloud API (Meta).
const { whatsapp: cfg } = require('../config/env');
const HttpError = require('../utils/httpError');

exports.isConfigured = () => Boolean(cfg.token && cfg.phoneNumberId);

// Meta error code -> message shown to the worker in the app
const FRIENDLY = {
  131047: 'This customer has not messaged your WhatsApp number in the last 24 hours. Ask the server admin to set up an approved message template (WHATSAPP_TEMPLATE_NAME).',
  131030: 'This number is not on the allowed recipients list (WhatsApp is still in test mode).',
  131026: 'This number is not on WhatsApp or cannot receive the message.',
  132000: 'The WhatsApp message template is not set up correctly on the server.',
  132001: 'The WhatsApp message template was not found or is not approved yet.',
  132018: 'The WhatsApp message template is not set up correctly on the server.',
  130429: 'WhatsApp rate limit reached. Please try again in a minute.',
  190: 'The WhatsApp access token on the server is invalid or has expired.',
};

async function request(payload) {
  const url = `https://graph.facebook.com/${cfg.apiVersion}/${cfg.phoneNumberId}/messages`;
  let res;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${cfg.token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ messaging_product: 'whatsapp', ...payload }),
      signal: AbortSignal.timeout(20000),
    });
  } catch (err) {
    console.error('WhatsApp request failed:', err.name);
    throw new HttpError(err.name === 'TimeoutError' ? 504 : 502, 'Could not reach WhatsApp. Please try again.');
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const code = data?.error?.code;
    console.error('WhatsApp API error:', res.status, code, data?.error?.message);
    throw new HttpError(502, FRIENDLY[code] || 'WhatsApp could not send the message.');
  }
  return { messageId: data?.messages?.[0]?.id };
}

exports.sendText = (to, body) =>
  request({ to, type: 'text', text: { body, preview_url: false } });

exports.sendTemplate = (to, { name, language, params }) =>
  request({
    to,
    type: 'template',
    template: {
      name,
      language: { code: language },
      components: [{ type: 'body', parameters: params.map((text) => ({ type: 'text', text })) }],
    },
  });
