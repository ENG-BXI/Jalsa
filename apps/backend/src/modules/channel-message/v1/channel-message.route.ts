import {Router} from 'express';
import {ChannelMessageController} from './channel-message.controller.js';
import {authMiddleWare} from '../../../middlewares/auth.middleware.js';
import {ValidationMiddleware} from '../../../middlewares/validation.middleware.js';
import {MessageDtoSchema} from '../dto/message-dto.dto.js';
import {uploadMulterMiddleware} from '../../../middlewares/multer.middleware.js';
export class ChannelMessageRoute {
  private channelMessageController: ChannelMessageController;
  private router: Router;
  constructor(channelMessageController: ChannelMessageController) {
    this.channelMessageController = channelMessageController;
    this.router = Router();
    this.router.get('/all-message/:channelId', authMiddleWare, (req, res) => this.channelMessageController.getAllMessage(req, res));
    this.router.post('/:channelId', authMiddleWare, uploadMulterMiddleware('channel-message', {fileSize: 1024 * 1024 * 2}).single('image'), ValidationMiddleware(MessageDtoSchema), (req, res) => this.channelMessageController.sendMessage(req, res));
    this.router.patch('/:channelId/:messageId', authMiddleWare, uploadMulterMiddleware('channel-message', {fileSize: 1024 * 1024 * 2}).single('image'),  ValidationMiddleware(MessageDtoSchema), (req, res) => this.channelMessageController.editMessage(req, res));
    this.router.delete('/:channelId/:messageId', authMiddleWare, (req, res) => this.channelMessageController.deleteMessage(req, res));
  }
  getRoutes() {
    return this.router;
  }
}
