import UserController from './user.controller.js';
import UserRepository from '../user.repository.js';
import UserRoute from './user.route.js';
import UserService from '../user.service.js';
import {db} from '../../../prisma/db.js';
import {SocketService} from '../../socket/socket.service.js';
import {RedisClientType, RedisDefaultModules} from 'redis';

export class UserRoute1 {
  private userRouteV1: UserRoute;
  constructor(socketService: SocketService, redisClient: RedisClientType<RedisDefaultModules, {}, {}, 3, {}>) {
    const userRepository = new UserRepository(db);
    const userService = new UserService(userRepository, redisClient);
    const userController = new UserController(userService, socketService);
    this.userRouteV1 = new UserRoute(userController);
  }

  getRoutes() {
    return this.userRouteV1.getRoutes();
  }
}
