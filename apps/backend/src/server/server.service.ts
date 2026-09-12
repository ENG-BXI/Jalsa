import {CreateServerDto} from './dto/create-server.dto.js';
import {EditServerDto} from './dto/edit-server.dto.js';
import {ServerRepository} from './server.repository.js';

export class ServerService {
  private serverRepository: ServerRepository;
  constructor(serverRepository: ServerRepository) {
    this.serverRepository = serverRepository;
  }
  async getServerById(serverId: string, userId: string) {
    const server = await this.serverRepository.getServerById(serverId);
    if (!server?.isPublic) {
      const userInServer = await this.serverRepository.isUserInServer(serverId, userId);
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
  async getAllPublicServer() {
    const allServer = await this.serverRepository.getAllPublicServer();
    return allServer;
  }
  async createServer(userId: string, body: CreateServerDto) {
    const isServerExist = await this.serverRepository.getServerByName(body.name);
    if (isServerExist) {
      throw new Error('A server with this name already exists');
    }
    const createServer = await this.serverRepository.createServer(userId, body);
    await this.serverRepository.addUserToServer(userId, createServer.id, 'ADMIN');
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
    const isUserIsAdminForThisServer = server.admin_id == userId;
    if (!isUserIsAdminForThisServer) throw new Error('Only the server admin can edit this server');
    const editedServer = await this.serverRepository.editServer(serverId, body);
    return editedServer;
  }
  async deleteServer(userId: string, serverId: string) {
    const server = await this.serverRepository.getServerById(serverId);
    if (!server) throw new Error('Server not found');
    const isUserIsAdminForThisServer = server.admin_id == userId;
    if (!isUserIsAdminForThisServer) throw new Error('Only the server admin can delete this server');
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
}
