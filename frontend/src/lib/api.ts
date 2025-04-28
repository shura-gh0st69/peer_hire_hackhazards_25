import axios from 'axios';
import Cookies from 'js-cookie';

// Cache configuration
const CACHE_CONFIG = {
  // Endpoints that should be cached and their TTLs (in ms)
  CACHEABLE_ENDPOINTS: {
    '/jobs': 5 * 60 * 1000, // 5 min
    '/jobs/categories': 60 * 60 * 1000, // 1 hour
    '/jobs/skills': 60 * 60 * 1000, // 1 hour
    '/auth/dashboard': 5 * 60 * 1000, // 5 min
    '/auth/me': 30 * 60 * 1000, // 30 min
    '/auth/profile': 30 * 60 * 1000 // 30 min
  },
  // Endpoints that should never be cached
  UNCACHEABLE_ENDPOINTS: [
    '/auth/login',
    '/auth/signup',
    '/auth/logout',
    '/users/wallet',
    '/proposals',
    '/payments'
  ]
};

// In-memory request cache
const requestCache = new Map();

// Cache utility functions
const cacheUtils = {
  getCacheKey: (config) => {
    const { url, method, params, data } = config;
    return `${method}:${url}:${JSON.stringify(params || {})}:${JSON.stringify(data || {})}`;
  },

  shouldCacheRequest: (config) => {
    const { url, method } = config;
    if (method !== 'GET') return false;
    
    // Check if endpoint is explicitly uncacheable
    if (CACHE_CONFIG.UNCACHEABLE_ENDPOINTS.some(endpoint => url.includes(endpoint))) {
      return false;
    }
    
    // Check if endpoint is explicitly cacheable
    return Object.keys(CACHE_CONFIG.CACHEABLE_ENDPOINTS).some(endpoint => 
      url.includes(endpoint)
    );
  },

  getCacheTTL: (url) => {
    const matchingEndpoint = Object.keys(CACHE_CONFIG.CACHEABLE_ENDPOINTS).find(endpoint => 
      url.includes(endpoint)
    );
    return matchingEndpoint ? CACHE_CONFIG.CACHEABLE_ENDPOINTS[matchingEndpoint] : 0;
  },

  setCacheResponse: (key, response, ttl) => {
    requestCache.set(key, {
      data: response,
      timestamp: Date.now(),
      expiry: Date.now() + ttl
    });
  },

  getCachedResponse: (key) => {
    const cached = requestCache.get(key);
    if (!cached) return null;

    // Check if cache has expired
    if (Date.now() > cached.expiry) {
      requestCache.delete(key);
      return null;
    }

    return cached.data;
  },

  clearCache: () => {
    requestCache.clear();
  },

  invalidateCache: (url) => {
    for (const [key] of requestCache) {
      if (key.includes(url)) {
        requestCache.delete(key);
      }
    }
  }
};

// Create axios instance with interceptors
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
});

// Request interceptor
api.interceptors.request.use(async (config) => {
  const token = Cookies.get('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Check cache for GET requests
  if (cacheUtils.shouldCacheRequest(config)) {
    const cacheKey = cacheUtils.getCacheKey(config);
    const cachedResponse = cacheUtils.getCachedResponse(cacheKey);
    if (cachedResponse) {
      return Promise.reject({
        config,
        response: cachedResponse,
        __CACHE_HIT__: true
      });
    }
  }

  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Cache successful GET responses if endpoint is cacheable
    if (cacheUtils.shouldCacheRequest(response.config)) {
      const cacheKey = cacheUtils.getCacheKey(response.config);
      const ttl = cacheUtils.getCacheTTL(response.config.url || '');
      cacheUtils.setCacheResponse(cacheKey, response, ttl);
    }
    return response;
  },
  (error) => {
    // Return cached response if this was a cache hit
    if (error.__CACHE_HIT__) {
      return Promise.resolve(error.response);
    }
    return Promise.reject(error);
  }
);

export { api as default, cacheUtils };