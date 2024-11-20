import autoBind from "../utils/auto-bind.util.js";
import { ApiError } from "../middlewares/error.middleware.js";
import OrderSerivce from "../services/order.service.js";
import TableService from "../services/table.service.js";

class OrderController {
    constructor() {
        this.orderService = new OrderSerivce();
        this.tableService = new TableService();
        autoBind(this);
    }
    
    async create(req, res, next) {
        try {
            const order = await this.orderService.create(req.body);
            if (req.body.tableId) {
                await this.tableService.update(req.body.tableId, { status: 'unavailable' });
            }
            res.status(200).json(order);
        } catch (error) {
            next(new ApiError(error.status || 500, error.message || 'Failed to create order'));
        }
    }

    async getAll(req, res, next) {
        try {
            const { sortBy, order } = req.query;
            const orders = await this.orderService.getAll({ sortBy, order, ...req.query });
            res.status(200).json(orders);
        } catch (error) {
            next(new ApiError(error.status || 500, error.message || 'Failed to get orders'));
        }
    }

    async addDish(req, res, next) {
        try {
            const order = await this.orderService.addDish(req.body);
            res.status(200).json(order);
        } catch (error) {
            next(new ApiError(error.status || 500, error.message || 'Failed to add dish to order'));
        }
    }

    async getOne(req, res, next) {
        try {
            const order = await this.orderService.getOne(req.params.id);
            res.status(200).json(order);
        } catch (error) {
            next(new ApiError(error.status || 500, error.message || 'Failed to get order'));
        }
    }

    async getByUser(req, res, next) {
        try {
            const orders = await this.orderService.getByUser(req.params.userId);
            res.status(200).json(orders);
        } catch (error) {
            next(new ApiError(error.status || 500, error.message || 'Failed to get orders'));
        }
    }

    async update(req, res, next) {
        try {
            const order = await this.orderService.update(req.params.id, req.body);
            res.status(200).json(order);
        } catch (error) {
            next(new ApiError(error.status || 500, error.message || 'Failed to update order'));
        }
    }

    async delete(req, res, next) {
        try {
            const order = await this.orderService.delete(req.params.orderId);
            res.status(200).json(order);
        } catch (error) {
            next(new ApiError(error.status || 500, error.message || 'Failed to delete order'));
        }
    }
}

export default new OrderController();