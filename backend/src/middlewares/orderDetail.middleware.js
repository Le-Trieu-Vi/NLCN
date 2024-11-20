import { object, string } from 'yup';
import { ApiError } from './error.middleware.js';

const updateOrderSchema = object({
    status: string().oneOf(['pending', 'completed', 'cancelled']).required()
});

export const update = async (req, res, next) => {
    try {
        req.body = await updateOrderSchema.validate(req.body, { abortEarly: false });
        next();
    } catch (error) {
        return next(new ApiError(400, error.errors.join(', ')));
    }
}