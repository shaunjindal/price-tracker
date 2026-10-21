import * as config from '../config';

const toQuery = (params = {}) => {
  const parts = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
  return parts.length ? `?${parts.join('&')}` : '';
};

export async function get(path, params) {
  const res = await fetch(`${config.API_BASE_URL}${path}${toQuery(params)}`);
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json();
}

// config.API_KEY is optional (only needed if the server sets APP_API_KEY)
export async function post(path, body, { timeoutMs = 60000 } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${config.API_BASE_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(config.API_KEY ? { 'x-api-key': config.API_KEY } : {}),
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
    return data;
  } catch (e) {
    if (e.name === 'AbortError') {
      throw new Error('The server took too long to respond. Please try again.');
    }
    if (e instanceof TypeError) {
      throw new Error('Could not reach the server. Check the internet connection and try again.');
    }
    throw e;
  } finally {
    clearTimeout(timer);
  }
}
