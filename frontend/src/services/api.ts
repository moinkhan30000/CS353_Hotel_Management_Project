const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1';

export type Role = 'guest' | 'manager' | 'admin';

export interface CurrentUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string | null;
  role: Role;
}

interface LoginResponse {
  access: string;
  refresh: string;
  user: CurrentUser;
}

const readError = async (response: Response) => {
  const body = await response.json().catch(() => null);
  if (body?.detail) return String(body.detail);
  if (body && typeof body === 'object') {
    const first = Object.values(body)[0];
    if (Array.isArray(first)) return String(first[0]);
    if (first) return String(first);
  }
  return `Request failed (${response.status})`;
};

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData)) headers.set('Content-Type', 'application/json');
  const access = localStorage.getItem('accessToken');
  if (access) headers.set('Authorization', `Bearer ${access}`);
  let response = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (response.status === 401 && path !== '/auth/login/' && path !== '/auth/refresh/') {
    const refresh = localStorage.getItem('refreshToken');
    if (refresh) {
      const refreshed = await fetch(`${API_URL}/auth/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh }),
      });
      if (refreshed.ok) {
        const tokens = await refreshed.json() as { access: string; refresh?: string };
        localStorage.setItem('accessToken', tokens.access);
        if (tokens.refresh) localStorage.setItem('refreshToken', tokens.refresh);
        headers.set('Authorization', `Bearer ${tokens.access}`);
        response = await fetch(`${API_URL}${path}`, { ...options, headers });
      } else {
        clearSession();
      }
    }
  }
  if (!response.ok) throw new Error(await readError(response));
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export async function login(email: string, password: string, expectedRole: Role) {
  const result = await api<LoginResponse>('/auth/login/', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (result.user.role !== expectedRole) throw new Error(`This account is registered as ${result.user.role}.`);
  localStorage.setItem('accessToken', result.access);
  localStorage.setItem('refreshToken', result.refresh);
  localStorage.setItem('currentUser', JSON.stringify(result.user));
  return result.user;
}

function clearSession() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('currentUser');
}

export function logout() {
  const access = localStorage.getItem('accessToken');
  const refresh = localStorage.getItem('refreshToken');
  if (access && refresh) {
    void fetch(`${API_URL}/auth/logout/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${access}` },
      body: JSON.stringify({ refresh }),
      keepalive: true,
    });
  }
  clearSession();
}

export function currentUser(): CurrentUser | null {
  const value = localStorage.getItem('currentUser');
  return value ? JSON.parse(value) as CurrentUser : null;
}
