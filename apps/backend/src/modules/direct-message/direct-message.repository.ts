import type {PostgresClient} from '@prisma/orm-postgres/runtime';
import type {Contract} from '../../prisma/contract.d.ts';
import {MessageDto} from './dto/message-dto.dto.js';
import {and, or} from '@prisma/orm-postgres/orm-client';

export class DirectMessageRepository {
  private db: PostgresClient<Contract>;
  constructor(db: PostgresClient<Contract>) {
    this.db = db;
  }
  async getAllMessages(userId: string, receiverId: string) {
    const allMessage = await this.db.orm.public.DirectMassage.where(message =>
      or(
        and(message.from.eq(userId), message.to.eq(receiverId)),

        and(message.from.eq(receiverId), message.to.eq(userId))
      )
    ).all();
    return allMessage;
  }
  async getMessageById(userId: string, messageId: string) {
    const message = await this.db.orm.public.DirectMassage.where({id: messageId, from: userId}).first();
    return message;
  }
  async sendMessage(userId: string, receiverId: string, message: MessageDto) {
    const sendMassage = await this.db.orm.public.DirectMassage.select('id', 'text').create({text: message.text, imageUrl: message.imageUrl, from: userId, to: receiverId});
    return sendMassage;
  }
  async editMessage(userId: string, messageId: string, message: MessageDto) {
    const editedMessage = await this.db.orm.public.DirectMassage.select('id', 'text').where({id: messageId, from: userId}).update({text: message.text, imageUrl: message.imageUrl, updatedAt: Date.now()});
    return editedMessage;
  }
  async deleteMessage(userId: string, messageId: string) {
    const deletedMessage = await this.db.orm.public.DirectMassage.select('id', 'text').where({id: messageId, from: userId}).update({softDelete: true});
    return deletedMessage;
  }
}
