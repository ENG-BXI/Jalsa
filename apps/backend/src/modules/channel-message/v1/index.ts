import {RedisClientType, RedisDefaultModules} from 'redis';
import {db} from '../../../prisma/db.js';
import {AppWriteService} from '../../appwite/appwite.services.js';
import {ChannelRepository} from '../../channel/channel.repository.js';
import {SocketService} from '../../socket/socket.service.js';
import {ChannelMessageRepository} from '../channel-message.repository.js';
import {ChannelMessageService} from '../channel-message.service.js';
import {ChannelMessageController} from './channel-message.controller.js';
import {ChannelMessageRoute} from './channel-message.route.js';

export class ChannelMessageRoute1 {
  private channelMessageRoute;
  constructor(
    private socketService: SocketService,
    private appWriteService: AppWriteService,
    private redisClient: RedisClientType<RedisDefaultModules, {}, {}, 3, {}>
  ) {
    this.socketService = socketService;
    this.appWriteService = appWriteService;

    const channelMessageRepository = new ChannelMessageRepository(db);
    const channelRepository = new ChannelRepository(db);
    const channelMessageService = new ChannelMessageService(channelMessageRepository, channelRepository, this.redisClient);
    const channelMessageController = new ChannelMessageController(channelMessageService, this.appWriteService, this.socketService);
    this.channelMessageRoute = new ChannelMessageRoute(channelMessageController);
  }
  getRoutes() {
    return this.channelMessageRoute.getRoutes();
  }
}
