import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors({
  origin: ['http://localhost:8000'],
  credentials: true
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"))

app.get('/', (req, res) => {
  res.send('Welcome to the Need Kart Backend!');
});


export default app;