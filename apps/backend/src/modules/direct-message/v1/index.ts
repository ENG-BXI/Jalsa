import {db} from '../../../prisma/db.js';
import {appWriteService} from '../../appwite/appwite.services.js';
import UserRepository from '../../users/user.repository.js';
import {DirectMessageRepository} from '../direct-message.repository.js';
import {DirectMessageService} from '../direct-message.service.js';
import {DirectMessageController} from './direct-message.controller.js';
import {DirectMessageRoute} from './direct-message.route.js';

const directMessageRepository = new DirectMessageRepository(db);

const userRepository = new UserRepository(db);

const directMessageService = new DirectMessageService(directMessageRepository, userRepository);

const directMessageController = new DirectMessageController(directMessageService, appWriteService);

const directMessageRoute = new DirectMessageRoute(directMessageController).getRoutes();

export default directMessageRoute;
