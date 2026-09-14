import UserRepository from '../users/user.repository.js';
import {DirectMessageRepository} from './direct-message.repository.js';
import {MessageDto} from './dto/message-dto.dto.js';

export class DirectMessageService {
  private directMessageRepository: DirectMessageRepository;
  private userRepository: UserRepository;
  constructor(directMessageRepository: DirectMessageRepository, userRepository: UserRepository) {
    this.directMessageRepository = directMessageRepository;
    this.userRepository = userRepository;
  }
  async getAllMessages(userId: string, receiverId: string) {
    const [existUser, existReceiverUser] = await Promise.all([this.userRepository.getUserById(userId), this.userRepository.getUserById(receiverId)]);
    if (!existUser) {
      throw new Error('User not found');
    }
    if (!existReceiverUser) {
      throw new Error('Receiver user not found');
    }
    const allMessage = await this.directMessageRepository.getAllMessages(userId, receiverId);
    return allMessage;
  }
  async sendMessage(userId: string, receiverId: string, message: MessageDto) {
    const [existUser, existReceiverUser] = await Promise.all([this.userRepository.getUserById(userId), this.userRepository.getUserById(receiverId)]);
    if (!existUser) {
      throw new Error('User not found');
    }
    if (!existReceiverUser) {
      throw new Error('Receiver user not found');
    }
    const sendMessage = await this.directMessageRepository.sendMessage(userId, receiverId, message);
    return sendMessage;
  }
  async editMessage(userId: string, messageId: string, message: MessageDto) {
    const existUser = await this.userRepository.getUserById(userId);
    if (!existUser) {
      throw new Error('User not found');
    }
    const existMessage = await this.directMessageRepository.getMessageById(userId, messageId);
    if (!existMessage) {
      throw new Error('Message not found');
    }
    const editedMessage = await this.directMessageRepository.editMessage(userId, messageId, message);
    return editedMessage;
  }
  async deleteMessage(userId: string, messageId: string) {
    const existUser = await this.userRepository.getUserById(userId);
    if (!existUser) {
      throw new Error('User not found');
    }
    const existMessage = await this.directMessageRepository.getMessageById(userId, messageId);
    if (!existMessage) {
      throw new Error('Message not found');
    }
    const deleteMessage = await this.directMessageRepository.deleteMessage(userId, messageId);
    return deleteMessage;
  }
}
