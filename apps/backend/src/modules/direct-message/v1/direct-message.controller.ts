import {Request, Response} from 'express';
import {DirectMessageService} from '../direct-message.service.js';
import {HttpStatus} from '../../../lib/http-status.js';
import {MessageDto} from '../dto/message-dto.dto.js';
import {AppWriteService} from '../../appwite/appwite.services.js';
import {APPWRITE_BUCKETS_IDS} from '../../../config/appwrite-buckets-ids.js';
import {SocketService} from '../../socket/socket.service.js';

export class DirectMessageController {
  private directMessageService: DirectMessageService;
  private appWriteService: AppWriteService;
  private socketService: SocketService;
  constructor(directMessageService: DirectMessageService, appWriteService: AppWriteService, socketService: SocketService) {
    this.directMessageService = directMessageService;
    this.appWriteService = appWriteService;
    this.socketService = socketService;
  }
  async getAllDMMembers(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!user) return res.status(HttpStatus.NOT_FOUND).json({message: 'User Not Found'});
      const data = await this.directMessageService.getAllDMMembers(user.id);
      return res.status(HttpStatus.OK).json({message: 'Get All DM Members Successful', data});
    } catch (error) {
      console.log('====================================');
      console.log('ERROR IN Get All DM Members ', error);
      console.log('====================================');
      if (error instanceof Error) return res.status(HttpStatus.BAD_REQUEST).json({message: 'Get All DM Members Failed', error: error.message});
      else return res.status(HttpStatus.BAD_REQUEST).json({message: 'Get All DM Members Failed', error: 'Unknown error'});
    }
  }
  async getAllMessage(req: Request, res: Response) {
    try {
      const user = req.user;
      const receiverUserName = req.params.receiverUserName as string;
      if (!user) return res.status(HttpStatus.NOT_FOUND).json({message: 'User Not Found'});
      const data = await this.directMessageService.getAllMessages(user.id, receiverUserName);
      return res.status(HttpStatus.OK).json({message: 'Get All Message Successful', data});
    } catch (error) {
      console.log('====================================');
      console.log('ERROR IN Get All Message ', error);
      console.log('====================================');
      if (error instanceof Error) return res.status(HttpStatus.BAD_REQUEST).json({message: 'Get All Message Failed', error: error.message});
      else return res.status(HttpStatus.BAD_REQUEST).json({message: 'Get All Message Failed', error: 'Unknown error'});
    }
  }
  async sendMessage(req: Request, res: Response) {
    let imageId;
    try {
      const user = req.user;
      const receiverId = req.params.receiverId as string;
      const message = req.body as MessageDto;
      if (!user) return res.status(HttpStatus.NOT_FOUND).json({message: 'User Not Found'});
      const buffer = req.file?.buffer;
      const originalName = req.file?.originalname;
      const image = await this.appWriteService.createFile(APPWRITE_BUCKETS_IDS.image, buffer, originalName);
      imageId = image?.$id;
      const data = await this.directMessageService.sendMessage(user.id, receiverId, message, imageId);
      this.socketService.emitToUser({userId: receiverId, event: 'newMessage', args: [data]});
      return res.status(HttpStatus.OK).json({message: 'Send Message Successful', data});
    } catch (error) {
      console.log('====================================');
      console.log('ERROR IN Send Message ', error);
      console.log('====================================');
      if (req.file?.path && imageId) {
        await this.appWriteService.deleteFile(APPWRITE_BUCKETS_IDS.image, imageId);
      }
      if (error instanceof Error) return res.status(HttpStatus.BAD_REQUEST).json({message: 'Send Message Failed', error: error.message});
      else return res.status(HttpStatus.BAD_REQUEST).json({message: 'Send Message Failed', error: 'Unknown error'});
    }
  }
  async editMessage(req: Request, res: Response) {
    try {
      const user = req.user;
      const messageId = req.params.messageId as string;
      const message = req.body as MessageDto;
      if (!user) return res.status(HttpStatus.NOT_FOUND).json({message: 'User Not Found'});
      const data = await this.directMessageService.editMessage(user.id, messageId, message);
      this.socketService.emitToUser({userId: data?.to, event: 'newMessage', args: [data]});
      return res.status(HttpStatus.OK).json({message: 'Edit Message Successful', data});
    } catch (error) {
      console.log('====================================');
      console.log('ERROR IN Edit Message ', error);
      console.log('====================================');
      if (error instanceof Error) return res.status(HttpStatus.BAD_REQUEST).json({message: 'Edit Message Failed', error: error.message});
      else return res.status(HttpStatus.BAD_REQUEST).json({message: 'Edit Message Failed', error: 'Unknown error'});
    }
  }
  async deleteMessage(req: Request, res: Response) {
    try {
      const user = req.user;
      const messageId = req.params.messageId as string;
      if (!user) return res.status(HttpStatus.NOT_FOUND).json({message: 'User Not Found'});
      const data = await this.directMessageService.deleteMessage(user.id, messageId);
      if (data?.imageUrl) {
        await this.appWriteService.deleteFile(APPWRITE_BUCKETS_IDS.image, data.imageUrl);
      }
      this.socketService.emitToUser({userId: data?.to, event: 'newMessage', args: [data]});
      return res.status(HttpStatus.OK).json({message: 'Delete Message Successful', data});
    } catch (error) {
      console.log('====================================');
      console.log('ERROR IN Delete Message ', error);
      console.log('====================================');
      if (error instanceof Error) return res.status(HttpStatus.BAD_REQUEST).json({message: 'Delete Message Failed', error: error.message});
      else return res.status(HttpStatus.BAD_REQUEST).json({message: 'Delete Message Failed', error: 'Unknown error'});
    }
  }
}
