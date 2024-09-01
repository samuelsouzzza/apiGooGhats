import express from 'express';
import { Response, Request, Router } from 'express';
import connectDatabase from './settings/database';

const app = express();
const route = Router();

app.use(express.json());
app.use(route);

route.get('/', (req: Request, res: Response) => {
  return res.json({ message: 'API do projeto GooGhats' });
});

app.listen(3333, async () => {
  console.log('Servidor aberto em: http://localhost:3333');
  console.log(await connectDatabase());
});
