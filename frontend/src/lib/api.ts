import axios from 'axios';
import { toast } from 'sonner';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json',
    },
    // Add timeout
    timeout: 10000,
});

// Add a request interceptor to attach the auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle specific error cases
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // Unauthorized - clear auth state and redirect to login
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('user');
                    window.location.href = '/auth/login';
                    toast.error('Session expired. Please log in again.');
                    break;
                
                case 403:
                    // Forbidden - user doesn't have required permissions
                    toast.error('You do not have permission to perform this action');
                    break;
                
                case 404:
                    // Not Found
                    toast.error('Resource not found');
                    break;
                
                case 422:
                    // Validation error
                    const validationErrors = error.response.data.errors;
                    if (validationErrors) {
                        Object.values(validationErrors).forEach((message: any) => {
                            toast.error(message);
                        });
                    }
                    break;
                
                case 500:
                    // Server error
                    toast.error('An unexpected error occurred. Please try again later.');
                    break;
                
                default:
                    toast.error(error.response.data.message || 'Something went wrong');
            }
        } else if (error.request) {
            // Network error
            toast.error('Unable to connect to the server. Please check your internet connection.');
        } else {
            toast.error('An unexpected error occurred');
        }
        
        return Promise.reject(error);
    }
);

export default api;