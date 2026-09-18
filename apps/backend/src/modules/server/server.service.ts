import {TUserRole} from '../../enum/user.role.js';
import {ChannelRepository} from '../channel/channel.repository.js';
import {CreateServerDto} from './dto/create-server.dto.js';
import {EditServerDto} from './dto/edit-server.dto.js';
import {ServerRepository} from './server.repository.js';

export class ServerService {
  private serverRepository: ServerRepository;
  private channelRepository: ChannelRepository;
  constructor(serverRepository: ServerRepository, channelRepository: ChannelRepository) {
    this.serverRepository = serverRepository;
    this.channelRepository = channelRepository;
  }
  async getServerById(serverId: string, userId: string) {
    const server = await this.serverRepository.getServerById(serverId);
    if (!server) throw new Error('Server not found');
    if (!server?.isPublic) {
      const userInServer = await this.serverRepository.isUserInServer(serverId, userId);
      if (!userInServer) {
        throw new Error('You are not a member of this server');
      }
    }
    return server;
  }
  async getServerByName(serverName: string, userId: string) {
    const server = await this.serverRepository.getServerByName(serverName, userId);
    if (!server) throw new Error('Server not found');
    if (!server?.isPublic) {
      const userInServer = await this.serverRepository.isUserInServer(server.id, userId);
      if (!userInServer) {
        throw new Error('You are not a member of this server');
      }
    }
    return server;
  }
  async getAllServerForMember(userId: string) {
    const allServer = await this.serverRepository.getAllServerForMember(userId);
    return allServer;
  }
  async getAllMemberInMyServer(serverId: string, userId: string) {
    const server = await this.serverRepository.getServerById(serverId);
    if (!server) throw new Error('Server not found');
    const isUserInServer = await this.serverRepository.isUserInServer(serverId, userId);

    if (!isUserInServer) {
      throw new Error('User is not a member of this server');
    }
    const AllMember = await this.serverRepository.getAllMemberInMyServer(serverId);
    return AllMember;
  }
  async getAllPublicServer() {
    const allServer = await this.serverRepository.getAllPublicServer();
    return allServer;
  }
  async createServer(userId: string, body: CreateServerDto) {
    const isServerExist = await this.serverRepository.getServerByName(body.name, userId);
    if (isServerExist) {
      throw new Error('A server with this name already exists');
    }
    const createServer = await this.serverRepository.createServer(userId, body);
    await this.serverRepository.addUserToServer(userId, createServer.id, 'OWNER');
    // Add General Channel as Default Channel in New Server
    await this.channelRepository.createChannel({name: 'general', serverId: createServer.id, type: 'TEXT'});
    return createServer;
  }
  async addUserToServer(userId: string, serverId: string) {
    const isServerExist = await this.serverRepository.getServerById(serverId);
    if (!isServerExist) throw new Error('Server not found');
    const isUserInServer = await this.serverRepository.isUserInServer(serverId, userId);
    if (isUserInServer) {
      throw new Error('User is already a member of this server');
    }
    const addedUserToServer = await this.serverRepository.addUserToServer(userId, serverId, 'MEMBER');
    return addedUserToServer;
  }
  async editServer(userId: string, serverId: string, body: EditServerDto) {
    const server = await this.serverRepository.getServerById(serverId);
    if (!server) throw new Error('Server not found');
    const isUserAdmin = await this.serverRepository.isUserIsAdminOrAdminOfServer(userId, serverId);
    if (!isUserAdmin) throw new Error('Only the server (admin| owner) can edit this server');
    const editedServer = await this.serverRepository.editServer(serverId, body);
    return editedServer;
  }
  async deleteServer(userId: string, serverId: string) {
    const server = await this.serverRepository.getServerById(serverId);
    if (!server) throw new Error('Server not found');
    const isUserIsAdminForThisServer = server.owner_id == userId;
    if (!isUserIsAdminForThisServer) throw new Error('Only the server Owner can delete this server');
    const deletedServer = await this.serverRepository.deleteServer(serverId);
    return deletedServer;
  }
  async leaveUserFromServer(userId: string, serverId: string) {
    const serverMember = await this.serverRepository.isUserInServer(serverId, userId);
    if (!serverMember) throw new Error('User is not a member of this server');
    const isUserIsAdminForThisServer = serverMember.role == 'ADMIN';
    if (isUserIsAdminForThisServer) throw new Error('Server admin cannot leave the server');
    const leaverServer = await this.serverRepository.leaveUserFromServer(serverId, userId);
    return leaverServer;
  }
  async changeRoleInServer(serverId: string, userId: string, memberId: string, role: TUserRole) {
    if (role == 'OWNER') throw new Error('The owner role cannot be assigned');
    const server = await this.serverRepository.getServerById(serverId);
    if (!server) throw new Error('Server not found');
    if (memberId == server.owner_id) throw new Error('Cannot change the server owner role');
    const isUserAdminOrAdmin = await this.serverRepository.isUserIsAdminOrAdminOfServer(userId, serverId);
    if (!isUserAdminOrAdmin) throw new Error('Only the server (admin | owner) can change member roles');
    const memberRole = await this.serverRepository.getRoleOfUser(memberId, serverId);
    if (memberRole === role) {
      throw new Error('User already has this role');
    }
    const changeRole = await this.serverRepository.changeRoleInServer(serverId, memberId, role);
    return changeRole;
  }
}
