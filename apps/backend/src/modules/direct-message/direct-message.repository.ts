import type {PostgresClient} from '@prisma/orm-postgres/runtime';
import type {Contract} from '../../prisma/contract.d.ts';
import {MessageDto} from './dto/message-dto.dto.js';
import {and, or} from '@prisma/orm-postgres/orm-client';
import {Temporal} from 'temporal-polyfill';

export class DirectMessageRepository {
  private db: PostgresClient<Contract>;
  constructor(db: PostgresClient<Contract>) {
    this.db = db;
  }
  async isSenderAndReceiverIsHasRelation(senderId: string, receiverId: string) {
    const isHasRelation = await this.db.orm.public.DmMembers.where(col => or(and(col.senderId.eq(senderId), col.receiverId.eq(receiverId)), and(col.senderId.eq(receiverId), col.receiverId.eq(senderId)))).first();
    return !!isHasRelation;
  }
  async makeARelationBetweenSenderAndReceiver(senderId: string, receiverId: string) {
    return await this.db.orm.public.DmMembers.create({senderId, receiverId});
  }
  async getAllDMMembers(userId: string) {
    const dmMembers = await this.db.orm.public.DmMembers.where(col => or(col.senderId.eq(userId), col.receiverId.eq(userId)))
      .include('senderUser', col => col.select('id', 'name', 'userName'))
      .include('receiverUser', col => col.select('id', 'name', 'userName'))
      .select('senderId', 'receiverId')
      .all();
    const contacts = dmMembers.map(dm => (dm.senderId === userId ? dm.receiverUser : dm.senderUser));

    return contacts;
  }
  async getAllMessages(userId: string, receiverId: string) {
    // TODO: add pagination here ....
    const allMessage = await this.db.orm.public.DirectMassage.where(message => or(and(message.from.eq(userId), message.to.eq(receiverId)), and(message.from.eq(receiverId), message.to.eq(userId))))
      .include('fromUser', c => {
        return c.select('id', 'name', 'userName', 'jointAt');
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
  async sendMessage(userId: string, receiverId: string, message: MessageDto, image?: string) {
    const sendMassage = await this.db.orm.public.DirectMassage.include('fromUser', c => {
      return c.select('id', 'name', 'userName', 'jointAt');
    })
      .select('id', 'text', 'imageUrl', 'createdAt', 'updatedAt', 'softDelete')
      .create({text: message.text, imageUrl: image, from: userId, to: receiverId});
    return sendMassage;
  }
  async editMessage(userId: string, messageId: string, message: MessageDto) {
    const editedMessage = await this.db.orm.public.DirectMassage.select('id', 'text', 'updatedAt', 'to').where({id: messageId, from: userId}).update({text: message.text, updatedAt: Temporal.Now.instant()});
    return editedMessage;
  }
  async deleteMessage(userId: string, messageId: string) {
    const deletedMessage = await this.db.orm.public.DirectMassage.select('id', 'text', 'imageUrl', 'to').where({id: messageId, from: userId}).update({softDelete: true});
    return deletedMessage;
  }
}
