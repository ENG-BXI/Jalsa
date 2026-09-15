import {Router} from 'express';
import {ChannelMessageController} from './channel-message.controller.js';
import {authMiddleWare} from '../../../middlewares/auth.middleware.js';
import {ValidationMiddleware} from '../../../middlewares/validation.middleware.js';
import {MessageDtoSchema} from '../dto/message-dto.dto.js';
export class ChannelMessageRoute {
  private channelMessageController: ChannelMessageController;
  private router: Router;
  constructor(channelMessageController: ChannelMessageController) {
    this.channelMessageController = channelMessageController;
    this.router = Router();
    this.router.get('/all-message', authMiddleWare, (req, res) => this.channelMessageController.getAllMessage(req, res));
    this.router.post('/:channelId', authMiddleWare, ValidationMiddleware(MessageDtoSchema), (req, res) => this.channelMessageController.sendMessage(req, res));
    this.router.patch('/:channelId/:messageId', authMiddleWare, ValidationMiddleware(MessageDtoSchema), (req, res) => this.channelMessageController.editMessage(req, res));
    this.router.delete('/:channelId/:messageId', authMiddleWare, ValidationMiddleware(MessageDtoSchema), (req, res) => this.channelMessageController.editMessage(req, res));
  }
  getRoutes() {
    return this.router;
  }
}
