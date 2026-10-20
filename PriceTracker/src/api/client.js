import { API_BASE_URL } from '../config';

const toQuery = (params = {}) => {
  const parts = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
  return parts.length ? `?${parts.join('&')}` : '';
};

export async function get(path, params) {
  const res = await fetch(`${API_BASE_URL}${path}${toQuery(params)}`);
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json();
}
