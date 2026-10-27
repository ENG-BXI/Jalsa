import 'dotenv/config';
import 'temporal-polyfill/full/global';
import express, {type Express, type Request, type Response} from 'express';
import {env} from './config/env.js';
import cors from 'cors';
import {ErrorMiddleware} from './middlewares/error.middleware.js';
import path from 'node:path';
import {SocketService} from './modules/socket/socket.service.js';
import {Server} from 'socket.io';
import {createServer} from 'node:http';
import {AppRouter} from './app.route.js';
import {V1Route} from './routes/v1.route.js';
import {appWriteService} from './modules/appwite/appwite.services.js';
import {ServerRepository} from './modules/server/server.repository.js';
import {db} from './prisma/db.js';
import {StreamVideoService} from './modules/stream-video/stream-video.service.js';

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
const socketService = new SocketService(io, new ServerRepository(db));
const streamVideoService = new StreamVideoService();
const v1Route = new V1Route(socketService, appWriteService, streamVideoService).getRoutes();
const appRouter = new AppRouter(v1Route).getRoutes();

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
