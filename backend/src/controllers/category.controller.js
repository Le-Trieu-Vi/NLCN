import { ApiError } from '../middlewares/error.middleware.js';
import autoBind from '../utils/auto-bind.util.js';
import CategoryService from '../services/category.service.js';

class CategoryController {
  constructor() {
    this.categoryService = new CategoryService();
    autoBind(this);
  }

  async getAll(req, res, next) {
    try {
      const categories = await this.categoryService.getAll();
      res.status(200).json(categories);
    } catch (error) {
      next(
        new ApiError(
          error.status || 500,
          error.message || 'Failed to get categories',
        ),
      );
    }
  }

  async create(req, res, next) {
    try {
      const category = await this.categoryService.create(req.body, req.file);
      res.status(200).json(category);
    } catch (error) {
      next(
        new ApiError(
          error.status || 500,
          error.message || 'Failed to create category',
        ),
      );
    }
  }

  async getOne(req, res, next) {
    try {
      const category = await this.categoryService.getOne(req.params.id);
      res.status(200).json(category);
    } catch (error) {
      next(
        new ApiError(
          error.status || 500,
          error.message || 'Failed to get category',
        ),
      );
    }
  }

  async update(req, res, next) {
    try {
      const category = await this.categoryService.update(
        req.params.id,
        req.body,
        req.file,
      );
      res.status(200).json(category);
    } catch (error) {
      next(
        new ApiError(
          error.status || 500,
          error.message || 'Failed to update category',
        ),
      );
    }
  }

  async delete(req, res, next) {
    try {
      await this.categoryService.delete(req.params.id);
      res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
      next(
        new ApiError(
          error.status || 500,
          error.message || 'Failed to delete category',
        ),
      );
    }
  }
}

export default new CategoryController();
