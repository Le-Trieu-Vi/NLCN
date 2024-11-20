import { Router } from 'express';
import orderController from '../controllers/order.controller.js';
import * as orderMiddleware from '../middlewares/order.middleware.js';
import * as authMiddleware from '../middlewares/auth.middleware.js';

const orderRouter = Router();
orderRouter.use(authMiddleware.authenticate);
orderRouter
  .route('/')
  .get(authMiddleware.authorize(['admin']), orderController.getAll)
  .post(
    authMiddleware.authorize(['staff', 'user']),
    orderMiddleware.create,
    orderController.create,
  );

orderRouter
  .route('/:id')
  .get(
    authMiddleware.authorize(['admin', 'cashier', 'user']),
    orderController.getOne,
  )
  .put(
    authMiddleware.authorize(['staff', 'cashier', 'user']),
    orderMiddleware.update,
    orderController.update,
  );

orderRouter
  .route('/user/:userId')
  .get(
    authMiddleware.authorize(['admin', 'staff', 'user']),
    orderController.getByUser,
  );

orderRouter
  .route('/user/:orderId')
  .delete(authMiddleware.authorize(['user']), orderController.delete);

export default orderRouter;
