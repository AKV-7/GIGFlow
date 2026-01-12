// API configuration for production/development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_URL = `${API_BASE_URL}/api`;
export const SOCKET_URL = API_BASE_URL;

export default API_BASE_URL;
