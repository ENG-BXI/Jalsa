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
  async getAllMessages(channelId: string) {
    const existChannel = await this.channelRepository.getChannelById(channelId);
    if (!existChannel) {
      throw new Error('Channel not found');
    }
    const allMessages = await this.channelMessageRepository.getAllMessage(channelId);
    return allMessages;
  }
  async sendMessage(userId: string, channelId: string, message: MessageDto) {
    const existChannel = await this.channelRepository.getChannelById(channelId);
    if (!existChannel) {
      throw new Error('Channel not found');
    }
    const sendedMessage = await this.channelMessageRepository.sendMessage(userId, channelId, message);
    return sendedMessage;
  }
  async editMessage(userId: string, channelId: string, messageId: string, message: MessageDto) {
    const existMessage = await this.channelMessageRepository.getMessageById(userId, messageId, channelId);
    if (!existMessage) throw new Error('Message not found');
    const existChannel = await this.channelRepository.getChannelById(channelId);
    if (!existChannel) {
      throw new Error('Channel not found');
    }
    const editedMessage = await this.channelMessageRepository.editMessage(userId, channelId, messageId, message);
    return editedMessage;
  }
  async deleteMessage(userId: string, channelId: string, messageId: string) {
    const existMessage = await this.channelMessageRepository.getMessageById(userId, messageId, channelId);
    if (!existMessage) throw new Error('Message not found');
    const existChannel = await this.channelRepository.getChannelById(channelId);
    if (!existChannel) {
      throw new Error('Channel not found');
    }
    const deletedMessage = await this.channelMessageRepository.deleteMessage(userId, channelId, messageId);
    return deletedMessage;
  }
}
