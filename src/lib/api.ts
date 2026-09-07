import { ApiResponse } from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const TOKEN_KEY = 'LEEMEVENTS_auth_token';

export const tokenStorage = {
  get: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },
  set: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, token);
  },
  clear: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
  },
};

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const token = tokenStorage.get();

  let sessionUserId: string | null = null;
  let sessionUserEmail: string | null = null;
  if (typeof window !== 'undefined') {
    try {
      const storedUser = localStorage.getItem('LEEMEVENTS_user_session');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        sessionUserId = (parsed.id && parsed.id !== 'usr_1' && !parsed.id.startsWith('usr_')) ? parsed.id : null;
        sessionUserEmail = parsed.email || null;
      }
    } catch {}
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(sessionUserId ? { 'x-user-id': sessionUserId } : {}),
    ...(sessionUserEmail ? { 'x-user-email': sessionUserEmail } : {}),
    ...(options.headers as Record<string, string>),
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    let json: any;
    try {
      json = await res.json();
    } catch {
      json = { success: res.ok, message: res.statusText };
    }

    if (!res.ok || json.success === false) {
      const errMsg =
        json.error ||
        json.message ||
        json.data?.error ||
        json.data?.message ||
        `Request failed with status ${res.status}`;

      throw new ApiError(errMsg, res.status, json);
    }

    return json;
  } catch (err: any) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(err.message || 'Network connection error', 0);
  }
}

export const api = {
  get: <T = any>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { method: 'GET', ...options }),

  post: <T = any>(endpoint: string, body?: any, options?: RequestInit) =>
    request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }),

  patch: <T = any>(endpoint: string, body?: any, options?: RequestInit) =>
    request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    }),

  delete: <T = any>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { method: 'DELETE', ...options }),
};

export default api;
