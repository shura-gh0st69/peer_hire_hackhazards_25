import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import Cookies from 'js-cookie';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const cacheUtils = {
  // Persistent storage (localStorage)
  localStorage: {
    set: (key: string, data: any) => {
      try {
        localStorage.setItem(key, typeof data === 'string' ? data : JSON.stringify(data));
      } catch (error) {
        console.error(`Error saving to localStorage: ${key}`, error);
      }
    },
    get: (key: string) => {
      try {
        const item = localStorage.getItem(key);
        if (!item) return null;
        try {
          return JSON.parse(item);
        } catch {
          return item;
        }
      } catch (error) {
        console.error(`Error reading from localStorage: ${key}`, error);
        return null;
      }
    },
    remove: (key: string) => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error(`Error removing from localStorage: ${key}`, error);
      }
    }
  },

  // Secure storage (cookies with httpOnly for sensitive data)
  secureCookie: {
    set: (key: string, value: string, expires = 7) => {
      Cookies.set(key, value, {
        expires,
        secure: window.location.protocol === 'https:',
        sameSite: 'strict'
      });
    },
    get: (key: string) => Cookies.get(key),
    remove: (key: string) => Cookies.remove(key)
  },

  // Original request cache methods
  getCacheKey: (config: any) => {
    const { url, method, params, data } = config;
    return `${method}:${url}:${JSON.stringify(params || {})}:${JSON.stringify(data || {})}`;
  },

  shouldCacheRequest: (config: any) => {
    const { url, method } = config;
    if (method !== 'GET') return false;
    return !url.includes('auth') && !url.includes('wallet');
  },

  getCacheTTL: (url: string) => {
    // Default TTL of 5 minutes
    return 5 * 60 * 1000;
  },

  setCacheResponse: (key: string, response: any, ttl: number) => {
    const cache = new Map();
    cache.set(key, {
      data: response,
      timestamp: Date.now(),
      expiry: Date.now() + ttl
    });
  },

  getCachedResponse: (key: string) => {
    const cache = new Map();
    const cached = cache.get(key);
    if (!cached) return null;

    if (Date.now() > cached.expiry) {
      cache.delete(key);
      return null;
    }

    return cached.data;
  },

  clearCache: () => {
    const cache = new Map();
    cache.clear();
  },

  invalidateCache: (url: string) => {
    const cache = new Map();
    for (const [key] of cache) {
      if (key.includes(url)) {
        cache.delete(key);
      }
    }
  }
};
