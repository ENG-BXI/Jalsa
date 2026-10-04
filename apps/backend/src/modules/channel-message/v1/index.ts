import {db} from '../../../prisma/db.js';
import { appWriteService } from '../../appwite/appwite.services.js';
import {ChannelRepository} from '../../channel/channel.repository.js';
import {ChannelMessageRepository} from '../channel-message.repository.js';
import {ChannelMessageService} from '../channel-message.service.js';
import {ChannelMessageController} from './channel-message.controller.js';
import {ChannelMessageRoute} from './channel-message.route.js';

const channelMessageRepository = new ChannelMessageRepository(db);

const channelRepository = new ChannelRepository(db);

const channelMessageService = new ChannelMessageService(channelMessageRepository, channelRepository);

const channelMessageController = new ChannelMessageController(channelMessageService, appWriteService);

const channelMessageRoute = new ChannelMessageRoute(channelMessageController).getRoutes();

export default channelMessageRoute;
