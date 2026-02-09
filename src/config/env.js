export const ENV = {
    API_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
    SOCKET_URL: import.meta.env.VITE_SOCKET_URL || 'http://localhost:8000',
    IS_DEV: import.meta.env.DEV,
    IS_PROD: import.meta.env.PROD,
};
