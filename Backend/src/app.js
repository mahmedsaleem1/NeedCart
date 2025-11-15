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
  buyerDashboardRouter,
  orderRouter,
  chatbotRouter
} from './routes/index.js';
import bodyParser from 'body-parser';

const app = express();

app.use(cors({
  origin: ['http://localhost:8000', 'http://localhost:5173', 'https://need-cart-ci4a.vercel.app'],
  credentials: true
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"))

app.get('/', (req, res) => {
  res.send('Welcome to the Need Kart Backend!');
});

app.use('/auth', authRouter)
app.use('/post', postRouter)
app.use('/offer', offerRouter)
app.use('/like', likeRouter)
app.use('/comment', commentRouter)
app.use('/product', productRouter)
app.use('/wishlist', wishlistRouter)
app.use('/review', reviewRouter)
app.use('/transaction', transactionRouter)
app.use('/item', TOPRouter)
app.use('/item-cod', CODRouter)
app.use('/admin', adminRouter)
app.use('/seller-dashboard', sellerDashboardRouter)
app.use('/buyer-dashboard', buyerDashboardRouter)
app.use('/order', orderRouter)
app.use('/chatbot', chatbotRouter)

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