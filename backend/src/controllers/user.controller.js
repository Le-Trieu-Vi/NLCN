import { ApiError } from '../middlewares/error.middleware.js';
import UserService from '../services/user.service.js';
import autoBind from '../utils/auto-bind.util.js';

class UserController {
  constructor() {
    this.userService = new UserService();
    autoBind(this);
  }

  async create(req, res, next) {
    try {
      const user = await this.userService.create(req.body);
      res.status(201).json(user);
    } catch (error) {
      next(new ApiError(error.status || 500, error.message || 'Failed to create user'));
    }
  }

  async getAll(req, res, next) {
    try {
      const users = await this.userService.getAll(req);
      res.status(200).json(users);
    } catch (error) {
      next(new ApiError(error.status || 500, error.message || 'Failed to get users'));
    }
  }

  async getOne(req, res, next) {
    try {
      const user = await this.userService.getOne(req.params.id);
      res.status(200).json(user);
    } catch (error) {
        next(new ApiError(error.status || 500, error.message || 'Failed to get user'));
    }
  }

  async delete(req, res, next) {
    try {
      this.userService.delete(req.params.id);
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      next(new ApiError(error.status || 500, error.message || 'Failed to delete user'));
    }
  }

  async update(req, res, next) {
    try {
      const user = await this.userService.update(req.params.id, req.body, req.file);
      res.status(200).json(user);
    } catch (error) {
      next(new ApiError(error.status || 500, error.message || 'Failed to update user'))
    }
  }

  async changePassword(req, res, next) {
    try {
      await this.userService.changePassword(req.params.id, req.body);
      res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
      next(new ApiError(error.status || 500, error.message || 'Failed to change password'));
    }
  }
}

export default new UserController();
