import Api from "../config/Api";

class AuthService {
    async login(username, password) {
        try {
            const response = await Api.post(`/auth/login`, {
                username,
                password,
            });

            console.log(response.data);
            

            if (response.data.data.accessToken) {
                localStorage.setItem("token", response.data.data.accessToken);
                console.log(response.data);
                return true;
            }
            return false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    getToken() {
        return localStorage.getItem("token");
    }

    logout() {
        localStorage.removeItem("token");
    }

    isAuthenticated() {
        return !!this.getToken();
    }

    getId() {
        const token = this.getToken();
        if (token) {
            const payload = token.split(".")[1];
            const data = JSON.parse(atob(payload));
            return data.id;
        }
        return null;
    }

    async getUserInfo() {
        try {
            const response = await Api.get(`/users/${this.getId()}`);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi lấy thông tin người dùng:", error);
            return null;
        }
    }

    async register(username, password, confirmPassword, phone, fullname, address) {
        try {
            console.log(username, password, confirmPassword, phone, fullname, address);
            
            const response = await Api.post(`/auth/register`, {
                username,
                password,
                confirmPassword,
                phone,
                fullname,
                address
            });

            if (response.data.status === "success") {
                return true;
            }
            return false;
        } catch (error) {
            throw error;
        }
    }
}

export default new AuthService();