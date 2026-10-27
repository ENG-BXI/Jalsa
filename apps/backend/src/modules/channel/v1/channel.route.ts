import {Router} from 'express';
import {ChannelController} from './channel.controller.js';
import {authMiddleWare} from '../../../middlewares/auth.middleware.js';
import {ValidationMiddleware} from '../../../middlewares/validation.middleware.js';
import {CreateChannelDtoSchema} from '../dto/create-channel.dto.js';
import {EditChannelDtoSchema} from '../dto/edit-channel.dto.js';

export class ChannelRoute {
  private router: Router;
  constructor(private channelController: ChannelController) {
    this.channelController = channelController;
    this.router = Router();
    this.router.get('/server/:serverName', authMiddleWare, (req, res) => this.channelController.getAllChannelsInServer(req, res));
    this.router.get('/join-stream-channel/:channelId', authMiddleWare, (req, res) => this.channelController.JoinToStreamChannel(req, res));
    this.router.post('/create-channel', authMiddleWare, ValidationMiddleware(CreateChannelDtoSchema), (req, res) => this.channelController.createChannel(req, res));
    this.router.patch('/edit-channel/:serverId/:channelId', authMiddleWare, ValidationMiddleware(EditChannelDtoSchema), (req, res) => this.channelController.editChannel(req, res));
    this.router.delete('/delete-channel/:serverId/:channelId', authMiddleWare, (req, res) => this.channelController.deleteChannel(req, res));
    this.router.get('/:channelId', authMiddleWare, (req, res) => this.channelController.getChannelById(req, res));
  }
  getRoutes() {
    return this.router;
  }
}
