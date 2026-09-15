import {PostgresClient} from '@prisma/orm-postgres/runtime';
import {Contract} from '../../prisma/contract.js';
import {MessageDto} from './dto/message-dto.dto.js';

export class ChannelMessageRepository {
  private db: PostgresClient<Contract>;
  constructor(db: PostgresClient<Contract>) {
    this.db = db;
  }
  async getAllMessage(channelId: string) {
    // TODO : add pagination here ....
    const allMessage = await this.db.orm.public.ChannelMassage.where({channelId}).all();
    const allMessageWithoutDeleteMessage = allMessage.map(message => {
      if (message.softDelete) {
        const {text, imageUrl, ...softMessage} = message;
        return softMessage;
      }
      return message;
    });
    return allMessageWithoutDeleteMessage;
  }
  async getMessageById(userId: string, messageId: string, channelId: string) {
    const message = await this.db.orm.public.ChannelMassage.where({from: userId, channelId, id: messageId}).first();
    return message;
  }
  async sendMessage(userId: string, channelId: string, message: MessageDto) {
    const sendedMessage = await this.db.orm.public.ChannelMassage.create({from: userId, channelId, text: message.text, imageUrl: message.imageUrl});
    return sendedMessage;
  }
  async editMessage(userId: string, channelId: string, messageId: string, message: MessageDto) {
    const editedMessage = await this.db.orm.public.ChannelMassage.where({from: userId, channelId, id: messageId}).update({text: message.text, imageUrl: message.imageUrl, updatedAt: Date.now()});
    return editedMessage;
  }
  async deleteMessage(userId: string, channelId: string, messageId: string) {
    const deletedMessage = await this.db.orm.public.ChannelMassage.where({from: userId, channelId, id: messageId}).delete();
    return deletedMessage;
  }
}
