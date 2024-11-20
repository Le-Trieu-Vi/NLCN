import axios from 'axios';
import alertService from '../services/AlertService';

const api = axios.create({
    baseURL: 'http://localhost:3001/api',
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

let isAlertShown = false;
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response) {
            const { status } = error.response;
            if (status === 403 && !isAlertShown) {
                isAlertShown = true;
                alertService.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
                await AuthService.logout();
                isAlertShown = false;
            }
        }
        return Promise.reject(error);
    }
);

export default api;