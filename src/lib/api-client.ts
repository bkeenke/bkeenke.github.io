import { API_BASE_URL, API_TIMEOUT, SESSION_COOKIE_NAME } from './config';
import type { ApiError } from '@/types';

interface RequestOptions extends RequestInit {
  timeout?: number;
}

class ApiClient {
  private baseUrl: string;
  private sessionId: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  setSessionId(sessionId: string | null) {
    this.sessionId = sessionId;
    if (sessionId) {
      // Set cookie for subsequent requests
      document.cookie = `${SESSION_COOKIE_NAME}=${sessionId}; path=/; SameSite=Strict`;
    } else {
      // Clear cookie
      document.cookie = `${SESSION_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
  }

  getSessionId(): string | null {
    if (this.sessionId) return this.sessionId;
    
    // Try to get from cookie
    if (typeof document !== 'undefined') {
      const match = document.cookie.match(new RegExp(`(^| )${SESSION_COOKIE_NAME}=([^;]+)`));
      if (match) {
        this.sessionId = match[2];
        return this.sessionId;
      }
    }
    return null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { timeout = API_TIMEOUT, ...fetchOptions } = options;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    };

    // Add session cookie if available
    const sessionId = this.getSessionId();
    if (sessionId) {
      (headers as Record<string, string>)['Cookie'] = `${SESSION_COOKIE_NAME}=${sessionId}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...fetchOptions,
        headers,
        signal: controller.signal,
        credentials: 'include',
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiClientError(
          (errorData as ApiError).error || `HTTP error ${response.status}`,
          response.status,
          errorData
        );
      }

      // Handle empty responses
      const text = await response.text();
      if (!text) return {} as T;
      
      return JSON.parse(text) as T;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof ApiClientError) {
        throw error;
      }
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new ApiClientError('Request timeout', 408);
        }
        throw new ApiClientError(error.message, 0);
      }
      
      throw new ApiClientError('Unknown error', 0);
    }
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export class ApiClientError extends Error {
  status: number;
  data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.data = data;
  }
}

// Singleton instance
export const apiClient = new ApiClient();

export default apiClient;
