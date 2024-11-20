import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';

import viewEngine from './src/config/viewEngine.js';
import userRouter from './src/routes/user.route.js';
import authRouter from './src/routes/auth.route.js';
import tableRouter from './src/routes/table.route.js';
import categoryRouter from './src/routes/category.route.js';
import dishRouter from './src/routes/dish.route.js';
import orderRouter from './src/routes/order.route.js';
import orderDetailRouter from './src/routes/orderDetail.route.js';
import cartRouter from './src/routes/cart.route.js';
import { errorHandler } from './src/middlewares/error.middleware.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Serve static files from the React app
const __dirname = path.resolve();
// const clientBuildPath = path.resolve(__dirname, '..', 'frontend', 'admin', 'build');
// app.use(express.static(clientBuildPath));

const adminUploadPath = path.resolve(__dirname, '..', 'frontend', 'admin', 'public', 'uploads');
app.use('/uploads', express.static(adminUploadPath));

// API routes
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/tables', tableRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/dishes', dishRouter);
app.use('/api/orders', orderRouter);
app.use('/api/order-details', orderDetailRouter);
app.use('/api/carts', cartRouter);

// Error handler
app.use(errorHandler);

// app.get('*', (req, res) => {
//   res.sendFile(path.join(clientBuildPath, 'index.html'));
// });

viewEngine(app);

export default app;
