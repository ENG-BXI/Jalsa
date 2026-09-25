import type {PostgresClient} from '@prisma/orm-postgres/runtime';
import type {Contract} from '../../prisma/contract.d.ts';
import {MessageDto} from './dto/message-dto.dto.js';
import {and, or} from '@prisma/orm-postgres/orm-client';
import { Temporal } from 'temporal-polyfill';

export class DirectMessageRepository {
  private db: PostgresClient<Contract>;
  constructor(db: PostgresClient<Contract>) {
    this.db = db;
  }
  async getAllDMMembers(userId: string) {
    const dmMembers = await this.db.orm.public.DirectMassage.where(dm => or(dm.from.eq(userId), dm.to.eq(userId)))
      .include('fromUser', col => {
        return col.select('id', 'name');
      })
      .include('toUser', col => {
        return col.select('id', 'name');
      })
      .all();
    const contacts = dmMembers.map(dm => (dm.from === userId ? dm.toUser : dm.fromUser));
    return contacts;
  }
  async getAllMessages(userId: string, receiverId: string) {
    // TODO: add pagination here ....
    const allMessage = await this.db.orm.public.DirectMassage.where(message => or(and(message.from.eq(userId), message.to.eq(receiverId)), and(message.from.eq(receiverId), message.to.eq(userId))))
      .include('fromUser', c => {
        return c.select('id', 'name', 'userName');
      })
      .orderBy(u => u.createdAt.asc())
      .select('id', 'text', 'imageUrl', 'createdAt', 'updatedAt', 'softDelete')
      .all();
    const allMessageWithoutDeleteMessage = allMessage.map(message => {
      if (message.softDelete) {
        const {text, imageUrl, ...softMessage} = message;
        return softMessage;
      }
      return message;
    });
    return allMessageWithoutDeleteMessage;
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
    const editedMessage = await this.db.orm.public.DirectMassage.select('id', 'text').where({id: messageId, from: userId}).update({text: message.text, imageUrl: message.imageUrl, updatedAt: Temporal.Now.instant()});
    return editedMessage;
  }
  async deleteMessage(userId: string, messageId: string) {
    const deletedMessage = await this.db.orm.public.DirectMassage.select('id', 'text').where({id: messageId, from: userId}).update({softDelete: true});
    return deletedMessage;
  }
}
