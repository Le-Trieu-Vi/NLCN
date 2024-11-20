import { ApiError } from "./error.middleware.js";
import { object, string } from "yup";

const createCategorySchema = object({
    name: string().required(),
});

export const create = async (req, res, next) => {
    try {
        req.body = await createCategorySchema.validate(req.body, { abortEarly: false });
        next();
    } catch (error) {
        return next(new ApiError(400, error.errors.join(', ')));
    }
};

const updateCategorySchema = object({
    name: string()
});

export const update = async (req, res, next) => {
    try {
        req.body = await updateCategorySchema.validate(req.body, { abortEarly: false });
        next();
    } catch (error) {
        return next(new ApiError(400, error.errors.join(', ')));
    }
}