import { object, string, number } from 'yup';
import { ApiError } from './error.middleware.js';

const createDishSchema = object({
  name: string().required(),
  price: number().required(),
  categoryId: string().required(),
  image: string(),
  description: string(),
});

export const create = async (req, res, next) => {
  try {
    req.body = await createDishSchema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    return next(new ApiError(400, error.errors.join(', ')));
  }
};

const updateDishSchema = object({
  name: string(),
  categoryId: string(),
  image: string(),
  description: string(),
});

export const update = async (req, res, next) => {
  try {
    req.body = await updateDishSchema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    return next(new ApiError(400, error.errors.join(', ')));
  }
};
