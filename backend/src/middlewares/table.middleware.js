import { object, string } from 'yup';
import { ApiError } from './error.middleware.js';
const createTableSchema = object({
    number: string().required(),
    status: string().oneOf(['available', 'unavailable']).required(),
});
export const create = async (req, res, next) => {
    try {
        req.body = await createTableSchema.validate(req.body, { abortEarly: false });
        next();
    } catch (error) {
        return next(new ApiError(400, error.errors.join(', ')));
    }
}

const updateTableSchema = object({
    number: string(),
    status: string().oneOf(['available', 'unavailable']),
});

export const update = async (req, res, next) => {
    try {
        req.body = await updateTableSchema.validate(req.body, { abortEarly: false });
        next();
    } catch (error) {
        return next(new ApiError(400, error.errors.join(', ')));
    }
}