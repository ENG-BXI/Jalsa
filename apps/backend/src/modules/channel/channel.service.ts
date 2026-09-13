import {CreateChannelDto} from './dto/create-channel.dto.js';
import {EditChannelDto} from './dto/edit-channel.dto.js';
import {ChannelRepository} from './channel.repository.js';
import {ServerRepository} from '../server/server.repository.js';

export class ChannelService {
  constructor(
    private channelRepository: ChannelRepository,
    private serverRepository: ServerRepository
  ) {
    this.channelRepository = channelRepository;
    this.serverRepository = serverRepository;
  }

  async getChannelById(channelId: string) {
    const channel = await this.channelRepository.getChannelById(channelId);
    if (!channel) {
      throw new Error('Channel not found');
    }
    return channel;
  }

  async getAllChannelsInServer(serverId: string) {
    const channels = await this.channelRepository.getAllChannelsInServer(serverId);
    return channels;
  }

  async createChannel(userId: string, body: CreateChannelDto) {
    const server = await this.serverRepository.getServerById(body.serverId);
    if (!server) {
      throw new Error('Server not found');
    }
    const isAdmin = await this.serverRepository.isUserIsAdminOrAdminOfServer(userId, body.serverId);
    if (!isAdmin) {
      throw new Error('Only the server admin or owner can edit channels');
    }
    const existingChannel = await this.channelRepository.getChannelByName(body.serverId, body.name);
    if (existingChannel) {
      throw new Error('A channel with this name already exists');
    }

    const channel = await this.channelRepository.createChannel(body);
    return channel;
  }

  async editChannel(userId: string, serverId: string, channelId: string, body: EditChannelDto) {
    const server = await this.serverRepository.getServerById(serverId);
    if (!server) {
      throw new Error('Server not found');
    }
    const isAdmin = await this.serverRepository.isUserIsAdminOrAdminOfServer(userId, serverId);
    if (!isAdmin) {
      throw new Error('Only the server admin or owner can edit channels');
    }
    const channel = await this.channelRepository.getChannelById(channelId);
    if (!channel) {
      throw new Error('Channel not found');
    }
    if (channel.serverId !== serverId) {
      throw new Error('Channel does not belong to this server');
    }
    if (body.name) {
      const existingChannel = await this.channelRepository.getChannelByName(serverId, body.name);

      if (existingChannel && existingChannel.id !== channelId) {
        throw new Error('A channel with this name already exists');
      }
    }
    const editedChannel = await this.channelRepository.editChannel(serverId, channelId, body);
    return editedChannel;
  }

  async deleteChannel(userId: string, serverId: string, channelId: string) {
    const server = await this.serverRepository.getServerById(serverId);
    if (!server) {
      throw new Error('Server not found');
    }
    const isAdmin = await this.serverRepository.isUserIsAdminOrAdminOfServer(userId, serverId);
    if (!isAdmin) {
      throw new Error('Only the server admin or owner can edit channels');
    }
    const channel = await this.channelRepository.getChannelById(channelId);
    if (!channel) {
      throw new Error('Channel not found');
    }
    if (channel.serverId !== serverId) {
      throw new Error('Channel does not belong to this server');
    }
    const deletedChannel = await this.channelRepository.deleteChannel(channelId);
    return deletedChannel;
  }
}
