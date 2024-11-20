import Api from "../config/Api";
import alertService from "./AlertService";

class OrderServices {
    async fetchOrder(id) {
        try {
            const response = await Api.get(`/orders/user/${id}`);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi lấy lịch sử đơn hàng", error);
        }
    }

    async cancelOrder(orderId) {
        try {
            await Api.delete(`/orders/user/${orderId}`);
        } catch (error) {
            alertService.error("Hủy đơn hàng thất bại!");
        }
    }

}

export default new OrderServices();