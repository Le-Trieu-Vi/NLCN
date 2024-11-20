import Api from "../config/Api";

class CartService {
    async fetchCart(id) {
        try {
            const response = await Api.get(`/carts/${id}`);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi lấy giỏ hàng", error);
        }
    }

    async addToCart(data) {
        try {
            const response = await Api.post(`/carts`, data);
            localStorage.setItem("addItemToCart", "true");
            console.log(localStorage.getItem("addItemToCart"));
            
            return response.data;
        } catch (error) {
            console.error("Lỗi khi thêm vào giỏ hàng", error);
        }
    }

    getTotalItem(cart) {
        return cart.reduce((total, item) => total + item.quantity, 0);
        // return cart.length;
    }

    async deleteMultipleItems(id, ids) {
        try {
            const response = await Api.post(`/carts/${id}`, {
                ids: ids,
            });
            return response.data;
        } catch (error) {
            console.error("Lỗi khi xóa nhiều sản phẩm", error);
        }
    }

    async orderItems(data) {
        try {
            const response = await Api.post("/orders", data);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi đặt hàng", error);
        }
    }

}

export default new CartService();
