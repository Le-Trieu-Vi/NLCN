import api from "../config/Api";
import AuthService from "./AuthService";

class CategoryService {
  async fetchCategories() {
    try {
      if (!AuthService.isAuthenticated()) {
        console.error("Vui lòng đăng nhập!");
        return;
      }
      const response = await api.get(`/categories`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách danh mục:", error);
      throw error;
    }
  }

  async deleteCategory(categoryId) {
    try {
      if (!AuthService.isAuthenticated()) {
        throw new Error("Vui lòng đăng nhập!");
      }
      const response = await api.delete(`/categories/${categoryId}`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi xóa danh mục:", error);
      throw error;
    }
  }

}

export default new CategoryService();
