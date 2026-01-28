import axios from 'axios';
import { getToken } from './auth';

// IMPORTANT: If you are using a physical device with Expo Go, 
// replace 'localhost' with your computer's local IP address (e.g., 192.168.1.5)
const BASE_URL = 'http://192.168.1.14:5000';

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
});

// Automatically add the token to every request if it exists
api.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
