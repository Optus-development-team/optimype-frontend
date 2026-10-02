// Cliente del backend de OPTUS para la página /autorizar/:id.
// Por defecto usa el mismo origen (el servidor de Vite reenvía /v1 al backend).

const API_BASE = String(import.meta.env.VITE_AUTH_API_URL ?? '').replace(/\/+$/, '');

async function call(path, { method = 'GET', body } = {}) {
  const response = await fetch(`${API_BASE}/v1/supplier-payments/${path}`, {
    method,
    headers: {
      accept: 'application/json',
      'ngrok-skip-browser-warning': 'true',
      ...(body ? { 'content-type': 'application/json' } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const detail = typeof data?.message === 'string' ? data.message : data?.message?.message;
    const error = new Error(detail || `Error ${response.status}`);
    error.status = response.status;
    error.code = data?.code ?? data?.message?.code ?? null;
    throw error;
  }
  return data;
}

const enc = encodeURIComponent;

export const supplierPaymentsApi = {
  get: (id) => call(enc(id)),
  options: (id, purpose) => call(`${enc(id)}/webauthn/options`, { method: 'POST', body: { purpose } }),
  register: (id, attestation) => call(`${enc(id)}/webauthn/register`, { method: 'POST', body: attestation }),
  approve: (id, assertion) => call(`${enc(id)}/approve`, { method: 'POST', body: assertion }),
  reject: (id) => call(`${enc(id)}/reject`, { method: 'POST' }),
};
