import {Request, Response} from 'express';
import {ServerService} from '../server.service.js';
import {HttpStatus} from '../../../lib/http-status.js';
import {CreateServerDto} from '../dto/create-server.dto.js';
import {EditServerDto} from '../dto/edit-server.dto.js';
import {ChangeRoleDto} from '../dto/change-role.dto.js';

export class ServerController {
  private serverService: ServerService;
  constructor(serverService: ServerService) {
    this.serverService = serverService;
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
      const data = await this.serverService.getAllPublicServer();
      return res.status(HttpStatus.OK).json({message: 'Get All Public Server Successful', data});
    } catch (error) {
      console.log('====================================');
      console.log('ERROR IN Get All Public Server ', error);
      console.log('====================================');
      if (error instanceof Error) return res.status(HttpStatus.BAD_REQUEST).json({message: 'Get All Public Server Failed', error: error.message});
      else return res.status(HttpStatus.BAD_REQUEST).json({message: 'Get All Public Server Failed', error: 'Unknown error'});
    }
  }
  async createServer(req: Request, res: Response) {
    try {
      const user = req.user;
      const body = req.body as CreateServerDto;
      if (!user) return res.status(HttpStatus.NOT_FOUND).json({message: 'User Not Found'});
      const data = await this.serverService.createServer(user.id, body);
      return res.status(HttpStatus.OK).json({message: 'Create Server Successful', data});
    } catch (error) {
      console.log('====================================');
      console.log('ERROR IN Create Server ', error);
      console.log('====================================');
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
      return res.status(HttpStatus.OK).json({message: 'Add User to Server Successful', data});
    } catch (error) {
      console.log('====================================');
      console.log('ERROR IN Add User to Server ', error);
      console.log('====================================');
      if (error instanceof Error) return res.status(HttpStatus.BAD_REQUEST).json({message: 'Add User to Server Failed', error: error.message});
      else return res.status(HttpStatus.BAD_REQUEST).json({message: 'Add User to Server Failed', error: 'Unknown error'});
    }
  }
  async editServer(req: Request, res: Response) {
    try {
      const user = req.user;
      const serverId = req.params.serverId as string;
      const body = req.body as EditServerDto;
      if (!user) return res.status(HttpStatus.NOT_FOUND).json({message: 'User Not Found'});
      const data = await this.serverService.editServer(user.id, serverId, body);
      return res.status(HttpStatus.OK).json({message: 'Edit Server Successful', data});
    } catch (error) {
      console.log('====================================');
      console.log('ERROR IN Edit Server ', error);
      console.log('====================================');
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
      return res.status(HttpStatus.OK).json({message: 'Leave From Server Successful', data});
    } catch (error) {
      console.log('====================================');
      console.log('ERROR IN Leave From Server ', error);
      console.log('====================================');
      if (error instanceof Error) return res.status(HttpStatus.BAD_REQUEST).json({message: 'Leave From Server Failed', error: error.message});
      else return res.status(HttpStatus.BAD_REQUEST).json({message: 'Leave From Server Failed', error: 'Unknown error'});
    }
  }
  async changeRoleInServer(req: Request, res: Response) {
    try {
      const user = req.user;
      const serverId = req.params.serverId as string;
      const {memberId, role} = req.body as ChangeRoleDto;
      if (!user) return res.status(HttpStatus.NOT_FOUND).json({message: 'User Not Found'});
      const data = await this.serverService.changeRoleInServer(serverId, user.id, memberId, role);
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
