import {RedisClientType, RedisDefaultModules} from 'redis';
import UserRepository from '../users/user.repository.js';
import {DirectMessageRepository} from './direct-message.repository.js';
import {MessageDto} from './dto/message-dto.dto.js';

export class DirectMessageService {
  private directMessageRepository: DirectMessageRepository;
  private userRepository: UserRepository;
  private redisKeys = {
    GET_ALL_DM_MEMBERS: (userId: string) => `dm:members:${userId}`,
    GET_ALL_MESSAGES: (userId: string, receiverId: string) => `dm:messages:${userId}:${receiverId}`
  };
  constructor(
    directMessageRepository: DirectMessageRepository,
    userRepository: UserRepository,
    private redisClient: RedisClientType<RedisDefaultModules, {}, {}, 3, {}>
  ) {
    this.directMessageRepository = directMessageRepository;
    this.userRepository = userRepository;
  }
  async getAllDMMembers(userId: string) {
    const key = this.redisKeys.GET_ALL_DM_MEMBERS(userId);
    const cachedMembers = await this.redisClient.get(key);
    if (cachedMembers) {
      return JSON.parse(cachedMembers);
    }
    const dmMembers = await this.directMessageRepository.getAllDMMembers(userId);
    await this.redisClient.set(key, JSON.stringify(dmMembers), {EX: 3600});
    return dmMembers;
  }
  async getAllMessages(userId: string, receiverUserName: string) {
    const key = this.redisKeys.GET_ALL_MESSAGES(userId, receiverUserName);
    const cachedMessages = await this.redisClient.get(key);
    if (cachedMessages) {
      return JSON.parse(cachedMessages);
    }
    const existReceiverUser = await this.userRepository.getUserByUserName(receiverUserName);
    if (!existReceiverUser) {
      throw new Error('Receiver user not found');
    }
    const allMessage = await this.directMessageRepository.getAllMessages(userId, existReceiverUser.id);
    await this.redisClient.set(key, JSON.stringify(allMessage), {EX: 3600});
    return allMessage;
  }
  async sendMessage(userId: string, receiverId: string, message: MessageDto, image?: string) {
    const existReceiverUser = await this.userRepository.getUserById(receiverId);
    const isSenderAndReceiverIsHasRelation = await this.directMessageRepository.isSenderAndReceiverIsHasRelation(userId, receiverId);
    if (!isSenderAndReceiverIsHasRelation) {
      await this.directMessageRepository.makeARelationBetweenSenderAndReceiver(userId, receiverId);
    }
    if (!existReceiverUser) {
      throw new Error('Receiver user not found');
    }
    const sendMessage = await this.directMessageRepository.sendMessage(userId, receiverId, message, image);
    await this.redisClient.del(this.redisKeys.GET_ALL_MESSAGES(userId, existReceiverUser.userName));
    return sendMessage;
  }
  async editMessage(userId: string, messageId: string, message: MessageDto) {
    const existMessage = await this.directMessageRepository.getMessageById(userId, messageId);
    if (!existMessage) {
      throw new Error('Message not found');
    }
    const editedMessage = await this.directMessageRepository.editMessage(userId, messageId, message);
    this.redisClient.del(this.redisKeys.GET_ALL_MESSAGES(existMessage.from, existMessage.to));
    return editedMessage;
  }
  async deleteMessage(userId: string, messageId: string) {
    const existMessage = await this.directMessageRepository.getMessageById(userId, messageId);
    if (!existMessage) {
      throw new Error('Message not found');
    }
    const deleteMessage = await this.directMessageRepository.deleteMessage(userId, messageId);
    await this.redisClient.del(this.redisKeys.GET_ALL_MESSAGES(existMessage.from, existMessage.to));
    return deleteMessage;
  }
}
