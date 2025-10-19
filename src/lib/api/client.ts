import { ApiResponse, RequestOptions } from '@/types/api';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.mmoshop.site';

// Custom error class for API errors
export class ApiClientError extends Error {
  constructor(
    public statusCode: number,
    public apiMessage: string,
    public errors: string[] = []
  ) {
    super(apiMessage);
    this.name = 'ApiClientError';
  }
}

// Helper to build query string from params
function buildQueryString(params?: Record<string, string | number | boolean | undefined>): string {
  if (!params) return '';
  
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, String(v)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

// Base API Client
export class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  // Set authorization token
  setAuthToken(token: string | null) {
    if (token) {
      this.defaultHeaders['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.defaultHeaders['Authorization'];
    }
  }

  // Get authorization token from localStorage
  private getStoredToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  // Generic request method
  async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const { method = 'GET', headers = {}, body, token, params } = options;
    
    // Build URL with query params
    const queryString = buildQueryString(params);
    const url = `${this.baseURL}${endpoint}${queryString}`;

    // Prepare headers
    const requestHeaders = {
      ...this.defaultHeaders,
      ...headers,
    };

    // Add token if provided, otherwise use stored token
    const authToken = token || this.getStoredToken();
    if (authToken) {
      requestHeaders['Authorization'] = `Bearer ${authToken}`;
    }

    // Prepare request configuration
    const config: RequestInit = {
      method,
      headers: requestHeaders,
    };

    // Add body if present
    if (body) {
      if (body instanceof FormData) {
        config.body = body;
        // Remove Content-Type for FormData (browser will set it with boundary)
        delete requestHeaders['Content-Type'];
      } else if (typeof body === 'string') {
        config.body = body;
      } else {
        config.body = JSON.stringify(body);
      }
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      // Check if response is successful
      if (!response.ok || data.statusCode >= 400) {
        throw new ApiClientError(
          data.statusCode || response.status,
          data.message || 'API request failed',
          data.errors || []
        );
      }

      return data as ApiResponse<T>;
    } catch (error) {
      if (error instanceof ApiClientError) {
        throw error;
      }

      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new ApiClientError(0, 'Network error - please check your connection');
      }

      // Handle other errors
      throw new ApiClientError(
        500,
        error instanceof Error ? error.message : 'Unknown error occurred'
      );
    }
  }

  // Convenience methods
  async get<T>(endpoint: string, options?: Omit<RequestOptions, 'method'>) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, body?: string | Record<string, unknown> | FormData, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  }

  async put<T>(endpoint: string, body?: string | Record<string, unknown> | FormData, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body });
  }

  async patch<T>(endpoint: string, body?: string | Record<string, unknown> | FormData, options?: Omit<RequestOptions, 'method' | 'body'>) {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body });
  }

  async delete<T>(endpoint: string, options?: Omit<RequestOptions, 'method'>) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

// Create singleton instance
export const apiClient = new ApiClient();