import 'dotenv/config';
import express, {type Express, type Request, type Response} from 'express';
import {env} from './config/env.js';

const app: Express = express();

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});
const PORT = env.PORT;
app.listen(PORT, () => {
  console.log('====================================');
  console.log(`SERVER RUNNING IN PORT ${PORT}`);
  console.log('====================================');
});
