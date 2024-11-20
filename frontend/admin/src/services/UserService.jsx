import api from "../config/Api";
import AuthService from "./AuthService";

class UserService {
    async fetchUsers(search) {
        try {
            if (!AuthService.isAuthenticated()) {
                console.error("Vui lòng đăng nhập!");
                return;
            }
            const response = await api.get("/users", {
                params: search,
            });
            return response.data;
        } catch (error) {
            console.error("Lỗi khi lấy danh sách người dùng", error);
            throw error;
        }
    }

    async deleteUser(userId) {
        try {
            if (!AuthService.isAuthenticated()) {
                throw new Error("Vui lòng đăng nhập!");
            }
            const response = await api.delete(`/users/${userId}`);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi xóa người dùng:", error);
            throw error;
        }
    }
}

export default new UserService();