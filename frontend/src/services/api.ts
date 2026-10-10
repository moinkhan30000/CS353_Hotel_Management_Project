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
  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
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

export function logout() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('currentUser');
}

export function currentUser(): CurrentUser | null {
  const value = localStorage.getItem('currentUser');
  return value ? JSON.parse(value) as CurrentUser : null;
}
