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
  async getAllDMMembers(userId: string) {
    const dmMembers = await this.directMessageRepository.getAllDMMembers(userId);
    return dmMembers;
  }
  async getAllMessages(userId: string, receiverUserName: string) {
    const existReceiverUser = await this.userRepository.getUserByUserName(receiverUserName);
    if (!existReceiverUser) {
      throw new Error('Receiver user not found');
    }
    const allMessage = await this.directMessageRepository.getAllMessages(userId, existReceiverUser.id);
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
    return sendMessage;
  }
  async editMessage(userId: string, messageId: string, message: MessageDto) {
    const existMessage = await this.directMessageRepository.getMessageById(userId, messageId);
    if (!existMessage) {
      throw new Error('Message not found');
    }
    const editedMessage = await this.directMessageRepository.editMessage(userId, messageId, message);
    return editedMessage;
  }
  async deleteMessage(userId: string, messageId: string) {
    const existMessage = await this.directMessageRepository.getMessageById(userId, messageId);
    if (!existMessage) {
      throw new Error('Message not found');
    }
    const deleteMessage = await this.directMessageRepository.deleteMessage(userId, messageId);
    return deleteMessage;
  }
}
