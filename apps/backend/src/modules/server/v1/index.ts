import {db} from '../../../prisma/db.js';
import {appWriteService} from '../../appwite/appwite.services.js';
import {ChannelRepository} from '../../channel/channel.repository.js';
import {ServerRepository} from '../server.repository.js';
import {ServerService} from '../server.service.js';
import {ServerController} from './server.controller.js';
import {ServerRoute} from './server.route.js';

const serverRepository = new ServerRepository(db);
const channelRepository = new ChannelRepository(db);
const serverService = new ServerService(serverRepository, channelRepository);
const serverController = new ServerController(serverService, appWriteService);
const serverRoute = new ServerRoute(serverController).getRoutes();

export default serverRoute;
