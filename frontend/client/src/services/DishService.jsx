import Api from "../config/Api";

class DishService {
  async fetchDishTop() {
    try {
      const response = await Api.get("/dishes/topDishes");
      return response.data;
    } catch (error) {
      console.error("Error fetching top dish:", error);
    }
  }
}

export default new DishService();