import {db} from '../../../prisma/db.js';
import {ServerRepository} from '../../server/server.repository.js';
import {ChannelRepository} from '../channel.repository.js';
import {ChannelService} from '../channel.service.js';
import {ChannelController} from './channel.controller.js';
import {ChannelRoute} from './channel.route.js';

const channelRepository = new ChannelRepository(db);
const serverRepository = new ServerRepository(db);
const channelService = new ChannelService(channelRepository, serverRepository);
const channelController = new ChannelController(channelService);
const channelRoute = new ChannelRoute(channelController).getRoutes();

export default channelRoute;
