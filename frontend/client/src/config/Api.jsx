import axios from 'axios';
import alertService from '../services/AlertService';
import { useNavigate } from 'react-router-dom';

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
        const navigate = useNavigate();
        if (error.response) {
            const { status } = error.response;
            if ((status === 403) && !isAlertShown) {
                isAlertShown = true;
                alertService.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");

                navigate('/login');
                localStorage.removeItem('token');
                
                setTimeout(() => {
                    isAlertShown = false;
                }, 3000);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
