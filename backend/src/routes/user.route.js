import { Router } from 'express';
import userController from '../controllers/user.controller.js'
import * as userMiddleware from '../middlewares/user.middleware.js';
import * as authMiddleware from '../middlewares/auth.middleware.js';
import { uploadSingle } from "../middlewares/upload.middleware.js";

const userRouter = Router();
userRouter.use(authMiddleware.authenticate);
userRouter.route('/')
       .post(authMiddleware.authorize(['admin']) ,userMiddleware.create, userController.create)
       .get(authMiddleware.authorize(['admin']), userController.getAll)

userRouter.route('/:id')
       .get(userController.getOne)
       .put(userMiddleware.update, uploadSingle("avatar"), userController.update)
       .delete(authMiddleware.authorize(['admin']), userController.delete)

userRouter.route('/change-password/:id')
       .post(userMiddleware.changePassword, userController.changePassword)

export default userRouter;


