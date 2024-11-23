import { ApiError } from '../middlewares/error.middleware.js';
import DishService from '../services/dish.service.js';
import autoBind from '../utils/auto-bind.util.js';

class DishController {
  constructor() {
    this.dishService = new DishService();
    autoBind(this);
  }

  async create(req, res, next) {
    try {
      const dish = await this.dishService.create(req.body, req.file);
      res.status(200).json(dish);
    } catch (error) {
      next(
        new ApiError(
          error.status || 500,
          error.message || 'Failed to create dish',
        ),
      );
    }
  }

  async getAll(req, res, next) {
    try {
      const dishes = await this.dishService.getAll();
      res.status(200).json(dishes);
    } catch (error) {
      next(
        new ApiError(
          error.status || 500,
          error.message || 'Failed to get dishes',
        ),
      );
    }
  }

  async getOne(req, res, next) {
    try {
      const dish = await this.dishService.getOne(req.params.id);
      res.status(200).json(dish);
    } catch (error) {
      next(
        new ApiError(
          error.status || 500,
          error.message || 'Failed to get dish',
        ),
      );
    }
  }

  async getTopDishes(req, res, next) {
    try {
      const dishes = await this.dishService.findTopDishes();
      res.status(200).json(dishes);
    } catch (error) {
      next(
        new ApiError(
          error.status || 500,
          error.message || 'Failed to get top dishes',
        ),
      );
    }
  }

  async update(req, res, next) {
    try {
      const dish = await this.dishService.update(
        req.params.id,
        req.body,
        req.file,
      );
      res.status(200).json(dish);
    } catch (error) {
      next(
        new ApiError(
          error.status || 500,
          error.message || 'Failed to update dish',
        ),
      );
    }
  }

  async delete(req, res, next) {
    try {
      await this.dishService.delete(req.params.id);
      res.status(200).json({ message: 'Dish deleted successfully' });
    } catch (error) {
      next(
        new ApiError(
          error.status || 500,
          error.message || 'Failed to delete dish',
        ),
      );
    }
  }
}

export default new DishController();
