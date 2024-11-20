import { Router } from "express";
import categoryController from "../controllers/category.controller.js";
import * as authMiddleware from "../middlewares/auth.middleware.js";
import * as categoryMiddleware from "../middlewares/category.middleware.js";
import { uploadSingle } from "../middlewares/upload.middleware.js";

const categoryRouter = Router();
categoryRouter.route("/")
    .get(categoryController.getAll)

categoryRouter.route("/:id")
    .get(categoryController.getOne)

categoryRouter.use(authMiddleware.authenticate);
categoryRouter.route("/")
    .post(authMiddleware.authorize(["admin"]), uploadSingle("image"), categoryMiddleware.create, categoryController.create);

categoryRouter.route("/:id")
    .put(authMiddleware.authorize(["admin"]), uploadSingle("image"), categoryMiddleware.update, categoryController.update)
    .delete(authMiddleware.authorize(["admin"]), categoryController.delete)

export default categoryRouter;