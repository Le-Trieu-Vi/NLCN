import { Router } from 'express';
import staticController from '../controllers/statistic.controller.js';
import * as authMiddleware from '../middlewares/auth.middleware.js';

const staticRouter = Router();
staticRouter.use(authMiddleware.authenticate);
staticRouter.route('/revenue').get(authMiddleware.authorize(['admin']), staticController.getRevenue);
staticRouter.route('/summary').get(authMiddleware.authorize(['admin']), staticController.getSummary);

export default staticRouter;