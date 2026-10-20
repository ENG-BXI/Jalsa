import {db} from '../../../prisma/db.js';
import {ServerRepository} from '../../server/server.repository.js';
import {SocketService} from '../../socket/socket.service.js';
import {ChannelRepository} from '../channel.repository.js';
import {ChannelService} from '../channel.service.js';
import {ChannelController} from './channel.controller.js';
import {ChannelRoute} from './channel.route.js';

export class ChannelRoute1 {
  private channelRoute;
  constructor(private socketService: SocketService) {
    this.socketService = socketService;

    const channelRepository = new ChannelRepository(db);
    const serverRepository = new ServerRepository(db);
    const channelService = new ChannelService(channelRepository, serverRepository);
    const channelController = new ChannelController(channelService, socketService);
    this.channelRoute = new ChannelRoute(channelController);
  }

  getRoutes() {
    return this.channelRoute.getRoutes();
  }
}
