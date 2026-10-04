import {Request, Response} from 'express';
import {ChannelMessageService} from '../channel-message.service.js';
import {HttpStatus} from '../../../lib/http-status.js';
import {MessageDto} from '../dto/message-dto.dto.js';
import {AppWriteService} from '../../appwite/appwite.services.js';
import {APPWRITE_BUCKETS_IDS} from '../../../config/appwrite-buckets-ids.js';

export class ChannelMessageController {
  private channelMessageService: ChannelMessageService;
  private appWriteService: AppWriteService;
  constructor(channelMessageService: ChannelMessageService, appWriteService: AppWriteService) {
    this.channelMessageService = channelMessageService;
    this.appWriteService = appWriteService;
  }
  async getAllMessage(req: Request, res: Response) {
    try {
      const user = req.user;
      const channelId = req.params.channelId as string;
      if (!user) return res.status(HttpStatus.NOT_FOUND).json({message: 'User Not Found'});
      const data = await this.channelMessageService.getAllMessages(user.id, channelId);
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
      const channelId = req.params.channelId as string;
      const message = req.body as MessageDto;
      if (!user) return res.status(HttpStatus.NOT_FOUND).json({message: 'User Not Found'});
      const path = req.file?.path;
      const originalName = req.file?.originalname;
      const image = await this.appWriteService.createFile(APPWRITE_BUCKETS_IDS.image, path, originalName);
      imageId = image?.$id;
      const data = await this.channelMessageService.sendMessage(user.id, channelId, message, imageId);
      return res.status(HttpStatus.OK).json({message: 'Send Message Successful', data});
    } catch (error) {
      console.log('====================================');
      console.log('ERROR IN Send Message ', error);
      console.log('====================================');
      if (req.file && imageId) {
        await this.appWriteService.deleteFile(APPWRITE_BUCKETS_IDS.image, imageId);
      }
      if (error instanceof Error) return res.status(HttpStatus.BAD_REQUEST).json({message: 'Send Message Failed', error: error.message});
      else return res.status(HttpStatus.BAD_REQUEST).json({message: 'Send Message Failed', error: 'Unknown error'});
    }
  }
  async editMessage(req: Request, res: Response) {
    try {
      const user = req.user;
      const channelId = req.params.channelId as string;
      const messageId = req.params.messageId as string;
      const message = req.body as MessageDto;
      if (!user) return res.status(HttpStatus.NOT_FOUND).json({message: 'User Not Found'});
      const data = await this.channelMessageService.editMessage(user.id, channelId, messageId, message);
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
      const channelId = req.params.channelId as string;
      const messageId = req.params.messageId as string;
      if (!user) return res.status(HttpStatus.NOT_FOUND).json({message: 'User Not Found'});
      const data = await this.channelMessageService.deleteMessage(user.id, channelId, messageId);
      if (data?.imageUrl) {
        await this.appWriteService.deleteFile(APPWRITE_BUCKETS_IDS.image, data?.imageUrl);
      }
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
