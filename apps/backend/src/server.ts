import 'dotenv/config';
import 'temporal-polyfill/full/global';
import express, { type Express, type Request, type Response } from 'express';
import {env} from './config/env.js';
import appRouter from './app.route.js';

const app: Express = express();
app.use(express.json());
app.use('/api', appRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});
const PORT = env.PORT;
app.listen(PORT, () => {
  console.log('====================================');
  console.log(`SERVER RUNNING IN PORT ${PORT}`);
  console.log('====================================');
});
