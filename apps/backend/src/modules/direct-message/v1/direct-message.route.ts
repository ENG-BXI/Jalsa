import {Router} from 'express';
import {DirectMessageController} from './direct-message.controller.js';
import {authMiddleWare} from '../../../middlewares/auth.middleware.js';
import {ValidationMiddleware} from '../../../middlewares/validation.middleware.js';
import {MessageDtoSchema} from '../dto/message-dto.dto.js';
import {uploadMulterMiddleware} from '../../../middlewares/multer.middleware.js';
export class DirectMessageRoute {
  private directMessageController: DirectMessageController;
  private router: Router;
  constructor(directMessageController: DirectMessageController) {
    this.directMessageController = directMessageController;
    this.router = Router();
    this.router.get('/dm-members', authMiddleWare, (req, res) => this.directMessageController.getAllDMMembers(req, res));
    this.router.get('/all-message/:receiverUserName', authMiddleWare, (req, res) => this.directMessageController.getAllMessage(req, res));
    this.router.post('/:receiverId', authMiddleWare, uploadMulterMiddleware({fileSize: 1024 * 1024 * 2}).single('image'), ValidationMiddleware(MessageDtoSchema), (req, res) => this.directMessageController.sendMessage(req, res));
    this.router.patch('/:messageId', authMiddleWare, uploadMulterMiddleware({fileSize: 1024 * 1024 * 2}).single('image'), ValidationMiddleware(MessageDtoSchema), (req, res) => this.directMessageController.editMessage(req, res));
    this.router.delete('/:messageId', authMiddleWare, (req, res) => this.directMessageController.deleteMessage(req, res));
  }
  getRoutes() {
    return this.router;
  }
}
