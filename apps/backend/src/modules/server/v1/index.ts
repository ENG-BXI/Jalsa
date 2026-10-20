import {db} from '../../../prisma/db.js';
import {AppWriteService} from '../../appwite/appwite.services.js';
import {ChannelRepository} from '../../channel/channel.repository.js';
import {SocketService} from '../../socket/socket.service.js';
import {ServerRepository} from '../server.repository.js';
import {ServerService} from '../server.service.js';
import {ServerController} from './server.controller.js';
import {ServerRoute} from './server.route.js';

export class ServerRoute1 {
  private serverRoute: ServerRoute;
  constructor(
    private socketService: SocketService,
    private appWriteService: AppWriteService
  ) {
    this.socketService = socketService;
    this.appWriteService = appWriteService;
    const serverRepository = new ServerRepository(db);
    const channelRepository = new ChannelRepository(db);
    const serverService = new ServerService(serverRepository, channelRepository);
    const serverController = new ServerController(serverService, this.appWriteService, this.socketService);
    this.serverRoute = new ServerRoute(serverController);
  }
  getRoutes() {
    return this.serverRoute.getRoutes();
  }
}
