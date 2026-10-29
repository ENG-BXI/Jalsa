import {Temporal} from 'temporal-polyfill';
import {TUserRole} from '../../enum/user.role.js';
import {ChannelRepository} from '../channel/channel.repository.js';
import {CreateServerDto} from './dto/create-server.dto.js';
import {EditServerDto} from './dto/edit-server.dto.js';
import {ServerRepository} from './server.repository.js';
import {RedisClientType, RedisDefaultModules} from 'redis';
export class ServerService {
  private serverRepository: ServerRepository;
  private channelRepository: ChannelRepository;
  private redisKeys = {
    GET_SERVER_BY_ID: (serverId: string) => `server:details:${serverId}`,
    GET_SERVER_BY_NAME: (serverName: string) => `server:details:${serverName}`,
    GET_ALL_SERVER_FOR_MEMBER: (userId: string) => `server:all-server-for-member:${userId}`,
    GET_ALL_MEMBER_IN_MY_SERVER: (serverId: string) => `server:all-member:${serverId}`,
    GET_ALL_PUBLIC_SERVER: (page?: number, limit?: number, search?: string) => `server:all-public-server:${page}-${limit}-${search}`,
    GET_ALL_PUBLIC_SERVER_PATTERN: () => `server:all-public-server:*`,
    GET_NUMBER_OF_MEMBERS_IN_SERVER: (serverId: string) => `server:number-of-members:${serverId}`
  };
  constructor(
    serverRepository: ServerRepository,
    channelRepository: ChannelRepository,
    private redisClient: RedisClientType<RedisDefaultModules, {}, {}, 3, {}>
  ) {
    this.serverRepository = serverRepository;
    this.channelRepository = channelRepository;
  }
  async deleteByPattern(pattern: string) {
    const keys: string[] = [];
    for await (const key of this.redisClient.scanIterator({MATCH: pattern, COUNT: 100})) {
      keys.push(...(Array.isArray(key) ? key : [key]));
    }
    if (keys.length) await this.redisClient.del(keys);
  }
  async getServerById(serverId: string, userId: string) {
    const key = this.redisKeys.GET_SERVER_BY_ID(serverId);
    const cachedServer = await this.redisClient.get(key);
    if (cachedServer) {
      return JSON.parse(cachedServer);
    }
    const server = await this.serverRepository.getServerById(serverId);
    if (!server) throw new Error('Server not found');
    if (!server?.isPublic) {
      const userInServer = await this.serverRepository.isUserInServer(serverId, userId);
      if (!userInServer) {
        throw new Error('You are not a member of this server');
      }
    }
    await this.redisClient.set(key, JSON.stringify(server), {EX: 3600});
    return server;
  }
  async getServerByName(serverName: string, userId: string) {
    const key = this.redisKeys.GET_SERVER_BY_NAME(serverName);
    const cachedServer = await this.redisClient.get(key);
    if (cachedServer) {
      return JSON.parse(cachedServer);
    }
    const server = await this.serverRepository.getServerByName(serverName, userId);
    if (!server) throw new Error('Server not found');
    if (!server?.isPublic) {
      const userInServer = await this.serverRepository.isUserInServer(server.id, userId);
      if (!userInServer) {
        throw new Error('You are not a member of this server');
      }
    }
    await this.redisClient.set(key, JSON.stringify(server), {EX: 3600});
    return server;
  }
  async getAllServerForMember(userId: string) {
    const key = this.redisKeys.GET_ALL_SERVER_FOR_MEMBER(userId);
    const cachedAllServer = await this.redisClient.get(key);
    if (cachedAllServer) {
      return JSON.parse(cachedAllServer);
    }
    const allServer = await this.serverRepository.getAllServerForMember(userId);
    await this.redisClient.set(key, JSON.stringify(allServer), {EX: 3600});
    return allServer;
  }
  async getAllMemberInMyServer(serverId: string, userId: string) {
    const key = this.redisKeys.GET_ALL_MEMBER_IN_MY_SERVER(serverId);
    const cachedAllMember = await this.redisClient.get(key);
    if (cachedAllMember) {
      return JSON.parse(cachedAllMember);
    }
    const server = await this.serverRepository.getServerById(serverId);
    if (!server) throw new Error('Server not found');
    const isUserInServer = await this.serverRepository.isUserInServer(serverId, userId);

    if (!isUserInServer) {
      throw new Error('User is not a member of this server');
    }
    const AllMember = await this.serverRepository.getAllMemberInMyServer(serverId);
    await this.redisClient.set(key, JSON.stringify(AllMember), {EX: 3600});
    return AllMember;
  }
  async getAllPublicServer(page: number, limit: number, search?: string) {
    const key = this.redisKeys.GET_ALL_PUBLIC_SERVER(page, limit, search);
    const cachedAllServer = await this.redisClient.get(key);
    if (cachedAllServer) {
      return JSON.parse(cachedAllServer);
    }
    const allServer = await this.serverRepository.getAllPublicServer(page, limit, search);
    await this.redisClient.set(key, JSON.stringify(allServer), {EX: 3600});
    return allServer;
  }
  async getNumberOfMembersInServer(serverId: string) {
    const key = this.redisKeys.GET_NUMBER_OF_MEMBERS_IN_SERVER(serverId);
    const cachedCount = await this.redisClient.get(key);
    if (cachedCount) {
      return JSON.parse(cachedCount);
    }
    const count = await this.serverRepository.getNumberOfMembersInServer(serverId);
    await this.redisClient.set(key, JSON.stringify(count), {EX: 3600});
    return count;
  }
  async createServer(userId: string, body: CreateServerDto, serverImage?: string) {
    const isServerExist = await this.serverRepository.getServerByName(body.name, userId);
    if (isServerExist) {
      throw new Error('A server with this name already exists');
    }
    const createServer = await this.serverRepository.createServer(userId, body, serverImage);
    await this.serverRepository.addUserToServer(userId, createServer.id, 'OWNER');
    // Add General Channel as Default Channel in New Server
    await this.channelRepository.createChannel({name: 'general', serverId: createServer.id, type: 'TEXT'});
    // invalid my Servers , all public servers
    // invalidate cache for the new server
    await this.redisClient.del(this.redisKeys.GET_ALL_SERVER_FOR_MEMBER(userId));
    if (createServer.isPublic) {
      await this.deleteByPattern(this.redisKeys.GET_ALL_PUBLIC_SERVER_PATTERN());
    }
    return createServer;
  }
  async addUserToServer(userId: string, serverId: string) {
    const isServerExist = await this.serverRepository.getServerById(serverId);
    if (!isServerExist) throw new Error('Server not found');
    if (!isServerExist.isPublic) throw new Error('Cannot add user to private server');
    const isUserInServer = await this.serverRepository.isUserInServer(serverId, userId);
    if (isUserInServer) {
      throw new Error('User is already a member of this server');
    }
    const addedUserToServer = await this.serverRepository.addUserToServer(userId, serverId, 'MEMBER');
    await this.redisClient.del(this.redisKeys.GET_ALL_MEMBER_IN_MY_SERVER(serverId));
    await this.redisClient.del(this.redisKeys.GET_ALL_SERVER_FOR_MEMBER(userId));
    if (isServerExist.isPublic) {
      await this.deleteByPattern(this.redisKeys.GET_ALL_PUBLIC_SERVER_PATTERN());
    }
    return addedUserToServer;
  }
  async generateInviteCode(userId: string, serverId: string, isMultiple: boolean = false) {
    const isServerExist = await this.serverRepository.getServerById(serverId);
    if (!isServerExist) throw new Error('Server not found');
    const isUserAdmin = await this.serverRepository.isUserIsAdminOrAdminOfServer(userId, serverId);
    if (!isUserAdmin) throw new Error('Only the server (admin| owner) can generate invite link');

    const isServerHasInviteCodeAvailable = await this.serverRepository.isServerHasInviteCodeAvailable(serverId, isMultiple);
    if (isServerHasInviteCodeAvailable) {
      return isServerHasInviteCodeAvailable;
    }
    const inviteCode = await this.serverRepository.generateInviteCode(serverId, isMultiple);
    return inviteCode;
  }
  async addUserToPrivateServerByInvite(userId: string, inviteCode: string, serverId: string) {
    const isServerExist = await this.serverRepository.getServerById(serverId);
    // check if user is Exist
    if (!isServerExist) throw new Error('Server not found');
    // get Invite By Sending InviteCode From User
    const invite = await this.serverRepository.getInviteCode(inviteCode, serverId);
    // check if invite is Exist
    if (!invite) throw new Error('Invite Not Exist');
    // check if invite is Expire
    const now = Temporal.Now.instant();
    if (Temporal.Instant.compare(invite.expiresAt, now) <= 0 || (invite.usedAt && Temporal.Instant.compare(invite.usedAt, now) <= 0)) {
      throw new Error('Invite code has expired');
    }
    // check if user is already in server
    const isUserInServer = await this.serverRepository.isUserInServer(serverId, userId);
    if (isUserInServer) {
      throw new Error('you are already a member of this server');
    }
    // Add User To Server
    const user = await this.serverRepository.addUserToServer(userId, serverId, 'MEMBER');
    // check if invite link is for single invite make it invalid
    if (!invite.isMultiple) {
      await this.serverRepository.inValidInvite(inviteCode);
    }
    await this.redisClient.del(this.redisKeys.GET_ALL_MEMBER_IN_MY_SERVER(serverId));
    await this.redisClient.del(this.redisKeys.GET_ALL_SERVER_FOR_MEMBER(userId));
    return user;
  }
  async editServer(userId: string, serverId: string, body: EditServerDto, serverImage?: string) {
    const server = await this.serverRepository.getServerById(serverId);
    if (!server) throw new Error('Server not found');
    const isUserAdmin = await this.serverRepository.isUserIsAdminOrAdminOfServer(userId, serverId);
    if (!isUserAdmin) throw new Error('Only the server (admin| owner) can edit this server');
    const editedServer = await this.serverRepository.editServer(serverId, body, serverImage);
    await this.redisClient.del(this.redisKeys.GET_ALL_SERVER_FOR_MEMBER(userId));
    await this.redisClient.del(this.redisKeys.GET_SERVER_BY_ID(serverId));
    await this.redisClient.del(this.redisKeys.GET_SERVER_BY_NAME(server.name));
    return editedServer;
  }
  async deleteServer(userId: string, serverId: string) {
    const server = await this.serverRepository.getServerById(serverId);
    if (!server) throw new Error('Server not found');
    const isUserIsAdminForThisServer = server.owner_id == userId;
    if (!isUserIsAdminForThisServer) throw new Error('Only the server Owner can delete this server');
    const deletedServer = await this.serverRepository.deleteServer(serverId);
    await this.redisClient.del(this.redisKeys.GET_ALL_SERVER_FOR_MEMBER(userId));
    await this.redisClient.del(this.redisKeys.GET_SERVER_BY_ID(serverId));
    await this.redisClient.del(this.redisKeys.GET_SERVER_BY_NAME(server.name));
    if (server.isPublic) {
      await this.deleteByPattern(this.redisKeys.GET_ALL_PUBLIC_SERVER_PATTERN());
    }
    return deletedServer;
  }
  async leaveUserFromServer(userId: string, serverId: string) {
    const serverMember = await this.serverRepository.isUserInServer(serverId, userId);
    if (!serverMember) throw new Error('User is not a member of this server');
    const isUserIsAdminForThisServer = serverMember.role == 'OWNER';
    if (isUserIsAdminForThisServer) throw new Error('Server owner cannot leave the server');
    const leaverServer = await this.serverRepository.leaveUserFromServer(serverId, userId);
    await this.redisClient.del(this.redisKeys.GET_ALL_MEMBER_IN_MY_SERVER(serverId));
    await this.redisClient.del(this.redisKeys.GET_ALL_SERVER_FOR_MEMBER(userId));
    await this.redisClient.del(this.redisKeys.GET_NUMBER_OF_MEMBERS_IN_SERVER(serverId));
    if (leaverServer?.server?.isPublic) {
      await this.deleteByPattern(this.redisKeys.GET_ALL_PUBLIC_SERVER_PATTERN());
    }

    return leaverServer;
  }
  async kickUserFromServer(userId: string, memberId: string, serverId: string) {
    const [serverUser, serverMember] = await Promise.all([this.serverRepository.isUserInServer(serverId, userId), this.serverRepository.isUserInServer(serverId, memberId)]);
    //  Check if user and member inside Server
    if (!serverUser) throw new Error('User is not a member of this server');
    if (!serverMember) throw new Error('Member is not in server');
    // Check if user is Admin or Owner and block member kicked
    const isUserAdmin = await this.serverRepository.isUserIsAdminOrAdminOfServer(userId, serverId);
    if (!isUserAdmin) throw new Error('Only server admins or owners can kick members');
    // Check if member who kicked is Owner
    const isUserIsAdminForThisServer = serverMember.role == 'OWNER';
    if (isUserIsAdminForThisServer) throw new Error('Server owner cannot be kicked');
    const leaverServer = await this.serverRepository.leaveUserFromServer(serverId, memberId);
    await this.redisClient.del(this.redisKeys.GET_ALL_MEMBER_IN_MY_SERVER(serverId));
    await this.redisClient.del(this.redisKeys.GET_ALL_SERVER_FOR_MEMBER(userId));
    await this.redisClient.del(this.redisKeys.GET_NUMBER_OF_MEMBERS_IN_SERVER(serverId));
    if (leaverServer?.server?.isPublic) {
      await this.deleteByPattern(this.redisKeys.GET_ALL_PUBLIC_SERVER_PATTERN());
    }
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
