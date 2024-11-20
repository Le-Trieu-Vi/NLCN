import { object, string, array, number } from 'yup';
import { ApiError } from './error.middleware.js';

const createOrderSchema = object({
    tableId: string(),
    userId: string().required(),
    items: array().of(
        object({
            dishId: string().required(),
            quantity: number().integer().min(1).required(),
        })
    ).required()
});

export const create = async (req, res, next) => {
    try {
        req.body = await createOrderSchema.validate(req.body, { abortEarly: false });
        next();
    } catch (error) {
        return next(new ApiError(400, error.errors.join(', ')));
    }
}

const updateOrderSchema = object({
    status: string().oneOf(['pending', 'requested', 'completed', 'cancelled', 'shipping', 'delivered']),
    tableId: string(),
    userId: string(),
    items: array().of(
        object({
            dishId: string().required(),
            quantity: number().integer().min(1).required(),
        })
    )
});

export const update = async (req, res, next) => {
    try {
        req.body = await updateOrderSchema.validate(req.body, { abortEarly: false });
        next();
    } catch (error) {
        return next(new ApiError(400, error.errors.join(', ')));
    }
}

export const updateStatus = async (req, res, next) => {
    try {
        const schema = object({
            status: string().required().oneOf(['pending', 'completed', 'cancelled'])
        });
        req.body = await schema.validate(req.body, { abortEarly: false });
        next();
    } catch (error) {
        return next(new ApiError(400, error.errors.join(', ')));
    }
}