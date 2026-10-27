import {Request, Response} from 'express';
import {ChannelService} from '../channel.service.js';
import {HttpStatus} from '../../../lib/http-status.js';
import {CreateChannelDto} from '../dto/create-channel.dto.js';
import {EditChannelDto} from '../dto/edit-channel.dto.js';
import {SocketService} from '../../socket/socket.service.js';
import {StreamVideoService} from '../../stream-video/stream-video.service.js';

export class ChannelController {
  constructor(
    private channelService: ChannelService,
    private socketService: SocketService,
    private streamVideoService: StreamVideoService
  ) {
    this.channelService = channelService;
    this.socketService = socketService;
    this.streamVideoService = streamVideoService;
  }
  async getChannelById(req: Request, res: Response) {
    try {
      const channelId = req.params.channelId as string;
      const data = await this.channelService.getChannelById(channelId);
      return res.status(HttpStatus.OK).json({message: 'Get Channel By Id Successful', data});
    } catch (error) {
      console.log('====================================');
      console.log('ERROR IN Get Channel By Id ', error);
      console.log('====================================');
      if (error instanceof Error) return res.status(HttpStatus.BAD_REQUEST).json({message: 'Get Channel By Id Failed', error: error.message});
      else return res.status(HttpStatus.BAD_REQUEST).json({message: 'Get Channel By Id Failed', error: 'Unknown error'});
    }
  }
  async JoinToStreamChannel(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!user) return res.status(HttpStatus.NOT_FOUND).json({ message: 'User Not Found' });
      const channelId = req.params.channelId as string;
      const data = await this.channelService.getChannelById(channelId);
      const streamToken = this.streamVideoService.generateStreamToken(user.id);
      const responseData = {...data, streamToken};
      return res.status(HttpStatus.OK).json({message: 'Join to Stream Channel Successful', data: responseData});
    } catch (error) {
      console.log('====================================');
      console.log('ERROR IN Join to Stream Channel ', error);
      console.log('====================================');
      if (error instanceof Error) return res.status(HttpStatus.BAD_REQUEST).json({message: 'Join to Stream Channel Failed', error: error.message});
      else return res.status(HttpStatus.BAD_REQUEST).json({message: 'Join to Stream Channel Failed', error: 'Unknown error'});
    }
  }
  async getAllChannelsInServer(req: Request, res: Response) {
    try {
      const user = req.user;
      const serverName = req.params.serverName as string;
      if (!user) return res.status(HttpStatus.NOT_FOUND).json({message: 'User Not Found'});
      const data = await this.channelService.getAllChannelsInServer(serverName, user.id);
      return res.status(HttpStatus.OK).json({message: 'Get All Channels Successful', data});
    } catch (error) {
      console.log('====================================');
      console.log('ERROR IN Get All Channels ', error);
      console.log('====================================');
      if (error instanceof Error) return res.status(HttpStatus.BAD_REQUEST).json({message: 'Get All Channels Failed', error: error.message});
      else return res.status(HttpStatus.BAD_REQUEST).json({message: 'Get All Channels Failed', error: 'Unknown error'});
    }
  }
  async createChannel(req: Request, res: Response) {
    try {
      const user = req.user;
      const body = req.body as CreateChannelDto;
      if (!user) return res.status(HttpStatus.NOT_FOUND).json({message: 'User Not Found'});
      const data = await this.channelService.createChannel(user.id, body);
      this.socketService.emitToServer(data.serverId, 'newChannel', data);
      return res.status(HttpStatus.OK).json({message: 'Create Channel Successful', data});
    } catch (error) {
      console.log('====================================');
      console.log('ERROR IN Create Channel ', error);
      console.log('====================================');
      if (error instanceof Error) return res.status(HttpStatus.BAD_REQUEST).json({message: 'Create Channel Failed', error: error.message});
      else return res.status(HttpStatus.BAD_REQUEST).json({message: 'Create Channel Failed', error: 'Unknown error'});
    }
  }
  async editChannel(req: Request, res: Response) {
    try {
      const user = req.user;
      const serverId = req.params.serverId as string;
      const channelId = req.params.channelId as string;
      const body = req.body as EditChannelDto;
      if (!user) return res.status(HttpStatus.NOT_FOUND).json({message: 'User Not Found'});
      const data = await this.channelService.editChannel(user.id, serverId, channelId, body);
      this.socketService.emitToServer(serverId, 'editChannel', {channelId, data});
      this.socketService.emitToChannel(channelId, 'editChannel', {channelId, data});
      return res.status(HttpStatus.OK).json({message: 'Edit Channel Successful', data});
    } catch (error) {
      console.log('====================================');
      console.log('ERROR IN Edit Channel ', error);
      console.log('====================================');
      if (error instanceof Error) return res.status(HttpStatus.BAD_REQUEST).json({message: 'Edit Channel Failed', error: error.message});
      else return res.status(HttpStatus.BAD_REQUEST).json({message: 'Edit Channel Failed', error: 'Unknown error'});
    }
  }
  async deleteChannel(req: Request, res: Response) {
    try {
      const user = req.user;
      const serverId = req.params.serverId as string;
      const channelId = req.params.channelId as string;
      if (!user) return res.status(HttpStatus.NOT_FOUND).json({message: 'User Not Found'});
      const data = await this.channelService.deleteChannel(user.id, serverId, channelId);
      this.socketService.emitToServer(serverId, 'deleteChannel', {channelId, data});
      this.socketService.emitToChannel(channelId, 'deleteChannel', {channelId, data});
      return res.status(HttpStatus.OK).json({message: 'Delete Channel Successful', data});
    } catch (error) {
      console.log('====================================');
      console.log('ERROR IN Delete Channel ', error);
      console.log('====================================');
      if (error instanceof Error) return res.status(HttpStatus.BAD_REQUEST).json({message: 'Delete Channel Failed', error: error.message});
      else return res.status(HttpStatus.BAD_REQUEST).json({message: 'Delete Channel Failed', error: 'Unknown error'});
    }
  }
}
