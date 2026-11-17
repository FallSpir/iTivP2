const BASE = 'http://localhost:3001/api';

async function request(path, opts = {}) {
  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...opts,
    });
  } catch {
    const err = new Error('Сервер недоступен. Проверьте подключение.');
    err.status = 503;
    throw err;
  }

  if (res.status === 204) return null;

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(body.error || `Ошибка ${res.status}`);
    err.status = res.status;
    err.errors = body.errors;
    throw err;
  }

  return body;
}

export const api = {
  getMetrics: (params = {}) => {
    const q = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null))
    ).toString();
    return request(`/metrics${q ? '?' + q : ''}`);
  },
  getMetric:      (id)       => request(`/metrics/${encodeURIComponent(id)}`),
  createMetric:   (data)     => request('/metrics',     { method: 'POST',  body: JSON.stringify(data) }),
  patchMetric:    (id, data) => request(`/metrics/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteMetric:   (id)       => request(`/metrics/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  getCategories:  ()         => request('/categories'),
  getCategory:    (name)     => request(`/categories/${encodeURIComponent(name)}`),
  getLogs:        (limit=10) => request(`/logs?limit=${Math.min(Number(limit) || 10, 500)}`),
};
