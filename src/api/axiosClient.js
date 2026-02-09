/**
 * LEO Senior Standard Reactor - Axios Configuration
 * @author Nguyễn Minh Tâm (AKA LEO)
 * @description Centralized API client with JWT interceptors.
 */
import axios from 'axios';
import { ENV } from './env';

const axiosClient = axios.create({
    baseURL: ENV.API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor cho request (vd: gắn token)
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor cho response (vd: xử lý lỗi 401, 500)
axiosClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response?.status === 401) {
            // Xử lý logout hoặc refresh token ở đây
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
