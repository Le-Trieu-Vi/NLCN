import { Router } from 'express';
import orderDetailController from '../controllers/orderDetail.controller.js';
import * as orderDetailMiddleware from '../middlewares/orderDetail.middleware.js';
import * as authMiddleware from '../middlewares/auth.middleware.js';

const orderDetailRouter = Router();
orderDetailRouter.use(authMiddleware.authenticate);
orderDetailRouter.route('/:idOrder/:idDish')
    .put(authMiddleware.authorize(['admin', 'staff']), orderDetailMiddleware.update , orderDetailController.update);

export default orderDetailRouter;
