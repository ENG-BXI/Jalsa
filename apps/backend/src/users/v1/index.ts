import UserController from './user.controller.js';
import UserRepository from '../user.repository.js';
import UserRoute from './user.route.js';
import UserService from '../user.service.js';
import {db} from '../../prisma/db.js';

const userRepository = new UserRepository(db);
const userService = new UserService(userRepository);
const userController = new UserController(userService);
export const userRouteV1 = new UserRoute(userController).getRoutes();
