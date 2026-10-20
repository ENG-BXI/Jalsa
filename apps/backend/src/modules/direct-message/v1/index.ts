import {db} from '../../../prisma/db.js';
import {AppWriteService} from '../../appwite/appwite.services.js';
import {SocketService} from '../../socket/socket.service.js';
import UserRepository from '../../users/user.repository.js';
import {DirectMessageRepository} from '../direct-message.repository.js';
import {DirectMessageService} from '../direct-message.service.js';
import {DirectMessageController} from './direct-message.controller.js';
import {DirectMessageRoute} from './direct-message.route.js';
export class DirectMessageRoute1 {
  private directMessageRoute;
  constructor(
    private socketService: SocketService,
    private appWriteService: AppWriteService
  ) {
    this.socketService = socketService;
    this.appWriteService = appWriteService;

    const directMessageRepository = new DirectMessageRepository(db);
    const userRepository = new UserRepository(db);
    const directMessageService = new DirectMessageService(directMessageRepository, userRepository);
    const directMessageController = new DirectMessageController(directMessageService, this.appWriteService, this.socketService);
    this.directMessageRoute = new DirectMessageRoute(directMessageController);
  }
  getRoutes() {
    return this.directMessageRoute.getRoutes();
  }
}
