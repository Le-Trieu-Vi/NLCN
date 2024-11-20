import Api from "../config/Api";

class CateroryService {
  async fetchCategory() {
    try {
      const response = await Api.get("/categories");
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh mục", error);
    }
  }

  async fetchCategoryById(id) {
    try {
      const response = await Api.get(`/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh mục", error);
    }
  }
}

export default new CateroryService();