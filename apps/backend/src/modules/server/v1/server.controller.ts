import {Request, Response} from 'express';
import {ServerService} from '../server.service.js';
import {HttpStatus} from '../../../lib/http-status.js';
import {CreateServerDto} from '../dto/create-server.dto.js';
import {EditServerDto} from '../dto/edit-server.dto.js';
import {ChangeRoleDto} from '../dto/change-role.dto.js';
import {KickUserFromServerDto} from '../dto/kick-user-from-server.dto.js';
import {AppWriteService} from '../../appwite/appwite.services.js';
import {APPWRITE_BUCKETS_IDS} from '../../../config/appwrite-buckets-ids.js';
import {SocketService} from '../../socket/socket.service.js';
export class ServerController {
  private serverService: ServerService;
  private appWriteService: AppWriteService;
  private socketService: SocketService;
  constructor(serverService: ServerService, appWriteService: AppWriteService, socketService: SocketService) {
    this.serverService = serverService;
    this.appWriteService = appWriteService;
    this.socketService = socketService;
  }
  async getServerById(req: Request, res: Response) {
    try {
      const serverId = req.params.serverId as string;
      const user = req.user;
      if (!user) return res.status(HttpStatus.NOT_FOUND).json({message: 'User Not Found'});
      const data = await this.serverService.getServerById(serverId, user.id);
      return res.status(HttpStatus.OK).json({message: 'Get Server By Id Successful', data});
    } catch (error) {
      console.log('====================================');
      console.log('ERROR IN Get Server By Id ', error);
      console.log('====================================');
      if (error instanceof Error) return res.status(HttpStatus.BAD_REQUEST).json({message: 'Get Server By Id Failed', error: error.message});
      else return res.status(HttpStatus.BAD_REQUEST).json({message: 'Get Server By Id Failed', error: 'Unknown error'});
    }
  }
  async getServerByName(req: Request, res: Response) {
    try {
      const serverName = req.params.serverName as string;
      const user = req.user;
      if (!user) return res.status(HttpStatus.NOT_FOUND).json({message: 'User Not Found'});
      const data = await this.serverService.getServerByName(serverName, user.id);
      return res.status(HttpStatus.OK).json({message: 'Get Server By Name Successful', data});
    } catch (error) {
      console.log('====================================');
      console.log('ERROR IN Get Server By Name ', error);
      console.log('====================================');
      if (error instanceof Error) return res.status(HttpStatus.BAD_REQUEST).json({message: 'Get Server By Name Failed', error: error.message});
      else return res.status(HttpStatus.BAD_REQUEST).json({message: 'Get Server By Name Failed', error: 'Unknown error'});
    }
  }
  async getAllServerForMember(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!user) return res.status(HttpStatus.NOT_FOUND).json({message: 'User Not Found'});
      const data = await this.serverService.getAllServerForMember(user.id);
      return res.status(HttpStatus.OK).json({message: 'Get All Server For Member Successful', data});
    } catch (error) {
      console.log('====================================');
      console.log('ERROR IN Get All Server For Member ', error);
      console.log('====================================');
      if (error instanceof Error) return res.status(HttpStatus.BAD_REQUEST).json({message: 'Get All Server For Member Failed', error: error.message});
      else return res.status(HttpStatus.BAD_REQUEST).json({message: 'Get All Server For Member Failed', error: 'Unknown error'});
    }
  }
  async getAllMemberInMyServer(req: Request, res: Response) {
    try {
      const serverId = req.params.serverId as string;
      const user = req.user;
      if (!user) return res.status(HttpStatus.NOT_FOUND).json({message: 'User Not Found'});
      const data = await this.serverService.getAllMemberInMyServer(serverId, user.id);
      return res.status(HttpStatus.OK).json({message: 'Get All Members Successful', data});
    } catch (error) {
      console.log('====================================');
      console.log('ERROR IN Get All Members ', error);
      console.log('====================================');
      if (error instanceof Error) return res.status(HttpStatus.BAD_REQUEST).json({message: 'Get All Members Failed', error: error.message});
      else return res.status(HttpStatus.BAD_REQUEST).json({message: 'Get All Members Failed', error: 'Unknown error'});
    }
  }
  async getAllPublicServer(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;
      const data = await this.serverService.getAllPublicServer(page, limit, search);
      return res.status(HttpStatus.OK).json({message: 'Get All Public Server Successful', data});
    } catch (error) {
      console.log('====================================');
      console.log('ERROR IN Get All Public Server ', error);
      console.log('====================================');
      if (error instanceof Error) return res.status(HttpStatus.BAD_REQUEST).json({message: 'Get All Public Server Failed', error: error.message});
      else return res.status(HttpStatus.BAD_REQUEST).json({message: 'Get All Public Server Failed', error: 'Unknown error'});
    }
  }
  async getNumberOfMembersInServer(req: Request, res: Response) {
    try {
      const user = req.user;
      if (!user) return res.status(HttpStatus.NOT_FOUND).json({message: 'User Not Found'});
      const data = await this.serverService.getNumberOfMembersInServer(req.params.serverId as string);
      return res.status(HttpStatus.OK).json({message: 'Get Number of Member In Server Successful', data});
    } catch (error) {
      console.log('====================================');
      console.log('ERROR IN Get Number of Member In Server ', error);
      console.log('====================================');
      if (error instanceof Error) return res.status(HttpStatus.BAD_REQUEST).json({message: 'Get Number of Member In Server Failed', error: error.message});
      else return res.status(HttpStatus.BAD_REQUEST).json({message: 'Get Number of Member In Server Failed', error: 'Unknown error'});
    }
  }
  async createServer(req: Request, res: Response) {
    let imageId;
    try {
      const user = req.user;
      const body = req.body as CreateServerDto;
      if (!user) return res.status(HttpStatus.NOT_FOUND).json({message: 'User Not Found'});
      const buffer = req.file?.buffer;
      const originalName = req.file?.originalname;
      const image = await this.appWriteService.createFile(APPWRITE_BUCKETS_IDS.image, buffer, originalName);
      imageId = image?.$id;
      const data = await this.serverService.createServer(user.id, body, imageId);
      if (data.isPublic) this.socketService.emit('newPublicServer', data);
      return res.status(HttpStatus.OK).json({message: 'Create Server Successful', data});
    } catch (error) {
      console.log('====================================');
      console.log('ERROR IN Create Server ', error);
      console.log('====================================');
      if (req.file && imageId) {
        await this.appWriteService.deleteFile(APPWRITE_BUCKETS_IDS.image, imageId);
      }
      if (error instanceof Error) return res.status(HttpStatus.BAD_REQUEST).json({message: 'Create Server Failed', error: error.message});
      else return res.status(HttpStatus.BAD_REQUEST).json({message: 'Create Server Failed', error: 'Unknown error'});
    }
  }
  async addUserToServer(req: Request, res: Response) {
    try {
      const user = req.user;
      const serverId = req.params.serverId as string;
      if (!user) return res.status(HttpStatus.NOT_FOUND).json({message: 'User Not Found'});
      const data = await this.serverService.addUserToServer(user.id, serverId);
      if (data.server?.isPublic) this.socketService.emit('addUserToServer', {serverId, data});
      else this.socketService.emitToServer(serverId, 'addUserToServer', {serverId, data});
      return res.status(HttpStatus.OK).json({message: 'Add User to Server Successful', data});
    } catch (error) {
      console.log('====================================');
      console.log('ERROR IN Add User to Server ', error);
      console.log('====================================');
      if (error instanceof Error) return res.status(HttpStatus.BAD_REQUEST).json({message: 'Add User to Server Failed', error: error.message});
      else return res.status(HttpStatus.BAD_REQUEST).json({message: 'Add User to Server Failed', error: 'Unknown error'});
    }
  }
  async addUserToPrivateServerByInvite(req: Request, res: Response) {
    try {
      const user = req.user;
      const serverId = req.params.serverId as string;
      const inviteCode = req.params.inviteCode as string;
      if (!user) return res.status(HttpStatus.NOT_FOUND).json({message: 'User Not Found'});
      const data = await this.serverService.addUserToPrivateServerByInvite(user.id, inviteCode, serverId);
      this.socketService.emitToServer(serverId, 'addUserToServer', {serverId, data});
      return res.status(HttpStatus.OK).json({message: 'Add User to Private Server Successful', data});
    } catch (error) {
      console.log('====================================');
      console.log('ERROR IN Add User to Private Server ', error);
      console.log('====================================');
      if (error instanceof Error) return res.status(HttpStatus.BAD_REQUEST).json({message: 'Add User to Private Server Failed', error: error.message});
      else return res.status(HttpStatus.BAD_REQUEST).json({message: 'Add User to Private Server Failed', error: 'Unknown error'});
    }
  }
  async generateInviteCode(req: Request, res: Response) {
    try {
      const user = req.user;
      const serverId = req.params.serverId as string;
      const isMultiple = !!req.body.isMultiple;
      if (!user) return res.status(HttpStatus.NOT_FOUND).json({message: 'User Not Found'});
      const data = await this.serverService.generateInviteCode(user.id, serverId, isMultiple);
      return res.status(HttpStatus.OK).json({message: 'Generate Invite Code Successful', data});
    } catch (error) {
      console.log('====================================');
      console.log('ERROR IN Generate Invite Code ', error);
      console.log('====================================');
      if (error instanceof Error) return res.status(HttpStatus.BAD_REQUEST).json({message: 'Generate Invite Code Failed', error: error.message});
      else return res.status(HttpStatus.BAD_REQUEST).json({message: 'Generate Invite Code Failed', error: 'Unknown error'});
    }
  }
  async editServer(req: Request, res: Response) {
    let newImageId;
    try {
      const user = req.user;
      const serverId = req.params.serverId as string;
      const body = req.body as EditServerDto;
      if (!user) return res.status(HttpStatus.NOT_FOUND).json({message: 'User Not Found'});
      const buffer = req.file?.buffer;
      const originalName = req.file?.originalname;
      const image = await this.appWriteService.createFile(APPWRITE_BUCKETS_IDS.image, buffer, originalName);
      newImageId = image?.$id;
      const data = await this.serverService.editServer(user.id, serverId, body, newImageId);
      if (data?.avatar_url && newImageId) {
        await this.appWriteService.deleteFile(APPWRITE_BUCKETS_IDS.image, data?.avatar_url);
      }
      this.socketService.emit('editServer', {serverId, data});
      this.socketService.emitToServer(serverId, 'editServer', {serverId, data});
      return res.status(HttpStatus.OK).json({message: 'Edit Server Successful', data});
    } catch (error) {
      console.log('====================================');
      console.log('ERROR IN Edit Server ', error);
      console.log('====================================');
      if (req.file && newImageId) {
        await this.appWriteService.deleteFile(APPWRITE_BUCKETS_IDS.image, newImageId);
      }
      if (error instanceof Error) return res.status(HttpStatus.BAD_REQUEST).json({message: 'Edit Server Failed', error: error.message});
      else return res.status(HttpStatus.BAD_REQUEST).json({message: 'Edit Server Failed', error: 'Unknown error'});
    }
  }
  async deleteServer(req: Request, res: Response) {
    try {
      const user = req.user;
      const serverId = req.params.serverId as string;
      if (!user) return res.status(HttpStatus.NOT_FOUND).json({message: 'User Not Found'});
      const data = await this.serverService.deleteServer(user.id, serverId);
      if (data?.avatar_url) {
        await this.appWriteService.deleteFile(APPWRITE_BUCKETS_IDS.image, data?.avatar_url);
      }
      this.socketService.emit('deleteServer', {serverId, data});
      this.socketService.emitToServer(serverId, 'deleteServer', {serverId, data});
      return res.status(HttpStatus.OK).json({message: 'Delete Server Successful', data});
    } catch (error) {
      console.log('====================================');
      console.log('ERROR IN Delete Server ', error);
      console.log('====================================');
      if (error instanceof Error) return res.status(HttpStatus.BAD_REQUEST).json({message: 'Delete Server Failed', error: error.message});
      else return res.status(HttpStatus.BAD_REQUEST).json({message: 'Delete Server Failed', error: 'Unknown error'});
    }
  }
  async leaveUserFromServer(req: Request, res: Response) {
    try {
      const user = req.user;
      const serverId = req.params.serverId as string;
      if (!user) return res.status(HttpStatus.NOT_FOUND).json({message: 'User Not Found'});
      const data = await this.serverService.leaveUserFromServer(user.id, serverId);
      if (data?.server?.isPublic) this.socketService.emit('leaveServer', {serverId, data});
      else this.socketService.emitToServer(serverId, 'leaveServer', {serverId, data});
      return res.status(HttpStatus.OK).json({message: 'Leave From Server Successful', data});
    } catch (error) {
      console.log('====================================');
      console.log('ERROR IN Leave From Server ', error);
      console.log('====================================');
      if (error instanceof Error) return res.status(HttpStatus.BAD_REQUEST).json({message: 'Leave From Server Failed', error: error.message});
      else return res.status(HttpStatus.BAD_REQUEST).json({message: 'Leave From Server Failed', error: 'Unknown error'});
    }
  }
  async kickedUserFromServer(req: Request, res: Response) {
    try {
      const user = req.user;
      const serverId = req.params.serverId as string;
      const {memberId} = req.body as KickUserFromServerDto;
      if (!user) return res.status(HttpStatus.NOT_FOUND).json({message: 'User Not Found'});
      const data = await this.serverService.kickUserFromServer(user.id, memberId, serverId);
      this.socketService.emit('leaveServer', {serverId, data});
      return res.status(HttpStatus.OK).json({message: 'kicked User From Server Successful', data});
    } catch (error) {
      console.log('====================================');
      console.log('ERROR IN kicked User From Server ', error);
      console.log('====================================');
      if (error instanceof Error) return res.status(HttpStatus.BAD_REQUEST).json({message: 'kicked User From Server Failed', error: error.message});
      else return res.status(HttpStatus.BAD_REQUEST).json({message: 'kicked User From Server Failed', error: 'Unknown error'});
    }
  }
  async changeRoleInServer(req: Request, res: Response) {
    try {
      const user = req.user;
      const serverId = req.params.serverId as string;
      const {memberId, role} = req.body as ChangeRoleDto;
      if (!user) return res.status(HttpStatus.NOT_FOUND).json({message: 'User Not Found'});
      const data = await this.serverService.changeRoleInServer(serverId, user.id, memberId, role);
      this.socketService.emitToUser({userId: memberId, event: 'changeRoleInServer', args: [data]});
      this.socketService.emitToServer(serverId, 'changeRoleInServer', {serverId, data});
      return res.status(HttpStatus.OK).json({message: 'Change Role Successful', data});
    } catch (error) {
      console.log('====================================');
      console.log('ERROR IN Change Role ', error);
      console.log('====================================');
      if (error instanceof Error) return res.status(HttpStatus.BAD_REQUEST).json({message: 'Change Role Failed', error: error.message});
      else return res.status(HttpStatus.BAD_REQUEST).json({message: 'Change Role Failed', error: 'Unknown error'});
    }
  }
}
