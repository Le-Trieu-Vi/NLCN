import api from "../config/Api";
import AuthService from "./AuthService";

class DishService {
  async fetchDishes(selectedCategoryId) {
    try {
      if (!AuthService.isAuthenticated()) {
        console.error("Vui lòng đăng nhập!");
        return;
      }
      const respone = await api.get(
        `/categories/${selectedCategoryId}`
      );
      return respone.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách", error);
      throw error;
    }
  }

  async deleteDish(dishId) {
    try {
      if (!AuthService.isAuthenticated()) {
        throw new Error("Vui lòng đăng nhập!");
      }
      const response = await api.delete(`/dishes/${dishId}`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi xóa danh mục:", error);
      throw error;
    }
  }
}

export default new DishService();
