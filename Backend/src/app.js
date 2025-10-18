import express from 'express';
import cors from 'cors';
import {
  authRouter,
  postRouter,
  offerRouter
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

export default app;