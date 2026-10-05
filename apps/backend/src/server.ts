import 'dotenv/config';
import 'temporal-polyfill/full/global';
import express, {type Express, type Request, type Response} from 'express';
import {env} from './config/env.js';
import appRouter from './app.route.js';
import cors from 'cors';
import {ErrorMiddleware} from './middlewares/error.middleware.js';
import path from 'node:path';
import {SocketService} from './modules/socket/socket.service.js';
import {Server} from 'socket.io';
import {createServer} from 'node:http';

const app: Express = express();
app.use(cors());
app.use(express.json());
const server = createServer(app);
const io = new Server(server, {
  cors: {
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    origin: '*'
  }
});
export const socketService = new SocketService(io);
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/api', appRouter);
app.use(ErrorMiddleware);
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});
const PORT = env.PORT;
server.listen(PORT, () => {
  console.log('====================================');
  console.log(`SERVER RUNNING IN PORT ${PORT}`);
  console.log('====================================');
});
