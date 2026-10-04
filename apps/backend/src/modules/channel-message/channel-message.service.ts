import {deleteImage} from '../../lib/delete-image.js';
import {ChannelRepository} from '../channel/channel.repository.js';
import {ChannelMessageRepository} from './channel-message.repository.js';
import {MessageDto} from './dto/message-dto.dto.js';

export class ChannelMessageService {
  private channelMessageRepository: ChannelMessageRepository;
  private channelRepository: ChannelRepository;
  constructor(channelMessageRepository: ChannelMessageRepository, channelRepository: ChannelRepository) {
    this.channelMessageRepository = channelMessageRepository;
    this.channelRepository = channelRepository;
  }
  async getAllMessages(userId: string, channelId: string) {
    const existChannel = await this.channelRepository.getChannelById(channelId);
    if (!existChannel) {
      throw new Error('Channel not found');
    }
    const isUserInServer = await this.channelRepository.isUserInServer(userId, existChannel.serverId);
    if (!isUserInServer) throw new Error('User is not a member of this server');
    const allMessages = await this.channelMessageRepository.getAllMessage(channelId);
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
    return sendedMessage;
  }
  async editMessage(userId: string, channelId: string, messageId: string, message: MessageDto, image?: string) {
    const existChannel = await this.channelRepository.getChannelById(channelId);
    if (!existChannel) {
      throw new Error('Channel not found');
    }
    const existMessage = await this.channelMessageRepository.getMessageById(userId, messageId, channelId);
    if (!existMessage) throw new Error('Message not found');
    const isUserInServer = await this.channelRepository.isUserInServer(userId, existChannel.serverId);
    if (!isUserInServer) throw new Error('User is not a member of this server');
    const editedMessage = await this.channelMessageRepository.editMessage(userId, channelId, messageId, message, image);
    if (image !== existMessage.imageUrl && existMessage.imageUrl) {
      await deleteImage(existMessage.imageUrl);
    }
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
    return deletedMessage;
  }
}
