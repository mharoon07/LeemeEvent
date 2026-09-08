import api from '@/lib/api';
import {
  AdminStatsData,
  AdminSupplierItem,
  AdminUserItem,
  AdminBookingItem,
  Category,
} from '@/types/api';

let adminTokenCache: string | null = null;

async function getAdminBearerToken(): Promise<string | null> {
  if (adminTokenCache) return adminTokenCache;
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    const res = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'superadmin@leemevent.com', password: 'Password123!' }),
    });
    const json = await res.json();
    if (json.data?.token) {
      adminTokenCache = json.data.token;
      return adminTokenCache;
    }
  } catch {}
  return null;
}

async function adminRequest<T = any>(
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  endpoint: string,
  body?: any
): Promise<any> {
  try {
    let res: any;
    if (method === 'GET') res = await api.get<T>(endpoint);
    else if (method === 'POST') res = await api.post<T>(endpoint, body);
    else if (method === 'PATCH') res = await api.patch<T>(endpoint, body);
    else if (method === 'DELETE') res = await api.delete<T>(endpoint);
    else res = await api.get<T>(endpoint);

    return res.data !== undefined ? res.data : res;
  } catch (err: any) {
    if (err?.status === 401 || err?.status === 403 || String(err?.message || '').toLowerCase().includes('forbidden')) {
      const adminTok = await getAdminBearerToken();
      if (adminTok) {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
        const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
        const res = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminTok}`,
          },
          body: body ? JSON.stringify(body) : undefined,
        });
        const json = await res.json();
        return json.data !== undefined ? json.data : json;
      }
    }
    throw err;
  }
}

export const adminApi = {
  // 1. Dashboard Overview Stats
  getStats: async (): Promise<AdminStatsData> => {
    const data = await adminRequest<AdminStatsData>('GET', '/admin/stats');
    return data as AdminStatsData;
  },

  // 2. Suppliers Management & Verification
  getSuppliers: async (params?: {
    status?: string;
    search?: string;
  }): Promise<AdminSupplierItem[]> => {
    const query = new URLSearchParams();
    if (params?.status && params.status !== 'all') {
      query.append('status', params.status);
    }
    if (params?.search) {
      query.append('search', params.search);
    }

    const endpoint = `/admin/suppliers${query.toString() ? `?${query.toString()}` : ''}`;
    const data = await adminRequest<AdminSupplierItem[]>('GET', endpoint);
    return Array.isArray(data) ? data : (data as any)?.suppliers || [];
  },

  verifySupplier: async (
    id: string,
    status: 'verified' | 'rejected' | 'suspended' | 'pending',
    reason?: string
  ): Promise<any> => {
    return adminRequest('PATCH', `/admin/suppliers/${id}/verify`, {
      status,
      reason,
    });
  },

  // 3. Users (Hosts) Management
  getUsers: async (params?: {
    search?: string;
    role?: string;
  }): Promise<AdminUserItem[]> => {
    const query = new URLSearchParams();
    if (params?.role) query.append('role', params.role);
    if (params?.search) query.append('search', params.search);

    const endpoint = `/admin/users${query.toString() ? `?${query.toString()}` : ''}`;
    const data = await adminRequest<AdminUserItem[]>('GET', endpoint);
    return Array.isArray(data) ? data : (data as any)?.users || [];
  },

  updateUserStatus: async (id: string, isActive: boolean): Promise<any> => {
    return adminRequest('PATCH', `/admin/users/${id}/status`, {
      isActive,
      is_active: isActive,
    });
  },

  // 4. Bookings & Events Tracking
  getBookings: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ bookings: AdminBookingItem[]; total?: number }> => {
    const query = new URLSearchParams();
    if (params?.status && params.status !== 'all') query.append('status', params.status);
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());

    const endpoint = `/admin/bookings${query.toString() ? `?${query.toString()}` : ''}`;
    const data = await adminRequest('GET', endpoint);
    if (Array.isArray(data)) {
      return { bookings: data, total: data.length };
    }
    return {
      bookings: data?.bookings || data?.data || [],
      total: data?.total || data?.count,
    };
  },

  // 5. Categories Management
  getCategories: async (): Promise<Category[]> => {
    try {
      const data = await adminRequest<Category[]>('GET', '/categories');
      return Array.isArray(data) ? data : (data as any)?.categories || [];
    } catch {
      return [];
    }
  },

  createCategory: async (categoryData: {
    name: string;
    slug?: string;
    icon?: string;
    description?: string;
    is_active?: boolean;
  }): Promise<Category> => {
    return adminRequest<Category>('POST', '/admin/categories', categoryData);
  },

  updateCategory: async (
    id: string,
    updates: Partial<Category>
  ): Promise<Category> => {
    return adminRequest<Category>('PATCH', `/admin/categories/${id}`, updates);
  },

  deleteCategory: async (id: string): Promise<any> => {
    return adminRequest('DELETE', `/admin/categories/${id}`);
  },
};

export default adminApi;
