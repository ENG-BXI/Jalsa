import {Router} from 'express';
import {UserRoute1} from '../modules/users/v1/index.js';
import {authMiddleWare} from '../middlewares/auth.middleware.js';
import authRoute from '../modules/auth/index.js';
import {DirectMessageRoute1} from '../modules/direct-message/v1/index.js';
import {ChannelMessageRoute1} from '../modules/channel-message/v1/index.js';
import {SocketService} from '../modules/socket/socket.service.js';
import {ServerRoute1} from '../modules/server/v1/index.js';
import {AppWriteService} from '../modules/appwite/appwite.services.js';
import {ChannelRoute1} from '../modules/channel/v1/index.js';
import {StreamVideoService} from '../modules/stream-video/stream-video.service.js';

export class V1Route {
  private v1Route = Router();
  constructor(socketService: SocketService, appWriteService: AppWriteService, streamVideoService: StreamVideoService) {
    const userRouteV1 = new UserRoute1(socketService).getRoutes();
    const serverRoute = new ServerRoute1(socketService, appWriteService).getRoutes();
    const channelRoute = new ChannelRoute1(socketService, streamVideoService).getRoutes();
    const directMessageRoute = new DirectMessageRoute1(socketService, appWriteService).getRoutes();
    const channelMessageRoute = new ChannelMessageRoute1(socketService, appWriteService).getRoutes();

    this.v1Route.use('/auth', authRoute);
    this.v1Route.use('/user', authMiddleWare, userRouteV1);
    this.v1Route.use('/server', serverRoute);
    this.v1Route.use('/channel', channelRoute);
    this.v1Route.use('/direct-message', directMessageRoute);
    this.v1Route.use('/channel-message', channelMessageRoute);
  }

  getRoutes() {
    return this.v1Route;
  }
}
