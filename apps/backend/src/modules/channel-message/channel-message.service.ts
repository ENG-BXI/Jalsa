import {RedisClientType, RedisDefaultModules} from 'redis';
import {ChannelRepository} from '../channel/channel.repository.js';
import {ChannelMessageRepository} from './channel-message.repository.js';
import {MessageDto} from './dto/message-dto.dto.js';

export class ChannelMessageService {
  private channelMessageRepository: ChannelMessageRepository;
  private channelRepository: ChannelRepository;
  private redisKeys = {
    GET_ALL_MESSAGES: (channelId: string) => `channel:${channelId}:messages`
  };
  constructor(
    channelMessageRepository: ChannelMessageRepository,
    channelRepository: ChannelRepository,
    private redisClient: RedisClientType<RedisDefaultModules, {}, {}, 3, {}>
  ) {
    this.channelMessageRepository = channelMessageRepository;
    this.channelRepository = channelRepository;
  }
  async getAllMessages(userId: string, channelId: string) {
    const key = this.redisKeys.GET_ALL_MESSAGES(channelId);
    const cachedMessages = await this.redisClient.get(key);
    if (cachedMessages) {
      return JSON.parse(cachedMessages);
    }
    const existChannel = await this.channelRepository.getChannelById(channelId);
    if (!existChannel) {
      throw new Error('Channel not found');
    }
    const isUserInServer = await this.channelRepository.isUserInServer(userId, existChannel.serverId);
    if (!isUserInServer) throw new Error('User is not a member of this server');
    const allMessages = await this.channelMessageRepository.getAllMessage(channelId);
    await this.redisClient.set(key, JSON.stringify(allMessages), {EX: 3600});
    return allMessages;
  }
  async sendMessage(userId: string, channelId: string, message: MessageDto, image?: string) {
    const existChannel = await this.channelRepository.getChannelById(channelId);
    if (!existChannel) {
      throw new Error('Channel not found');
    }
    const isUserInServer = await this.channelRepository.isUserInServer(userId, existChannel.serverId);
    if (!isUserInServer) throw new Error('User is not a member of this server');
    const sendedMessage = await this.channelMessageRepository.sendMessage(userId, channelId, message, image);
    await this.redisClient.del(this.redisKeys.GET_ALL_MESSAGES(channelId));
    return sendedMessage;
  }
  async editMessage(userId: string, channelId: string, messageId: string, message: MessageDto) {
    const existChannel = await this.channelRepository.getChannelById(channelId);
    if (!existChannel) {
      throw new Error('Channel not found');
    }
    const existMessage = await this.channelMessageRepository.getMessageById(userId, messageId, channelId);
    if (!existMessage) throw new Error('Message not found');
    const isUserInServer = await this.channelRepository.isUserInServer(userId, existChannel.serverId);
    if (!isUserInServer) throw new Error('User is not a member of this server');
    const editedMessage = await this.channelMessageRepository.editMessage(userId, channelId, messageId, message);
    await this.redisClient.del(this.redisKeys.GET_ALL_MESSAGES(channelId));
    return editedMessage;
  }
  async deleteMessage(userId: string, channelId: string, messageId: string) {
    const existChannel = await this.channelRepository.getChannelById(channelId);
    if (!existChannel) {
      throw new Error('Channel not found');
    }
    const existMessage = await this.channelMessageRepository.getMessageById(userId, messageId, channelId);
    if (!existMessage) throw new Error('Message not found');
    const isUserInServer = await this.channelRepository.isUserInServer(userId, existChannel.serverId);
    if (!isUserInServer) throw new Error('User is not a member of this server');
    const deletedMessage = await this.channelMessageRepository.deleteMessage(userId, channelId, messageId);
    await this.redisClient.del(this.redisKeys.GET_ALL_MESSAGES(channelId));
    return deletedMessage;
  }
}
