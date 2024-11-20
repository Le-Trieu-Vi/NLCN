import autoBind from "../utils/auto-bind.util.js";
import { ApiError } from "../middlewares/error.middleware.js";
import OrderDetailSerivce from "../services/orderDetail.service.js";

class OrderDetailController {
    constructor() {
        this.orderDetailService = new OrderDetailSerivce();
        autoBind(this);
    }

    async update(req, res, next) {
        try {
            const orderDetail = await this.orderDetailService.update(req.params.idOrder, req.params.idDish, req.body);
            res.status(200).json(orderDetail);
        } catch (error) {
            next(new ApiError(error.status || 500, error.message || 'Failed to update orderDetail'));
        }
    }
}

export default new OrderDetailController();