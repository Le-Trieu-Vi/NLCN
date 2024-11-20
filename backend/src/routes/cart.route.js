import { Router } from "express";
import * as authMiddleware from "../middlewares/auth.middleware.js";
import cartController from "../controllers/cart.controller.js";

const cartRouter = Router();

cartRouter.use(authMiddleware.authenticate);
cartRouter.route("/")
    .post(authMiddleware.authorize(["user"]), cartController.create)

cartRouter.route("/:id")
    .get(authMiddleware.authorize(["user"]), cartController.getAll)
    .put(authMiddleware.authorize(["user"]), cartController.update)
    .post(authMiddleware.authorize(["user"]), cartController.deleteMultiple)

export default cartRouter;