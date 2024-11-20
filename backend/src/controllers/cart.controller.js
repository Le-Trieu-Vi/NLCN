import autoBind from "../utils/auto-bind.util.js";
import { ApiError } from "../middlewares/error.middleware.js";
import CartService from "../services/cart.service.js";

class CartController {
    constructor() {
        this.cartService = new CartService();
        autoBind(this);
    }

    async create(req, res, next) {
        try {
            const cart = await this.cartService.create(req.body);
            res.status(200).json(cart);
        } catch (error) {
            next(new ApiError(error.status || 500, error.message || 'Failed to create cart'));
        }
    }

    async getAll(req, res, next) {
        try {
            const carts = await this.cartService.getAll(req.params.id);
            res.status(200).json(carts);
        } catch (error) {
            next(new ApiError(error.status || 500, error.message || 'Failed to get carts'));
        }
    }

    async update(req, res, next) {
        try {
            const cart = await this.cartService.update(req.params.id, req.body);
            res.status(200).json(cart);
        } catch (error) {
            next(new ApiError(error.status || 500, error.message || 'Failed to update cart'));
        }
    }

    async deleteMultiple(req, res, next) {
        try {
            await this.cartService.deleteMultiple(req.body.ids);
            res.status(200).json({ message: 'Carts deleted successfully' });
        } catch (error) {
            next(new ApiError(error.status || 500, error.message || 'Failed to delete carts'));
        }
    }
}

export default new CartController();