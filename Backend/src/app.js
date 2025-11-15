import express from 'express';
import cors from 'cors';
import {
  authRouter,
  postRouter,
  offerRouter, 
  likeRouter,
  commentRouter,
  productRouter,
  wishlistRouter,
  reviewRouter,
  transactionRouter,
  TOPRouter,
  CODRouter,
  adminRouter,
  sellerDashboardRouter,
  orderRouter
} from './routes/index.js';
import bodyParser from 'body-parser';

const app = express();

app.use(cors({
  origin: ['http://localhost:8000', 'http://localhost:5173'],
  credentials: true
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"))

app.get('/', (req, res) => {
  res.send('Welcome to the Need Kart Backend!');
});

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/post', postRouter)
app.use('/api/v1/offer', offerRouter)
app.use('/api/v1/like', likeRouter)
app.use('/api/v1/comment', commentRouter)
app.use('/api/v1/product', productRouter)
app.use('/api/v1/wishlist', wishlistRouter)
app.use('/api/v1/review', reviewRouter)
app.use('/api/v1/transaction', transactionRouter)
app.use('/api/v1/item', TOPRouter)
app.use('/api/v1/item-cod', CODRouter)
app.use('/api/v1/admin', adminRouter)
app.use('/api/v1/seller-dashboard', sellerDashboardRouter)
app.use('/api/v1/order', orderRouter)

// Error handling middleware - must be after all routes
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: `Route ${req.originalUrl} not found`
  });
});

export default app;