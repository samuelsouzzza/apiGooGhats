import express from 'express';
import { Response, Request, Router } from 'express';
import connectDatabase from './settings/database';
import { userRouter } from './routes/userRoutes';
import { chatRouter } from './routes/chatRoutes';
import cors from 'cors';

const app = express();
const route = Router();

app.use(express.json());

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(route);
app.use(userRouter);
app.use(chatRouter);

route.get('/', (req: Request, res: Response) => {
  return res.json({ message: 'API do projeto GooGhats' });
});

app.listen(3333, async () => {
  console.log('Servidor aberto em: http://localhost:3333');
  console.log(await connectDatabase());
});
